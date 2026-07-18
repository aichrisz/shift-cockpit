/** Pulse placeholder cards shown while list boots from storage. */
export function ListSkeleton() {
  return (
    <div className="list-skeleton" aria-busy="true" aria-live="polite">
      <div className="skeleton-toolbar">
        <div className="skeleton-bar skeleton-bar-btn" />
        <div className="skeleton-bar skeleton-bar-btn-sm" />
      </div>
      <div className="skeleton-filter">
        <div className="skeleton-bar skeleton-chip" />
        <div className="skeleton-bar skeleton-chip" />
        <div className="skeleton-bar skeleton-chip" />
      </div>
      <ul className="handover-list" role="presentation">
        {[0, 1, 2].map((i) => (
          <li key={i} className="handover-card skeleton-card">
            <div className="skeleton-card-body">
              <div className="skeleton-bar skeleton-title" />
              <div className="skeleton-bar skeleton-meta" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
