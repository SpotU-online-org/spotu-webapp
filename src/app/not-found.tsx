import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { linkButtonVariants } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-24 text-center">
        <p className="text-7xl font-black text-primary/20 select-none">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Página no encontrada
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          La página que buscas no existe o fue movida. Vuelve al inicio para explorar SpotU.
        </p>
        <Link href="/" className={linkButtonVariants({ size: "lg" }) + " mt-8"}>
          Volver al inicio
        </Link>
      </main>
      <Footer />
    </>
  );
}
