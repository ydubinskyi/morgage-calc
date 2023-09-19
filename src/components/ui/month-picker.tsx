import { useState } from "react";
import { DPDay, DPMonth, DPYear, useDatePicker } from "@rehookify/datepicker";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import { cn } from "@/lib/utils";

type MonthPickerProps = {
  selected: Date | undefined;
  onChange: (d: Date) => void;
};

export const MonthPicker = ({ selected, onChange }: MonthPickerProps) => {
  const {
    data: { calendars, months },
    propGetters: { addOffset, subtractOffset, monthButton },
  } = useDatePicker({
    selectedDates: selected ? [selected] : [],
    onDatesChange: () => {},
    offsetDate: selected,
    onOffsetChange: (d) => onChange && onChange(d),
    calendar: {
      startDay: 1,
    },
    dates: {
      mode: "single",
    },
  });

  const { year } = calendars[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex w-full pl-3 text-left font-normal ",
            !selected && "text-muted-foreground"
          )}
        >
          {selected ? format(selected, "LLLL yyyy") : <span>Pick a month</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-1">
          <header className="grid grid-cols-3 items-center justify-items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              {...subtractOffset({ years: 1 })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <p className="text-center text-sm">{year}</p>
            <Button variant="ghost" size="icon" {...addOffset({ years: 1 })}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </header>

          <div className="grid grid-cols-3 items-center gap-x-2 gap-y-2">
            {months.map((m) => (
              <Button
                key={m.month + year}
                variant="ghost"
                className={getMonthClassName("text-xs", m)}
                {...monthButton(m)}
              >
                {m.month}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const getMonthClassName = (
  className: string,
  { selected, now, disabled }: DPMonth
) =>
  cn(className, {
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground":
      selected,
    "bg-accent text-accent-foreground": now,
    "text-muted-foreground opacity-50": disabled,
  });
