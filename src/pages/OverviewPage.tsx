import { ArrowRight, Box } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  buildUnifiedNavigationTree,
  getCanonicalInstrumentUrl,
  LEARN_SEMESTERS,
} from '@/data/navigationTree';
import { getPlainDisplayName } from '@/data/simpleGuides';

export function OverviewPage() {
  const [semesterKey, setSemesterKey] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [familyKey, setFamilyKey] = useState<string | null>(null);

  const tree = useMemo(() => buildUnifiedNavigationTree(), []);
  const semester = LEARN_SEMESTERS.find((item) => item.key === semesterKey) ?? null;
  const subjects = semester
    ? semester.subjectIds
        .map((id) => tree.find((node) => node.subject.id === id))
        .filter((node): node is (typeof tree)[number] => Boolean(node))
    : [];
  const subject = subjects.find((node) => node.subject.id === subjectId) ?? null;
  const family = subject?.families.find((node) => node.family.key === familyKey) ?? null;

  const pickSemester = (key: string) => {
    setSemesterKey((current) => (current === key ? null : key));
    setSubjectId(null);
    setFamilyKey(null);
  };

  const pickSubject = (id: string) => {
    setSubjectId((current) => (current === id ? null : id));
    setFamilyKey(null);
  };

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-8 pt-4 sm:pt-8">
      <header className="space-y-2">
        <h1>What do you want to study?</h1>
        <p className="text-[16px] text-[var(--st-on-var)]">
          Start with your semester. The next choices show up only after you pick one.
        </p>
      </header>

      <section className="space-y-3">
        <h2>Which semester are you in?</h2>
        <div className="choice-row" role="listbox" aria-label="Semesters">
          {LEARN_SEMESTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={semesterKey === item.key}
              onClick={() => pickSemester(item.key)}
              className={semesterKey === item.key ? 'on' : ''}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {semester && (
        <section className="space-y-3">
          <h2>Which subject?</h2>
          <div className="choice-row" role="listbox" aria-label="Subjects">
            {subjects.map((node) => (
              <button
                key={node.subject.id}
                type="button"
                aria-pressed={subjectId === node.subject.id}
                onClick={() => pickSubject(node.subject.id)}
                className={subjectId === node.subject.id ? 'on' : ''}
              >
                {node.subject.shortName}
              </button>
            ))}
          </div>
        </section>
      )}

      {subject && semester && (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2>Open a topic</h2>
            <Link
              to={`/learn?sem=${semester.key}&subject=${encodeURIComponent(subject.subject.id)}`}
              className="text-[14px] font-semibold text-[var(--st-accent-text)] hover:underline"
            >
              Full subject notes
            </Link>
          </div>
          {subject.families.length > 0 ? (
            <div className="choice-row" role="listbox" aria-label="Topics">
              {subject.families.map((node) => (
                <button
                  key={node.family.key}
                  type="button"
                  aria-pressed={familyKey === node.family.key}
                  onClick={() =>
                    setFamilyKey((current) => (current === node.family.key ? null : node.family.key))
                  }
                  className={familyKey === node.family.key ? 'on' : ''}
                >
                  {node.family.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[16px] text-[var(--st-on-var)]">
              This subject is notes-first.{' '}
              <Link
                to={`/learn?sem=${semester.key}&subject=${encodeURIComponent(subject.subject.id)}`}
                className="font-semibold text-[var(--st-accent-text)] hover:underline"
              >
                Open the syllabus.
              </Link>
            </p>
          )}
        </section>
      )}

      {family && (
        <section className="space-y-2">
          <h2>{family.family.label}</h2>
          <div className="space-y-2">
            {family.instruments.map((entry) => (
              <Link
                key={entry.id}
                to={getCanonicalInstrumentUrl(entry.id, entry.hasDedicated3D ? '3d' : 'simple')}
                className="ui-card flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold text-[var(--st-on)]">
                    {getPlainDisplayName(entry)}
                  </span>
                  {entry.hasDedicated3D && (
                    <span className="mt-0.5 flex items-center gap-1.5 text-[14px] text-[var(--st-accent-text)]">
                      <Box className="size-3.5" />
                      Opens in 3D
                    </span>
                  )}
                </span>
                <ArrowRight className="size-4 shrink-0 text-[var(--st-accent)]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="flex flex-wrap gap-x-4 gap-y-2 text-[14px] text-[var(--st-on-var)]">
        <Link to="/browse" className="hover:text-[var(--st-on)]">
          Look up an instrument
        </Link>
        <Link to="/interview" className="hover:text-[var(--st-on)]">
          Practise interview questions
        </Link>
        <Link to="/toolbox" className="hover:text-[var(--st-on)]">
          Open the toolbox
        </Link>
      </p>
    </div>
  );
}
