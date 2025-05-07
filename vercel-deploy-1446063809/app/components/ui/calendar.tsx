"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 bg-[#1A1A1A] rounded-lg border border-gray-800 shadow-lg w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3 w-full",
        caption: "flex items-center justify-center h-10 mb-2 relative",
        caption_label: "text-sm font-medium text-white absolute left-1/2 -translate-x-1/2",
        nav: "flex justify-between w-full absolute top-0 px-1",
        nav_button: cn(
          "bg-transparent text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-center w-full",
        head_cell: "text-[#C8A97E] w-7 font-medium text-[0.7rem]",
        row: "flex w-full mt-1 justify-center",
        cell: "text-center p-0 relative w-7 flex items-center justify-center",
        day: cn(
          "h-7 w-7 p-0 font-normal aria-selected:opacity-100 text-white hover:text-[#D4AF37] rounded-sm transition-colors flex items-center justify-center"
        ),
        day_selected:
          "text-[#D4AF37] bg-transparent hover:text-[#D4AF37] focus:text-[#D4AF37] font-bold",
        day_today: "text-[#C8A97E] bg-transparent font-semibold",
        day_outside: "text-white/30 opacity-50",
        day_disabled: "text-white/30 opacity-50 hover:bg-transparent cursor-not-allowed",
        day_range_middle:
          "aria-selected:text-[#C8A97E]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <span className="text-lg text-[#C8A97E] hover:text-[#D4AF37]">&lt;</span>
        ),
        IconRight: () => (
          <span className="text-lg text-[#C8A97E] hover:text-[#D4AF37]">&gt;</span>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 