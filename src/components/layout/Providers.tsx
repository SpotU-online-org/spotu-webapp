"use client";

import { type ReactNode } from "react";
import { I18nProvider } from "./LanguageToggle";

export function Providers({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
