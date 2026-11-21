import { getSubjectsForSemesterTab, NITJ_CURRICULUM_SUBJECTS } from '@/data/curriculum';
import type { ConceptDetail, CurriculumSubjectDetail, CurriculumUnitDetail } from '@/types/curriculum';

export type QuizSemester = number | 'additional';

export interface QuizzySemester {
  key: QuizSemester;
  label: string;
  subjectCount: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  fullAnswer: string;
  excerpt: string;
  unitNumber: number;
  unitTitle: string;
  topicTitle: string;
  kindLabel: string;
}

const QUIZ_LENGTH = 10;

const SEMESTER_ORDER: QuizSemester[] = [1, 2, 3, 4, 5, 'additional'];

const SEMESTER_LABEL: Record<string, string> = {
  1: 'Semester I',
  2: 'Semester II',
  3: 'Semester III',
  4: 'Semester IV',
  5: 'Semester V',
  additional: 'Additional',
};

type FactKind =
  | 'interview'
  | 'numerical'
  | 'cloze'
  | 'comparison'
  | 'advantage'
  | 'limitation'
  | 'troubleshooting'
  | 'output'
  | 'claim';

interface Fact {
  id: string;
  topicId: string;
  subjectId: string;
  unitNumber: number;
  unitTitle: string;
  topicTitle: string;
  kind: FactKind;
  priority: number;
  prompt: string;
  answer: string;
  optionAnswer: string;
  excerpt: string;
  otherTopicOnly: boolean;
  clozeOptions?: string[];
}

const KIND_LABEL: Record<FactKind, string> = {
  interview: 'Interview note',
  numerical: 'Worked numerical',
  cloze: 'Line from the notes',
  comparison: 'Comparison note',
  advantage: 'Advantage in the notes',
  limitation: 'Limitation in the notes',
  troubleshooting: 'Troubleshooting note',
  output: 'Input and output',
  claim: 'Syllabus note',
};

const TOKEN =
  /\b\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?(?:\s*(?:°C|°F|%|mV\/V|mA|mV|kHz|Hz|kΩ|Ω|mm|cm|bar|psig|psi|V|ms|min|bits|bit|dB|s))?(?!\d)/g;

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function clip(value: string, max: number): string {
  const text = clean(value);
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const space = slice.lastIndexOf(' ');
  return `${(space > 60 ? slice.slice(0, space) : slice).trim()}…`;
}

function optionText(answer: string): string {
  const text = clean(answer);
  if (text.length <= 200) return text;
  const sentence = text.match(/^(.{40,180}?[.!?])(?:\s|$)/);
  if (sentence) return sentence[1];
  return clip(text, 180);
}

function passage(value: string, max = 720): string {
  const text = value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const stop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('\n'));
  if (stop > 180) return slice.slice(0, stop + 1).trim();
  return `${slice.trim()}…`;
}

function sentences(value: string): string[] {
  return clean(value)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 48 && sentence.length <= 320);
}

function claimScore(sentence: string): number {
  let score = 0;
  if (/\d/.test(sentence)) score += 3;
  if (/\b(is|are|equals|requires|means|called|defined|measures)\b/i.test(sentence)) score += 2;
  if (sentence.length >= 70 && sentence.length <= 220) score += 2;
  if (/\b(never|always|only|must|not)\b/i.test(sentence)) score += 1;
  return score;
}

function tokens(value: string): Set<string> {
  return new Set(
    clean(value)
      .toLowerCase()
      .replace(/[^a-z0-9%°+./-]+/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1),
  );
}

function containsTerm(haystack: string, needle: string): boolean {
  if (needle.length < 2 || haystack.length <= needle.length) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, 'i').test(haystack);
}

