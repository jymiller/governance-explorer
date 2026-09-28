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

const SCHEDULE = [
  { time: "5:00 PM", label: "Arrive & find your team" },
  { time: "5:30 PM", label: "Welcome & a practical starting point" },
  { time: "5:45 PM", label: "Build with Snowflake's agentic AI products" },
  { time: "7:15 PM", label: "Show what works & share what you learned" },
  { time: "8:00 PM", label: "Wrap up" },
];

const PRODUCTS = [
  {
    name: "Snowflake CoCo",
    description: "For building and developing",
  },
  {
    name: "Cortex Agents",
    description: "For working with governed data and tools",
  },
  {
    name: "Snowflake CoWork",
    description: "The conversational workspace",
  },
  {
    name: "Cognee",
    description: "Memory for Snowflake agents",
  },
];

const CRITERIA = [
  {
    label: "Value Creation",
    description: "Does it add value to a team?",
  },
  {
    label: "Innovation",
    description: "Are you using the tools in new ways?",
  },
  {
    label: "Working",
    description: "How much did you build and get running?",
  },
];

export default function EventPage() {
  return (
    <div className="space-y-16 pt-8 lg:pt-4">
      {/* Event Header */}
      <div className="space-y-6 max-w-3xl">
        <span className="section-label">TONIGHT&apos;S EVENT</span>
        <h1 className="text-4xl sm:text-5xl leading-tight">
          AI Agents for Data Teams: A Practical Mini-Hackathon
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Bring a real problem. Build something useful. Show what works.
        </p>
        <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
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
      <div className="border-2 border-brand-accent/30 bg-brand-accent/5 p-6 space-y-3">
        <div className="flex items-start gap-3">
          <Presentation className="h-6 w-6 mt-0.5 text-brand-accent shrink-0" />
          <div className="space-y-2">
            <div className="font-semibold">Prepare your laptop before the event</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Review the walkthrough slides for setup instructions, including how to
              create a free Snowflake trial account and configure the tools you&apos;ll use tonight.
            </p>
            <a
              href="https://docs.google.com/presentation/d/1d-K6rf1y-Y46StZJ1L_eRKYXCe0bOwM_8YWtvPhYueA/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
            >
              Open Google Slides
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Venue */}
      <div>
        <span className="section-label">VENUE</span>
        <div className="mt-4 border p-6 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 text-brand-accent" />
            <div>
              <div className="font-semibold">Silicon Valley AI Hub</div>
              <div className="text-muted-foreground">
                135 Constitution Drive, Menlo Park, CA 94025
              </div>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=37.4850527%2C-122.1762167&query_place_id=ChIJQ9d9FzWjj4ARMYpEwdiiDx0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline"
          >
            Open in Google Maps
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <span className="section-label">QUICK LINKS</span>
        <div className="mt-4 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://luma.com/j79caynh"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-card p-6 transition-colors hover:bg-secondary"
          >
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-brand-accent transition-colors" />
            <div>
              <div className="font-semibold text-sm">Luma Event Page</div>
              <div className="text-xs text-muted-foreground">RSVP &amp; share</div>
            </div>
          </a>
          <a
            href="https://docs.google.com/presentation/d/1d-K6rf1y-Y46StZJ1L_eRKYXCe0bOwM_8YWtvPhYueA/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-card p-6 transition-colors hover:bg-secondary"
          >
            <Presentation className="h-5 w-5 text-muted-foreground group-hover:text-brand-accent transition-colors" />
            <div>
              <div className="font-semibold text-sm">Setup &amp; Walkthrough</div>
              <div className="text-xs text-muted-foreground">Google Slides &mdash; prepare your laptop</div>
            </div>
          </a>
          <Link
            href="/home"
            className="group flex items-center gap-4 bg-card p-6 transition-colors hover:bg-secondary"
          >
            <Snowflake className="h-5 w-5 text-muted-foreground group-hover:text-brand-accent transition-colors" />
            <div>
              <div className="font-semibold text-sm">Governance Explorer</div>
              <div className="text-xs text-muted-foreground">Milbird&apos;s demo app</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <span className="section-label">THE EVENING</span>
        <div className="mt-4 space-y-0 border divide-y">
          {SCHEDULE.map(({ time, label }) => (
            <div key={time} className="flex items-baseline gap-6 p-4">
              <span className="w-20 shrink-0 text-sm font-medium text-brand-accent-soft tabular-nums">
                {time}
              </span>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <span className="section-label">PRODUCTS YOU&apos;LL USE</span>
        <div className="mt-4 grid gap-px bg-border sm:grid-cols-2">
          {PRODUCTS.map(({ name, description }) => (
            <div key={name} className="bg-card p-6 space-y-1">
              <div className="font-semibold text-sm">{name}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Judging Criteria */}
      <div>
        <span className="section-label">HOW WORK IS REVIEWED</span>
        <div className="mt-4 grid gap-px bg-border sm:grid-cols-3">
          {CRITERIA.map(({ label, description }) => (
            <div key={label} className="bg-card p-6 space-y-1">
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What to Bring */}
      <div>
        <span className="section-label">WHAT TO BRING</span>
        <div className="mt-4 flex flex-col sm:flex-row gap-6">
          <div className="flex items-start gap-3">
            <Laptop className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="text-sm">A laptop and a real data-team task</div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="text-sm">
              Use public, synthetic, or approved sample data you can share with your team
            </div>
          </div>
        </div>
      </div>

      {/* Hosts & Sponsors */}
      <div>
        <span className="section-label">HOSTS &amp; SPONSORS</span>
        <div className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          <strong className="text-foreground">Bay Area Snowflake User Group</strong> &mdash;
          hosted by John Miller (Milbird), Dave Nielsen, Divya Koppolu, Silicon Valley AI Hub,
          and Sahar Mor (Bond AI). Snowflake is the lead sponsor. Cognee sponsors with its
          focus on memory for AI agents.
        </div>
      </div>

      {/* CTA */}
      <div className="border-t pt-8">
        <span className="section-label">EXPLORE</span>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Open Governance Explorer
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://luma.com/j79caynh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            View on Luma
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
