import { cn } from "@/lib/utils";

export default function MagicBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background h-screen w-screen">
      <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-25">
        <div
          className={cn(
            "absolute top-0 -left-40 w-96 h-96",
            "bg-primary/28 rounded-full",
            "mix-blend-multiply filter blur-[96px] sm:blur-[120px] md:blur-[128px] dark:mix-blend-soft-light",
            "animate-blob"
          )}
        />

        <div
          className={cn(
            "absolute bottom-0 -right-40 w-96 h-96",
            "bg-secondary/25 rounded-full",
            "mix-blend-multiply filter blur-[96px] sm:blur-[120px] md:blur-[128px] dark:mix-blend-soft-light",
            "animate-blob animation-delay-4000"
          )}
        />

        <div
          className={cn(
            "absolute inset-0 m-auto w-96 h-96",
            "bg-sky-400/25 rounded-full",
            "mix-blend-multiply filter blur-[96px] sm:blur-[120px] md:blur-[128px] dark:mix-blend-soft-light",
            "animate-blob animation-delay-2000"
          )}
        />
      </div>

      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
    </div>
  );
}
