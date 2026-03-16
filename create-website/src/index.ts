#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import crypto from "crypto";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// ─── Constants ───────────────────────────────────────────────────────────────

const PAYLOAD_ONLY = [
  "src/collections",
  "src/globals",
  "src/components/payload",
  "src/app/(payload)",
  "src/app/api/site-routes",
  "src/app/api/contact",
  "src/app/api/newsletter",
  "src/lib/syncPages.ts",
  "src/lib/getSiteRoutes.ts",
  "src/lib/generateAltText.ts",
  "src/lib/email.ts",
  "src/lib/cms/payload.ts",
  "src/payload.config.ts",
  "src/payload-types.ts",
  "src/app/(payload)/admin/importMap.js",
];

const SANITY_ONLY = [
  "src/sanity",
  "src/app/studio",
  "src/lib/cms/sanity.ts",
];

const PAYLOAD_DEPS = [
  "payload",
  "@payloadcms/db-vercel-postgres",
  "@payloadcms/email-resend",
  "@payloadcms/next",
  "@payloadcms/plugin-import-export",
  "@payloadcms/richtext-lexical",
  "@payloadcms/storage-vercel-blob",
  "@payloadcms/ui",
  "resend",
  "@anthropic-ai/sdk",
];

const SANITY_DEPS = [
  "sanity",
  "next-sanity",
  "@sanity/image-url",
  "@sanity/vision",
];

// ─── Utility helpers ─────────────────────────────────────────────────────────

/** Run a command and return trimmed stdout. Returns null on failure. */
function run(cmd: string, opts?: { cwd?: string }): string | null {
  try {
    return execSync(cmd, { stdio: "pipe", cwd: opts?.cwd }).toString().trim();
  } catch {
    return null;
  }
}

/** Run a command with full stdio passthrough (for interactive auth flows). */
function runInteractive(cmd: string, opts?: { cwd?: string }) {
  execSync(cmd, { stdio: "inherit", cwd: opts?.cwd });
}

/** Check if a CLI tool is available on PATH. */
function isInstalled(cmd: string): boolean {
  return run(`which ${cmd}`) !== null;
}

/** The scaffolded project directory — set once cloning starts. */
let scaffoldedDir: string | null = null;

/** Clean up scaffolded directory and exit. */
function abort(message = "Cancelled."): never {
  if (scaffoldedDir && fs.existsSync(scaffoldedDir)) {
    fs.rmSync(scaffoldedDir, { recursive: true, force: true });
  }
  p.cancel(message);
  process.exit(0);
}

/** Prompt to cancel or continue when something is missing. */
async function cancelOrContinue(message: string): Promise<boolean> {
  const result = await p.confirm({ message, initialValue: true });
  if (p.isCancel(result)) abort();
  return result as boolean;
}

// ─── Tool management ─────────────────────────────────────────────────────────

interface ToolDef {
  name: string;
  cmd: string;
  brewPkg?: string;
  bunPkg?: string;
}

const TOOLS: Record<string, ToolDef> = {
  gh: {
    name: "GitHub CLI",
    cmd: "gh",
    brewPkg: "gh",
  },
  vercel: {
    name: "Vercel CLI",
    cmd: "vercel",
    bunPkg: "vercel",
  },
  neonctl: {
    name: "Neon CLI",
    cmd: "neonctl",
    bunPkg: "neonctl",
  },
  sanity: {
    name: "Sanity CLI",
    cmd: "sanity",
    bunPkg: "sanity",
  },
};

/** Ensure Homebrew is installed, offering to install it if missing. Returns false if unavailable. */
async function ensureBrew(s: ReturnType<typeof p.spinner>): Promise<boolean> {
  if (isInstalled("brew")) return true;

  const shouldInstall = await cancelOrContinue(
    "Homebrew is needed to install some tools. Install it now?",
  );
  if (!shouldInstall) return false;

  s.start("Installing Homebrew...");
  try {
    execSync(
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
      { stdio: "inherit" },
    );
  } catch {
    s.stop("Failed to install Homebrew");
    return false;
  }

  // Add Homebrew to PATH for this process (Apple Silicon + Intel paths)
  const brewDirs = ["/opt/homebrew/bin", "/opt/homebrew/sbin", "/usr/local/bin", "/usr/local/sbin"];
  const currentPath = process.env.PATH || "";
  const newDirs = brewDirs.filter((d) => !currentPath.includes(d));
  if (newDirs.length > 0) {
    process.env.PATH = `${newDirs.join(":")}:${currentPath}`;
  }

  if (!isInstalled("brew")) {
    s.stop("Homebrew installed but not found on PATH. Restart your terminal and try again.");
    return false;
  }

  s.stop("Homebrew installed");
  return true;
}

