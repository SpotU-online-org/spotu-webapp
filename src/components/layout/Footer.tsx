import Link from "next/link";
import { SpotULogo } from "./SpotULogo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <SpotULogo variant="horizontal" width={100} height={30} />
            <p className="text-sm text-muted-foreground">
              Tu spot publicitario ideal. Conectamos marcas, espacios y expertos
              en un solo lugar.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/feed"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Explorar espacios
                </Link>
              </li>
              <li>
                <Link
                  href="/publish"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Publicar
                </Link>
              </li>
              <li>
                <Link
                  href="/feed?type=agency"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Encontrar agencias
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Precios
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SpotU. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
