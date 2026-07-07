export function EventCard({ title, text, featured = false }: { title: string; text: string; featured?: boolean }) {
  return (
    <article className={`broadcast-card ${featured ? 'featured' : ''}`}>
      <div className="broadcast-top"><span aria-hidden="true">🦜📡</span><b>Forest News Bulletin</b></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
