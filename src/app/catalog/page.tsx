"use client";

import { useState, useMemo } from "react";
import catalogData from "@/data/catalog.json";
import type { MarketplaceListing, GovernanceCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ExternalLink, Search } from "lucide-react";
import Link from "next/link";

const listings = catalogData as MarketplaceListing[];

const CATEGORIES: Array<{ value: GovernanceCategory | "all"; label: string }> = [
  { value: "all", label: `All (${listings.length})` },
  ...Object.entries(CATEGORY_META).map(([key, meta]) => ({
    value: key as GovernanceCategory,
    label: `${meta.label} (${listings.filter((l) => l.category === key).length})`,
  })),
];

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GovernanceCategory | "all">("all");
  const [showRecommended, setShowRecommended] = useState(false);

  const filtered = useMemo(() => {
    let result = listings;
    if (category !== "all") {
      result = result.filter((l) => l.category === category);
    }
    if (showRecommended) {
      result = result.filter((l) => l.recommended);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.subcategory.toLowerCase().includes(q) ||
          l.governanceRelevance.summary.toLowerCase().includes(q) ||
          l.governanceRelevance.complianceFrameworks.some((f) =>
            f.toLowerCase().includes(q)
          )
      );
    }
    return result;
  }, [search, category, showRecommended]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dataset Catalog</h1>
        <p className="mt-1 text-muted-foreground">
          {listings.length} free Snowflake Marketplace datasets curated for
          governance demos
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search datasets, compliance frameworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <button
          onClick={() => setShowRecommended(!showRecommended)}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            showRecommended
              ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <Star className="h-4 w-4" />
          Our Picks ({listings.filter((l) => l.recommended).length})
        </button>
      </div>

      <Tabs
        value={category}
        onValueChange={(v) => setCategory(v as GovernanceCategory | "all")}
      >
        <TabsList className="flex-wrap h-auto gap-1">
          {CATEGORIES.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="text-xs sm:text-sm">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} dataset{filtered.length !== 1 ? "s" : ""}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => (
          <ListingCard key={listing.globalName} listing={listing} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No datasets match your filters. Try broadening your search.
        </div>
      )}
    </div>
  );
}

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const meta = CATEGORY_META[listing.category];
  return (
    <Link href={`/catalog/${listing.globalName}`}>
      <Card className="h-full transition-shadow hover:shadow-lg cursor-pointer">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              {listing.title}
            </CardTitle>
            {listing.recommended && (
              <Star className="h-4 w-4 shrink-0 fill-amber-500 text-amber-500" />
            )}
          </div>
          <CardDescription className="text-xs line-clamp-2">
            {listing.governanceRelevance.summary}
          </CardDescription>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              <span
                className={`mr-1 inline-block h-2 w-2 rounded-full ${meta.color}`}
              />
              {meta.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {listing.subcategory}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {listing.difficulty}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {listing.governanceRelevance.complianceFrameworks.map((fw) => (
              <span
                key={fw}
                className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
              >
                {fw}
              </span>
            ))}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
