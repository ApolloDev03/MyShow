// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";
// type ShowStatus = "Upcoming" | "Draft" | "Completed";

// type EventItem = {
//     id: string;
//     title: string;
//     startDate: string; // YYYY-MM-DD
//     time: string; // HH:mm
//     description: string;

//     address: string;
//     state: string;
//     city: string;

//     paymentType: PaymentType;
//     ticketPrice?: string;
//     ticketCount?: string;
//     paidMode?: PaidMode;
//     onlineInfo?: string;
//     offlineInfo?: string;

//     status: ShowStatus;

//     bannerUrl?: string; // dummy preview
//     galleryCount?: number;
//     createdAt: string;
// };

// const badgeStyle: Record<ShowStatus, string> = {
//     Upcoming: "bg-primary/10 text-primary border-primary/20",
//     Draft: "bg-secondary/20 text-secondary border-secondary/30",
//     Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
// };

// const inputCls =
//     "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// export default function AdminEventsPage() {
//     const [events, setEvents] = useState<EventItem[]>([
//         {
//             id: "EV-1001",
//             title: "New Year Musical Night",
//             startDate: "2026-01-15",
//             time: "19:00",
//             description: "Live music + DJ night. Family friendly show.",
//             address: "City Hall Road, Near Central Park",
//             state: "Gujarat",
//             city: "Ahmedabad",
//             paymentType: "paid",
//             ticketPrice: "299",
//             ticketCount: "150",
//             paidMode: "online",
//             onlineInfo: "UPI: myshow@upi",
//             status: "Upcoming",
//             bannerUrl: "",
//             galleryCount: 5,
//             createdAt: "2 hours ago",
//         },
//         {
//             id: "EV-1002",
//             title: "Standup Comedy Live",
//             startDate: "2026-01-18",
//             time: "20:30",
//             description: "Top comedians performing live.",
//             address: "Apollo Arena, Ring Road",
//             state: "Gujarat",
//             city: "Surat",
//             paymentType: "free",
//             status: "Upcoming",
//             bannerUrl: "",
//             galleryCount: 3,
//             createdAt: "Yesterday",
//         },
//         {
//             id: "EV-1003",
//             title: "Kids Dance Fest",
//             startDate: "2026-01-22",
//             time: "18:00",
//             description: "School dance competition + prizes.",
//             address: "Community Center, Main Street",
//             state: "Gujarat",
//             city: "Vadodara",
//             paymentType: "paid",
//             ticketPrice: "99",
//             ticketCount: "300",
//             paidMode: "offline",
//             offlineInfo: "Pay at venue counter",
//             status: "Draft",
//             bannerUrl: "",
//             galleryCount: 0,
//             createdAt: "2 days ago",
//         },
//         {
//             id: "EV-1004",
//             title: "Drama Night: The Stage",
//             startDate: "2026-01-28",
//             time: "19:30",
//             description: "Stage drama night with special guests.",
//             address: "Town Theatre, Old City",
//             state: "Gujarat",
//             city: "Rajkot",
//             paymentType: "paid",
//             ticketPrice: "199",
//             ticketCount: "120",
//             paidMode: "online",
//             onlineInfo: "Payment link: https://example.com",
//             status: "Completed",
//             bannerUrl: "",
//             galleryCount: 8,
//             createdAt: "4 days ago",
//         },
//     ]);

//     // Filters
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

//     // Edit modal
//     const [editOpen, setEditOpen] = useState(false);
//     const [editItem, setEditItem] = useState<EventItem | null>(null);

//     const filtered = useMemo(() => {
//         const s = search.trim().toLowerCase();
//         return events.filter((e) => {
//             const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
//             const searchOk =
//                 !s ||
//                 e.title.toLowerCase().includes(s) ||
//                 e.city.toLowerCase().includes(s) ||
//                 e.id.toLowerCase().includes(s);
//             return statusOk && searchOk;
//         });
//     }, [events, search, statusFilter]);

