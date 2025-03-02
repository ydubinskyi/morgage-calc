import { setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
