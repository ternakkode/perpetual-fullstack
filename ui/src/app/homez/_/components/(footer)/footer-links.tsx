import Link from "next/link";

export const FooterLinks = () => {
  return (
    <nav className="flex-1 flex items-center justify-center gap-10">
      <Link href="/exchange">Trade</Link>
      <Link href="">Portfolio</Link>
      <Link href="">Stats</Link>
    </nav>
  );
};
