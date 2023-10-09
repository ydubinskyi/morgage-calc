import { useFormContext } from "react-hook-form";
import { XSquare } from "lucide-react";

import { AdditionalPaymentsForm } from "./additional-payments-section";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
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
import { OVERPAYMENT_EFFECT } from "@/types/mortgage";

type AdditionalPaymentsItemProps = {
  index: number;
  onRemove: (index: number) => void;
};

export const AdditionalPaymentsItem = ({
  index,
  onRemove,
}: AdditionalPaymentsItemProps) => {
  const { control } = useFormContext<AdditionalPaymentsForm>();

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 gap-4 ">
        <FormField
          control={control}
          name={`payments.${index}.dateFrom`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>From date</FormLabel>
              <FormControl>
                <MonthPicker selected={field.value} onChange={field.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`payments.${index}.dateTo`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>To date</FormLabel>
              <FormControl>
                <MonthPicker selected={field.value} onChange={field.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`payments.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
          control={control}
          name={`payments.${index}.overpaymentEffect`}
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
                    <SelectItem value={OVERPAYMENT_EFFECT.LowerInstallment}>
                      Lower installment
                    </SelectItem>
                    <SelectItem value={OVERPAYMENT_EFFECT.ShortenedLoanTerm}>
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

      <CardFooter className="justify-end p-0 pt-4">
        <Button variant="destructive" onClick={() => onRemove(index)}>
          <XSquare className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};
