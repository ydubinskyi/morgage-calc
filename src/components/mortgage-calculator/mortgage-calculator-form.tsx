"use client";

import { useForm } from "react-hook-form";
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

type MortgageCalculatorFormProps = {
  onSubmit: (values: MortgageArgs) => void;
};

export const MortgageCalculatorForm = ({
  onSubmit: handleSubmit,
}: MortgageCalculatorFormProps) => {
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
    console.log(values);

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
                <FormLabel>Principal</FormLabel>
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
                <FormLabel>Annual interest rate</FormLabel>
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
                <FormLabel>Loan term in months</FormLabel>
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
                <FormLabel>Installment type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select installment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={INSTALLMENT_TYPE.Fixed}>
                        Fixed
                      </SelectItem>
                      <SelectItem value={INSTALLMENT_TYPE.Decreasing}>
                        Decreasing
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
                <FormLabel>Start date</FormLabel>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
