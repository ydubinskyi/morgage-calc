"use client";

import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSTALLMENT_TYPE } from "@/types/mortgage";

const mortgageArgsFormSchema = z.object({
  principal: z.number().min(1000),
  annualInterestRate: z.number().min(0).max(1),
  loanTermInMonths: z.number().min(6),
  installmentType: z.enum([
    INSTALLMENT_TYPE.Decreasing,
    INSTALLMENT_TYPE.Fixed,
  ]),
  startDate: z.date(),
});

export type MortgageArgs = z.infer<typeof mortgageArgsFormSchema>;

type MortgageCalculatorFormProps = PropsWithChildren & {
  onSubmit: (values: MortgageArgs) => void;
};

export const MortgageCalculatorForm = ({
  children,
  onSubmit: handleSubmit,
}: MortgageCalculatorFormProps) => {
  const t = useTranslations("mortgage-calculator");

  const form = useForm<MortgageArgs>({
    resolver: zodResolver(mortgageArgsFormSchema),
    defaultValues: {
      principal: 440000,
      annualInterestRate: 0.058,
      loanTermInMonths: 240,
      installmentType: INSTALLMENT_TYPE.Fixed,
      startDate: new Date(),
    },
  });

  function onSubmit(values: MortgageArgs) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.loanAmount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annualInterestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.annualInterestRate")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanTermInMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.loanTerm")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="installmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.installmentType")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.installmentTypeDefaultValue")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={INSTALLMENT_TYPE.Fixed}>
                        {t("form.installmentTypeOptions.fixed")}
                      </SelectItem>
                      <SelectItem value={INSTALLMENT_TYPE.Decreasing}>
                        {t("form.installmentTypeOptions.decreasing")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.startDate")}</FormLabel>
                <FormControl>
                  <MonthPicker
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          <Button type="submit">{t("form.submit")}</Button>

          {children}
        </div>
      </form>
    </Form>
  );
};
