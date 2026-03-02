"use client";

import { useState } from "react";

interface TocLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export function TocLink({ href, children, active = false }: TocLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="transition-colors block"
      style={{
        color: active || isHovered ? "#171717" : "#666666",
        fontSize: "14px",
        fontWeight: active || isHovered ? 600 : 400,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}
