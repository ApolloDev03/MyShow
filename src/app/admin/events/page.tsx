// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";
// type ShowStatus = "Upcoming" | "Draft" | "Completed";

// type EventItem = {
//   id: string;
//   title: string;
//   startDate: string; // YYYY-MM-DD
//   time: string; // HH:mm
//   description: string;

//   address: string;
//   state: string;
//   city: string;

//   paymentType: PaymentType;
//   ticketPrice?: string;
//   ticketCount?: string;
//   paidMode?: PaidMode;
//   onlineInfo?: string;
//   offlineInfo?: string;

//   status: ShowStatus;

//   bannerUrl?: string; // dummy preview
//   galleryCount?: number;
//   createdAt: string;
// };

// const badgeStyle: Record<ShowStatus, string> = {
//   Upcoming: "bg-primary/10 text-primary border-primary/20",
//   Draft: "bg-secondary/20 text-secondary border-secondary/30",
//   Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
// };

// const inputCls =
//   "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// export default function AdminEventsPage() {
//   const [events, setEvents] = useState<EventItem[]>([
//     {
//       id: "EV-1001",
//       title: "New Year Musical Night",
//       startDate: "2026-01-15",
//       time: "19:00",
//       description: "Live music + DJ night. Family friendly show.",
//       address: "City Hall Road, Near Central Park",
//       state: "Gujarat",
//       city: "Ahmedabad",
//       paymentType: "paid",
//       ticketPrice: "299",
//       ticketCount: "150",
//       paidMode: "online",
//       onlineInfo: "UPI: myshow@upi",
//       status: "Upcoming",
//       bannerUrl: "",
//       galleryCount: 5,
//       createdAt: "2 hours ago",
//     },
//     {
//       id: "EV-1002",
//       title: "Standup Comedy Live",
//       startDate: "2026-01-18",
//       time: "20:30",
//       description: "Top comedians performing live.",
//       address: "Apollo Arena, Ring Road",
//       state: "Gujarat",
//       city: "Surat",
//       paymentType: "free",
//       status: "Upcoming",
//       bannerUrl: "",
//       galleryCount: 3,
//       createdAt: "Yesterday",
//     },
//     {
//       id: "EV-1003",
//       title: "Kids Dance Fest",
//       startDate: "2026-01-22",
//       time: "18:00",
//       description: "School dance competition + prizes.",
//       address: "Community Center, Main Street",
//       state: "Gujarat",
//       city: "Vadodara",
//       paymentType: "paid",
//       ticketPrice: "99",
//       ticketCount: "300",
//       paidMode: "offline",
//       offlineInfo: "Pay at venue counter",
//       status: "Draft",
//       bannerUrl: "",
//       galleryCount: 0,
//       createdAt: "2 days ago",
//     },
//     {
//       id: "EV-1004",
//       title: "Drama Night: The Stage",
//       startDate: "2026-01-28",
//       time: "19:30",
//       description: "Stage drama night with special guests.",
//       address: "Town Theatre, Old City",
//       state: "Gujarat",
//       city: "Rajkot",
//       paymentType: "paid",
//       ticketPrice: "199",
//       ticketCount: "120",
//       paidMode: "online",
//       onlineInfo: "Payment link: https://example.com",
//       status: "Completed",
//       bannerUrl: "",
//       galleryCount: 8,
//       createdAt: "4 days ago",
//     },
//   ]);

//   // Filters
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

//   // Edit modal
//   const [editOpen, setEditOpen] = useState(false);
//   const [editItem, setEditItem] = useState<EventItem | null>(null);

//   const filtered = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return events.filter((e) => {
//       const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
//       const searchOk =
//         !s ||
//         e.title.toLowerCase().includes(s) ||
//         e.city.toLowerCase().includes(s) ||
//         e.id.toLowerCase().includes(s);
//       return statusOk && searchOk;
//     });
//   }, [events, search, statusFilter]);

//   const openEdit = (item: EventItem) => {
//     setEditItem({ ...item });
//     setEditOpen(true);
//   };

//   const closeEdit = () => {
//     setEditOpen(false);
//     setEditItem(null);
//   };

//   const updateEvent = () => {
//     if (!editItem) return;

//     if (!editItem.title || !editItem.startDate || !editItem.time || !editItem.description) {
//       alert("Please fill Title, Date, Time and Description");
//       return;
//     }
//     if (!editItem.address || !editItem.state || !editItem.city) {
//       alert("Please fill Address, State and City");
//       return;
//     }
//     if (editItem.paymentType === "paid") {
//       if (!editItem.ticketPrice) return alert("Please enter Ticket Price");
//       if ((editItem.paidMode || "online") === "online" && !editItem.onlineInfo)
//         return alert("Please enter Online Payment Info");
//       if (editItem.paidMode === "offline" && !editItem.offlineInfo)
//         return alert("Please enter Offline Payment Info");
//     }

//     setEvents((prev) => prev.map((x) => (x.id === editItem.id ? editItem : x)));
//     closeEdit();
//   };

//   const deleteEvent = (id: string) => {
//     const ok = window.confirm("Are you sure you want to delete this event?");
//     if (!ok) return;
//     setEvents((prev) => prev.filter((e) => e.id !== id));
//   };

//   return (
//     <main className="min-h-screen bg-[#f6f7fb] text-black">
//       <div className="mx-auto w-full max-w-7xl px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex flex-col gap-1">
//             <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
//             <p className="text-sm text-black/60">Manage your events (edit / delete).</p>
//           </div>

//           <Link
//             href="/admin/create-event"
//             className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//           >
//             <FiPlus className="text-base" />
//             Create Event
//           </Link>
//         </div>

