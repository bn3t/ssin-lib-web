"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { ReactNode } from "react";

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  eventName?: string;
  eventProperties?: Record<string, string | number | boolean>;
  className?: string;
  onClick?: () => void;
}

export function TrackedLink({
  href,
  children,
  eventName = "link_clicked",
  eventProperties = {},
  className,
  onClick,
}: TrackedLinkProps) {
  const handleClick = () => {
    posthog.capture(eventName, {
      destination: href,
      ...eventProperties,
    });
    onClick?.();
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
