/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番ビルドで console.log を除去
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 画像最適化（将来 Supabase Storage 等を追加）
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatar
    ],
  },

  // セキュリティヘッダー（Vercel 以外の環境用）
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // /review/:storeId への将来のリダイレクト準備
  async redirects() {
    return [];
  },
};

export default nextConfig;