//         {/* Filters */}
//         <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//           <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//             <div className="sm:col-span-8">
//               <label className={labelCls}>Search</label>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by title / city / id..."
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div className="sm:col-span-4">
//               <label className={labelCls}>Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as ShowStatus | "All")}
//                 className={`${inputCls} mt-2`}
//               >
//                 <option value="All">All</option>
//                 <option value="Upcoming">Upcoming</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* TABLE LISTING */}
//         <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-245 w-full">
//               <thead className="bg-black/3">
//                 <tr className="text-left text-sm font-semibold text-black">
//                   <th className="px-4 py-3">Banner</th>
//                   <th className="px-4 py-3">Event</th>
//                   <th className="px-4 py-3">Date / Time</th>
//                   <th className="px-4 py-3">Location</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Created</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-black/10">
//                 {filtered.map((e) => (
//                   <tr key={e.id} className="hover:bg-black/2">
//                     {/* Banner */}
//                     <td className="px-4 py-3">
//                       <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
//                         {e.bannerUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
//                         ) : (
//                           <span className="text-xs text-black/50">No banner</span>
//                         )}
//                       </div>
//                     </td>

//                     {/* Event */}
//                     <td className="px-4 py-3">
//                       <div className="min-w-0">
//                         <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
//                         <p className="text-xs text-black/50">
//                           ID: {e.id} • Gallery: {e.galleryCount ?? 0}
//                         </p>
//                       </div>
//                     </td>

//                     {/* Date / Time */}
//                     <td className="px-4 py-3 text-sm text-black/70">
//                       <p>{e.startDate}</p>
//                       <p className="text-xs text-black/50">{e.time}</p>
//                     </td>

//                     {/* Location */}
//                     <td className="px-4 py-3 text-sm text-black/70">
//                       <p className="font-medium text-black">{e.city}</p>
//                       <p className="text-xs text-black/50">{e.state}</p>
//                     </td>

//                     {/* Type */}
//                     <td className="px-4 py-3 text-sm">
//                       {e.paymentType === "free" ? (
//                         <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                           Free
//                         </span>
//                       ) : (
//                         <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                           Paid • ₹{e.ticketPrice || "-"}
//                         </span>
//                       )}
//                     </td>

//                     {/* Status */}
//                     <td className="px-4 py-3">
//                       <span
//                         className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[e.status]}`}
//                       >
//                         {e.status}
//                       </span>
//                     </td>

//                     {/* Created */}
//                     <td className="px-4 py-3 text-sm text-black/60">{e.createdAt}</td>

//                     {/* Actions */}
//                     <td className="px-4 py-3">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(e)}
//                           className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                           aria-label="Edit event"
//                           title="Edit"
//                         >
//                           <FiEdit2 className="text-lg" />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => deleteEvent(e.id)}
//                           className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                           aria-label="Delete event"
//                           title="Delete"
//                         >
//                           <FiTrash2 className="text-lg" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
//                       No events found.
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Mobile Create Button */}
//         <Link
//           href="/admin/create-event"
//           className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
//         >
//           <FiPlus className="text-base" />
//           Create Event
//         </Link>
//       </div>

//       {/* Edit Modal (UPDATED SPACING + STICKY HEADER/FOOTER) */}
//       {editOpen && editItem ? (
//         <EditModal item={editItem} onChange={setEditItem} onClose={closeEdit} onUpdate={updateEvent} />
//       ) : null}
//     </main>
//   );
// }

// function EditModal({
//   item,
//   onChange,
//   onClose,
//   onUpdate,
// }: {
//   item: EventItem;
//   onChange: (next: EventItem) => void;
//   onClose: () => void;
//   onUpdate: () => void;
// }) {
//   // close on ESC
//   useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", onEsc);
//     return () => document.removeEventListener("keydown", onEsc);
//   }, [onClose]);

//   const isPaid = item.paymentType === "paid";

//   return (
//     <div
//       className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 overflow-y-auto"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
//         {/* Header (sticky) */}
//         <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
//           <div>
//             <p className="text-base font-semibold">Edit Event</p>
//             <p className="text-xs text-black/50">ID: {item.id}</p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
//             aria-label="Close"
//             title="Close"
//           >
//             <FiX className="text-lg" />
//           </button>
//         </div>

//         {/* Content (scroll) */}
//         <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//           <div className="grid gap-4 lg:grid-cols-2">
//             <div className="lg:col-span-2">
//               <label className={labelCls}>Title *</label>
//               <input
//                 value={item.title}
//                 onChange={(e) => onChange({ ...item, title: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Start Date *</label>
//               <input
//                 type="date"
//                 value={item.startDate}
//                 onChange={(e) => onChange({ ...item, startDate: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Time *</label>
//               <input
//                 type="time"
//                 value={item.time}
//                 onChange={(e) => onChange({ ...item, time: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div className="lg:col-span-2">
//               <label className={labelCls}>Description *</label>
//               <textarea
//                 rows={4}
//                 value={item.description}
//                 onChange={(e) => onChange({ ...item, description: e.target.value })}
//                 className={`${inputCls} mt-2 resize-none`}
//               />
//             </div>

//             <div className="lg:col-span-2">
//               <label className={labelCls}>Address *</label>
//               <input
//                 value={item.address}
//                 onChange={(e) => onChange({ ...item, address: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>State *</label>
//               <input
//                 value={item.state}
//                 onChange={(e) => onChange({ ...item, state: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>City *</label>
//               <input
//                 value={item.city}
//                 onChange={(e) => onChange({ ...item, city: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div className="lg:col-span-2">
//               <label className={labelCls}>Status</label>
//               <select
//                 value={item.status}
//                 onChange={(e) => onChange({ ...item, status: e.target.value as ShowStatus })}
//                 className={`${inputCls} mt-2`}
//               >
//                 <option value="Upcoming">Upcoming</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             {/* Payment */}
//             <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//               <p className="text-sm font-semibold">Payment</p>

