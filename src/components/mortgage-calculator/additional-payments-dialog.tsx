import { memo, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useFormatter } from "next-intl";
import { addMonths } from "date-fns";
import { PlusSquare } from "lucide-react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { range } from "@/lib/utils";
import { AdditionalPayments, OVERPAYMENT_EFFECT } from "@/types/mortgage";

const additionalPaymentsFormSchema = z.object({
  dateFrom: z.date(),
  dateTo: z.date(),
  value: z.number().min(0),
  overpaymentEffect: z.enum([
    OVERPAYMENT_EFFECT.LowerInstallment,
    OVERPAYMENT_EFFECT.ShortenedLoanTerm,
  ]),
});

type AdditionalPaymentsArgs = z.infer<typeof additionalPaymentsFormSchema>;

type AdditionalPaymentsDialogProps = {
  startDate: Date;
  loanTermInMonths: number;
  onAdditionalPaymentsChange: (values: AdditionalPayments) => void;
};

export const AdditionalPaymentsDialog = memo(
  ({
    startDate,
    loanTermInMonths,
    onAdditionalPaymentsChange,
  }: AdditionalPaymentsDialogProps) => {
    const format = useFormatter();
    const [open, setOpen] = useState(false);

    const form = useForm<AdditionalPaymentsArgs>({
      resolver: zodResolver(additionalPaymentsFormSchema),
      defaultValues: {
        dateFrom: startDate,
        dateTo: addMonths(startDate, loanTermInMonths - 1),
        value: 0,
        overpaymentEffect: OVERPAYMENT_EFFECT.LowerInstallment,
      },
    });

    const monthPaymentToDateMap: Record<string, number> = useMemo(() => {
      return range(1, loanTermInMonths + 1).reduce((acc, value) => {
        return {
          ...acc,
          [format.dateTime(addMonths(startDate, value - 1), {
            month: "short",
            year: "2-digit",
          })]: value,
        };
      }, {});
    }, [format, loanTermInMonths, startDate]);

    const onSubmit = form.handleSubmit((values) => {
      const { dateFrom, dateTo, value } = values;

      const startPaymentNumber =
        monthPaymentToDateMap[
          format.dateTime(dateFrom, {
            month: "short",
            year: "2-digit",
          })
        ];

      const endPaymentNumber =
        monthPaymentToDateMap[
          format.dateTime(dateTo, {
            month: "short",
            year: "2-digit",
          })
        ];

      if (startPaymentNumber && endPaymentNumber && value) {
        onAdditionalPaymentsChange(
          Object.fromEntries(
            range(startPaymentNumber, endPaymentNumber + 1).map((n) => [
              n,
              {
                value,
                overpaymentEffect: OVERPAYMENT_EFFECT.LowerInstallment,
              },
            ]),
          ),
        );

        form.reset();
        setOpen(false);
      }
    });

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <PlusSquare className="mr-2 h-4 w-4" />
            Add additional payments
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add additional payments</DialogTitle>
            <DialogDescription>
              Add additional payments for selected period
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 pt-4">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From date</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="dateTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To date</FormLabel>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to add</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overpaymentEffect"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overpayment effect</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select overpayment effect" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={OVERPAYMENT_EFFECT.LowerInstallment}
                              >
                                Lower installment
                              </SelectItem>
                              <SelectItem
                                value={OVERPAYMENT_EFFECT.ShortenedLoanTerm}
                              >
                                Shortened loan period
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Add additional payments</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

AdditionalPaymentsDialog.displayName = "AdditionalPaymentsDialog";
