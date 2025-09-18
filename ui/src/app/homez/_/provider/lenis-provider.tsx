"use client";

import { ReactLenis } from "lenis/react";

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ReactLenis root>{children}</ReactLenis>;
};