//               <div className="mt-3 flex flex-wrap gap-3">
//                 <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                   <input
//                     type="radio"
//                     name="paymentTypeEdit"
//                     checked={item.paymentType === "free"}
//                     onChange={() =>
//                       onChange({
//                         ...item,
//                         paymentType: "free",
//                         ticketPrice: "",
//                         ticketCount: "",
//                         paidMode: "online",
//                         onlineInfo: "",
//                         offlineInfo: "",
//                       })
//                     }
//                   />
//                   Free
//                 </label>

//                 <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                   <input
//                     type="radio"
//                     name="paymentTypeEdit"
//                     checked={item.paymentType === "paid"}
//                     onChange={() =>
//                       onChange({
//                         ...item,
//                         paymentType: "paid",
//                         paidMode: item.paidMode || "online",
//                       })
//                     }
//                   />
//                   Paid
//                 </label>
//               </div>

//               {isPaid ? (
//                 <div className="mt-4 grid gap-4 lg:grid-cols-2">
//                   <div>
//                     <label className={labelCls}>Ticket Price *</label>
//                     <input
//                       type="number"
//                       min={0}
//                       value={item.ticketPrice || ""}
//                       onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
//                       className={`${inputCls} mt-2`}
//                     />
//                   </div>

//                   <div>
//                     <label className={labelCls}>Ticket Count</label>
//                     <input
//                       type="number"
//                       min={0}
//                       value={item.ticketCount || ""}
//                       onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
//                       className={`${inputCls} mt-2`}
//                     />
//                   </div>

//                   <div className="lg:col-span-2">
//                     <label className={labelCls}>Paid Mode</label>
//                     <div className="mt-2 flex flex-wrap gap-3">
//                       <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                         <input
//                           type="radio"
//                           name="paidModeEdit"
//                           checked={(item.paidMode || "online") === "online"}
//                           onChange={() => onChange({ ...item, paidMode: "online" })}
//                         />
//                         Online
//                       </label>

//                       <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                         <input
//                           type="radio"
//                           name="paidModeEdit"
//                           checked={item.paidMode === "offline"}
//                           onChange={() => onChange({ ...item, paidMode: "offline" })}
//                         />
//                         Offline
//                       </label>
//                     </div>

//                     {(item.paidMode || "online") === "online" ? (
//                       <div className="mt-4">
//                         <label className={labelCls}>Online Payment Info *</label>
//                         <input
//                           value={item.onlineInfo || ""}
//                           onChange={(e) => onChange({ ...item, onlineInfo: e.target.value })}
//                           className={`${inputCls} mt-2`}
//                           placeholder="UPI / link / instructions"
//                         />
//                       </div>
//                     ) : (
//                       <div className="mt-4">
//                         <label className={labelCls}>Offline Payment Info *</label>
//                         <input
//                           value={item.offlineInfo || ""}
//                           onChange={(e) => onChange({ ...item, offlineInfo: e.target.value })}
//                           className={`${inputCls} mt-2`}
//                           placeholder="Pay at venue/counter"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>

//         {/* Footer (sticky) */}
//         <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={onUpdate}
//             className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//           >
//             Update Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import axios, { AxiosError } from "axios";
// import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
// import { apiUrl } from "@/config";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";
// type ShowStatus = "Upcoming" | "Draft" | "Completed";

// type ApiResponse = {
//   status?: boolean | number | string;
//   success?: boolean | number | string;
//   message?: string;
//   msg?: string;
//   error?: string;
//   errors?: Record<string, string[] | string>;
// };

// type ApiEvent = {
//   eventId: number;
//   group_id: number;
//   group_member_ids: string[] | null;
//   banner: string | null;
//   title: string;
//   event_date: string; // ISO
//   event_time: string; // "HH:mm:ss" or "HH:mm"
//   description: string | null;
//   state_id: number | null;
//   city_id: number | null;
//   venue: string | null;
//   created_at: string;
//   updated_at: string;
//   pricing_type: number; // 1 free, 2 paid (based on examples)
//   ticket_count: number | null;
//   price: string | null;
//   ticket_info: string | null;
// };

// type EventsListResponse = ApiResponse & {
//   data?: ApiEvent[];
// };

// type EventEditResponse = ApiResponse & {
//   data?: {
//     event?: ApiEvent;
//     photos?: { id: number; photo: string }[];
//   };
// };

// type EventUpdateResponse = ApiResponse & {
//   data?: ApiEvent;
// };

// type EventItem = {
//   id: string; // eventId as string
//   title: string;
//   startDate: string; // YYYY-MM-DD
//   time: string; // HH:mm
//   description: string;

//   venue: string;
//   stateId: string; // keep string for inputs, send number
//   cityId: string;

//   paymentType: PaymentType;
//   ticketPrice?: string;
//   ticketCount?: string;
//   paidMode?: PaidMode;
//   onlineInfo?: string;
//   offlineInfo?: string;

//   status: ShowStatus;

//   bannerUrl?: string;
//   galleryCount?: number;
//   createdAt: string; // simple date/time string
// };

// const badgeStyle: Record<ShowStatus, string> = {
//   Upcoming: "bg-primary/10 text-primary border-primary/20",
//   Draft: "bg-secondary/20 text-secondary border-secondary/30",
//   Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
// };

