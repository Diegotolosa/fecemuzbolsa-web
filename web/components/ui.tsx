import Link from "next/link";

export function PageHeader(props: {
  kicker?: string;
  title: string;
  children?: React.ReactNode; // texto/introducción
  tags?: string[];
}) {
  return (
    <header className="mb-10">
      {props.kicker ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {props.kicker}
        </div>
      ) : null}

      <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
        {props.title}
      </h1>

      {props.children ? (
        <div className="mt-4 space-y-4">{props.children}</div>
      ) : null}

      {props.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {props.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </header>
  );
}

export function Card(props: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "card p-6",
        "card-hover",
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </section>
  );
}

export function CardTitle(props: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={[
        "text-xl font-extrabold tracking-tight text-primary",
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </h2>
  );
}

export function CardSubtitle(props: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={[
        "mt-2 text-sm leading-relaxed text-slate-600",
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </p>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

export function Dot() {
  return <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-accent" />;
}

export function PrimaryButton(props: { href: string; children: React.ReactNode }) {
  return (
    <Link href={props.href} className="btn btn-primary">
      {props.children}
    </Link>
  );
}

export function SecondaryButton(props: { href: string; children: React.ReactNode }) {
  return (
    <Link href={props.href} className="btn btn-secondary">
      {props.children}
    </Link>
  );
}

export function TertiaryButton(props: { href: string; children: React.ReactNode }) {
  return (
    <Link href={props.href} className="btn btn-tertiary">
      {props.children}
    </Link>
  );
}

export function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold text-slate-500">{props.label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">{props.value}</p>
    </div>
  );
}
