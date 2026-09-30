"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { STORY_BEATS, type StoryBeat } from "@/lib/frames";
import { useScrollControl } from "@/lib/scroll-context";
import MagneticButton from "@/components/MagneticButton";

/**
 * Adjacent beats share a boundary point (this beat's range end === the next
 * beat's range start). Fading each beat in/out entirely *within its own*
 * range means both beats hit near-zero opacity right at that shared point —
 * a dead trough instead of a crossfade. Centering the fade window ON the
 * boundary instead (half on each side) makes outgoing and incoming beats
 * swap through the same window, so one is always legible.
 */
function useBeatOpacity(
  progress: MotionValue<number>,
  range: [number, number],
  isFirst: boolean,
  isLast: boolean
) {
  const [s, e] = range;
  const hw = Math.min(0.013, (e - s) / 4);
  // Pick the keyframes first so useTransform is always called exactly once.
  const [input, output] =
    isFirst && isLast
      ? [[s, e], [1, 1]]
      : isFirst
        ? [[s, e - hw, e + hw], [1, 1, 0]]
        : isLast
          ? [[s - hw, s + hw, e], [0, 1, 1]]
          : [[s - hw, s + hw, e - hw, e + hw], [0, 1, 1, 0]];
  return useTransform(progress, input, output);
}

/** Apogee-style one-time entrance choreography — plays once on page load,
 * independent of the beat's ongoing scroll-linked opacity. Only the hero
 * beat uses this; other beats already get a scroll-triggered slide/rise. */
function Reveal({ delayMs, children }: { delayMs: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
}

function Beat({
  beat,
  isFirst,
  isLast,
}: {
  beat: StoryBeat;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { progress } = useScrollControl();
  const opacity = useBeatOpacity(progress, beat.range, isFirst, isLast);
  const isHero = beat.id === "hero";

  // Mirrors useBeatOpacity's crossfade window: without an exit drift, two
  // beats briefly at equal opacity during the crossfade sit in the exact
  // same spot and visually collide. Nudging the outgoing card further along
  // its own motion (and the incoming one in from the opposite side) turns
  // the overlap into a hand-off instead of a stack.
  const [bs, be] = beat.range;
  const hw = Math.min(0.013, (be - bs) / 4);
  const axis = beat.align === "left" ? -1 : beat.align === "right" ? 1 : 0;
  const slide = useTransform(
    progress,
    [bs - hw, bs + hw, be - hw, be + hw],
    axis === 0 ? [0, 0, 0, 0] : [axis * -36, 0, 0, axis * 36]
  );
  const rise = useTransform(
    progress,
    [bs - hw, bs + hw, be - hw, be + hw],
    axis === 0 ? [18, 0, 0, -18] : [0, 0, 0, 0]
  );
  // During the (now brief) crossfade window both cards are simultaneously
  // legible at mid-opacity, which read as visual clutter — a plain opacity
  // dissolve doesn't give the eye a way to tell "arriving" from "leaving."
  // Deriving scale straight from this beat's own opacity gives the fading
  // one a soft depth cue instead. (An animated filter blur here used to
  // stack on the card's backdrop-blur over the redrawing canvas — too
  // expensive to repaint every scroll frame.)
  const cardScale = useTransform(opacity, [0, 1], [0.97, 1]);
  // The card only fades, it never unmounts — so without this a CTA at
  // opacity 0 would still be clickable and reachable by Tab. visibility:hidden
  // takes it out of the tab order, pointer hit-testing and the a11y tree
  // until its beat is actually on screen.
  const ctaVisibility = useTransform(opacity, (o) => (o > 0.5 ? "visible" : "hidden"));

  const justify =
    beat.align === "left" ? "justify-start" : beat.align === "right" ? "justify-end" : "justify-center";
  const textAlign = beat.align === "left" ? "text-left items-start" : beat.align === "right" ? "text-right items-end" : "text-center items-center";
  const verticalClass =
    beat.id === "hero"
      ? "items-start pt-[14vh]"
      : beat.id === "stress-test"
        ? "items-start pt-[20vh]"
        : beat.id === "convergence"
          ? "items-end pb-[16vh]"
          : "items-center";
  // Beats with no headline (e.g. the final stretch of the exploded-view
  // scroll) are intentionally content-free — the technical diagram is the
  // payoff there and shouldn't have a card sitting on top of it. The hooks
  // above still need to run unconditionally, so this check comes last.
  if (!beat.headline) return null;

  return (
    <motion.div
      style={{ opacity }}
      className={`story-copy pointer-events-none absolute inset-0 flex ${justify} ${verticalClass} px-6 md:px-16 lg:px-24`}
    >
      <motion.div
        style={{ x: slide, y: rise, scale: cardScale }}
        className={`flex max-w-xl flex-col gap-4 ${textAlign} ${beat.align !== "center" ? "" : "mx-auto"}`}
      >
        <div className="rounded-3xl bg-white/90 px-7 py-7 shadow-float backdrop-blur-2xl ring-1 ring-black/[0.04] md:px-9 md:py-8">
          {beat.eyebrow &&
            (isHero ? (
              <Reveal delayMs={250}>
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
                  {beat.eyebrow}
                </div>
              </Reveal>
            ) : (
              <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
                {beat.eyebrow}
              </div>
            ))}

          {isHero ? (
            <Reveal delayMs={350}>
              <h2 className="text-gradient text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight">
                {beat.headline}
              </h2>
            </Reveal>
          ) : (
            <h2 className="text-gradient text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight">
              {beat.headline}
            </h2>
          )}

          {beat.body && isHero ? (
            <Reveal delayMs={500}>
              {beat.body.map((line, i) => (
                <p key={i} className="mt-3 text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[17px]">
                  {line}
                </p>
              ))}
            </Reveal>
          ) : (
            beat.body?.map((line, i) => (
              <p key={i} className="mt-3 text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[17px]">
                {line}
              </p>
            ))
          )}

          {beat.cta && (
            <motion.div
              style={{ visibility: ctaVisibility }}
              className="pointer-events-auto mt-7 flex flex-wrap items-center gap-4 justify-center"
            >
              <MagneticButton
                href={beat.cta.primary.href}
                strength={10}
                className="btn-primary inline-block rounded-full px-7 py-3 text-[14px] font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                {beat.cta.primary.label}
              </MagneticButton>
              {beat.cta.secondary && (
                <a
                  href={beat.cta.secondary.href}
                  className="text-[14px] font-medium text-[var(--ink-900)] underline decoration-[var(--navy)]/40 underline-offset-4 transition hover:decoration-[var(--navy)]"
                >
                  {beat.cta.secondary.label}
                </a>
              )}
            </motion.div>
          )}
          {beat.micro && (
            <p className="mt-4 text-center text-[12px] text-[var(--ink-400)]">{beat.micro}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StoryBeats() {
  return (
    <>
      {STORY_BEATS.map((beat, i) => (
        <Beat
          key={beat.id}
          beat={beat}
          isFirst={i === 0}
          isLast={i === STORY_BEATS.length - 1}
        />
      ))}
      <ScrollCue />
    </>
  );
}

function ScrollCue() {
  const { progress } = useScrollControl();
  const opacity = useTransform(progress, [0, 0.05], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-8 hidden flex-col items-center gap-2 text-[var(--ink-400)] lg:flex"
    >
      <span className="text-[10px] uppercase tracking-[0.32em]">Scroll</span>
      <span className="h-8 w-px bg-current opacity-40" />
    </motion.div>
  );
}
