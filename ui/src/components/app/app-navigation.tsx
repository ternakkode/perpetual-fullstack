"use client";

import { Fragment } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Link from "next/link";
import { LogOut01 as LogOutIcon } from "@untitled-ui/icons-react";

import { Logo } from "@brother-terminal/components/ui/logo";
import { Button } from "@brother-terminal/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@brother-terminal/components/ui/dropdown-menu";

import { AppLoginButton } from "./app-login-button";
import { AppLogoutButton } from "./app-logout-button";
import { AppMenu } from "./app-menu";

import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const AppNavigation = ({ isMobile }: { isMobile?: boolean }) => {
  return (
    <header className="h-14 px-6 mb-2 flex items-center justify-between bg-card/80 backdrop-blur-sm border-b border-border/50 relative z-[999999]">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center space-x-6">
        <Link className="flex items-center space-x-3" href={{ pathname: "/" }}>
          <Logo className="w-auto h-10" />
        </Link>
        {!isMobile && <AppMenu />}
      </div>
      
      {/* Right: Actions */}
      {!isMobile ? <DesktopNavigationRight /> : <MobileNavigation />}
    </header>
  );
};

const DesktopNavigationRight = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <Fragment>
          <div className="flex items-center gap-3">
            {address && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-2 hover:bg-white-8">
                    <span className="text-sm text-white-64 max-w-32 truncate font-mono">
                      {`${address.slice(0, 6)}...${address.slice(-4)}`}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-[9999999]">
                  <DropdownMenuItem onClick={() => disconnect()} className="text-red-600 focus:text-red-600">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </Fragment>
      ) : (
        <AppLoginButton className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
          Connect
        </AppLoginButton>
      )}
    </div>
  );
};

const MobileNavigation = () => {
  const { isConnected } = useAccount();
  return (
    <div className="flex items-center gap-2">
      {!isConnected && (
        <AppLoginButton className="px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90">
          Connect
        </AppLoginButton>
      )}
      <AppMenu />
    </div>
  );
};
