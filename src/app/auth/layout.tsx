import Link from "next/link";
import { SpotULogo } from "@/components/layout/SpotULogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal top bar */}
      <header className="flex h-16 items-center px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <SpotULogo variant="horizontal" width={100} height={30} />
        </Link>
      </header>

      {/* Decorative gradient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/6 blur-3xl" />
      </div>

      {/* Content */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} SpotU. Todos los derechos reservados.
      </footer>
    </div>
  );
}
