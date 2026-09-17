import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
};

export function Button({ href, variant = "primary", children, className = "", type = "button", ...rest }: Props) {
  const styles =
    variant === "primary"
      ? "border-white/20 bg-white/8 text-white hover:bg-white/14"
      : "border-white/12 bg-transparent text-white/80 hover:text-white hover:border-white/30";

  const cls = `inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase transition duration-300 hover:-translate-y-px ${styles} ${className}`;

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
