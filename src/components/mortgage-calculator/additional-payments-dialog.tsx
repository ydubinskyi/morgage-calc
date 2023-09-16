import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdditionalPaymentsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add bulk additional payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add bulk additional payment</DialogTitle>
          <DialogDescription>
            Add additional payments for all payments
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <Input id="value" className="col-span-3" />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Add additional payments</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
