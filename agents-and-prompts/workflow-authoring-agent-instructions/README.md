---
title: Workflow Authoring Agent Instructions
category: Agentic
type: Agent
also_includes: []
tags: [agentic-ai, ai-coding-assistants, github-copilot, cursor, claude-code, kiro, workflows, agents-md]
verticals: []
capabilities: [Dynatrace Automation, Agentic AI]
last_updated: 2026-10-20
---

# Workflow Authoring Agent Instructions

Teach your AI coding assistant to write and review correct Dynatrace workflows, instead of inventing action names and template syntax.

## What it does

[`AGENTS.md`](./AGENTS.md) is an instruction file for AI coding assistants such as GitHub Copilot, Cursor, Claude Code and Kiro. It covers:

- the three workflow formats: YAML templates for UI import and export, JSON for the API, and Terraform;
- workflow structure: metadata, tasks, conditions, triggers and `withItems` loops;
- common actions with examples, such as DQL, JavaScript, HTTP, email, Jira, Slack, Microsoft Teams, ownership and sub-workflows;
- Jinja2 template expressions;
- best practices and troubleshooting;
- a pull request review checklist covering syntax, security (no hard-coded secrets, use `secret()`), DQL and Jinja2.

## Screenshots

> **No screenshot available yet.** This is an instruction file, not a UI artifact. A screenshot of an assistant generating a workflow with these instructions would help, so please add one in a pull request.

## Prerequisites

- An AI coding assistant that reads `AGENTS.md`, or that lets you add custom instructions
- Dynatrace SaaS with Workflows, to import and test the generated workflows

## Setup

1. Download [`AGENTS.md`](./AGENTS.md).
2. Put it in the root of the repository where you keep your workflows. Assistants that support the `AGENTS.md` convention pick it up automatically. For others, add its content as custom instructions, for example `.github/copilot-instructions.md` or a Cursor rule.
3. Ask the assistant to create or review a workflow, then import the result in **Workflows** and test it.

## Configuration

- Add your own conventions, for example naming, required labels or allowed connections, so the assistant follows them too.

## Notes & limitations

- Always review generated workflows before you activate them.
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository, where it served as that repository's AI assistant guide.

## Related solutions

- [Workflows](../../workflows/): sample workflows to learn from or give to the assistant as examples
- [GitHub Custom Agent](../../agentic-ecosystem/github-custom-agent/)
