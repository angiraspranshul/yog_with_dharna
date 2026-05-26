"use client";

import { useState, useEffect } from "react";
import { addDays, format, parseISO } from "date-fns";
import axios from "axios";

interface YogaClass {
  id: string;
  title: string;
  description?: string;
  duration: number;
  level: string;
  price: number;
}

interface TimeSlot {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
}

export default function BookingContainer({
  classes,
  initialClassId,
  dbError,
}: {
  classes: YogaClass[];
  initialClassId: string;
  dbError: boolean;
}) {
  // 1. Selection States
  const [selectedClassId, setSelectedClassId] = useState(
    initialClassId || (classes.length > 0 ? classes[0].id : "")
  );

  // Get rolling 7 days starting from today
  const rollingDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const [selectedDate, setSelectedDate] = useState(rollingDays[0]);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  // 2. Booking Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const activeClass = classes.find((c) => c.id === selectedClassId);

  // Fetch slots whenever class selection or date changes
  useEffect(() => {
    if (!selectedClassId) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSlotsError("");
      setSelectedSlotId(""); // reset selected slot
      
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      try {
        const response = await axios.get(
          `/api/slots?classId=${selectedClassId}&date=${formattedDate}`
        );
        setSlots(response.data.slots);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlotsError("Could not retrieve slots. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedClassId, selectedDate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Form Submission (Concurrently Safe Database write + Razorpay Checkout integration)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !fullName || !email) return;

    setIsSubmitting(true);
    setSlotsError("");

    try {
      // 1. Create secure Booking entry in DB (status: PENDING, holds slot seat)
      const bookingResponse = await axios.post("/api/bookings", {
        fullName,
        email,
        phone,
        slotId: selectedSlotId,
      });

      const { booking } = bookingResponse.data;

      // 2. Generate Razorpay Checkout Order
      const orderResponse = await axios.post("/api/payments/order", {
        amount: activeClass?.price || 0,
        bookingId: booking.id,
      });

      const order = orderResponse.data;

      // 3. Staging/Sandbox Preview Fallback
      if (order.mock) {
        console.log("Staging preview detected. Simulating transaction completion.");
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Aesthetic processing delay
        
        const selectedSlot = slots.find((s) => s.id === selectedSlotId);
        setBookingSuccess({
          className: activeClass?.title || "Yoga Session",
          price: activeClass?.price || 0,
          date: format(selectedDate, "EEEE, MMMM d, yyyy"),
          time: selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "",
          customerName: fullName,
          customerEmail: email,
          meetLink: "https://meet.google.com/abc-defg-hij"
        });
        setIsSubmitting(false);
        return;
      }

      // 4. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment SDK. Please verify your internet connection.");
      }

      // 5. Open Razorpay Payment UI
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Yog with Dhaarna",
        description: `Booking reservation for ${activeClass?.title}`,
        order_id: order.id,
        prefill: {
          name: fullName,
          email: email,
          contact: phone || "",
        },
        notes: {
          bookingId: booking.id,
        },
        theme: {
          color: "#c29547",
        },
        handler: async function (response: any) {
          setIsSubmitting(true);
          // When payment is successful, verify the layout details and show the success confirmation state
          const selectedSlot = slots.find((s) => s.id === selectedSlotId);
          setBookingSuccess({
            className: activeClass?.title || "Yoga Session",
            price: activeClass?.price || 0,
            date: format(selectedDate, "EEEE, MMMM d, yyyy"),
            time: selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "",
            customerName: fullName,
            customerEmail: email,
            meetLink: "https://meet.google.com/abc-defg-hij"
          });
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error("Booking flow failure:", err);
      setSlotsError(
        err.response?.data?.error || 
        err.message || 
        "A checkout error occurred. Please refresh and try again."
      );
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto glass-effect border border-border rounded-3xl p-8 sm:p-12 text-center animate-fade-in-up shadow-xl mt-4">
        <div className="w-20 h-20 rounded-full brand-gradient-bg flex items-center justify-center text-white text-4xl mx-auto shadow-md mb-8 animate-bounce">
          ✓
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4">
          Session Reserved!
        </h2>
        <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          Namaste, <span className="font-bold text-stone-950 dark:text-stone-50">{bookingSuccess.customerName}</span>. Your slot is confirmed. A booking receipt and confirmation have been sent to <span className="font-semibold text-stone-900 dark:text-stone-100">{bookingSuccess.customerEmail}</span>.
        </p>

        {/* Booking Summary Box */}
        <div className="bg-stone-50/70 dark:bg-stone-950/30 border border-border rounded-2xl p-6 text-left flex flex-col gap-3.5 max-w-md mx-auto mb-8 text-sm sm:text-base">
          <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
            <span className="text-muted font-medium">Class type</span>
            <span className="font-serif font-bold text-stone-950 dark:text-stone-50">{bookingSuccess.className}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Date</span>
            <span className="font-semibold text-stone-950 dark:text-stone-50">{bookingSuccess.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Time</span>
            <span className="font-semibold text-stone-950 dark:text-stone-50">{bookingSuccess.time}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border/50 pt-2.5">
            <span className="text-muted font-medium">Amount paid</span>
            <span className="brand-gradient-text font-bold text-lg">₹{bookingSuccess.price}</span>
          </div>
        </div>

        {/* Meet Link CTA */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <a 
            href={bookingSuccess.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full brand-gradient-bg text-white hover:shadow-lg transition-all duration-300 font-semibold transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
            Join Google Meet Session
          </a>
          <button 
            onClick={() => setBookingSuccess(null)}
            className="w-full py-3.5 rounded-full border border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium text-stone-700 dark:text-stone-300"
          >
            Book Another Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Selector & Calendar Picker (Left side - 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        
        {/* Class Selection Dropdown */}
        <div className="glass-effect border border-border p-6 sm:p-8 rounded-3xl flex flex-col gap-4">
          <label htmlFor="class-select" className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100">
            1. Select Yoga Practice Type
          </label>
          <div className="relative">
            <select
              id="class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-4 px-5 rounded-2xl font-medium focus:outline-none focus:ring-1 focus:ring-brand appearance-none cursor-pointer text-sm sm:text-base"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level} · ₹{c.price})
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              ▼
            </div>
          </div>

          {activeClass?.description && (
            <p className="text-muted text-xs sm:text-sm leading-relaxed mt-2 italic">
              "{activeClass.description}"
            </p>
          )}
        </div>

        {/* 7-Day Rolling Calendar Picker */}
        <div className="glass-effect border border-border p-6 sm:p-8 rounded-3xl flex flex-col gap-6">
          <h3 className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100">
            2. Choose Date
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {rollingDays.map((date, index) => {
              const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              const isToday = index === 0;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border focus:outline-none ${
                    isSelected
                      ? "brand-gradient-bg border-transparent text-white shadow-md scale-[1.03]"
                      : "bg-stone-50 dark:bg-stone-900 border-border hover:bg-stone-100 dark:hover:bg-stone-850"
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${
                    isSelected ? "text-white/80" : "text-muted"
                  }`}>
                    {format(date, "EEE")}
                  </span>
                  
                  <span className="text-lg sm:text-xl font-bold font-serif my-1">
                    {format(date, "d")}
                  </span>
                  
                  <span className={`text-[9px] uppercase font-bold tracking-wider ${
                    isSelected ? "text-white/90" : isToday ? "text-brand" : "text-muted/60"
                  }`}>
                    {isToday ? "Today" : format(date, "MMM")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Slot List Picker */}
        <div className="glass-effect border border-border p-6 sm:p-8 rounded-3xl flex flex-col gap-6">
          <h3 className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100">
            3. Available Time Slots
          </h3>

          {loadingSlots ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted text-sm font-semibold">
              <span className="w-7.5 h-7.5 rounded-full border-2 border-brand border-t-transparent animate-spin"></span>
              Checking slot availability...
            </div>
          ) : slotsError ? (
            <div className="text-center py-10 text-rose-500 text-sm font-medium border border-rose-500/20 bg-rose-550/5 rounded-2xl">
              ⚠️ {slotsError}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm font-semibold">
              🌸 No sessions scheduled on this day. Please select another date.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {slots.map((s) => {
                const isSelected = s.id === selectedSlotId;
                const isFull = s.bookedCount >= s.capacity;
                const remaining = s.capacity - s.bookedCount;

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`flex items-center justify-between p-4.5 rounded-2xl transition-all duration-300 border text-left focus:outline-none ${
                      isFull
                        ? "bg-stone-100/50 dark:bg-stone-900/30 border-border opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "brand-gradient-bg border-transparent text-white shadow-md scale-[1.01]"
                        : "bg-stone-50 dark:bg-stone-900 border-border hover:bg-stone-100 dark:hover:bg-stone-850"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm sm:text-base">
                        {s.startTime} - {s.endTime}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isSelected ? "text-white/80" : "text-muted"
                      }`}>
                        {activeClass?.duration} Mins
                      </span>
                    </div>

                    <div className="text-right">
                      {isFull ? (
                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
                          Fully Booked
                        </span>
                      ) : (
                        <span className={`text-xs font-semibold ${
                          isSelected ? "text-white/85" : "text-muted"
                        }`}>
                          {remaining} {remaining === 1 ? "spot" : "spots"} left
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {dbError && (
            <div className="text-[10px] text-center text-muted/50 mt-2">
              💡 Simulating live slot fetches (Supabase remote database credentials not yet loaded).
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Card (Right side - 5 cols) */}
      <div className="lg:col-span-5 glass-effect border border-border p-6 sm:p-8 rounded-3xl sticky top-28">
        <h3 className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100 mb-6 border-b border-border/50 pb-4">
          4. Confirm Reservation
        </h3>

        {!selectedSlotId ? (
          <div className="py-12 text-center text-muted text-sm font-semibold border border-dashed border-border rounded-2xl bg-stone-50/20 dark:bg-stone-950/5">
            🧘‍♀️ Select a time slot to complete booking details.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
            
            {/* Class Details Summary */}
            <div className="bg-stone-50/70 dark:bg-stone-950/20 border border-border p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-muted font-medium">Practice class</span>
                <span className="font-serif font-bold text-stone-950 dark:text-stone-50">{activeClass?.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted font-medium">Class date</span>
                <span className="font-semibold text-stone-950 dark:text-stone-50">
                  {format(selectedDate, "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted font-medium">Time slot</span>
                <span className="font-semibold text-stone-950 dark:text-stone-50">
                  {slots.find((s) => s.id === selectedSlotId)?.startTime} -{" "}
                  {slots.find((s) => s.id === selectedSlotId)?.endTime}
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullname" className="font-medium text-stone-700 dark:text-stone-300">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-medium text-stone-700 dark:text-stone-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya@example.com"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="font-medium text-stone-700 dark:text-stone-300">
                Phone Number <span className="text-muted text-xs">(Optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
              />
            </div>

            {/* Price & Submit */}
            <div className="border-t border-border/60 pt-5 mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted">Subtotal Price</span>
                <span className="brand-gradient-text font-bold text-xl sm:text-2xl">
                  ₹{activeClass?.price}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4.5 rounded-2xl brand-gradient-bg text-white hover:shadow-lg transition-all duration-300 font-semibold transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin shrink-0"></span>
                    Processing checkout...
                  </>
                ) : (
                  <>Secure Book & Pay</>
                )}
              </button>
              
              <p className="text-[10px] text-center text-muted">
                🛡️ Transacting securely using test-sandbox credentials.
              </p>
            </div>

          </form>
        )}
      </div>

    </div>
  );
}
