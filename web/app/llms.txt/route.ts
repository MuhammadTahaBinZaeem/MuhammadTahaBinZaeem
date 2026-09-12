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
    `He is a Computer Engineering undergraduate at NUST CEME and founder of Type2Learn and ProGenEDA. ` +
    `His work spans Verilog processors, MIPS assembly, C++, reverse engineering, AI engineering, electronics, robotics, and educational technology.\n\n` +
    `## Canonical sections\n\n` +
    `- Home and profile: ${SITE_ORIGIN}/\n` +
    `- Projects: ${SITE_ORIGIN}/projects\n` +
    `- Research (unpublished work in progress): ${SITE_ORIGIN}/research\n` +
    `- Experience and community: ${SITE_ORIGIN}/experience\n` +
    `- All profiles, repositories and three downloadable CVs: ${SITE_ORIGIN}/connect\n` +
    `- Certifications: ${SITE_ORIGIN}/certifications\n` +
    `- Achievements: ${SITE_ORIGIN}/achievements\n` +
    `- Education: ${SITE_ORIGIN}/education\n\n` +
    `## Official public profiles and ventures\n\n${verifiedProfiles}\n` +
    `- ParetoCo: https://devpost.com/software/paretoco\n` +
    `- ProGenEDA source: https://github.com/ProGenEDA\n` +
    `- Type2Learn source: https://github.com/Type2Learn\n` +
    `- Pocket Engineer: https://pocket-engineer.onrender.com/\n` +
    `- Pocket Engineer source (private; access required): https://github.com/MuhammadTahaBinZaeem/FOP-Project\n\n` +
    `Pocket Engineer is a local C++20 engineering workbench for web/WASM and Android. Its 55 bounded problem types have explicit support limits. Offline web use requires completing preparation first. Regression snapshots are not independent correctness proofs.\n\n` +
    `Type2Learn is recorded as a P@SHA ICT Awards 2026 finalist, not a Gold winner. Both independent research studies are unpublished and ongoing. Workshop targets are planned, not completed.\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
