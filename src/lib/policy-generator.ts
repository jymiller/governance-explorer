import type { ClassificationResult, GeneratedPolicy } from "./types";

export function generatePolicies(
  database: string,
  schema: string,
  table: string,
  classifications: ClassificationResult[]
): GeneratedPolicy[] {
  const policies: GeneratedPolicy[] = [];
  const fqn = `${database}.${schema}.${table}`;
  const policySchema = `${database}.${schema}`;

  for (const col of classifications) {
    if (!col.semanticCategory) continue;

    const colName = col.columnName;
    const category = col.semanticCategory;
    const policyName = `MASK_${table}_${colName}`.toUpperCase();

    if (col.privacyCategory === "IDENTIFIER" || col.privacyCategory === "QUASI_IDENTIFIER") {
      const maskExpr = getMaskExpression(category);
      policies.push({
        type: "masking",
        name: policyName,
        targetColumn: colName,
        targetTable: fqn,
        description: `Dynamic masking for ${category} data in ${colName}. Full access for ACCOUNTADMIN; masked for all other roles.`,
        sql: `-- Create masking policy for ${colName} (${category})
CREATE OR REPLACE MASKING POLICY ${policySchema}.${policyName}
  AS (val STRING)
  RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('ACCOUNTADMIN') THEN val
    ELSE ${maskExpr}
  END;

-- Apply to column
ALTER TABLE ${fqn}
  MODIFY COLUMN ${colName}
  SET MASKING POLICY ${policySchema}.${policyName};`,
      });
    }

    if (col.privacyCategory === "SENSITIVE") {
      policies.push({
        type: "masking",
        name: policyName,
        targetColumn: colName,
        targetTable: fqn,
        description: `Redaction policy for sensitive ${category} data in ${colName}.`,
        sql: `-- Create redaction policy for ${colName} (${category})
CREATE OR REPLACE MASKING POLICY ${policySchema}.${policyName}
  AS (val STRING)
  RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('ACCOUNTADMIN') THEN val
    ELSE '***REDACTED***'
  END;

-- Apply to column
ALTER TABLE ${fqn}
  MODIFY COLUMN ${colName}
  SET MASKING POLICY ${policySchema}.${policyName};`,
      });
    }
  }

  // Row-access policy if there are identifiers
  const hasIdentifiers = classifications.some((c) => c.privacyCategory === "IDENTIFIER");
  if (hasIdentifiers) {
    const rapName = `RAP_${table}`.toUpperCase();
    policies.push({
      type: "row_access",
      name: rapName,
      targetTable: fqn,
      description: `Row-access policy restricting who can see records in ${table}. Grants full access to ACCOUNTADMIN; restricts others.`,
      sql: `-- Create row-access policy for ${table}
CREATE OR REPLACE ROW ACCESS POLICY ${policySchema}.${rapName}
  AS (record_owner VARCHAR)
  RETURNS BOOLEAN ->
  CURRENT_ROLE() IN ('ACCOUNTADMIN')
  OR record_owner = CURRENT_USER();

-- Apply to table (adjust column name as needed)
-- ALTER TABLE ${fqn}
--   ADD ROW ACCESS POLICY ${policySchema}.${rapName}
--   ON (owner_column);`,
    });
  }

  // Tagging
  const tagEntries = classifications.filter((c) => c.semanticCategory);
  if (tagEntries.length > 0) {
    const tagStatements = tagEntries
      .map(
        (c) =>
          `ALTER TABLE ${fqn} MODIFY COLUMN ${c.columnName} SET TAG SNOWFLAKE.CORE.SEMANTIC_CATEGORY = '${c.semanticCategory}';`
      )
      .join("\n");

    policies.push({
      type: "tagging",
      name: `TAG_${table}`,
      targetTable: fqn,
      description: `Apply Snowflake semantic category tags to all classified columns in ${table}.`,
      sql: `-- Tag classified columns in ${table}\n${tagStatements}`,
    });
  }

  return policies;
}

function getMaskExpression(category: string): string {
  switch (category) {
    case "EMAIL":
      return "'***@***.***'";
    case "PHONE_NUMBER":
    case "US_PHONE_NUMBER":
      return "'***-***-****'";
    case "NAME":
      return "'***MASKED***'";
    case "STREET_ADDRESS":
    case "US_STREET_ADDRESS":
      return "'*** MASKED ADDRESS ***'";
    case "POSTAL_CODE":
    case "US_POSTAL_CODE":
      return "'*****'";
    case "IP_ADDRESS":
      return "'***.***.***.***'";
    case "BANK_ACCOUNT":
    case "US_BANK_ACCOUNT":
      return "'****MASKED****'";
    case "PAYMENT_CARD":
      return "CONCAT('****-****-****-', RIGHT(val, 4))";
    case "US_SSN":
    case "NATIONAL_IDENTIFIER":
      return "'***-**-****'";
    default:
      return "'***MASKED***'";
  }
}
