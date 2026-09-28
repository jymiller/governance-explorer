export type GovernanceCategory = "pii" | "financial" | "healthcare" | "demographics" | "other";
export type PolicyType = "masking" | "row_access" | "tagging";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface MarketplaceListing {
  title: string;
  globalName: string;
  url: string;
  category: GovernanceCategory;
  subcategory: string;
  governanceRelevance: {
    summary: string;
    expectedClassifications: {
      identifiers: string[];
      quasiIdentifiers: string[];
      sensitiveInfo: string[];
    };
    recommendedPolicies: PolicyType[];
    complianceFrameworks: string[];
  };
  difficulty: Difficulty;
  recommended: boolean;
  recommendationNotes?: string;
}

export interface ClassificationResult {
  columnName: string;
  semanticCategory: string | null;
  privacyCategory: string | null;
  probability: number | null;
  alternates: Array<{
    semanticCategory: string;
    privacyCategory: string;
    probability: number;
  }>;
}

export interface ScanResult {
  database: string;
  schema: string;
  table: string;
  scannedAt: string;
  columns: ClassificationResult[];
}

export interface GeneratedPolicy {
  type: PolicyType;
  name: string;
  sql: string;
  description: string;
  targetColumn?: string;
  targetTable?: string;
}

export const CATEGORY_META: Record<GovernanceCategory, { label: string; description: string; color: string }> = {
  pii: { label: "PII & Identity", description: "Personal identifiers, contact info, identity graphs", color: "bg-red-500" },
  financial: { label: "Financial", description: "Transactions, credit, banking, mortgages", color: "bg-amber-500" },
  healthcare: { label: "Healthcare", description: "Clinical data, claims, providers, pharma", color: "bg-emerald-500" },
  demographics: { label: "Demographics & Address", description: "Census, geodemographics, addresses, income", color: "bg-blue-500" },
  other: { label: "Other", description: "Government, education, real estate, business", color: "bg-purple-500" },
};