// const inputCls =
//   "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// const api = axios.create({
//   baseURL: apiUrl,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// function pickMessage(data?: ApiResponse) {
//   if (!data) return "";
//   return (
//     data.message ||
//     data.msg ||
//     data.error ||
//     (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
//     ""
//   );
// }
// function isSuccess(data?: ApiResponse) {
//   const s = data?.status ?? data?.success;
//   return s === true || s === 1 || s === "1" || s === "true" || s === "success";
// }
// function getApiErrorMessage(err: unknown) {
//   const e = err as AxiosError<ApiResponse>;
//   return pickMessage(e.response?.data) || e.message || "Network error. Please try again.";
// }
// function getToken() {
//   if (typeof window === "undefined") return "";
//   return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
// }
// function siteBaseFromApiUrl(u: string) {
//   // if apiUrl = https://getdemo.in/My_show/api
//   // site base => https://getdemo.in/My_show
//   return u.replace(/\/api\/?$/i, "");
// }
// function toYYYYMMDD(iso: string) {
//   return (iso || "").split("T")[0] || "";
// }
// function toHHmm(t: string) {
//   if (!t) return "";
//   return t.length >= 5 ? t.slice(0, 5) : t; // "19:30:00" -> "19:30"
// }
// function calcStatus(dateStr: string): ShowStatus {
//   // simple: Upcoming if >= today else Completed
//   const today = new Date();
//   const todayYMD = today.toISOString().slice(0, 10);
//   if (!dateStr) return "Draft";
//   return dateStr >= todayYMD ? "Upcoming" : "Completed";
// }

// function mapApiEventToItem(ev: ApiEvent): EventItem {
//   const base = siteBaseFromApiUrl(apiUrl);
//   const bannerUrl = ev.banner
//     ? ev.banner.startsWith("http")
//       ? ev.banner
//       : `${base}/${ev.banner}`
//     : "";

//   const startDate = toYYYYMMDD(ev.event_date);
//   const time = toHHmm(ev.event_time);

//   const paymentType: PaymentType = ev.pricing_type === 2 ? "paid" : "free";

//   return {
//     id: String(ev.eventId),
//     title: ev.title || "",
//     startDate,
//     time,
//     description: ev.description || "",
//     venue: ev.venue || "",
//     stateId: ev.state_id != null ? String(ev.state_id) : "",
//     cityId: ev.city_id != null ? String(ev.city_id) : "",
//     paymentType,
//     ticketPrice: ev.price ?? "",
//     ticketCount: ev.ticket_count != null ? String(ev.ticket_count) : "",
//     paidMode: paymentType === "paid" ? "online" : undefined,
//     onlineInfo: ev.ticket_info ?? "",
//     offlineInfo: "",
//     status: calcStatus(startDate),
//     bannerUrl,
//     galleryCount: 0,
//     createdAt: (ev.created_at || "").replace("T", " ").replace(".000000Z", ""),
//   };
// }

// export default function AdminEventsPage() {
//   const [events, setEvents] = useState<EventItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pageErr, setPageErr] = useState("");

//   // Filters
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

//   // Edit modal
//   const [editOpen, setEditOpen] = useState(false);
//   const [editItem, setEditItem] = useState<EventItem | null>(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editErr, setEditErr] = useState("");

//   const filtered = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return events.filter((e) => {
//       const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
//       const searchOk =
//         !s ||
//         e.title.toLowerCase().includes(s) ||
//         e.cityId.toLowerCase().includes(s) ||
//         e.id.toLowerCase().includes(s);
//       return statusOk && searchOk;
//     });
//   }, [events, search, statusFilter]);

//   // ✅ Fetch events list
//   useEffect(() => {
//     const run = async () => {
//       setPageErr("");
//       const token = getToken();
//       if (!token) return; // your guard can redirect, or you can push login here

//       setLoading(true);
//       try {
//         const res = await api.post<EventsListResponse>("/admin/group-events/events", {
//           validateStatus: () => true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = res.data;
//         const msg = pickMessage(data);

//         if (res.status >= 200 && res.status < 300 && isSuccess(data) && Array.isArray(data?.data)) {
//           setEvents(data.data.map(mapApiEventToItem));
//           return;
//         }

//         setPageErr(msg || `Failed to fetch events (${res.status}).`);
//       } catch (err) {
//         setPageErr(getApiErrorMessage(err));
//       } finally {
//         setLoading(false);
//       }
//     };

//     run();
//   }, []);

//   // ✅ Open edit: fetch edit API (event + photos)
//   const openEdit = async (item: EventItem) => {
//     setEditErr("");
//     setEditLoading(true);
//     setEditOpen(true);
//     setEditItem({ ...item });

//     const token = getToken();
//     if (!token) {
//       setEditErr("Token not found. Please login again.");
//       setEditLoading(false);
//       return;
//     }

//     try {
//       const res = await api.post<EventEditResponse>(
//         `/admin/group-events/event/edit/${item.id}`,
//         {}, // request body empty (token via header)
//         {
//           validateStatus: () => true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             token,
//           },
//         }
//       );

//       const data = res.data;
//       const msg = pickMessage(data);

//       if (res.status >= 200 && res.status < 300 && isSuccess(data) && data?.data?.event) {
//         const mapped = mapApiEventToItem(data.data.event);
//         mapped.galleryCount = data.data.photos?.length ?? 0;
//         setEditItem(mapped);
//         return;
//       }

