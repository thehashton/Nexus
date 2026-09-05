import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import iconOnly from "@/assets/brand/nexus-logo-icon-only.png";
import wordmarkDarkText from "@/assets/brand/nexus-logo-wide-dark-text.png";
import wordmarkWhiteText from "@/assets/brand/nexus-logo-wide-white-text.png";
import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  markClassName?: string;
  variant?: "wordmark" | "mark";
};

export function BrandWordmark({
  className,
  markClassName,
  variant = "wordmark",
}: BrandWordmarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";
  const src =
    variant === "mark"
      ? iconOnly
      : isLight
        ? wordmarkDarkText
        : wordmarkWhiteText;

  return (
    <img
      src={src}
      alt="Nexus"
      className={cn(
        "select-none",
        variant === "mark" ? "size-9 object-contain" : "h-10 w-auto object-contain",
        variant === "mark" ? markClassName : className,
      )}
    />
  );
}
