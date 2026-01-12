// "use client";

// import { apiUrl } from "@/config";
// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { IoArrowBack } from "react-icons/io5";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";

// const inputCls =
//     "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";
// const helperCls = "text-xs text-black/60";
// type StateType = {
//     stateId: number;
//     stateName: string;
// };

// type CityType = {
//     id: number;
//     name: string;
//     stateid: number;
// };


// export default function CreateEventPage() {
//     // Banner (single)
//     const [bannerFile, setBannerFile] = useState<File | null>(null);
//     const [bannerPreview, setBannerPreview] = useState<string>("");

//     // Show images (multiple)
//     const [showFiles, setShowFiles] = useState<File[]>([]);
//     const [showPreviews, setShowPreviews] = useState<string[]>([]);

//     const [states, setStates] = useState<StateType[]>([]);
//     const [cities, setCities] = useState<CityType[]>([]);

//     const [stateId, setStateId] = useState<number | "">("");
//     const [stateName, setStateName] = useState("");
//     const [city, setCity] = useState("");

//     /** ---------------- FORM STATES ---------------- */
//     const [title, setTitle] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [time, setTime] = useState("");
//     const [description, setDescription] = useState("");
//     const [address, setAddress] = useState("");

//     const [paymentType, setPaymentType] = useState<PaymentType>("free");
//     const [ticketPrice, setTicketPrice] = useState("");
//     const [ticketCount, setTicketCount] = useState("");
//     const [ticketInfo, setTicketInfo] = useState("");
//     const [paidMode, setPaidMode] = useState<PaidMode>("online");
//     const [onlineInfo, setOnlineInfo] = useState("");
//     const [offlineInfo, setOfflineInfo] = useState("");
//     const [cityId, setCityId] = useState<number | "">("");

//     const [error, setError] = useState("");

//     // Banner preview
//     useEffect(() => {
//         if (!bannerFile) {
//             setBannerPreview("");
//             return;
//         }
//         const url = URL.createObjectURL(bannerFile);
//         setBannerPreview(url);
//         return () => URL.revokeObjectURL(url);
//     }, [bannerFile]);

//     // Show images previews
//     useEffect(() => {
//         // cleanup old urls
//         showPreviews.forEach((u) => URL.revokeObjectURL(u));

//         const urls = showFiles.map((f) => URL.createObjectURL(f));
//         setShowPreviews(urls);

//         return () => {
//             urls.forEach((u) => URL.revokeObjectURL(u));
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [showFiles]);

//     // Reset paid fields when switching to free
//     useEffect(() => {
//         if (paymentType === "free") {
//             setTicketPrice("");
//             setTicketCount("");
//             setTicketInfo("");
//             setOnlineInfo("");
//             setOfflineInfo("");
//             setPaidMode("online");
//         }
//     }, [paymentType]);

//     const isPaid = paymentType === "paid";

//     const requiredOk = useMemo(() => {
//         if (!title || !startDate || !time || !description) return false;
//         if (!address || !stateName || !city) return false;

//         if (isPaid) {
//             if (!ticketPrice) return false;
//             if (paidMode === "online" && !onlineInfo) return false;
//             if (paidMode === "offline" && !offlineInfo) return false;
//         }
//         return true;
//     }, [
//         title,
//         startDate,
//         time,
//         description,
//         address,
//         stateName,
//         city,
//         isPaid,
//         ticketPrice,
//         paidMode,
//         onlineInfo,
//         offlineInfo,
//     ]);

//     const onSelectShowImages = (files: FileList | null) => {
//         if (!files) return;
//         const incoming = Array.from(files);
//         const onlyImages = incoming.filter((f) => f.type.startsWith("image/"));
//         setShowFiles((prev) => [...prev, ...onlyImages]);
//     };

//     const removeShowImage = (index: number) => {
//         setShowFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     useEffect(() => {
//         const fetchStates = async () => {
//             try {
//                 const res = await axios.post(
//                     `${apiUrl}/admin/states/list`,
//                     {}
//                 );
//                 if (res.data?.status) {
//                     setStates(res.data.data);
//                 }
//             } catch (err) {
//                 console.error("State fetch error", err);
//             }
//         };
//         fetchStates();
//     }, []);

//     // 🔹 Fetch Cities when State changes
//     useEffect(() => {
//         if (!stateId) return;

//         const fetchCities = async () => {
//             try {
//                 const res = await axios.post(
//                     `${apiUrl}/city-by-state`,
//                     { stateid: stateId }
//                 );
//                 if (res.data?.success) {
//                     setCities(res.data.data);
//                 }
//             } catch (err) {
//                 console.error("City fetch error", err);
//             }
//         };

//         fetchCities();
//         setCity(""); // reset city
//     }, [stateId]);


//     const clearShowImages = () => setShowFiles([]);

//     // const onSubmit = (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     setError("");

//     //     if (!requiredOk) {
//     //         setError("Please fill all required fields.");
//     //         return;
//     //     }

//     //     const formData = new FormData();

//     //     if (bannerFile) formData.append("bannerImage", bannerFile);
//     //     showFiles.forEach((f) => formData.append("showImages", f));

//     //     formData.append("title", title);
//     //     formData.append("startDate", startDate);
//     //     formData.append("time", time);
//     //     formData.append("description", description);

//     //     formData.append("address", address);
//     //     formData.append("state", stateName);
//     //     formData.append("city", city);

//     //     formData.append("paymentType", paymentType);

//     //     if (isPaid) {
//     //         formData.append("ticketPrice", ticketPrice);
//     //         formData.append("ticketCount", ticketCount);
//     //         formData.append("ticketInfo", ticketInfo);
//     //         formData.append("paidMode", paidMode);
//     //         formData.append("onlineInfo", onlineInfo);
//     //         formData.append("offlineInfo", offlineInfo);
//     //     }

//     //     console.log("Create Event Submit:", Object.fromEntries(formData.entries()));
//     //     alert("Dummy submit done (check console).");
//     // };

//     const onSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");

//         // basic validation (adjust if needed)
//         if (!title || !startDate || !time || !description || !address || !stateId || !cityId) {
//             setError("Please fill all required fields.");
//             return;
//         }

//         try {
//             const formData = new FormData();

//             // ✅ EXACT API KEYS (as per screenshot)
//             formData.append("title", title);
//             formData.append("event_date", startDate);
//             formData.append("event_time", time);
//             formData.append("description", description);

//             formData.append("state_id", String(stateId));
//             formData.append("city_id", String(cityId));

//             // screenshot uses "venue" → map your address into venue
//             formData.append("venue", address);

//             // pricing_type in screenshot is "1"
//             // (commonly 1=free, 2=paid — confirm with backend if different)
//             const pricing_type = paymentType === "free" ? "1" : "2";
//             formData.append("pricing_type", pricing_type);

//             // ✅ files
//             if (bannerFile) formData.append("banner", bannerFile);
//             showFiles.forEach((file) => formData.append("photos[]", file));

//             // OPTIONAL: if you have group members
//             // const groupMembers = [2, 4];
//             // groupMembers.forEach((id) => formData.append("group_members[]", String(id)));

//             const res = await axios.post(
//                 `${apiUrl}/admin/group-events/store`,
//                 formData,
//                 {
//                     headers: {
//                         Accept: "application/json",
//                         // If your API requires token, add it here:
//                         // Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (res.data?.status) {
//                 alert(`Event created! event_id = ${res.data.event_id}`);
//                 // reset form if you want
//             } else {
//                 setError(res.data?.message || "Failed to create event.");
//             }
//         } catch (err: any) {
//             console.error("Create event error:", err);
//             setError(err?.response?.data?.message || "Something went wrong.");
//         }
//     };


//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header (dashboard style) */}
//                 <div className="flex items-center justify-between  gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
//                         <p className="text-sm text-black/60">Fill details and publish your show.</p>
//                     </div>
//                     <div className="">
//                         <button
//                             type="button"
//                             onClick={() => window.history.back()}
//                             className="inline-flex p-3 gap-1 items-center justify-center rounded-xl border border-black/10 bg-white text-black hover:bg-black/5"
//                             aria-label="Go back"
//                             title="Back"
//                         >
//                             <IoArrowBack className="text-xl" /> Back
//                         </button>
//                     </div>

//                 </div>

//                 <form onSubmit={onSubmit} className="mt-6 space-y-6">
//                     {/* Row 1: Images + Basic Details */}
//                     <section className="grid gap-6 lg:grid-cols-12">
//                         {/* Images card */}
//                         <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                             <h2 className="text-base font-semibold">Images</h2>
//                             <p className="mt-1 text-sm text-black/60">Add banner and show gallery.</p>

//                             {/* Banner */}
//                             <div className="mt-5">
//                                 <p className={labelCls}>Banner Image</p>

//                                 <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
//                                         className="hidden"
//                                     />

