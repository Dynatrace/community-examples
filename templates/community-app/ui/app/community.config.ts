/**
 * Community app settings. Set `repoUrl` to the GitHub repository of THIS app.
 * "Report issue" in the help menu opens `${repoUrl}/issues`.
 * (The check script fails while the placeholder is still in place.)
 */
export const community = {
  repoUrl: "https://github.com/Dynatrace/community-examples",
} as const;

export const issuesUrl = `${community.repoUrl}/issues`;
