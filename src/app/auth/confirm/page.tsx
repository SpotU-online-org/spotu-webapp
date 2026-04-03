import Link from "next/link";
import { Mail } from "lucide-react";
import { linkButtonVariants } from "@/components/ui/link-button";

export default function ConfirmPage() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Revisa tu correo
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Te enviamos un enlace de confirmación. Haz clic en él para activar tu
        cuenta y comenzar a usar SpotU.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-4 text-left text-sm text-muted-foreground">
        <p className="font-medium text-foreground">¿No llegó el correo?</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Revisa tu carpeta de spam o correo no deseado</li>
          <li>Puede tardar hasta 2 minutos en llegar</li>
          <li>Asegúrate de que el correo sea correcto</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/auth/login"
          className={linkButtonVariants({ variant: "outline", size: "lg" })}
        >
          Volver a iniciar sesión
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
