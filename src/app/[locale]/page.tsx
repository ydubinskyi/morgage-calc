import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { locales } from "@/i18n";
import { Link } from "@/navigation";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mortgage calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Simulate additional payments and different options of the mortgage.
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button asChild>
            <Link href="/mortgage-calculator">Go to calculator</Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="flex items-center justify-center p-6">
        <CardDescription className="text-xl">
          More coming soon...
        </CardDescription>
      </Card>
    </div>
  );
}
