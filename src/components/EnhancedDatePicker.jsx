import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, X } from 'lucide-react';
import {
  format,
  parse,
  isValid,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';

const EnhancedDatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  includeTime = false,
  allowRange = false,
  presets = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const datePresets = [
    {
      label: 'Today',
      getValue: () => ({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: 'Yesterday',
      getValue: () => ({
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1)),
      }),
    },
    {
      label: 'Last 7 days',
      getValue: () => ({
        from: startOfDay(subDays(new Date(), 6)),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: 'Last 30 days',
      getValue: () => ({
        from: startOfDay(subDays(new Date(), 29)),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: 'This week',
      getValue: () => ({
        from: startOfWeek(new Date()),
        to: endOfWeek(new Date()),
      }),
    },
    {
      label: 'This month',
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      label: 'This year',
      getValue: () => ({
        from: startOfYear(new Date()),
        to: endOfYear(new Date()),
      }),
    },
  ];

  useEffect(() => {
    if (value) {
      if (allowRange && value.from && value.to) {
        setInputValue(
          `${format(value.from, 'MMM dd, yyyy')} - ${format(value.to, 'MMM dd, yyyy')}`
        );
      } else if (!allowRange && value) {
        setInputValue(
          format(value, includeTime ? 'MMM dd, yyyy HH:mm' : 'MMM dd, yyyy')
        );
      }
    } else {
      setInputValue('');
    }
  }, [value, allowRange, includeTime]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = e => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the input
    if (allowRange) {
      const parts = newValue.split(' - ');
      if (parts.length === 2) {
        try {
          const from = parse(parts[0], 'MMM dd, yyyy', new Date());
          const to = parse(parts[1], 'MMM dd, yyyy', new Date());
          if (isValid(from) && isValid(to)) {
            onChange({ from: startOfDay(from), to: endOfDay(to) });
          }
        } catch (error) {
          // Invalid date format, ignore
        }
      }
    } else {
      try {
        const dateFormat = includeTime ? 'MMM dd, yyyy HH:mm' : 'MMM dd, yyyy';
        const parsedDate = parse(newValue, dateFormat, new Date());
        if (isValid(parsedDate)) {
          onChange(parsedDate);
        }
      } catch (error) {
        // Invalid date format, ignore
      }
    }
  };

  const handlePresetClick = preset => {
    const range = preset.getValue();
    if (allowRange) {
      onChange(range);
      setSelectedRange(preset.label);
    } else {
      onChange(range.from);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange(allowRange ? { from: null, to: null } : null);
    setSelectedRange(null);
  };

  const generateCalendarDays = date => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const startWeek = startOfWeek(start);
    const endWeek = endOfWeek(end);

    const days = [];
    let current = startWeek;

    while (current <= endWeek) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }

    return days;
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarDays = generateCalendarDays(currentMonth);

  const handleDateClick = date => {
    if (allowRange) {
      if (!selectedRange || (selectedRange.from && selectedRange.to)) {
        // Start new range
        setSelectedRange({ from: startOfDay(date), to: null });
      } else if (selectedRange.from && !selectedRange.to) {
        // Complete range
        const from = selectedRange.from;
        const to = endOfDay(date);
        const range = from <= to ? { from, to } : { from: to, to: from };
        onChange(range);
        setSelectedRange(null);
        setIsOpen(false);
      }
    } else {
      onChange(includeTime ? date : startOfDay(date));
      setIsOpen(false);
    }
  };

  const isDateInRange = date => {
    if (!allowRange || !value?.from || !value?.to) return false;
    return date >= value.from && date <= value.to;
  };

  const isDateSelected = date => {
    if (allowRange) {
      return isDateInRange(date);
    } else {
      return (
        value && format(date, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd')
      );
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Calendar className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[300px]">
          {presets && (
            <div className="p-3 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Quick Select
              </div>
              <div className="grid grid-cols-2 gap-1">
                {datePresets.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className="px-3 py-1 text-sm text-left hover:bg-gray-100 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCurrentMonth(subDays(currentMonth, 30))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <div className="font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <button
                onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();
                const isToday =
                  format(date, 'yyyy-MM-dd') ===
                  format(new Date(), 'yyyy-MM-dd');
                const isSelected = isDateSelected(date);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`
                      w-8 h-8 text-sm rounded transition-colors
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isToday ? 'bg-blue-100 text-blue-600 font-medium' : ''}
                      ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {includeTime && !allowRange && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={value ? format(value, 'HH:mm') : ''}
                    onChange={e => {
                      if (value && e.target.value) {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(value);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        onChange(newDate);
                      }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDatePicker;
