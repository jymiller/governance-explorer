import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  ArrowRight,
  ExternalLink,
  FileText,
  Laptop,
  Snowflake,
  Presentation,
} from "lucide-react";

/* Deck palette extracted from the Google Slides */
const C = {
  bg: "#102A43",
  card: "#1A3B57",
  cardHover: "#1F4668",
  accent: "#40CCF2",
  accentSoft: "#40CCF2aa",
  text: "#FFFFFF",
  muted: "#94B8D4",
  border: "#1F4668",
  divider: "#243E56",
  red: "#E01F29",
};

const SCHEDULE = [
  { time: "5:00 PM", label: "Arrive & find your team" },
  { time: "5:30 PM", label: "Welcome & a practical starting point" },
  { time: "5:45 PM", label: "Build with Snowflake\u2019s agentic AI products" },
  { time: "7:15 PM", label: "Show what works & share what you learned" },
  { time: "8:00 PM", label: "Wrap up" },
];

const PRODUCTS = [
  { name: "Snowflake CoCo", description: "For building and developing" },
  { name: "Cortex Agents", description: "For working with governed data and tools" },
  { name: "Snowflake CoWork", description: "The conversational workspace" },
  { name: "Cognee", description: "Memory for Snowflake agents" },
];

const CRITERIA = [
  { label: "Value Creation", description: "Does it add value to a team?" },
  { label: "Innovation", description: "Are you using the tools in new ways?" },
  { label: "Working", description: "How much did you build and get running?" },
];

