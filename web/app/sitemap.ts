import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fecemuzbolsa.com",
      lastModified: new Date(),
    },
  ];
}
