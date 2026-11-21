import { ChevronRight, Folder } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEMESTER_NOTES, semesterNote, type SemesterNoteKey } from '@/data/semesterNotes';

type NoteItem = {
  id: string;
  name: string;
  kind: 'folder' | 'file';
  proof?: string;
};

type Crumb = { id: string; name: string; proof?: string };

export function NotesReaderPage() {
  const { semesterKey } = useParams();
  const semester = semesterNote(semesterKey);
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const [items, setItems] = useState<NoteItem[]>([]);
  const [folderTitle, setFolderTitle] = useState('');
  const [selected, setSelected] = useState<NoteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const current = crumbs[crumbs.length - 1];

  useEffect(() => {
    if (!semester) return;
    const root = { id: semester.folderId, name: semester.label };
    const ticket = ++requestId.current;
    let cancelled = false;
    setCrumbs([root]);
    setSelected(null);
    setItems([]);
    setLoading(true);
    setError('');
    void loadFolder(root).then((result) => {
      if (cancelled || ticket !== requestId.current) return;
      setLoading(false);
      if (result.error) {
        setItems([]);
        setError(result.error);
        return;
      }
      setFolderTitle(result.title);
      setItems(result.items);
    });
    return () => {
      cancelled = true;
    };
  }, [semester]);

  if (!semester) {
    return (
      <div className="ui-card p-6">
        <p className="text-[16px] text-[var(--st-on)]">That semester is not on the notes list.</p>
        <Link to="/notes/sem1" className="mt-3 inline-block text-[15px] font-semibold text-[var(--st-accent-text)]">
          Open Semester 1
        </Link>
      </div>
    );
  }

  async function openFolder(folder: Crumb) {
    const ticket = ++requestId.current;
    setSelected(null);
    setItems([]);
    setLoading(true);
    setError('');
    const result = await loadFolder(folder);
    if (ticket !== requestId.current) return;
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setFolderTitle(result.title);
    setItems(result.items);
    setCrumbs((path) => {
      const existing = path.findIndex((crumb) => crumb.id === folder.id);
      if (existing >= 0) return path.slice(0, existing + 1);
      return [...path, folder];
    });
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)]">
      <header className="flex flex-wrap items-center gap-2 border-b border-[var(--st-line)] px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-[14px]">
          {crumbs.map((crumb, index) => (
            <span key={crumb.id} className="flex shrink-0 items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5 text-[var(--st-outline)]" />}
              <button
                type="button"
                onClick={() => void openFolder(crumb)}
                className={`max-w-56 truncate rounded-md px-1.5 py-1 ${
                  index === crumbs.length - 1 ? 'font-semibold text-[var(--st-on)]' : 'text-[var(--st-on-var)] hover:text-[var(--st-on)]'
                }`}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
        <nav aria-label="Semesters" className="flex flex-wrap gap-1">
          {SEMESTER_NOTES.map((note) => (
            <Link
              key={note.key}
              to={`/notes/${note.key as SemesterNoteKey}`}
              aria-current={note.key === semester.key ? 'page' : undefined}
              className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                note.key === semester.key
                  ? 'bg-[var(--st-accent)] text-white'
                  : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
              }`}
            >
              {note.key === 'additional' ? 'Extra' : note.label.replace('Semester ', 'Sem ')}
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          aria-label="Note files"
          className={`${selected ? 'hidden lg:flex' : 'flex'} min-h-0 w-full shrink-0 flex-col border-[var(--st-line)] lg:w-80 lg:border-r`}
        >
          <div className="border-b border-[var(--st-line)] px-4 py-2 text-[12px] font-semibold tracking-wide text-[var(--st-on-var)]">
            {folderTitle || semester.label}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-2">
            {loading && <p className="px-2 py-3 text-[14px] text-[var(--st-on-var)]">Opening notes…</p>}
            {error && <p className="px-2 py-3 text-[14px] text-[var(--st-accent-text)]">{error}</p>}
            {!loading && !error && items.length === 0 && (
              <p className="px-2 py-3 text-[14px] text-[var(--st-on-var)]">This folder is empty.</p>
            )}
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = selected?.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      title={item.name}
                      onClick={() => {
                        if (item.kind === 'folder') {
                          void openFolder({ id: item.id, name: item.name, proof: item.proof });
                          return;
                        }
                        setSelected(item);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[14px] ${
                        active ? 'bg-[var(--st-3)] font-semibold text-[var(--st-on)]' : 'text-[var(--st-on)] hover:bg-[var(--st-2)]'
                      }`}
                    >
                      {item.kind === 'folder' ? (
                        <Folder className="size-4 shrink-0 text-[var(--st-accent-text)]" />
                      ) : (
                        <span className="w-8 shrink-0 text-[11px] font-semibold text-[var(--st-on-var)]">
                          {fileMark(item.name)}
                        </span>
                      )}
                      <span className="min-w-0 flex-1 truncate">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className={`${selected ? 'flex' : 'hidden lg:flex'} min-h-0 min-w-0 flex-1 flex-col bg-white`}>
          {selected ? (
            <>
              <div className="flex items-center gap-3 border-b border-neutral-200 px-3 py-2 lg:hidden">
                <button type="button" onClick={() => setSelected(null)} className="text-[14px] font-semibold text-neutral-700">
                  All files
                </button>
                <p className="min-w-0 flex-1 truncate text-[14px] text-neutral-800">{selected.name}</p>
              </div>
              <iframe
                key={selected.id}
                title={selected.name}
                src={`https://drive.google.com/file/d/${selected.id}/preview`}
                className="min-h-0 w-full flex-1 border-0"
                allow="fullscreen"
              />
            </>
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <p className="max-w-sm text-[16px] text-neutral-600">
                {current ? `Choose a note in ${current.name}. It opens here, full size, so you can read it on this page.` : 'Choose a note.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function fileMark(name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() ?? '';
  if (!ext || ext === name.toUpperCase() || ext.length > 4) return 'FILE';
  return ext;
}

async function loadFolder(folder: Crumb): Promise<{ title: string; items: NoteItem[]; error: string }> {
  const params = new URLSearchParams({ folder: folder.id });
  if (folder.proof) params.set('proof', folder.proof);
  try {
    const response = await fetch(`/api/notes?${params.toString()}`, { credentials: 'include' });
    const data = (await response.json().catch(() => ({}))) as { title?: string; items?: NoteItem[]; error?: string };
    if (!response.ok) return { title: '', items: [], error: data.error || 'The notes could not be opened. Try again.' };
    return { title: data.title || folder.name, items: Array.isArray(data.items) ? data.items : [], error: '' };
  } catch {
    return { title: '', items: [], error: 'The notes could not be opened. Try again.' };
  }
}
