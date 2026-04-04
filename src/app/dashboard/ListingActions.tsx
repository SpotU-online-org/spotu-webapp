"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pause, Play, Pencil, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

type ListingActionsProps = {
  listingId: string;
  status: string;
};

export function ListingActions({ listingId, status }: ListingActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleToggle() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  async function setStatus(newStatus: "active" | "paused") {
    setLoading(newStatus);
    setOpen(false);
    const supabase = createClient();
    const { error } = await supabase
      .from("listings")
      .update({ status: newStatus })
      .eq("id", listingId);
    setLoading(null);
    if (error) {
      toast("No se pudo actualizar el estado. Intenta de nuevo.", "error");
    } else {
      toast(newStatus === "active" ? "Publicación activada." : "Publicación pausada.", "success");
      router.refresh();
    }
  }

  async function deleteListing() {
    if (!confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) return;
    setLoading("delete");
    setOpen(false);
    const supabase = createClient();
    const { error } = await supabase.from("listings").delete().eq("id", listingId);
    setLoading(null);
    if (error) {
      toast("No se pudo eliminar la publicación. Intenta de nuevo.", "error");
    } else {
      toast("Publicación eliminada.", "success");
      router.refresh();
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        disabled={!!loading}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <MoreHorizontal className="h-3.5 w-3.5" />
        )}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[50]" onClick={() => setOpen(false)} />
            <div
              className="fixed z-[51] w-44 rounded-xl border bg-card shadow-lg overflow-hidden"
              style={{ top: pos.top, right: pos.right }}
            >
              <a
                href={`/listing/${listingId}/edit`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Editar
              </a>

              {status === "active" ? (
                <button
                  onClick={() => setStatus("paused")}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Pause className="h-3.5 w-3.5" /> Pausar
                </button>
              ) : (
                <button
                  onClick={() => setStatus("active")}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Play className="h-3.5 w-3.5" /> Activar
                </button>
              )}

              <div className="border-t" />
              <button
                onClick={deleteListing}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </button>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
