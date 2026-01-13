// "use client";

// import Link from "next/link";
// import axios from "axios";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
// import { apiUrl } from "@/config";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";
// type ShowStatus = "Active" | "Inactive";

// /** ✅ backend may return 1/2 or "1"/"2" or strings */
// type ApiPaymentMode = 1 | 2 | "1" | "2" | "online" | "offline" | null | undefined;

// const apiPaymentModeToUi = (v: ApiPaymentMode): PaidMode => {
//   if (v === 2 || v === "2" || v === "offline") return "offline";
//   return "online";
// };

// const uiPaymentModeToApi = (v: PaidMode): "1" | "2" => (v === "online" ? "1" : "2");

// type ApiEventListItem = {
//   eventId: number;
//   group_id: number;
//   group_member_ids: null | string[];
//   banner: string | null;
//   banner_url?: string | null;

//   title: string;
//   event_date: string;
//   event_time: string;
//   description: string;

//   state_id: number;
//   city_id: number;
//   venue: string;

//   created_at: string;
//   updated_at: string;

//   pricing_type: 1 | 2;
//   ticket_count: number | null;
//   price: string | null;
//   ticket_info: string | null;

//   status?: 0 | 1;

//   /** ✅ FIXED TYPES */
//   paid_mode?: ApiPaymentMode;
//   payment_mode?: ApiPaymentMode;
//   online_info?: string | null;
//   offline_info?: string | null;
// };

// type ApiEditResponse = {
//   status: boolean;
//   message: string;
//   data: {
//     event: {
//       eventId: number;
//       group_id: number;
//       group_member_ids: null | string[];
//       banner: string | null;

//       title: string;
//       event_date: string;
//       event_time: string;
//       description: string;

//       state_id: number;
//       city_id: number;
//       venue: string;
//       banner_url: string;

//       created_at: string;
//       updated_at: string;

//       pricing_type: 1 | 2;
//       ticket_count: number | null;
//       price: string | null;
//       ticket_info: string | null;

//       status?: 0 | 1;

//       /** ✅ FIXED TYPES */
//       paid_mode?: ApiPaymentMode;
//       payment_mode?: ApiPaymentMode;
//       online_info?: string | null;
//       offline_info?: string | null;
//     };
//     photos: Array<{ id: number; photo: string; photo_url: string }>;
//   };
// };

// type ApiState = { stateId: number; stateName: string };
// type ApiCity = { id: number; name: string; stateid: number };

// type GroupMember = {
//   id: number;
//   name: string;
//   description: string;
//   photo: string;
//   photo_url: string;
//   created_at: string;
// };

// type EventItem = {
//   id: string;

//   title: string;
//   startDate: string;
//   time: string;
//   description: string;

//   address: string;

//   stateId: number | "";
//   cityId: number | "";
//   stateName: string;
//   cityName: string;

//   paymentType: PaymentType;
//   ticketPrice: string;
//   ticketCount: string;
//   ticketInfo: string;

//   /** ✅ UI MODE */
//   paidMode: PaidMode;
//   onlineInfo: string;
//   offlineInfo: string;

//   selectedMemberIds: number[];

//   status: ShowStatus;

//   bannerUrl?: string;
//   photoUrls?: string[];

//   /** ✅ files for update */
//   bannerFile?: File | null;
//   galleryFiles?: File[];

//   createdAt: string;
// };

// const badgeStyle: Record<ShowStatus, string> = {
//   Active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
//   Inactive: "bg-red-500/10 text-red-700 border-red-500/20",
// };

// const inputCls =
//   "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// const toYYYYMMDD = (iso: string) => (iso ? iso.split("T")[0] : "");
// const toHHMM = (t: string) => (t && t.length >= 5 ? t.slice(0, 5) : "");
// const toHHMMSS = (t: string) => {
//   if (!t) return "";
//   if (t.length === 5) return `${t}:00`;
//   if (t.length === 8) return t;
//   return t;
// };

// const apiStatusToShowStatus = (s?: 0 | 1): ShowStatus =>
//   Number(s ?? 1) === 1 ? "Active" : "Inactive";

// function Spinner({ className = "h-4 w-4" }: { className?: string }) {
//   return (
//     <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//       />
//     </svg>
//   );
// }

// export default function AdminEventsPage() {
//   const API_URL = apiUrl ?? "";

//   const [states, setStates] = useState<ApiState[]>([]);
//   const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
//   const [loadingMembers, setLoadingMembers] = useState(false);

//   const [events, setEvents] = useState<EventItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

//   const [editOpen, setEditOpen] = useState(false);
//   const [editItem, setEditItem] = useState<EventItem | null>(null);
//   const [editLoadingId, setEditLoadingId] = useState<string | null>(null);

//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [pendingDelete, setPendingDelete] = useState<{ id: string; title?: string } | null>(null);


//   const getToken = () => {
//     if (typeof window === "undefined") return "";
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("access_token") ||
//       localStorage.getItem("adminToken") ||
//       ""
//     );
//   };

//   const authConfig = () => {
//     const token = getToken();
//     return {
//       headers: {
//         Accept: "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     };
//   };

//   const buildFileUrl = (path?: string | null) => {
//     if (!path) return "";
//     if (path.startsWith("http")) return path;

//     const base = API_URL.replace(/\/api\/?$/, "");

//     if (path.startsWith("/")) return `${base}${path}`;
//     if (path.includes("/")) return `${base}/${path}`;

//     return `${base}/storage/${path}`;
//   };

//   useEffect(() => {
//     const fetchStates = async () => {
//       if (!API_URL) return;
//       try {
//         const res = await axios.post(`${API_URL}/admin/states/list`, {});
//         if (res.data?.status) setStates(res.data.data || []);
//       } catch (e) {
//         console.error("States fetch error:", e);
//         toast.error("Failed to fetch states.");
//       }
//     };
//     fetchStates();
//   }, [API_URL]);

//   useEffect(() => {
//     const fetchGroupMembers = async () => {
//       if (!API_URL) return;
//       try {
//         setLoadingMembers(true);
//         const token = getToken();
//         if (!token) return setGroupMembers([]);

//         const res = await axios.post(
//           `${API_URL}/admin/group-members`,
//           {},
//           {
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (res.data?.status) setGroupMembers(res.data.data || []);
//         else setGroupMembers([]);
//       } catch (e) {
//         console.error("Group members fetch error:", e);
//         setGroupMembers([]);
//         toast.error("Failed to fetch group members.");
//       } finally {
//         setLoadingMembers(false);
//       }
//     };

//     fetchGroupMembers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [API_URL]);

//   const fetchAllEvents = async () => {
//     if (!API_URL) {
//       toast.error("API URL not configured. Please set apiUrl in config / .env.local");
//       return;
//     }

//     try {
//       setLoading(true);

//       const eventsRes = await axios.post(`${API_URL}/admin/group-events/list`, {}, authConfig());
//       if (!eventsRes.data?.status) {
//         setEvents([]);
//         toast.error(eventsRes.data?.message || "Failed to fetch events.");
//         return;
//       }

//       const apiEvents: ApiEventListItem[] = eventsRes.data?.data || [];

//       const stateNameById = new Map<number, string>(states.map((s) => [s.stateId, s.stateName]));
//       const uniqueStateIds = Array.from(new Set(apiEvents.map((x) => x.state_id))).filter(Boolean);

//       const cityNameById = new Map<number, string>();
//       await Promise.all(
//         uniqueStateIds.map(async (sid) => {
//           try {
//             const cityRes = await axios.post(`${API_URL}/city-by-state`, { stateid: sid });
//             if (cityRes.data?.success) {
//               const cities: ApiCity[] = cityRes.data?.data || [];
//               cities.forEach((c) => cityNameById.set(c.id, c.name));
//             }
//           } catch {
//             // ignore
//           }
//         })
//       );

//       const normalized: EventItem[] = apiEvents.map((x) => {
//         const paymentType: PaymentType = x.pricing_type === 1 ? "free" : "paid";
//         const stateName = stateNameById.get(x.state_id) || `State #${x.state_id}`;
//         const cityName = cityNameById.get(x.city_id) || `City #${x.city_id}`;
//         const bannerCandidate = x.banner_url;

//         return {
//           id: String(x.eventId),

//           title: x.title || "",
//           startDate: toYYYYMMDD(x.event_date),
//           time: toHHMM(x.event_time),
//           description: x.description || "",

