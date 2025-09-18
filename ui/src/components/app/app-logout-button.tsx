"use client";

import { LogOut01 } from "@untitled-ui/icons-react";
import { ModernLoader } from "@/components/ui/modern-loader";
import { forwardRef, useState } from "react";
import { useDisconnect } from "wagmi";

import { Button } from "@brother-terminal/components/ui/button";
import { cn } from "@brother-terminal/lib/utils";

export const AppLogoutButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ ...props }, ref) => {
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const Icon = LogOut01;
  const logoutHandler = () => {
    setIsLoading(true);
    try {
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      ref={ref}
      {...props}
      disabled={isLoading}
      onClick={logoutHandler}
      variant="outline"
    >
      {isLoading ? (
        <ModernLoader size="sm" />
      ) : (
        <Icon className="size-4" />
      )}
      {props.children}
    </Button>
  );
});
AppLogoutButton.displayName = "AppLogoutButton";
