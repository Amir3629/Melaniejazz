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
      <style jsx global>{`
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
      `}</style>
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
            {/* Backdrop blur effect with longer duration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
              onClick={() => setIsOpen(false)}
            />

            {/* Calendar Card with smoother animation */}
            <div className="fixed inset-0 flex items-center justify-center z-[10000]">
          <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-[460px] max-w-[90vw]"
          >
            <motion.div 
                  className="bg-[#111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
                  animate={{ scale: isClosing ? 0.98 : 1, opacity: isClosing ? 0 : 1 }}
                  transition={{ duration: 1.2 }}
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 className="text-white font-medium text-lg">{t('booking.selectDate', 'Datum auswählen')}</h3>
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
                  <div className="p-4 flex flex-row justify-center items-start gap-4">
                    <div className="w-[320px]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    initialFocus
                    classNames={{
                      head_row: "flex justify-between w-full",
                          head_cell: "text-[#C8A97E] rounded-md w-9 font-medium text-[0.8rem] mx-0.5 text-center",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#C8A97E]/10 m-0.5",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center transition-all duration-300",
                          day_selected: "bg-[#C8A97E] text-black hover:bg-[#C8A97E] hover:text-black",
                          day_today: "bg-[#C8A97E]/10 text-[#C8A97E] font-semibold",
                          table: "w-full border-collapse",
                          months: "flex flex-col space-y-4",
                          month: "space-y-4"
                    }}
                  />
                </div>
                
                {showTimeSelector && (
                  <AnimatePresence>
                    {showTimeSlots && date && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="w-[120px] border-l border-gray-800 pl-4"
                      >
                            <h4 className="text-white text-sm font-medium mb-3 flex items-center sticky top-0 bg-[#111] py-1">
                          <Clock className="w-4 h-4 mr-2 text-[#C8A97E]" />
                          {t('booking.selectTime', 'Uhrzeit auswählen')}
                        </h4>
                            
                            <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-3 custom-scrollbar">
                          {DEFAULT_TIME_SLOTS.map((slot) => (
                            <motion.button
                              key={slot.value}
                                  initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.6, delay: 0.4 + parseInt(slot.value) * 0.15 }}
                                  className={`text-center px-3 py-2 rounded-md transition-all duration-400 ${
                                timeSlot === slot.value
                                  ? 'bg-[#C8A97E] text-black font-medium'
                                  : slot.available 
                                        ? 'bg-[#222] text-white hover:bg-[#2A2A2A]'
                                    : 'bg-[#1A1A1A]/50 text-gray-500 cursor-not-allowed'
                              }`}
                              onClick={() => slot.available && handleTimeSelect(slot.value)}
                              disabled={!slot.available}
                            >
                              {slot.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
              
              <AnimatePresence>
                {(isConfirming || isConfirmed) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.6 }}
                        className="p-4 border-t border-gray-800 flex items-center justify-center"
                  >
                    {isConfirming ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#C8A97E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-gray-300">{t('booking.confirmingBooking', 'Wird bestätigt...')}</span>
                      </>
                    ) : (
                          <motion.div 
                            className="flex items-center text-[#C8A97E]"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                          >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 