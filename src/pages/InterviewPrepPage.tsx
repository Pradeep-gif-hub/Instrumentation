import { AlertCircle, Bookmark, Building2, CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MathBlock } from '@/components/MathBlock';
import { SubjectInterviewSimulator } from '@/components/SubjectInterviewSimulator';
import { useApp } from '@/context/AppContext';
import { COMPANY_PREP_PROFILES, INDUSTRY_PREP_DISCLAIMER } from '@/data/industryPrepData';
import { INTERVIEW_QUESTION_BANK } from '@/data/interviewBankData';
import type { BankQuestion, QuestionDifficulty, QuestionKind } from '@/types/engineering';

export function InterviewPrepPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { attempts, submitAttempt, resetProgress, isBookmarked, toggleBookmark } = useApp();

  const rawTab = searchParams.get('tab');
  const initialTab: 'bank' | 'simulator' | 'companies' =
    rawTab === 'companies' ? 'companies' : rawTab === 'simulator' ? 'simulator' : 'bank';
  const [activeTab, setActiveTab] = useState<'bank' | 'simulator' | 'companies'>(initialTab);

  // Question Bank State
  const [diffFilter, setDiffFilter] = useState<QuestionDifficulty | 'All'>('All');
  const [kindFilter, setKindFilter] = useState<QuestionKind | 'All'>('All');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [numericInputs, setNumericInputs] = useState<Record<string, string>>({});
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Company Prep State
  const initialSector =
    searchParams.get('sector') === 'automation'
      ? 'automation'
      : searchParams.get('sector') === 'oil-gas'
      ? 'oil-gas'
      : 'all';
  const [sectorFilter, setSectorFilter] = useState<'all' | 'oil-gas' | 'automation'>(initialSector);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    searchParams.get('company') || COMPANY_PREP_PROFILES[0].id,
  );

  const subjectsList = useMemo(
    () => Array.from(new Set(INTERVIEW_QUESTION_BANK.map((q) => q.subject))),
    [],
  );

  const qTarget = searchParams.get('q');

  const filteredQuestions = useMemo(() => {
    return INTERVIEW_QUESTION_BANK.filter((q) => {
      if (qTarget) return q.id === qTarget;
      if (diffFilter !== 'All' && q.difficulty !== diffFilter) return false;
      if (kindFilter !== 'All' && q.kind !== kindFilter) return false;
      if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false;
      return true;
    });
  }, [diffFilter, kindFilter, subjectFilter, qTarget]);

  const attemptMap = useMemo(() => {
    const map = new Map<string, (typeof attempts)[number]>();
    for (const a of attempts) map.set(a.questionId, a);
    return map;
  }, [attempts]);

  const correctCount = attempts.filter((a) => a.isCorrect).length;

  const gradeMcq = async (q: BankQuestion, optIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [q.id]: optIdx }));
    setRevealedIds((prev) => ({ ...prev, [q.id]: true }));
    await submitAttempt({
      questionId: q.id,
      isCorrect: optIdx === q.correctOptionIndex,
      selectedOption: optIdx,
    });
  };

  const gradeNumeric = async (q: BankQuestion) => {
    const val = Number(numericInputs[q.id]);
    if (Number.isNaN(val) || typeof q.numericExpected !== 'number') return;
    const tol = q.numericTolerance ?? 0.1;
    const ok = Math.abs(val - q.numericExpected) <= tol;
    setRevealedIds((prev) => ({ ...prev, [q.id]: true }));
    await submitAttempt({
      questionId: q.id,
      isCorrect: ok,
      userNumericAnswer: val,
    });
  };

  const selfGrade = async (q: BankQuestion, understood: boolean) => {
    setRevealedIds((prev) => ({ ...prev, [q.id]: true }));
    await submitAttempt({
      questionId: q.id,
      isCorrect: understood,
    });
  };

  const visibleCompanies = COMPANY_PREP_PROFILES.filter(
    (c) => sectorFilter === 'all' || c.sector === sectorFilter,
  );
  const activeCompany =
    visibleCompanies.find((c) => c.id === selectedCompanyId) ?? visibleCompanies[0];

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Technical interview practice</p>
          <h1 className="text-[28px] font-semibold text-[var(--st-on)]">
            Interview Preparation &amp; Core Industry Tracks
          </h1>
          <p className="muted mt-1 prose-measure text-[16px]">
            Practice graded multiple-choice, numerical, scenario, and field troubleshooting questions, plus Oil &amp; Gas and Automation industry guides.
          </p>
        </div>

        <div className="seg" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'bank'}
            onClick={() => {
              setActiveTab('bank');
              setSearchParams({ tab: 'bank' });
            }}
            className={activeTab === 'bank' ? 'on' : ''}
          >
            Question Bank ({INTERVIEW_QUESTION_BANK.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'simulator'}
            onClick={() => {
              setActiveTab('simulator');
              setSearchParams({ tab: 'simulator' });
            }}
            className={activeTab === 'simulator' ? 'on' : ''}
          >
            Subject Interview Simulator
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'companies'}
            onClick={() => {
              setActiveTab('companies');
              setSearchParams({ tab: 'companies' });
            }}
            className={activeTab === 'companies' ? 'on' : ''}
          >
            Core Industry Prep ({COMPANY_PREP_PROFILES.length} Companies)
          </button>
        </div>
      </header>

      {activeTab === 'simulator' ? (
        <SubjectInterviewSimulator />
      ) : activeTab === 'bank' ? (
        <>
          {/* Score & Progress Banner */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="glass relative overflow-hidden p-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[var(--st-accent)]"
              />
              <p className="eyebrow">Quiz accuracy</p>
              <p className="mt-1 text-[28px] font-semibold text-[var(--st-on)]">
                {attempts.length > 0 ? `${Math.round((correctCount / attempts.length) * 100)}%` : '—'}
              </p>
            </div>
            <div className="glass p-4">
              <p className="eyebrow">Attempted</p>
              <p className="mt-1 text-[28px] font-semibold text-[var(--st-on)]">
                {attempts.length} / {INTERVIEW_QUESTION_BANK.length}
              </p>
            </div>
            <div className="glass p-4">
              <p className="eyebrow">Correctly solved</p>
              <p className="mt-1 text-[28px] font-semibold text-[var(--st-on)]">{correctCount}</p>
            </div>
            <div className="glass flex items-center justify-between p-4">
              <div>
                <p className="eyebrow">Reset score</p>
                <p className="muted mt-1 text-[14px]">Clear saved answers</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOptions({});
                  setNumericInputs({});
                  setRevealedIds({});
                  resetProgress();
                }}
                className="btn py-1.5!"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Multi-Dimensional Filters */}
          <div className="glass flex flex-wrap items-center gap-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Difficulty:</span>
              <div className="seg">
                {(['All', 'Beginner', 'Intermediate', 'Advanced', 'Industry-Oriented'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiffFilter(d)}
                    className={diffFilter === d ? 'on' : ''}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Type:</span>
              <select
                value={kindFilter}
                onChange={(e) => setKindFilter(e.target.value as QuestionKind | 'All')}
                className="h-[39px] w-44 cursor-pointer rounded-xl border border-[color-mix(in_srgb,var(--st-on)_18%,transparent)] bg-[var(--st-1)] px-3.5 text-[14px] text-[var(--st-on)] outline-none transition hover:border-[color-mix(in_srgb,var(--st-on)_40%,transparent)] focus:border-[var(--st-accent)]"
                aria-label="Filter by question format"
              >
                <option value="All">All Formats</option>
                <option value="MCQ">MCQ</option>
                <option value="Numerical">Numerical</option>
                <option value="Conceptual">Conceptual</option>
                <option value="Practical">Practical</option>
                <option value="Scenario">Scenario</option>
                <option value="Troubleshooting">Troubleshooting</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Subject:</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="h-[39px] w-52 cursor-pointer rounded-xl border border-[color-mix(in_srgb,var(--st-on)_18%,transparent)] bg-[var(--st-1)] px-3.5 text-[14px] text-[var(--st-on)] outline-none transition hover:border-[color-mix(in_srgb,var(--st-on)_40%,transparent)] focus:border-[var(--st-accent)]"
                aria-label="Filter by engineering subject"
              >
                <option value="All">All Subjects</option>
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {qTarget && (
              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'bank' })}
                className="btn primary py-1.5!"
              >
                Showing searched question · Show All ({INTERVIEW_QUESTION_BANK.length})
              </button>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => {
              const attempt = attemptMap.get(q.id);
              const isRevealed = Boolean(revealedIds[q.id] || attempt);
              const saved = isBookmarked(`question:${q.id}`);

              return (
                <article key={q.id} className="glass space-y-3 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-[var(--st-accent-text)]">Q{idx + 1}</span>
                      <span className="pill text-[14px]">{q.difficulty}</span>
                      <span className="pill text-[14px]">{q.kind}</span>
                      <span className="pill text-[14px]">{q.subject}</span>
                      <span className="muted text-[14px]">{q.sourceTag}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {attempt && (
                        <span
                          className="status"
                          style={
                            attempt.isCorrect
                              ? ({
                                  background: 'color-mix(in srgb, var(--st-accent) 15%, transparent)',
                                  borderColor: 'color-mix(in srgb, var(--st-accent) 35%, transparent)',
                                  color: 'var(--st-accent-text)',
                                } as React.CSSProperties)
                              : ({
                                  '--tone': 'var(--st-crimson)',
                                } as React.CSSProperties)
                          }
                        >
                          {attempt.isCorrect ? 'Solved' : 'Review Needed'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            id: `question:${q.id}`,
                            itemType: 'question',
                            title: q.question,
                            subtitle: `${q.difficulty} · ${q.subject}`,
                            route: `/interview?tab=bank&q=${q.id}`,
                          })
                        }
                        className={`icon-btn size-8! ${saved ? 'border-[var(--st-accent)]! text-[var(--st-accent-text)]!' : ''}`}
                        aria-label="Bookmark question"
                      >
                        <Bookmark className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-[16px] font-semibold leading-relaxed text-[var(--st-on)]">
                    {q.question}
                  </h2>

                  {/* MCQ Interaction */}
                  {q.kind === 'MCQ' && q.options && (
                    <div className="grid gap-2 md:grid-cols-2">
                      {q.options.map((opt, optIdx) => {
                        const chosen = (selectedOptions[q.id] ?? attempt?.selectedOption) === optIdx;
                        const isRight = optIdx === q.correctOptionIndex;
                        let style = 'border-[var(--st-line)] bg-[var(--st-2)] hover:border-[var(--st-edge)]';
                        if (isRevealed) {
                          if (isRight) {
                            style = 'border-[var(--st-accent)] bg-[color-mix(in_srgb,var(--st-accent)_15%,transparent)]';
                          } else if (chosen) {
                            style = 'border-[var(--st-crimson)] bg-[color-mix(in_srgb,var(--st-crimson)_14%,transparent)]';
                          }
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => gradeMcq(q, optIdx)}
                            className={`flex cursor-pointer items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-left text-[14px] transition ${style}`}
                          >
                            <span>
                              <span className="mr-2 font-semibold text-[var(--st-outline)]">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              {opt}
                            </span>
                            {isRevealed && isRight && <CheckCircle2 className="size-4 shrink-0 text-[var(--st-accent)]" />}
                            {isRevealed && chosen && !isRight && <XCircle className="size-4 shrink-0 text-[var(--st-crimson)]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Numerical Interaction */}
                  {q.kind === 'Numerical' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={numericInputs[q.id] ?? (attempt?.userNumericAnswer ?? '')}
                        onChange={(e) => setNumericInputs((p) => ({ ...p, [q.id]: e.target.value }))}
                        placeholder={`Enter value in ${q.numericUnit ?? 'units'}…`}
                        className="field-rect w-56!"
                      />
                      <span className="text-[14px] text-[var(--st-on-var)]">{q.numericUnit}</span>
                      <button type="button" onClick={() => gradeNumeric(q)} className="btn primary py-1.5!">
                        Check Answer
                      </button>
                    </div>
                  )}

                  {/* Conceptual / Practical / Scenario / Troubleshooting Interaction */}
                  {q.kind !== 'MCQ' && q.kind !== 'Numerical' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRevealedIds((p) => ({ ...p, [q.id]: !p[q.id] }))}
                        className="btn py-1.5!"
                      >
                        <HelpCircle className="size-3.5" />
                        {isRevealed ? 'Hide Solution' : 'Show answer'}
                      </button>
                      {isRevealed && (
                        <>
                          <button
                            type="button"
                            onClick={() => selfGrade(q, true)}
                            className="btn primary py-1.5!"
                          >
                            <CheckCircle2 className="size-3.5" />
                            Got It
                          </button>
                          <button
                            type="button"
                            onClick={() => selfGrade(q, false)}
                            className="btn danger py-1.5!"
                          >
                            <XCircle className="size-3.5" />
                            Needs Revision
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Engineering Principle Explanation */}
                  {isRevealed && (
                    <div className="sub space-y-2 border-[color-mix(in_srgb,var(--st-accent)_30%,transparent)] p-4 text-[14px]">
                      <p className="font-semibold text-[var(--st-accent-text)]">
                        Answer: {q.modelAnswer}
                      </p>
                      <p className="leading-relaxed text-[var(--st-on)]">
                        <strong className="text-[var(--st-accent-text)]">Why it works: </strong>
                        {q.engineeringPrinciple}
                      </p>
                      {q.formulaLatex && (
                        <div className="overflow-x-auto rounded-xl bg-[var(--st-void)] p-2.5 text-center">
                          <MathBlock latex={q.formulaLatex} />
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        /* CORE INDUSTRY PREPARATION TRACKS (9 OIL & GAS + 8 AUTOMATION OEMs) */
        <>
          <div className="sub flex items-start gap-3 px-4 py-3 text-[14px]">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-[var(--st-amber)]" />
            <p className="text-[var(--st-on-var)]">{INDUSTRY_PREP_DISCLAIMER}</p>
          </div>

          <div className="seg">
            <button
              type="button"
              onClick={() => setSectorFilter('all')}
              className={sectorFilter === 'all' ? 'on' : ''}
            >
              All Companies ({COMPANY_PREP_PROFILES.length})
            </button>
            <button
              type="button"
              onClick={() => setSectorFilter('oil-gas')}
              className={sectorFilter === 'oil-gas' ? 'on' : ''}
            >
              Oil &amp; Gas PSUs / Refineries (9)
            </button>
            <button
              type="button"
              onClick={() => setSectorFilter('automation')}
              className={sectorFilter === 'automation' ? 'on' : ''}
            >
              Automation OEMs (8)
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="glass max-h-[680px] space-y-1.5 overflow-y-auto p-3">
              {visibleCompanies.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-left transition ${
                    activeCompany?.id === c.id
                      ? 'bg-[var(--st-3)] text-[var(--st-accent-text)] ring-1 ring-[var(--st-accent)]/40'
                      : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[var(--st-on)]">{c.name}</p>
                    <p className="text-[14px] text-[var(--st-outline)]">
                      {c.sector === 'oil-gas' ? 'Oil & Gas' : 'Automation OEM'}
                    </p>
                  </div>
                  <Building2 className="size-4 shrink-0 opacity-70" />
                </button>
              ))}
            </aside>

            {activeCompany && (
              <section className="glass space-y-4 p-6">
                <div className="border-b border-[var(--st-line)] pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="status" style={{ '--tone': 'var(--st-accent)' } as React.CSSProperties}>
                      {activeCompany.sector === 'oil-gas' ? 'Oil & Gas track' : 'Automation OEM track'}
                    </span>
                  </div>
                  <h2 className="mt-2 text-[20px] font-semibold text-[var(--st-on)]">{activeCompany.name}</h2>
                  <p className="muted text-[14px]">{activeCompany.roleFocus}</p>
                </div>

                <div className="space-y-2">
                  <p className="eyebrow">Company focus</p>
                  <p className="text-[16px] leading-relaxed text-[var(--st-on)]">{activeCompany.publiclyKnownFocus}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="sub space-y-2 p-4">
                    <p className="eyebrow">Relevant technologies</p>
                    <ul className="space-y-1.5 text-[14px] text-[var(--st-on)]">
                      {activeCompany.coreTechnologies.map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="sub space-y-2 p-4">
                    <p className="eyebrow">Priority technical subjects</p>
                    <ul className="space-y-1.5 text-[14px] text-[var(--st-on)]">
                      {activeCompany.keySubjects.map((s) => (
                        <li key={s}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="eyebrow">Practice questions</p>
                  {activeCompany.practiceQuestions.map((pq) => (
                    <div key={pq.question} className="sub space-y-1.5 p-4 text-[14px]">
                      <span className="pill text-[14px]">{pq.topic}</span>
                      <p className="font-semibold text-[var(--st-on)]">{pq.question}</p>
                      <p className="text-[var(--st-on-var)]">
                        <strong className="text-[var(--st-accent-text)]">Guideline answer: </strong>
                        {pq.guidelineAnswer}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--st-line)] pt-3 text-[14px] text-[var(--st-outline)]">
                  <span>{activeCompany.sourceDisclosure}</span>
                  <Link to="/browse" className="font-semibold text-[var(--st-accent-text)] hover:underline">
                    Review Field Instruments →
                  </Link>
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
