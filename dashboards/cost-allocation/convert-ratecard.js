/**
 * Converts AMP-ratecard.txt to ratecard.json.
 * Output format mirrors the formattedRateCard structure produced by workflow.js.
 *
 * Expected input format: paste the rate card table from the Account Management Portal.
 * Each capability entry spans 7 lines:
 *   1. Capability name
 *   2. Start date  (MM/DD/YYYY)
 *   3. End date    (MM/DD/YYYY)
 *   4. Price       (e.g. "USD 200.00" or "USD 4.00K")
 *   5. Quote ID    (e.g. "Q-410754")
 *   6. Unit        (e.g. "Per 100,000 host-hours")
 *   7. Deployment  (SaaS or Managed)
 */

const fs = require('fs');
const path = require('path');

// Maps item names from the AMP page to capability keys (same keys used in workflow.js)
const nameToKey = {
  "AppEngine Functions - Small":                          "COMPUTE",
  "Standard Function Call":                               "COMPUTE",
  "Automation Workflow":                                  "AUTOMATIONS",
  "Browser Monitor or Clickpath":                         "SYNTHETIC_MONITORING_BROWSER",
  "HTTP Monitor":                                         "SYNTHETIC_MONITORING_HTTP",
  "Real User Monitoring":                                 "USER_SESSIONS",
  "Real User Monitoring Property":                        "USER_SESSION_PROPERTIES",
  "Real User Monitoring with Session Replay":             "USER_SESSION_REPLAYS",
  "Third-Party Synthetic API Ingestion":                  "SYNTHETIC_MONITORING_THIRD_PARTY",
  "Code Monitoring":                                      "CODE_MONITORING",
  "Kubernetes Platform Monitoring":                       "KUBERNETES_OPERATIONS",
  "Custom Events Classic":                                "CUSTOM_EVENTS_CLASSIC",
  "Custom Metrics Classic":                               "CUSTOM_METRICS_CLASSIC",
  "Custom Traces Classic":                                "CUSTOM_TRACES_CLASSIC",
  "Log Monitoring Classic":                               "LOG_MONITORING_CLASSIC",
  "Serverless Functions Classic":                         "SERVERLESS_FUNCTIONS_CLASSIC",
  "Events - Ingest & Process":                            "EVENTS_INGEST",
  "Events - Query":                                       "EVENTS_ANALYZE",
  "Events - Retain":                                      "EVENTS_RETAIN",
  "Foundation & Discovery":                               "FOUNDATION_AND_DISCOVERY",
  "Full-Stack Monitoring":                                "FULLSTACK_MONITORING",
  "Infrastructure Monitoring":                            "INFRASTRUCTURE_MONITORING",
  "Mainframe Monitoring":                                 "MAINFRAME_MONITORING",
  "Log Management & Analytics - Ingest & Process":        "LOG_MANAGEMENT_INGEST",
  "Log Management & Analytics - Query":                   "LOG_MANAGEMENT_ANALYZE",
  "Log Management & Analytics - Retain":                  "LOG_MANAGEMENT_RETAIN",
  "Log Management & Analytics - Retain with Included Queries": "LOG_MANAGEMENT_RETAIN_WIQ",
  "Metrics - Ingest & Process":                           "METRICS_INGEST",
  "Metrics - Query":                                      "METRICS_QUERY",
  "Metrics - Retain":                                     "METRICS_RETAIN",
  "Runtime Application Protection":                       "RUNTIME_APPLICATION_PROTECTION",
  "Runtime Vulnerability Analytics":                      "RUNTIME_VULNERABILITY_ANALYTICS",
  "Security Posture Management":                          "SECURITY_POSTURE_MANAGEMENT",
  "Traces - Ingest & Process":                            "TRACE_INGEST",
  "Traces - Query":                                       "TRACE_QUERY",
  "Traces - Retain":                                      "TRACE_RETAIN",
};

