import jalaali from "jalaali-js";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";
import Portal from "../portal";

type Props = {
  value?: string | number; // Accept string (timestamp) or Jalali date string if needed
  onChange: (timestamp: string) => void; // Always return timestamp as string
};

export default function DatePicker({ value, onChange }: Props) {
  const today = new Date();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const jToday = jalaali.toJalaali(today);
  const MAX_YEAR = jToday.jy;
  const MIN_YEAR = jToday.jy - 100;

  const [year, setYear] = useState(MAX_YEAR);
  const [month, setMonth] = useState(jToday.jm - 1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [show, setShow] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);

  const YEARS_PER_PAGE = 20;
  const [yearPage, setYearPage] = useState(
    Math.floor((MAX_YEAR - MIN_YEAR) / YEARS_PER_PAGE)
  );

  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const getDaysInMonth = (jy: number, jm: number): number[] => {
    const days = jalaali.jalaaliMonthLength(jy, jm + 1);
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const paginatedYears = Array.from(
    { length: YEARS_PER_PAGE },
    (_, i) => MIN_YEAR + i + yearPage * YEARS_PER_PAGE
  ).filter((y) => y <= MAX_YEAR);

  const hasPrevPage = MIN_YEAR + (yearPage - 1) * YEARS_PER_PAGE >= MIN_YEAR;
  const hasNextPage = MIN_YEAR + (yearPage + 1) * YEARS_PER_PAGE <= MAX_YEAR;

  const [selectedYear, selectedMonth, selectedDay] = selectedDate
    ? selectedDate.split("-").map(Number)
    : [null, null, null];

  const handleSelectDate = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const formatted = `${year}-${mm}-${dd}`;
    setSelectedDate(formatted);

    const { gy, gm, gd } = jalaali.toGregorian(year, month + 1, day);
    const timestamp = new Date(gy, gm - 1, gd).getTime() / 1000;

    onChange(String(timestamp));
    setShow(false);
  };

  useEffect(() => {
    if (!value) return;

    const timestamp =
      typeof value === "number" || /^\d+$/.test(value) ? Number(value) : null;

    if (timestamp) {
      const date = new Date(timestamp);
      const jDate = jalaali.toJalaali(date);
      const formatted = `${jDate.jy}-${String(jDate.jm).padStart(
        2,
        "0"
      )}-${String(jDate.jd).padStart(2, "0")}`;
      setSelectedDate(formatted);
      setYear(jDate.jy);
      setMonth(jDate.jm - 1);
      setYearPage(Math.floor((jDate.jy - MIN_YEAR) / YEARS_PER_PAGE));
    } else {
      setSelectedDate(String(value));
    }
  }, [value,MIN_YEAR]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShow(false);
      }
    };
    if (show) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        readOnly
        value={selectedDate}
        onClick={() => setShow(true)}
        className="input"
        placeholder="انتخاب تاریخ تولد"
      />

      <Portal id="date-picker">
        {show && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[9998]" />

            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className="fixed z-[9999] top-1/2 left-1/2 max-w-md w-full max-h-[80vh] overflow-auto -translate-x-1/2 -translate-y-1/2 rounded bg-background dark:text-white p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">انتخاب تاریخ تولد</h2>
                <button
                  onClick={() => setShow(false)}
                  aria-label="بستن"
                  className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Year Selection */}
              {showYearSelect ? (
                <div>
                  <div className="grid grid-cols-4 gap-2 mb-4 border-b-2 border-primary-main pb-3">
                    {paginatedYears.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setYear(y);
                          setShowYearSelect(false);
                        }}
                        className={cn(
                          "py-1 rounded text-center",
                          year === y
                            ? "bg-primary-main text-white"
                            : "bg-zinc-100 dark:bg-zinc-600"
                        )}
                      >
                        {y}
                      </button>
                    ))}
                  <div className="flex justify-between mt-2 gap-2 col-span-full">
                    <button
                      disabled={!hasPrevPage}
                      onClick={() => setYearPage((p) => Math.max(p - 1, 0))}
                      className="flex-1 py-1 bg-zinc-100 dark:bg-zinc-600 rounded disabled:opacity-30"
                    >
                      قبلی
                    </button>
                    <button
                      disabled={!hasNextPage}
                      onClick={() => setYearPage((p) => p + 1)}
                      className="flex-1 py-1 bg-zinc-100 dark:bg-zinc-600 rounded disabled:opacity-30"
                    >
                      بعدی
                    </button>
                  </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-3 gap-2">
                  <button
                    onClick={() => setYear((y) => Math.max(y - 1, MIN_YEAR))}
                    className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    aria-label="سال قبل"
                  >
                    <ArrowRight size={20} />
                  </button>

                  <button
                    onClick={() => setShowYearSelect(true)}
                    className="flex-1 text-center font-semibold bg-zinc-100 dark:bg-zinc-600 py-1 rounded"
                  >
                    {year}
                  </button>

                  <button
                    onClick={() => setYear((y) => Math.min(y + 1, MAX_YEAR))}
                    className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    aria-label="سال بعد"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>
              )}

              {/* Month Selection */}
              <div className="grid grid-cols-4 gap-2 mb-4 border-b-2 border-primary-main pb-3">
                {months.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMonth(idx)}
                    className={cn(
                      "px-3 py-1 rounded",
                      idx === month
                        ? "bg-primary-main text-white"
                        : "bg-zinc-100 dark:bg-zinc-600"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Day Selection */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(year, month).map((day) => {
                  const isActive =
                    selectedYear === year &&
                    selectedMonth === month + 1 &&
                    selectedDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => handleSelectDate(day)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded transition hover:bg-primary-main/20 dark:hover:bg-primary-main/30",
                        isActive && "bg-primary-main text-white"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Portal>
    </div>
  );
}