//           address: x.venue || "",

//           stateId: x.state_id ?? "",
//           cityId: x.city_id ?? "",
//           stateName,
//           cityName,

//           paymentType,
//           ticketPrice: paymentType === "paid" ? x.price ?? "" : "",
//           ticketCount: x.ticket_count != null ? String(x.ticket_count) : "",
//           ticketInfo: x.ticket_info ?? "",

//           paidMode: apiPaymentModeToUi(x.payment_mode ?? x.paid_mode),
//           onlineInfo: x.online_info ?? "",
//           offlineInfo: x.offline_info ?? "",

//           selectedMemberIds: (x.group_member_ids || []).map((s) => Number(s)).filter(Boolean),

//           status: apiStatusToShowStatus(x.status),

//           bannerUrl: buildFileUrl(bannerCandidate),
//           photoUrls: [],
//           bannerFile: null,
//           galleryFiles: [],

//           createdAt: x.created_at ? new Date(x.created_at).toLocaleString() : "",
//         };
//       });

//       setEvents(normalized);
//     } catch (err: any) {
//       console.error("Events fetch error:", err);
//       setEvents([]);
//       toast.error(err?.response?.data?.message || "Failed to fetch events.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [API_URL, states.length]);

//   const filtered = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return events.filter((e) => {
//       const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
//       const searchOk =
//         !s ||
//         e.title.toLowerCase().includes(s) ||
//         e.cityName.toLowerCase().includes(s) ||
//         e.id.toLowerCase().includes(s);
//       return statusOk && searchOk;
//     });
//   }, [events, search, statusFilter]);

//   const openEdit = async (row: EventItem) => {
//     if (!API_URL) return;

//     try {
//       setEditLoadingId(row.id);

//       const res = await axios.post<ApiEditResponse>(`${API_URL}/admin/group-events/edit/${row.id}`, {}, authConfig());

//       if (!res.data?.status) {
//         toast.error(res.data?.message || "Failed to fetch event.");
//         return;
//       }

//       const ev = res.data.data?.event;
//       const photos = res.data.data?.photos || [];

//       const paymentType: PaymentType = ev.pricing_type === 1 ? "free" : "paid";
//       const stateName = states.find((s) => s.stateId === ev.state_id)?.stateName || row.stateName;
//       const cityName = row.cityName;

//       const paidMode = apiPaymentModeToUi(ev.payment_mode ?? ev.paid_mode ?? row.paidMode);

//       const editReady: EventItem = {
//         id: String(ev.eventId),

//         title: ev.title || "",
//         startDate: toYYYYMMDD(ev.event_date),
//         time: toHHMM(ev.event_time),
//         description: ev.description || "",

//         address: ev.venue || "",

//         stateId: ev.state_id || "",
//         cityId: ev.city_id || "",
//         stateName,
//         cityName,

//         paymentType,
//         ticketPrice: paymentType === "paid" ? ev.price ?? "" : "",
//         ticketCount: ev.ticket_count != null ? String(ev.ticket_count) : "",
//         ticketInfo: ev.ticket_info ?? "",

//         paidMode,
//         onlineInfo: ev.online_info ?? row.onlineInfo ?? "",
//         offlineInfo: ev.offline_info ?? row.offlineInfo ?? "",

//         selectedMemberIds: (ev.group_member_ids || []).map((s) => Number(s)).filter(Boolean),

//         status: apiStatusToShowStatus(ev.status ?? (row.status === "Active" ? 1 : 0)),

//         bannerUrl: buildFileUrl(ev.banner_url),
//         photoUrls: photos.map((p) => buildFileUrl(p.photo_url)),

//         bannerFile: null,
//         galleryFiles: [],

//         createdAt: row.createdAt,
//       };

//       setEditItem(editReady);
//       setEditOpen(true);
//     } catch (err: any) {
//       console.error("Edit fetch error:", err);
//       toast.error(err?.response?.data?.message || "Failed to fetch event.");
//     } finally {
//       setEditLoadingId(null);
//     }
//   };

//   const closeEdit = () => {
//     if (updateLoading) return; // optional: avoid closing while updating
//     setEditOpen(false);
//     setEditItem(null);
//   };

//   /** ✅ UPDATE API (toast + loader) */
//   const updateEvent = async () => {
//     if (!editItem || !API_URL) return;

//     if (!editItem.title || !editItem.startDate || !editItem.time || !editItem.description) {
//       toast.error("Please fill Title, Date, Time and Description");
//       return;
//     }
//     if (!editItem.address || !editItem.stateId || !editItem.cityId) {
//       toast.error("Please fill Address, State and City");
//       return;
//     }
//     if (editItem.paymentType === "paid" && !editItem.ticketPrice) {
//       toast.error("Please enter Ticket Price");
//       return;
//     }

//     try {
//       setUpdateLoading(true);

//       const fd = new FormData();
//       fd.append("title", editItem.title);
//       fd.append("event_date", editItem.startDate);
//       fd.append("event_time", toHHMMSS(editItem.time));
//       fd.append("description", editItem.description);
//       fd.append("state_id", String(editItem.stateId));
//       fd.append("city_id", String(editItem.cityId));
//       fd.append("venue", editItem.address);

//       const pricing_type = editItem.paymentType === "free" ? "1" : "2";
//       fd.append("pricing_type", pricing_type);

//       if (editItem.paymentType === "paid") {
//         fd.append("price", editItem.ticketPrice);
//         if (editItem.ticketCount) fd.append("ticket_count", editItem.ticketCount);
//         if (editItem.ticketInfo) fd.append("ticket_info", editItem.ticketInfo);

//         fd.append("payment_mode", uiPaymentModeToApi(editItem.paidMode));
//       } else {
//         fd.append("price", "");
//         fd.append("ticket_count", "");
//         fd.append("ticket_info", "");
//         fd.append("payment_mode", "");
//       }

//       editItem.selectedMemberIds.forEach((id) => fd.append("group_members[]", String(id)));

//       if (editItem.bannerFile) fd.append("banner", editItem.bannerFile);

//       if (editItem.galleryFiles && editItem.galleryFiles.length > 0) {
//         editItem.galleryFiles.forEach((file) => fd.append("photos[]", file));
//       }

//       const res = await axios.post(`${API_URL}/admin/group-events/update/${editItem.id}`, fd, authConfig());

//       if (!res.data?.status) {
//         toast.error(res.data?.message || "Event update failed.");
//         return;
//       }

//       toast.success("Event updated successfully!");
//       await fetchAllEvents();
//       closeEdit();
//     } catch (err: any) {
//       console.error("Update error:", err);
//       toast.error(err?.response?.data?.message || "Event update failed.");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };
//   const askDelete = (ev: EventItem) => {
//     setPendingDelete({ id: ev.id, title: ev.title });
//     setConfirmDeleteOpen(true);
//   };

//   const deleteEvent = async (id: string) => {
//     if (!API_URL) return;


//     try {
//       setDeleteLoadingId(id);

//       const res = await axios.post(`${API_URL}/admin/group-events/delete/${id}`, {}, authConfig());

//       if (!res.data?.status) {
//         toast.error(res.data?.message || "Delete failed.");
//         return;
//       }

//       setEvents((prev) => prev.filter((e) => e.id !== id));
//       toast.success("Event deleted successfully!");
//       setConfirmDeleteOpen(false);
//       setPendingDelete(null);
//     } catch (err: any) {
//       console.error("Delete error:", err);
//       toast.error(err?.response?.data?.message || "Delete failed.");
//     } finally {
//       setDeleteLoadingId(null);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#f6f7fb] text-black">
//       <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick pauseOnHover draggable />

//       <div className="mx-auto w-full max-w-7xl px-4 py-8">
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex flex-col gap-1">
//             <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
//           </div>

//           <Link
//             href="/admin/create-event"
//             className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//           >
//             <FiPlus className="text-base" />
//             Create Event
//           </Link>
//         </div>

//         <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//           <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//             <div className="sm:col-span-8">
//               <label className={labelCls}>Search</label>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by title / city ..."
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
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </section>

