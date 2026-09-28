import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";

const TUTORIALS = [
  {
    slug: "install-dataset",
    title: "Install a Free Marketplace Dataset",
    description:
      "Walk through finding and installing a governance-relevant dataset from the Snowflake Marketplace into your account.",
    difficulty: "beginner",
    duration: "5 min",
  },
  {
    slug: "classify-data",
    title: "Classify Your Data with SYSTEM$CLASSIFY",
    description:
      "Run Snowflake's built-in classification engine to detect PII, quasi-identifiers, and sensitive columns automatically.",
    difficulty: "beginner",
    duration: "10 min",
  },
  {
    slug: "masking-policies",
    title: "Apply Dynamic Masking Policies",
    description:
      "Create and apply masking policies that reveal or hide sensitive data based on the viewer's role.",
    difficulty: "intermediate",
    duration: "15 min",
  },
  {
    slug: "row-access-policies",
    title: "Set Up Row-Access Policies",
    description:
      "Implement row-level security so different roles see different subsets of data in the same table.",
    difficulty: "intermediate",
    duration: "15 min",
  },
  {
    slug: "tagging",
    title: "Tag Objects for Governance Metadata",
    description:
      "Apply Snowflake object tags and semantic category tags to build a governance metadata layer across your account.",
    difficulty: "beginner",
    duration: "10 min",
  },
];

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutorials</h1>
        <p className="mt-1 text-muted-foreground">
          Step-by-step guides to Snowflake data governance features
        </p>
      </div>

      <div className="space-y-4">
        {TUTORIALS.map((tutorial, idx) => (
          <Link key={tutorial.slug} href={`/tutorials/${tutorial.slug}`}>
            <Card className="transition-shadow hover:shadow-lg cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                  <div className="flex gap-2 pt-1">
                    <Badge variant="outline">{tutorial.difficulty}</Badge>
                    <Badge variant="secondary">{tutorial.duration}</Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
