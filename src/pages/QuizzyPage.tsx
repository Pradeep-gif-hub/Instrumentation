import { CheckCircle2, ListChecks, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCurriculumSubjectById, getSubjectsForSemesterTab } from '@/data/curriculum';
import {
  buildQuiz,
  listQuizzySemesters,
  type QuizQuestion,
  type QuizSemester,
} from '@/lib/quizzy';

type Phase = 'setup' | 'quiz' | 'done';

function sameText(a: string, b: string): boolean {
  return a.replace(/\s+/g, ' ').trim() === b.replace(/\s+/g, ' ').trim();
}

export function QuizzyPage() {
  const semesters = useMemo(() => listQuizzySemesters(), []);
  const [phase, setPhase] = useState<Phase>('setup');
  const [semester, setSemester] = useState<QuizSemester | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [allTopics, setAllTopics] = useState(true);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const stemRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const subjects = semester === null ? [] : getSubjectsForSemesterTab(semester);
  const subject = subjectId ? (getCurriculumSubjectById(subjectId) ?? null) : null;
  const selection = allTopics ? 'all' : topicIds;

  const readyCount = useMemo(() => {
    if (!subject) return 0;
    if (!allTopics && topicIds.length === 0) return 0;
    return buildQuiz(subject, allTopics ? 'all' : topicIds, 1).length;
  }, [subject, allTopics, topicIds]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    if (picked === null) stemRef.current?.focus();
    else nextRef.current?.focus();
  }, [phase, index, picked]);

  const chooseSemester = (key: QuizSemester) => {
    setSemester(key);
    setSubjectId(null);
    setAllTopics(true);
    setTopicIds([]);
  };

  const chooseSubject = (id: string) => {
    setSubjectId(id);
    setAllTopics(true);
    const next = getCurriculumSubjectById(id);
    setTopicIds(next ? next.units.flatMap((unit) => unit.topics.map((topic) => topic.id)) : []);
  };

  const toggleTopic = (id: string) => {
    if (!subject) return;
    const ids = subject.units.flatMap((unit) => unit.topics.map((topic) => topic.id));
    const base = allTopics ? ids : topicIds;
    const next = base.includes(id) ? base.filter((item) => item !== id) : [...base, id];
    setTopicIds(next);
    setAllTopics(next.length === ids.length);
  };

  const startQuiz = (seed: number) => {
    if (!subject) return;
    const next = buildQuiz(subject, selection, seed);
    if (next.length === 0) return;
    setQuestions(next);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setPhase('quiz');
  };

  const question = questions[index];
  const answered = picked !== null && question !== undefined;
  const correct = answered && picked === question.correctIndex;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {phase === 'setup' && (
        <div className="space-y-5">
          <header>
            <p className="eyebrow">Quizzy</p>
            <h1 className="mt-1">Quiz from your syllabus notes</h1>
            <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-[var(--st-on-var)]">
              Pick a semester, a subject, and the topics you want. Each question is taken from those notes.
              One click answers it, and the correct line from the notes shows right away.
            </p>
          </header>

          <section className="glass space-y-3 p-5">
            <h2>Semester</h2>
            <div className="flex flex-wrap gap-2">
              {semesters.map((item) => {
                const active = item.key === semester;
                return (
                  <button
                    key={String(item.key)}
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseSemester(item.key)}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-[14px] transition ${
                      active
                        ? 'border-[var(--st-accent)] bg-[var(--st-accent)]/15 font-semibold text-[var(--st-on)]'
                        : 'border-[var(--st-line)] bg-[var(--st-1)] text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          {semester !== null && (
            <section className="glass space-y-3 p-5">
              <h2>Subject</h2>
              <div className="flex flex-wrap gap-2">
                {subjects.map((item) => {
                  const active = item.id === subjectId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => chooseSubject(item.id)}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-left text-[14px] transition ${
                        active
                          ? 'border-[var(--st-accent)] bg-[var(--st-accent)]/15 font-semibold text-[var(--st-on)]'
                          : 'border-[var(--st-line)] bg-[var(--st-1)] text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                      }`}
                    >
                      <span className="mr-1.5 text-[var(--st-accent-text)]">{item.code}</span>
                      {item.shortName}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {subject && (
            <section className="glass space-y-3 p-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2>Topics</h2>
                <p className="text-[14px] text-[var(--st-on-var)]">
                  {readyCount === 0
                    ? 'Not enough distinct note lines in this selection.'
                    : `${readyCount} ${readyCount === 1 ? 'question' : 'questions'} ready from these notes.`}
                </p>
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-[15px] text-[var(--st-on)]">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--st-accent)]"
                  checked={allTopics}
                  onChange={(event) => {
                    const ids = subject.units.flatMap((unit) => unit.topics.map((topic) => topic.id));
                    if (event.target.checked) {
                      setAllTopics(true);
                      setTopicIds(ids);
                    } else {
                      setAllTopics(false);
                      setTopicIds([]);
                    }
                  }}
                />
                All topics
              </label>
              <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                {subject.units.map((unit) => (
                  <div key={unit.unitNumber}>
                    <p className="text-[14px] font-semibold text-[var(--st-outline)]">
                      Unit {unit.unitNumber} · {unit.title}
                    </p>
                    <div className="mt-1.5 space-y-1">
                      {unit.topics.map((topic) => {
                        const checked = allTopics || topicIds.includes(topic.id);
                        return (
                          <label
                            key={topic.id}
                            className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-1 text-[15px] text-[var(--st-on)] hover:bg-[var(--st-2)]"
                          >
                            <input
                              type="checkbox"
                              className="mt-1 size-4 accent-[var(--st-accent)]"
                              checked={checked}
                              onChange={() => toggleTopic(topic.id)}
                            />
                            <span>{topic.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn primary"
                disabled={readyCount === 0}
                onClick={() => startQuiz(Date.now())}
              >
                <ListChecks className="size-4" />
                Start quiz
              </button>
            </section>
          )}
        </div>
      )}

      {phase === 'quiz' && question && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[14px] font-semibold text-[var(--st-on)]">
              Question {index + 1} of {questions.length}
            </p>
            <button
              type="button"
              className="text-[14px] text-[var(--st-on-var)] underline-offset-2 hover:underline"
              onClick={() => setPhase('setup')}
            >
              Change subject
            </button>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[var(--st-3)]">
            <div
              className="h-full bg-[var(--st-accent)] transition-[width] duration-300"
              style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>

          <section className="glass space-y-4 p-5">
            <p className="text-[14px] text-[var(--st-outline)]">
              {question.kindLabel} · Unit {question.unitNumber} · {question.topicTitle}
            </p>
            <h2 ref={stemRef} tabIndex={-1} className="text-[22px]! leading-snug outline-none">
              {question.prompt}
            </h2>
            <div className="space-y-2" role="group" aria-label="Answer choices">
              {question.options.map((option, optionIndex) => {
                const isCorrectOption = answered && optionIndex === question.correctIndex;
                const isWrongPick = answered && picked === optionIndex && !isCorrectOption;
                let borderClass = 'border-[var(--st-line)] bg-[var(--st-1)] hover:bg-[var(--st-2)]';
                if (isCorrectOption) borderClass = 'border-[var(--st-accent)] bg-[var(--st-accent)]/10';
                else if (isWrongPick) borderClass = 'border-[var(--st-amber)] bg-[var(--st-amber)]/10';
                else if (answered) borderClass = 'border-[var(--st-line)] bg-[var(--st-1)]';

                return (
                  <button
                    key={`${question.id}-${optionIndex}`}
                    type="button"
                    disabled={answered}
                    onClick={() => {
                      if (picked !== null) return;
                      setPicked(optionIndex);
                      if (optionIndex === question.correctIndex) setScore((value) => value + 1);
                    }}
                    className={`flex w-full cursor-pointer items-start gap-2 rounded-xl border px-3.5 py-3 text-left text-[15px] transition disabled:cursor-default disabled:opacity-100 ${borderClass}`}
                  >
                    <span className="mt-0.5 shrink-0 text-[var(--st-outline)]">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    <span className="text-[var(--st-on)]">{option}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                role="status"
                aria-live="polite"
                className="space-y-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5"
              >
                <p
                  className={`flex items-center gap-1.5 text-[15px] font-semibold ${
                    correct ? 'text-[var(--st-accent-text)]' : 'text-[var(--st-amber)]'
                  }`}
                >
                  {correct ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                  {correct ? 'That matches the notes.' : 'Not that one. Here is the note.'}
                </p>
                <p className="text-[15px] leading-relaxed text-[var(--st-on)]">{question.fullAnswer}</p>
                {!sameText(question.excerpt, question.fullAnswer) && (
                  <p className="whitespace-pre-wrap border-t border-[var(--st-line)] pt-2 text-[14px] leading-relaxed text-[var(--st-on-var)]">
                    {question.excerpt}
                  </p>
                )}
                <p className="text-[14px] text-[var(--st-outline)]">
                  Unit {question.unitNumber} · {question.unitTitle}
                </p>
              </div>
            )}

            {answered && (
              <button
                ref={nextRef}
                type="button"
                className="btn primary"
                onClick={() => {
                  if (index + 1 >= questions.length) {
                    setPhase('done');
                    return;
                  }
                  setIndex((value) => value + 1);
                  setPicked(null);
                }}
              >
                {index + 1 >= questions.length ? 'See result' : 'Next question'}
              </button>
            )}
          </section>
        </div>
      )}

      {phase === 'done' && (
        <section className="glass space-y-4 p-6">
          <p className="eyebrow">Quizzy</p>
          <h1>
            {score} of {questions.length} matched the notes
          </h1>
          <p className="max-w-[58ch] text-[16px] text-[var(--st-on-var)]">
            {subject ? `${subject.code} · ${subject.name}` : 'Syllabus notes'}
            {allTopics ? ' · all topics' : ` · ${topicIds.length} topics`}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn primary" onClick={() => startQuiz(Date.now())}>
              Same notes again
            </button>
            <button type="button" className="btn" onClick={() => setPhase('setup')}>
              Choose another subject
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
