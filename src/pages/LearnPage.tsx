import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConceptInspector } from '@/components/ConceptInspector';
import { NITJ_SUBJECT_MAP } from '@/data/curriculum';
import {
  buildUnifiedNavigationTree,
  getCanonicalInstrumentUrl,
  LEARN_SEMESTERS,
  type TopicFamilyKey,
  TREE_SUBJECT_MAP,
} from '@/data/navigationTree';
import { getPlainDisplayName, getPlainSummaryLine } from '@/data/simpleGuides';

export function LearnPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const semKey = searchParams.get('sem') as 'sem3' | 'sem4' | 'sem5' | 'additional' | null;
  const subjectId = searchParams.get('subject');
  const familyKey = searchParams.get('family') as TopicFamilyKey | null;
  const unitParam = searchParams.get('unit');
  const conceptId = searchParams.get('concept');

  const fullTree = useMemo(() => buildUnifiedNavigationTree(), []);
  const activeSemester = LEARN_SEMESTERS.find((s) => s.key === semKey) ?? null;
  const activeSubjectNode = subjectId
    ? fullTree.find((n) => n.subject.id === subjectId) ?? null
    : null;
  const activeCurriculumSubject = subjectId ? NITJ_SUBJECT_MAP.get(subjectId) ?? null : null;

  const activeFamilyNode =
    activeSubjectNode && familyKey
      ? activeSubjectNode.families.find((f) => f.family.key === familyKey) ?? null
      : null;

  const activeUnit =
    activeCurriculumSubject && unitParam
      ? activeCurriculumSubject.units.find((u) => u.unitNumber === Number(unitParam)) ?? null
      : null;

  const activeConcept =
    activeUnit && conceptId
      ? activeUnit.topics.find((t) => t.id === conceptId) ?? null
      : null;

  // Step levels:
  // 1 = Semesters
  // 2 = Subjects in semester
  // 3 = Topic groups + Syllabus sections in subject
  // 4 = Instruments (if family) OR Concepts in syllabus section (if unit)
  // 5 = Concept detail inspector (if unit + concept)
  const currentLevel = activeConcept
    ? 5
    : activeFamilyNode || activeUnit
    ? 4
    : activeSubjectNode
    ? 3
    : activeSemester
    ? 2
    : 1;

  const selectSemester = (key: string) => setSearchParams({ sem: key });
  const selectSubject = (sem: string, subjId: string) =>
    setSearchParams({ sem, subject: subjId });
  const selectFamily = (sem: string, subjId: string, famKey: string) =>
    setSearchParams({ sem, subject: subjId, family: famKey });
  const selectUnit = (sem: string, subjId: string, unitNum: number) =>
    setSearchParams({ sem, subject: subjId, unit: String(unitNum) });
  const selectConcept = (sem: string, subjId: string, unitNum: number, cId: string) =>
    setSearchParams({ sem, subject: subjId, unit: String(unitNum), concept: cId });

  const goBack = () => {
    if (currentLevel === 5 && activeSemester && activeSubjectNode && activeUnit) {
      setSearchParams({
        sem: activeSemester.key,
        subject: activeSubjectNode.subject.id,
        unit: String(activeUnit.unitNumber),
      });
    } else if (currentLevel === 4 && activeSemester && activeSubjectNode) {
      setSearchParams({ sem: activeSemester.key, subject: activeSubjectNode.subject.id });
    } else if (currentLevel === 3 && activeSemester) {
      setSearchParams({ sem: activeSemester.key });
    } else {
      setSearchParams({});
    }
  };

  const navigateToSubjectFromConcept = (targetSubjectId: string) => {
    const meta = TREE_SUBJECT_MAP.get(targetSubjectId);
    if (meta) {
      setSearchParams({ sem: meta.semesterKey, subject: meta.id });
    }
  };

  const visibleSubjectsInSem = useMemo(() => {
    if (!activeSemester) return [];
    return activeSemester.subjectIds
      .map((id) => fullTree.find((n) => n.subject.id === id))
      .filter((n): n is (typeof fullTree)[number] => Boolean(n));
  }, [activeSemester, fullTree]);

  return (
    <div className="mx-auto flex max-w-[780px] flex-col gap-6">
      {/* Top Back + Simple Breadcrumb */}
      <div className="space-y-3">
        {currentLevel > 1 && (
          <button type="button" onClick={goBack} className="btn">
            <ArrowLeft className="size-4" />
            Back
          </button>
        )}

        <nav
          aria-label="Learn path"
          className="flex flex-wrap items-center gap-2 text-[14px] text-[var(--st-on-var)]"
        >
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="cursor-pointer hover:text-[var(--st-on)]"
          >
            Semesters
          </button>

          {activeSemester && (
            <>
              <span>›</span>
              <button
                type="button"
                onClick={() => selectSemester(activeSemester.key)}
                className="cursor-pointer hover:text-[var(--st-on)]"
              >
                {activeSemester.label}
              </button>
            </>
          )}

          {activeSubjectNode && activeSemester && (
            <>
              <span>›</span>
              <button
                type="button"
                onClick={() => selectSubject(activeSemester.key, activeSubjectNode.subject.id)}
                className="cursor-pointer hover:text-[var(--st-on)]"
              >
                {activeSubjectNode.subject.name}
              </button>
            </>
          )}

          {activeFamilyNode && (
            <>
              <span>›</span>
              <span className="font-semibold text-[var(--st-on)]">
                {activeFamilyNode.family.label}
              </span>
            </>
          )}

          {activeUnit && activeSemester && activeSubjectNode && (
            <>
              <span>›</span>
              <button
                type="button"
                onClick={() =>
                  selectUnit(activeSemester.key, activeSubjectNode.subject.id, activeUnit.unitNumber)
                }
                className="cursor-pointer hover:text-[var(--st-on)]"
              >
                Section {activeUnit.unitNumber}
              </button>
            </>
          )}

          {activeConcept && (
            <>
              <span>›</span>
              <span className="font-semibold text-[var(--st-on)]">{activeConcept.title}</span>
            </>
          )}
        </nav>
      </div>

      {/* STEP 1: Semesters (One line each) */}
      {currentLevel === 1 && (
        <section className="space-y-4">
          <h1>Choose your semester</h1>
          <div className="space-y-2.5">
            {LEARN_SEMESTERS.map((sem) => (
              <button
                key={sem.key}
                type="button"
                onClick={() => selectSemester(sem.key)}
                className="ui-card flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-[20px] font-semibold text-[var(--st-on)]">
                  {sem.label}
                </span>
                <ChevronRight className="size-5 text-[var(--st-on-var)]" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 2: Subjects in Selected Semester */}
      {currentLevel === 2 && activeSemester && (
        <section className="space-y-4">
          <h1>{activeSemester.label}</h1>
          <div className="space-y-2.5">
            {visibleSubjectsInSem.map((subjNode) => {
              const codeText =
                subjNode.subject.code === 'VERIFY-CODE'
                  ? 'Course code to verify'
                  : subjNode.subject.code;
              return (
                <button
                  key={subjNode.subject.id}
                  type="button"
                  onClick={() => selectSubject(activeSemester.key, subjNode.subject.id)}
                  className="ui-card flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-[20px] font-semibold text-[var(--st-on)]">
                      {subjNode.subject.name}
                    </p>
                    <p className="mt-0.5 text-[14px] text-[var(--st-on-var)]">{codeText}</p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-[var(--st-on-var)]" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* STEP 3: Topic Groups & Syllabus Sections inside Selected Subject */}
      {currentLevel === 3 && activeSubjectNode && activeSemester && (
        <section className="space-y-6">
          <div>
            <h1>{activeSubjectNode.subject.name}</h1>
            <p className="mt-1 text-[14px] text-[var(--st-on-var)]">
              {activeSubjectNode.subject.code === 'VERIFY-CODE'
                ? 'Course code to verify'
                : activeSubjectNode.subject.code}
            </p>
          </div>

          {activeSubjectNode.families.length > 0 && (
            <div className="space-y-3">
              <h2>Instruments &amp; modules</h2>
              <div className="space-y-2.5">
                {activeSubjectNode.families.map((famNode) => (
                  <button
                    key={famNode.family.key}
                    type="button"
                    onClick={() =>
                      selectFamily(
                        activeSemester.key,
                        activeSubjectNode.subject.id,
                        famNode.family.key,
                      )
                    }
                    className="ui-card flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-[20px] font-semibold text-[var(--st-on)]">
                      {famNode.family.label}
                    </span>
                    <span className="text-[16px] text-[var(--st-on-var)]">
                      {famNode.instruments.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCurriculumSubject && activeCurriculumSubject.units.length > 0 && (
            <div className="space-y-3">
              <h2>Syllabus sections</h2>
              <div className="space-y-2.5">
                {activeCurriculumSubject.units.map((unit) => (
                  <button
                    key={unit.unitNumber}
                    type="button"
                    onClick={() =>
                      selectUnit(
                        activeSemester.key,
                        activeSubjectNode.subject.id,
                        unit.unitNumber,
                      )
                    }
                    className="ui-card flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[20px] font-semibold text-[var(--st-on)]">
                        Section {unit.unitNumber} · {unit.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[14px] text-[var(--st-on-var)]">
                        {unit.summary}
                      </p>
                    </div>
                    <span className="shrink-0 text-[16px] text-[var(--st-on-var)]">
                      {unit.topics.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSubjectNode.alsoUsedInInstruments.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[14px] font-semibold text-[var(--st-on-var)]">
                Also used in this subject
              </p>
              <div className="space-y-2">
                {activeSubjectNode.alsoUsedInInstruments.map((inst) => (
                  <Link
                    key={inst.id}
                    to={getCanonicalInstrumentUrl(inst.id)}
                    className="ui-card flex items-center justify-between px-4 py-3 text-[16px] text-[var(--st-on)]"
                  >
                    <span>{getPlainDisplayName(inst)}</span>
                    <ChevronRight className="size-4 text-[var(--st-on-var)]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* STEP 4A: Plain List of Instruments in Selected Topic Group */}
      {currentLevel === 4 && activeFamilyNode && activeSubjectNode && (
        <section className="space-y-4">
          <div>
            <h1>{activeFamilyNode.family.label}</h1>
            <p className="mt-1 text-[14px] text-[var(--st-on-var)]">
              {TREE_SUBJECT_MAP.get(activeSubjectNode.subject.id)?.name}
            </p>
          </div>

          <div className="space-y-2.5">
            {activeFamilyNode.instruments.map((inst) => (
              <Link
                key={inst.id}
                to={getCanonicalInstrumentUrl(inst.id)}
                className="ui-card flex items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-[var(--st-on)]">
                    {getPlainDisplayName(inst)}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[14px] text-[var(--st-on-var)]">
                    {getPlainSummaryLine(inst)}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-[var(--st-on-var)]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* STEP 4B: Concepts inside Selected Syllabus Section */}
      {currentLevel === 4 && activeUnit && activeCurriculumSubject && activeSemester && !activeFamilyNode && (
        <section className="space-y-4">
          <div>
            <h1>
              Section {activeUnit.unitNumber} · {activeUnit.title}
            </h1>
            <p className="mt-1 text-[14px] text-[var(--st-on-var)]">
              {activeCurriculumSubject.name}
            </p>
          </div>

          <div className="space-y-2.5">
            {activeUnit.topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() =>
                  selectConcept(
                    activeSemester.key,
                    activeCurriculumSubject.id,
                    activeUnit.unitNumber,
                    topic.id,
                  )
                }
                className="ui-card flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[16px] font-semibold text-[var(--st-on)]">{topic.title}</p>
                    {topic.isExtension && (
                      <span className="pill text-[14px]">Enrichment</span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[14px] text-[var(--st-on-var)]">
                    {topic.summary}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-[var(--st-on-var)]" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 5: Full Concept Inspector inside Learn */}
      {currentLevel === 5 && activeConcept && activeUnit && activeCurriculumSubject && (
        <ConceptInspector
          subject={activeCurriculumSubject}
          unit={activeUnit}
          concept={activeConcept}
          onNavigateSubject={navigateToSubjectFromConcept}
        />
      )}
    </div>
  );
}
