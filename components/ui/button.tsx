import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-sisa-brand text-white hover:bg-sisa-brand/90 shadow-sm hover:shadow-md",
  ghost: "text-sisa-brand hover:bg-sisa-brand/10",
  outline:
    "border border-sisa-navy/15 text-sisa-navy hover:border-sisa-brand hover:text-sisa-brand",
  dark: "bg-sisa-navy text-white hover:bg-sisa-navy-2",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150",
    variants[variant],
    className
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
