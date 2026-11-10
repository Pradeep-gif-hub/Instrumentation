import { Bookmark, ExternalLink, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function BookmarksDrawer() {
  const { bookmarks, bookmarksOpen, setBookmarksOpen, removeBookmark, apiConnected } = useApp();

  if (!bookmarksOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Saved engineering bookmarks"
      onClick={() => setBookmarksOpen(false)}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-[var(--st-line)] bg-[var(--st-0)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--st-line)] pb-3">
          <div>
            <p className="eyebrow">PERSISTED LIBRARY</p>
            <h2 className="text-lg font-semibold text-[var(--st-on)]">Saved Bookmarks ({bookmarks.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => setBookmarksOpen(false)}
            className="icon-btn size-9!"
            aria-label="Close bookmarks drawer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--st-on-var)]">
          <span>Storage Sync</span>
          <span
            className="status"
            style={{ '--tone': apiConnected ? 'var(--st-phosphor)' : 'var(--st-cyan)' } as React.CSSProperties}
          >
            {apiConnected ? 'SQLite DB Connected' : 'Browser Storage Active'}
          </span>
        </div>

        <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
          {bookmarks.length === 0 ? (
            <div className="sub flex flex-col items-center gap-2 p-8 text-center">
              <Bookmark className="size-6 text-[var(--st-outline)]" />
              <p className="text-sm font-medium text-[var(--st-on)]">No saved bookmarks yet</p>
              <p className="muted text-xs">
                Bookmark any instrument guide, academic subject, or interview question for quick exam & placement revision.
              </p>
            </div>
          ) : (
            bookmarks.map((item) => (
              <div key={item.id} className="ui-card flex items-start justify-between gap-3 p-3.5">
                <Link
                  to={item.route}
                  onClick={() => setBookmarksOpen(false)}
                  className="min-w-0 flex-1 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="pill mono text-[10px] uppercase">{item.itemType}</span>
                    <ExternalLink className="size-3 text-[var(--st-outline)] opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <p className="mt-1.5 truncate text-sm font-medium text-[var(--st-on)] group-hover:text-[var(--st-cyan)]">
                    {item.title}
                  </p>
                  {item.subtitle && <p className="muted truncate text-xs">{item.subtitle}</p>}
                </Link>
                <button
                  type="button"
                  onClick={() => removeBookmark(item.id)}
                  className="icon-btn size-8! text-[var(--st-on-var)] hover:text-[var(--st-crimson)]"
                  aria-label={`Remove bookmark ${item.title}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