export default function EventPage() {
  return (
    <div
      style={{ background: C.bg, color: C.text, minHeight: "100vh" }}
      className="-m-8 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl space-y-14">
        {/* Header */}
        <div className="space-y-5">
          <span
            style={{ color: C.accent, letterSpacing: "0.25em", fontFamily: "var(--font-label)" }}
            className="text-xs font-medium uppercase"
          >
            TONIGHT&apos;S EVENT
          </span>
          <h1
            className="text-4xl sm:text-5xl leading-tight font-bold"
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}
          >
            AI Agents for Data Teams: A Practical Mini-Hackathon
          </h1>
          <p style={{ color: C.muted }} className="text-lg leading-relaxed">
            Bring a real problem. Build something useful. Show what works.
          </p>
          <div style={{ color: C.muted }} className="flex flex-wrap gap-6 pt-1 text-sm">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Monday, Sep 28 &middot; 5:00 &ndash; 8:00 PM
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              130 Going
            </span>
          </div>
        </div>

        {/* Prep Banner */}
        <div
          style={{ background: C.card, borderLeft: `4px solid ${C.accent}` }}
          className="p-6 space-y-3"
        >
          <div className="flex items-start gap-3">
            <Presentation style={{ color: C.accent }} className="h-6 w-6 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <div className="font-semibold">Prepare your laptop before the event</div>
              <p style={{ color: C.muted }} className="text-sm leading-relaxed">
                Review the walkthrough slides for setup instructions, including how to
                create a free Snowflake trial account and configure the tools you&apos;ll use tonight.
              </p>
              <a
                href="https://docs.google.com/presentation/d/1d-K6rf1y-Y46StZJ1L_eRKYXCe0bOwM_8YWtvPhYueA/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.accent }}
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              >
                Open Google Slides
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Venue */}
        <Section label="VENUE">
          <div style={{ background: C.card }} className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin style={{ color: C.accent }} className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-semibold">Silicon Valley AI Hub</div>
                <div style={{ color: C.muted }}>
                  135 Constitution Drive, Menlo Park, CA 94025
                </div>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=37.4850527%2C-122.1762167&query_place_id=ChIJQ9d9FzWjj4ARMYpEwdiiDx0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.accent }}
              className="inline-flex items-center gap-2 text-sm hover:underline"
            >
              Open in Google Maps
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </Section>

        {/* Quick Links */}
        <Section label="QUICK LINKS">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: C.divider }}>
            <QuickLink
              href="https://luma.com/j79caynh"
              external
              icon={<ExternalLink className="h-5 w-5" />}
              title="Luma Event Page"
              sub="RSVP & share"
            />
            <QuickLink
              href="https://docs.google.com/presentation/d/1d-K6rf1y-Y46StZJ1L_eRKYXCe0bOwM_8YWtvPhYueA/edit?usp=sharing"
              external
              icon={<Presentation className="h-5 w-5" />}
              title="Setup & Walkthrough"
              sub="Google Slides"
            />
            <QuickLink
              href="/home"
              icon={<Snowflake className="h-5 w-5" />}
              title="Governance Explorer"
              sub="Milbird demo app"
            />
          </div>
        </Section>

        {/* Schedule */}
        <Section label="THE EVENING">
          <div style={{ background: C.card }}>
            {SCHEDULE.map(({ time, label }, i) => (
              <div
                key={time}
                className="flex items-baseline gap-6 p-4"
                style={{ borderTop: i > 0 ? `1px solid ${C.divider}` : undefined }}
              >
                <span
                  style={{ color: C.accent }}
                  className="w-20 shrink-0 text-sm font-medium tabular-nums"
                >
                  {time}
                </span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Products */}
        <Section label="PRODUCTS YOU'LL USE">
          <div className="grid gap-px sm:grid-cols-2" style={{ background: C.divider }}>
            {PRODUCTS.map(({ name, description }) => (
              <div key={name} style={{ background: C.card }} className="p-6 space-y-1">
                <div className="font-semibold text-sm">{name}</div>
                <div style={{ color: C.muted }} className="text-sm">{description}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Judging Criteria */}
        <Section label="HOW WORK IS REVIEWED">
          <div className="grid gap-px sm:grid-cols-3" style={{ background: C.divider }}>
            {CRITERIA.map(({ label, description }) => (
              <div key={label} style={{ background: C.card }} className="p-6 space-y-1">
                <div className="font-semibold text-sm">{label}</div>
                <div style={{ color: C.muted }} className="text-sm">{description}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* What to Bring */}
        <Section label="WHAT TO BRING">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-start gap-3">
              <Laptop style={{ color: C.muted }} className="h-5 w-5 mt-0.5" />
              <div className="text-sm">A laptop and a real data-team task</div>
            </div>
            <div className="flex items-start gap-3">
              <FileText style={{ color: C.muted }} className="h-5 w-5 mt-0.5" />
              <div className="text-sm">
                Use public, synthetic, or approved sample data you can share with your team
              </div>
            </div>
          </div>
        </Section>

        {/* Hosts & Sponsors */}
        <Section label="HOSTS & SPONSORS">
          <p style={{ color: C.muted }} className="text-sm leading-relaxed max-w-2xl">
            <strong style={{ color: C.text }}>Bay Area Snowflake User Group</strong> &mdash;
            hosted by John Miller (Milbird), Dave Nielsen, Divya Koppolu, Silicon Valley AI Hub,
            and Sahar Mor (Bond AI). Snowflake is the lead sponsor. Cognee sponsors with its
            focus on memory for AI agents.
          </p>
        </Section>

        {/* CTA */}
        <div style={{ borderTop: `1px solid ${C.divider}` }} className="pt-8">
          <span
            style={{ color: C.accent, letterSpacing: "0.25em", fontFamily: "var(--font-label)" }}
            className="text-xs font-medium uppercase block mb-4"
          >
            EXPLORE
          </span>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/home"
              style={{ background: C.accent, color: C.bg }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Open Governance Explorer
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://luma.com/j79caynh"
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: C.muted, color: C.text }}
              className="inline-flex items-center justify-center gap-2 border px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            >
              View on Luma
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span
        style={{ color: C.accent, letterSpacing: "0.25em", fontFamily: "var(--font-label)" }}
        className="text-xs font-medium uppercase block mb-4"
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function QuickLink({
  href,
  external,
  icon,
  title,
  sub,
}: {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  const inner = (
    <div style={{ background: C.card }} className="flex items-center gap-4 p-6 h-full transition-opacity hover:opacity-80">
      <span style={{ color: C.muted }}>{icon}</span>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div style={{ color: C.muted }} className="text-xs">{sub}</div>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