//         <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-245 w-full">
//               <thead className="bg-black/3">
//                 <tr className="text-left text-sm font-semibold text-black">
//                   <th className="px-4 py-3">Banner</th>
//                   <th className="px-4 py-3">Event</th>
//                   <th className="px-4 py-3">Date / Time</th>
//                   <th className="px-4 py-3">City / State</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-black/10">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
//                       <span className="inline-flex items-center gap-2">
//                         <Spinner className="h-4 w-4" />
//                         Loading events...
//                       </span>
//                     </td>
//                   </tr>
//                 ) : (
//                   filtered.map((e) => (
//                     <tr key={e.id} className="hover:bg-black/2">
//                       <td className="px-4 py-3">
//                         <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
//                           {e.bannerUrl ? (
//                             // eslint-disable-next-line @next/next/no-img-element
//                             <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
//                           ) : (
//                             <span className="text-sm font-bold text-primary">
//                               {e.title?.trim()?.[0]?.toUpperCase() || "M"}
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       <td className="px-4 py-3">
//                         <div className="min-w-0">
//                           <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-3 text-sm text-black/70">
//                         <p>{e.startDate}</p>
//                         <p className="text-xs text-black/50">{e.time}</p>
//                       </td>

//                       <td className="px-4 py-3 text-sm text-black/70">
//                         <p className="font-medium text-black">{e.cityName}</p>
//                         <p className="text-xs text-black/50">{e.stateName}</p>
//                       </td>

//                       <td className="px-4 py-3 text-sm">
//                         {e.paymentType === "free" ? (
//                           <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                             Free
//                           </span>
//                         ) : (
//                           <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
//                             Paid
//                           </span>
//                         )}
//                       </td>

//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle[e.status]}`}
//                         >
//                           {e.status}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             type="button"
//                             onClick={() => openEdit(e)}
//                             disabled={editLoadingId === e.id}
//                             className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5 disabled:opacity-60"
//                             aria-label="Edit event"
//                             title="Edit"
//                           >
//                             {editLoadingId === e.id ? <Spinner className="h-5 w-5" /> : <FiEdit2 className="text-lg" />}
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => askDelete(e)}
//                             disabled={deleteLoadingId === e.id}
//                             className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
//                             aria-label="Delete event"
//                             title="Delete"
//                           >
//                             {deleteLoadingId === e.id ? <Spinner className="h-5 w-5" /> : <FiTrash2 className="text-lg" />}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}

//                 {!loading && filtered.length === 0 ? (
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

//         <Link
//           href="/admin/create-event"
//           className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
//         >
//           <FiPlus className="text-base" />
//           Create Event
//         </Link>
//       </div>

//       {editOpen && editItem ? (
//         <EditModal
//           item={editItem}
//           onChange={setEditItem}
//           onClose={closeEdit}
//           onUpdate={updateEvent}
//           updateLoading={updateLoading}
//           states={states}
//           apiUrl={API_URL}
//           groupMembers={groupMembers}
//           loadingMembers={loadingMembers}
//         />
//       ) : null}
//       {confirmDeleteOpen && pendingDelete ? (
//         <ConfirmDeleteModal
//           title={pendingDelete.title}
//           loading={deleteLoadingId === pendingDelete.id}
//           onCancel={() => {
//             if (deleteLoadingId) return;
//             setConfirmDeleteOpen(false);
//             setPendingDelete(null);
//           }}
//           onConfirm={() => deleteEvent(pendingDelete.id)}
//         />
//       ) : null}

//     </main>
//   );
// }

// function getTodayLocalYYYYMMDD() {
//   const d = new Date();
//   d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//   return d.toISOString().slice(0, 10);
// }


// function EditModal({
//   item,
//   onChange,
//   onClose,
//   onUpdate,
//   updateLoading,
//   states,
//   apiUrl,
//   groupMembers,
//   loadingMembers,
// }: {
//   item: EventItem;
//   onChange: (next: EventItem | null) => void;
//   onClose: () => void;
//   onUpdate: () => void;
//   updateLoading: boolean;
//   states: ApiState[];
//   apiUrl: string;
//   groupMembers: GroupMember[];
//   loadingMembers: boolean;
// }) {
//   const [cities, setCities] = useState<ApiCity[]>([]);
//   const [loadingCities, setLoadingCities] = useState(false);

//   useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && !updateLoading) onClose();
//     };
//     document.addEventListener("keydown", onEsc);
//     return () => document.removeEventListener("keydown", onEsc);
//   }, [onClose, updateLoading]);

//   useEffect(() => {
//     const fetchCities = async () => {
//       if (!item.stateId) {
//         setCities([]);
//         return;
//       }
//       try {
//         setLoadingCities(true);
//         const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: item.stateId });
//         if (res.data?.success) setCities(res.data.data || []);
//         else setCities([]);
//       } catch (e) {
//         console.error("City fetch error:", e);
//         setCities([]);
//         toast.error("Failed to fetch cities.");
//       } finally {
//         setLoadingCities(false);
//       }
//     };

//     fetchCities();
//   }, [item.stateId, apiUrl]);

//   const isPaid = item.paymentType === "paid";
//   const today = useMemo(() => getTodayLocalYYYYMMDD(), []);

//   const bannerPreview = useMemo(() => {
//     if (item.bannerFile) return URL.createObjectURL(item.bannerFile);
//     return item.bannerUrl || "";
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [item.bannerFile, item.bannerUrl]);

//   const galleryPreviews = useMemo(() => {
//     return (item.galleryFiles || []).map((f) => URL.createObjectURL(f));
//   }, [item.galleryFiles]);

//   useEffect(() => {
//     return () => {
//       if (bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
//       galleryPreviews.forEach((u) => {
//         if (u.startsWith("blob:")) URL.revokeObjectURL(u);
//       });
//     };
//   }, [bannerPreview, galleryPreviews]);

//   return (
//     <div
//       className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 "
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget && !updateLoading) onClose();
//       }}
//     >
//       <div className="relative mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
//         <div className="top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
//           <div>
//             <p className="text-base font-semibold">Edit Event</p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={updateLoading}
//             className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5 disabled:opacity-60"
//             aria-label="Close"
//             title="Close"
//           >
//             <FiX className="text-lg" />
//           </button>
//         </div>

//         <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
//           <div className="grid gap-6 lg:grid-cols-12">
//             {/* Left */}
//             <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-4">
//               <p className="text-sm font-semibold">Images</p>

//               <div className="mt-3">
//                 <p className="text-sm font-medium text-black">Banner</p>
//                 <div className="mt-2 overflow-hidden rounded-xl border border-black/10 bg-black/2">
//                   {bannerPreview ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={bannerPreview} alt="Banner" className="h-40 w-full object-cover" />
//                   ) : (
//                     <div className="h-40 w-full flex items-center justify-center text-sm text-black/50">No banner</div>
//                   )}
//                 </div>

//                 <div className="mt-3">
//                   <label className={labelCls}>Change Banner</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className={`${inputCls} mt-2`}
//                     disabled={updateLoading}
//                     onChange={(e) => {
//                       const f = e.target.files?.[0] || null;
//                       onChange({ ...item, bannerFile: f });
//                     }}
//                   />
//                   {item.bannerFile ? (
//                     <button
//                       type="button"
//                       className="mt-2 text-xs text-red-600 underline disabled:opacity-60"
//                       disabled={updateLoading}
//                       onClick={() => onChange({ ...item, bannerFile: null })}
//                     >
//                       Remove selected banner
//                     </button>
//                   ) : null}
//                 </div>
//               </div>

//               <div className="mt-5">
//                 <p className="text-sm font-medium text-black">Gallery Photos</p>

//                 {item.photoUrls && item.photoUrls.length > 0 ? (
//                   <div className="mt-2 grid grid-cols-3 gap-2">
//                     {item.photoUrls.map((u) => (
//                       <div key={u} className="overflow-hidden rounded-xl border border-black/10 bg-black/2">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img src={u} alt="Photo" className="h-20 w-full object-cover" />
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="mt-2 rounded-xl border border-dashed border-black/15 p-4 text-center text-sm text-black/60">
//                     No gallery photos
//                   </div>
//                 )}

//                 {galleryPreviews.length > 0 ? (
//                   <div className="mt-3">
//                     <p className="text-xs font-semibold text-black/70">New Selected Photos</p>
//                     <div className="mt-2 grid grid-cols-3 gap-2">
//                       {galleryPreviews.map((u) => (
//                         <div key={u} className="overflow-hidden rounded-xl border border-black/10 bg-black/2">
//                           {/* eslint-disable-next-line @next/next/no-img-element */}
//                           <img src={u} alt="New Photo" className="h-20 w-full object-cover" />
//                         </div>
//                       ))}
//                     </div>

