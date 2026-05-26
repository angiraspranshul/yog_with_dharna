"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ClassItem {
  id: string;
  title: string;
  duration: number;
  level: string;
  price: number;
}

interface SlotItem {
  id: string;
  classId: string;
  class: ClassItem;
  date: any;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
}

interface BookingItem {
  id: string;
  amount: number;
  status: string;
  createdAt: any;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  slot: SlotItem;
}

export default function AdminDashboard({
  bookings,
  classes,
  slots,
  dbError,
}: {
  bookings: BookingItem[];
  classes: ClassItem[];
  slots: SlotItem[];
  dbError: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"bookings" | "classes" | "slots">("bookings");
  const router = useRouter();

  // Creation States
  const [newClass, setNewClass] = useState({ title: "", description: "", duration: 60, level: "Beginner", price: 500 });
  const [newSlot, setNewSlot] = useState({ classId: classes[0]?.id || "", date: "", startTime: "", endTime: "", capacity: 15 });

  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Sign out Handler
  const handleLogout = async () => {
    try {
      await axios.post("/api/admin/logout");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Class submit handler
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFeedback(null);

    // Simulate database write / or hits actual endpoint in next step
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFeedback({ type: "success", message: `Yoga class "${newClass.title}" created successfully!` });
    setNewClass({ title: "", description: "", duration: 60, level: "Beginner", price: 500 });
    setFormLoading(false);
  };

  // Slot submit handler
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFeedback(null);

    // Simulate database write
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFeedback({ type: "success", message: "Time slot scheduled successfully!" });
    setNewSlot({ classId: classes[0]?.id || "", date: "", startTime: "", endTime: "", capacity: 15 });
    setFormLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-border/60 pb-6">
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Dhaarna's Schedule Manager
          </h2>
          <p className="text-muted text-xs sm:text-sm">
            Control available classes, dates, and view student payments and links.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-full border border-rose-500/20 hover:bg-rose-550/5 text-rose-500 font-semibold text-xs transition-colors shrink-0 focus:outline-none"
        >
          Sign Out Dashboard
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border/80 text-sm font-medium gap-2 overflow-x-auto shrink-0 pb-1 scrollbar-none">
        <button
          onClick={() => { setActiveTab("bookings"); setFeedback(null); }}
          className={`px-5 py-3 rounded-t-xl transition-colors shrink-0 focus:outline-none border-b-2 ${
            activeTab === "bookings"
              ? "border-brand text-brand font-semibold"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Bookings List ({bookings.length})
        </button>
        <button
          onClick={() => { setActiveTab("classes"); setFeedback(null); }}
          className={`px-5 py-3 rounded-t-xl transition-colors shrink-0 focus:outline-none border-b-2 ${
            activeTab === "classes"
              ? "border-brand text-brand font-semibold"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Manage Classes ({classes.length})
        </button>
        <button
          onClick={() => { setActiveTab("slots"); setFeedback(null); }}
          className={`px-5 py-3 rounded-t-xl transition-colors shrink-0 focus:outline-none border-b-2 ${
            activeTab === "slots"
              ? "border-brand text-brand font-semibold"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Manage Time Slots ({slots.length})
        </button>
      </div>

      {feedback && (
        <div className={`p-4 text-center text-xs font-semibold rounded-2xl animate-fade-in-up border ${
          feedback.type === "success" 
            ? "text-emerald-600 border-emerald-600/20 bg-emerald-500/5" 
            : "text-rose-500 border-rose-500/20 bg-rose-550/5"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Tab Content 1: Bookings Grid */}
      {activeTab === "bookings" && (
        <div className="glass-effect border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50/50 dark:bg-stone-950/20 border-b border-border/80 font-serif font-bold text-stone-900 dark:text-stone-100">
                  <th className="py-4 px-6">Student Info</th>
                  <th className="py-4 px-6">Class Type</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Paid Amount</th>
                  <th className="py-4 px-6 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-stone-950 dark:text-stone-50">{b.user.name}</span>
                        <span className="text-muted text-[10px] sm:text-xs">{b.user.email}</span>
                        {b.user.phone && (
                          <span className="text-muted text-[9px] tracking-wider mt-0.5">{b.user.phone}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 font-serif font-semibold text-stone-900 dark:text-stone-100">
                      {b.slot.class.title}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-0.5 font-medium">
                        <span>{new Date(b.slot.date).toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className="text-muted text-[10px] sm:text-xs">{b.slot.startTime} - {b.slot.endTime}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-bold brand-gradient-text text-base">
                      ₹{b.amount}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        b.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Classes Manager */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List of existing classes (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">
              Existing Classes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.map((c) => (
                <div key={c.id} className="glass-effect border border-border p-5 rounded-2xl flex flex-col gap-3">
                  <h4 className="font-serif font-semibold text-stone-950 dark:text-stone-50">{c.title}</h4>
                  <div className="flex items-center justify-between text-xs font-semibold mt-auto border-t border-border/50 pt-3">
                    <span className="text-muted">{c.level}</span>
                    <span className="text-muted">{c.duration} mins</span>
                    <span className="brand-gradient-text text-sm">₹{c.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to create class (5 cols) */}
          <form onSubmit={handleCreateClass} className="lg:col-span-5 glass-effect border border-border p-6 rounded-3xl flex flex-col gap-4.5 text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 border-b border-border/40 pb-3">
              Add New Class Type
            </h3>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-title" className="font-medium text-stone-700 dark:text-stone-300">Class Title</label>
              <input
                id="c-title"
                type="text"
                required
                value={newClass.title}
                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                placeholder="e.g. Hatha Yoga Flow"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="c-duration" className="font-medium text-stone-700 dark:text-stone-300">Duration (mins)</label>
                <input
                  id="c-duration"
                  type="number"
                  required
                  value={newClass.duration}
                  onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="c-price" className="font-medium text-stone-700 dark:text-stone-300">Price (INR)</label>
                <input
                  id="c-price"
                  type="number"
                  required
                  value={newClass.price}
                  onChange={(e) => setNewClass({ ...newClass, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-level" className="font-medium text-stone-700 dark:text-stone-300">Difficulty Level</label>
              <select
                id="c-level"
                value={newClass.level}
                onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50 cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="c-desc" className="font-medium text-stone-700 dark:text-stone-300">Description</label>
              <textarea
                id="c-desc"
                rows={3}
                required
                value={newClass.description}
                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                placeholder="Mindful poses targeting physical structure..."
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3.5 rounded-xl brand-gradient-bg text-white hover:shadow-md transition-all duration-300 font-semibold transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-sm"
            >
              {formLoading ? "Creating..." : "Save Class Type"}
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 3: TimeSlots Manager */}
      {activeTab === "slots" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List of slots (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">
              Scheduled Time Slots
            </h3>
            
            <div className="overflow-x-auto glass-effect border border-border rounded-2xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50/50 dark:bg-stone-950/20 border-b border-border/80 font-serif font-bold text-stone-900 dark:text-stone-100">
                    <th className="py-3 px-5">Class</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Time Window</th>
                    <th className="py-3 px-5 text-center">Reservations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {slots.map((s) => (
                    <tr key={s.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                      <td className="py-4 px-5 font-semibold text-stone-950 dark:text-stone-50">{s.class.title}</td>
                      <td className="py-4 px-5">
                        {new Date(s.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-4 px-5 font-medium">{s.startTime} - {s.endTime}</td>
                      <td className="py-4 px-5 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          s.bookedCount >= s.capacity 
                            ? "bg-rose-500/10 text-rose-500" 
                            : "bg-brand/10 text-brand"
                        }`}>
                          {s.bookedCount} / {s.capacity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form to schedule slot (5 cols) */}
          <form onSubmit={handleCreateSlot} className="lg:col-span-5 glass-effect border border-border p-6 rounded-3xl flex flex-col gap-4.5 text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 border-b border-border/40 pb-3">
              Open Calendar Slot
            </h3>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="s-class" className="font-medium text-stone-700 dark:text-stone-300">Select Class Type</label>
              <select
                id="s-class"
                value={newSlot.classId}
                onChange={(e) => setNewSlot({ ...newSlot, classId: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50 cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="s-date" className="font-medium text-stone-700 dark:text-stone-300">Date</label>
              <input
                id="s-date"
                type="date"
                required
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="s-start" className="font-medium text-stone-700 dark:text-stone-300">Start Time</label>
                <input
                  id="s-start"
                  type="text"
                  required
                  placeholder="e.g. 08:00"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="s-end" className="font-medium text-stone-700 dark:text-stone-300">End Time</label>
                <input
                  id="s-end"
                  type="text"
                  required
                  placeholder="e.g. 09:00"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="s-capacity" className="font-medium text-stone-700 dark:text-stone-300">Capacity (spots)</label>
              <input
                id="s-capacity"
                type="number"
                required
                value={newSlot.capacity}
                onChange={(e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) || 0 })}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3.5 rounded-xl brand-gradient-bg text-white hover:shadow-md transition-all duration-300 font-semibold transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-sm"
            >
              {formLoading ? "Scheduling..." : "Open Calendar Slot"}
            </button>
          </form>
        </div>
      )}

      {dbError && (
        <div className="text-[10px] text-center text-muted/50 mt-4 italic">
          💡 Previewing simulated dashboard data (remote Supabase database connection details not yet loaded).
        </div>
      )}
    </div>
  );
}
