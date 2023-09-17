import { cn } from "@/lib/utils";

type ColorPointTitleProps = {
  title: string;
  color: string;
};

export const ColorPointTitle = ({ title, color }: ColorPointTitleProps) => (
  <div className="flex items-center space-x-2">
    <div
      className={cn("h-2 w-2 rounded-full")}
      style={{ backgroundColor: color }}
    ></div>
    <span>{title}</span>
  </div>
);
