import type { Metadata } from "next";
import "./apogee.css";

export const metadata: Metadata = {
  title: "Apogee",
};

export default function ApogeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link href="https://db.onlinewebfonts.com/c/13ab13418f633c1b0516fed6e30bedbc?family=Suisse+Int%27l" rel="stylesheet" />
      {children}
    </>
  );
}
