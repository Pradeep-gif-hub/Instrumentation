import { CheckCircle2, GitCompare, HelpCircle, MessageSquare, RotateCcw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NITJ_CURRICULUM_SUBJECTS } from '@/data/curriculum';

interface SubjectInterviewSimulatorProps {
  initialSubjectId?: string;
}

export function SubjectInterviewSimulator({ initialSubjectId }: SubjectInterviewSimulatorProps) {
  const interactiveSubjects = useMemo(
    () =>
      NITJ_CURRICULUM_SUBJECTS.filter(
        (s) => s.simulatorQuestions.length > 0 || s.comparisons.length > 0,
      ),
    [],
  );

  const defaultId =
    interactiveSubjects.find((s) => s.id === initialSubjectId)?.id ?? interactiveSubjects[0]?.id ?? '';
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultId);
  const [chosenAnswers, setChosenAnswers] = useState<Record<string, number>>({});
  const [revealedFollowUps, setRevealedFollowUps] = useState<Record<string, boolean>>({});
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const activeSubject =
    interactiveSubjects.find((s) => s.id === selectedSubjectId) ?? interactiveSubjects[0];

  const questions = useMemo(() => {
    if (!activeSubject) return [];
    if (levelFilter === 'ALL') return activeSubject.simulatorQuestions;
    return activeSubject.simulatorQuestions.filter((q) => q.level === levelFilter);
  }, [activeSubject, levelFilter]);

  if (!activeSubject) return null;

  return (
    <div className="space-y-6">
      {/* Subject Selector Pills */}
      <div className="glass space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="eyebrow">SUBJECT-WISE TECHNICAL INTERVIEW SIMULATOR</p>
            <h3 className="mt-1 text-lg font-semibold text-[var(--st-on)]">
              Concept Drills, Comparisons &amp; Follow-Up Rounds
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setChosenAnswers({});
              setRevealedFollowUps({});
            }}
            className="btn py-1! text-[14px]!"
          >
            <RotateCcw className="size-3.5" />
            Reset Responses
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {interactiveSubjects.map((s) => {
            const active = s.id === activeSubject.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedSubjectId(s.id);
                  setLevelFilter('ALL');
                }}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-[14px] transition ${
                  active
                    ? 'border-[var(--st-accent)] bg-[var(--st-accent)]/15 font-semibold text-[var(--st-on)]'
                    : 'border-[var(--st-line)] bg-[var(--st-1)] text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                }`}
              >
                <span className="mr-1.5 text-[14px] text-[var(--st-accent-text)]">{s.code}</span>
                {s.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Engineering Comparisons Table */}
      {activeSubject.comparisons.length > 0 && (
        <section className="glass space-y-4 p-5">
          <div className="flex items-center gap-2">
            <GitCompare className="size-4 text-[var(--st-accent-text)]" />
            <h4 className="eyebrow">
              Key interview comparisons ({activeSubject.code})
            </h4>
          </div>

          <div className="space-y-4">
            {activeSubject.comparisons.map((cmp) => (
              <div key={cmp.title} className="sub overflow-hidden rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--st-line)] px-4 py-3">
                  <p className="text-[16px] font-semibold text-[var(--st-on)]">{cmp.title}</p>
                  {cmp.isEnrichment && (
                    <span className="rounded-full border border-[var(--st-amber)]/40 bg-[var(--st-amber)]/10 px-2.5 py-0.5 text-[14px] text-[var(--st-amber)]">
                      Additional Signal Processing Enrichment
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="tech-table w-full text-left text-[14px]">
                    <thead>
                      <tr>
                        <th className="w-1/4">Criterion</th>
                        <th className="w-[37.5%]">{cmp.leftName}</th>
                        <th className="w-[37.5%]">{cmp.rightName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cmp.rows.map((r) => (
                        <tr key={r.criterion}>
                          <td className="font-semibold text-[var(--st-on)]">{r.criterion}</td>
                          <td>{r.leftValue}</td>
                          <td>{r.rightValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive MCQ + Dynamic Follow-Up Interview Round */}
      <section className="glass space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-[var(--st-accent-text)]" />
            <h4 className="eyebrow">
              Interactive practice round · {activeSubject.name}
            </h4>
          </div>
          <div className="seg" role="group" aria-label="Filter difficulty">
            {['ALL', 'Beginner', 'Intermediate', 'Advanced', 'Practical Scenario'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                aria-selected={levelFilter === lvl}
                onClick={() => setLevelFilter(lvl)}
                className="text-[14px]!"
              >
                {lvl === 'ALL' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="muted text-[14px]">
              No questions at "{levelFilter}" level in this subject — choose "All Levels" above.
            </p>
          ) : (
            questions.map((q, qIdx) => {
              const chosen = chosenAnswers[q.id];
              const isAnswered = chosen !== undefined;
              const isCorrect = isAnswered && q.correctIndex === chosen;
              const showFollowAns = revealedFollowUps[q.id] ?? false;

              return (
                <div key={q.id} className="sub space-y-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="pill">Q{qIdx + 1}</span>
                      <span className="text-[14px] text-[var(--st-accent-text)]">{q.level}</span>
                      <span className="text-[14px] text-[var(--st-outline)]">· {q.topic}</span>
                    </div>
                    {isAnswered && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[14px] font-semibold ${
                          isCorrect
                            ? 'bg-[var(--st-accent)]/15 text-[var(--st-accent-text)]'
                            : 'bg-[var(--st-amber)]/15 text-[var(--st-amber)]'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3.5" /> Review Principle
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="text-[16px] font-semibold text-[var(--st-on)]">{q.question}</p>

                  {q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const selected = chosen === optIdx;
                        const rightOpt = q.correctIndex === optIdx;
                        let borderClass = 'border-[var(--st-line)] bg-[var(--st-1)]';
                        if (isAnswered) {
                          if (rightOpt) {
                            borderClass = 'border-[var(--st-accent)] bg-[var(--st-accent)]/10';
                          } else if (selected && !rightOpt) {
                            borderClass = 'border-[var(--st-amber)] bg-[var(--st-amber)]/10';
                          }
                        } else if (selected) {
                          borderClass = 'border-[var(--st-accent)] bg-[var(--st-3)]';
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setChosenAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                            }
                            className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition ${borderClass}`}
                          >
                            <span className="text-[var(--st-on)]">
                              <span className="mr-2 text-[var(--st-outline)]">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isAnswered && (
                    <div className="space-y-3 border-t border-[var(--st-line)] pt-3">
                      <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 text-[14px]">
                        <p className="font-semibold text-[var(--st-on)]">Answer: {q.answer}</p>
                        <p className="mt-1 leading-relaxed text-[var(--st-on-var)]">
                          <span className="font-semibold text-[var(--st-accent-text)]">Why it works: </span>
                          {q.principle}
                        </p>
                      </div>

                      {/* Dynamic Follow-Up Question triggered by performance */}
                      <div className="rounded-xl border border-[var(--st-accent)]/35 bg-[var(--st-1)] p-3 text-[14px]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--st-accent-text)]">
                            <MessageSquare className="size-3.5" />
                            {isCorrect
                              ? 'Follow-up question:'
                              : 'Coaching prompt:'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedFollowUps((prev) => ({
                                ...prev,
                                [q.id]: !showFollowAns,
                              }))
                            }
                            className="btn py-1! text-[14px]!"
                          >
                            {showFollowAns ? 'Hide Follow-Up Key' : 'Show Follow-Up Key'}
                          </button>
                        </div>
                        <p className="mt-1.5 text-[16px] font-semibold text-[var(--st-on)]">
                          {isCorrect ? q.followUpIfCorrect : q.followUpIfReview}
                        </p>
                        {showFollowAns && (
                          <p className="mt-2 border-t border-[var(--st-line)] pt-2 text-[var(--st-accent-text)]">
                            {q.followUpAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

