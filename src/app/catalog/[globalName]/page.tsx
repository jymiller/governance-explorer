import catalogData from "@/data/catalog.json";
import type { MarketplaceListing } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Star, ArrowLeft, ShieldCheck, Eye, Tag } from "lucide-react";
import Link from "next/link";

const listings = catalogData as MarketplaceListing[];

export function generateStaticParams() {
  return listings.map((l) => ({ globalName: l.globalName }));
}

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ globalName: string }>;
}) {
  const { globalName } = await params;
  const listing = listings.find((l) => l.globalName === globalName);
  if (!listing) {
    return <div className="py-12 text-center text-muted-foreground">Listing not found.</div>;
  }

  const meta = CATEGORY_META[listing.category];
  const { governanceRelevance: gov } = listing;

  const policyIcons: Record<string, typeof ShieldCheck> = {
    masking: Eye,
    row_access: ShieldCheck,
    tagging: Tag,
  };

  return (
    <div className="space-y-6">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            {listing.recommended && (
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <span className={`mr-1 inline-block h-2 w-2 rounded-full ${meta.color}`} />
              {meta.label}
            </Badge>
            <Badge variant="outline">{listing.subcategory}</Badge>
            <Badge variant="outline">{listing.difficulty}</Badge>
          </div>
        </div>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Install from Marketplace <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {listing.recommendationNotes && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            <Star className="h-4 w-4 fill-current" /> Recommended
          </div>
          <p className="mt-1 text-sm">{listing.recommendationNotes}</p>
        </div>
      )}

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Governance Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{gov.summary}</p>

            {gov.expectedClassifications.identifiers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                  Identifiers (PII)
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {gov.expectedClassifications.identifiers.map((c) => (
                    <Badge key={c} variant="destructive" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}

            {gov.expectedClassifications.quasiIdentifiers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Quasi-Identifiers
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {gov.expectedClassifications.quasiIdentifiers.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}

            {gov.expectedClassifications.sensitiveInfo.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Sensitive Information
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {gov.expectedClassifications.sensitiveInfo.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Policies to Apply</h4>
              <div className="mt-2 space-y-2">
                {gov.recommendedPolicies.map((p) => {
                  const Icon = policyIcons[p] || ShieldCheck;
                  return (
                    <div key={p} className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="capitalize">{p.replace("_", " ")} policy</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Compliance Frameworks</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {gov.complianceFrameworks.map((fw) => (
                  <span
                    key={fw}
                    className="rounded-md border px-2 py-1 text-xs font-medium"
                  >
                    {fw}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Next Steps</h4>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                  <a href={listing.url} target="_blank" rel="noopener noreferrer" className="underline">
                    Install this dataset
                  </a>{" "}
                  from the Snowflake Marketplace
                </li>
                <li>
                  <Link href="/scanner" className="underline">
                    Scan the tables
                  </Link>{" "}
                  with the Governance Scanner
                </li>
                <li>
                  <Link href="/policies" className="underline">
                    Generate policies
                  </Link>{" "}
                  based on scan results
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