// Category and unitName metadata — mirrors the template object in workflow.js
const template = {
  "AUTOMATIONS":                    { Category: "Automation",                               unitName: "workflow-hours" },
  "COMPUTE":                        { Category: "AppEngine Functions",                       unitName: "invocations" },
  "SYNTHETIC_MONITORING_BROWSER":   { Category: "Digital Experience Monitoring",             unitName: "synthetic actions" },
  "SYNTHETIC_MONITORING_HTTP":      { Category: "Digital Experience Monitoring",             unitName: "synthetic requests" },
  "SYNTHETIC_MONITORING_THIRD_PARTY":{ Category: "Digital Experience Monitoring",            unitName: "third-party synthetic results" },
  "USER_SESSIONS":                  { Category: "Digital Experience Monitoring",             unitName: "sessions" },
  "USER_SESSION_PROPERTIES":        { Category: "Digital Experience Monitoring",             unitName: "properties per session" },
  "USER_SESSION_REPLAYS":           { Category: "Digital Experience Monitoring",             unitName: "session replay captures" },
  "CODE_MONITORING":                { Category: "Container Observability",                   unitName: "Container-hour" },
  "KUBERNETES_OPERATIONS":          { Category: "Container Observability",                   unitName: "pod-hours" },
  "CUSTOM_EVENTS_CLASSIC":          { Category: "Platform Extensions",                       unitName: "custom events" },
  "CUSTOM_METRICS_CLASSIC":         { Category: "Platform Extensions",                       unitName: "metric data points" },
  "CUSTOM_TRACES_CLASSIC":          { Category: "Platform Extensions",                       unitName: "spans" },
  "LOG_MONITORING_CLASSIC":         { Category: "Platform Extensions",                       unitName: "log records" },
  "SERVERLESS_FUNCTIONS_CLASSIC":   { Category: "Platform Extensions",                       unitName: "invocations" },
  "EVENTS_INGEST":                  { Category: "Events powered by Grail",                   unitName: "gibibytes" },
  "EVENTS_ANALYZE":                 { Category: "Events powered by Grail",                   unitName: "gibibytes-scanned" },
  "EVENTS_RETAIN":                  { Category: "Events powered by Grail",                   unitName: "gibibyte-days" },
  "FOUNDATION_AND_DISCOVERY":       { Category: "Application and Infrastructure Observability", unitName: "host-hours" },
  "FULLSTACK_MONITORING":           { Category: "Application and Infrastructure Observability", unitName: "memory-gibibyte-hours" },
  "INFRASTRUCTURE_MONITORING":      { Category: "Application and Infrastructure Observability", unitName: "host-hours" },
  "MAINFRAME_MONITORING":           { Category: "Application and Infrastructure Observability", unitName: "MSU-hours" },
  "LOG_MANAGEMENT_INGEST":          { Category: "Log Analytics",                             unitName: "gibibytes" },
  "LOG_MANAGEMENT_ANALYZE":         { Category: "Log Analytics",                             unitName: "gibibytes-scanned" },
  "LOG_MANAGEMENT_RETAIN":          { Category: "Log Analytics",                             unitName: "gibibyte-days" },
  "LOG_MANAGEMENT_RETAIN_WIQ":      { Category: "Log Analytics",                             unitName: "gibibyte-days" },
  "METRICS_INGEST":                 { Category: "Metrics powered by Grail",                  unitName: "metric data points" },
  "METRICS_QUERY":                  { Category: "Metrics powered by Grail",                  unitName: "gibibytes-scanned" },
  "METRICS_RETAIN":                 { Category: "Metrics powered by Grail",                  unitName: "gibibyte-days" },
  "RUNTIME_APPLICATION_PROTECTION": { Category: "Application Security",                      unitName: "memory-gibibyte-hours" },
  "RUNTIME_VULNERABILITY_ANALYTICS":{ Category: "Application Security",                      unitName: "memory-gibibyte-hours" },
  "SECURITY_POSTURE_MANAGEMENT":    { Category: "Application Security",                      unitName: "host-hours" },
  "TRACE_INGEST":                   { Category: "Traces powered by Grail",                   unitName: "gibibytes" },
  "TRACE_QUERY":                    { Category: "Traces powered by Grail",                   unitName: "gibibytes-scanned" },
  "TRACE_RETAIN":                   { Category: "Traces powered by Grail",                   unitName: "gibibyte-days" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePrice(raw) {
  let s = raw.trim().replace(/,/g, '');
  const kMatch = s.match(/^(\d+(?:\.\d+)?)K$/i);
  if (kMatch) return (Number.parseFloat(kMatch[1]) * 1000).toFixed(2);
  const n = Number.parseFloat(s);
  return Number.isNaN(n) ? s : n.toFixed(2);
}

const DATE_RE       = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
const PRICE_LINE_RE = /^([A-Z]{3})\s+([\d.,]+(?:[KkMm])?)$/;
const QUOTE_RE      = /^Q-\d+/;
const UNIT_RE       = /^Per\s+/i;

// ── Parse ─────────────────────────────────────────────────────────────────────

const inputPath  = path.join(__dirname, 'AMP-ratecard.txt');
const outputPath = path.join(__dirname, 'price-point.json');

const text  = fs.readFileSync(inputPath, 'utf8');
const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const formattedRateCard = [];
const seen = new Set();
let detectedCurrency = null;

let i = 0;
while (i < lines.length) {
  const name = lines[i];
  const key  = nameToKey[name];

  if (!key) { i++; continue; }

  // Look for a valid 7-line block starting at i
  if (i + 6 >= lines.length) { i++; continue; }

  const startDate  = lines[i + 1];
  const endDate    = lines[i + 2];
  const priceLine  = lines[i + 3];
  const quoteLine  = lines[i + 4];
  const unitLine   = lines[i + 5];
  // lines[i + 6] is deployment type (SaaS / Managed) — not used in output

  const priceMatch = priceLine.match(PRICE_LINE_RE);

  if (
    !DATE_RE.test(startDate) ||
    !DATE_RE.test(endDate)   ||
    !priceMatch              ||
    !QUOTE_RE.test(quoteLine)||
    !UNIT_RE.test(unitLine)
  ) {
    i++;
    continue;
  }

  const currencyCode = priceMatch[1];
  if (!detectedCurrency) detectedCurrency = currencyCode;

  const price = parsePrice(priceMatch[2]);

  const priceUnitMatch = unitLine.match(/[\d,]+/);
  const priceUnit = priceUnitMatch ? priceUnitMatch[0].replace(/,/g, '') : '1';

  if (!seen.has(key)) {
    seen.add(key);
    const meta = template[key] || { Category: 'Uncategorized', unitName: 'units' };
    formattedRateCard.push({ key, name, price, Category: meta.Category, unitName: meta.unitName, priceUnit, currencyCode });
  }

  i += 7;
}

if (detectedCurrency) console.log(`Detected currency: ${detectedCurrency}`);
fs.writeFileSync(outputPath, JSON.stringify(formattedRateCard, null, 2), 'utf8');
console.log(`✓ Wrote ${formattedRateCard.length} items to ${outputPath}`);
