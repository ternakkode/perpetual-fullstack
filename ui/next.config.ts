import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://app.hyperliquid.xyz https://explorer-api.walletconnect.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org; frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://oauth.telegram.org; connect-src 'self' https://* wss://* https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://explorer-api.walletconnect.com https://api.relay.link https://api.testnets.relay.link; worker-src 'self'; manifest-src 'self'",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
