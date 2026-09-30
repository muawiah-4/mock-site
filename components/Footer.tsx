"use client";

import { useState } from "react";
import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Brand",
    links: [
      { label: "About us", href: "#" },
      { label: "Men", href: "/collection" },
      { label: "Women", href: "/collection" },
      { label: "Collection", href: "/collection" },
      { label: "Straps", href: "#" },
      { label: "News", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Find a store", href: "/#stores" },
      { label: "Customer service", href: "#" },
      { label: "Stop fake", href: "#" },
      { label: "Register your watch", href: "#" },
      { label: "Corporate gift", href: "#" },
      { label: "Watch Finder", href: "/collection" },
      { label: "Check service status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Conditions of sales", href: "#" },
      { label: "Privacy notice", href: "#" },
      { label: "Cookie notice", href: "#" },
      { label: "Supplemental privacy notice", href: "#" },
      { label: "Cookie settings", href: "#" },
      { label: "Terms of use", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
  {
    title: "Help and contacts",
    links: [
      { label: "Need help?", href: "#" },
      { label: "Strap size guide", href: "#" },
      { label: "Delivery & returns conditions", href: "#" },
      { label: "Request a return", href: "#" },
      { label: "Track an order", href: "#" },
      { label: "Download an invoice", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

const COMMITMENTS = [
  {
    label: "Free delivery",
    icon: (
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    ),
  },
  {
    label: "Swiss made watches",
    icon: <path d="M4 4h16v16H4z" fill="#e8453c" />,
    isCross: true,
  },
  {
    label: "Safe & secure payments",
    icon: (
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Easy returns",
    icon: (
      <path
        d="M4 12a8 8 0 1 1 2.5 5.8M4 12v5M4 12h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const REGIONS = ["United States", "United Kingdom", "European Union", "Switzerland", "Japan"];

export default function Footer() {
  const [region, setRegion] = useState(REGIONS[0]);

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-5 text-[14px] font-medium text-white">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-white/55 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-5 text-[14px] font-medium text-white">Our commitments</p>
            <ul className="flex flex-col gap-4">
              {COMMITMENTS.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden ${
                      c.isCross ? "rounded" : ""
                    } text-white/70`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {c.icon}
                    </svg>
                  </span>
                  <span className="text-[13px] text-white/55">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-[13px] text-white/70">
            <span>🇺🇸</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              {REGIONS.map((r) => (
                <option key={r} className="bg-dark">
                  {r}
                </option>
              ))}
            </select>
            <span className="text-white/40">|</span>
            <button className="underline underline-offset-2 hover:text-white">Change country</button>
          </label>

          <div className="flex items-center gap-3 text-[13px] text-white/70">
            <span className="text-lg leading-none">+</span>
            <span>Follow us on social media</span>
            <div className="flex gap-3 text-white/55">
              <a href="#" aria-label="Instagram" className="hover:text-white">
                IG
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white">
                FB
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white">
                YT
              </a>
            </div>
          </div>

          <p className="text-[12px] text-white/55">
            &copy; {new Date().getFullYear()} Concept project &middot; Not affiliated with Tissot SA or the Swatch Group.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-hidden border-t border-white/10 px-6 py-8 md:px-10">
        <div className="flex shrink-0 items-center gap-1">
          <span className="flex h-14 w-14 items-center justify-center bg-white/10 text-3xl font-bold text-white">
            T
          </span>
          <span className="flex h-14 w-14 items-center justify-center bg-[#e8453c] text-3xl font-bold text-white">
            +
          </span>
        </div>
        <span className="select-none whitespace-nowrap text-[clamp(3rem,9vw,6.5rem)] font-bold leading-none tracking-tight text-white">
          TISSOT
        </span>
      </div>

      <p className="border-t border-white/10 px-6 py-4 text-center text-[11px] text-white/55 md:px-10">
        Concept scrollytelling experience — not an official Tissot property.
      </p>
    </footer>
  );
}
