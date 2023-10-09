import { useCallback, useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { PlusSquare } from "lucide-react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { AdditionalPaymentsItem } from "./addiitonal-payments-item";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { OVERPAYMENT_EFFECT } from "@/types/mortgage";

const additionalPaymentSchema = z.object({
  dateFrom: z.date(),
  dateTo: z.date().optional(),
  value: z.number().min(0),
  overpaymentEffect: z.enum([
    OVERPAYMENT_EFFECT.LowerInstallment,
    OVERPAYMENT_EFFECT.ShortenedLoanTerm,
  ]),
});

export type AdditionalPaymentItem = z.infer<typeof additionalPaymentSchema>;

const additionalPaymentsFormSchema = z.object({
  payments: z.array(additionalPaymentSchema),
});

export type AdditionalPaymentsForm = z.infer<
  typeof additionalPaymentsFormSchema
>;

export type AdditionalPaymentsSectionProps = {
  onAdditionalPaymentsChange: (values: AdditionalPaymentItem[]) => void;
};

export const AdditionalPaymentsSection = ({
  onAdditionalPaymentsChange,
}: AdditionalPaymentsSectionProps) => {
  const form = useForm<AdditionalPaymentsForm>({
    resolver: zodResolver(additionalPaymentsFormSchema),
    defaultValues: {
      payments: [],
    },
  });
  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  const onAddPaymentItem = useCallback(() => {
    prepend({
      dateFrom: new Date(),
      value: 1000,
      overpaymentEffect: "ShortenedLoanTerm",
    });
  }, [prepend]);

  const onRemovePaymentItem = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  useEffect(() => {
    const subscription = form.watch(
      ({ payments }) =>
        onAdditionalPaymentsChange((payments ?? []) as AdditionalPaymentItem[]),
      {
        payments: [],
      },
    );
    return () => subscription.unsubscribe();
  }, [form, form.watch, onAdditionalPaymentsChange]);

  return (
    <Card className="mb-6 space-y-4 p-6">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0">
        <p className="text-l font-semibold leading-none tracking-tight">
          Additional payments
        </p>

        <Button variant="outline" onClick={onAddPaymentItem}>
          <PlusSquare className="mr-2 h-4 w-4" />
          Add additional payments
        </Button>
      </CardHeader>

      {fields.length > 0 ? (
        <FormProvider {...form}>
          {fields.map((field, idx) => (
            <AdditionalPaymentsItem
              key={field.id}
              index={idx}
              onRemove={onRemovePaymentItem}
            />
          ))}
        </FormProvider>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No additional payments
          </p>
        </div>
      )}
    </Card>
  );
};
