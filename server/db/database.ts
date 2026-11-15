import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { DEFAULT_ACADEMIC_SUBJECTS } from '../../src/data/roadmapData.ts';
import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '../../src/types/engineering.ts';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, 'postgres.schema.sql');

let sharedPool: pg.Pool | null = null;

function getPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing. Paste the Neon pooled connection string into .env and Vercel.');
  }
  if (!sharedPool) {
    sharedPool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return sharedPool;
}

export class InstrumentaDatabase {
  private pool = getPool();
  private ready: Promise<void>;

  constructor() {
    this.ready = this.init();
  }

  private async init() {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    await this.pool.query(schemaSql);
    await this.seedAcademicSubjects();
  }

  private async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  private async seedAcademicSubjects() {
    await this.pool.query("DELETE FROM academic_allocations WHERE is_custom = FALSE AND id NOT LIKE 'nitj-%'");
    for (const subject of DEFAULT_ACADEMIC_SUBJECTS) {
      await this.pool.query(
        `INSERT INTO academic_allocations
         (id, semester, code, name, credits, category, overview, completed, is_custom, units_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
         ON CONFLICT (id) DO NOTHING`,
        [
          subject.id,
          subject.semester,
          subject.code,
          subject.name,
          subject.credits,
          subject.category,
          subject.overview,
          subject.completed,
          subject.isCustom,
          JSON.stringify(subject.units),
        ],
      );
    }

    const seedVersion = await this.readPreference<string>('curriculum_seed_version');
    if (seedVersion === 'nitj-2025.06-four-subjects') return;
    for (const subject of DEFAULT_ACADEMIC_SUBJECTS) {
      await this.pool.query(
        `UPDATE academic_allocations
         SET semester = $1, code = $2, name = $3, credits = $4, category = $5,
             overview = $6, units_json = $7::jsonb, updated_at = NOW()
         WHERE id = $8 AND is_custom = FALSE`,
        [
          subject.semester,
          subject.code,
          subject.name,
          subject.credits,
          subject.category,
          subject.overview,
          JSON.stringify(subject.units),
          subject.id,
        ],
      );
    }
    await this.writePreference('curriculum_seed_version', 'nitj-2025.06-four-subjects');
  }

  async listBookmarks(): Promise<BookmarkItem[]> {
    await this.ready;
    const rows = await this.query<{
      id: string;
      item_type: BookmarkItem['itemType'];
      title: string;
      subtitle: string;
      route: string;
      created_at: string;
    }>('SELECT id, item_type, title, subtitle, route, created_at FROM bookmarks ORDER BY created_at DESC');
    return rows.map((row) => ({
      id: row.id,
      itemType: row.item_type,
      title: row.title,
      subtitle: row.subtitle,
      route: row.route,
      createdAt: row.created_at,
    }));
  }

  async upsertBookmark(item: Omit<BookmarkItem, 'createdAt'>): Promise<BookmarkItem[]> {
    await this.ready;
    await this.pool.query(
      `INSERT INTO bookmarks (id, item_type, title, subtitle, route)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, route = EXCLUDED.route`,
      [item.id, item.itemType, item.title, item.subtitle, item.route],
    );
    return this.listBookmarks();
  }

  async deleteBookmark(id: string): Promise<BookmarkItem[]> {
    await this.ready;
    await this.pool.query('DELETE FROM bookmarks WHERE id = $1', [id]);
    return this.listBookmarks();
  }

  async listAcademicSubjects(): Promise<AcademicSubject[]> {
    await this.ready;
    const rows = await this.query<{
      id: string;
      semester: number;
      code: string;
      name: string;
      credits: number;
      category: AcademicSubject['category'];
      overview: string;
      completed: boolean;
      is_custom: boolean;
      units_json: AcademicSubject['units'] | string;
    }>(
      `SELECT id, semester, code, name, credits, category, overview, completed, is_custom, units_json
       FROM academic_allocations ORDER BY semester ASC, code ASC`,
    );
    return rows.map((row) => ({
      id: row.id,
      semester: row.semester,
      code: row.code,
      name: row.name,
      credits: row.credits,
      category: row.category,
      overview: row.overview,
      completed: Boolean(row.completed),
      isCustom: Boolean(row.is_custom),
      units: typeof row.units_json === 'string' ? JSON.parse(row.units_json) : row.units_json,
    }));
  }

  async upsertAcademicSubject(subject: AcademicSubject): Promise<AcademicSubject[]> {
    await this.ready;
    await this.pool.query(
      `INSERT INTO academic_allocations
       (id, semester, code, name, credits, category, overview, completed, is_custom, units_json, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET
         semester = EXCLUDED.semester,
         code = EXCLUDED.code,
         name = EXCLUDED.name,
         credits = EXCLUDED.credits,
         category = EXCLUDED.category,
         overview = EXCLUDED.overview,
         completed = EXCLUDED.completed,
         is_custom = EXCLUDED.is_custom,
         units_json = EXCLUDED.units_json,
         updated_at = NOW()`,
      [
        subject.id,
        subject.semester,
        subject.code,
        subject.name,
        subject.credits,
        subject.category,
        subject.overview,
        subject.completed,
        subject.isCustom,
        JSON.stringify(subject.units),
      ],
    );
    return this.listAcademicSubjects();
  }

