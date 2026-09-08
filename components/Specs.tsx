const SPECS = [
  { label: "Movement", value: "Swiss Automatic, Powermatic 80" },
  { label: "Power reserve", value: "Up to 80 hours" },
  { label: "Case", value: "40mm brushed & polished steel" },
  { label: "Crystal", value: "Scratch-resistant sapphire" },
  { label: "Water resistance", value: "100m / 10 bar" },
  { label: "Bracelet", value: "Integrated steel, quick-release" },
];

export default function Specs() {
  return (
    <section id="specs" className="tail-fade relative px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
      <div className="mb-14 max-w-xl">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
          Specifications
        </div>
        <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
          Every figure earned on the bench, not the brief.
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-black/[0.06] sm:grid-cols-2 lg:grid-cols-3">
        {SPECS.map((spec) => (
          <div key={spec.label} className="bg-white/70 p-7 backdrop-blur-sm md:p-8">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-400)]">
              {spec.label}
            </div>
            <div className="mt-2 text-[16px] font-medium text-[var(--ink-900)]">{spec.value}</div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
