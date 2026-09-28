import Link from "next/link";
import {
  Database,
  ScanSearch,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SECTIONS = [
  {
    href: "/catalog",
    icon: Database,
    title: "Dataset Catalog",
    number: "01",
    description:
      "108 free Snowflake Marketplace datasets curated for governance demos. Filtered by PII, financial, healthcare, and demographic categories.",
  },
  {
    href: "/scanner",
    icon: ScanSearch,
    title: "Governance Scanner",
    number: "02",
    description:
      "Run Snowflake CLASSIFY against any table to detect PII, quasi-identifiers, and sensitive columns with confidence scores.",
  },
  {
    href: "/policies",
    icon: ShieldCheck,
    title: "Policy Generator",
    number: "03",
    description:
      "Auto-generate masking policies, row-access policies, and object tags from classification results.",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    number: "04",
    description:
      "Visual overview of governance coverage \u2014 classified vs. unclassified columns, policy gaps, and compliance posture.",
  },
  {
    href: "/tutorials",
    icon: BookOpen,
    title: "Tutorials",
    number: "05",
    description:
      "Step-by-step guides: install a dataset, classify columns, apply masking, set up row-access policies, and tag objects.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 pt-8 lg:pt-4">
      <div className="space-y-6 max-w-2xl">
        <span className="section-label">GOVERNANCE EXPLORER</span>
        <h1 className="text-4xl sm:text-5xl leading-tight">
          Classify, protect, and monitor sensitive data in Snowflake.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A hands-on toolkit for Snowflake data governance. Discover free
          marketplace datasets rich in sensitive data, classify columns
          automatically, generate protection policies, and track your coverage.
        </p>
        <div className="flex gap-8 pt-4">
          <Stat value="108" label="Free Datasets" />
          <Stat value="5" label="Categories" />
          <Stat value="4" label="Governance Tools" />
        </div>
      </div>

      <div>
        <span className="section-label">TOOLS</span>
        <div className="mt-4 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map(({ href, icon: Icon, title, number, description }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full border-0 bg-card transition-colors group-hover:bg-secondary shadow-none">
                <CardHeader className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-brand-accent-soft">{number}</span>
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-brand-accent transition-colors" />
                  </div>
                  <CardTitle className="text-lg not-italic font-semibold" style={{ fontFamily: "var(--font-sans)", fontStyle: "normal" }}>
                    {title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">{description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t pt-8">
        <span className="section-label">GET STARTED</span>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Browse Datasets
          </Link>
          <Link
            href="/tutorials/install-dataset"
            className="inline-flex items-center justify-center border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Read the Tutorials
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
