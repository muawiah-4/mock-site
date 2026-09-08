export default function SectionDivider() {
  return (
    <div className="bg-[var(--bg-0)] py-2 md:py-4" aria-hidden>
      <div className="section-divider">
        <span className="line" />
        <span className="mark" />
        <span className="line" />
      </div>
    </div>
  );
}