/** Ensure a CLI tool is installed, offering to install it. Returns false if unavailable. */
async function ensureTool(key: string, s: ReturnType<typeof p.spinner>): Promise<boolean> {
  const tool = TOOLS[key];
  if (isInstalled(tool.cmd)) return true;

  const shouldInstall = await cancelOrContinue(
    `${tool.name} (${tool.cmd}) is not installed. Install it now?`,
  );
  if (!shouldInstall) return false;

  // Determine install command
  let installCmd: string;
  if (tool.bunPkg) {
    installCmd = `bun add -g ${tool.bunPkg}`;
  } else if (tool.brewPkg) {
    if (!(await ensureBrew(s))) return false;
    installCmd = `brew install ${tool.brewPkg}`;
  } else {
    return false;
  }

  s.start(`Installing ${tool.name}...`);
  const result = run(installCmd);
  if (result === null) {
    s.stop(`Failed to install ${tool.name}`);
    return false;
  }
  s.stop(`${tool.name} installed`);
  return true;
}

async function ensureAuth(
  toolName: string,
  checkCmd: string,
  authCmd: string,
  s: ReturnType<typeof p.spinner>,
): Promise<boolean> {
  s.start(`Checking ${toolName} authentication...`);
  if (run(checkCmd) !== null) {
    s.stop(`${toolName} authenticated`);
    return true;
  }
  s.stop(`${toolName} not authenticated`);

  const shouldAuth = await cancelOrContinue(
    `You need to log in to ${toolName}. Log in now?`,
  );
  if (!shouldAuth) return false;

  p.log.info(`Running ${pc.cyan(authCmd)} — follow the prompts:`);
  try {
    runInteractive(authCmd);
  } catch {
    p.log.error(`${toolName} authentication failed.`);
    return false;
  }

  // Verify auth worked
  if (run(checkCmd) !== null) {
    p.log.success(`${toolName} authenticated`);
    return true;
  }
  p.log.error(`${toolName} still not authenticated.`);
  return false;
}

// ─── Org/team selection helpers ─────────────────────────────────────────────

async function selectGitHubOrg(): Promise<string | null> {
  const output = run('gh api /user/orgs --jq ".[].login"');
  if (!output) return null;

  const orgs = output.split("\n").filter(Boolean);
  if (orgs.length === 0) return null;

  const selected = await p.select({
    message: "Which GitHub account?",
    options: [
      { value: "__personal__", label: "Personal account" },
      ...orgs.map((org) => ({ value: org, label: org })),
    ],
  });
  if (p.isCancel(selected)) abort();
  return selected === "__personal__" ? null : (selected as string);
}

async function selectVercelTeam(): Promise<string | null> {
  const output = run("vercel team ls 2>/dev/null");
  if (!output) return null;

  // Extract team slugs — try bullet format "● slug (Name)" and table format
  const teams: { slug: string; name: string }[] = [];
  for (const line of output.split("\n")) {
    const match = line.match(/[●○]\s+(\S+)\s*(?:\((.+?)\))?/);
    if (match) {
      teams.push({ slug: match[1], name: match[2] || match[1] });
    }
  }

  // Fallback: try table format
  if (teams.length === 0) {
    for (const line of output.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || /^(id|name|slug|─|>|\d+ teams?)/i.test(trimmed)) continue;
      const parts = trimmed.split(/\s{2,}/);
      if (parts.length >= 1 && /^[a-z0-9][\w-]*$/.test(parts[0])) {
        teams.push({ slug: parts[0], name: parts[1] || parts[0] });
      }
    }
  }

  if (teams.length === 0) return null;

  const selected = await p.select({
    message: "Which Vercel account?",
    options: [
      { value: "__personal__", label: "Personal account" },
      ...teams.map((t) => ({
        value: t.slug,
        label: t.name !== t.slug ? `${t.name} (${t.slug})` : t.slug,
      })),
    ],
  });
  if (p.isCancel(selected)) abort();
  return selected === "__personal__" ? null : (selected as string);
}