//       setEditErr(msg || `Failed to load event (${res.status}).`);
//     } catch (err) {
//       setEditErr(getApiErrorMessage(err));
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const closeEdit = () => {
//     setEditOpen(false);
//     setEditItem(null);
//     setEditErr("");
//     setEditLoading(false);
//   };

//   // ✅ Update event API
//   const updateEvent = async () => {
//     if (!editItem) return;

//     setEditErr("");

//     if (!editItem.title || !editItem.startDate || !editItem.time) {
//       setEditErr("Please fill Title, Date and Time");
//       return;
//     }
//     if (!editItem.venue) {
//       setEditErr("Please fill Venue");
//       return;
//     }
//     if (!editItem.stateId || !editItem.cityId) {
//       setEditErr("Please fill State ID and City ID");
//       return;
//     }
//     if (editItem.paymentType === "paid") {
//       if (!editItem.ticketPrice) return setEditErr("Please enter Ticket Price");
//       // optional: ticketCount / info
//     }

//     const token = getToken();
//     if (!token) {
//       setEditErr("Token not found. Please login again.");
//       return;
//     }

//     setEditLoading(true);
//     try {
//       const payload: any = {
//         title: editItem.title,
//         event_date: editItem.startDate, // "YYYY-MM-DD"
//         event_time: editItem.time, // "HH:mm"
//         state_id: Number(editItem.stateId),
//         city_id: Number(editItem.cityId),
//         venue: editItem.venue,
//         pricing_type: editItem.paymentType === "paid" ? 2 : 1,
//       };

//       // if paid include these (common)
//       if (editItem.paymentType === "paid") {
//         payload.ticket_count = editItem.ticketCount ? Number(editItem.ticketCount) : null;
//         payload.price = editItem.ticketPrice || null;
//         payload.ticket_info = editItem.onlineInfo || editItem.offlineInfo || null;
//       }

//       const res = await api.post<EventUpdateResponse>(
//         `/admin/group-events/event/update/${editItem.id}`,
//         payload,
//         {
//           validateStatus: () => true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             token,
//           },
//         }
//       );

//       const data = res.data;
//       const msg = pickMessage(data);

//       if (res.status >= 200 && res.status < 300 && isSuccess(data) && data?.data) {
//         const updatedItem = mapApiEventToItem(data.data);
//         updatedItem.galleryCount = editItem.galleryCount ?? 0; // keep old count (edit api provides)
//         setEvents((prev) => prev.map((x) => (x.id === editItem.id ? updatedItem : x)));
//         closeEdit();
//         return;
//       }

//       setEditErr(msg || `Update failed (${res.status}).`);
//     } catch (err) {
//       setEditErr(getApiErrorMessage(err));
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // ✅ Delete event API
//   const deleteEvent = async (id: string) => {
//     const ok = window.confirm("Are you sure you want to delete this event?");
//     if (!ok) return;

//     const token = getToken();
//     if (!token) return alert("Token not found. Please login again.");

//     try {
//       const res = await api.post<ApiResponse>(
//         `/admin/group-events/event/delete/${id}`,
//         {},
//         {
//           validateStatus: () => true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             token,
//           },
//         }
//       );

//       const data = res.data;
//       const msg = pickMessage(data);

//       if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
//         setEvents((prev) => prev.filter((e) => e.id !== id));
//         return;
//       }

//       alert(msg || `Delete failed (${res.status}).`);
//     } catch (err) {
//       alert(getApiErrorMessage(err));
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#f6f7fb] text-black">
//       <div className="mx-auto w-full max-w-7xl px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex flex-col gap-1">
//             <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
//             <p className="text-sm text-black/60">Manage your events (edit / delete).</p>
//           </div>

//           <Link
//             href="/admin/create-event"
//             className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//           >
//             <FiPlus className="text-base" />
//             Create Event
//           </Link>
//         </div>

//         {/* Top messages */}
//         {loading ? <p className="mt-4 text-sm text-black/60">Loading events...</p> : null}
//         {pageErr ? <p className="mt-4 text-sm text-red-600">{pageErr}</p> : null}

//         {/* Filters */}
//         <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//           <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//             <div className="sm:col-span-8">
//               <label className={labelCls}>Search</label>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by title / city id / event id..."
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div className="sm:col-span-4">
//               <label className={labelCls}>Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as ShowStatus | "All")}
//                 className={`${inputCls} mt-2`}
//               >
//                 <option value="All">All</option>
//                 <option value="Upcoming">Upcoming</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* TABLE LISTING */}
//         <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-245 w-full">
//               <thead className="bg-black/3">
//                 <tr className="text-left text-sm font-semibold text-black">
//                   <th className="px-4 py-3">Banner</th>
//                   <th className="px-4 py-3">Event</th>
//                   <th className="px-4 py-3">Date / Time</th>
//                   <th className="px-4 py-3">Location</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Created</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-black/10">
//                 {filtered.map((e) => (
//                   <tr key={e.id} className="hover:bg-black/2">
//                     {/* Banner */}
//                     <td className="px-4 py-3">
//                       <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
//                         {e.bannerUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
//                         ) : (
//                           <span className="text-xs text-black/50">No banner</span>
//                         )}
//                       </div>
//                     </td>

//                     {/* Event */}
//                     <td className="px-4 py-3">
//                       <div className="min-w-0">
//                         <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
//                         <p className="text-xs text-black/50">
//                           ID: {e.id} • Gallery: {e.galleryCount ?? 0}
//                         </p>
//                       </div>
//                     </td>

//                     {/* Date / Time */}
//                     <td className="px-4 py-3 text-sm text-black/70">
//                       <p>{e.startDate}</p>
//                       <p className="text-xs text-black/50">{e.time}</p>
//                     </td>

//                     {/* Location */}
//                     <td className="px-4 py-3 text-sm text-black/70">
//                       <p className="font-medium text-black">City ID: {e.cityId || "-"}</p>
//                       <p className="text-xs text-black/50">State ID: {e.stateId || "-"}</p>
//                     </td>

//                     {/* Type */}
//                     <td className="px-4 py-3 text-sm">
//                       {e.paymentType === "free" ? (
//                         <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                           Free
//                         </span>
//                       ) : (
//                         <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                           Paid • ₹{e.ticketPrice || "-"}
//                         </span>
//                       )}
//                     </td>

//                     {/* Status */}
//                     <td className="px-4 py-3">
//                       <span
//                         className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[e.status]}`}
//                       >
//                         {e.status}
//                       </span>
//                     </td>

//                     {/* Created */}
//                     <td className="px-4 py-3 text-sm text-black/60">{e.createdAt}</td>

//                     {/* Actions */}
//                     <td className="px-4 py-3">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(e)}
//                           className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                           aria-label="Edit event"
//                           title="Edit"
//                         >
//                           <FiEdit2 className="text-lg" />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => deleteEvent(e.id)}
//                           className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                           aria-label="Delete event"
//                           title="Delete"
//                         >
//                           <FiTrash2 className="text-lg" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
//                       No events found.
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Mobile Create Button */}
//         <Link
//           href="/admin/create-event"
//           className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
//         >
//           <FiPlus className="text-base" />
//           Create Event
//         </Link>
//       </div>

