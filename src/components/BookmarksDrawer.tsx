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
      aria-label="Saved bookmarks"
      onClick={() => setBookmarksOpen(false)}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-[var(--st-line)] bg-[var(--st-0)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--st-line)] pb-4">
          <div>
            <h2>Saved ({bookmarks.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => setBookmarksOpen(false)}
            className="icon-btn"
            aria-label="Close saved list"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[14px] text-[var(--st-on-var)]">
          <span>Storage</span>
          <span
            className="status"
            style={{ '--tone': apiConnected ? 'var(--st-accent)' : 'var(--st-accent)' } as React.CSSProperties}
          >
            {apiConnected ? 'SQLite connected' : 'Saved in browser'}
          </span>
        </div>

        <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
          {bookmarks.length === 0 ? (
            <div className="sub flex flex-col items-center gap-2 p-8 text-center">
              <Bookmark className="size-6 text-[var(--st-outline)]" />
              <p className="text-[16px] font-semibold text-[var(--st-on)]">No saved pages yet</p>
              <p className="muted text-[14px]">
                Save any instrument or topic to return to it quickly.
              </p>
            </div>
          ) : (
            bookmarks.map((item) => (
              <div key={item.id} className="ui-card flex items-start justify-between gap-3 p-4">
                <Link
                  to={item.route}
                  onClick={() => setBookmarksOpen(false)}
                  className="group min-w-0 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="pill capitalize">{item.itemType}</span>
                    <ExternalLink className="size-3.5 text-[var(--st-outline)] opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <p className="mt-2 truncate text-[16px] font-semibold text-[var(--st-on)] group-hover:text-[var(--st-accent-text)]">
                    {item.title}
                  </p>
                  {item.subtitle && <p className="muted truncate text-[14px]">{item.subtitle}</p>}
                </Link>
                <button
                  type="button"
                  onClick={() => removeBookmark(item.id)}
                  className="icon-btn text-[var(--st-on-var)] hover:text-[var(--st-crimson)]"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
