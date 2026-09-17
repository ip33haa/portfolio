import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  className?: string;
};

export function Icon({ icon: Glyph, label, className = "h-4 w-4" }: Props) {
  return <Glyph aria-label={label} className={className} />;
}
