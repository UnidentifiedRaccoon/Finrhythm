import { createElement as h, type ReactNode } from "react";

export type EmployeeNavSection = "home" | "learning" | "challenges" | "rewards" | "profile";

export const employeeBottomNavItems: ReadonlyArray<{
  href: string;
  label: string;
  mark: EmployeeNavSection | "route" | "challenge" | "reward";
  section: EmployeeNavSection;
}> = [
  { href: "/", label: "Главная", mark: "home", section: "home" },
  { href: "/learning", label: "Обучение", mark: "route", section: "learning" },
  { href: "/challenges", label: "Челлендж", mark: "challenge", section: "challenges" },
  { href: "/rewards", label: "Награды", mark: "reward", section: "rewards" },
  { href: "/profile/session", label: "Профиль", mark: "profile", section: "profile" }
];

export function EmployeeAppHeader({ pill = "Демо без данных" }: { pill?: string }) {
  return h(
    "header",
    { className: "app-header" },
    h(
      "a",
      { className: "brand-lockup", href: "/", "aria-label": "Финпульс: главная" },
      h("span", { className: "brand-mark", "aria-hidden": "true" }, "Ф"),
      h("span", null, "Финпульс")
    ),
    h("span", { className: "demo-pill" }, pill)
  );
}

export function EmployeeBottomNav({ active }: { active: EmployeeNavSection }) {
  return h(
    "nav",
    { className: "bottom-nav", "aria-label": "Основные разделы приложения" },
    employeeBottomNavItems.map((item) =>
      h(
        "a",
        {
          key: item.section,
          href: item.href,
          "aria-current": item.section === active ? "page" : undefined
        },
        h("span", { className: `nav-mark nav-mark-${item.mark}`, "aria-hidden": "true" }),
        h("span", null, item.label)
      )
    )
  );
}

export function SecondarySupportEntry({ compact = false }: { compact?: boolean }) {
  return h(
    "section",
    {
      className: compact ? "secondary-support-entry secondary-support-entry-compact" : "secondary-support-entry",
      "aria-labelledby": "secondary-support-title"
    },
    h("p", { className: "section-label" }, "Поддержка"),
    h("h2", { id: "secondary-support-title" }, "Помощь по доступу и навигации"),
    h(
      "p",
      null,
      "Можно открыть короткую справку по входу, маршруту и разделам приложения. Личные финансовые, юридические, налоговые, кредитные или инвестиционные рекомендации здесь не даются."
    ),
    h("a", { className: "secondary-action", href: "/support" }, "Открыть поддержку")
  );
}

export function EmployeePageFrame({
  active,
  children,
  className = "",
  pill
}: {
  active: EmployeeNavSection;
  children?: ReactNode;
  className?: string;
  pill?: string;
}) {
  return h(
    "main",
    { className: `learning-page employee-app-page${className ? ` ${className}` : ""}` },
    h(
      "div",
      { className: "mobile-shell employee-app-shell" },
      h(EmployeeAppHeader, { pill }),
      h(EmployeeBottomNav, { active }),
      children
    )
  );
}
