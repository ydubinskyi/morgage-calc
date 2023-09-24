import { memo, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { add, addMonths, format } from "date-fns";
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
import { range } from "@/lib/utils";
import { AdditionalPayments, OVERPAYMENT_EFFECT } from "@/types/mortgage";

const additionalPaymentsFormSchema = z.object({
  dateFrom: z.date(),
  dateTo: z.date(),
  value: z.number().min(0),
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
    const [open, setOpen] = useState(false);

    const form = useForm<AdditionalPaymentsArgs>({
      resolver: zodResolver(additionalPaymentsFormSchema),
      defaultValues: {
        dateFrom: startDate,
        dateTo: addMonths(startDate, loanTermInMonths - 1),
        value: 0,
      },
    });

    const monthPaymentToDateMap: Record<string, number> = useMemo(() => {
      return range(1, loanTermInMonths + 1).reduce((acc, value) => {
        return {
          ...acc,
          [format(addMonths(startDate, value - 1), "MM.yyyy")]: value,
        };
      }, {});
    }, [loanTermInMonths, startDate]);

    const onSubmit = form.handleSubmit((values) => {
      const { dateFrom, dateTo, value } = values;

      const startPaymentNumber =
        monthPaymentToDateMap[format(dateFrom, "MM.yyyy")];

      const endPaymentNumber = monthPaymentToDateMap[format(dateTo, "MM.yyyy")];

      if (startPaymentNumber && endPaymentNumber && value) {
        onAdditionalPaymentsChange(
          Object.fromEntries(
            range(startPaymentNumber, endPaymentNumber + 1).map((n) => [
              n,
              {
                value,
                overpaymentEffect: OVERPAYMENT_EFFECT.LowerInstallment,
              },
            ])
          )
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

                <div className="flex justify-end">
                  <Button type="submit">Add additional payments</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

AdditionalPaymentsDialog.displayName = "AdditionalPaymentsDialog";