//     const openEdit = (item: EventItem) => {
//         setEditItem({ ...item });
//         setEditOpen(true);
//     };

//     const closeEdit = () => {
//         setEditOpen(false);
//         setEditItem(null);
//     };

//     const updateEvent = () => {
//         if (!editItem) return;

//         if (!editItem.title || !editItem.startDate || !editItem.time || !editItem.description) {
//             alert("Please fill Title, Date, Time and Description");
//             return;
//         }
//         if (!editItem.address || !editItem.state || !editItem.city) {
//             alert("Please fill Address, State and City");
//             return;
//         }
//         if (editItem.paymentType === "paid") {
//             if (!editItem.ticketPrice) return alert("Please enter Ticket Price");
//             if ((editItem.paidMode || "online") === "online" && !editItem.onlineInfo)
//                 return alert("Please enter Online Payment Info");
//             if (editItem.paidMode === "offline" && !editItem.offlineInfo)
//                 return alert("Please enter Offline Payment Info");
//         }

//         setEvents((prev) => prev.map((x) => (x.id === editItem.id ? editItem : x)));
//         closeEdit();
//     };

//     const deleteEvent = (id: string) => {
//         const ok = window.confirm("Are you sure you want to delete this event?");
//         if (!ok) return;
//         setEvents((prev) => prev.filter((e) => e.id !== id));
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header */}
//                 <div className="flex items-center justify-between gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
//                         <p className="text-sm text-black/60">Manage your events (edit / delete).</p>
//                     </div>

//                     <Link
//                         href="/admin/create-event"
//                         className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         <FiPlus className="text-base" />
//                         Create Event
//                     </Link>
//                 </div>

//                 {/* Filters */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//                     <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//                         <div className="sm:col-span-8">
//                             <label className={labelCls}>Search</label>
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Search by title / city / id..."
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div className="sm:col-span-4">
//                             <label className={labelCls}>Status</label>
//                             <select
//                                 value={statusFilter}
//                                 onChange={(e) => setStatusFilter(e.target.value as ShowStatus | "All")}
//                                 className={`${inputCls} mt-2`}
//                             >
//                                 <option value="All">All</option>
//                                 <option value="Upcoming">Upcoming</option>
//                                 <option value="Draft">Draft</option>
//                                 <option value="Completed">Completed</option>
//                             </select>
//                         </div>
//                     </div>
//                 </section>

//                 {/* TABLE LISTING */}
//                 <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-245 w-full">
//                             <thead className="bg-black/3">
//                                 <tr className="text-left text-sm font-semibold text-black">
//                                     <th className="px-4 py-3">Banner</th>
//                                     <th className="px-4 py-3">Event</th>
//                                     <th className="px-4 py-3">Date / Time</th>
//                                     <th className="px-4 py-3">Location</th>
//                                     <th className="px-4 py-3">Type</th>
//                                     <th className="px-4 py-3">Status</th>
//                                     <th className="px-4 py-3">Created</th>
//                                     <th className="px-4 py-3 text-right">Actions</th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-black/10">
//                                 {filtered.map((e) => (
//                                     <tr key={e.id} className="hover:bg-black/2">
//                                         {/* Banner */}
//                                         <td className="px-4 py-3">
//                                             <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
//                                                 {e.bannerUrl ? (
//                                                     // eslint-disable-next-line @next/next/no-img-element
//                                                     <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
//                                                 ) : (
//                                                     <span className="text-xs text-black/50">No banner</span>
//                                                 )}
//                                             </div>
//                                         </td>

//                                         {/* Event */}
//                                         <td className="px-4 py-3">
//                                             <div className="min-w-0">
//                                                 <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
//                                                 <p className="text-xs text-black/50">
//                                                     ID: {e.id} • Gallery: {e.galleryCount ?? 0}
//                                                 </p>
//                                             </div>
//                                         </td>

//                                         {/* Date / Time */}
//                                         <td className="px-4 py-3 text-sm text-black/70">
//                                             <p>{e.startDate}</p>
//                                             <p className="text-xs text-black/50">{e.time}</p>
//                                         </td>

