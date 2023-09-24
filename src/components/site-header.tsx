import Link from "next/link";

export const SiteHeader = () => {
  return (
    <div className="flex h-16 items-center">
      <nav className={"flex items-center space-x-4 lg:space-x-6"}>
        <Link
          href="/"
          className="text-xl font-medium transition-colors hover:text-primary"
        >
          Calculators hub
        </Link>
      </nav>
    </div>
  );
};
