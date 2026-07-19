"use client";

import { useState } from "react";

/**
 * Disclosure
 * Built against the W3C ARIA Authoring Practices "Disclosure" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */

interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
}

export function Disclosure({ summary, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = "disclosure-content";

  return (
    <div className="disclosure">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="disclosure-trigger"
      >
        {summary}
      </button>
      <div id={contentId} hidden={!isOpen} className="disclosure-content">
        {children}
      </div>
    </div>
  );
}