//                                     {!bannerPreview ? (
//                                         <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//                                             <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                                                 <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
//                                                     <path d="M19 7h-1.17l-1.83-2H8L6.17 7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.05l1.83-2h6.24l1.83 2H19a1 1 0 0 1 1 1z" />
//                                                 </svg>
//                                             </div>
//                                             <p className="text-sm font-medium">Upload banner image</p>
//                                             <p className={helperCls}>Click to choose (optional)</p>
//                                         </div>
//                                     ) : (
//                                         <div className="overflow-hidden rounded-xl border border-black/10">
//                                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                                             <img src={bannerPreview} alt="Banner preview" className="h-44 w-full object-cover" />
//                                         </div>
//                                     )}
//                                 </label>

//                                 {bannerPreview ? (
//                                     <button
//                                         type="button"
//                                         onClick={() => setBannerFile(null)}
//                                         className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
//                                     >
//                                         Remove banner
//                                     </button>
//                                 ) : null}
//                             </div>

//                             {/* Show Images (multiple) */}
//                             <div className="mt-6">
//                                 <div className="flex items-center justify-between">
//                                     <p className={labelCls}>Show Images (Multiple)</p>
//                                     {showFiles.length > 0 ? (
//                                         <button
//                                             type="button"
//                                             onClick={clearShowImages}
//                                             className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
//                                         >
//                                             Clear all
//                                         </button>
//                                     ) : null}
//                                 </div>

//                                 <div className="mt-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={(e) => onSelectShowImages(e.target.files)}
//                                         className="block w-full text-sm"
//                                     />
//                                     <p className="mt-2 text-xs text-black/60">You can select multiple images.</p>

//                                     {showPreviews.length > 0 ? (
//                                         <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
//                                             {showPreviews.map((src, i) => (
//                                                 <div key={src} className="relative overflow-hidden rounded-xl border border-black/10 bg-white">
//                                                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                                                     <img src={src} alt={`Show image ${i + 1}`} className="h-24 w-full object-cover" />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removeShowImage(i)}
//                                                         className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
//                                                         aria-label="Remove image"
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="mt-4 rounded-xl border border-dashed border-black/15 p-6 text-center">
//                                             <p className="text-sm text-black/60">No show images selected</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Basic details card */}
//                         <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                             <h2 className="text-base font-semibold">Basic Details</h2>
//                             <p className="mt-1 text-sm text-black/60">Title, date, time and description.</p>

//                             <div className="mt-5 grid gap-4 lg:grid-cols-2">
//                                 <div className="lg:col-span-2">
//                                     <label className={labelCls}>
//                                         Title <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         value={title}
//                                         onChange={(e) => setTitle(e.target.value)}
//                                         placeholder="Enter show title"
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className={labelCls}>
//                                         Start Date <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className={labelCls}>
//                                         Time <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="time"
//                                         value={time}
//                                         onChange={(e) => setTime(e.target.value)}
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="lg:col-span-2">
//                                     <label className={labelCls}>
//                                         Description <span className="text-red-500">*</span>
//                                     </label>
//                                     <textarea
//                                         value={description}
//                                         onChange={(e) => setDescription(e.target.value)}
//                                         placeholder="Write event description..."
//                                         rows={6}
//                                         className={`${inputCls} resize-none`}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Location card */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Location</h2>
//                         <p className="mt-1 text-sm text-black/60">Address, state and city.</p>

//                         <div className="mt-5 grid gap-4 lg:grid-cols-2">
//                             <div className="lg:col-span-2">
//                                 <label className={labelCls}>
//                                     Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={address}
//                                     onChange={(e) => setAddress(e.target.value)}
//                                     placeholder="Enter full address"
//                                     className={inputCls}
//                                     required
//                                 />
//                             </div>

//                             {/* <div>
//                                 <label className={labelCls}>
//                                     State <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={stateName}
//                                     onChange={(e) => setStateName(e.target.value)}
//                                     placeholder="Enter state"
//                                     className={inputCls}
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className={labelCls}>
//                                     City <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={city}
//                                     onChange={(e) => setCity(e.target.value)}
//                                     placeholder="Enter city"
//                                     className={inputCls}
//                                     required
//                                 />
//                             </div> */}
//                             <div>
//                                 <label className={labelCls}>State *</label>
//                                 <select
//                                     className={inputCls}
//                                     value={stateId}
//                                     onChange={(e) => {
//                                         const id = Number(e.target.value);
//                                         setStateId(id);
//                                         const selected = states.find(s => s.stateId === id);
//                                         setStateName(selected?.stateName || "");
//                                     }}
//                                 >
//                                     <option value="">Select State</option>
//                                     {states.map(state => (
//                                         <option key={state.stateId} value={state.stateId}>
//                                             {state.stateName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* CITY */}
//                             <div>
//                                 <label className={labelCls}>City *</label>
//                                 <select
//                                     className={inputCls}
//                                     value={cityId}
//                                     onChange={(e) => setCityId(Number(e.target.value))}
//                                     disabled={!stateId}
//                                 >
//                                     <option value="">Select City</option>
//                                     {cities.map(city => (
//                                         <option key={city.id} value={city.name}>
//                                             {city.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                         </div>
//                     </section>

//                     {/* Pricing card */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Pricing</h2>
//                         <p className="mt-1 text-sm text-black/60">
//                             Select Free / Paid. Agar paid ho to ticket + online/offline open hoga.
//                         </p>

//                         <div className="mt-4 flex flex-wrap gap-3">
//                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                 <input
//                                     type="radio"
//                                     name="paymentType"
//                                     checked={paymentType === "free"}
//                                     onChange={() => setPaymentType("free")}
//                                 />
//                                 Free
//                             </label>

//                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                 <input
//                                     type="radio"
//                                     name="paymentType"
//                                     checked={paymentType === "paid"}
//                                     onChange={() => setPaymentType("paid")}
//                                 />
//                                 Paid
//                             </label>
//                         </div>

//                         {isPaid && (
//                             <div className="mt-5 rounded-2xl border border-black/10 bg-black/2 p-4">
//                                 <div className="grid gap-4 lg:grid-cols-2">
//                                     <div>
//                                         <label className={labelCls}>
//                                             Ticket Price <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={ticketPrice}
//                                             onChange={(e) => setTicketPrice(e.target.value)}
//                                             placeholder="Enter ticket price"
//                                             className={inputCls}
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Ticket Count</label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={ticketCount}
//                                             onChange={(e) => setTicketCount(e.target.value)}
//                                             placeholder="Total available tickets (optional)"
//                                             className={inputCls}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>Ticket Info</label>
//                                         <textarea
//                                             value={ticketInfo}
//                                             onChange={(e) => setTicketInfo(e.target.value)}
//                                             placeholder="Seat info, terms, etc."
//                                             rows={3}
//                                             className={`${inputCls} resize-none`}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>
//                                             Payment Mode <span className="text-red-500">*</span>
//                                         </label>

//                                         <div className="mt-2 flex flex-wrap gap-3">
//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidMode"
//                                                     checked={paidMode === "online"}
//                                                     onChange={() => setPaidMode("online")}
//                                                 />
//                                                 Online
//                                             </label>

//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidMode"
//                                                     checked={paidMode === "offline"}
//                                                     onChange={() => setPaidMode("offline")}
//                                                 />
//                                                 Offline
//                                             </label>
//                                         </div>

//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </section>

//                     {/* Error + Actions (dashboard style) */}
//                     {error ? <p className="text-sm text-red-600">{error}</p> : null}

//                     <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//                         <button
//                             type="button"
//                             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                             onClick={() => window.history.back()}
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={!requiredOk}
//                             className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             Create Event
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </main>
//     );
// }



// "use client";

// import { apiUrl } from "@/config";
// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { IoArrowBack } from "react-icons/io5";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";

// const inputCls =
//     "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";
// const helperCls = "text-xs text-black/60";

// type StateType = {
//     stateId: number;
//     stateName: string;
// };

// type CityType = {
//     id: number;
//     name: string;
//     stateid: number;
// };

// type GroupMember = {
//     id: number;
//     name: string;
//     description: string;
//     photo: string;
//     photo_url: string;
//     created_at: string;
// };

// export default function CreateEventPage() {
//     // Banner (single)
//     const [bannerFile, setBannerFile] = useState<File | null>(null);
//     const [bannerPreview, setBannerPreview] = useState<string>("");

//     // Show images (multiple)
//     const [showFiles, setShowFiles] = useState<File[]>([]);
//     const [showPreviews, setShowPreviews] = useState<string[]>([]);

//     // State/City
//     const [states, setStates] = useState<StateType[]>([]);
//     const [cities, setCities] = useState<CityType[]>([]);
//     const [stateId, setStateId] = useState<number | "">("");
//     const [stateName, setStateName] = useState("");
//     const [cityId, setCityId] = useState<number | "">("");

//     // Group Members (dropdown multi-select)
//     const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
//     const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     /** ---------------- FORM STATES ---------------- */
//     const [title, setTitle] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [time, setTime] = useState("");
//     const [description, setDescription] = useState("");
//     const [address, setAddress] = useState("");

