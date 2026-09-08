"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function LazyMount({
  children,
  placeholder,
  rootMargin = "200px",
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className="h-full w-full">
      {visible ? children : placeholder}
    </div>
  );
}
