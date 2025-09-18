"use client";

import { Moon01 as MoonIcon, Sun as SunIcon } from "@untitled-ui/icons-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    if (theme === "light") {
      alert("Design Token is not yet optimized for light mode!");
    }
  }, [theme]);

  return (
    <ToggleGroup defaultValue={theme} type="single" onValueChange={setTheme}>
      <ToggleGroupItem value="light">
        <SunIcon />
        <span className="sr-only">Toggle light theme</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <MoonIcon />
        <span className="sr-only">Toggle dark theme</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