async function selectNeonOrg(): Promise<string | null> {
  const output = run("neonctl orgs list --output json 2>/dev/null");
  if (!output) return null;

  try {
    const data = JSON.parse(output);
    const orgs = Array.isArray(data) ? data : data.orgs || data.organizations || [];
    if (orgs.length === 0) return null;

    const selected = await p.select({
      message: "Which Neon organization?",
      options: [
        { value: "__personal__", label: "Personal account" },
        ...orgs.map((org: any) => ({
          value: org.id || org.org_id,
          label: org.name || org.id,
        })),
      ],
    });
    if (p.isCancel(selected)) abort();
    return selected === "__personal__" ? null : (selected as string);
  } catch {
    return null;
  }
}

// ─── Service setup functions ─────────────────────────────────────────────────

async function setupGitHub(
  projectName: string,
  targetDir: string,
  s: ReturnType<typeof p.spinner>,
): Promise<string | null> {
  if (!(await ensureTool("gh", s))) return null;
  if (!(await ensureAuth("GitHub", "gh auth status", "gh auth login", s))) return null;

  const existing = await p.select({
    message: "GitHub repository:",
    options: [
      { value: "create", label: "Create a new repo", hint: projectName },
      { value: "existing", label: "Use an existing repo" },
      { value: "skip", label: "Skip GitHub setup" },
    ],
  });
  if (p.isCancel(existing)) abort();

  if (existing === "skip") return null;

  if (existing === "existing") {
    const repoUrl = await p.text({
      message: "Enter the GitHub repo URL:",
      placeholder: `https://github.com/yourorg/${projectName}`,
      validate: (v) => {
        if (!v) return "Repo URL is required";
      },
    });
    if (p.isCancel(repoUrl)) abort();
    s.start("Linking to existing repo...");
    run(`git remote add origin ${repoUrl}`, { cwd: targetDir });
    s.stop("Linked to existing repo");
    return repoUrl as string;
  }

  // Create new repo — ask for org first
  const ghOrg = await selectGitHubOrg();

  const visibility = await p.select({
    message: "Repository visibility:",
    options: [
      { value: "private", label: "Private" },
      { value: "public", label: "Public" },
    ],
  });
  if (p.isCancel(visibility)) abort();

  const repoFullName = ghOrg ? `${ghOrg}/${projectName}` : projectName;
  s.start(`Creating GitHub repo ${pc.cyan(repoFullName)}...`);
  const result = run(
    `gh repo create ${repoFullName} --${visibility} --source . --remote origin`,
    { cwd: targetDir },
  );
  if (result === null) {
    s.stop("Failed to create GitHub repo");
    return null;
  }
  s.stop(`GitHub repo created: ${pc.cyan(repoFullName)}`);

  // Get the repo URL
  const repoUrl = run("gh repo view --json url -q .url", { cwd: targetDir });
  return repoUrl;
}

