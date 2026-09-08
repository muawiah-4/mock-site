/**
 * Canonical product-photo frame. Every real photo we have comes from a
 * different source with a different native crop and resolution — this
 * normalizes them to the same apparent size and clarity by always showing
 * the full, uncropped image (object-contain) on a plain white ground with
 * consistent padding, the way Tissot's own catalog photography is framed.
 */
export default function ProductPhoto({
  src,
  alt,
  padding = "13%",
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  padding?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative h-full w-full bg-white ${className}`}>
      <div className="absolute inset-0" style={{ padding }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-contain ${imgClassName}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