//       {/* Edit Modal */}
//       {editOpen && editItem ? (
//         <EditModal
//           item={editItem}
//           onChange={setEditItem}
//           onClose={closeEdit}
//           onUpdate={updateEvent}
//           loading={editLoading}
//           error={editErr}
//         />
//       ) : null}
//     </main>
//   );
// }

// function EditModal({
//   item,
//   onChange,
//   onClose,
//   onUpdate,
//   loading,
//   error,
// }: {
//   item: EventItem;
//   onChange: (next: EventItem) => void;
//   onClose: () => void;
//   onUpdate: () => void;
//   loading: boolean;
//   error: string;
// }) {
//   useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", onEsc);
//     return () => document.removeEventListener("keydown", onEsc);
//   }, [onClose]);

//   const isPaid = item.paymentType === "paid";

//   return (
//     <div
//       className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 overflow-y-auto"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
//         {/* Header */}
//         <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
//           <div>
//             <p className="text-base font-semibold">Edit Event</p>
//             <p className="text-xs text-black/50">ID: {item.id}</p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
//             aria-label="Close"
//             title="Close"
//           >
//             <FiX className="text-lg" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//           {loading ? <p className="text-sm text-black/60">Loading event...</p> : null}
//           {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

//           <div className="mt-4 grid gap-4 lg:grid-cols-2">
//             <div className="lg:col-span-2">
//               <label className={labelCls}>Title *</label>
//               <input
//                 value={item.title}
//                 onChange={(e) => onChange({ ...item, title: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Start Date *</label>
//               <input
//                 type="date"
//                 value={item.startDate}
//                 onChange={(e) => onChange({ ...item, startDate: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Time *</label>
//               <input
//                 type="time"
//                 value={item.time}
//                 onChange={(e) => onChange({ ...item, time: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div className="lg:col-span-2">
//               <label className={labelCls}>Description</label>
//               <textarea
//                 rows={4}
//                 value={item.description}
//                 onChange={(e) => onChange({ ...item, description: e.target.value })}
//                 className={`${inputCls} mt-2 resize-none`}
//               />
//             </div>

//             <div className="lg:col-span-2">
//               <label className={labelCls}>Venue *</label>
//               <input
//                 value={item.venue}
//                 onChange={(e) => onChange({ ...item, venue: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>State ID *</label>
//               <input
//                 type="number"
//                 value={item.stateId}
//                 onChange={(e) => onChange({ ...item, stateId: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             <div>
//               <label className={labelCls}>City ID *</label>
//               <input
//                 type="number"
//                 value={item.cityId}
//                 onChange={(e) => onChange({ ...item, cityId: e.target.value })}
//                 className={`${inputCls} mt-2`}
//               />
//             </div>

//             {/* Payment */}
//             <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//               <p className="text-sm font-semibold">Pricing Type</p>

//               <div className="mt-3 flex flex-wrap gap-3">
//                 <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                   <input
//                     type="radio"
//                     name="paymentTypeEdit"
//                     checked={item.paymentType === "free"}
//                     onChange={() =>
//                       onChange({
//                         ...item,
//                         paymentType: "free",
//                         ticketPrice: "",
//                         ticketCount: "",
//                         onlineInfo: "",
//                         offlineInfo: "",
//                       })
//                     }
//                   />
//                   Free
//                 </label>

//                 <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                   <input
//                     type="radio"
//                     name="paymentTypeEdit"
//                     checked={item.paymentType === "paid"}
//                     onChange={() =>
//                       onChange({
//                         ...item,
//                         paymentType: "paid",
//                       })
//                     }
//                   />
//                   Paid
//                 </label>
//               </div>

//               {isPaid ? (
//                 <div className="mt-4 grid gap-4 lg:grid-cols-2">
//                   <div>
//                     <label className={labelCls}>Ticket Price</label>
//                     <input
//                       type="number"
//                       min={0}
//                       value={item.ticketPrice || ""}
//                       onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
//                       className={`${inputCls} mt-2`}
//                     />
//                   </div>

//                   <div>
//                     <label className={labelCls}>Ticket Count</label>
//                     <input
//                       type="number"
//                       min={0}
//                       value={item.ticketCount || ""}
//                       onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
//                       className={`${inputCls} mt-2`}
//                     />
//                   </div>

//                   <div className="lg:col-span-2">
//                     <label className={labelCls}>Ticket Info</label>
//                     <input
//                       value={item.onlineInfo || ""}
//                       onChange={(e) => onChange({ ...item, onlineInfo: e.target.value })}
//                       className={`${inputCls} mt-2`}
//                       placeholder="Info / notes"
//                     />
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={onUpdate}
//             disabled={loading}
//             className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Event"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { apiUrl } from "@/config";

type PaymentType = "free" | "paid";
type ShowStatus = "Upcoming" | "Draft" | "Completed";

type ApiResponse = {
  status?: boolean | number | string;
  success?: boolean | number | string;
  message?: string;
  msg?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};

type ApiEvent = {
  eventId: number;
  group_id: number;
  group_member_ids: string[] | null;
  banner: string | null;
  title: string;
  event_date: string;
  event_time: string;
  description: string | null;
  state_id: number | null;
  city_id: number | null;
  venue: string | null;
  created_at: string;
  updated_at: string;
  pricing_type: number; // 1 free, 2 paid
  ticket_count: number | null;
  price: string | null;
  ticket_info: string | null;
};