//                                         {/* Location */}
//                                         <td className="px-4 py-3 text-sm text-black/70">
//                                             <p className="font-medium text-black">{e.city}</p>
//                                             <p className="text-xs text-black/50">{e.state}</p>
//                                         </td>

//                                         {/* Type */}
//                                         <td className="px-4 py-3 text-sm">
//                                             {e.paymentType === "free" ? (
//                                                 <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                                                     Free
//                                                 </span>
//                                             ) : (
//                                                 <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                                                     Paid • ₹{e.ticketPrice || "-"}
//                                                 </span>
//                                             )}
//                                         </td>

//                                         {/* Status */}
//                                         <td className="px-4 py-3">
//                                             <span
//                                                 className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[e.status]}`}
//                                             >
//                                                 {e.status}
//                                             </span>
//                                         </td>

//                                         {/* Created */}
//                                         <td className="px-4 py-3 text-sm text-black/60">{e.createdAt}</td>

//                                         {/* Actions */}
//                                         <td className="px-4 py-3">
//                                             <div className="flex justify-end gap-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => openEdit(e)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                                                     aria-label="Edit event"
//                                                     title="Edit"
//                                                 >
//                                                     <FiEdit2 className="text-lg" />
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => deleteEvent(e.id)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                                                     aria-label="Delete event"
//                                                     title="Delete"
//                                                 >
//                                                     <FiTrash2 className="text-lg" />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}

//                                 {filtered.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
//                                             No events found.
//                                         </td>
//                                     </tr>
//                                 ) : null}
//                             </tbody>
//                         </table>
//                     </div>
//                 </section>

//                 {/* Mobile Create Button */}
//                 <Link
//                     href="/superadmin/create-event"
//                     className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
//                 >
//                     <FiPlus className="text-base" />
//                     Create Event
//                 </Link>
//             </div>

//             {/* Edit Modal (UPDATED SPACING + STICKY HEADER/FOOTER) */}
//             {editOpen && editItem ? (
//                 <EditModal item={editItem} onChange={setEditItem} onClose={closeEdit} onUpdate={updateEvent} />
//             ) : null}
//         </main>
//     );
// }

// function EditModal({
//     item,
//     onChange,
//     onClose,
//     onUpdate,
// }: {
//     item: EventItem;
//     onChange: (next: EventItem) => void;
//     onClose: () => void;
//     onUpdate: () => void;
// }) {
//     // close on ESC
//     useEffect(() => {
//         const onEsc = (e: KeyboardEvent) => {
//             if (e.key === "Escape") onClose();
//         };
//         document.addEventListener("keydown", onEsc);
//         return () => document.removeEventListener("keydown", onEsc);
//     }, [onClose]);

//     const isPaid = item.paymentType === "paid";

//     return (
//         <div
//             className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 overflow-y-auto"
//             onMouseDown={(e) => {
//                 if (e.target === e.currentTarget) onClose();
//             }}
//         >
//             <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
//                 {/* Header (sticky) */}
//                 <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
//                     <div>
//                         <p className="text-base font-semibold">Edit Event</p>
//                         <p className="text-xs text-black/50">ID: {item.id}</p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
//                         aria-label="Close"
//                         title="Close"
//                     >
//                         <FiX className="text-lg" />
//                     </button>
//                 </div>

//                 {/* Content (scroll) */}
//                 <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//                     <div className="grid gap-4 lg:grid-cols-2">
//                         <div className="lg:col-span-2">
//                             <label className={labelCls}>Title *</label>
//                             <input
//                                 value={item.title}
//                                 onChange={(e) => onChange({ ...item, title: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div>
//                             <label className={labelCls}>Start Date *</label>
//                             <input
//                                 type="date"
//                                 value={item.startDate}
//                                 onChange={(e) => onChange({ ...item, startDate: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div>
//                             <label className={labelCls}>Time *</label>
//                             <input
//                                 type="time"
//                                 value={item.time}
//                                 onChange={(e) => onChange({ ...item, time: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div className="lg:col-span-2">
//                             <label className={labelCls}>Description *</label>
//                             <textarea
//                                 rows={4}
//                                 value={item.description}
//                                 onChange={(e) => onChange({ ...item, description: e.target.value })}
//                                 className={`${inputCls} mt-2 resize-none`}
//                             />
//                         </div>

