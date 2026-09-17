import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Scene({ children, className = "" }: Props) {
  return <section className={`relative min-h-dvh w-full ${className}`}>{children}</section>;
}
