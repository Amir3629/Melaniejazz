"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from './calendar'
import { X, Calendar as CalendarIcon, Clock, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Matcher } from "react-day-picker";

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

// Add custom CSS for the calendar container
const calendarContainerStyles = `
  /* Calendar header and navigation */
  .calendar-container .rdp-caption {
    position: relative;
    height: 28px;
    margin-bottom: 8px;
  }
  
  .calendar-container .rdp-caption_label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: auto;
    z-index: 1;
  }
  
  .calendar-container .rdp-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    z-index: 2;
  }
  
  .calendar-container .rdp-nav_button {
    width: 24px !important;
    height: 24px !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: transparent !important;
    color: #C8A97E !important;
    opacity: 1 !important;
    visibility: visible !important;
    position: relative;
    margin: 0 20px;
  }
  
  .calendar-container .rdp-nav_button_previous {
    position: absolute;
    right: auto;
    left: calc(50% - 50px);
  }
  
  .calendar-container .rdp-nav_button_next {
    position: absolute;
    left: auto;
    right: calc(50% - 50px);
  }
  
  /* Calendar table and cells */
  .calendar-container .rdp-table {
    width: 100%;
    table-layout: fixed;
  }
  
  .calendar-container .rdp-cell {
    width: 28px !important;
    height: 28px !important;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  
  .calendar-container .rdp-day {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .calendar-container .rdp-day_selected {
    background-color: transparent !important;
    color: #D4AF37 !important;
    font-weight: bold !important;
  }
  
  .calendar-container .rdp-day_today {
    background-color: transparent !important;
    color: #C8A97E !important;
    font-weight: semibold !important;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) => {
    .calendar-container .rdp-caption,
    .calendar-container .rdp-nav {
      padding: 0 4px;
    }
    
    .calendar-container .rdp-cell,
    .calendar-container .rdp-day {
      width: 24px !important;
      height: 24px !important;
    }
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

const GoogleCalendarPicker = ({
  onChange,
  value,
  placeholder = "Datum auswählen",
  className = "",
  showTimeSelector = true,
  disablePastDates = true,
  disableWeekends = false
}: GoogleCalendarPickerProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Ref for the modal content
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Create a ref for the calendar trigger button
  const calendarTriggerRef = React.useRef<HTMLDivElement>(null);

  // Update the parent component when a date and time are selected
  useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date, onChange]);

  // Handle opening/closing the calendar
  const handleToggleCalendar = () => {
    setIsOpen(prev => !prev);
  };

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && !isClosing) {
      const timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100); // Delay slightly for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

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

  const handleTimeSelect = (time: string): void => {
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
          }, 600);
        }, 1000);
      }, 1000);
    }, 400);
  };

  return (
    <div className="relative">
      <style jsx global>{scrollbarStyles}</style>
      <style jsx global>{calendarContainerStyles}</style>
      <style jsx global>{`
        /* Override styles to fix specific issues */
        
        /* Remove any background from day cells on hover/select */
        .calendar-container .rdp-day {
          background-color: transparent !important;
          color: white !important;
        }
        
        .calendar-container .rdp-day:hover {
          background-color: transparent !important;
          color: #D4AF37 !important;
        }
        
        .calendar-container .rdp-day_selected {
          background-color: transparent !important;
          color: #D4AF37 !important;
          font-weight: bold !important;
        }
        
        .calendar-container .rdp-day_today {
          background-color: transparent !important;
          color: #C8A97E !important;
          font-weight: semibold !important;
        }
        
        /* Move arrows directly next to the month label */
        .calendar-container .rdp-caption {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative !important;
          height: 28px !important;
          margin-bottom: 8px !important;
        }
        
        .calendar-container .rdp-caption_label {
          position: static !important;
          transform: none !important;
          margin: 0 4px !important;
        }
        
        .calendar-container .rdp-nav {
          position: static !important;
          width: auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        
        .calendar-container .rdp-nav_button_previous,
        .calendar-container .rdp-nav_button_next {
          position: static !important;
          margin: 0 4px !important;
        }
      `}</style>
      
      <div 
        className={`flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#C8A97E] transition-colors ${className}`}
        onClick={handleToggleCalendar}
      >
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#C8A97E] mr-2" />
          <span className="text-gray-300">{date ? formatDate(date) : placeholder}</span>
          {timeSlot && date && (
            <span className="ml-2 text-[#C8A97E]">({timeSlot})</span>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 300);
              }}
            >
          <motion.div
                ref={modalRef}
                className="relative w-[90%] max-w-[280px] mx-auto px-0"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{
                opacity: isClosing ? 0 : 1,
                scale: isClosing ? 0.95 : 1,
                  y: isClosing ? 20 : 0
                }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 shadow-xl overflow-hidden mx-auto relative w-full">
                  <div className={`transition-all duration-300 ${isConfirming ? 'blur-sm' : ''}`}>
                    <div className="p-2 sm:p-3 calendar-container">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                        disabled={
                          disablePastDates || disableWeekends 
                            ? {
                                from: disablePastDates ? new Date() : undefined,
                                dayOfWeek: disableWeekends ? [0, 6] : undefined
                              }
                            : undefined
                        }
                      />
                    </div>
                    
                    {showTimeSlots && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-800 w-full"
                      >
                        <div className="p-2 sm:p-3">
                          <h3 className="text-sm font-medium text-white mb-2">{t('Select Time')}</h3>
                          <div 
                            className="grid gap-1.5 sm:gap-2" 
                            style={{ 
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              width: '100%'
                            }}
                          >
                          {DEFAULT_TIME_SLOTS.map((slot) => (
                          <button
                              key={slot.value}
                            onClick={() => handleTimeSelect(slot.value)}
                                className={`text-xs sm:text-sm rounded-md transition-colors py-1 sm:py-1.5 text-center w-full ${
                                  timeSlot === slot.value
                                ? 'bg-[#C8A97E] text-black'
                                  : slot.available 
                                    ? 'bg-[#222] text-white hover:bg-[#333]'
                                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                              {slot.label}
                          </button>
                          ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
              
                    {isConfirming && (
                          <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100
                      }}
                    >
                      <div className="flex items-center justify-center space-x-2 z-50 bg-black/40 px-4 py-2 rounded-md backdrop-blur-sm" style={{ minWidth: '140px', textAlign: 'center' }}>
                        <Check className="w-5 h-5 text-[#C8A97E]" />
                        <span className="text-white font-medium text-base">{t('Confirming...')}</span>
                      </div>
                  </motion.div>
                )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 

export default GoogleCalendarPicker;