type EventsListResponse = ApiResponse & { data?: ApiEvent[] };

type EventEditResponse = ApiResponse & {
  data?: {
    event?: ApiEvent;
    photos?: { id: number; photo: string }[];
  };
};

type EventUpdateResponse = ApiResponse & { data?: ApiEvent };

type EventItem = {
  id: string; // eventId as string
  title: string;
  startDate: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;

  venue: string;
  stateId: string;
  cityId: string;

  paymentType: PaymentType;
  ticketPrice?: string;
  ticketCount?: string;
  ticketInfo?: string;

  status: ShowStatus;

  bannerUrl?: string;
  galleryCount?: number;
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

const api = axios.create({
  baseURL: apiUrl, // ✅ now always string
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function pickMessage(data?: ApiResponse) {
  if (!data) return "";
  return (
    data.message ||
    data.msg ||
    data.error ||
    (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
    ""
  );
}

function isSuccess(data?: ApiResponse) {
  const s = data?.status ?? data?.success;
  return s === true || s === 1 || s === "1" || s === "true" || s === "success";
}

function getApiErrorMessage(err: unknown) {
  const e = err as AxiosError<ApiResponse>;
  return pickMessage(e.response?.data) || e.message || "Network error. Please try again.";
}

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
}

function siteBaseFromApiUrl(u: string) {
  return u.replace(/\/api\/?$/i, "");
}

function toYYYYMMDD(iso: string) {
  return (iso || "").split("T")[0] || "";
}

function toHHmm(t: string) {
  if (!t) return "";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function calcStatus(dateStr: string): ShowStatus {
  const todayYMD = new Date().toISOString().slice(0, 10);
  if (!dateStr) return "Draft";
  return dateStr >= todayYMD ? "Upcoming" : "Completed";
}

function mapApiEventToItem(ev: ApiEvent): EventItem {
  const base = siteBaseFromApiUrl(apiUrl);
  const bannerUrl = ev.banner
    ? ev.banner.startsWith("http")
      ? ev.banner
      : `${base}/${ev.banner}`
    : "";

  const startDate = toYYYYMMDD(ev.event_date);
  const time = toHHmm(ev.event_time);

  const paymentType: PaymentType = ev.pricing_type === 2 ? "paid" : "free";

  return {
    id: String(ev.eventId),
    title: ev.title || "",
    startDate,
    time,
    description: ev.description || "",
    venue: ev.venue || "",
    stateId: ev.state_id != null ? String(ev.state_id) : "",
    cityId: ev.city_id != null ? String(ev.city_id) : "",
    paymentType,
    ticketPrice: ev.price ?? "",
    ticketCount: ev.ticket_count != null ? String(ev.ticket_count) : "",
    ticketInfo: ev.ticket_info ?? "",
    status: calcStatus(startDate),
    bannerUrl,
    galleryCount: 0,
    createdAt: (ev.created_at || "").replace("T", " ").replace(".000000Z", ""),
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageErr, setPageErr] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editErr, setEditErr] = useState("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return events.filter((e) => {
      const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
      const searchOk =
        !s ||
        e.title.toLowerCase().includes(s) ||
        e.cityId.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s);
      return statusOk && searchOk;
    });
  }, [events, search, statusFilter]);

  // ✅ Fetch events list (FIXED: GET + correct axios config)
  useEffect(() => {
    const run = async () => {
      setPageErr("");
      const token = getToken();
      if (!token) return;

      setLoading(true);
      try {
        const res = await api.get<EventsListResponse>("/admin/group-events/events", {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
            token, // optional, safe
          },
        });

        const data = res.data;
        const msg = pickMessage(data);

        if (res.status >= 200 && res.status < 300 && isSuccess(data) && Array.isArray(data?.data)) {
          setEvents(data.data.map(mapApiEventToItem));
          return;
        }

        setPageErr(msg || `Failed to fetch events (${res.status}).`);
      } catch (err) {
        setPageErr(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  // ✅ Open edit: fetch event details
  const openEdit = async (item: EventItem) => {
    setEditErr("");
    setEditLoading(true);
    setEditOpen(true);
    setEditItem({ ...item });

    const token = getToken();
    if (!token) {
      setEditErr("Token not found. Please login again.");
      setEditLoading(false);
      return;
    }

    try {
      const res = await api.post<EventEditResponse>(
        `/admin/group-events/event/edit/${item.id}`,
        {}, // body empty
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
            token,
          },
        }
      );

      const data = res.data;
      const msg = pickMessage(data);

      if (res.status >= 200 && res.status < 300 && isSuccess(data) && data?.data?.event) {
        const mapped = mapApiEventToItem(data.data.event);
        mapped.galleryCount = data.data.photos?.length ?? 0;
        setEditItem(mapped);
        return;
      }

      setEditErr(msg || `Failed to load event (${res.status}).`);
    } catch (err) {
      setEditErr(getApiErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditItem(null);
    setEditErr("");
    setEditLoading(false);
  };

  // ✅ Update event API
  const updateEvent = async () => {
    if (!editItem) return;

    setEditErr("");

    if (!editItem.title || !editItem.startDate || !editItem.time) {
      setEditErr("Please fill Title, Date and Time");
      return;
    }
    if (!editItem.venue) {
      setEditErr("Please fill Venue");
      return;
    }
    if (!editItem.stateId || !editItem.cityId) {
      setEditErr("Please fill State ID and City ID");
      return;
    }
    if (editItem.paymentType === "paid" && !editItem.ticketPrice) {
      setEditErr("Please enter Ticket Price");
      return;
    }

    const token = getToken();
    if (!token) {
      setEditErr("Token not found. Please login again.");
      return;
    }

    setEditLoading(true);
    try {
      const payload: any = {
        title: editItem.title,
        event_date: editItem.startDate,
        event_time: editItem.time,
        state_id: Number(editItem.stateId),
        city_id: Number(editItem.cityId),
        venue: editItem.venue,
        pricing_type: editItem.paymentType === "paid" ? 2 : 1,
      };

      if (editItem.paymentType === "paid") {
        payload.ticket_count = editItem.ticketCount ? Number(editItem.ticketCount) : null;
        payload.price = editItem.ticketPrice || null;
        payload.ticket_info = editItem.ticketInfo || null;
      }

      const res = await api.post<EventUpdateResponse>(
        `/admin/group-events/event/update/${editItem.id}`,
        payload,
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
            token,
          },
        }
      );

      const data = res.data;
      const msg = pickMessage(data);

      if (res.status >= 200 && res.status < 300 && isSuccess(data) && data?.data) {
        const updatedItem = mapApiEventToItem(data.data);
        updatedItem.galleryCount = editItem.galleryCount ?? 0;
        setEvents((prev) => prev.map((x) => (x.id === editItem.id ? updatedItem : x)));
        closeEdit();
        return;
      }

      setEditErr(msg || `Update failed (${res.status}).`);
    } catch (err) {
      setEditErr(getApiErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  };

  // ✅ Delete event API
  const deleteEvent = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this event?");
    if (!ok) return;

    const token = getToken();
    if (!token) return alert("Token not found. Please login again.");

    try {
      const res = await api.post<ApiResponse>(
        `/admin/group-events/event/delete/${id}`,
        {},
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
            token,
          },
        }
      );

      const data = res.data;
      const msg = pickMessage(data);

      if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        return;
      }

      alert(msg || `Delete failed (${res.status}).`);
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
            <p className="text-sm text-black/60">Manage your events (edit / delete).</p>
          </div>

          <Link
            href="/admin/create-event"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            <FiPlus className="text-base" />
            Create Event
          </Link>
        </div>

        {/* Top messages */}
        {loading ? <p className="mt-4 text-sm text-black/60">Loading events...</p> : null}
        {pageErr ? <p className="mt-4 text-sm text-red-600">{pageErr}</p> : null}

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
            <div className="sm:col-span-8">
              <label className={labelCls}>Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title / city id / event id..."
                className={`${inputCls} mt-2`}
              />
            </div>

            <div className="sm:col-span-4">
              <label className={labelCls}>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ShowStatus | "All")}
                className={`${inputCls} mt-2`}
              >
                <option value="All">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
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
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-black/2">
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

                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
                        <p className="text-xs text-black/50">
                          ID: {e.id} • Gallery: {e.galleryCount ?? 0}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-black/70">
                      <p>{e.startDate}</p>
                      <p className="text-xs text-black/50">{e.time}</p>
                    </td>

                    <td className="px-4 py-3 text-sm text-black/70">
                      <p className="font-medium text-black">City ID: {e.cityId || "-"}</p>
                      <p className="text-xs text-black/50">State ID: {e.stateId || "-"}</p>
                    </td>

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

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[e.status]}`}
                      >
                        {e.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-black/60">{e.createdAt}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(e)}
                          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                          aria-label="Edit event"
                          title="Edit"
                        >
                          <FiEdit2 className="text-lg" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteEvent(e.id)}
                          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
                          aria-label="Delete event"
                          title="Delete"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
                      No events found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <Link
          href="/admin/create-event"
          className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
        >
          <FiPlus className="text-base" />
          Create Event
        </Link>
      </div>

      {editOpen && editItem ? (
        <EditModal
          item={editItem}
          onChange={setEditItem}
          onClose={closeEdit}
          onUpdate={updateEvent}
          loading={editLoading}
          error={editErr}
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
  loading,
  error,
}: {
  item: EventItem;
  onChange: (next: EventItem) => void;
  onClose: () => void;
  onUpdate: () => void;
  loading: boolean;
  error: string;
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
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
          <div>
            <p className="text-base font-semibold">Edit Event</p>
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

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {loading ? <p className="text-sm text-black/60">Loading event...</p> : null}
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                value={item.title}
                onChange={(e) => onChange({ ...item, title: e.target.value })}
                className={`${inputCls} mt-2`}
              />
            </div>

            <div>
              <label className={labelCls}>Start Date *</label>
              <input
                type="date"
                value={item.startDate}
                onChange={(e) => onChange({ ...item, startDate: e.target.value })}
                className={`${inputCls} mt-2`}
              />
            </div>

            <div>
              <label className={labelCls}>Time *</label>
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
              <label className={labelCls}>Venue *</label>
              <input
                value={item.venue}
                onChange={(e) => onChange({ ...item, venue: e.target.value })}
                className={`${inputCls} mt-2`}
              />
            </div>

            <div>
              <label className={labelCls}>State ID *</label>
              <input
                type="number"
                value={item.stateId}
                onChange={(e) => onChange({ ...item, stateId: e.target.value })}
                className={`${inputCls} mt-2`}
              />
            </div>

            <div>
              <label className={labelCls}>City ID *</label>
              <input
                type="number"
                value={item.cityId}
                onChange={(e) => onChange({ ...item, cityId: e.target.value })}
                className={`${inputCls} mt-2`}
              />
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
              <p className="text-sm font-semibold">Pricing Type</p>

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
                      value={item.ticketPrice || ""}
                      onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
                      className={`${inputCls} mt-2`}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Ticket Count</label>
                    <input
                      type="number"
                      min={0}
                      value={item.ticketCount || ""}
                      onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
                      className={`${inputCls} mt-2`}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className={labelCls}>Ticket Info</label>
                    <input
                      value={item.ticketInfo || ""}
                      onChange={(e) => onChange({ ...item, ticketInfo: e.target.value })}
                      className={`${inputCls} mt-2`}
                      placeholder="Info / notes"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onUpdate}
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
