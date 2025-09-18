"use client";

import {
  Menu01 as MenuIcon,
  XClose as XCloseIcon,
} from "@untitled-ui/icons-react";
import { usePathname } from "next/navigation";
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
import { cn } from "@brother-terminal/lib/utils";

import { links } from "./_links";

export const MenuButton = () => {
  const pathname = usePathname();

  return (
    <Drawer>
      <DrawerTrigger className="md:hidden flex items-center rounded-lg border border-white-8 p-2.5 bg-[#1C3435]">
        <MenuIcon className="size-4" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="relative flex items-center justify-center">
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerClose
              aria-label="Close Menu"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <XCloseIcon className="text-white-48 size-5" />
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">Menu</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4">
          <nav>
            {links.map((link) => (
              <Link
                key={link.href}
                className={cn(
                  "w-full h-10 flex items-center gap-3 text-lg text-white-48 transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "hover:text-white-64"
                )}
                href={link.href}
              >
                <link.icon className="size-5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <Button>Login</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