async function setupNeon(
  projectName: string,
  s: ReturnType<typeof p.spinner>,
): Promise<string | null> {
  if (!(await ensureTool("neonctl", s))) return null;
  if (!(await ensureAuth("Neon", "neonctl me", "neonctl auth", s))) return null;

  const existing = await p.select({
    message: "Neon database:",
    options: [
      { value: "create", label: "Create a new database", hint: projectName },
      { value: "existing", label: "Use an existing database" },
      { value: "skip", label: "Skip database setup" },
    ],
  });
  if (p.isCancel(existing)) abort();

  if (existing === "skip") return null;

  if (existing === "existing") {
    const connStr = await p.text({
      message: "Paste your Neon connection string (POSTGRES_URL):",
      placeholder: "postgresql://user:pass@host/dbname?sslmode=require",
      validate: (v) => {
        if (!v) return "Connection string is required";
        if (!v.startsWith("postgres")) return "Must be a PostgreSQL connection string";
      },
    });
    if (p.isCancel(connStr)) abort();
    return connStr as string;
  }

  // Ask for org
  const neonOrgId = await selectNeonOrg();

  // Create new project
  s.start(`Creating Neon database ${pc.cyan(projectName)}...`);
  const orgFlag = neonOrgId ? ` --org-id ${neonOrgId}` : "";
  const output = run(
    `neonctl projects create --name ${projectName}${orgFlag} --output json`,
  );
  if (!output) {
    s.stop("Failed to create Neon database");
    p.log.warn("Try creating a Neon project manually at https://console.neon.tech");
    return null;
  }

  try {
    const data = JSON.parse(output);

    // Try to get connection string directly from creation output
    const connStr =
      data.connection_uris?.[0]?.connection_uri ||
      data.connection_uri ||
      null;
    if (connStr) {
      s.stop(`Neon database created: ${pc.cyan(projectName)}`);
      return connStr;
    }

    // Fall back to getting project ID and fetching connection string separately
    const projectId = data.project?.id || data.id;
    if (projectId) {
      const csOutput = run(
        `neonctl connection-string ${projectId}${orgFlag}`,
      );
      if (csOutput && csOutput.startsWith("postgres")) {
        s.stop(`Neon database created: ${pc.cyan(projectName)}`);
        return csOutput;
      }
    }

    s.stop("Neon project created but couldn't get connection string");
    p.log.warn(
      "Get your connection string from https://console.neon.tech or run:\n" +
        "  neonctl connection-string",
    );
    return null;
  } catch {
    // The output might not be JSON — could be the connection string itself
    if (output.startsWith("postgres")) {
      s.stop(`Neon database created: ${pc.cyan(projectName)}`);
      return output;
    }
    s.stop("Neon project created but couldn't parse output");
    p.log.info(`Raw output: ${output}`);
    return null;
  }
}

async function setupSanityProject(
  projectName: string,
  s: ReturnType<typeof p.spinner>,
): Promise<{ projectId: string; dataset: string } | null> {
  if (!(await ensureTool("sanity", s))) return null;
  if (!(await ensureAuth("Sanity", "sanity whoami", "sanity login", s))) return null;

  const existing = await p.select({
    message: "Sanity project:",
    options: [
      { value: "create", label: "Create a new Sanity project", hint: projectName },
      { value: "existing", label: "Use an existing project" },
      { value: "skip", label: "Skip Sanity setup" },
    ],
  });
  if (p.isCancel(existing)) abort();

  if (existing === "skip") return null;

  if (existing === "existing") {
    const projectId = await p.text({
      message: "Enter your Sanity project ID:",
      placeholder: "abc123xy",
      validate: (v) => {
        if (!v) return "Project ID is required";
      },
    });
    if (p.isCancel(projectId)) abort();

    const dataset = await p.text({
      message: "Dataset name:",
      placeholder: "production",
      initialValue: "production",
    });
    if (p.isCancel(dataset)) abort();

    return { projectId: projectId as string, dataset: dataset as string };
  }

  // Create new project
  s.start(`Creating Sanity project ${pc.cyan(projectName)}...`);
  const output = run(
    `sanity projects create "${projectName}" --output json`,
  );
  if (!output) {
    s.stop("Failed to create Sanity project");
    return null;
  }

  try {
    const data = JSON.parse(output);
    const projectId = data.projectId || data.id;
    if (!projectId) {
      s.stop("Sanity project created but couldn't get project ID");
      return null;
    }

    // Create production dataset
    run(`sanity dataset create production --project ${projectId}`);
    s.stop(`Sanity project created: ${pc.cyan(projectId)}`);
    return { projectId, dataset: "production" };
  } catch {
    s.stop("Sanity project created but couldn't parse output");
    return null;
  }
}

