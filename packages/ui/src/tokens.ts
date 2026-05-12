export const uiTokens = {
  color: {
    bgPrimary: "#F6FAFE",
    bgSoft: "#EEF7FF",
    surfacePrimary: "#FFFFFF",
    surfaceBlue: "#EAF5FF",
    primary: "#1677F2",
    primaryHover: "#0F63D8",
    primarySoft: "#D8ECFF",
    cyan: "#2CC6D3",
    teal: "#2BBFA5",
    mint: "#E5F8F3",
    success: "#22B573",
    amber: "#F5B942",
    purpleSoft: "#F0ECFF",
    error: "#E84D4F",
    errorSoft: "#FFEAEA",
    warning: "#D98A00",
    warningSoft: "#FFF4DE",
    textPrimary: "#102A43",
    textSecondary: "#5D7186",
    textMuted: "#8EA4B8",
    border: "#DDEAF5",
    divider: "#EAF0F6"
  },
  font: {
    familyBase: 'Inter, Manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  text: {
    h1: {
      size: "24px",
      line: "32px",
      weight: 700
    },
    h2: {
      size: "20px",
      line: "28px",
      weight: 700
    },
    body: {
      size: "16px",
      line: "24px",
      weight: 400
    },
    caption: {
      size: "12px",
      line: "16px",
      weight: 500
    }
  },
  space: {
    "2xs": "4px",
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
    "3xl": "48px",
    "4xl": "64px"
  },
  radius: {
    xs: "8px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    round: "999px"
  },
  shadow: {
    card: "0 8px 24px rgba(16, 42, 67, 0.08)",
    soft: "0 4px 16px rgba(16, 42, 67, 0.06)",
    floating: "0 12px 32px rgba(16, 42, 67, 0.12)"
  },
  control: {
    buttonHeight: "52px",
    buttonRadius: "14px",
    inputHeight: "48px",
    inputRadius: "14px",
    bottomNavHeight: "68px"
  }
} as const;

export const cssVariableTokens = {
  "--color-bg-primary": uiTokens.color.bgPrimary,
  "--color-bg-soft": uiTokens.color.bgSoft,
  "--color-surface-primary": uiTokens.color.surfacePrimary,
  "--color-surface-blue": uiTokens.color.surfaceBlue,
  "--color-primary": uiTokens.color.primary,
  "--color-primary-hover": uiTokens.color.primaryHover,
  "--color-primary-soft": uiTokens.color.primarySoft,
  "--color-cyan": uiTokens.color.cyan,
  "--color-teal": uiTokens.color.teal,
  "--color-mint": uiTokens.color.mint,
  "--color-success": uiTokens.color.success,
  "--color-amber": uiTokens.color.amber,
  "--color-purple-soft": uiTokens.color.purpleSoft,
  "--color-error": uiTokens.color.error,
  "--color-error-soft": uiTokens.color.errorSoft,
  "--color-warning": uiTokens.color.warning,
  "--color-warning-soft": uiTokens.color.warningSoft,
  "--color-text-primary": uiTokens.color.textPrimary,
  "--color-text-secondary": uiTokens.color.textSecondary,
  "--color-text-muted": uiTokens.color.textMuted,
  "--color-border": uiTokens.color.border,
  "--color-divider": uiTokens.color.divider,
  "--font-family-base": uiTokens.font.familyBase,
  "--text-h1-size": uiTokens.text.h1.size,
  "--text-h1-line": uiTokens.text.h1.line,
  "--text-h1-weight": String(uiTokens.text.h1.weight),
  "--text-h2-size": uiTokens.text.h2.size,
  "--text-h2-line": uiTokens.text.h2.line,
  "--text-h2-weight": String(uiTokens.text.h2.weight),
  "--text-body-size": uiTokens.text.body.size,
  "--text-body-line": uiTokens.text.body.line,
  "--text-body-weight": String(uiTokens.text.body.weight),
  "--text-caption-size": uiTokens.text.caption.size,
  "--text-caption-line": uiTokens.text.caption.line,
  "--text-caption-weight": String(uiTokens.text.caption.weight),
  "--space-2xs": uiTokens.space["2xs"],
  "--space-xs": uiTokens.space.xs,
  "--space-sm": uiTokens.space.sm,
  "--space-md": uiTokens.space.md,
  "--space-lg": uiTokens.space.lg,
  "--space-xl": uiTokens.space.xl,
  "--space-2xl": uiTokens.space["2xl"],
  "--space-3xl": uiTokens.space["3xl"],
  "--space-4xl": uiTokens.space["4xl"],
  "--radius-xs": uiTokens.radius.xs,
  "--radius-sm": uiTokens.radius.sm,
  "--radius-md": uiTokens.radius.md,
  "--radius-lg": uiTokens.radius.lg,
  "--radius-xl": uiTokens.radius.xl,
  "--radius-2xl": uiTokens.radius["2xl"],
  "--radius-round": uiTokens.radius.round,
  "--shadow-card": uiTokens.shadow.card,
  "--shadow-soft": uiTokens.shadow.soft,
  "--shadow-floating": uiTokens.shadow.floating,
  "--button-height": uiTokens.control.buttonHeight,
  "--button-radius": uiTokens.control.buttonRadius,
  "--input-height": uiTokens.control.inputHeight,
  "--input-radius": uiTokens.control.inputRadius,
  "--bottom-nav-height": uiTokens.control.bottomNavHeight
} as const;

export type UiTokens = typeof uiTokens;
export type CssVariableName = keyof typeof cssVariableTokens;