//     const [paymentType, setPaymentType] = useState<PaymentType>("free");
//     const [ticketPrice, setTicketPrice] = useState("");
//     const [ticketCount, setTicketCount] = useState("");
//     const [ticketInfo, setTicketInfo] = useState("");
//     const [paidMode, setPaidMode] = useState<PaidMode>("online");
//     const [onlineInfo, setOnlineInfo] = useState("");
//     const [offlineInfo, setOfflineInfo] = useState("");

//     const [error, setError] = useState("");

//     const isPaid = paymentType === "paid";

//     const getToken = () => {
//         // ✅ change this key if your token key is different
//         if (typeof window === "undefined") return "";
//         return localStorage.getItem("token") || "";
//     };

//     // Banner preview
//     useEffect(() => {
//         if (!bannerFile) {
//             setBannerPreview("");
//             return;
//         }
//         const url = URL.createObjectURL(bannerFile);
//         setBannerPreview(url);
//         return () => URL.revokeObjectURL(url);
//     }, [bannerFile]);

//     // Show images previews
//     useEffect(() => {
//         showPreviews.forEach((u) => URL.revokeObjectURL(u));
//         const urls = showFiles.map((f) => URL.createObjectURL(f));
//         setShowPreviews(urls);
//         return () => urls.forEach((u) => URL.revokeObjectURL(u));
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [showFiles]);

//     // Reset paid fields when switching to free
//     useEffect(() => {
//         if (paymentType === "free") {
//             setTicketPrice("");
//             setTicketCount("");
//             setTicketInfo("");
//             setOnlineInfo("");
//             setOfflineInfo("");
//             setPaidMode("online");
//         }
//     }, [paymentType]);

//     const requiredOk = useMemo(() => {
//         if (!title || !startDate || !time || !description) return false;
//         if (!address || !stateId || !cityId) return false;
//         if (selectedMemberIds.length === 0) return false;

//         if (isPaid) {
//             if (!ticketPrice) return false;
//             if (paidMode === "online" && !onlineInfo) return false;
//             if (paidMode === "offline" && !offlineInfo) return false;
//         }
//         return true;
//     }, [
//         title,
//         startDate,
//         time,
//         description,
//         address,
//         stateId,
//         cityId,
//         selectedMemberIds,
//         isPaid,
//         ticketPrice,
//         paidMode,
//         onlineInfo,
//         offlineInfo,
//     ]);

//     const onSelectShowImages = (files: FileList | null) => {
//         if (!files) return;
//         const incoming = Array.from(files);
//         const onlyImages = incoming.filter((f) => f.type.startsWith("image/"));
//         setShowFiles((prev) => [...prev, ...onlyImages]);
//     };

//     const removeShowImage = (index: number) => {
//         setShowFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     const clearShowImages = () => setShowFiles([]);

//     // ✅ Fetch States
//     useEffect(() => {
//         const fetchStates = async () => {
//             try {
//                 const res = await axios.post(`${apiUrl}/admin/states/list`, {});
//                 if (res.data?.status) setStates(res.data.data || []);
//             } catch (err) {
//                 console.error("State fetch error", err);
//             }
//         };
//         fetchStates();
//     }, []);

//     // ✅ Fetch Cities when State changes
//     useEffect(() => {
//         const fetchCities = async () => {
//             if (!stateId) return;

//             try {
//                 const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: stateId });
//                 if (res.data?.success) setCities(res.data.data || []);
//             } catch (err) {
//                 console.error("City fetch error", err);
//             }
//         };

//         // reset city when state changes
//         setCityId("");
//         setCities([]);

//         if (stateId) fetchCities();
//     }, [stateId]);

//     // ✅ Fetch Group Members (POST with Token)
//     useEffect(() => {
//         const fetchGroupMembers = async () => {
//             try {
//                 setLoadingMembers(true);
//                 const token = getToken();
//                 if (!token) {
//                     setGroupMembers([]);
//                     return;
//                 }

//                 const res = await axios.post(
//                     `${apiUrl}/admin/group-members`, // 👈 as per your API doc
//                     { headers: { Accept: "application/json" } }
//                 );

//                 if (res.data?.status) {
//                     setGroupMembers(res.data.data || []);
//                 } else {
//                     setGroupMembers([]);
//                 }
//             } catch (err) {
//                 console.error("Group members fetch error:", err);
//                 setGroupMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         fetchGroupMembers();
//     }, []);

//     // ✅ STORE API submit
//     const onSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");

//         if (!requiredOk) {
//             setError("Please fill all required fields.");
//             return;
//         }

//         try {
//             const formData = new FormData();

//             // ✅ EXACT API KEYS (store)
//             formData.append("title", title);
//             formData.append("event_date", startDate);
//             formData.append("event_time", time);
//             formData.append("description", description);

//             formData.append("state_id", String(stateId));
//             formData.append("city_id", String(cityId));

//             // map your address to "venue"
//             formData.append("venue", address);

//             // pricing_type: 1=free, 2=paid (adjust if backend differs)
//             const pricing_type = paymentType === "free" ? "1" : "2";
//             formData.append("pricing_type", pricing_type);

//             // ✅ files
//             if (bannerFile) formData.append("banner", bannerFile);
//             showFiles.forEach((file) => formData.append("photos[]", file));

//             // ✅ group members multiple
//             selectedMemberIds.forEach((id) => formData.append("group_members[]", String(id)));

//             // OPTIONAL: if your store API needs token in header
//             // const token = getToken();

//             const res = await axios.post(`${apiUrl}/admin/group-events/store`, formData, {
//                 headers: {
//                     Accept: "application/json",
//                     // Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (res.data?.status) {
//                 alert(`Event created successfully! event_id = ${res.data.event_id}`);

//                 // reset form (optional)
//                 setTitle("");
//                 setStartDate("");
//                 setTime("");
//                 setDescription("");
//                 setAddress("");
//                 setPaymentType("free");
//                 setBannerFile(null);
//                 setShowFiles([]);
//                 setStateId("");
//                 setStateName("");
//                 setCityId("");
//                 setSelectedMemberIds([]);
//             } else {
//                 setError(res.data?.message || "Failed to create event.");
//             }
//         } catch (err: any) {
//             console.error("Create event error:", err);
//             setError(err?.response?.data?.message || "Something went wrong.");
//         }
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header */}
//                 <div className="flex items-center justify-between gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
//                         <p className="text-sm text-black/60">Fill details and publish your show.</p>
//                     </div>
//                     <div>
//                         <button
//                             type="button"
//                             onClick={() => window.history.back()}
//                             className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/10 bg-white p-3 text-black hover:bg-black/5"
//                             aria-label="Go back"
//                             title="Back"
//                         >
//                             <IoArrowBack className="text-xl" /> Back
//                         </button>
//                     </div>
//                 </div>

//                 <form onSubmit={onSubmit} className="mt-6 space-y-6">
//                     {/* Row 1: Images + Basic Details */}
//                     <section className="grid gap-6 lg:grid-cols-12">
//                         {/* Images card */}
//                         <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                             <h2 className="text-base font-semibold">Images</h2>
//                             <p className="mt-1 text-sm text-black/60">Add banner and show gallery.</p>

//                             {/* Banner */}
//                             <div className="mt-5">
//                                 <p className={labelCls}>Banner Image</p>

//                                 <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
//                                         className="hidden"
//                                     />

//                                     {!bannerPreview ? (
//                                         <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//                                             <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                                                 <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
//                                                     <path d="M19 7h-1.17l-1.83-2H8L6.17 7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.05l1.83-2h6.24l1.83 2H19a1 1 0 0 1 1 1z" />
//                                                 </svg>
//                                             </div>
//                                             <p className="text-sm font-medium">Upload banner image</p>
//                                             <p className={helperCls}>Click to choose (optional)</p>
//                                         </div>
//                                     ) : (
//                                         <div className="overflow-hidden rounded-xl border border-black/10">
//                                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                                             <img src={bannerPreview} alt="Banner preview" className="h-44 w-full object-cover" />
//                                         </div>
//                                     )}
//                                 </label>

//                                 {bannerPreview ? (
//                                     <button
//                                         type="button"
//                                         onClick={() => setBannerFile(null)}
//                                         className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
//                                     >
//                                         Remove banner
//                                     </button>
//                                 ) : null}
//                             </div>

//                             {/* Show Images (multiple) */}
//                             <div className="mt-6">
//                                 <div className="flex items-center justify-between">
//                                     <p className={labelCls}>Show Images (Multiple)</p>
//                                     {showFiles.length > 0 ? (
//                                         <button
//                                             type="button"
//                                             onClick={clearShowImages}
//                                             className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
//                                         >
//                                             Clear all
//                                         </button>
//                                     ) : null}
//                                 </div>

//                                 <div className="mt-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={(e) => onSelectShowImages(e.target.files)}
//                                         className="block w-full text-sm"
//                                     />
//                                     <p className="mt-2 text-xs text-black/60">You can select multiple images.</p>