//                     <button
//                       type="button"
//                       className="mt-2 text-xs text-red-600 underline disabled:opacity-60"
//                       disabled={updateLoading}
//                       onClick={() => onChange({ ...item, galleryFiles: [] })}
//                     >
//                       Remove selected gallery photos
//                     </button>
//                   </div>
//                 ) : null}

//                 <div className="mt-3">
//                   <label className={labelCls}>Add Gallery Photos</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     disabled={updateLoading}
//                     className={`${inputCls} mt-2`}
//                     onChange={(e) => {
//                       const files = Array.from(e.target.files || []);
//                       onChange({ ...item, galleryFiles: files });
//                     }}
//                   />
//                   <p className="mt-2 text-xs text-black/50">(Upload will happen on Update Event)</p>
//                 </div>
//               </div>
//             </div>

//             {/* Right */}
//             <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-4">
//               <p className="text-sm font-semibold">Event Details</p>

//               <div className="mt-4 grid gap-4 lg:grid-cols-2">
//                 <div className="lg:col-span-2">
//                   <label className={labelCls}>Title <span className="text-red-500">*</span></label>
//                   <input
//                     value={item.title}
//                     disabled={updateLoading}
//                     onChange={(e) => onChange({ ...item, title: e.target.value })}
//                     className={`${inputCls} mt-2`}
//                   />
//                 </div>

//                 <div className="lg:col-span-2">
//                   <GroupMembersDropdown
//                     groupMembers={groupMembers}
//                     loadingMembers={loadingMembers}
//                     selectedIds={item.selectedMemberIds}
//                     onChangeSelected={(next) => onChange({ ...item, selectedMemberIds: next })}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelCls}>Event Date <span className="text-red-500">*</span></label>
//                   {/* <input
//                     type="date"
//                     value={item.startDate}
//                     disabled={updateLoading}
//                     onChange={(e) => onChange({ ...item, startDate: e.target.value })}
//                     className={`${inputCls} mt-2`}
//                   /> */}
//                   <input
//                     type="date"
//                     value={item.startDate}
//                     min={today} // ✅ Disable past dates
//                     disabled={updateLoading}
//                     onChange={(e) => {
//                       const v = e.target.value;

//                       // ✅ Prevent manual entry of past dates
//                       if (v && v < today) {
//                         toast.error("Past dates are not allowed.");
//                         onChange({ ...item, startDate: today });
//                         return;
//                       }

//                       onChange({ ...item, startDate: v });
//                     }}
//                     className={`${inputCls} mt-2`}
//                   />

//                 </div>

//                 <div>
//                   <label className={labelCls}>Time <span className="text-red-500">*</span></label>
//                   <input
//                     type="time"
//                     value={item.time}
//                     disabled={updateLoading}
//                     onChange={(e) => onChange({ ...item, time: e.target.value })}
//                     className={`${inputCls} mt-2`}
//                   />
//                 </div>

//                 <div className="lg:col-span-2">
//                   <label className={labelCls}>Description <span className="text-red-500">*</span></label>
//                   <textarea
//                     rows={4}
//                     value={item.description}
//                     disabled={updateLoading}
//                     onChange={(e) => onChange({ ...item, description: e.target.value })}
//                     className={`${inputCls} mt-2 resize-none`}
//                   />
//                 </div>

//                 <div className="lg:col-span-2">
//                   <label className={labelCls}>Address / Venue <span className="text-red-500">*</span></label>
//                   <input
//                     value={item.address}
//                     disabled={updateLoading}
//                     onChange={(e) => onChange({ ...item, address: e.target.value })}
//                     className={`${inputCls} mt-2`}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelCls}>State <span className="text-red-500">*</span></label>
//                   <select
//                     className={`${inputCls} mt-2`}
//                     value={item.stateId}
//                     disabled={updateLoading}
//                     onChange={(e) => {
//                       const v = e.target.value;
//                       if (!v) {
//                         onChange({ ...item, stateId: "", cityId: "", stateName: "", cityName: "" });
//                         return;
//                       }
//                       const sid = Number(v);
//                       const sName = states.find((s) => s.stateId === sid)?.stateName || "";
//                       onChange({ ...item, stateId: sid, cityId: "", stateName: sName, cityName: "" });
//                     }}
//                   >
//                     <option value="">Select State</option>
//                     {states.map((s) => (
//                       <option key={s.stateId} value={s.stateId}>
//                         {s.stateName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelCls}>City <span className="text-red-500">*</span></label>
//                   <select
//                     className={`${inputCls} mt-2`}
//                     value={item.cityId}
//                     disabled={!item.stateId || loadingCities || updateLoading}
//                     onChange={(e) => {
//                       const v = e.target.value;
//                       if (!v) {
//                         onChange({ ...item, cityId: "", cityName: "" });
//                         return;
//                       }
//                       const cid = Number(v);
//                       const cName = cities.find((c) => c.id === cid)?.name || "";
//                       onChange({ ...item, cityId: cid, cityName: cName });
//                     }}
//                   >
//                     <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
//                     {cities.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* ✅ Pricing + Paymode */}
//                 <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//                   <p className="text-sm font-semibold">Pricing</p>

//                   <div className="mt-3 flex flex-wrap gap-3">
//                     <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                       <input
//                         type="radio"
//                         name="paymentTypeEdit"
//                         checked={item.paymentType === "free"}
//                         disabled={updateLoading}
//                         onChange={() =>
//                           onChange({
//                             ...item,
//                             paymentType: "free",
//                             ticketPrice: "",
//                             ticketCount: "",
//                             ticketInfo: "",
//                             paidMode: "online",
//                             onlineInfo: "",
//                             offlineInfo: "",
//                           })
//                         }
//                       />
//                       Free
//                     </label>

//                     <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                       <input
//                         type="radio"
//                         name="paymentTypeEdit"
//                         checked={item.paymentType === "paid"}
//                         disabled={updateLoading}
//                         onChange={() =>
//                           onChange({
//                             ...item,
//                             paymentType: "paid",
//                             paidMode: item.paidMode || "online",
//                           })
//                         }
//                       />
//                       Paid
//                     </label>
//                   </div>

//                   {isPaid ? (
//                     <div className="mt-4 grid gap-4 lg:grid-cols-2">
//                       <div>
//                         <label className={labelCls}>Ticket Price <span className="text-red-500">*</span></label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={item.ticketPrice}
//                           disabled={updateLoading}
//                           onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
//                           className={`${inputCls} mt-2`}
//                         />
//                       </div>

//                       <div>
//                         <label className={labelCls}>Ticket Count <span className="text-red-500">*</span></label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={item.ticketCount}
//                           disabled={updateLoading}
//                           onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
//                           className={`${inputCls} mt-2`}
//                         />
//                       </div>

//                       <div className="lg:col-span-2">
//                         <label className={labelCls}>Ticket Info <span className="text-red-500">*</span></label>
//                         <textarea
//                           rows={3}
//                           value={item.ticketInfo}
//                           disabled={updateLoading}
//                           onChange={(e) => onChange({ ...item, ticketInfo: e.target.value })}
//                           className={`${inputCls} mt-2 resize-none`}
//                         />
//                       </div>

//                       {/* ✅ Paymode radio */}
//                       <div className="lg:col-span-2">
//                         <label className={labelCls}>
//                           Payment Mode <span className="text-red-500">*</span>
//                         </label>

//                         <div className="mt-2 flex flex-wrap gap-3">
//                           <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                             <input
//                               type="radio"
//                               name="paidModeEdit"
//                               checked={item.paidMode === "online"}
//                               disabled={updateLoading}
//                               onChange={() => onChange({ ...item, paidMode: "online" })}
//                             />
//                             Online
//                           </label>

//                           <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                             <input
//                               type="radio"
//                               name="paidModeEdit"
//                               checked={item.paidMode === "offline"}
//                               disabled={updateLoading}
//                               onChange={() => onChange({ ...item, paidMode: "offline" })}
//                             />
//                             Offline
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
//             disabled={updateLoading}
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={onUpdate}
//             disabled={updateLoading}
//             className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
//           >
//             {updateLoading ? (
//               <>
//                 <Spinner className="h-4 w-4" />
//                 Updating...
//               </>
//             ) : (
//               "Update Event"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ConfirmDeleteModal({
//   title,
//   loading,
//   onCancel,
//   onConfirm,
// }: {
//   title?: string;
//   loading: boolean;
//   onCancel: () => void;
//   onConfirm: () => void;
// }) {
//   useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && !loading) onCancel();
//     };
//     document.addEventListener("keydown", onEsc);
//     return () => document.removeEventListener("keydown", onEsc);
//   }, [onCancel, loading]);

