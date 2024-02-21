import { Metadata } from "next";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { http, WagmiProvider } from 'wagmi';
import {
  goerli,
  mainnet, polygon, optimism, arbitrum, base, zora
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


// const inter = Inter({ subsets: ["latin"] });
const config = getDefaultConfig({
  appName: 'CryptoDevs DAO',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora, goerli],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
     [goerli.id]: http(),
   },
});

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "CryptoDevs DAO",
  description: "CryptoDevs DAO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <html lang="en">
            <body
              // className={inter.className}
            >{children}</body>
          </html>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