//                                     {showPreviews.length > 0 ? (
//                                         <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
//                                             {showPreviews.map((src, i) => (
//                                                 <div
//                                                     key={src}
//                                                     className="relative overflow-hidden rounded-xl border border-black/10 bg-white"
//                                                 >
//                                                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                                                     <img src={src} alt={`Show image ${i + 1}`} className="h-24 w-full object-cover" />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removeShowImage(i)}
//                                                         className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
//                                                         aria-label="Remove image"
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="mt-4 rounded-xl border border-dashed border-black/15 p-6 text-center">
//                                             <p className="text-sm text-black/60">No show images selected</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Basic details card */}
//                         <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                             <h2 className="text-base font-semibold">Basic Details</h2>
//                             <p className="mt-1 text-sm text-black/60">Title, date, time and description.</p>

//                             <div className="mt-5 grid gap-4 lg:grid-cols-2">
//                                 <div className="lg:col-span-2">
//                                     <label className={labelCls}>
//                                         Title <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         value={title}
//                                         onChange={(e) => setTitle(e.target.value)}
//                                         placeholder="Enter show title"
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className={labelCls}>
//                                         Start Date <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className={labelCls}>
//                                         Time <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="time"
//                                         value={time}
//                                         onChange={(e) => setTime(e.target.value)}
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="lg:col-span-2">
//                                     <label className={labelCls}>
//                                         Description <span className="text-red-500">*</span>
//                                     </label>
//                                     <textarea
//                                         value={description}
//                                         onChange={(e) => setDescription(e.target.value)}
//                                         placeholder="Write event description..."
//                                         rows={6}
//                                         className={`${inputCls} resize-none`}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Location card */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Location</h2>
//                         <p className="mt-1 text-sm text-black/60">Address, state and city.</p>

//                         <div className="mt-5 grid gap-4 lg:grid-cols-2">
//                             <div className="lg:col-span-2">
//                                 <label className={labelCls}>
//                                     Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={address}
//                                     onChange={(e) => setAddress(e.target.value)}
//                                     placeholder="Enter full address"
//                                     className={inputCls}
//                                     required
//                                 />
//                             </div>

//                             {/* STATE */}
//                             <div>
//                                 <label className={labelCls}>State *</label>
//                                 <select
//                                     className={inputCls}
//                                     value={stateId}
//                                     onChange={(e) => {
//                                         const v = e.target.value;
//                                         if (!v) {
//                                             setStateId("");
//                                             setStateName("");
//                                             return;
//                                         }
//                                         const id = Number(v);
//                                         setStateId(id);
//                                         const selected = states.find((s) => s.stateId === id);
//                                         setStateName(selected?.stateName || "");
//                                     }}
//                                 >
//                                     <option value="">Select State</option>
//                                     {states.map((s) => (
//                                         <option key={s.stateId} value={s.stateId}>
//                                             {s.stateName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* CITY */}
//                             <div>
//                                 <label className={labelCls}>City *</label>
//                                 <select
//                                     className={inputCls}
//                                     value={cityId}
//                                     onChange={(e) => {
//                                         const v = e.target.value;
//                                         setCityId(v ? Number(v) : "");
//                                     }}
//                                     disabled={!stateId}
//                                 >
//                                     <option value="">Select City</option>
//                                     {cities.map((c) => (
//                                         // ✅ IMPORTANT: value must be ID
//                                         <option key={c.id} value={c.id}>
//                                             {c.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     </section>

//                     {/* ✅ Group Members card */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Group Members</h2>
//                         <p className="mt-1 text-sm text-black/60">Select multiple members to add in this event.</p>

//                         <div className="mt-4">
//                             <label className={labelCls}>
//                                 Select Members <span className="text-red-500">*</span>
//                             </label>

//                             <select
//                                 multiple
//                                 className={`${inputCls} h-44`}
//                                 value={selectedMemberIds.map(String)}
//                                 onChange={(e) => {
//                                     const ids = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
//                                     setSelectedMemberIds(ids);
//                                 }}
//                                 disabled={loadingMembers}
//                             >
//                                 {loadingMembers ? (
//                                     <option>Loading...</option>
//                                 ) : groupMembers.length === 0 ? (
//                                     <option>No members found</option>
//                                 ) : (
//                                     groupMembers.map((m) => (
//                                         <option key={m.id} value={m.id}>
//                                             {m.name} ({m.description})
//                                         </option>
//                                     ))
//                                 )}
//                             </select>

//                             {/* Selected chips */}
//                             {selectedMemberIds.length > 0 && (
//                                 <div className="mt-3 flex flex-wrap gap-2">
//                                     {selectedMemberIds.map((id) => {
//                                         const mem = groupMembers.find((x) => x.id === id);
//                                         if (!mem) return null;
//                                         return (
//                                             <span
//                                                 key={id}
//                                                 className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm"
//                                             >
//                                                 {mem.name}
//                                                 <button
//                                                     type="button"
//                                                     className="text-black/60 hover:text-black"
//                                                     onClick={() => setSelectedMemberIds((prev) => prev.filter((x) => x !== id))}
//                                                 >
//                                                     ✕
//                                                 </button>
//                                             </span>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </div>
//                     </section>

//                     {/* Pricing card */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Pricing</h2>
//                         <p className="mt-1 text-sm text-black/60">
//                             Select Free / Paid. Agar paid ho to ticket + online/offline open hoga.
//                         </p>

//                         <div className="mt-4 flex flex-wrap gap-3">
//                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                 <input
//                                     type="radio"
//                                     name="paymentType"
//                                     checked={paymentType === "free"}
//                                     onChange={() => setPaymentType("free")}
//                                 />
//                                 Free
//                             </label>

//                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                 <input
//                                     type="radio"
//                                     name="paymentType"
//                                     checked={paymentType === "paid"}
//                                     onChange={() => setPaymentType("paid")}
//                                 />
//                                 Paid
//                             </label>
//                         </div>

//                         {isPaid && (
//                             <div className="mt-5 rounded-2xl border border-black/10 bg-black/2 p-4">
//                                 <div className="grid gap-4 lg:grid-cols-2">
//                                     <div>
//                                         <label className={labelCls}>
//                                             Ticket Price <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={ticketPrice}
//                                             onChange={(e) => setTicketPrice(e.target.value)}
//                                             placeholder="Enter ticket price"
//                                             className={inputCls}
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Ticket Count</label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={ticketCount}
//                                             onChange={(e) => setTicketCount(e.target.value)}
//                                             placeholder="Total available tickets (optional)"
//                                             className={inputCls}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>Ticket Info</label>
//                                         <textarea
//                                             value={ticketInfo}
//                                             onChange={(e) => setTicketInfo(e.target.value)}
//                                             placeholder="Seat info, terms, etc."
//                                             rows={3}
//                                             className={`${inputCls} resize-none`}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>
//                                             Payment Mode <span className="text-red-500">*</span>
//                                         </label>

//                                         <div className="mt-2 flex flex-wrap gap-3">
//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidMode"
//                                                     checked={paidMode === "online"}
//                                                     onChange={() => setPaidMode("online")}
//                                                 />
//                                                 Online
//                                             </label>

//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidMode"
//                                                     checked={paidMode === "offline"}
//                                                     onChange={() => setPaidMode("offline")}
//                                                 />
//                                                 Offline
//                                             </label>
//                                         </div>


//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </section>

//                     {/* Error + Actions */}
//                     {error ? <p className="text-sm text-red-600">{error}</p> : null}

//                     <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//                         <button
//                             type="button"
//                             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                             onClick={() => window.history.back()}
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={!requiredOk}
//                             className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             Create Event
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </main>
//     );
// }



// "use client";

// import { apiUrl } from "@/config";
// import axios from "axios";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { IoArrowBack } from "react-icons/io5";

// type PaymentType = "free" | "paid";
// type PaidMode = "online" | "offline";

// const inputCls =
//     "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";
// const helperCls = "text-xs text-black/60";

// type StateType = {
//     stateId: number;
//     stateName: string;
// };

// type CityType = {
//     id: number;
//     name: string;
//     stateid: number;
// };

// type GroupMember = {
//     id: number;
//     name: string;
//     description: string;
//     photo: string;
//     photo_url: string;
//     created_at: string;
// };

// export default function CreateEventPage() {
//     // Banner (single)
//     const [bannerFile, setBannerFile] = useState<File | null>(null);
//     const [bannerPreview, setBannerPreview] = useState<string>("");

//     // Show images (multiple)
//     const [showFiles, setShowFiles] = useState<File[]>([]);
//     const [showPreviews, setShowPreviews] = useState<string[]>([]);

//     // State/City
//     const [states, setStates] = useState<StateType[]>([]);
//     const [cities, setCities] = useState<CityType[]>([]);
//     const [stateId, setStateId] = useState<number | "">("");
//     const [stateName, setStateName] = useState("");
//     const [cityId, setCityId] = useState<number | "">("");

