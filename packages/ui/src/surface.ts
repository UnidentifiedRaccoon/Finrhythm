import { createElement, type ComponentPropsWithoutRef } from "react";

import { uiTokens } from "./tokens";

export type SurfaceTone = "default" | "soft" | "blue" | "success";
export type SurfaceRadius = keyof typeof uiTokens.radius;

export type SurfaceProps = ComponentPropsWithoutRef<"section"> & {
  as?: "article" | "aside" | "div" | "section";
  radius?: SurfaceRadius;
  tone?: SurfaceTone;
};

const toneClassNames: Record<SurfaceTone, string> = {
  default: "fin-ui-surface--default",
  soft: "fin-ui-surface--soft",
  blue: "fin-ui-surface--blue",
  success: "fin-ui-surface--success"
};

export function surfaceClassNames({
  className,
  radius = "lg",
  tone = "default"
}: {
  className?: string;
  radius?: SurfaceRadius;
  tone?: SurfaceTone;
} = {}) {
  return [
    "fin-ui-surface",
    toneClassNames[tone],
    `fin-ui-surface--radius-${radius}`,
    className
  ]
    .filter(Boolean)
    .join(" ");
}

export function Surface({
  as: Component = "section",
  className,
  radius = "lg",
  tone = "default",
  ...props
}: SurfaceProps) {
  return createElement(Component, {
    ...props,
    className: surfaceClassNames({ className, radius, tone })
  });
}
