export default function Loading() {
  return <div className="loading-page" role="status" aria-label="Loading movies"><span className="sr-only">Finding a great story for you...</span><div className="skeleton skeleton-heading" /><div className="skeleton skeleton-subtitle" /><div className="skeleton skeleton-hero" /><div className="skeleton skeleton-heading" /><div className="movie-grid">{Array.from({ length: 6 }, (_, index) => <div key={index}><div className="skeleton skeleton-poster" /><div className="skeleton skeleton-title" /></div>)}</div></div>;
}