function tooSimilar(a: string, b: string): boolean {
  const left = clean(a).toLowerCase();
  const right = clean(b).toLowerCase();
  if (!left || !right || left === right) return true;
  if (containsTerm(left, right) || containsTerm(right, left)) return true;
  if (left.length > 24 && right.length > 24 && (left.includes(right) || right.includes(left))) return true;
  const aTokens = tokens(left);
  const bTokens = tokens(right);
  if (aTokens.size === 0 || bTokens.size === 0) return false;
  let shared = 0;
  for (const token of aTokens) if (bTokens.has(token)) shared += 1;
  const union = aTokens.size + bTokens.size - shared;
  return union > 0 && shared / union >= 0.7;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const next = items.slice();
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

function usefulToken(token: string): boolean {
  const compact = token.trim();
  if (/^0\d/.test(compact)) return false;
  if (/[–\-.]/.test(compact) || /[a-zA-Z%°Ω]/.test(compact)) return true;
  return compact.replace(/\D/g, '').length >= 2;
}

function unitKey(token: string): string {
  const match = token
    .trim()
    .match(/(°C|°F|%|mV\/V|mA|mV|kHz|Hz|kΩ|Ω|mm|cm|bar|psig|psi|V|ms|min|bits|bit|dB|s)$/i);
  if (!match) return '';
  const unit = match[1].toLowerCase();
  if (unit === 'bits') return 'bit';
  return unit;
}

function clozeChoices(answer: string, pool: string[]): string[] {
  const unit = unitKey(answer);
  return pool.filter((token) => unitKey(token) === unit);
}

function numberTokens(value: string): string[] {
  const found = clean(value).match(TOKEN) ?? [];
  const unique: string[] = [];
  for (const token of found) {
    const trimmed = token.trim();
    if (!usefulToken(trimmed)) continue;
    if (unique.some((item) => item.toLowerCase() === trimmed.toLowerCase())) continue;
    unique.push(trimmed);
  }
  return unique;
}

function blankToken(sentence: string, token: string): string {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return sentence.replace(new RegExp(escaped, 'g'), '____');
}

function bestSentence(topic: ConceptDetail): string | null {
  const pool = [...sentences(topic.explanation), ...sentences(topic.workingPrinciple)];
  if (pool.length === 0) {
    const summary = clean(topic.summary);
    return summary.length >= 40 ? summary : null;
  }
  return pool.slice().sort((a, b) => claimScore(b) - claimScore(a) || b.length - a.length)[0] ?? null;
}

function topicBlob(topic: ConceptDetail): string {
  return [
    topic.summary,
    topic.explanation,
    topic.workingPrinciple,
    topic.inputOutput?.input,
    topic.inputOutput?.output,
    topic.comparison?.takeaway,
    ...(topic.advantages ?? []),
    ...(topic.limitations ?? []),
    ...(topic.troubleshooting ?? []),
  ]
    .filter(Boolean)
    .join(' ');
}

interface TopicRef {
  subject: CurriculumSubjectDetail;
  unit: CurriculumUnitDetail;
  topic: ConceptDetail;
}

function eachTopic(
  subjects: CurriculumSubjectDetail[],
  topicIds: 'all' | string[] | null,
): TopicRef[] {
  const allowed = topicIds === 'all' || topicIds === null ? null : new Set(topicIds);
  const refs: TopicRef[] = [];
  for (const subject of subjects) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        if (allowed && !allowed.has(topic.id)) continue;
        refs.push({ subject, unit, topic });
      }
    }
  }
  return refs;
}

function pushFact(facts: Fact[], fact: Omit<Fact, 'optionAnswer'> & { optionAnswer?: string }): void {
  const answer = clean(fact.answer);
  const prompt = clean(fact.prompt);
  if (!answer || !prompt) return;
  facts.push({
    ...fact,
    answer,
    prompt,
    optionAnswer: fact.optionAnswer ? clean(fact.optionAnswer) : optionText(answer),
  });
}

