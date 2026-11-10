import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_ACADEMIC_SUBJECTS } from '../../src/data/roadmapData.ts';
import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '../../src/types/engineering.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'instrumenta.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

export class InstrumentaDatabase {
  private db: DatabaseSync;

  constructor() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    this.db = new DatabaseSync(DB_PATH);
    this.db.exec('PRAGMA journal_mode = WAL;');
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    this.db.exec(schemaSql);
    this.seedAcademicSubjectsIfEmpty();
  }

  private seedAcademicSubjectsIfEmpty() {
    // Migrate legacy pre-NITJ uncustomized seed rows while keeping custom entries and nitj-* edits intact
    this.db
      .prepare("DELETE FROM academic_allocations WHERE is_custom = 0 AND id NOT LIKE 'nitj-%'")
      .run();

    const insert = this.db.prepare(`
      INSERT OR IGNORE INTO academic_allocations
      (id, semester, code, name, credits, category, overview, completed, is_custom, units_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of DEFAULT_ACADEMIC_SUBJECTS) {
      insert.run(
        s.id,
        s.semester,
        s.code,
        s.name,
        s.credits,
        s.category,
        s.overview,
        s.completed ? 1 : 0,
        s.isCustom ? 1 : 0,
        JSON.stringify(s.units),
      );
    }
  }

  // Bookmarks
  listBookmarks(): BookmarkItem[] {
    const rows = this.db
      .prepare('SELECT id, item_type, title, subtitle, route, created_at FROM bookmarks ORDER BY created_at DESC')
      .all() as Array<{
      id: string;
      item_type: BookmarkItem['itemType'];
      title: string;
      subtitle: string;
      route: string;
      created_at: string;
    }>;
    return rows.map((r) => ({
      id: r.id,
      itemType: r.item_type,
      title: r.title,
      subtitle: r.subtitle,
      route: r.route,
      createdAt: r.created_at,
    }));
  }

  upsertBookmark(item: Omit<BookmarkItem, 'createdAt'>): BookmarkItem[] {
    this.db
      .prepare(`
        INSERT INTO bookmarks (id, item_type, title, subtitle, route)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET title = excluded.title, subtitle = excluded.subtitle, route = excluded.route
      `)
      .run(item.id, item.itemType, item.title, item.subtitle, item.route);
    return this.listBookmarks();
  }

  deleteBookmark(id: string): BookmarkItem[] {
    this.db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
    return this.listBookmarks();
  }

  // Academic Roadmap Editable Allocations
  listAcademicSubjects(): AcademicSubject[] {
    const rows = this.db
      .prepare(`
        SELECT id, semester, code, name, credits, category, overview, completed, is_custom, units_json
        FROM academic_allocations
        ORDER BY semester ASC, code ASC
      `)
      .all() as Array<{
      id: string;
      semester: number;
      code: string;
      name: string;
      credits: number;
      category: AcademicSubject['category'];
      overview: string;
      completed: number;
      is_custom: number;
      units_json: string;
    }>;

    return rows.map((r) => ({
      id: r.id,
      semester: r.semester,
      code: r.code,
      name: r.name,
      credits: r.credits,
      category: r.category,
      overview: r.overview,
      completed: Boolean(r.completed),
      isCustom: Boolean(r.is_custom),
      units: JSON.parse(r.units_json),
    }));
  }

  upsertAcademicSubject(subject: AcademicSubject): AcademicSubject[] {
    this.db
      .prepare(`
        INSERT INTO academic_allocations
        (id, semester, code, name, credits, category, overview, completed, is_custom, units_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          semester = excluded.semester,
          code = excluded.code,
          name = excluded.name,
          credits = excluded.credits,
          category = excluded.category,
          overview = excluded.overview,
          completed = excluded.completed,
          is_custom = excluded.is_custom,
          units_json = excluded.units_json,
          updated_at = datetime('now')
      `)
      .run(
        subject.id,
        subject.semester,
        subject.code,
        subject.name,
        subject.credits,
        subject.category,
        subject.overview,
        subject.completed ? 1 : 0,
        subject.isCustom ? 1 : 0,
        JSON.stringify(subject.units),
      );
    return this.listAcademicSubjects();
  }

  deleteAcademicSubject(id: string): AcademicSubject[] {
    this.db.prepare('DELETE FROM academic_allocations WHERE id = ?').run(id);
    return this.listAcademicSubjects();
  }

  resetAcademicSubjects(): AcademicSubject[] {
    this.db.exec('DELETE FROM academic_allocations');
    this.seedAcademicSubjectsIfEmpty();
    return this.listAcademicSubjects();
  }

  // Interview Question Attempts & Progress
  listQuestionAttempts(): QuestionAttempt[] {
    const rows = this.db
      .prepare('SELECT question_id, is_correct, selected_option, user_numeric_answer, answered_at FROM question_attempts')
      .all() as Array<{
      question_id: string;
      is_correct: number;
      selected_option: number | null;
      user_numeric_answer: number | null;
      answered_at: string;
    }>;

    return rows.map((r) => ({
      questionId: r.question_id,
      isCorrect: Boolean(r.is_correct),
      selectedOption: r.selected_option ?? undefined,
      userNumericAnswer: r.user_numeric_answer ?? undefined,
      answeredAt: r.answered_at,
    }));
  }

  upsertQuestionAttempt(attempt: Omit<QuestionAttempt, 'answeredAt'>): QuestionAttempt[] {
    this.db
      .prepare(`
        INSERT INTO question_attempts (question_id, is_correct, selected_option, user_numeric_answer, answered_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(question_id) DO UPDATE SET
          is_correct = excluded.is_correct,
          selected_option = excluded.selected_option,
          user_numeric_answer = excluded.user_numeric_answer,
          answered_at = datetime('now')
      `)
      .run(
        attempt.questionId,
        attempt.isCorrect ? 1 : 0,
        attempt.selectedOption ?? null,
        attempt.userNumericAnswer ?? null,
      );
    return this.listQuestionAttempts();
  }

  clearQuestionAttempts(): QuestionAttempt[] {
    this.db.exec('DELETE FROM question_attempts');
    return [];
  }
}