//     // Group Members
//     const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
//     const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     // Dropdown state
//     const [membersOpen, setMembersOpen] = useState(false);
//     const [memberSearch, setMemberSearch] = useState("");
//     const membersBoxRef = useRef<HTMLDivElement | null>(null);

//     /** ---------------- FORM STATES ---------------- */
//     const [title, setTitle] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [time, setTime] = useState("");
//     const [description, setDescription] = useState("");
//     const [address, setAddress] = useState("");

//     const [paymentType, setPaymentType] = useState<PaymentType>("free");
//     const [ticketPrice, setTicketPrice] = useState("");
//     const [ticketCount, setTicketCount] = useState("");
//     const [ticketInfo, setTicketInfo] = useState("");
//     const [paidMode, setPaidMode] = useState<PaidMode>("online");
//     const [onlineInfo, setOnlineInfo] = useState("");
//     const [offlineInfo, setOfflineInfo] = useState("");

//     const [error, setError] = useState("");

//     const isPaid = paymentType === "paid";

//     const getToken = () => {
//         if (typeof window === "undefined") return "";
//         return (
//             localStorage.getItem("token") ||
//             localStorage.getItem("access_token") ||
//             localStorage.getItem("adminToken") ||
//             ""
//         );
//     };

//     // Close dropdown on outside click
//     useEffect(() => {
//         const onDocClick = (e: MouseEvent) => {
//             if (!membersBoxRef.current) return;
//             if (!membersBoxRef.current.contains(e.target as Node)) {
//                 setMembersOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", onDocClick);
//         return () => document.removeEventListener("mousedown", onDocClick);
//     }, []);

//     // Banner preview
//     useEffect(() => {
//         if (!bannerFile) {
//             setBannerPreview("");
//             return;
//         }
//         const url = URL.createObjectURL(bannerFile);
//         setBannerPreview(url);
//         return () => URL.revokeObjectURL(url);
//     }, [bannerFile]);

//     // Show images previews
//     useEffect(() => {
//         showPreviews.forEach((u) => URL.revokeObjectURL(u));
//         const urls = showFiles.map((f) => URL.createObjectURL(f));
//         setShowPreviews(urls);
//         return () => urls.forEach((u) => URL.revokeObjectURL(u));
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [showFiles]);

//     // Reset paid fields when switching to free
//     useEffect(() => {
//         if (paymentType === "free") {
//             setTicketPrice("");
//             setTicketCount("");
//             setTicketInfo("");
//             setOnlineInfo("");
//             setOfflineInfo("");
//             setPaidMode("online");
//         }
//     }, [paymentType]);

//     const requiredOk = useMemo(() => {
//         if (!title || !startDate || !time || !description) return false;
//         if (!address || !stateId || !cityId) return false;
//         if (selectedMemberIds.length === 0) return false;

//         if (isPaid) {
//             if (!ticketPrice) return false;
//             if (paidMode === "online" && !onlineInfo) return false;
//             if (paidMode === "offline" && !offlineInfo) return false;
//         }
//         return true;
//     }, [
//         title,
//         startDate,
//         time,
//         description,
//         address,
//         stateId,
//         cityId,
//         selectedMemberIds,
//         isPaid,
//         ticketPrice,
//         paidMode,
//         onlineInfo,
//         offlineInfo,
//     ]);

//     const onSelectShowImages = (files: FileList | null) => {
//         if (!files) return;
//         const incoming = Array.from(files);
//         const onlyImages = incoming.filter((f) => f.type.startsWith("image/"));
//         setShowFiles((prev) => [...prev, ...onlyImages]);
//     };

//     const removeShowImage = (index: number) => {
//         setShowFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     const clearShowImages = () => setShowFiles([]);

//     // ✅ Fetch States
//     useEffect(() => {
//         const fetchStates = async () => {
//             try {
//                 const res = await axios.post(`${apiUrl}/admin/states/list`, {});
//                 if (res.data?.status) setStates(res.data.data || []);
//             } catch (err) {
//                 console.error("State fetch error", err);
//             }
//         };
//         fetchStates();
//     }, []);

//     // ✅ Fetch Cities when State changes
//     useEffect(() => {
//         const fetchCities = async () => {
//             if (!stateId) return;

//             try {
//                 const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: stateId });
//                 if (res.data?.success) setCities(res.data.data || []);
//             } catch (err) {
//                 console.error("City fetch error", err);
//             }
//         };

//         setCityId("");
//         setCities([]);

//         if (stateId) fetchCities();
//     }, [stateId]);

//     // ✅ Fetch Group Members (FIXED CALL)
//     useEffect(() => {
//         const fetchGroupMembers = async () => {
//             try {
//                 setLoadingMembers(true);
//                 const token = getToken();

//                 if (!token) {
//                     setGroupMembers([]);
//                     return;
//                 }

//                 const res = await axios.post(
//                     `${apiUrl}/admin/group-members`,
//                     {},
//                     {
//                         headers: {
//                             Accept: "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (res.data?.status) {
//                     setGroupMembers(res.data.data || []);
//                 } else {
//                     setGroupMembers([]);
//                 }
//             } catch (err) {
//                 console.error("Group members fetch error:", err);
//                 setGroupMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         fetchGroupMembers();
//     }, []);

//     const toggleMember = (id: number) => {
//         setSelectedMemberIds((prev) => {
//             if (prev.includes(id)) return prev.filter((x) => x !== id);
//             return [...prev, id];
//         });
//     };

//     const filteredMembers = useMemo(() => {
//         const s = memberSearch.trim().toLowerCase();
//         if (!s) return groupMembers;
//         return groupMembers.filter((m) => {
//             return (
//                 m.name.toLowerCase().includes(s) ||
//                 (m.description || "").toLowerCase().includes(s) ||
//                 String(m.id).includes(s)
//             );
//         });
//     }, [groupMembers, memberSearch]);

//     // ✅ STORE API submit
//     const onSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");

//         if (!requiredOk) {
//             setError("Please fill all required fields.");
//             return;
//         }

//         try {
//             const formData = new FormData();

//             formData.append("title", title);
//             formData.append("event_date", startDate);
//             formData.append("event_time", time);
//             formData.append("description", description);

//             formData.append("state_id", String(stateId));
//             formData.append("city_id", String(cityId));
//             formData.append("venue", address);

//             const pricing_type = paymentType === "free" ? "1" : "2";
//             formData.append("pricing_type", pricing_type);

//             if (bannerFile) formData.append("banner", bannerFile);
//             showFiles.forEach((file) => formData.append("photos[]", file));

//             selectedMemberIds.forEach((id) => formData.append("group_members[]", String(id)));

//             // ✅ if store also needs token (admin API usually needs)
//             const token = getToken();

//             const res = await axios.post(`${apiUrl}/admin/group-events/store`, formData, {
//                 headers: {
//                     Accept: "application/json",
//                     Authorization: token ? `Bearer ${token}` : "",
//                 },
//             });

//             if (res.data?.status) {
//                 alert(`Event created successfully! event_id = ${res.data.event_id}`);

//                 setTitle("");
//                 setStartDate("");
//                 setTime("");
//                 setDescription("");
//                 setAddress("");
//                 setPaymentType("free");
//                 setBannerFile(null);
//                 setShowFiles([]);
//                 setStateId("");
//                 setStateName("");
//                 setCityId("");
//                 setSelectedMemberIds([]);
//                 setMemberSearch("");
//                 setMembersOpen(false);
//             } else {
//                 setError(res.data?.message || "Failed to create event.");
//             }
//         } catch (err: any) {
//             console.error("Create event error:", err);
//             setError(err?.response?.data?.message || "Something went wrong.");
//         }
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header */}
//                 <div className="flex items-center justify-between gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
//                         <p className="text-sm text-black/60">Fill details and publish your show.</p>
//                     </div>
//                     <div>
//                         <button
//                             type="button"
//                             onClick={() => window.history.back()}
//                             className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/10 bg-white p-3 text-black hover:bg-black/5"
//                             aria-label="Go back"
//                             title="Back"
//                         >
//                             <IoArrowBack className="text-xl" /> Back
//                         </button>
//                     </div>
//                 </div>

//                 <form onSubmit={onSubmit} className="mt-6 space-y-6">
//                     {/* Row 1: Images + Basic Details */}
//                     <section className="grid gap-6 lg:grid-cols-12">
//                         {/* Images card */}
//                         <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                             <h2 className="text-base font-semibold">Images</h2>
//                             <p className="mt-1 text-sm text-black/60">Add banner and show gallery.</p>

//                             {/* Banner */}
//                             <div className="mt-5">
//                                 <p className={labelCls}>Banner Image</p>

//                                 <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
//                                         className="hidden"
//                                     />

