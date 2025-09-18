import Link from "next/link";

import { Button } from "./button";

export const LaunchAppButton = () => {
  return (
    <Button asChild>
      <Link href="/exchange">Launch App</Link>
    </Button>
  );
};
