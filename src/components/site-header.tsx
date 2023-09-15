import Link from "next/link";

export const SiteHeader = () => {
  return (
    <div className="flex h-16 items-center px-4">
      <nav className={"flex items-center space-x-4 lg:space-x-6"}>
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </Link>
      </nav>
    </div>
  );
};