//                                     {!bannerPreview ? (
//                                         <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//                                             <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                                                 <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
//                                                     <path d="M19 7h-1.17l-1.83-2H8L6.17 7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.05l1.83-2h6.24l1.83 2H19a1 1 0 0 1 1 1z" />
//                                                 </svg>
//                                             </div>
//                                             <p className="text-sm font-medium">Upload banner image</p>
//                                             <p className={helperCls}>Click to choose (optional)</p>
//                                         </div>
//                                     ) : (
//                                         <div className="overflow-hidden rounded-xl border border-black/10">
//                                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                                             <img src={bannerPreview} alt="Banner preview" className="h-44 w-full object-cover" />
//                                         </div>
//                                     )}
//                                 </label>

//                                 {bannerPreview ? (
//                                     <button
//                                         type="button"
//                                         onClick={() => setBannerFile(null)}
//                                         className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
//                                     >
//                                         Remove banner
//                                     </button>
//                                 ) : null}
//                             </div>

//                             {/* Show Images */}
//                             <div className="mt-6">
//                                 <div className="flex items-center justify-between">
//                                     <p className={labelCls}>Show Images (Multiple)</p>
//                                     {showFiles.length > 0 ? (
//                                         <button
//                                             type="button"
//                                             onClick={clearShowImages}
//                                             className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
//                                         >
//                                             Clear all
//                                         </button>
//                                     ) : null}
//                                 </div>

//                                 <div className="mt-2 rounded-2xl border border-black/10 bg-black/2 p-4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={(e) => onSelectShowImages(e.target.files)}
//                                         className="block w-full text-sm"
//                                     />
//                                     <p className="mt-2 text-xs text-black/60">You can select multiple images.</p>

//                                     {showPreviews.length > 0 ? (
//                                         <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
//                                             {showPreviews.map((src, i) => (
//                                                 <div key={src} className="relative overflow-hidden rounded-xl border border-black/10 bg-white">
//                                                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                                                     <img src={src} alt={`Show image ${i + 1}`} className="h-24 w-full object-cover" />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removeShowImage(i)}
//                                                         className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
//                                                         aria-label="Remove image"
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <div className="mt-4 rounded-xl border border-dashed border-black/15 p-6 text-center">
//                                             <p className="text-sm text-black/60">No show images selected</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Basic details card */}
//                         <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                             <h2 className="text-base font-semibold">Basic Details</h2>
//                             <p className="mt-1 text-sm text-black/60">Title, members, date, time and description.</p>

//                             {/* ✅ Title + Group Members Dropdown Row */}
//                             <div className="mt-5 grid gap-4 lg:grid-cols-12">
//                                 {/* Title */}
//                                 <div className="lg:col-span-7">
//                                     <label className={labelCls}>
//                                         Title <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         value={title}
//                                         onChange={(e) => setTitle(e.target.value)}
//                                         placeholder="Enter show title"
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 {/* ✅ Group Members dropdown (right side of title) */}
//                                 <div className="lg:col-span-5" ref={membersBoxRef}>
//                                     <label className={labelCls}>
//                                         Group Members <span className="text-red-500">*</span>
//                                     </label>

//                                     <button
//                                         type="button"
//                                         onClick={() => setMembersOpen((p) => !p)}
//                                         className={`${inputCls} flex items-center justify-between`}
//                                     >
//                                         <span className="text-sm">
//                                             {selectedMemberIds.length === 0
//                                                 ? loadingMembers
//                                                     ? "Loading members..."
//                                                     : "Select members"
//                                                 : `${selectedMemberIds.length} selected`}
//                                         </span>
//                                         <span className="text-black/50">▾</span>
//                                     </button>

//                                     {membersOpen ? (
//                                         <div className="relative">
//                                             <div className="absolute z-50 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg">
//                                                 <div className="p-3">
//                                                     <input
//                                                         value={memberSearch}
//                                                         onChange={(e) => setMemberSearch(e.target.value)}
//                                                         placeholder="Search member..."
//                                                         className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
//                                                     />
//                                                 </div>

//                                                 <div className="max-h-64 overflow-auto p-2">
//                                                     {loadingMembers ? (
//                                                         <p className="px-3 py-2 text-sm text-black/60">Loading...</p>
//                                                     ) : filteredMembers.length === 0 ? (
//                                                         <p className="px-3 py-2 text-sm text-black/60">No members found</p>
//                                                     ) : (
//                                                         filteredMembers.map((m) => {
//                                                             const checked = selectedMemberIds.includes(m.id);
//                                                             return (
//                                                                 <label
//                                                                     key={m.id}
//                                                                     className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 hover:bg-black/5"
//                                                                 >
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         checked={checked}
//                                                                         onChange={() => toggleMember(m.id)}
//                                                                         className="mt-1"
//                                                                     />
//                                                                     <div className="min-w-0">
//                                                                         <p className="text-sm font-medium">{m.name}</p>
//                                                                         <p className="text-xs text-black/60 line-clamp-1">{m.description}</p>
//                                                                     </div>
//                                                                 </label>
//                                                             );
//                                                         })
//                                                     )}
//                                                 </div>

//                                                 <div className="flex items-center justify-between border-t border-black/10 p-3">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setSelectedMemberIds([])}
//                                                         className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
//                                                     >
//                                                         Clear
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setMembersOpen(false)}
//                                                         className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
//                                                     >
//                                                         Done
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ) : null}

//                                     {/* Selected chips */}
//                                     {selectedMemberIds.length > 0 ? (
//                                         <div className="mt-3 flex flex-wrap gap-2">
//                                             {selectedMemberIds.map((id) => {
//                                                 const mem = groupMembers.find((x) => x.id === id);
//                                                 if (!mem) return null;
//                                                 return (
//                                                     <span
//                                                         key={id}
//                                                         className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm"
//                                                     >
//                                                         {mem.name}
//                                                         <button
//                                                             type="button"
//                                                             className="text-black/60 hover:text-black"
//                                                             onClick={() => setSelectedMemberIds((prev) => prev.filter((x) => x !== id))}
//                                                         >
//                                                             ✕
//                                                         </button>
//                                                     </span>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : null}
//                                 </div>

//                                 {/* Date */}
//                                 <div className="lg:col-span-6">
//                                     <label className={labelCls}>
//                                         Start Date <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 {/* Time */}
//                                 <div className="lg:col-span-6">
//                                     <label className={labelCls}>
//                                         Time <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="time"
//                                         value={time}
//                                         onChange={(e) => setTime(e.target.value)}
//                                         className={inputCls}
//                                         required
//                                     />
//                                 </div>

//                                 {/* Description */}
//                                 <div className="lg:col-span-12">
//                                     <label className={labelCls}>
//                                         Description <span className="text-red-500">*</span>
//                                     </label>
//                                     <textarea
//                                         value={description}
//                                         onChange={(e) => setDescription(e.target.value)}
//                                         placeholder="Write event description..."
//                                         rows={6}
//                                         className={`${inputCls} resize-none`}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Location card */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Location</h2>
//                         <p className="mt-1 text-sm text-black/60">Address, state and city.</p>

//                         <div className="mt-5 grid gap-4 lg:grid-cols-2">
//                             <div className="lg:col-span-2">
//                                 <label className={labelCls}>
//                                     Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={address}
//                                     onChange={(e) => setAddress(e.target.value)}
//                                     placeholder="Enter full address"
//                                     className={inputCls}
//                                     required
//                                 />
//                             </div>

//                             {/* STATE */}
//                             <div>
//                                 <label className={labelCls}>State *</label>
//                                 <select
//                                     className={inputCls}
//                                     value={stateId}
//                                     onChange={(e) => {
//                                         const v = e.target.value;
//                                         if (!v) {
//                                             setStateId("");
//                                             setStateName("");
//                                             return;
//                                         }
//                                         const id = Number(v);
//                                         setStateId(id);
//                                         const selected = states.find((s) => s.stateId === id);
//                                         setStateName(selected?.stateName || "");
//                                     }}
//                                 >
//                                     <option value="">Select State</option>
//                                     {states.map((s) => (
//                                         <option key={s.stateId} value={s.stateId}>
//                                             {s.stateName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* CITY */}
//                             <div>
//                                 <label className={labelCls}>City *</label>
//                                 <select
//                                     className={inputCls}
//                                     value={cityId}
//                                     onChange={(e) => {
//                                         const v = e.target.value;
//                                         setCityId(v ? Number(v) : "");
//                                     }}
//                                     disabled={!stateId}
//                                 >
//                                     <option value="">Select City</option>
//                                     {cities.map((c) => (
//                                         <option key={c.id} value={c.id}>
//                                             {c.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Pricing card (kept as you had) */}
//                     <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//                         <h2 className="text-base font-semibold">Pricing</h2>
//                         <p className="mt-1 text-sm text-black/60">Select Free / Paid.</p>

//                         <div className="mt-4 flex flex-wrap gap-3">
//                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                 <input
//                                     type="radio"
//                                     name="paymentType"
//                                     checked={paymentType === "free"}
//                                     onChange={() => setPaymentType("free")}
//                                 />
//                                 Free
//                             </label>

//                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                 <input
//                                     type="radio"
//                                     name="paymentType"
//                                     checked={paymentType === "paid"}
//                                     onChange={() => setPaymentType("paid")}
//                                 />
//                                 Paid
//                             </label>
//                         </div>

