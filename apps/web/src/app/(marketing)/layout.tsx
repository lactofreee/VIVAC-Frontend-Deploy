interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background px-4">
        <span className="text-lg font-bold tracking-tight">VIVAC</span>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