//                         <div className="lg:col-span-2">
//                             <label className={labelCls}>Address *</label>
//                             <input
//                                 value={item.address}
//                                 onChange={(e) => onChange({ ...item, address: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div>
//                             <label className={labelCls}>State *</label>
//                             <input
//                                 value={item.state}
//                                 onChange={(e) => onChange({ ...item, state: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div>
//                             <label className={labelCls}>City *</label>
//                             <input
//                                 value={item.city}
//                                 onChange={(e) => onChange({ ...item, city: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div className="lg:col-span-2">
//                             <label className={labelCls}>Status</label>
//                             <select
//                                 value={item.status}
//                                 onChange={(e) => onChange({ ...item, status: e.target.value as ShowStatus })}
//                                 className={`${inputCls} mt-2`}
//                             >
//                                 <option value="Upcoming">Upcoming</option>
//                                 <option value="Draft">Draft</option>
//                                 <option value="Completed">Completed</option>
//                             </select>
//                         </div>

//                         {/* Payment */}
//                         <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//                             <p className="text-sm font-semibold">Payment</p>

//                             <div className="mt-3 flex flex-wrap gap-3">
//                                 <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                     <input
//                                         type="radio"
//                                         name="paymentTypeEdit"
//                                         checked={item.paymentType === "free"}
//                                         onChange={() =>
//                                             onChange({
//                                                 ...item,
//                                                 paymentType: "free",
//                                                 ticketPrice: "",
//                                                 ticketCount: "",
//                                                 paidMode: "online",
//                                                 onlineInfo: "",
//                                                 offlineInfo: "",
//                                             })
//                                         }
//                                     />
//                                     Free
//                                 </label>

//                                 <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                     <input
//                                         type="radio"
//                                         name="paymentTypeEdit"
//                                         checked={item.paymentType === "paid"}
//                                         onChange={() =>
//                                             onChange({
//                                                 ...item,
//                                                 paymentType: "paid",
//                                                 paidMode: item.paidMode || "online",
//                                             })
//                                         }
//                                     />
//                                     Paid
//                                 </label>
//                             </div>

//                             {isPaid ? (
//                                 <div className="mt-4 grid gap-4 lg:grid-cols-2">
//                                     <div>
//                                         <label className={labelCls}>Ticket Price *</label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={item.ticketPrice || ""}
//                                             onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
//                                             className={`${inputCls} mt-2`}
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Ticket Count</label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={item.ticketCount || ""}
//                                             onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
//                                             className={`${inputCls} mt-2`}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>Paid Mode</label>
//                                         <div className="mt-2 flex flex-wrap gap-3">
//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidModeEdit"
//                                                     checked={(item.paidMode || "online") === "online"}
//                                                     onChange={() => onChange({ ...item, paidMode: "online" })}
//                                                 />
//                                                 Online
//                                             </label>

//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidModeEdit"
//                                                     checked={item.paidMode === "offline"}
//                                                     onChange={() => onChange({ ...item, paidMode: "offline" })}
//                                                 />
//                                                 Offline
//                                             </label>
//                                         </div>

