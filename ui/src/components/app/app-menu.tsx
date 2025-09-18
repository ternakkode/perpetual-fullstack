"use client";

import {
  Briefcase02,
  Home03,
  LineChartUp02,
  Menu01,
  SwitchHorizontal02,
  UserCircle,
  XClose,
  ChevronDown,
  BarChart03,
  PieChart01,
  TrendUp02,
  CreditCard01,
  Wallet01,
  Settings01,
} from "@untitled-ui/icons-react";
import { useAccount } from "wagmi";
import Link from "next/link";

import { Button } from "@brother-terminal/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@brother-terminal/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@brother-terminal/components/ui/navigation-menu";
import { cn } from "@brother-terminal/lib/utils";
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";

// import { AppBackupWalletButton } from "./app-backup-wallet-button";
import { AppLoginButton } from "./app-login-button";
import { AppLogoutButton } from "./app-logout-button";

interface MenuItem {
  href?: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  isActive?: boolean;
  label: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

interface DropdownItem {
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  title: string;
  description: string;
}

const useMenu = () => {
  const menus: MenuItem[] = [
    { icon: Home03, label: "Home", href: "/" },
    { label: "Trade", href: "/sandbox", isActive: true },
    { 
      label: "EVM", 
      hasDropdown: true,
      dropdownItems: [
        {
          href: "/coming-soon",
          icon: CreditCard01,
          title: "Lending",
          description: "Lend and borrow assets"
        },
        {
          href: "/coming-soon", 
          icon: PieChart01,
          title: "NFT",
          description: "Non-fungible token marketplace"
        }
      ]
    },
    { label: "Portfolio", href: "/coming-soon" },
    { label: "Affiliate", href: "/coming-soon" },
    { label: "Leaderboard", href: "/coming-soon" },
    { label: "Competition", href: "/coming-soon" },
    { label: "Analytics", href: "/coming-soon" },
    { label: "News", href: "/blog" },
  ];

  const without = (key: string, menus: MenuItem[]) => {
    return menus.filter(
      (menu) => menu.label.toLowerCase() !== key.toLowerCase()
    );
  };

  return { menus, without };
};

export const AppMenu = () => {
  const isTabletOrAbove = useMediaQuery("(min-width: 768px)");
  return isTabletOrAbove ? <DesktopMenu /> : <MobileMenu />;
};

const DesktopMenu = () => {
  const { menus, without } = useMenu();
  return (
    <NavigationMenu className="relative">
      <NavigationMenuList className="space-x-1">
        {without("home", menus).map((menu) => (
          <NavigationMenuItem key={menu.label}>
            {menu.hasDropdown ? (
              <>
                <NavigationMenuTrigger className={cn(
                  "flex items-center px-4 py-2 text-sm font-normal transition-colors hover:text-white-96 focus:text-white-96 rounded-md hover:bg-white-8 [&[data-state=open]>svg]:rotate-180",
                  menu.isActive ? "text-white-96" : "text-white-64"
                )}>
                  {menu.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[999999]">
                  <div className="grid gap-2 p-4 w-80">
                    {menu.dropdownItems?.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                        </div>
                        <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={menu.href || '#'}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-normal transition-colors hover:text-white-96 focus:text-white-96 rounded-md hover:bg-white-8",
                    menu.isActive ? "text-white-96" : "text-white-64"
                  )}
                >
                  {menu.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const MobileMenu = () => {
  const { address, isConnected } = useAccount();
  const { menus } = useMenu();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 hover:bg-white-8 focus:bg-white-8"
        >
          <Menu01 className="w-5 h-5 text-white-64" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card border-border">
        <DrawerHeader>
          <div className="relative">
            <DrawerTitle className="text-center text-foreground">Menu</DrawerTitle>
            <DrawerDescription className="sr-only" />
            <DrawerClose
              asChild
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <button aria-label="Close Drawer" className="p-2 hover:bg-white-8 rounded-md">
                <XClose className="w-5 h-5 text-white-64" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <section className="flex flex-col gap-4 px-4 pb-6">
          {isConnected && address && (
            <div className="bg-white-4 rounded-lg px-4 py-3 flex items-center gap-3">
              <UserCircle className="w-8 h-8 text-white-48" />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground truncate font-mono">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </p>
                <p className="text-xs text-white-64">Basic Account</p>
              </div>
            </div>
          )}
          <nav className="space-y-1">
            {menus.map((menu) => (
              <div key={menu.label}>
                {menu.hasDropdown ? (
                  <>
                    <div className={cn(
                      "flex items-center px-3 py-2 text-sm font-normal",
                      menu.isActive ? "text-white-96" : "text-white-64"
                    )}>
                      {menu.label}
                    </div>
                    <div className="ml-4 space-y-1">
                      {menu.dropdownItems?.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-normal transition-colors hover:text-white-96 hover:bg-white-8 rounded-md text-white-64"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={menu.href || '#'}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-normal transition-colors hover:text-white-96 hover:bg-white-8 rounded-md",
                      menu.isActive ? "text-white-96 bg-white-16" : "text-white-64"
                    )}
                  >
                    {menu.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          {isConnected ? (
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <AppLogoutButton className="justify-start text-left">Logout</AppLogoutButton>
            </div>
          ) : (
            <div className="pt-4 border-t border-border">
              <AppLoginButton className="w-full">Sign In</AppLoginButton>
            </div>
          )}
        </section>
      </DrawerContent>
    </Drawer>
  );
};