async function setupVercel(
  projectName: string,
  targetDir: string,
  repoUrl: string | null,
  s: ReturnType<typeof p.spinner>,
): Promise<{ url: string | null; scope: string | null }> {
  if (!(await ensureTool("vercel", s))) return { url: null, scope: null };
  if (!(await ensureAuth("Vercel", "vercel whoami", "vercel login", s)))
    return { url: null, scope: null };

  const existing = await p.select({
    message: "Vercel project:",
    options: [
      { value: "create", label: "Create a new Vercel project", hint: projectName },
      { value: "existing", label: "Link to an existing project" },
      { value: "skip", label: "Skip Vercel setup" },
    ],
  });
  if (p.isCancel(existing)) abort();

  if (existing === "skip") return { url: null, scope: null };

  // Ask for team selection
  const vercelTeam = await selectVercelTeam();
  const scopeFlag = vercelTeam ? ` --scope ${vercelTeam}` : "";

  if (existing === "existing") {
    s.start("Linking to existing Vercel project...");
    try {
      runInteractive(`vercel link --yes${scopeFlag}`, { cwd: targetDir });
      s.stop("Linked to Vercel project");
    } catch {
      s.stop("Failed to link Vercel project");
      return { url: null, scope: vercelTeam };
    }
    return { url: `https://${projectName}.vercel.app`, scope: vercelTeam };
  }

  // Create new project
  s.start(`Creating Vercel project ${pc.cyan(projectName)}...`);

  // Use vercel link to create/connect the project
  const result = run(
    `vercel link --yes --project ${projectName}${scopeFlag}`,
    { cwd: targetDir },
  );
  if (result === null) {
    // vercel link might fail if project doesn't exist — create it first
    run(`vercel project add ${projectName}${scopeFlag}`, { cwd: targetDir });
    run(`vercel link --yes --project ${projectName}${scopeFlag}`, { cwd: targetDir });
  }
  s.stop(`Vercel project created: ${pc.cyan(projectName)}`);

  // Pin Node.js version to 22.x LTS
  try {
    execSync(
      `vercel env add NODE_VERSION production preview development --yes${scopeFlag}`,
      { input: "22.x\n", cwd: targetDir, stdio: ["pipe", "pipe", "pipe"] },
    );
  } catch { /* may already exist */ }

  // Connect GitHub repo for auto-deploy
  if (repoUrl) {
    s.start("Connecting Vercel to GitHub for auto-deploy...");
    const connected = run(`vercel git connect --yes${scopeFlag}`, { cwd: targetDir });
    if (connected !== null) {
      s.stop("Vercel connected to GitHub — pushes will auto-deploy");
    } else {
      s.stop("Could not auto-connect — link GitHub in the Vercel dashboard");
    }
  }

  return { url: `https://${projectName}.vercel.app`, scope: vercelTeam };
}

async function pushEnvToVercel(
  envVars: Record<string, string>,
  targetDir: string,
  scope: string | null,
  s: ReturnType<typeof p.spinner>,
) {
  s.start("Pushing environment variables to Vercel...");
  const scopeFlag = scope ? ` --scope ${scope}` : "";
  let pushed = 0;
  for (const [key, value] of Object.entries(envVars)) {
    if (!value) continue;
    try {
      // Use execSync with input option to pipe value via stdin
      execSync(
        `vercel env add ${key} production preview development --yes${scopeFlag}`,
        {
          input: value + "\n",
          cwd: targetDir,
          stdio: ["pipe", "pipe", "pipe"],
        },
      );
      pushed++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) continue;
      p.log.warn(`Failed to push ${key}: ${msg.split("\n")[0]}`);
    }
  }
  s.stop(`Pushed ${pushed} env var(s) to Vercel`);
}

async function askAnthropicKey(): Promise<string | null> {
  const setup = await p.select({
    message: "Anthropic API key (for AI alt text):",
    options: [
      { value: "enter", label: "Enter API key now" },
      { value: "skip", label: "Skip — set up later" },
    ],
  });
  if (p.isCancel(setup)) abort();

  if (setup === "skip") return null;

  const key = await p.text({
    message: "Paste your Anthropic API key:",
    placeholder: "sk-ant-...",
    validate: (v) => {
      if (!v) return "API key is required";
    },
  });
  if (p.isCancel(key)) abort();
  return key as string;
}

// ─── Template configuration ──────────────────────────────────────────────────

