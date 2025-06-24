// import React, { useEffect, useRef, useState } from "react";
// import Invoice from "../../../../assets/images/Invoice.png";
// import { toPng } from "html-to-image";
// import { AiOutlineLoading } from "react-icons/ai";
// import { API, formatDate1 } from "../../../../Host";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import jsPDF from "jspdf";

// const Invoice = () => {
//   const [processing, setProcessing] = useState(false);
//   const [invoice, setInvoice] = useState({});
//   const pdfRef = useRef(null);
//   const location = useLocation();
//   const subId = location?.state?.subId;

//   useEffect(() => {
//     const fetchSubs = async () => {
//       const postURL = API + `/api/getsubonid/${subId}`;
//       try {
//         const response = await axios.get(postURL);
//         setInvoice(response.data.sub);
//       } catch (error) {
//         console.error("Error fetching subscriptions:", error);
//       }
//     };

//     fetchSubs();
//   }, [subId]);

//   const handleDownload = async () => {
//     setProcessing(true);
//     try {
//       pdfRef.current.classList.add("download-mode");
//       await new Promise((resolve) => setTimeout(resolve, 100));

//       const dataUrl = await toPng(pdfRef.current, { cacheBust: true });
//       const pdf = new jsPDF("p", "mm", "a4");

//       const imgProps = pdf.getImageProperties(dataUrl);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("PMC_Invoice.pdf");
//       toast.success("Invoice downloaded as PDF");
//     } catch (err) {
//       console.error("Error generating PDF", err);
//       toast.error("Failed to download invoice");
//     } finally {
//       pdfRef.current.classList.remove("download-mode");
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="text-white p-3 flex flex-col items-center justify-center">
//       {invoice && (
//         <div
//           className="bg-darkgray w-full max-w-3xl rounded-xl p-6 space-y-6 shadow-lg"
//           ref={pdfRef}
//         >
//           <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
//             <div>
//               <p className="text-sm">
//                 Invoice No : <span>{invoice.recieptId}</span>
//               </p>
//             </div>
//             <div className="text-left md:text-right">
//               <img src={Invoice} alt="Invoice" className="w-72" />
//             </div>
//           </div>

//           <div className="text-sm leading-relaxed space-y-1">
//             <p>
//               <span>Product</span>: <span>SeekMYCOURSE</span> Subscription
//             </p>
//             <p>Plan: {invoice.plan}</p>
//             <p>Billing Type: {invoice.duration}</p>
//             <p>Purchase Date: {formatDate1(invoice.date)}</p>
//             <p>Plan Expiry Date: 31-Dec-2025</p>
//           </div>

//           <div className="bg-popup-gray rounded-lg p-3 text-sm font-mono break-words overflow-hidden">
//             Payment ID : {invoice.subscription}
//           </div>

//           <div className="invoice-table overflow-x-auto whitespace-nowrap bg-popup-gray px-2 rounded-2xl">
//             <table className="w-full text-sm text-left text-white">
//               <thead className="text-gray-300 font-medium border-b border-gray-700">
//                 <tr>
//                   <th className="py-2 mx-3">Services</th>
//                   <th className="text-center px-3">Period</th>
//                   <th className="text-right px-3">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b border-gray-800">
//                   <td className="py-3">
//                     <p className="underline">SeekMYCOURSE</p>
//                     <p className="text-xs text-gray-400">Yearly Subscription</p>
//                   </td>
//                   <td className="text-center">01-Jan-2025 - 01-Jan-2026</td>
//                   <td className="text-right">
//                     {invoice.method === "razorpay"
//                       ? `₹${parseFloat(invoice.amount).toFixed(2)}`
//                       : `$${parseFloat(invoice.amount).toFixed(2)}`}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <p className="w-full ml-auto sm:w-96">Payment Summary</p>
//           <div className="payment-summary sm:ml-auto w-full sm:w-96 bg-popup-gray rounded-lg p-4 text-sm space-y-2 ">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>
//                 {invoice.method === "razorpay"
//                   ? `₹${parseFloat(invoice.amount).toFixed(2)}`
//                   : `$${parseFloat(invoice.amount).toFixed(2)}`}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax (GST)</span>
//               <span>
//                 {invoice.method === "razorpay"
//                   ? `₹${(
//                       parseFloat(invoice.amount) *
//                       (invoice.tax / 100)
//                     ).toFixed(2)}`
//                   : `$${(
//                       parseFloat(invoice.amount) *
//                       (invoice.tax / 100)
//                     ).toFixed(2)}`}
//               </span>
//             </div>
//             <div className="flex justify-between font-semibold text-lg border-t border-gray-600 pt-2">
//               <span>TOTAL</span>
//               <span>
//                 {(() => {
//                   const amount = parseFloat(invoice.amount);
//                   const tax = amount * (invoice.tax / 100);
//                   const grandTotal = amount + tax;

