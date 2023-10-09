import Link from "next-intl/link";

import LocaleSwitcher from "./locale-switcher";

export const SiteHeader = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between">
      <nav className={"flex items-center space-x-4 lg:space-x-6"}>
        <Link
          href="/"
          className="text-xl font-medium transition-colors hover:text-primary"
        >
          Calculators hub
        </Link>
      </nav>

      <nav>
        <LocaleSwitcher />
      </nav>
    </div>
  );
};