function configureTemplate(
  targetDir: string,
  cms: string,
  projectName: string,
) {
  // Remove the CLI tool directory from the scaffolded project
  fs.rmSync(path.join(targetDir, "create-website"), {
    recursive: true,
    force: true,
  });

  // Delete files for the CMS we're NOT using
  const filesToDelete = cms === "payload" ? SANITY_ONLY : PAYLOAD_ONLY;
  for (const file of filesToDelete) {
    const fullPath = path.join(targetDir, file);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }

  // Update the CMS index to export the right adapter
  const cmsIndexPath = path.join(targetDir, "src/lib/cms/index.ts");
  const adapterImport =
    cms === "payload"
      ? 'export { payloadAdapter as cms } from "./payload";'
      : 'export { sanityAdapter as cms } from "./sanity";';

  fs.writeFileSync(
    cmsIndexPath,
    `/**
 * CMS abstraction layer.
 * Frontend pages import from this file — never directly from Payload or Sanity.
 */

export type {
  Page,
  CMSImage,
  SiteSettings,
  AnalyticsSettings,
  SocialLinks,
} from "./types";

${adapterImport}
`,
  );

  // Clean up package.json — remove deps for the other CMS
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const depsToRemove = cms === "payload" ? SANITY_DEPS : PAYLOAD_DEPS;

  for (const dep of depsToRemove) {
    delete pkg.dependencies?.[dep];
    delete pkg.devDependencies?.[dep];
  }
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  // For Sanity: update next.config.ts and tsconfig.json
  if (cms === "sanity") {
    fs.writeFileSync(
      path.join(targetDir, "next.config.ts"),
      `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
`,
    );

    const tsconfigPath = path.join(targetDir, "tsconfig.json");
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
    delete tsconfig.compilerOptions?.paths?.["@payload-config"];
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
  }

  // Update the home page CMS link
  const homePath = path.join(targetDir, "src/app/(frontend)/page.tsx");
  if (fs.existsSync(homePath)) {
    let homeContent = fs.readFileSync(homePath, "utf-8");
    if (cms === "sanity") {
      homeContent = homeContent.replace('href="/admin"', 'href="/studio"');
    }
    fs.writeFileSync(homePath, homeContent);
  }

  // Write project name into CMS defaults
  if (cms === "payload") {
    const settingsPath = path.join(targetDir, "src/globals/SiteSettings.ts");
    if (fs.existsSync(settingsPath)) {
      let content = fs.readFileSync(settingsPath, "utf-8");
      // Update siteName default
      content = content.replace(
        'defaultValue: "My Site"',
        `defaultValue: "${projectName}"`,
      );
      fs.writeFileSync(settingsPath, content);
    }
  } else {
    const settingsPath = path.join(
      targetDir,
      "src/sanity/schemas/siteSettings.ts",
    );
    if (fs.existsSync(settingsPath)) {
      let content = fs.readFileSync(settingsPath, "utf-8");
      content = content.replace(
        'initialValue: "My Site"',
        `initialValue: "${projectName}"`,
      );
      fs.writeFileSync(settingsPath, content);
    }
  }
}

function writeEnvFile(
  targetDir: string,
  cms: string,
  envVars: Record<string, string>,
) {
  const lines = [
    "# Site",
    `NEXT_PUBLIC_SITE_URL=${envVars.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}`,
    `NEXT_PUBLIC_GA_ID=`,
    "",
  ];

  if (cms === "payload") {
    lines.push(
      "# Payload CMS",
      `POSTGRES_URL=${envVars.POSTGRES_URL || ""}`,
      `PAYLOAD_SECRET=${envVars.PAYLOAD_SECRET || ""}`,
      `BLOB_READ_WRITE_TOKEN=${envVars.BLOB_READ_WRITE_TOKEN || ""}`,
      `RESEND_API_KEY=${envVars.RESEND_API_KEY || ""}`,
      `ANTHROPIC_API_KEY=${envVars.ANTHROPIC_API_KEY || ""}`,
      `RESEND_FROM_EMAIL=`,
      `FORM_NOTIFICATION_EMAIL=`,
    );
  } else {
    lines.push(
      "# Sanity CMS",
      `NEXT_PUBLIC_SANITY_PROJECT_ID=${envVars.NEXT_PUBLIC_SANITY_PROJECT_ID || ""}`,
      `NEXT_PUBLIC_SANITY_DATASET=${envVars.NEXT_PUBLIC_SANITY_DATASET || "production"}`,
      `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`,
      `ANTHROPIC_API_KEY=${envVars.ANTHROPIC_API_KEY || ""}`,
      `RESEND_FROM_EMAIL=`,
      `FORM_NOTIFICATION_EMAIL=`,
    );
  }

  // Write both .env.local (actual) and .env.example (template)
  fs.writeFileSync(path.join(targetDir, ".env.local"), lines.join("\n") + "\n");

  // .env.example has empty values
  const exampleLines = lines.map((line) => {
    if (line.startsWith("#") || line === "") return line;
    const [key] = line.split("=");
    // Keep defaults for non-secret values
    if (key.startsWith("NEXT_PUBLIC_SANITY_DATASET")) return line;
    if (key.startsWith("NEXT_PUBLIC_SANITY_API_VERSION")) return line;
    if (key.startsWith("NEXT_PUBLIC_SITE_URL"))
      return `${key}=http://localhost:3000`;
    return `${key}=`;
  });
  fs.writeFileSync(
    path.join(targetDir, ".env.example"),
    exampleLines.join("\n") + "\n",
  );
}