//                         {isPaid && (
//                             <div className="mt-5 rounded-2xl border border-black/10 bg-black/2 p-4">
//                                 <div className="grid gap-4 lg:grid-cols-2">
//                                     <div>
//                                         <label className={labelCls}>
//                                             Ticket Price <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={ticketPrice}
//                                             onChange={(e) => setTicketPrice(e.target.value)}
//                                             placeholder="Enter ticket price"
//                                             className={inputCls}
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Ticket Count</label>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={ticketCount}
//                                             onChange={(e) => setTicketCount(e.target.value)}
//                                             placeholder="Total available tickets (optional)"
//                                             className={inputCls}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>Ticket Info</label>
//                                         <textarea
//                                             value={ticketInfo}
//                                             onChange={(e) => setTicketInfo(e.target.value)}
//                                             placeholder="Seat info, terms, etc."
//                                             rows={3}
//                                             className={`${inputCls} resize-none`}
//                                         />
//                                     </div>

//                                     <div className="lg:col-span-2">
//                                         <label className={labelCls}>
//                                             Payment Mode <span className="text-red-500">*</span>
//                                         </label>

//                                         <div className="mt-2 flex flex-wrap gap-3">
//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidMode"
//                                                     checked={paidMode === "online"}
//                                                     onChange={() => setPaidMode("online")}
//                                                 />
//                                                 Online
//                                             </label>

//                                             <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
//                                                 <input
//                                                     type="radio"
//                                                     name="paidMode"
//                                                     checked={paidMode === "offline"}
//                                                     onChange={() => setPaidMode("offline")}
//                                                 />
//                                                 Offline
//                                             </label>
//                                         </div>
//                                     </div>

//                                     {paidMode === "online" ? (
//                                         <div className="lg:col-span-2">
//                                             <label className={labelCls}>
//                                                 Online Info <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 value={onlineInfo}
//                                                 onChange={(e) => setOnlineInfo(e.target.value)}
//                                                 placeholder="UPI/Link/Payment instructions"
//                                                 className={inputCls}
//                                                 required
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div className="lg:col-span-2">
//                                             <label className={labelCls}>
//                                                 Offline Info <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 value={offlineInfo}
//                                                 onChange={(e) => setOfflineInfo(e.target.value)}
//                                                 placeholder="Cash/Counter instructions"
//                                                 className={inputCls}
//                                                 required
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </section>

//                     {/* Error + Actions */}
//                     {error ? <p className="text-sm text-red-600">{error}</p> : null}

//                     <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//                         <button
//                             type="button"
//                             className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                             onClick={() => window.history.back()}
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={!requiredOk}
//                             className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             Create Event
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </main>
//     );
// }




"use client";

import { apiUrl } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { IoArrowBack } from "react-icons/io5";

type PaymentType = "free" | "paid";
type PaidMode = "online" | "offline";

const inputCls =
    "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";
const helperCls = "text-xs text-black/60";

type StateType = {
    stateId: number;
    stateName: string;
};

type CityType = {
    id: number;
    name: string;
    stateid: number;
};

type GroupMember = {
    id: number;
    name: string;
    description: string;
    photo: string;
    photo_url: string;
    created_at: string;
};

