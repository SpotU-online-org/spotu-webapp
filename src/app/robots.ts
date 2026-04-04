import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/feed", "/listing/"],
        disallow: ["/dashboard", "/publish", "/auth/", "/settings/", "/profile/edit"],
      },
    ],
    sitemap: "https://spotu.online/sitemap.xml",
  };
}