// ─── Main flow ───────────────────────────────────────────────────────────────

async function main() {
  p.intro(pc.bgCyan(pc.black(" create-website ")));

  // 1. Project name
  const projectName =
    process.argv[2] ||
    ((await p.text({
      message: "What is your project name?",
      placeholder: "my-site",
      validate: (v) => {
        if (!v) return "Project name is required";
        if (!/^[a-z0-9-]+$/.test(v))
          return "Use lowercase letters, numbers, and hyphens only";
      },
    })) as string);

  if (p.isCancel(projectName)) abort();

  // 2. Choose CMS
  const cms = (await p.select({
    message: "Which CMS do you want to use?",
    options: [
      {
        value: "payload",
        label: "Payload CMS",
        hint: "self-hosted, integrated with Next.js",
      },
      {
        value: "sanity",
        label: "Sanity",
        hint: "hosted service, Sanity Studio",
      },
    ],
  })) as string;

  if (p.isCancel(cms)) abort();

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    p.cancel(`Directory ${pc.cyan(projectName)} already exists.`);
    process.exit(1);
  }

  const s = p.spinner();

  // 3. Check prerequisites — Homebrew is needed for GitHub CLI
  // If declined, GitHub CLI setup will be skipped later
  await ensureBrew(s);

  // 4. Clone template
  s.start("Cloning starter template...");
  execSync(
    `git clone --depth 1 https://github.com/sitekickcodes/website-starter.git ${targetDir}`,
    { stdio: "pipe" },
  );
  fs.rmSync(path.join(targetDir, ".git"), { recursive: true, force: true });
  scaffoldedDir = targetDir;
  s.stop("Cloned template");

  // 5. Configure template for chosen CMS
  s.start(
    `Configuring for ${cms === "payload" ? "Payload CMS" : "Sanity"}...`,
  );
  configureTemplate(targetDir, cms, projectName);
  s.stop(`Configured for ${cms === "payload" ? "Payload CMS" : "Sanity"}`);

  // 6. Install dependencies first (needed before git init for lockfile)
  s.start("Installing dependencies...");
  try {
    execSync("bun install", { cwd: targetDir, stdio: "pipe" });
    s.stop("Dependencies installed");
  } catch {
    s.stop("Dependency install failed — run `bun install` manually");
  }

  // 7. Init git (needed before GitHub setup)
  s.start("Initializing git...");
  execSync("git init", { cwd: targetDir, stdio: "pipe" });
  execSync("git add -A", { cwd: targetDir, stdio: "pipe" });
  execSync('git commit -m "Initial commit from create-website"', {
    cwd: targetDir,
    stdio: "pipe",
  });
  s.stop("Git initialized");

  // Collect env vars as we go
  const envVars: Record<string, string> = {};

  // ─── GitHub setup ────────────────────────────────────────────────────────

  p.log.step(pc.bold("GitHub"));
  const repoUrl = await setupGitHub(projectName, targetDir, s);

  // ─── Database / CMS-specific setup ───────────────────────────────────────

  if (cms === "payload") {
    // Neon database
    p.log.step(pc.bold("Neon Database"));
    const postgresUrl = await setupNeon(projectName, s);
    if (postgresUrl) envVars.POSTGRES_URL = postgresUrl;

    // Generate PAYLOAD_SECRET
    envVars.PAYLOAD_SECRET = crypto.randomBytes(32).toString("hex");
    p.log.success("Generated PAYLOAD_SECRET");
  } else {
    // Sanity project
    p.log.step(pc.bold("Sanity"));
    const sanityInfo = await setupSanityProject(projectName, s);
    if (sanityInfo) {
      envVars.NEXT_PUBLIC_SANITY_PROJECT_ID = sanityInfo.projectId;
      envVars.NEXT_PUBLIC_SANITY_DATASET = sanityInfo.dataset;
    }
  }

  // ─── Vercel setup ────────────────────────────────────────────────────────

  p.log.step(pc.bold("Vercel"));
  const { url: deployUrl, scope: vercelScope } = await setupVercel(projectName, targetDir, repoUrl, s);
  if (deployUrl) {
    envVars.NEXT_PUBLIC_SITE_URL = deployUrl;
  }

  // ─── OpenAI setup ────────────────────────────────────────────────────────

  p.log.step(pc.bold("Anthropic (optional)"));
  const anthropicKey = await askAnthropicKey();
  if (anthropicKey) envVars.ANTHROPIC_API_KEY = anthropicKey;

  // ─── Write env files ────────────────────────────────────────────────────

  s.start("Writing environment files...");
  writeEnvFile(targetDir, cms, envVars);
  s.stop("Environment files written");

  // ─── Push env vars to Vercel ─────────────────────────────────────────────

  const isVercelLinked = fs.existsSync(path.join(targetDir, ".vercel"));
  if (isVercelLinked && Object.keys(envVars).length > 0) {
    const shouldPush = await cancelOrContinue(
      "Push environment variables to Vercel?",
    );
    if (shouldPush) {
      await pushEnvToVercel(envVars, targetDir, vercelScope, s);
    }
  }

  // ─── Commit env.example and push ─────────────────────────────────────────

  // Commit the .env.example (not .env.local)
  run("git add .env.example", { cwd: targetDir });
  run('git commit -m "Add .env.example with project configuration"', {
    cwd: targetDir,
  });

  if (repoUrl) {
    s.start("Pushing to GitHub...");
    const pushResult = run("git push -u origin main", { cwd: targetDir });
    if (pushResult !== null) {
      s.stop("Pushed to GitHub — Vercel will auto-deploy");
    } else {
      // Try 'master' if 'main' fails
      const pushMaster = run("git push -u origin master", { cwd: targetDir });
      if (pushMaster !== null) {
        s.stop("Pushed to GitHub — Vercel will auto-deploy");
      } else {
        s.stop("Push failed — run `git push` manually");
      }
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  const nextSteps = [`cd ${projectName}`];

  const missingVars: string[] = [];
  if (cms === "payload") {
    if (!envVars.POSTGRES_URL) missingVars.push("POSTGRES_URL");
    if (!envVars.BLOB_READ_WRITE_TOKEN) missingVars.push("BLOB_READ_WRITE_TOKEN (Vercel Blob)");
  } else {
    if (!envVars.NEXT_PUBLIC_SANITY_PROJECT_ID) missingVars.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  }

  if (missingVars.length > 0) {
    nextSteps.push(`# Set up missing env vars in .env.local:`);
    for (const v of missingVars) nextSteps.push(`#   ${v}`);
  }

  if (cms === "payload") {
    nextSteps.push(
      "# Add Vercel Blob storage in the Vercel dashboard",
      "# Copy BLOB_READ_WRITE_TOKEN to .env.local",
    );
  }

  nextSteps.push("bun dev");
  nextSteps.push(
    `# Visit ${cms === "payload" ? "/admin" : "/studio"} to create your first user`,
  );

  p.note(nextSteps.join("\n"), "Next steps");

  const summary: string[] = [];
  if (repoUrl) summary.push(`GitHub: ${pc.cyan(repoUrl)}`);
  if (deployUrl) summary.push(`Vercel: ${pc.cyan(deployUrl)}`);
  if (envVars.POSTGRES_URL) summary.push(`Database: ${pc.green("connected")}`);
  if (envVars.NEXT_PUBLIC_SANITY_PROJECT_ID)
    summary.push(
      `Sanity: ${pc.green(envVars.NEXT_PUBLIC_SANITY_PROJECT_ID)}`,
    );

  if (summary.length > 0) {
    p.log.info(summary.join("\n"));
  }

  p.outro(
    pc.green("Done!") +
      " Your Sitekick project is ready at " +
      pc.cyan(`./${projectName}`),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
