/**
 * CMS abstraction layer.
 *
 * Frontend pages import from this file — never directly from Payload or Sanity.
 * The active adapter is determined at scaffold time by the create-sitekick CLI.
 */

export type {
  BlogPost,
  Page,
  CMSImage,
  SiteSettings,
  AnalyticsSettings,
  SocialLinks,
} from "./types";

// Active CMS adapter — the CLI swaps this import for the chosen CMS
export {
  payloadAdapter as cms,
} from "./payload";
