import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Zmenšování fotek nedělá Vercel, ale Supabase Storage, kde fotky
     * z Nemo1 leží — viz lib/images/loader.ts. Optimalizace na Vercelu má
     * měsíční limit a po jeho vyčerpání vrací 402, fotky by zmizely.
     */
    loader: "custom",
    loaderFile: "./lib/images/loader.ts",

    // Next 16 povoluje jen hodnoty uvedené tady; bez toho spadne quality
    // zpátky na 75 a fotky vypadají měkčeji, než mají.
    qualities: [75, 88],

    // Vlastní loader si domény hlídá sám, ale seznam zůstává jako záznam
    // o tom, odkud fotky chodí: feed z Nemo1 je servíruje přímo ze
    // Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "jfccoykhzpnkacguosic.supabase.co" },
      { protocol: "https", hostname: "cdn.nemo1.cz" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
