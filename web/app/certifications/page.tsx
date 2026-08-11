import type { Metadata } from "next";
import { CERTIFICATES } from "../portfolio-data";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
import { CertificationsExperience } from "./certifications-experience";

export const metadata: Metadata = {
  title: "Certifications · Hall of Institutions",
  description:
    "An immersive, verifiable certificate archive for Muhammad Taha Bin Zaeem, including Duke, Stanford, Google, Coursera, and lablab.ai.",
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return (
    <>
      <CollectionStructuredData
        description="Verifiable credentials earned by Muhammad Taha Bin Zaeem through Duke University, Stanford University, Google, Coursera, and lablab.ai."
        items={CERTIFICATES.map((certificate) => ({
          name: certificate.title,
          description: `${certificate.issuer} credential issued ${certificate.issued}.`,
          url: `${SITE_ORIGIN}/certifications#certificate-${certificate.id}`,
          type: "EducationalOccupationalCredential",
          sameAs: [certificate.credentialUrl, certificate.documentUrl]
            .flatMap((url) => (url ? [url] : [])),
        }))}
        name="Muhammad Taha Bin Zaeem Certifications"
        path="/certifications"
      />
      <CertificationsExperience />
    </>
  );
}