//                                         {(item.paidMode || "online") === "online" ? (
//                                             <div className="mt-4">
//                                                 <label className={labelCls}>Online Payment Info *</label>
//                                                 <input
//                                                     value={item.onlineInfo || ""}
//                                                     onChange={(e) => onChange({ ...item, onlineInfo: e.target.value })}
//                                                     className={`${inputCls} mt-2`}
//                                                     placeholder="UPI / link / instructions"
//                                                 />
//                                             </div>
//                                         ) : (
//                                             <div className="mt-4">
//                                                 <label className={labelCls}>Offline Payment Info *</label>
//                                                 <input
//                                                     value={item.offlineInfo || ""}
//                                                     onChange={(e) => onChange({ ...item, offlineInfo: e.target.value })}
//                                                     className={`${inputCls} mt-2`}
//                                                     placeholder="Pay at venue/counter"
//                                                 />
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ) : null}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer (sticky) */}
//                 <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         type="button"
//                         onClick={onUpdate}
//                         className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         Update Event
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { apiUrl } from "@/config";

type PaymentType = "free" | "paid";
type ShowStatus = "Upcoming" | "Draft" | "Completed";

type ApiEvent = {
    eventId: number;
    group_id: number;
    group_member_ids: null | string[];
    banner: string | null;
    title: string;
    event_date: string; // ISO
    event_time: string; // HH:mm:ss
    description: string;
    state_id: number;
    city_id: number;
    venue: string;
    created_at: string;
    updated_at: string;
    pricing_type: 1 | 2;
    ticket_count: number | null;
    price: string | null;
    ticket_info: string | null;
    status: 0 | 1; // ✅ active/inactive
    is_deleted: 0 | 1;
};

type ApiListResponse = {
    status: boolean;
    message: string;
    data: ApiEvent[];
};

type ApiShowResponse = {
    status: boolean;
    data: ApiEvent;
};

type EventItem = {
    id: string; // eventId

    title: string;
    startDate: string; // YYYY-MM-DD
    time: string; // HH:mm
    description: string;

    address: string;
    state: string; // API only gives state_id, you can map later
    city: string; // API only gives city_id, you can map later

    paymentType: PaymentType;
    ticketPrice: string;
    ticketCount: string;
    ticketInfo: string;

    // ✅ UI status (date based) + API status (active/inactive)
    status: ShowStatus;
    isActive: boolean;

    bannerUrl?: string;
    createdAt: string;
};