//   return (
//     <div
//       className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget && !loading) onCancel();
//       }}
//     >
//       <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden">
//         <div className="p-5 border-b border-black/10">
//           <p className="text-base font-semibold text-black">Confirm Delete</p>
//           <p className="mt-1 text-sm text-black/60">
//             Are you sure you want to delete{" "}
//             <span className="font-semibold text-black">{title || "this event"}</span>?
//           </p>
//         </div>

//         <div className="p-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={loading}
//             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={onConfirm}
//             disabled={loading}
//             className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Spinner className="h-4 w-4" />
//                 Deleting...
//               </>
//             ) : (
//               "Yes, Delete"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function GroupMembersDropdown({
//   groupMembers,
//   loadingMembers,
//   selectedIds,
//   onChangeSelected,
// }: {
//   groupMembers: GroupMember[];
//   loadingMembers: boolean;
//   selectedIds: number[];
//   onChangeSelected: (next: number[]) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const boxRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       if (!boxRef.current) return;
//       if (!boxRef.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   const filtered = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     if (!s) return groupMembers;
//     return groupMembers.filter((m) => {
//       return (
//         m.name.toLowerCase().includes(s) ||
//         (m.description || "").toLowerCase().includes(s) ||
//         String(m.id).includes(s)
//       );
//     });
//   }, [groupMembers, search]);

//   const toggle = (id: number) => {
//     onChangeSelected(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
//   };

//   return (
//     <div className="relative" ref={boxRef}>
//       <label className={labelCls}>
//         Group Members <span className="text-xs text-black/50">(Optional)</span>
//       </label>

//       <button
//         type="button"
//         onClick={() => setOpen((p) => !p)}
//         className={`${inputCls} mt-2 flex items-center justify-between`}
//       >
//         <span className="text-sm">
//           {selectedIds.length === 0
//             ? loadingMembers
//               ? "Loading members..."
//               : "Select members (optional)"
//             : `${selectedIds.length} selected`}
//         </span>
//         <span className="text-black/50">▾</span>
//       </button>

//       {open ? (
//         <div className="absolute z-50 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg">
//           <div className="p-3">
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search member..."
//               className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <div className="max-h-64 overflow-auto p-2">
//             {loadingMembers ? (
//               <p className="px-3 py-2 text-sm text-black/60">Loading...</p>
//             ) : filtered.length === 0 ? (
//               <p className="px-3 py-2 text-sm text-black/60">No members found</p>
//             ) : (
//               filtered.map((m) => {
//                 const checked = selectedIds.includes(m.id);
//                 return (
//                   <label
//                     key={m.id}
//                     className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 hover:bg-black/5"
//                   >
//                     <input type="checkbox" checked={checked} onChange={() => toggle(m.id)} className="mt-1" />
//                     <div className="min-w-0">
//                       <p className="text-sm font-medium">{m.name}</p>
//                       <p className="text-xs text-black/60 line-clamp-1">{m.description}</p>
//                     </div>
//                   </label>
//                 );
//               })
//             )}
//           </div>

//           <div className="flex items-center justify-between border-t border-black/10 p-3">
//             <button
//               type="button"
//               onClick={() => onChangeSelected([])}
//               className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//             >
//               Clear
//             </button>
//             <button
//               type="button"
//               onClick={() => setOpen(false)}
//               className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
//             >
//               Done
//             </button>
//           </div>
//         </div>
//       ) : null}

//       {selectedIds.length > 0 ? (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {selectedIds.map((id) => {
//             const mem = groupMembers.find((x) => x.id === id);
//             if (!mem) return null;
//             return (
//               <span
//                 key={id}
//                 className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm"
//               >
//                 {mem.name}
//                 <button type="button" className="text-black/60 hover:text-black" onClick={() => toggle(id)}>
//                   ✕
//                 </button>
//               </span>
//             );
//           })}
//         </div>
//       ) : null}
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { apiUrl } from "@/config";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PaymentType = "free" | "paid";
type PaidMode = "online" | "offline";
type ShowStatus = "Active" | "Inactive";

/** ✅ backend may return 1/2 or "1"/"2" or strings */
type ApiPaymentMode = 1 | 2 | "1" | "2" | "online" | "offline" | null | undefined;

const apiPaymentModeToUi = (v: ApiPaymentMode): PaidMode => {
  if (v === 2 || v === "2" || v === "offline") return "offline";
  return "online";
};

const uiPaymentModeToApi = (v: PaidMode): "1" | "2" => (v === "online" ? "1" : "2");

type ApiEventListItem = {
  eventId: number;
  group_id: number;
  group_member_ids: null | string[];
  banner: string | null;
  banner_url?: string | null;

  title: string;
  event_date: string;
  event_time: string;
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

  status?: 0 | 1;

  /** ✅ FIXED TYPES */
  paid_mode?: ApiPaymentMode;
  payment_mode?: ApiPaymentMode;
  online_info?: string | null;
  offline_info?: string | null;
};

type ApiEditResponse = {
  status: boolean;
  message: string;
  data: {
    event: {
      eventId: number;
      group_id: number;
      group_member_ids: null | string[];
      banner: string | null;

      title: string;
      event_date: string;
      event_time: string;
      description: string;

      state_id: number;
      city_id: number;
      venue: string;
      banner_url: string;

      created_at: string;
      updated_at: string;

      pricing_type: 1 | 2;
      ticket_count: number | null;
      price: string | null;
      ticket_info: string | null;

      status?: 0 | 1;

      /** ✅ FIXED TYPES */
      paid_mode?: ApiPaymentMode;
      payment_mode?: ApiPaymentMode;
      online_info?: string | null;
      offline_info?: string | null;
    };
    photos: Array<{ id: number; photo: string; photo_url: string }>;
  };
};

type ApiState = { stateId: number; stateName: string };
type ApiCity = { id: number; name: string; stateid: number };

type GroupMember = {
  id: number;
  name: string;
  description: string;
  photo: string;
  photo_url: string;
  created_at: string;
};

type EventItem = {
  id: string;

  title: string;
  startDate: string;
  time: string;
  description: string;

  address: string;

  stateId: number | "";
  cityId: number | "";
  stateName: string;
  cityName: string;

  paymentType: PaymentType;
  ticketPrice: string;
  ticketCount: string;
  ticketInfo: string;

  /** ✅ UI MODE */
  paidMode: PaidMode;
  onlineInfo: string;
  offlineInfo: string;

  selectedMemberIds: number[];

  status: ShowStatus;

  bannerUrl?: string;

  /** ✅ Existing gallery photos with ids (needed for delete-selected API) */
  photoItems?: Array<{ id: number; url: string }>;

  /** ✅ optional legacy, keep if you still want */
  photoUrls?: string[];

  /** ✅ files for update */
  bannerFile?: File | null;
  galleryFiles?: File[];

  createdAt: string;
};

const badgeStyle: Record<ShowStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Inactive: "bg-red-500/10 text-red-700 border-red-500/20",
};

const inputCls =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

const toYYYYMMDD = (iso: string) => (iso ? iso.split("T")[0] : "");
const toHHMM = (t: string) => (t && t.length >= 5 ? t.slice(0, 5) : "");
const toHHMMSS = (t: string) => {
  if (!t) return "";
  if (t.length === 5) return `${t}:00`;
  if (t.length === 8) return t;
  return t;
};

