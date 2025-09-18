import { SmoothScrollProvider } from "./_/provider/lenis-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