function factsFromTopics(refs: TopicRef[], tokenPool: string[], includeCloze: boolean): Fact[] {
  const facts: Fact[] = [];

  for (const { subject, unit, topic } of refs) {
    const base = {
      topicId: topic.id,
      subjectId: subject.id,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      topicTitle: topic.title,
    };

    (topic.interviewItems ?? []).forEach((item, index) => {
      pushFact(facts, {
        ...base,
        id: `${topic.id}:interview:${index}`,
        kind: 'interview',
        priority: 0,
        prompt: item.question,
        answer: item.answer,
        excerpt: clean(item.answer),
        otherTopicOnly: false,
      });
    });

    (topic.numericals ?? []).forEach((item, index) => {
      pushFact(facts, {
        ...base,
        id: `${topic.id}:numerical:${index}`,
        kind: 'numerical',
        priority: 1,
        prompt: item.problem,
        answer: item.result,
        excerpt: [item.problem, ...item.steps, `Result: ${item.result}`].join('\n'),
        otherTopicOnly: false,
      });
    });

    const clozeSource = [...sentences(topic.explanation), ...sentences(topic.workingPrinciple)]
      .map((sentence) => ({ sentence, token: numberTokens(sentence)[0] }))
      .filter((item): item is { sentence: string; token: string } => Boolean(item.token))
      .sort((a, b) => claimScore(b.sentence) - claimScore(a.sentence))[0];

    if (includeCloze && clozeSource) {
      const distractors = clozeChoices(
        clozeSource.token,
        tokenPool.filter(
          (token) =>
            token.toLowerCase() !== clozeSource.token.toLowerCase() &&
            !clozeSource.sentence.toLowerCase().includes(token.toLowerCase()),
        ),
      );
      if (distractors.length >= 3) {
        pushFact(facts, {
          ...base,
          id: `${topic.id}:cloze`,
          kind: 'cloze',
          priority: 2,
          prompt: blankToken(clozeSource.sentence, clozeSource.token),
          answer: clozeSource.token,
          optionAnswer: clozeSource.token,
          excerpt: passage(
            topic.explanation.toLowerCase().includes(clozeSource.token.toLowerCase())
              ? topic.explanation
              : topic.workingPrinciple,
          ),
          otherTopicOnly: true,
          clozeOptions: distractors,
        });
      }
    }

    if (topic.comparison?.takeaway) {
      pushFact(facts, {
        ...base,
        id: `${topic.id}:comparison`,
        kind: 'comparison',
        priority: 3,
        prompt: `In the notes for “${topic.title}”, what is the stated difference versus ${topic.comparison.peer}?`,
        answer: topic.comparison.takeaway,
        excerpt: clean(topic.comparison.takeaway),
        otherTopicOnly: true,
      });
    }

    if (topic.advantages?.[0]) {
      pushFact(facts, {
        ...base,
        id: `${topic.id}:advantage`,
        kind: 'advantage',
        priority: 4,
        prompt: `Which advantage is written in the notes for “${topic.title}”?`,
        answer: topic.advantages[0],
        excerpt: passage(topic.advantages.map((line) => `• ${line}`).join('\n')),
        otherTopicOnly: true,
      });
    }

    if (topic.limitations?.[0]) {
      pushFact(facts, {
        ...base,
        id: `${topic.id}:limitation`,
        kind: 'limitation',
        priority: 5,
        prompt: `Which limitation is written in the notes for “${topic.title}”?`,
        answer: topic.limitations[0],
        excerpt: passage(topic.limitations.map((line) => `• ${line}`).join('\n')),
        otherTopicOnly: true,
      });
    }

    if (topic.troubleshooting?.[0]) {
      pushFact(facts, {
        ...base,
        id: `${topic.id}:troubleshooting`,
        kind: 'troubleshooting',
        priority: 6,
        prompt: `Which troubleshooting point is written for “${topic.title}”?`,
        answer: topic.troubleshooting[0],
        excerpt: passage(topic.troubleshooting.map((line) => `• ${line}`).join('\n')),
        otherTopicOnly: true,
      });
    }

    if (topic.inputOutput?.output) {
      const input = topic.inputOutput.input ? `Input: ${topic.inputOutput.input}. ` : '';
      pushFact(facts, {
        ...base,
        id: `${topic.id}:output`,
        kind: 'output',
        priority: 7,
        prompt: `What output do the syllabus notes assign to “${topic.title}”?`,
        answer: topic.inputOutput.output,
        excerpt: `${input}Output: ${topic.inputOutput.output}.`,
        otherTopicOnly: true,
      });
    }

    const claim = bestSentence(topic);
    if (claim) {
      const fromExplanation = clean(topic.explanation).includes(claim.slice(0, 40));
      pushFact(facts, {
        ...base,
        id: `${topic.id}:claim`,
        kind: 'claim',
        priority: 8,
        prompt: `Which of these is stated in the syllabus notes for “${topic.title}”?`,
        answer: claim,
        excerpt: passage(fromExplanation ? topic.explanation : topic.workingPrinciple || topic.explanation),
        otherTopicOnly: true,
      });
    }
  }

  return facts;
}

function firstTriple(items: string[]): string[] | null {
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (tooSimilar(items[i], items[j])) continue;
      for (let k = j + 1; k < items.length; k += 1) {
        if (tooSimilar(items[i], items[k]) || tooSimilar(items[j], items[k])) continue;
        return [items[i], items[j], items[k]];
      }
    }
  }
  return null;
}

function pickFrom(items: string[], rng: () => number): string[] | null {
  if (items.length < 3) return null;
  return firstTriple(shuffle(items, rng));
}

