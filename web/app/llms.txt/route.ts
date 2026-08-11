import { PROFILE, SOCIAL_LINKS } from "../portfolio-data";
import { SITE_ORIGIN } from "../site-config";

export const dynamic = "force-static";

export function GET() {
  const verifiedProfiles = SOCIAL_LINKS
    .filter((link) => link.href)
    .map((link) => `- ${link.label}: ${link.href}`)
    .join("\n");

  const body = `# ${PROFILE.name}\n\n` +
    `Official portfolio: ${SITE_ORIGIN}\n\n` +
    `Muhammad Taha Bin Zaeem is also known publicly as Muhammad Taha, Taha Zaeem, Taha Bin Zaeem, and tahabinzaeem. ` +
    `He is a computer engineer at NUST CEME and founder of Type2Learn and ProGenEDA. ` +
    `His work spans Verilog processors, MIPS assembly, C++, reverse engineering, AI engineering, electronics, robotics, and educational technology.\n\n` +
    `## Canonical sections\n\n` +
    `- Home and profile: ${SITE_ORIGIN}/\n` +
    `- Projects: ${SITE_ORIGIN}/projects\n` +
    `- Certifications: ${SITE_ORIGIN}/certifications\n` +
    `- Achievements: ${SITE_ORIGIN}/achievements\n` +
    `- Education: ${SITE_ORIGIN}/education\n\n` +
    `## Official public profiles and ventures\n\n${verifiedProfiles}\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
