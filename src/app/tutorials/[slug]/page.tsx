import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tutorials: Record<
  string,
  { title: string; difficulty: string; sections: Array<{ heading: string; text: string; sql?: string }> }
> = {
  "install-dataset": {
    title: "Install a Free Marketplace Dataset",
    difficulty: "beginner",
    sections: [
      {
        heading: "Why marketplace datasets?",
        text: "Snowflake Marketplace offers hundreds of free datasets from third-party providers. For governance demos, we've curated 107 listings that contain sensitive data patterns — PII, financial records, healthcare data, and demographic information.",
      },
      {
        heading: "Step 1: Browse the Catalog",
        text: "Go to the Dataset Catalog page in this app and filter by your area of interest. We recommend starting with one of our top picks — they're marked with a star.",
      },
      {
        heading: "Step 2: Install from Marketplace",
        text: "Click 'Install from Marketplace' on any listing card. This opens the Snowflake Marketplace in your browser. Click 'Get' to install the dataset as a shared database in your account.",
      },
      {
        heading: "Step 3: Verify the Install",
        text: "After installation, the dataset appears as a new database. Verify it's available:",
        sql: "SHOW DATABASES;\n\n-- Then explore the new database\nSHOW SCHEMAS IN DATABASE <new_database_name>;\nSHOW TABLES IN SCHEMA <new_database_name>.<schema_name>;",
      },
      {
        heading: "Step 4: Preview the Data",
        text: "Take a look at what's in the tables to understand the data before classifying it:",
        sql: "SELECT * FROM <new_database_name>.<schema_name>.<table_name> LIMIT 10;",
      },
    ],
  },
  "classify-data": {
    title: "Classify Your Data with SYSTEM$CLASSIFY",
    difficulty: "beginner",
    sections: [
      {
        heading: "What is SYSTEM$CLASSIFY?",
        text: "SYSTEM$CLASSIFY is Snowflake's built-in function that analyzes column data to detect semantic categories — like names, emails, phone numbers, SSNs, medical conditions, and more. It returns confidence scores for each detection.",
      },
      {
        heading: "Step 1: Classify a Single Table",
        text: "Run CLASSIFY against any table to get a JSON result with detected categories:",
        sql: "SELECT SYSTEM$CLASSIFY('my_database.my_schema.my_table');",
      },
      {
        heading: "Step 2: Understand the Results",
        text: "The result is a JSON object. Each column gets a classification with:\n- semantic_category: What type of data it is (NAME, EMAIL, SSN, etc.)\n- privacy_category: IDENTIFIER, QUASI_IDENTIFIER, or SENSITIVE\n- probability: Confidence score from 0 to 1\n- alternates: Other possible classifications",
      },
      {
        heading: "Step 3: Use the Governance Scanner",
        text: "For a visual experience, use the Governance Scanner page in this app. It runs CLASSIFY behind the scenes and presents results in a readable table with confidence bars and color-coded privacy categories.",
      },
      {
        heading: "Step 4: Review Privacy Categories",
        text: "Identifiers (red) are direct PII — names, SSNs, emails. Quasi-identifiers (amber) can re-identify when combined — age, gender, zip code. Sensitive information (purple) is confidential — medical conditions, salary.",
        sql: "-- Classify and extract results as a table\nSELECT\n  f.key AS column_name,\n  f.value:semantic_category::STRING AS semantic_category,\n  f.value:privacy_category::STRING AS privacy_category,\n  f.value:probability::FLOAT AS confidence\nFROM\n  TABLE(FLATTEN(\n    INPUT => PARSE_JSON(\n      SYSTEM$CLASSIFY('my_database.my_schema.my_table')\n    ):classification_result\n  )) f\nORDER BY confidence DESC;",
      },
    ],
  },
  "masking-policies": {
    title: "Apply Dynamic Masking Policies",
    difficulty: "intermediate",
    sections: [
      {
        heading: "What is Dynamic Masking?",
        text: "Dynamic masking policies control what data users see based on their role. The underlying data stays unchanged — the masking happens at query time. An ACCOUNTADMIN sees real SSNs; an ANALYST sees '***-**-****'.",
      },
      {
        heading: "Step 1: Create a Masking Policy",
        text: "Define how the column should be masked for unauthorized roles:",
        sql: "CREATE OR REPLACE MASKING POLICY my_schema.mask_email\n  AS (val STRING)\n  RETURNS STRING ->\n  CASE\n    WHEN CURRENT_ROLE() IN ('ACCOUNTADMIN', 'DATA_STEWARD') THEN val\n    ELSE '***@***.***'\n  END;",
      },
      {
        heading: "Step 2: Apply to a Column",
        text: "Attach the policy to the column that contains the sensitive data:",
        sql: "ALTER TABLE my_database.my_schema.customers\n  MODIFY COLUMN email\n  SET MASKING POLICY my_schema.mask_email;",
      },
      {
        heading: "Step 3: Test It",
        text: "Query the table as different roles to see masking in action:",
        sql: "-- As ACCOUNTADMIN - sees real data\nUSE ROLE ACCOUNTADMIN;\nSELECT email FROM my_database.my_schema.customers LIMIT 5;\n\n-- As ANALYST - sees masked data\nUSE ROLE ANALYST;\nSELECT email FROM my_database.my_schema.customers LIMIT 5;",
      },
      {
        heading: "Step 4: Use the Policy Generator",
        text: "The Policy Generator page in this app creates masking policies automatically from your scan results. It generates role-aware masks tailored to each semantic category (emails get email masks, phones get phone masks, etc.).",
      },
    ],
  },
  "row-access-policies": {
    title: "Set Up Row-Access Policies",
    difficulty: "intermediate",
    sections: [
      {
        heading: "What are Row-Access Policies?",
        text: "Row-access policies (RAPs) filter which rows a user can see. Unlike masking (which hides column values), RAPs hide entire rows. An HR analyst in the US division only sees US employee records.",
      },
      {
        heading: "Step 1: Create a Mapping Table",
        text: "Define who can see what with a mapping table:",
        sql: "CREATE TABLE my_schema.region_access (\n  role_name VARCHAR,\n  allowed_region VARCHAR\n);\n\nINSERT INTO my_schema.region_access VALUES\n  ('US_ANALYST', 'US'),\n  ('EU_ANALYST', 'EU'),\n  ('GLOBAL_ADMIN', 'US'),\n  ('GLOBAL_ADMIN', 'EU');",
      },
      {
        heading: "Step 2: Create the Row-Access Policy",
        text: "The policy returns TRUE for rows the user is allowed to see:",
        sql: "CREATE OR REPLACE ROW ACCESS POLICY my_schema.region_rap\n  AS (region_col VARCHAR)\n  RETURNS BOOLEAN ->\n  CURRENT_ROLE() = 'ACCOUNTADMIN'\n  OR EXISTS (\n    SELECT 1 FROM my_schema.region_access\n    WHERE role_name = CURRENT_ROLE()\n    AND allowed_region = region_col\n  );",
      },
      {
        heading: "Step 3: Apply to a Table",
        text: "Bind the policy to the table's region column:",
        sql: "ALTER TABLE my_database.my_schema.employees\n  ADD ROW ACCESS POLICY my_schema.region_rap\n  ON (region);",
      },
      {
        heading: "Step 4: Verify",
        text: "Query as different roles — each sees only their permitted rows:",
        sql: "USE ROLE US_ANALYST;\nSELECT COUNT(*) FROM my_database.my_schema.employees;\n-- Returns only US rows\n\nUSE ROLE EU_ANALYST;\nSELECT COUNT(*) FROM my_database.my_schema.employees;\n-- Returns only EU rows",
      },
    ],
  },
  tagging: {
    title: "Tag Objects for Governance Metadata",
    difficulty: "beginner",
    sections: [
      {
        heading: "Why Tag?",
        text: "Tags create a governance metadata layer across your Snowflake account. They let you track which columns contain PII, which tables are production vs. staging, and which databases are subject to HIPAA or GDPR.",
      },
      {
        heading: "Step 1: Use Built-in Semantic Tags",
        text: "Snowflake provides SNOWFLAKE.CORE.SEMANTIC_CATEGORY for classification results:",
        sql: "-- Tag a column with its classification result\nALTER TABLE my_database.my_schema.customers\n  MODIFY COLUMN email\n  SET TAG SNOWFLAKE.CORE.SEMANTIC_CATEGORY = 'EMAIL';",
      },
      {
        heading: "Step 2: Create Custom Tags",
        text: "Create your own tags for governance metadata beyond classification:",
        sql: "-- Create a tag for compliance frameworks\nCREATE TAG my_schema.compliance_framework\n  ALLOWED_VALUES 'HIPAA', 'GDPR', 'PCI-DSS', 'SOX', 'CCPA';\n\n-- Create a tag for data sensitivity tiers\nCREATE TAG my_schema.sensitivity_tier\n  ALLOWED_VALUES 'public', 'internal', 'confidential', 'restricted';",
      },
      {
        heading: "Step 3: Apply Tags",
        text: "Tags can be applied to databases, schemas, tables, and columns:",
        sql: "-- Tag a database\nALTER DATABASE my_database\n  SET TAG my_schema.compliance_framework = 'HIPAA';\n\n-- Tag a table\nALTER TABLE my_database.my_schema.patients\n  SET TAG my_schema.sensitivity_tier = 'restricted';\n\n-- Tag a column\nALTER TABLE my_database.my_schema.patients\n  MODIFY COLUMN ssn\n  SET TAG my_schema.sensitivity_tier = 'restricted';",
      },
      {
        heading: "Step 4: Query Tags",
        text: "Use TAG_REFERENCES to find all objects with a specific tag:",
        sql: "-- Find all objects tagged as restricted\nSELECT *\nFROM TABLE(\n  SNOWFLAKE.ACCOUNT_USAGE.TAG_REFERENCES(\n    'my_database.my_schema.sensitivity_tier',\n    'TABLE'\n  )\n);",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(tutorials).map((slug) => ({ slug }));
}

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = tutorials[slug];
  if (!tutorial) {
    return <div className="py-12 text-center text-muted-foreground">Tutorial not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/tutorials"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tutorials
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{tutorial.title}</h1>
        <Badge variant="outline">{tutorial.difficulty}</Badge>
      </div>

      <div className="space-y-6">
        {tutorial.sections.map((section, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6 space-y-3">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {section.text}
              </p>
              {section.sql && (
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                  <code>{section.sql}</code>
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
