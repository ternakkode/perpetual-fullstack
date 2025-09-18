import { AppProvider } from "@brother-terminal/components/app-provider";
import { AuthProvider } from "@brother-terminal/components/auth-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}