const badgeStyle: Record<ShowStatus, string> = {
    Upcoming: "bg-primary/10 text-primary border-primary/20",
    Draft: "bg-secondary/20 text-secondary border-secondary/30",
    Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

const toYYYYMMDD = (iso: string) => (iso ? iso.split("T")[0] : "");
const toHHMM = (t: string) => (t && t.length >= 5 ? t.slice(0, 5) : "");

const computeStatus = (eventDateISO: string): ShowStatus => {
    const d = toYYYYMMDD(eventDateISO);
    if (!d) return "Upcoming";
    const todayStr = new Date().toISOString().slice(0, 10);
    return d < todayStr ? "Completed" : "Upcoming";
};

// ✅ banner path helper (change if your backend stores elsewhere)
const buildBannerUrl = (API_URL: string, banner: string | null) => {
    if (!banner) return "";
    if (banner.startsWith("http")) return banner;
    const base = API_URL.replace(/\/api\/?$/, "");
    // default Laravel storage:
    return `${base}/storage/${banner}`;
};

export default function AdminEventsPage() {
    const API_URL = apiUrl ?? "";

    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

    // Edit modal
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<EventItem | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
    const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

    // ✅ LIST API: POST /v1/events
    useEffect(() => {
        const fetchEvents = async () => {
            if (!API_URL) {
                setError("apiUrl not configured in /config");
                return;
            }

            try {
                setLoading(true);
                setError("");

                const res = await axios.post<ApiListResponse>(`${API_URL}/v1/events`, {});
                if (!res.data?.status) {
                    setEvents([]);
                    setError(res.data?.message || "Failed to fetch events.");
                    return;
                }

                const normalized: EventItem[] = (res.data.data || [])
                    .filter((x) => Number(x.is_deleted) === 0) // optional hide deleted
                    .map((x) => {
                        const paymentType: PaymentType = x.pricing_type === 1 ? "free" : "paid";
                        return {
                            id: String(x.eventId),
                            title: x.title || "",
                            startDate: toYYYYMMDD(x.event_date),
                            time: toHHMM(x.event_time),
                            description: x.description || "",

                            address: x.venue || "",
                            // API has only IDs; show IDs as fallback (map later if you want)
                            state: `State #${x.state_id}`,
                            city: `City #${x.city_id}`,

                            paymentType,
                            ticketPrice: paymentType === "paid" ? x.price ?? "" : "",
                            ticketCount: x.ticket_count != null ? String(x.ticket_count) : "",
                            ticketInfo: x.ticket_info ?? "",

                            status: computeStatus(x.event_date),
                            isActive: Number(x.status) === 1 && Number(x.is_deleted) === 0,

                            bannerUrl: buildBannerUrl(API_URL, x.banner),
                            createdAt: x.created_at ? new Date(x.created_at).toLocaleString() : "",
                        };
                    });

                // newest first
                normalized.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
                setEvents(normalized);
            } catch (err: any) {
                console.error("Events list error:", err);
                setEvents([]);
                setError(err?.response?.data?.message || "Failed to fetch events.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [API_URL]);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return events.filter((e) => {
            const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
            const searchOk =
                !s ||
                e.title.toLowerCase().includes(s) ||
                e.city.toLowerCase().includes(s) ||
                e.id.toLowerCase().includes(s);
            return statusOk && searchOk;
        });
    }, [events, search, statusFilter]);

    // ✅ SHOW API: POST /v1/events/show/:id (use this when clicking edit)
    const openEdit = async (item: EventItem) => {
        if (!API_URL) return;

        try {
            setEditLoading(true);
            setError("");

            const res = await axios.post<ApiShowResponse>(`${API_URL}/v1/events/show/${item.id}`, {});
            if (!res.data?.status) {
                setError("Failed to fetch event details.");
                return;
            }

            const x = res.data.data;
            const paymentType: PaymentType = x.pricing_type === 1 ? "free" : "paid";

            const fullItem: EventItem = {
                id: String(x.eventId),
                title: x.title || "",
                startDate: toYYYYMMDD(x.event_date),
                time: toHHMM(x.event_time),
                description: x.description || "",

                address: x.venue || "",
                state: `State #${x.state_id}`,
                city: `City #${x.city_id}`,

                paymentType,
                ticketPrice: paymentType === "paid" ? x.price ?? "" : "",
                ticketCount: x.ticket_count != null ? String(x.ticket_count) : "",
                ticketInfo: x.ticket_info ?? "",

                status: computeStatus(x.event_date),
                isActive: Number(x.status) === 1 && Number(x.is_deleted) === 0,

                bannerUrl: buildBannerUrl(API_URL, x.banner),
                createdAt: x.created_at ? new Date(x.created_at).toLocaleString() : "",
            };

            setEditItem(fullItem);
            setEditOpen(true);
        } catch (err: any) {
            console.error("Event show error:", err);
            setError(err?.response?.data?.message || "Failed to fetch event details.");
        } finally {
            setEditLoading(false);
        }
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditItem(null);
    };

    // ✅ STATUS API: POST /v1/events/status/:id  { status: 0/1 }
    const toggleApiStatus = async (id: string, next: boolean) => {
        if (!API_URL) return;

        try {
            setStatusUpdatingId(id);
            setError("");

            const res = await axios.post(`${API_URL}/v1/events/status/${id}`, { status: next ? 1 : 0 });
            if (!res.data?.status) {
                setError(res.data?.message || "Failed to update status.");
                return;
            }

            setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isActive: next } : e)));
            // if modal open for same event, update there too
            setEditItem((prev) => (prev && prev.id === id ? { ...prev, isActive: next } : prev));
        } catch (err: any) {
            console.error("Status update error:", err);
            setError(err?.response?.data?.message || "Failed to update status.");
        } finally {
            setStatusUpdatingId(null);
        }
    };

    // ✅ DELETE API: POST /v1/events/delete/:id
    const deleteEvent = async (id: string) => {
        if (!API_URL) return;

        const ok = window.confirm("Are you sure you want to delete this event?");
        if (!ok) return;

        try {
            setDeleteLoadingId(id);
            setError("");

            const res = await axios.post(`${API_URL}/v1/events/delete/${id}`, {});
            if (!res.data?.status) {
                setError(res.data?.message || "Delete failed.");
                return;
            }

            setEvents((prev) => prev.filter((e) => e.id !== id));
            if (editItem?.id === id) closeEdit();
        } catch (err: any) {
            console.error("Delete error:", err);
            setError(err?.response?.data?.message || "Delete failed.");
        } finally {
            setDeleteLoadingId(null);
        }
    };

    // ⚠️ Update Event endpoint NOT provided in your message.
    // When you share it, I’ll wire it like we did for group-events.
    const updateEvent = () => {
        alert("Update API endpoint not provided for /v1/events. Share update URL, I will connect it.");
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
                        <p className="text-sm text-black/60">Manage events (status / view / delete).</p>
                        {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    </div>

                    <Link
                        href="/superadmin/create-event"
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        <FiPlus className="text-base" />
                        Create Event
                    </Link>
                </div>

                {/* Filters */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                        <div className="sm:col-span-8">
                            <label className={labelCls}>Search</label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title / city / id..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <label className={labelCls}>Date Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ShowStatus | "All")}
                                className={`${inputCls} mt-2`}
                            >
                                <option value="All">All</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                                {/* Draft is kept for UI compatibility */}
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* TABLE LISTING */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-245 w-full">
                            <thead className="bg-black/3">
                                <tr className="text-left text-sm font-semibold text-black">
                                    <th className="px-4 py-3">Banner</th>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Date / Time</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-10 text-center text-sm text-black/60">
                                            Loading events...
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((e) => (
                                        <tr key={e.id} className="hover:bg-black/2">
                                            {/* Banner */}
                                            <td className="px-4 py-3">
                                                <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
                                                    {e.bannerUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-black/50">No banner</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Event */}
                                            <td className="px-4 py-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
                                                    <p className="text-xs text-black/50">ID: {e.id}</p>
                                                </div>
                                            </td>

                                            {/* Date / Time */}
                                            <td className="px-4 py-3 text-sm text-black/70">
                                                <p>{e.startDate}</p>
                                                <p className="text-xs text-black/50">{e.time}</p>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-3 text-sm text-black/70">
                                                <p className="font-medium text-black">{e.city}</p>
                                                <p className="text-xs text-black/50">{e.state}</p>
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-3 text-sm">
                                                {e.paymentType === "free" ? (
                                                    <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
                                                        Free
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
                                                        Paid • ₹{e.ticketPrice || "-"}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status (date badge + API active toggle) */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[e.status]}`}
                                                    >
                                                        {e.status}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => toggleApiStatus(e.id, !e.isActive)}
                                                        disabled={statusUpdatingId === e.id}
                                                        className={[
                                                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                                                            e.isActive
                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                : "border-red-200 bg-red-50 text-red-700",
                                                            statusUpdatingId === e.id ? "opacity-60" : "hover:opacity-90",
                                                        ].join(" ")}
                                                        title="Toggle Active/Inactive (API)"
                                                    >
                                                        {statusUpdatingId === e.id ? "Updating..." : e.isActive ? "Active" : "Inactive"}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Created */}
                                            <td className="px-4 py-3 text-sm text-black/60">{e.createdAt}</td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(e)}
                                                        disabled={editLoading}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5 disabled:opacity-60"
                                                        aria-label="Edit event"
                                                        title="Edit (fetch by show API)"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => deleteEvent(e.id)}
                                                        disabled={deleteLoadingId === e.id}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                        aria-label="Delete event"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}

                                {!loading && filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-10 text-center text-sm text-black/60">
                                            No events found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Mobile Create Button */}
                <Link
                    href="/superadmin/create-event"
                    className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                    <FiPlus className="text-base" />
                    Create Event
                </Link>
            </div>

            {/* Edit Modal */}
            {editOpen && editItem ? (
                <EditModal
                    item={editItem}
                    onChange={setEditItem}
                    onClose={closeEdit}
                    onUpdate={updateEvent}
                    onToggleActive={(next) => toggleApiStatus(editItem.id, next)}
                    toggling={statusUpdatingId === editItem.id}
                />
            ) : null}
        </main>
    );
}

function EditModal({
    item,
    onChange,
    onClose,
    onUpdate,
    onToggleActive,
    toggling,
}: {
    item: EventItem;
    onChange: (next: EventItem) => void;
    onClose: () => void;
    onUpdate: () => void;
    onToggleActive: (next: boolean) => void;
    toggling: boolean;
}) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    const isPaid = item.paymentType === "paid";

    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 overflow-y-auto"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
                    <div>
                        <p className="text-base font-semibold">Event Details</p>
                        <p className="text-xs text-black/50">ID: {item.id}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
                        aria-label="Close"
                        title="Close"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="lg:col-span-2 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-black">API Status</p>
                                <p className="text-xs text-black/50">This uses: /v1/events/status/:id</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggleActive(!item.isActive)}
                                disabled={toggling}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-semibold border",
                                    item.isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-red-200 bg-red-50 text-red-700",
                                    toggling ? "opacity-60" : "hover:opacity-90",
                                ].join(" ")}
                            >
                                {toggling ? "Updating..." : item.isActive ? "Active" : "Inactive"}
                            </button>
                        </div>

                        <div className="lg:col-span-2">
                            <label className={labelCls}>Title</label>
                            <input
                                value={item.title}
                                onChange={(e) => onChange({ ...item, title: e.target.value })}
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div>
                            <label className={labelCls}>Start Date</label>
                            <input
                                type="date"
                                value={item.startDate}
                                onChange={(e) => onChange({ ...item, startDate: e.target.value })}
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div>
                            <label className={labelCls}>Time</label>
                            <input
                                type="time"
                                value={item.time}
                                onChange={(e) => onChange({ ...item, time: e.target.value })}
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className={labelCls}>Description</label>
                            <textarea
                                rows={4}
                                value={item.description}
                                onChange={(e) => onChange({ ...item, description: e.target.value })}
                                className={`${inputCls} mt-2 resize-none`}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className={labelCls}>Venue / Address</label>
                            <input
                                value={item.address}
                                onChange={(e) => onChange({ ...item, address: e.target.value })}
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        {/* Payment */}
                        <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
                            <p className="text-sm font-semibold">Pricing</p>

                            <div className="mt-3 flex flex-wrap gap-3">
                                <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                    <input
                                        type="radio"
                                        name="paymentTypeEdit"
                                        checked={item.paymentType === "free"}
                                        onChange={() =>
                                            onChange({
                                                ...item,
                                                paymentType: "free",
                                                ticketPrice: "",
                                                ticketCount: "",
                                                ticketInfo: "",
                                            })
                                        }
                                    />
                                    Free
                                </label>

                                <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                    <input
                                        type="radio"
                                        name="paymentTypeEdit"
                                        checked={item.paymentType === "paid"}
                                        onChange={() => onChange({ ...item, paymentType: "paid" })}
                                    />
                                    Paid
                                </label>
                            </div>

                            {isPaid ? (
                                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div>
                                        <label className={labelCls}>Ticket Price</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={item.ticketPrice}
                                            onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
                                            className={`${inputCls} mt-2`}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Ticket Count</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={item.ticketCount}
                                            onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
                                            className={`${inputCls} mt-2`}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className={labelCls}>Ticket Info</label>
                                        <input
                                            value={item.ticketInfo}
                                            onChange={(e) => onChange({ ...item, ticketInfo: e.target.value })}
                                            className={`${inputCls} mt-2`}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={onUpdate}
                        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                    >
                        Update Event
                    </button>
                </div>
            </div>
        </div>
    );
}