  async deleteAcademicSubject(id: string): Promise<AcademicSubject[]> {
    await this.ready;
    await this.pool.query('DELETE FROM academic_allocations WHERE id = $1', [id]);
    return this.listAcademicSubjects();
  }

  async resetAcademicSubjects(): Promise<AcademicSubject[]> {
    await this.ready;
    await this.pool.query('DELETE FROM academic_allocations');
    await this.seedAcademicSubjects();
    return this.listAcademicSubjects();
  }

  async listQuestionAttempts(): Promise<QuestionAttempt[]> {
    await this.ready;
    const rows = await this.query<{
      question_id: string;
      is_correct: boolean;
      selected_option: number | null;
      user_numeric_answer: number | null;
      answered_at: string;
    }>('SELECT question_id, is_correct, selected_option, user_numeric_answer, answered_at FROM question_attempts');
    return rows.map((row) => ({
      questionId: row.question_id,
      isCorrect: Boolean(row.is_correct),
      selectedOption: row.selected_option ?? undefined,
      userNumericAnswer: row.user_numeric_answer ?? undefined,
      answeredAt: row.answered_at,
    }));
  }

  async upsertQuestionAttempt(attempt: Omit<QuestionAttempt, 'answeredAt'>): Promise<QuestionAttempt[]> {
    await this.ready;
    await this.pool.query(
      `INSERT INTO question_attempts (question_id, is_correct, selected_option, user_numeric_answer, answered_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (question_id) DO UPDATE SET
         is_correct = EXCLUDED.is_correct,
         selected_option = EXCLUDED.selected_option,
         user_numeric_answer = EXCLUDED.user_numeric_answer,
         answered_at = NOW()`,
      [attempt.questionId, attempt.isCorrect, attempt.selectedOption ?? null, attempt.userNumericAnswer ?? null],
    );
    return this.listQuestionAttempts();
  }

  async clearQuestionAttempts(): Promise<QuestionAttempt[]> {
    await this.ready;
    await this.pool.query('DELETE FROM question_attempts');
    return [];
  }

  private async readPreference<T>(key: string): Promise<T | null> {
    const rows = await this.query<{ value_json: T | string }>('SELECT value_json FROM preferences WHERE key = $1', [key]);
    const value = rows[0]?.value_json;
    if (value == null) return null;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return value;
  }

  private async writePreference<T>(key: string, value: T): Promise<void> {
    await this.pool.query(
      `INSERT INTO preferences (key, value_json, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json, updated_at = NOW()`,
      [key, JSON.stringify(value)],
    );
  }

  async getPreference<T = unknown>(key: string): Promise<T | null> {
    await this.ready;
    return this.readPreference<T>(key);
  }

  async setPreference<T = unknown>(key: string, value: T): Promise<T> {
    await this.ready;
    await this.writePreference(key, value);
    return value;
  }

  async createSuggestion(input: {
    name: string;
    family: string;
    reason: string;
    link?: string;
    contactName?: string;
    contactEmail?: string;
  }) {
    await this.ready;
    const rows = await this.query<{
      id: number;
      name: string;
      family: string;
      reason: string;
      link: string;
      contact_name: string;
      contact_email: string;
      status: string;
      created_at: string;
    }>(
      `INSERT INTO suggestions (name, family, reason, link, contact_name, contact_email, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING id, name, family, reason, link, contact_name, contact_email, status, created_at`,
      [input.name, input.family, input.reason, input.link ?? '', input.contactName ?? '', input.contactEmail ?? ''],
    );
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      family: row.family,
      reason: row.reason,
      link: row.link,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  async listSuggestions() {
    await this.ready;
    const rows = await this.query<{
      id: number;
      name: string;
      family: string;
      reason: string;
      link: string;
      contact_name: string;
      contact_email: string;
      status: string;
      created_at: string;
    }>(
      'SELECT id, name, family, reason, link, contact_name, contact_email, status, created_at FROM suggestions ORDER BY created_at DESC, id DESC',
    );
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      family: row.family,
      reason: row.reason,
      link: row.link,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      status: row.status,
      createdAt: row.created_at,
    }));
  }

  async upsertUser(user: { id: string; email: string; name: string; picture: string }): Promise<void> {
    await this.ready;
    await this.pool.query(
      `INSERT INTO users (id, email, name, picture)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         name = EXCLUDED.name,
         picture = EXCLUDED.picture,
         last_seen_at = NOW()`,
      [user.id, user.email, user.name, user.picture],
    );
  }

  async countUsers(): Promise<number> {
    await this.ready;
    const rows = await this.query<{ n: string }>('SELECT COUNT(*)::int AS n FROM users');
    return Number(rows[0]?.n ?? 0);
  }

  async listUsers(): Promise<
    Array<{ id: string; email: string; name: string; picture: string; createdAt: string; lastSeenAt: string }>
  > {
    await this.ready;
    const rows = await this.query<{
      id: string;
      email: string;
      name: string;
      picture: string;
      created_at: string;
      last_seen_at: string;
    }>('SELECT id, email, name, picture, created_at, last_seen_at FROM users ORDER BY last_seen_at DESC');
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      picture: row.picture,
      createdAt: row.created_at,
      lastSeenAt: row.last_seen_at,
    }));
  }
}
