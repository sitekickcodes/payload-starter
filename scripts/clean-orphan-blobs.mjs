#!/usr/bin/env node
/**
 * Safe Orphan Blob Cleanup Script
 *
 * Compares every blob in Vercel Blob storage against every filename
 * referenced by Payload media records (primary + all resize variants).
 * Only deletes blobs that have ZERO references in the database.
 *
 * Usage:
 *   node scripts/clean-orphan-blobs.mjs          # Dry run (list only)
 *   node scripts/clean-orphan-blobs.mjs --delete  # Actually delete orphans
 */
import { list, del } from "@vercel/blob";

const DRY_RUN = !process.argv.includes("--delete");
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ── Step 1: Fetch all media records from Payload ──────────────────────
console.log("Fetching media records from Payload API...");
const res = await fetch(`${SITE_URL}/api/media?limit=500&depth=0`);
if (!res.ok) {
  console.error(`Failed to fetch media: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const { docs } = await res.json();
console.log(`Found ${docs.length} media records in database.\n`);

// ── Step 2: Build the set of ALL referenced filenames ─────────────────
// This includes: primary file + thumbnail + card + desktop for each record
const referencedFiles = new Set();

for (const doc of docs) {
  // Primary file
  if (doc.filename) {
    referencedFiles.add(`media/${doc.filename}`);
  }

  // All resize variants
  if (doc.sizes) {
    for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
      if (sizeData?.filename) {
        referencedFiles.add(`media/${sizeData.filename}`);
      }
    }
  }
}

console.log(`Referenced files in database: ${referencedFiles.size}`);
console.log("─".repeat(60));
for (const f of [...referencedFiles].sort()) {
  console.log(`  ✓ ${f}`);
}
console.log("");

// ── Step 3: List ALL blobs from Vercel Blob ───────────────────────────
console.log("Fetching all blobs from Vercel Blob storage...");
const allBlobs = [];
let cursor;
do {
  const result = await list({ cursor, limit: 1000 });
  allBlobs.push(...result.blobs);
  cursor = result.cursor;
} while (cursor);
console.log(`Found ${allBlobs.length} total blobs.\n`);

// ── Step 4: Classify each blob ────────────────────────────────────────
const keepBlobs = [];
const orphanBlobs = [];

for (const blob of allBlobs) {
  // Match by pathname (the original name, without random suffix)
  if (referencedFiles.has(blob.pathname)) {
    keepBlobs.push(blob);
  } else {
    orphanBlobs.push(blob);
  }
}

// ── Step 5: Report ────────────────────────────────────────────────────
const fmt = (bytes) =>
  bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)}MB`
    : `${(bytes / 1_000).toFixed(0)}KB`;

console.log(`\n${"═".repeat(60)}`);
console.log(`KEEP: ${keepBlobs.length} blobs (referenced by database)`);
console.log(`${"═".repeat(60)}`);
for (const b of keepBlobs) {
  console.log(`  ✓ ${b.pathname} (${fmt(b.size)})`);
}

let orphanTotal = 0;
console.log(`\n${"═".repeat(60)}`);
console.log(`ORPHANS: ${orphanBlobs.length} blobs (NOT referenced by database)`);
console.log(`${"═".repeat(60)}`);
for (const b of orphanBlobs) {
  console.log(`  ❌ ${b.pathname} (${fmt(b.size)}) — ${b.url}`);
  orphanTotal += b.size;
}
console.log(`\nTotal orphan size: ${fmt(orphanTotal)}`);

// ── Step 6: Safety check ──────────────────────────────────────────────
// Abort if orphans outnumber kept blobs (something is probably wrong)
if (orphanBlobs.length > 0 && keepBlobs.length === 0) {
  console.error(
    "\n🚨 SAFETY ABORT: No blobs matched database records. " +
      "Something is wrong with the comparison logic. Aborting."
  );
  process.exit(1);
}

if (orphanBlobs.length > keepBlobs.length * 3) {
  console.warn(
    `\n⚠️  WARNING: ${orphanBlobs.length} orphans vs ${keepBlobs.length} kept. ` +
      "Orphans significantly outnumber kept blobs — review carefully."
  );
}

// ── Step 7: Delete (if not dry run) ───────────────────────────────────
if (DRY_RUN) {
  console.log(
    `\n🔍 DRY RUN — no blobs deleted. Run with --delete to remove orphans.`
  );
} else {
  console.log(`\nDeleting ${orphanBlobs.length} orphan blobs...`);
  for (const blob of orphanBlobs) {
    try {
      await del(blob.url);
      console.log(`  🗑️  Deleted: ${blob.pathname}`);
    } catch (err) {
      console.error(`  ❌ Failed to delete ${blob.pathname}: ${err.message}`);
    }
  }
  console.log(`\n✅ Done. Deleted ${orphanBlobs.length} orphan blobs.`);
}
