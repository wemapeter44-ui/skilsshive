import './Skeleton.css'

export function Skeleton({ width = '100%', height = 16, radius = 10, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}

export function FeedSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading feed">
      <Skeleton height={150} radius={22} style={{ marginBottom: '1rem' }} />

      <div className="stat-grid">
        <Skeleton height={92} radius={22} />
        <Skeleton height={92} radius={22} />
        <Skeleton height={92} radius={22} />
        <Skeleton height={92} radius={22} />
      </div>

      <Skeleton width="40%" height={20} style={{ margin: '1.5rem 0.25rem 0.75rem' }} />

      {[1, 2].map((n) => (
        <div key={n} className="card">
          <div className="sk-post-head">
            <Skeleton width={38} height={38} radius="50%" />
            <div className="sk-post-lines">
              <Skeleton width="45%" height={14} />
              <Skeleton width="30%" height={12} />
            </div>
          </div>
          <Skeleton width="70%" height={20} style={{ marginBottom: '0.6rem' }} />
          <Skeleton height={14} style={{ marginBottom: '0.4rem' }} />
          <Skeleton width="85%" height={14} style={{ marginBottom: '0.9rem' }} />
          <Skeleton width={70} height={30} radius={999} />
        </div>
      ))}
    </div>
  )
}

export function RowsSkeleton({ count = 5 }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sk-leader-row">
          <Skeleton width={30} height={30} radius="50%" />
          <Skeleton width={38} height={38} radius="50%" />
          <div className="sk-post-lines">
            <Skeleton width="50%" height={14} />
            <Skeleton width="30%" height={12} />
          </div>
          <Skeleton width={50} height={16} />
        </div>
      ))}
    </div>
  )
}