//                   return invoice.method === "razorpay"
//                     ? `₹${grandTotal.toFixed(0)}.00`
//                     : `$${grandTotal.toFixed(0)}`;
//                 })()}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Download Button */}
//       <div className="text-center mt-4">
//         <button
//           className={`text-lg bg-teal-600 rounded-md w-52 py-2.5 ${
//             processing ? "opacity-15" : ""
//           }`}
//           disabled={processing}
//           onClick={handleDownload}
//         >
//           {processing ? (
//             <span className="flex justify-center gap-3">
//               <AiOutlineLoading className="h-6 w-6 animate-spin" />
//               <p>Downloading ....</p>
//             </span>
//           ) : (
//             "Download Invoice"
//           )}
//         </button>
//       </div>

//       {/* Download-mode print styles */}
//       <style>
//         {`
//         .download-mode {
//           background-color: white !important;
//           color: black !important;
//           width: 800px !important;
//           padding: 32px !important;
//         }

//         .download-mode *,
//         .download-mode *::before,
//         .download-mode *::after {
//           background-color: transparent !important;
//           color: black !important;
//           max-width: none !important;
//           width: auto !important;
//         }

//         /* Shared background */
//         .download-mode .bg-popup-gray {
//           background-color: #e5e5e5 !important;
//         }

//         /* Invoice table */
//         .download-mode .invoice-table {
//           background-color: #e5e5e5 !important;
//           width: 100% !important;
//         }

//         .download-mode .invoice-table th,
//         .download-mode .invoice-table td {
//           color: black !important;
//           border-color: #bbb !important;
//         }

//         .download-mode .invoice-table .text-gray-300,
//         .download-mode .invoice-table .text-gray-400 {
//           color: #333 !important;
//         }

//         .download-mode .invoice-table table {
//           table-layout: fixed !important;
//           width: 100% !important;        }

//         /* Payment summary */
//         .download-mode .payment-summary {
//           background-color: #e5e5e5 !important;
//           color: black !important;
//           border-color: #bbb !important;
//           width: 100% !important;
//           margin-left: auto !important;
//         }

//         .download-mode .payment-summary .border-gray-600 {
//           border-color: #bbb !important;
//         }

//         .download-mode .payment-summary .text-lg {
//           color: black !important;
//           font-weight: bold !important;
//         }

//         /* Layout overrides */
//         .download-mode .flex,
//         .download-mode .md\\:flex-row,
//         .download-mode .md\\:justify-between,
//         .download-mode .md\\:items-start {
//           flex-direction: row !important;
//           justify-content: space-between !important;
//           align-items: flex-start !important;
//         }

//             .download-mode .sm\\:w-96,
//         .download-mode .w-full {
//           width: 370px !important;
//         }

//         .download-mode .max-w-3xl {
//           width: 350px !important;
//         }

//         .download-mode .w-72 {
//           width: 200px !important;
//         }
//         `}
//       </style>
//     </div>
//   );
// };

// export default Invoice;