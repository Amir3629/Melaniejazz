"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from './calendar'
import { X, Calendar as CalendarIcon, Clock, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

interface GoogleCalendarPickerProps {
  onChange: (date: Date | undefined) => void
  value?: Date
  placeholder?: string
  className?: string
  showTimeSelector?: boolean
  disablePastDates?: boolean
  disableWeekends?: boolean
}

// Interface for time slots
interface TimeSlot {
  label: string;
  value: string;
  available: boolean;
}

// Default time slots
const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { label: '09:00', value: '09:00', available: true },
  { label: '09:50', value: '09:50', available: true },
  { label: '10:40', value: '10:40', available: true },
  { label: '12:00', value: '12:00', available: true },
  { label: '12:50', value: '12:50', available: true },
  { label: '14:30', value: '14:30', available: true },
  { label: '15:20', value: '15:20', available: true },
  { label: '16:10', value: '16:10', available: true },
  { label: '17:00', value: '17:00', available: true },
];

// Helper function to check if a date is in the past
const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper function to check if a date is a weekend (day 0 is Sunday and day 6 is Saturday)
const isWeekend = (date: Date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

// Add this style block at the top of the component, after the existing customCalendarStyles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1A1A1A;
    border-radius: 20px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 20px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #444;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #333 #1A1A1A;
  }
`;

// Add custom styling to hide Saturday and Sunday columns
const getCalendarStyles = (disableWeekends: boolean) => `
  ${disableWeekends ? `
  .rdp-day_saturday,
  .rdp-day_sunday,
  .rdp-day[aria-label*="Samstag"],
  .rdp-day[aria-label*="Sonntag"] {
    display: none !important;
  }
  
  .rdp-head_cell:last-child,
  .rdp-head_cell:nth-child(6),
  .rdp-head_cell:first-child {
    display: none !important;
  }
  
  .rdp-row {
    justify-content: space-around !important;
  }
  ` : ''}

  .rdp-table {
    width: 100% !important;
  }

  .rdp-caption {
    padding: 0 1rem;
  }
`;

export default function GoogleCalendarPicker({
  onChange,
  value,
  placeholder = "Datum auswählen",
  className = "",
  showTimeSelector = true,
  disablePastDates = true,
  disableWeekends = false
}: GoogleCalendarPickerProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState<string | undefined>();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Update the parent component when a date and time are selected
  useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date, onChange]);

  // Modify the disable logic to respect the disableWeekends prop
  const disabledDays = (day: Date) => {
    if (disablePastDates && isPastDate(day)) {
      return true;
    }
    if (disableWeekends) {
    return isWeekend(day);
    }
    return false;
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return placeholder;
    
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleDateSelect = (date?: Date) => {
    setDate(date);
    setTimeSlot(undefined);
    setIsConfirmed(false);
    setShowTimeSlots(!!date);
  };

  const handleTimeSelect = (time: string) => {
    setTimeSlot(time);
    
    // Start smooth closing animation sequence with longer delays
    setTimeout(() => {
      setIsConfirming(true);
      
      setTimeout(() => {
        setIsConfirming(false);
        setIsConfirmed(true);
        
        // Start closing the calendar smoothly with longer delay
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
          }, 400); // Increased from 300 to 400
        }, 800); // Increased from 500 to 800
      }, 800); // Increased from 500 to 800
    }, 300); // Increased from 200 to 300
  };

  return (
    <div className="relative">
      <style jsx global>{scrollbarStyles}</style>
      
      <div 
        className={`flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#C8A97E] transition-colors ${className}`}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#C8A97E] mr-2" />
          <span className="text-gray-300">{date ? formatDate(date) : placeholder}</span>
          {timeSlot && date && (
            <span className="ml-2 text-[#C8A97E]">({timeSlot})</span>
          )}
        </div>
        {date && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDate(undefined);
              setTimeSlot(undefined);
              setIsConfirmed(false);
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
            />

          <motion.div
              className="fixed sm:absolute left-0 right-0 sm:left-auto sm:right-0 top-1/2 -translate-y-1/2 sm:translate-y-0 sm:top-full px-0 sm:px-0 z-[1000] sm:z-50 sm:mt-2"
              initial={{ opacity: 0, scale: 0.95, y: '40%' }}
              animate={{
                opacity: isClosing ? 0 : 1,
                scale: isClosing ? 0.95 : 1,
                y: isClosing ? '45%' : '50%'
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              exit={{ opacity: 0, scale: 0.95, y: '45%' }}
            >
              <div className="bg-[#0A0A0A] border border-[#C8A97E]/20 rounded-none sm:rounded-xl shadow-2xl overflow-hidden w-full sm:max-w-none mx-auto min-h-[80vh] sm:min-h-0">
                <div className="bg-[#1A1A1A] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-white font-medium">
                    {t('booking.selectDate', 'Datum auswählen')}
                  </h3>
                    <button 
                    onClick={() => {
                      setIsClosing(true);
                      setTimeout(() => {
                        setIsOpen(false);
                        setIsClosing(false);
                      }, 300);
                    }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
                <div className="p-6 bg-[#1A1A1A] h-full flex flex-col">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    className="rounded-lg border-0 flex-1"
                    classNames={{
                      months: "space-y-6",
                      month: "space-y-6",
                      caption: "flex justify-center pt-2 pb-4 relative items-center",
                      caption_label: "text-base font-medium text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity text-[#C8A97E]",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-2",
                      head_row: "flex",
                      head_cell: "text-gray-500 rounded-md w-10 font-normal text-sm flex-1",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#C8A97E]/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex-1",
                      day: "h-10 w-full p-0 font-normal text-gray-300 aria-selected:opacity-100 hover:bg-[#C8A97E]/20 transition-colors rounded-md flex items-center justify-center text-base",
                      day_selected: "bg-[#C8A97E] text-black hover:bg-[#C8A97E] hover:text-black focus:bg-[#C8A97E] focus:text-black",
                      day_today: "bg-[#C8A97E]/10 text-[#C8A97E]",
                      day_outside: "text-gray-600 opacity-50",
                      day_disabled: "text-gray-600 opacity-50 cursor-not-allowed",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />

                  {showTimeSlots && date && showTimeSelector && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-6 border-t border-gray-800 pt-6"
                    >
                      <h4 className="text-white text-sm font-medium mb-3 flex items-center">
                        <Clock className="w-4 h-4 text-[#C8A97E] mr-2" />
                        {t('booking.availableTimes', 'Verfügbare Zeiten')}
                        </h4>
                      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                          {DEFAULT_TIME_SLOTS.map((slot) => (
                          <button
                              key={slot.value}
                            onClick={() => handleTimeSelect(slot.value)}
                            disabled={!slot.available}
                            className={`
                              px-3 py-2 text-sm rounded-lg transition-colors
                              ${timeSlot === slot.value
                                ? 'bg-[#C8A97E] text-black'
                                  : slot.available 
                                  ? 'text-gray-300 hover:bg-[#C8A97E]/20'
                                  : 'text-gray-600 cursor-not-allowed'
                              }
                            `}
                            >
                              {slot.label}
                          </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
              
                  {/* Confirmation Animation */}
              <AnimatePresence>
                    {isConfirming && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/95 backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-[#C8A97E] rounded-full p-2"
                        >
                          <Check className="w-6 h-6 text-black" />
                        </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 