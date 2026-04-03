import Link from "next/link";
import { SpotULogo } from "./SpotULogo";
import { LinkButton } from "@/components/ui/link-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <SpotULogo variant="horizontal" width={120} height={36} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/feed"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Explorar
          </Link>
          <Link
            href="/publish"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Publicar
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LinkButton href="/auth/login" variant="ghost" size="sm">
            Iniciar sesión
          </LinkButton>
          <LinkButton href="/auth/register" size="sm">
            Empieza gratis
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
