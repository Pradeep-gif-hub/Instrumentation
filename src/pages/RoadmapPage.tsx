import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Layers,
  MessageSquare,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConceptInspector } from '@/components/ConceptInspector';
import { CrossSemesterGraph } from '@/components/CrossSemesterGraph';
import { SubjectInterviewSimulator } from '@/components/SubjectInterviewSimulator';
import { useApp } from '@/context/AppContext';
import {
  DRIVE_COMPANION_COURSES,
  NITJ_CURRICULUM_SUBJECTS,
  NITJ_SUBJECT_MAP,
  NITJ_SYLLABUS_BANNER,
} from '@/data/curriculum';
import type { ConceptDetail, CurriculumUnitDetail } from '@/types/curriculum';
import type { AcademicSubject } from '@/types/engineering';

type SemTab = 1 | 2 | 3 | 4 | 5 | 6 | 'additional';
type ViewMode = 'tree' | 'graph' | 'simulator';

function parseSemTab(raw: string | null): SemTab {
  if (raw === 'additional') return 'additional';
  const n = Number(raw);
  if (n >= 1 && n <= 6) return n as SemTab;
  return 3;
}

export function RoadmapPage() {
  const { subjects, saveSubject, deleteSubject, resetSubjects, toggleBookmark, isBookmarked } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = parseSemTab(searchParams.get('sem'));
  const rawView = searchParams.get('view');
  const initialView: ViewMode =
    rawView === 'graph' || rawView === 'simulator' ? rawView : 'tree';

  const [selectedTab, setSelectedTab] = useState<SemTab>(initialTab);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    searchParams.get('subject') || '',
  );
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>(() => {
    const u = Number(searchParams.get('unit'));
    return u > 0 ? { [u]: true } : {};
  });
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    searchParams.get('concept') || '',
  );

  const [editingSubject, setEditingSubject] = useState<AcademicSubject | null>(null);
  const [isNewSubject, setIsNewSubject] = useState(false);

  // Sync deep-link URL params when navigating via SearchModal or external links
  useEffect(() => {
    const pSem = searchParams.get('sem');
    const pSubj = searchParams.get('subject');
    const pUnit = Number(searchParams.get('unit'));
    const pConcept = searchParams.get('concept');
    const pView = searchParams.get('view');

    if (pSem) setSelectedTab(parseSemTab(pSem));
    if (pView === 'graph' || pView === 'simulator' || pView === 'tree') {
      setViewMode(pView);
    }
    if (pSubj) setSelectedSubjectId(pSubj);
    if (pUnit > 0) setExpandedUnits({ [pUnit]: true });
    if (pConcept) setSelectedConceptId(pConcept);
  }, [searchParams]);

  // Filter subjects per tab; keep supplementary minor elective ICMI0303 on 'additional' tab
  const tabSubjects = useMemo(() => {
    if (selectedTab === 'additional') {
      return subjects.filter((s) => s.id === 'nitj-supp-cal');
    }
    return subjects.filter((s) => s.semester === selectedTab && s.id !== 'nitj-supp-cal');
  }, [subjects, selectedTab]);

  useEffect(() => {
    if (tabSubjects.length > 0 && !tabSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(tabSubjects[0].id);
      setExpandedUnits({});
      setSelectedConceptId('');
    }
  }, [tabSubjects, selectedSubjectId]);

  const activeSubject =
    tabSubjects.find((s) => s.id === selectedSubjectId) ?? tabSubjects[0];

  const richDetail = activeSubject ? NITJ_SUBJECT_MAP.get(activeSubject.id) : undefined;

  // Locate currently selected unit & concept for ConceptInspector (progressive leaf reveal)
  const selectedConceptMatch: {
    unit: CurriculumUnitDetail;
    concept: ConceptDetail;
  } | null = useMemo(() => {
    if (!richDetail || !selectedConceptId) return null;
    for (const u of richDetail.units) {
      const c = u.topics.find((t) => t.id === selectedConceptId);
      if (c) return { unit: u, concept: c };
    }
    return null;
  }, [richDetail, selectedConceptId]);

  const totalCredits = useMemo(
    () => tabSubjects.reduce((acc, s) => acc + s.credits, 0),
    [tabSubjects],
  );

  const numericSemForModal: number = selectedTab === 'additional' ? 5 : selectedTab;

  const navigateToSubject = (targetSubjectId: string) => {
    const rich = NITJ_SUBJECT_MAP.get(targetSubjectId);
    const dbSubj = subjects.find((s) => s.id === targetSubjectId);
    const targetSem: SemTab = rich
      ? parseSemTab(String(rich.semester))
      : parseSemTab(String(dbSubj?.semester ?? 3));

    setViewMode('tree');
    setSelectedTab(targetSem);
    setSelectedSubjectId(targetSubjectId);
    setExpandedUnits({});
    setSelectedConceptId('');
    setSearchParams({
      sem: String(targetSem),
      subject: targetSubjectId,
    });
  };

  const openCreateModal = () => {
    setIsNewSubject(true);
    setEditingSubject({
      id: `custom-sem${numericSemForModal}-${Date.now()}`,
      semester: numericSemForModal,
      code: `IC-${numericSemForModal}09`,
      name: '',
      credits: 3,
      category: 'Core ICE',
      overview: '',
      completed: false,
      isCustom: true,
      units: [
        {
          unitNumber: 1,
          title: 'Core Theory & Principles',
          hours: 10,
          topics: [{ name: 'Foundations', subtopics: ['Key definitions', 'Engineering applications'] }],
        },
        {
          unitNumber: 2,
          title: 'Measurement & Design Analysis',
          hours: 10,
          topics: [{ name: 'Instrumentation Techniques', subtopics: ['Calibration', 'Error budgeting'] }],
        },
      ],
    });
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.name.trim() || !editingSubject.code.trim()) return;
    await saveSubject(editingSubject, isNewSubject);
    setSelectedSubjectId(editingSubject.id);
    setEditingSubject(null);
  };

  const toggleCompleted = async (subj: AcademicSubject) => {
    await saveSubject({ ...subj, completed: !subj.completed }, false);
  };

  const syllabusBadgeFor = (subjId: string): string => {
    const rich = NITJ_SUBJECT_MAP.get(subjId);
    if (rich) return rich.syllabusBadge;
    return subjId.startsWith('nitj-sem6')
      ? 'Capstone Synthesis & Placement Track'
      : 'Custom SQLite Allocation';
  };

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            NIT Jalandhar · B.Tech ICE full syllabus notes
          </p>
          <h1 className="text-[28px] font-semibold text-[var(--st-on)]">
            Instrumentation &amp; Control Syllabus Notes
          </h1>
          <p className="muted mt-1 prose-measure text-[16px]">
            Full reference notes organized by semester, subject, unit, and topic.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="seg" role="tablist" aria-label="Curriculum Explorer View">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'tree'}
              className={viewMode === 'tree' ? 'on' : ''}
              onClick={() => setViewMode('tree')}
            >
              <Layers className="mr-1.5 inline size-3.5" />
              Curriculum Tree
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'graph'}
              className={viewMode === 'graph' ? 'on' : ''}
              onClick={() => setViewMode('graph')}
            >
              <GitBranch className="mr-1.5 inline size-3.5" />
              Knowledge Graph
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'simulator'}
              className={viewMode === 'simulator' ? 'on' : ''}
              onClick={() => setViewMode('simulator')}
            >
              <MessageSquare className="mr-1.5 inline size-3.5" />
              Subject Simulator
            </button>
          </div>

          <button type="button" onClick={openCreateModal} className="btn primary">
            <Plus className="size-4" />
            Add Subject (Sem {numericSemForModal})
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Reset all editable semester allocations to the NITJ-aligned default curriculum?',
                )
              ) {
                resetSubjects();
              }
            }}
            className="btn"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </header>

      {/* Curriculum Verification & Attribution Banner */}
      <div className="sub flex items-start gap-3 border-[color-mix(in_srgb,var(--st-accent)_35%,transparent)] px-4 py-3 text-[14px]">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-[var(--st-accent-text)]" />
        <p className="text-[var(--st-on-var)]">{NITJ_SYLLABUS_BANNER}</p>
      </div>

      {/* Mode 2: Cross-Semester Knowledge Graph */}
      {viewMode === 'graph' && (
        <CrossSemesterGraph onSelectSubject={navigateToSubject} />
      )}

      {/* Mode 3: Subject-Wise Interview Simulator */}
      {viewMode === 'simulator' && (
        <SubjectInterviewSimulator initialSubjectId={activeSubject?.id} />
      )}

      {/* Mode 1: Progressive Hierarchical Curriculum Tree */}
      {viewMode === 'tree' && (
        <>
          {/* Semester & Additional Track Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="seg flex-wrap" role="tablist" aria-label="Select semester">
              {([1, 2, 3, 4, 5, 6] as const).map((sem) => {
                const count = subjects.filter(
                  (s) => s.semester === sem && s.id !== 'nitj-supp-cal',
                ).length;
                const coreTag = sem >= 3 && sem <= 5 ? ' · Core' : '';
                return (
                  <button
                    key={sem}
                    type="button"
                    role="tab"
                    aria-selected={selectedTab === sem}
                    onClick={() => {
                      setSelectedTab(sem);
                      setExpandedUnits({});
                      setSelectedConceptId('');
                      setSearchParams({ sem: String(sem) });
                    }}
                    className={selectedTab === sem ? 'on' : ''}
                  >
                    Sem {sem}
                    {coreTag}
                    <span className="mono ml-1 opacity-65">{count}</span>
                  </button>
                );
              })}

              <button
                type="button"
                role="tab"
                aria-selected={selectedTab === 'additional'}
                onClick={() => {
                  setSelectedTab('additional');
                  setExpandedUnits({});
                  setSelectedConceptId('');
                  setSearchParams({ sem: 'additional' });
                }}
                className={selectedTab === 'additional' ? 'on' : ''}
              >
                Additional &amp; Calibration
                <span className="mono ml-1 opacity-65">
                  {NITJ_CURRICULUM_SUBJECTS.filter((s) => s.semester === 'additional').length}
                </span>
              </button>
            </div>

            <span className="pill mono">
              {selectedTab === 'additional'
                ? 'Supplementary Minor & Companion Modules'
                : `Sem ${selectedTab} · ${tabSubjects.length} Subjects · ${totalCredits} Credits`}
            </span>
          </div>

          {/* Split View: Expandable Subject Cards + Collapsible Units */}
          <div className="grid gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
            <aside className="glass space-y-2.5 p-3">
              <p className="eyebrow px-2 pt-1">
                {selectedTab === 'additional'
                  ? 'SUPPLEMENTARY ELECTIVES & TRACKS'
                  : `SEMESTER ${selectedTab} SUBJECTS`}
              </p>

              {tabSubjects.map((subj) => {
                const active = activeSubject?.id === subj.id;
                const rich = NITJ_SUBJECT_MAP.get(subj.id);
                const statusColor =
                  rich?.syllabusStatus === 'official-core'
                    ? 'var(--st-accent)'
                    : rich?.syllabusStatus === 'core-code-verify' ||
                        rich?.syllabusStatus === 'supplementary-elective'
                      ? 'var(--st-amber)'
                      : 'var(--st-accent)';

                return (
                  <div
                    key={subj.id}
                    className={`ui-card p-3.5 transition ${active ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        setExpandedUnits({});
                        setSelectedConceptId('');
                        setSearchParams({
                          sem: String(selectedTab),
                          subject: subj.id,
                        });
                      }}
                      className="w-full cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[14px] font-semibold text-[var(--st-accent-text)]">
                          {subj.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="pill text-[14px]">{subj.credits} Cr</span>
                          {subj.completed && (
                            <CheckCircle2 className="size-4 text-[var(--st-accent-text)]" />
                          )}
                        </div>
                      </div>
                      <p className="mt-1.5 text-[16px] font-semibold text-[var(--st-on)]">
                        {subj.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[14px]">
                        <span
                          className="rounded-full border px-2 py-0.5"
                          style={{
                            borderColor: `color-mix(in srgb, ${statusColor} 40%, transparent)`,
                            color: statusColor,
                          }}
                        >
                          {rich ? rich.syllabusBadge.split('·')[0].trim() : subj.category}
                        </span>
                        <span className="muted">
                          {rich ? rich.units.length : subj.units.length} Units
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Drive Companion Subjects Info when browsing Additional */}
              {selectedTab === 'additional' && (
                <div className="sub mt-3 space-y-2 p-3 text-[14px]">
                  <p className="eyebrow">Companion course folders</p>
                  {DRIVE_COMPANION_COURSES.map((dc) => (
                    <div key={dc.name} className="border-t border-[var(--st-line)] pt-2">
                      <p className="text-[14px] text-[var(--st-outline)]">{dc.sem}</p>
                      <p className="font-semibold text-[var(--st-on)]">{dc.name}</p>
                      <p className="text-[14px] text-[var(--st-on-var)]">{dc.note}</p>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-1.5 border-t border-[var(--st-line)] pt-2">
                    <Link to="/applications" className="btn py-1! text-[14px]!">
                      Plant diagrams <ArrowUpRight className="size-3.5" />
                    </Link>
                    <Link to="/interview" className="btn py-1! text-[14px]!">
                      Interview Prep <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </aside>

            {activeSubject && (
              <section className="space-y-4">
                <div className="glass space-y-5 p-6">
                  {/* Subject Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--st-line)] pb-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="status"
                          style={{ '--tone': 'var(--st-accent)' } as React.CSSProperties}
                        >
                          {selectedTab === 'additional'
                            ? 'Supplementary elective'
                            : `Semester ${activeSubject.semester}`}{' '}
                          · {activeSubject.code}
                        </span>
                        <span className="pill text-[14px]">
                          {syllabusBadgeFor(activeSubject.id)}
                        </span>
                        <span className="pill text-[14px]">
                          {activeSubject.credits} Credits
                        </span>
                      </div>
                      <h2 className="text-[20px] font-semibold text-[var(--st-on)]">
                        {activeSubject.name}
                      </h2>
                      <p className="muted prose-measure text-[16px]">
                        {richDetail ? richDetail.overview : activeSubject.overview}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {richDetail && richDetail.simulatorQuestions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setViewMode('simulator')}
                          className="btn"
                        >
                          <GraduationCap className="size-3.5" />
                          Practice Interview
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleCompleted(activeSubject)}
                        className={`btn ${activeSubject.completed ? 'primary' : ''}`}
                      >
                        <CheckCircle2 className="size-3.5" />
                        {activeSubject.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewSubject(false);
                          setEditingSubject(JSON.parse(JSON.stringify(activeSubject)));
                        }}
                        className="btn"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            id: `subject:${activeSubject.id}`,
                            itemType: 'subject',
                            title: `${activeSubject.code} · ${activeSubject.name}`,
                            subtitle: `Semester ${activeSubject.semester} (${activeSubject.credits} Credits)`,
                            route: `/roadmap?sem=${selectedTab}&subject=${encodeURIComponent(activeSubject.id)}`,
                          })
                        }
                        className={`btn ${isBookmarked(`subject:${activeSubject.id}`) ? 'primary' : ''}`}
                      >
                        <BookOpen className="size-3.5" />
                        {isBookmarked(`subject:${activeSubject.id}`) ? 'Saved' : 'Bookmark'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete subject ${activeSubject.code}?`)) {
                            deleteSubject(activeSubject.id);
                          }
                        }}
                        className="btn danger"
                        aria-label="Delete subject"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Units (Collapsed by default for Progressive Disclosure) */}
                  {richDetail ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="eyebrow">
                          SYLLABUS UNITS ({richDetail.units.length}) · EXPAND A UNIT, THEN SELECT A CONCEPT
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const anyOpen = Object.values(expandedUnits).some(Boolean);
                            if (anyOpen) {
                              setExpandedUnits({});
                            } else {
                              const all: Record<number, boolean> = {};
                              for (const u of richDetail.units) all[u.unitNumber] = true;
                              setExpandedUnits(all);
                            }
                          }}
                          className="btn py-1! text-[14px]!"
                        >
                          {Object.values(expandedUnits).some(Boolean)
                            ? 'Collapse All Units'
                            : 'Expand All Units'}
                        </button>
                      </div>

                      {richDetail.units.map((unit) => {
                        const isOpen = expandedUnits[unit.unitNumber] ?? false;
                        return (
                          <div key={unit.unitNumber} className="sub overflow-hidden rounded-2xl">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedUnits((prev) => ({
                                  ...prev,
                                  [unit.unitNumber]: !isOpen,
                                }))
                              }
                              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--st-3)]"
                            >
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="rounded-full bg-[var(--st-3)] px-2.5 py-0.5 text-[14px] font-semibold text-[var(--st-accent-text)]">
                                  Unit {unit.unitNumber}
                                </span>
                                <span className="text-[16px] font-semibold text-[var(--st-on)]">
                                  {unit.title}
                                </span>
                                {unit.isExtension && (
                                  <span className="rounded-full border border-[var(--st-accent)]/40 bg-[var(--st-accent)]/10 px-2 py-0.5 text-[14px] text-[var(--st-accent-text)]">
                                    Additional Extension
                                  </span>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="muted text-[14px]">
                                  {unit.topics.length} topic{unit.topics.length > 1 ? 's' : ''} · {unit.hours}h
                                </span>
                                {isOpen ? (
                                  <ChevronDown className="size-4 text-[var(--st-outline)]" />
                                ) : (
                                  <ChevronRight className="size-4 text-[var(--st-outline)]" />
                                )}
                              </div>
                            </button>

                            {isOpen && (
                              <div className="space-y-3 border-t border-[var(--st-line)] p-4">
                                <p className="text-[14px] text-[var(--st-on-var)]">{unit.summary}</p>
                                <div className="grid gap-2.5 md:grid-cols-2">
                                  {unit.topics.map((topic) => {
                                    const activeTopic = selectedConceptId === topic.id;
                                    return (
                                      <button
                                        key={topic.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedConceptId(topic.id);
                                          setSearchParams({
                                            sem: String(selectedTab),
                                            subject: activeSubject.id,
                                            unit: String(unit.unitNumber),
                                            concept: topic.id,
                                          });
                                        }}
                                        className={`cursor-pointer rounded-2xl border p-3.5 text-left transition ${
                                          activeTopic
                                            ? 'border-[var(--st-accent)] bg-[var(--st-3)]'
                                            : 'border-[var(--st-line)] bg-[var(--st-1)] hover:border-[var(--st-accent)]/50'
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <h4 className="text-[16px] font-semibold text-[var(--st-on)]">
                                            {topic.title}
                                          </h4>
                                          <span className="shrink-0 text-[14px] text-[var(--st-accent-text)]">
                                            {activeTopic ? 'Inspecting' : 'Inspect →'}
                                          </span>
                                        </div>
                                        <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--st-on-var)]">
                                          {topic.summary}
                                        </p>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fallback for custom user subjects or Sem 6 capstone summary (collapsed by default!) */
                    <div className="space-y-3">
                      <p className="eyebrow">
                        Syllabus structure ({activeSubject.units.length} units)
                      </p>
                      {activeSubject.units.map((unit) => {
                        const isOpen = expandedUnits[unit.unitNumber] ?? false;
                        return (
                          <div key={unit.unitNumber} className="sub overflow-hidden rounded-2xl">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedUnits((prev) => ({
                                  ...prev,
                                  [unit.unitNumber]: !isOpen,
                                }))
                              }
                              className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition hover:bg-[var(--st-3)]"
                            >
                              <div className="flex items-center gap-3">
                                <span className="rounded-full bg-[var(--st-3)] px-2.5 py-0.5 text-[14px] font-semibold text-[var(--st-accent-text)]">
                                  Unit {unit.unitNumber}
                                </span>
                                <span className="text-[16px] font-semibold text-[var(--st-on)]">
                                  {unit.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="muted text-[14px]">{unit.hours} hrs</span>
                                {isOpen ? (
                                  <ChevronDown className="size-4 text-[var(--st-outline)]" />
                                ) : (
                                  <ChevronRight className="size-4 text-[var(--st-outline)]" />
                                )}
                              </div>
                            </button>

                            {isOpen && (
                              <div className="grid gap-3 border-t border-[var(--st-line)] p-4 md:grid-cols-2">
                                {unit.topics.map((topic, tIdx) => (
                                  <div
                                    key={`${topic.name}-${tIdx}`}
                                    className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="text-[16px] font-semibold text-[var(--st-on)]">
                                        {topic.name}
                                      </h4>
                                      {topic.linkedRoute && (
                                        <Link
                                          to={topic.linkedRoute}
                                          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--st-3)] px-2.5 py-0.5 text-[14px] text-[var(--st-accent-text)] hover:bg-[var(--st-4)]"
                                        >
                                          Open <ExternalLink className="size-3" />
                                        </Link>
                                      )}
                                    </div>
                                    <ul className="mt-2 space-y-1 text-[14px] text-[var(--st-on-var)]">
                                      {topic.subtopics.map((sub) => (
                                        <li key={sub} className="flex items-start gap-2">
                                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--st-accent)]" />
                                          <span>{sub}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Deep Concept Inspector when a specific subtopic/concept is chosen */}
                {richDetail && selectedConceptMatch && (
                  <ConceptInspector
                    subject={richDetail}
                    unit={selectedConceptMatch.unit}
                    concept={selectedConceptMatch.concept}
                    onNavigateSubject={navigateToSubject}
                  />
                )}
              </section>
            )}
          </div>
        </>
      )}

      {/* Edit / Create Subject Modal (Preserved SQLite Persistence) */}
      {editingSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSaveForm}
            className="glass max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--st-on)]">
                {isNewSubject
                  ? `Add Subject to Semester ${editingSubject.semester}`
                  : `Edit ${editingSubject.code}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="btn py-1!"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-1">
                <span className="label">Subject Code</span>
                <input
                  required
                  value={editingSubject.code}
                  onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                  className="field-rect"
                />
              </label>
              <label className="space-y-1">
                <span className="label">Credits (1–10)</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={editingSubject.credits}
                  onChange={(e) =>
                    setEditingSubject({
                      ...editingSubject,
                      credits: Math.min(10, Math.max(1, Number(e.target.value) || 3)),
                    })
                  }
                  className="field-rect"
                />
              </label>
              <label className="space-y-1">
                <span className="label">Category</span>
                <select
                  value={editingSubject.category}
                  onChange={(e) =>
                    setEditingSubject({
                      ...editingSubject,
                      category: e.target.value as AcademicSubject['category'],
                    })
                  }
                  className="field-rect"
                >
                  <option value="Core ICE">Core ICE</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Control & Automation">Control &amp; Automation</option>
                  <option value="Foundations">Foundations</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1">
              <span className="label">Subject Title</span>
              <input
                required
                value={editingSubject.name}
                onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                placeholder="e.g., Process Analytical Instrumentation"
                className="field-rect"
              />
            </label>

            <label className="block space-y-1">
              <span className="label">Engineering Overview</span>
              <textarea
                rows={3}
                value={editingSubject.overview}
                onChange={(e) => setEditingSubject({ ...editingSubject, overview: e.target.value })}
                className="field-rect"
              />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingSubject(null)} className="btn">
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Save to SQLite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
