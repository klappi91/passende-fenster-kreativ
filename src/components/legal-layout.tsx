export default function LegalLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <main id="main" className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="heading-section mb-8" style={{ color: "var(--brand-heading)" }}>
          {title}
        </h1>
        <div className="prose prose-lg max-w-none text-[var(--brand-text)] [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[var(--brand-heading)] [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_li]:mb-2 [&_a]:text-[var(--brand-primary)] [&_a]:underline hover:[&_a]:text-[var(--brand-secondary)]">
          {children}
        </div>
      </div>
    </main>
  );
}