export default function CreateEventPage() {
    // Banner (single)
    const router = useRouter();
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");

    // Show images (multiple)
    const [showFiles, setShowFiles] = useState<File[]>([]);
    const [showPreviews, setShowPreviews] = useState<string[]>([]);

    // State/City
    const [states, setStates] = useState<StateType[]>([]);
    const [cities, setCities] = useState<CityType[]>([]);
    const [stateId, setStateId] = useState<number | "">("");
    const [stateName, setStateName] = useState("");
    const [cityId, setCityId] = useState<number | "">("");

    // Group Members (OPTIONAL)
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Dropdown state for members
    const [membersOpen, setMembersOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const membersBoxRef = useRef<HTMLDivElement | null>(null);

    /** ---------------- FORM STATES ---------------- */
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");

    const [paymentType, setPaymentType] = useState<PaymentType>("free");
    const [ticketPrice, setTicketPrice] = useState("");
    const [ticketCount, setTicketCount] = useState("");
    const [ticketInfo, setTicketInfo] = useState("");
    const [paidMode, setPaidMode] = useState<PaidMode>("online");
    const [onlineInfo, setOnlineInfo] = useState("");
    const [offlineInfo, setOfflineInfo] = useState("");

    const [error, setError] = useState("");

    const isPaid = paymentType === "paid";

    const getToken = () => {
        if (typeof window === "undefined") return "";
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("access_token") ||
            localStorage.getItem("adminToken") ||
            ""
        );
    };

    // Close dropdown on outside click
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!membersBoxRef.current) return;
            if (!membersBoxRef.current.contains(e.target as Node)) {
                setMembersOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // Banner preview
    useEffect(() => {
        if (!bannerFile) {
            setBannerPreview("");
            return;
        }
        const url = URL.createObjectURL(bannerFile);
        setBannerPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [bannerFile]);

    // Show images previews
    useEffect(() => {
        showPreviews.forEach((u) => URL.revokeObjectURL(u));
        const urls = showFiles.map((f) => URL.createObjectURL(f));
        setShowPreviews(urls);
        return () => urls.forEach((u) => URL.revokeObjectURL(u));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFiles]);

    // Reset paid fields when switching to free
    useEffect(() => {
        if (paymentType === "free") {
            setTicketPrice("");
            setTicketCount("");
            setTicketInfo("");
            setOnlineInfo("");
            setOfflineInfo("");
            setPaidMode("online");
        }
    }, [paymentType]);

    // ✅ Group members OPTIONAL now (no validation)
    const requiredOk = useMemo(() => {
        if (!title || !startDate || !time || !description) return false;
        if (!address || !stateId || !cityId) return false;

        if (isPaid) {
            if (!ticketPrice) return false;
            if (paidMode === "online") return false;
            if (paidMode === "offline") return false;
        }
        return true;
    }, [
        title,
        startDate,
        time,
        description,
        address,
        stateId,
        cityId,
        isPaid,
        ticketPrice,
        paidMode,
        onlineInfo,
        offlineInfo,
    ]);

    const onSelectShowImages = (files: FileList | null) => {
        if (!files) return;
        const incoming = Array.from(files);
        const onlyImages = incoming.filter((f) => f.type.startsWith("image/"));
        setShowFiles((prev) => [...prev, ...onlyImages]);
    };

    const removeShowImage = (index: number) => {
        setShowFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const clearShowImages = () => setShowFiles([]);

    // ✅ Fetch States
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.post(`${apiUrl}/admin/states/list`, {});
                if (res.data?.status) setStates(res.data.data || []);
            } catch (err) {
                console.error("State fetch error", err);
            }
        };
        fetchStates();
    }, []);

    // ✅ Fetch Cities when State changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!stateId) return;

            try {
                const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: stateId });
                if (res.data?.success) setCities(res.data.data || []);
            } catch (err) {
                console.error("City fetch error", err);
            }
        };

        // reset city when state changes
        setCityId("");
        setCities([]);

        if (stateId) fetchCities();
    }, [stateId]);

    // ✅ Fetch Group Members (POST with Token) - fixed axios call
    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                setLoadingMembers(true);

                const token = getToken();
                if (!token) {
                    setGroupMembers([]);
                    return;
                }

                const res = await axios.post(
                    `${apiUrl}/v1/group-members`,
                    {},
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data?.status) {
                    setGroupMembers(res.data.data || []);
                } else {
                    setGroupMembers([]);
                }
            } catch (err) {
                console.error("Group members fetch error:", err);
                setGroupMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        };

        fetchGroupMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleMember = (id: number) => {
        setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const filteredMembers = useMemo(() => {
        const s = memberSearch.trim().toLowerCase();
        if (!s) return groupMembers;
        return groupMembers.filter((m) => {
            return (
                m.name.toLowerCase().includes(s) ||
                (m.description || "").toLowerCase().includes(s) ||
                String(m.id).includes(s)
            );
        });
    }, [groupMembers, memberSearch]);

    // ✅ STORE API submit
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!requiredOk) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            const formData = new FormData();

            // ✅ EXACT API KEYS (store)
            formData.append("title", title);
            formData.append("event_date", startDate);
            formData.append("event_time", time);
            formData.append("description", description);
            formData.append("state_id", String(stateId));
            formData.append("city_id", String(cityId));
            // map your address to "venue"
            formData.append("venue", address);
            // pricing_type: 1=free, 2=paid (adjust if backend differs)
            const pricing_type = paymentType === "free" ? "1" : "2";
            formData.append("pricing_type", pricing_type);
            formData.append("Price", ticketPrice);
            if (ticketCount) formData.append("Ticket_count", ticketCount);
            if (ticketInfo) formData.append("ticket_info", ticketInfo);
            if (paymentType === "paid") {
                formData.append("payment_mode", paidMode);
            }

            // ✅ files
            if (bannerFile) formData.append("banner", bannerFile);
            showFiles.forEach((file) => formData.append("photos[]", file));

            // ✅ group members OPTIONAL (only append if selected)
            if (selectedMemberIds.length > 0) {
                selectedMemberIds.forEach((id) => formData.append("group_members[]", String(id)));
            }

            const token = getToken();

            const res = await axios.post(`${apiUrl}/v1/events/create`, formData, {
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (res.data?.status) {
                alert(`Event created successfully! event_id = ${res.data.event_id}`);
                router.push(`/superadmin/events`);
                // reset form
                setTitle("");
                setStartDate("");
                setTime("");
                setDescription("");
                setAddress("");
                setPaymentType("free");
                setBannerFile(null);
                setShowFiles([]);
                setStateId("");
                setStateName("");
                setCityId("");
                setSelectedMemberIds([]);
                setMemberSearch("");
                setMembersOpen(false);
            } else {
                setError(res.data?.message || "Failed to create event.");
            }
        } catch (err: any) {
            console.error("Create event error:", err);
            setError(err?.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
                        <p className="text-sm text-black/60">Fill details and publish your show.</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/10 bg-white p-3 text-black hover:bg-black/5"
                            aria-label="Go back"
                            title="Back"
                        >
                            <IoArrowBack className="text-xl" /> Back
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    {/* Row 1: Images + Basic Details */}
                    <section className="grid gap-6 lg:grid-cols-12">
                        {/* Images card */}
                        <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold">Images</h2>
                            <p className="mt-1 text-sm text-black/60">Add banner and show gallery.</p>

                            {/* Banner */}
                            <div className="mt-5">
                                <p className={labelCls}>Banner Image</p>

                                <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                                        className="hidden"
                                    />

                                    {!bannerPreview ? (
                                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                                                    <path d="M19 7h-1.17l-1.83-2H8L6.17 7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.05l1.83-2h6.24l1.83 2H19a1 1 0 0 1 1 1z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium">Upload banner image</p>
                                            <p className={helperCls}>Click to choose (optional)</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-xl border border-black/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={bannerPreview} alt="Banner preview" className="h-44 w-full object-cover" />
                                        </div>
                                    )}
                                </label>

                                {bannerPreview ? (
                                    <button
                                        type="button"
                                        onClick={() => setBannerFile(null)}
                                        className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
                                    >
                                        Remove banner
                                    </button>
                                ) : null}
                            </div>

                            {/* Show Images (multiple) */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <p className={labelCls}>Show Images (Multiple)</p>
                                    {showFiles.length > 0 ? (
                                        <button
                                            type="button"
                                            onClick={clearShowImages}
                                            className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Clear all
                                        </button>
                                    ) : null}
                                </div>

                                <div className="mt-2 rounded-2xl border border-black/10 bg-black/2 p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => onSelectShowImages(e.target.files)}
                                        className="block w-full text-sm"
                                    />
                                    <p className="mt-2 text-xs text-black/60">You can select multiple images.</p>

                                    {showPreviews.length > 0 ? (
                                        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                                            {showPreviews.map((src, i) => (
                                                <div key={src} className="relative overflow-hidden rounded-xl border border-black/10 bg-white">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={src} alt={`Show image ${i + 1}`} className="h-24 w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeShowImage(i)}
                                                        className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                                                        aria-label="Remove image"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl border border-dashed border-black/15 p-6 text-center">
                                            <p className="text-sm text-black/60">No show images selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic details card */}
                        <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold">Basic Details</h2>
                            <p className="mt-1 text-sm text-black/60">Title, members (optional), date, time and description.</p>

                            {/* ✅ Title + Group Members Dropdown Row */}
                            <div className="mt-5 grid gap-4 lg:grid-cols-12">
                                {/* Title */}
                                <div className="lg:col-span-7">
                                    <label className={labelCls}>
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter show title"
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                {/* ✅ Group Members dropdown (OPTIONAL) */}
                                <div className="lg:col-span-5 relative" ref={membersBoxRef}>
                                    <label className={labelCls}>
                                        Group Members <span className="text-xs text-black/50">(Optional)</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setMembersOpen((p) => !p)}
                                        className={`${inputCls} flex items-center justify-between`}
                                    >
                                        <span className="text-sm">
                                            {selectedMemberIds.length === 0
                                                ? loadingMembers
                                                    ? "Loading members..."
                                                    : "Select members (optional)"
                                                : `${selectedMemberIds.length} selected`}
                                        </span>
                                        <span className="text-black/50">▾</span>
                                    </button>

                                    {membersOpen ? (
                                        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg">
                                            <div className="p-3">
                                                <input
                                                    value={memberSearch}
                                                    onChange={(e) => setMemberSearch(e.target.value)}
                                                    placeholder="Search member..."
                                                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div className="max-h-64 overflow-auto p-2">
                                                {loadingMembers ? (
                                                    <p className="px-3 py-2 text-sm text-black/60">Loading...</p>
                                                ) : filteredMembers.length === 0 ? (
                                                    <p className="px-3 py-2 text-sm text-black/60">No members found</p>
                                                ) : (
                                                    filteredMembers.map((m) => {
                                                        const checked = selectedMemberIds.includes(m.id);
                                                        return (
                                                            <label
                                                                key={m.id}
                                                                className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 hover:bg-black/5"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => toggleMember(m.id)}
                                                                    className="mt-1"
                                                                />
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
                                                    onClick={() => setSelectedMemberIds([])}
                                                    className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setMembersOpen(false)}
                                                    className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Selected chips (optional) */}
                                    {selectedMemberIds.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedMemberIds.map((id) => {
                                                const mem = groupMembers.find((x) => x.id === id);
                                                if (!mem) return null;
                                                return (
                                                    <span
                                                        key={id}
                                                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm"
                                                    >
                                                        {mem.name}
                                                        <button
                                                            type="button"
                                                            className="text-black/60 hover:text-black"
                                                            onClick={() => setSelectedMemberIds((prev) => prev.filter((x) => x !== id))}
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="lg:col-span-6">
                                    <label className={labelCls}>
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                <div className="lg:col-span-6">
                                    <label className={labelCls}>
                                        Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                <div className="lg:col-span-12">
                                    <label className={labelCls}>
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write event description..."
                                        rows={6}
                                        className={`${inputCls} resize-none`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Location card */}
                    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Location</h2>
                        <p className="mt-1 text-sm text-black/60">Address, state and city.</p>

                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <div className="lg:col-span-2">
                                <label className={labelCls}>
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter full address"
                                    className={inputCls}
                                    required
                                />
                            </div>

                            {/* STATE */}
                            <div>
                                <label className={labelCls}>State *</label>
                                <select
                                    className={inputCls}
                                    value={stateId}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (!v) {
                                            setStateId("");
                                            setStateName("");
                                            return;
                                        }
                                        const id = Number(v);
                                        setStateId(id);
                                        const selected = states.find((s) => s.stateId === id);
                                        setStateName(selected?.stateName || "");
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

                            {/* CITY */}
                            <div>
                                <label className={labelCls}>City *</label>
                                <select
                                    className={inputCls}
                                    value={cityId}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setCityId(v ? Number(v) : "");
                                    }}
                                    disabled={!stateId}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Pricing card */}
                    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Pricing</h2>
                        <p className="mt-1 text-sm text-black/60">Select Free / Paid.</p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    checked={paymentType === "free"}
                                    onChange={() => setPaymentType("free")}
                                />
                                Free
                            </label>

                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    checked={paymentType === "paid"}
                                    onChange={() => setPaymentType("paid")}
                                />
                                Paid
                            </label>
                        </div>

                        {isPaid && (
                            <div className="mt-5 rounded-2xl border border-black/10 bg-black/2 p-4">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div>
                                        <label className={labelCls}>
                                            Ticket Price <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={ticketPrice}
                                            onChange={(e) => setTicketPrice(e.target.value)}
                                            placeholder="Enter ticket price"
                                            className={inputCls}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Ticket Count</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={ticketCount}
                                            onChange={(e) => setTicketCount(e.target.value)}
                                            placeholder="Total available tickets (optional)"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className={labelCls}>Ticket Info</label>
                                        <textarea
                                            value={ticketInfo}
                                            onChange={(e) => setTicketInfo(e.target.value)}
                                            placeholder="Seat info, terms, etc."
                                            rows={3}
                                            className={`${inputCls} resize-none`}
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
                                                    name="paidMode"
                                                    checked={paidMode === "online"}
                                                    onChange={() => setPaidMode("online")}
                                                />
                                                Online
                                            </label>

                                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                                <input
                                                    type="radio"
                                                    name="paidMode"
                                                    checked={paidMode === "offline"}
                                                    onChange={() => setPaidMode("offline")}
                                                />
                                                Offline
                                            </label>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        )}
                    </section>

                    {/* Error + Actions */}
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!requiredOk}
                            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