function chooseDistractors(fact: Fact, pool: Fact[], rng: () => number): string[] | null {
  if (fact.kind === 'cloze') return pickFrom(fact.clozeOptions ?? [], rng);

  const near: string[] = [];
  const far: string[] = [];
  const seen = new Set<string>();
  const ranked = pool
    .filter((other) => other.id !== fact.id && other.kind === fact.kind)
    .sort((a, b) => (a.id < b.id ? -1 : 1));

  for (const other of ranked) {
    if (fact.otherTopicOnly && other.topicId === fact.topicId && other.subjectId === fact.subjectId) continue;
    const text = optionText(other.answer);
    const key = clean(text).toLowerCase();
    if (!text || seen.has(key) || tooSimilar(text, fact.optionAnswer)) continue;
    seen.add(key);
    if (other.subjectId === fact.subjectId) near.push(text);
    else far.push(text);
  }

  const local = pickFrom(near, rng);
  if (local) return local;
  if (fact.kind === 'claim') return pickFrom([...near, ...far], rng);
  return null;
}

function hasDistractors(fact: Fact, pool: Fact[]): boolean {
  return chooseDistractors(fact, pool, mulberry32(1)) !== null;
}

function roundRobin(facts: Fact[], rng: () => number): Fact[] {
  const byTopic = new Map<string, Fact[]>();
  for (const fact of facts) {
    const list = byTopic.get(fact.topicId) ?? [];
    list.push(fact);
    byTopic.set(fact.topicId, list);
  }
  for (const list of byTopic.values()) {
    list.sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : 1));
  }
  const topicIds = shuffle([...byTopic.keys()], rng);
  const ordered: Fact[] = [];
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const topicId of topicIds) {
      const list = byTopic.get(topicId);
      const next = list?.shift();
      if (!next) continue;
      ordered.push(next);
      progressed = true;
    }
  }
  return ordered;
}

function toQuestion(fact: Fact, pool: Fact[], rng: () => number, index: number): QuizQuestion | null {
  const distractors = chooseDistractors(fact, pool, rng);
  if (!distractors) return null;
  const options = shuffle([fact.optionAnswer, ...distractors], rng);
  const correctIndex = options.indexOf(fact.optionAnswer);
  if (correctIndex < 0) return null;
  return {
    id: `${fact.id}:${index}`,
    prompt: fact.prompt,
    options,
    correctIndex,
    fullAnswer: fact.answer,
    excerpt: fact.excerpt,
    unitNumber: fact.unitNumber,
    unitTitle: fact.unitTitle,
    topicTitle: fact.topicTitle,
    kindLabel: KIND_LABEL[fact.kind],
  };
}

export function listQuizzySemesters(): QuizzySemester[] {
  return SEMESTER_ORDER.flatMap((key) => {
    const subjects = getSubjectsForSemesterTab(key);
    if (subjects.length === 0) return [];
    return [
      {
        key,
        label: SEMESTER_LABEL[String(key)] ?? subjects[0].displaySemesterLabel,
        subjectCount: subjects.length,
      },
    ];
  });
}

function selectedTopicIds(topicIds: 'all' | string[]): 'all' | string[] {
  return topicIds === 'all' ? 'all' : topicIds.filter(Boolean);
}

function poolsFor(subject: CurriculumSubjectDetail, topicIds: 'all' | string[]) {
  const selection = selectedTopicIds(topicIds);
  const questionRefs = eachTopic([subject], selection);
  const distractorRefs = eachTopic(NITJ_CURRICULUM_SUBJECTS, 'all');
  const tokenPool = numberTokens(distractorRefs.map(({ topic }) => topicBlob(topic)).join(' '));
  const questionFacts = factsFromTopics(questionRefs, tokenPool, true);
  const distractorFacts = factsFromTopics(distractorRefs, tokenPool, false);
  return { questionFacts, distractorFacts };
}

/** Questions are copied from syllabus note lines. Nothing outside those notes is used. */
export function buildQuiz(
  subject: CurriculumSubjectDetail,
  topicIds: 'all' | string[],
  seed: number,
): QuizQuestion[] {
  if (topicIds !== 'all' && topicIds.length === 0) return [];
  const rng = mulberry32(seed || 1);
  const { questionFacts, distractorFacts } = poolsFor(subject, topicIds);
  const viable = questionFacts.filter((fact) => hasDistractors(fact, distractorFacts));
  const ordered = roundRobin(viable, rng);
  const questions: QuizQuestion[] = [];
  for (const fact of ordered) {
    if (questions.length >= QUIZ_LENGTH) break;
    const question = toQuestion(fact, distractorFacts, rng, questions.length);
    if (question) questions.push(question);
  }
  return questions;
}