const apiStatusToShowStatus = (s?: 0 | 1): ShowStatus =>
  Number(s ?? 1) === 1 ? "Active" : "Inactive";

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function AdminEventsPage() {
  const API_URL = apiUrl ?? "";

  const [states, setStates] = useState<ApiState[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title?: string } | null>(null);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("adminToken") ||
      ""
    );
  };

  const authConfig = () => {
    const token = getToken();
    return {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  };

  const buildFileUrl = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const base = API_URL.replace(/\/api\/?$/, "");
    if (path.startsWith("/")) return `${base}${path}`;
    if (path.includes("/")) return `${base}/${path}`;
    return `${base}/storage/${path}`;
  };

  useEffect(() => {
    const fetchStates = async () => {
      if (!API_URL) return;
      try {
        const res = await axios.post(`${API_URL}/admin/states/list`, {});
        if (res.data?.status) setStates(res.data.data || []);
      } catch (e) {
        console.error("States fetch error:", e);
        toast.error("Failed to fetch states.");
      }
    };
    fetchStates();
  }, [API_URL]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!API_URL) return;
      try {
        setLoadingMembers(true);
        const token = getToken();
        if (!token) return setGroupMembers([]);

        const res = await axios.post(
          `${API_URL}/admin/group-members`,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.status) setGroupMembers(res.data.data || []);
        else setGroupMembers([]);
      } catch (e) {
        console.error("Group members fetch error:", e);
        setGroupMembers([]);
        toast.error("Failed to fetch group members.");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchGroupMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  const fetchAllEvents = async () => {
    if (!API_URL) {
      toast.error("API URL not configured. Please set apiUrl in config / .env.local");
      return;
    }

    try {
      setLoading(true);

      const eventsRes = await axios.post(`${API_URL}/admin/group-events/list`, {}, authConfig());
      if (!eventsRes.data?.status) {
        setEvents([]);
        toast.error(eventsRes.data?.message || "Failed to fetch events.");
        return;
      }

      const apiEvents: ApiEventListItem[] = eventsRes.data?.data || [];

      const stateNameById = new Map<number, string>(states.map((s) => [s.stateId, s.stateName]));
      const uniqueStateIds = Array.from(new Set(apiEvents.map((x) => x.state_id))).filter(Boolean);

      const cityNameById = new Map<number, string>();
      await Promise.all(
        uniqueStateIds.map(async (sid) => {
          try {
            const cityRes = await axios.post(`${API_URL}/city-by-state`, { stateid: sid });
            if (cityRes.data?.success) {
              const cities: ApiCity[] = cityRes.data?.data || [];
              cities.forEach((c) => cityNameById.set(c.id, c.name));
            }
          } catch {
            // ignore
          }
        })
      );

      const normalized: EventItem[] = apiEvents.map((x) => {
        const paymentType: PaymentType = x.pricing_type === 1 ? "free" : "paid";
        const stateName = stateNameById.get(x.state_id) || `State #${x.state_id}`;
        const cityName = cityNameById.get(x.city_id) || `City #${x.city_id}`;

        return {
          id: String(x.eventId),

          title: x.title || "",
          startDate: toYYYYMMDD(x.event_date),
          time: toHHMM(x.event_time),
          description: x.description || "",

          address: x.venue || "",

          stateId: x.state_id ?? "",
          cityId: x.city_id ?? "",
          stateName,
          cityName,

          paymentType,
          ticketPrice: paymentType === "paid" ? x.price ?? "" : "",
          ticketCount: x.ticket_count != null ? String(x.ticket_count) : "",
          ticketInfo: x.ticket_info ?? "",

          paidMode: apiPaymentModeToUi(x.payment_mode ?? x.paid_mode),
          onlineInfo: x.online_info ?? "",
          offlineInfo: x.offline_info ?? "",

          selectedMemberIds: (x.group_member_ids || []).map((s) => Number(s)).filter(Boolean),

          status: apiStatusToShowStatus(x.status),

          bannerUrl: buildFileUrl(x.banner_url),
          photoItems: [],
          photoUrls: [],

          bannerFile: null,
          galleryFiles: [],

          createdAt: x.created_at ? new Date(x.created_at).toLocaleString() : "",
        };
      });

      setEvents(normalized);
    } catch (err: any) {
      console.error("Events fetch error:", err);
      setEvents([]);
      toast.error(err?.response?.data?.message || "Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL, states.length]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return events.filter((e) => {
      const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
      const searchOk =
        !s ||
        e.title.toLowerCase().includes(s) ||
        e.cityName.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s);
      return statusOk && searchOk;
    });
  }, [events, search, statusFilter]);

  const openEdit = async (row: EventItem) => {
    if (!API_URL) return;

    try {
      setEditLoadingId(row.id);

      const res = await axios.post<ApiEditResponse>(
        `${API_URL}/admin/group-events/edit/${row.id}`,
        {},
        authConfig()
      );

      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to fetch event.");
        return;
      }

      const ev = res.data.data?.event;
      const photos = res.data.data?.photos || [];

      const paymentType: PaymentType = ev.pricing_type === 1 ? "free" : "paid";
      const stateName = states.find((s) => s.stateId === ev.state_id)?.stateName || row.stateName;
      const cityName = row.cityName;

      const paidMode = apiPaymentModeToUi(ev.payment_mode ?? ev.paid_mode ?? row.paidMode);

      const photoItems = photos.map((p) => ({
        id: p.id,
        url: buildFileUrl(p.photo_url),
      }));

      const editReady: EventItem = {
        id: String(ev.eventId),

        title: ev.title || "",
        startDate: toYYYYMMDD(ev.event_date),
        time: toHHMM(ev.event_time),
        description: ev.description || "",

        address: ev.venue || "",

        stateId: ev.state_id || "",
        cityId: ev.city_id || "",
        stateName,
        cityName,

        paymentType,
        ticketPrice: paymentType === "paid" ? ev.price ?? "" : "",
        ticketCount: ev.ticket_count != null ? String(ev.ticket_count) : "",
        ticketInfo: ev.ticket_info ?? "",

        paidMode,
        onlineInfo: ev.online_info ?? row.onlineInfo ?? "",
        offlineInfo: ev.offline_info ?? row.offlineInfo ?? "",

        selectedMemberIds: (ev.group_member_ids || []).map((s) => Number(s)).filter(Boolean),

        status: apiStatusToShowStatus(ev.status ?? (row.status === "Active" ? 1 : 0)),

        bannerUrl: buildFileUrl(ev.banner_url),

        photoItems,
        photoUrls: photoItems.map((x) => x.url),

        bannerFile: null,
        galleryFiles: [],

        createdAt: row.createdAt,
      };

      setEditItem(editReady);
      setEditOpen(true);
    } catch (err: any) {
      console.error("Edit fetch error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch event.");
    } finally {
      setEditLoadingId(null);
    }
  };

  const closeEdit = () => {
    if (updateLoading) return;
    setEditOpen(false);
    setEditItem(null);
  };

  /** ✅ UPDATE API */
  const updateEvent = async () => {
    if (!editItem || !API_URL) return;

    if (!editItem.title || !editItem.startDate || !editItem.time || !editItem.description) {
      toast.error("Please fill Title, Date, Time and Description");
      return;
    }
    if (!editItem.address || !editItem.stateId || !editItem.cityId) {
      toast.error("Please fill Address, State and City");
      return;
    }
    if (editItem.paymentType === "paid" && !editItem.ticketPrice) {
      toast.error("Please enter Ticket Price");
      return;
    }

    try {
      setUpdateLoading(true);

      const fd = new FormData();
      fd.append("title", editItem.title);
      fd.append("event_date", editItem.startDate);
      fd.append("event_time", toHHMMSS(editItem.time));
      fd.append("description", editItem.description);
      fd.append("state_id", String(editItem.stateId));
      fd.append("city_id", String(editItem.cityId));
      fd.append("venue", editItem.address);

      const pricing_type = editItem.paymentType === "free" ? "1" : "2";
      fd.append("pricing_type", pricing_type);

      if (editItem.paymentType === "paid") {
        fd.append("price", editItem.ticketPrice);
        if (editItem.ticketCount) fd.append("ticket_count", editItem.ticketCount);
        if (editItem.ticketInfo) fd.append("ticket_info", editItem.ticketInfo);

        fd.append("payment_mode", uiPaymentModeToApi(editItem.paidMode));
      } else {
        fd.append("price", "");
        fd.append("ticket_count", "");
        fd.append("ticket_info", "");
        fd.append("payment_mode", "");
      }

      editItem.selectedMemberIds.forEach((id) => fd.append("group_members[]", String(id)));

      if (editItem.bannerFile) fd.append("banner", editItem.bannerFile);

      if (editItem.galleryFiles && editItem.galleryFiles.length > 0) {
        editItem.galleryFiles.forEach((file) => fd.append("photos[]", file));
      }

      const res = await axios.post(
        `${API_URL}/admin/group-events/update/${editItem.id}`,
        fd,
        authConfig()
      );

      if (!res.data?.status) {
        toast.error(res.data?.message || "Event update failed.");
        return;
      }

      toast.success("Event updated successfully!");
      await fetchAllEvents();
      closeEdit();
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || "Event update failed.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const askDelete = (ev: EventItem) => {
    setPendingDelete({ id: ev.id, title: ev.title });
    setConfirmDeleteOpen(true);
  };

  const deleteEvent = async (id: string) => {
    if (!API_URL) return;

    try {
      setDeleteLoadingId(id);

      const res = await axios.post(`${API_URL}/admin/group-events/delete/${id}`, {}, authConfig());

      if (!res.data?.status) {
        toast.error(res.data?.message || "Delete failed.");
        return;
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully!");
      setConfirmDeleteOpen(false);
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message || "Delete failed.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-black">
      <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick pauseOnHover draggable />

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          </div>

          <Link
            href="/admin/create-event"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            <FiPlus className="text-base" />
            Create Event
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
            <div className="sm:col-span-8">
              <label className={labelCls}>Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title / city ..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-245 w-full">
              <thead className="bg-black/3">
                <tr className="text-left text-sm font-semibold text-black">
                  <th className="px-4 py-3">Banner</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Date / Time</th>
                  <th className="px-4 py-3">City / State</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
                      <span className="inline-flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Loading events...
                      </span>
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-black/2">
                      <td className="px-4 py-3">
                        <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
                          {e.bannerUrl ? (
                            <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-primary">
                              {e.title?.trim()?.[0]?.toUpperCase() || "M"}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-black/70">
                        <p>{e.startDate}</p>
                        <p className="text-xs text-black/50">{e.time}</p>
                      </td>

                      <td className="px-4 py-3 text-sm text-black/70">
                        <p className="font-medium text-black">{e.cityName}</p>
                        <p className="text-xs text-black/50">{e.stateName}</p>
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {e.paymentType === "free" ? (
                          <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
                            Free
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
                            Paid
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

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(e)}
                            disabled={editLoadingId === e.id}
                            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5 disabled:opacity-60"
                            aria-label="Edit event"
                            title="Edit"
                          >
                            {editLoadingId === e.id ? <Spinner className="h-5 w-5" /> : <FiEdit2 className="text-lg" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => askDelete(e)}
                            disabled={deleteLoadingId === e.id}
                            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                            aria-label="Delete event"
                            title="Delete"
                          >
                            {deleteLoadingId === e.id ? <Spinner className="h-5 w-5" /> : <FiTrash2 className="text-lg" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && filtered.length === 0 ? (
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
          updateLoading={updateLoading}
          states={states}
          apiUrl={API_URL}
          groupMembers={groupMembers}
          loadingMembers={loadingMembers}
          token={getToken()} // ✅ needed for delete-selected API
        />
      ) : null}

      {confirmDeleteOpen && pendingDelete ? (
        <ConfirmDeleteModal
          title={pendingDelete.title}
          loading={deleteLoadingId === pendingDelete.id}
          onCancel={() => {
            if (deleteLoadingId) return;
            setConfirmDeleteOpen(false);
            setPendingDelete(null);
          }}
          onConfirm={() => deleteEvent(pendingDelete.id)}
        />
      ) : null}
    </main>
  );
}

function getTodayLocalYYYYMMDD() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function EditModal({
  item,
  onChange,
  onClose,
  onUpdate,
  updateLoading,
  states,
  apiUrl,
  groupMembers,
  loadingMembers,
  token,
}: {
  item: EventItem;
  onChange: (next: EventItem | null) => void;
  onClose: () => void;
  onUpdate: () => void;
  updateLoading: boolean;
  states: ApiState[];
  apiUrl: string;
  groupMembers: GroupMember[];
  loadingMembers: boolean;
  token: string;
}) {
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // ✅ multi-select existing photo ids
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
  const [deleteSelectedLoading, setDeleteSelectedLoading] = useState(false);

  const existingPhotos = item.photoItems || [];

  useEffect(() => {
    // reset selection when event changes
    setSelectedPhotoIds([]);
  }, [item.id]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !updateLoading && !deleteSelectedLoading) onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose, updateLoading, deleteSelectedLoading]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!item.stateId) {
        setCities([]);
        return;
      }
      try {
        setLoadingCities(true);
        const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: item.stateId });
        if (res.data?.success) setCities(res.data.data || []);
        else setCities([]);
      } catch (e) {
        console.error("City fetch error:", e);
        setCities([]);
        toast.error("Failed to fetch cities.");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [item.stateId, apiUrl]);

  const isPaid = item.paymentType === "paid";
  const today = useMemo(() => getTodayLocalYYYYMMDD(), []);

  const bannerPreview = useMemo(() => {
    if (item.bannerFile) return URL.createObjectURL(item.bannerFile);
    return item.bannerUrl || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.bannerFile, item.bannerUrl]);

  const galleryPreviews = useMemo(() => {
    return (item.galleryFiles || []).map((f) => URL.createObjectURL(f));
  }, [item.galleryFiles]);

  useEffect(() => {
    return () => {
      if (bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
      galleryPreviews.forEach((u) => {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
      });
    };
  }, [bannerPreview, galleryPreviews]);

  const togglePhoto = (id: number) => {
    setSelectedPhotoIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedPhotoIds(existingPhotos.map((p) => p.id));
  const clear = () => setSelectedPhotoIds([]);

  const deleteSelectedPhotos = async () => {
    if (selectedPhotoIds.length === 0) {
      toast.error("Please select photos to delete.");
      return;
    }

    try {
      setDeleteSelectedLoading(true);

      const res = await axios.post(
        `${apiUrl}/events/multiphoto/delete-selected`,
        {
          event_id: Number(item.id),
          photo_ids: selectedPhotoIds,
        },
        {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.data?.status) {
        toast.error(res.data?.message || "Delete failed.");
        return;
      }

      toast.success(res.data?.message || "Selected photos deleted");

      // ✅ remove deleted photos from UI
      const remaining = existingPhotos.filter((p) => !selectedPhotoIds.includes(p.id));
      onChange({
        ...item,
        photoItems: remaining,
        photoUrls: remaining.map((x) => x.url),
      });
      setSelectedPhotoIds([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed.");
    } finally {
      setDeleteSelectedLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !updateLoading && !deleteSelectedLoading) onClose();
      }}
    >
      <div className="relative mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
        <div className="top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
          <div>
            <p className="text-base font-semibold">Edit Event</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updateLoading || deleteSelectedLoading}
            className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5 disabled:opacity-60"
            aria-label="Close"
            title="Close"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left */}
            <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Images</p>

              <div className="mt-3">
                <p className="text-sm font-medium text-black">Banner</p>
                <div className="mt-2 overflow-hidden rounded-xl border border-black/10 bg-black/2">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 w-full flex items-center justify-center text-sm text-black/50">No banner</div>
                  )}
                </div>

                <div className="mt-3">
                  <label className={labelCls}>Change Banner</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`${inputCls} mt-2`}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      onChange({ ...item, bannerFile: f });
                    }}
                  />
                  {item.bannerFile ? (
                    <button
                      type="button"
                      className="mt-2 text-xs text-red-600 underline disabled:opacity-60"
                      disabled={updateLoading || deleteSelectedLoading}
                      onClick={() => onChange({ ...item, bannerFile: null })}
                    >
                      Remove selected banner
                    </button>
                  ) : null}
                </div>
              </div>

              {/* ✅ Existing Gallery Photos with select/delete */}
              <div className="mt-5">
                <p className="text-sm font-medium text-black">Gallery Photos</p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    disabled={updateLoading || deleteSelectedLoading || existingPhotos.length === 0}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/5 disabled:opacity-60"
                  >
                    Select All
                  </button>

                  <button
                    type="button"
                    onClick={clear}
                    disabled={updateLoading || deleteSelectedLoading || selectedPhotoIds.length === 0}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/5 disabled:opacity-60"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={deleteSelectedPhotos}
                    disabled={updateLoading || deleteSelectedLoading || selectedPhotoIds.length === 0}
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {deleteSelectedLoading ? (
                      <>
                        <Spinner className="h-3 w-3" />
                        Deleting...
                      </>
                    ) : (
                      `Delete Selected (${selectedPhotoIds.length})`
                    )}
                  </button>
                </div>

                {existingPhotos.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {existingPhotos.map((p) => {
                      const checked = selectedPhotoIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePhoto(p.id)}
                          disabled={updateLoading || deleteSelectedLoading}
                          className={`relative overflow-hidden rounded-xl border ${checked ? "border-red-400" : "border-black/10"
                            }`}
                          title="Click to select"
                        >
                          <img src={p.url} alt="Photo" className="h-20 w-full object-cover" />
                          <span
                            className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${checked ? "bg-red-600 text-white" : "bg-white/90 text-black"
                              }`}
                          >
                            {checked ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2 rounded-xl border border-dashed border-black/15 p-4 text-center text-sm text-black/60">
                    No gallery photos
                  </div>
                )}

                {/* New Selected Photos (for update) */}
                {galleryPreviews.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-black/70">New Selected Photos</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {galleryPreviews.map((u) => (
                        <div key={u} className="overflow-hidden rounded-xl border border-black/10 bg-black/2">
                          <img src={u} alt="New Photo" className="h-20 w-full object-cover" />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="mt-2 text-xs text-red-600 underline disabled:opacity-60"
                      disabled={updateLoading || deleteSelectedLoading}
                      onClick={() => onChange({ ...item, galleryFiles: [] })}
                    >
                      Remove selected gallery photos
                    </button>
                  </div>
                ) : null}

                <div className="mt-3">
                  <label className={labelCls}>Add Gallery Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={updateLoading || deleteSelectedLoading}
                    className={`${inputCls} mt-2`}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      onChange({ ...item, galleryFiles: files });
                    }}
                  />
                  <p className="mt-2 text-xs text-black/50">(Upload will happen on Update Event)</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Event Details</p>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <label className={labelCls}>
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={item.title}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => onChange({ ...item, title: e.target.value })}
                    className={`${inputCls} mt-2`}
                  />
                </div>

                <div className="lg:col-span-2">
                  <GroupMembersDropdown
                    groupMembers={groupMembers}
                    loadingMembers={loadingMembers}
                    selectedIds={item.selectedMemberIds}
                    onChangeSelected={(next) => onChange({ ...item, selectedMemberIds: next })}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={item.startDate}
                    min={today}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v && v < today) {
                        toast.error("Past dates are not allowed.");
                        onChange({ ...item, startDate: today });
                        return;
                      }
                      onChange({ ...item, startDate: v });
                    }}
                    className={`${inputCls} mt-2`}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={item.time}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => onChange({ ...item, time: e.target.value })}
                    className={`${inputCls} mt-2`}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className={labelCls}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={item.description}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => onChange({ ...item, description: e.target.value })}
                    className={`${inputCls} mt-2 resize-none`}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className={labelCls}>
                    Address / Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={item.address}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => onChange({ ...item, address: e.target.value })}
                    className={`${inputCls} mt-2`}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${inputCls} mt-2`}
                    value={item.stateId}
                    disabled={updateLoading || deleteSelectedLoading}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) {
                        onChange({ ...item, stateId: "", cityId: "", stateName: "", cityName: "" });
                        return;
                      }
                      const sid = Number(v);
                      const sName = states.find((s) => s.stateId === sid)?.stateName || "";
                      onChange({ ...item, stateId: sid, cityId: "", stateName: sName, cityName: "" });
                    }}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.stateId} value={s.stateId}>
                        {s.stateName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${inputCls} mt-2`}
                    value={item.cityId}
                    disabled={!item.stateId || loadingCities || updateLoading || deleteSelectedLoading}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) {
                        onChange({ ...item, cityId: "", cityName: "" });
                        return;
                      }
                      const cid = Number(v);
                      const cName = cities.find((c) => c.id === cid)?.name || "";
                      onChange({ ...item, cityId: cid, cityName: cName });
                    }}
                  >
                    <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing */}
                <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
                  <p className="text-sm font-semibold">Pricing</p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                      <input
                        type="radio"
                        name="paymentTypeEdit"
                        checked={item.paymentType === "free"}
                        disabled={updateLoading || deleteSelectedLoading}
                        onChange={() =>
                          onChange({
                            ...item,
                            paymentType: "free",
                            ticketPrice: "",
                            ticketCount: "",
                            ticketInfo: "",
                            paidMode: "online",
                            onlineInfo: "",
                            offlineInfo: "",
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
                        disabled={updateLoading || deleteSelectedLoading}
                        onChange={() =>
                          onChange({
                            ...item,
                            paymentType: "paid",
                            paidMode: item.paidMode || "online",
                          })
                        }
                      />
                      Paid
                    </label>
                  </div>

                  {isPaid ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className={labelCls}>
                          Ticket Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={item.ticketPrice}
                          disabled={updateLoading || deleteSelectedLoading}
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
                          disabled={updateLoading || deleteSelectedLoading}
                          onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
                          className={`${inputCls} mt-2`}
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className={labelCls}>Ticket Info</label>
                        <textarea
                          rows={3}
                          value={item.ticketInfo}
                          disabled={updateLoading || deleteSelectedLoading}
                          onChange={(e) => onChange({ ...item, ticketInfo: e.target.value })}
                          className={`${inputCls} mt-2 resize-none`}
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className={labelCls}>
                          Payment Mode <span className="text-red-500">*</span>
                        </label>

                        <div className="mt-2 flex flex-wrap gap-3">
                          <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                            <input
                              type="radio"
                              name="paidModeEdit"
                              checked={item.paidMode === "online"}
                              disabled={updateLoading || deleteSelectedLoading}
                              onChange={() => onChange({ ...item, paidMode: "online" })}
                            />
                            Online
                          </label>

                          <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                            <input
                              type="radio"
                              name="paidModeEdit"
                              checked={item.paidMode === "offline"}
                              disabled={updateLoading || deleteSelectedLoading}
                              onChange={() => onChange({ ...item, paidMode: "offline" })}
                            />
                            Offline
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
            disabled={updateLoading || deleteSelectedLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onUpdate}
            disabled={updateLoading || deleteSelectedLoading}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {updateLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Event"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  title,
  loading,
  onCancel,
  onConfirm,
}: {
  title?: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onCancel, loading]);

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden">
        <div className="p-5 border-b border-black/10">
          <p className="text-base font-semibold text-black">Confirm Delete</p>
          <p className="mt-1 text-sm text-black/60">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">{title || "this event"}</span>?
          </p>
        </div>

        <div className="p-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner className="h-4 w-4" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupMembersDropdown({
  groupMembers,
  loadingMembers,
  selectedIds,
  onChangeSelected,
}: {
  groupMembers: GroupMember[];
  loadingMembers: boolean;
  selectedIds: number[];
  onChangeSelected: (next: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return groupMembers;
    return groupMembers.filter((m) => {
      return (
        m.name.toLowerCase().includes(s) ||
        (m.description || "").toLowerCase().includes(s) ||
        String(m.id).includes(s)
      );
    });
  }, [groupMembers, search]);

  const toggle = (id: number) => {
    onChangeSelected(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  return (
    <div className="relative" ref={boxRef}>
      <label className={labelCls}>
        Group Members <span className="text-xs text-black/50">(Optional)</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`${inputCls} mt-2 flex items-center justify-between`}
      >
        <span className="text-sm">
          {selectedIds.length === 0
            ? loadingMembers
              ? "Loading members..."
              : "Select members (optional)"
            : `${selectedIds.length} selected`}
        </span>
        <span className="text-black/50">▾</span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg">
          <div className="p-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member..."
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="max-h-64 overflow-auto p-2">
            {loadingMembers ? (
              <p className="px-3 py-2 text-sm text-black/60">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-black/60">No members found</p>
            ) : (
              filtered.map((m) => {
                const checked = selectedIds.includes(m.id);
                return (
                  <label key={m.id} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 hover:bg-black/5">
                    <input type="checkbox" checked={checked} onChange={() => toggle(m.id)} className="mt-1" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-black/60 line-clamp-1">{m.description}</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-black/10 p-3">
            <button
              type="button"
              onClick={() => onChangeSelected([])}
              className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}

      {selectedIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const mem = groupMembers.find((x) => x.id === id);
            if (!mem) return null;
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm">
                {mem.name}
                <button type="button" className="text-black/60 hover:text-black" onClick={() => toggle(id)}>
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
