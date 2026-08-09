const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tahabinzaeem.tech";

export const SITE_ORIGIN = configuredOrigin.replace(/\/$/, "");
