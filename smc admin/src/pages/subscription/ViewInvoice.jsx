import React, { useEffect, useRef, useState } from "react";
import Invoice from "../../assets/Invoice.png";
import { toPng } from "html-to-image";
import { AiOutlineLoading } from "react-icons/ai";
import { API, formatDate1 } from "../../Host";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const ViewInvoice = () => {
  const [processing, setProcessing] = useState(false);
  const [invoice, setInvoice] = useState({});
  const pdfRef = useRef(null);
  const { state } = useLocation();
  const { subId } = state || {};

  useEffect(() => {
    const fetchSubs = async () => {
      const postURL = API + `/api/getsubonid/${subId}`;
      try {
        const response = await axios.get(postURL);
        setInvoice(response.data.sub);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubs();
  }, [subId]);

  const handleDownload = async () => {
    setProcessing(true);
    try {
      pdfRef.current.classList.add("download-mode");
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(pdfRef.current, { cacheBust: true });
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("PMC_Invoice.pdf");
      toast.success("Invoice downloaded as PDF");
    } catch (err) {
      console.error("Error generating PDF", err);
      toast.error("Failed to download invoice");
    } finally {
      pdfRef.current.classList.remove("download-mode");
      setProcessing(false);
    }
  };

  return (
    <div className="text-black p-4 h-full ">
      {invoice && (
        <div
          className="bg-white w-1/3  p-2 space-y-2 shadow-lg"
          ref={pdfRef}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
            <div></div>
            <div className=" text-[8px] text-nowrap font-extralight">
              <img src={Invoice} alt="Invoice" className="w-36" />

              <p className="text-center">Morpheus Code Technologies LLP</p>
            </div>
          </div>
          <p>
            Invoice No : <span>{invoice.recieptId}</span>
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <span>Product</span>: <span>SeekMYCOURSE</span> Subscription
            </p>
            <p>Plan: {invoice.plan}</p>
            <p>Billing Type: {invoice.duration}</p>
            <p>Purchase Date: {formatDate1(invoice.date)}</p>
            <p>Plan Expiry Date: 31-Dec-2025</p>
          </div>

          <div className="bg-gray-300 rounded-sm p-1.5 text-xs ">
            Payment ID : {invoice.subscription}
          </div>
          <div className="bg-gray-300 rounded-sm p-1.5 text-xs flex justify-between items-center">
            <p>Services</p>
            <p>Period</p>
            <p>Amount</p>
          </div>
          <div className="bg-gray-300 rounded-sm p-1.5 text-xs flex justify-between items-center">
            <div className="text-xs">
              <p className="">SeekMYCOURSE</p>
              <p className="">Yearly Subscription</p>
            </div>
            <p className="text-center">01-Jan-2025 - 01-Jan-2026</p>
            <p className="text-right">
              {invoice.method === "razorpay"
                ? `₹${parseFloat(invoice.amount).toFixed(2)}`
                : `$${parseFloat(invoice.amount).toFixed(2)}`}
            </p>
          </div>

          <p className="w-full  sm:w-96">Payment Summary</p>
          <div className=" bg-gray-300 w-full sm:w-96  rounded-lg p-4 text-sm space-y-2 ">
            <div className="flex justify-between ">
              <span className="text-center">Subtotal</span>
              <span>
                {invoice.method === "razorpay"
                  ? `₹${parseFloat(invoice.amount).toFixed(2)}`
                  : `$${parseFloat(invoice.amount).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST)</span>
              <span>
                {invoice.method === "razorpay"
                  ? `₹${(
                      parseFloat(invoice.amount) *
                      (invoice.tax / 100)
                    ).toFixed(2)}`
                  : `$${(
                      parseFloat(invoice.amount) *
                      (invoice.tax / 100)
                    ).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-sm border-t border-gray-600 pt-2">
              <span>TOTAL</span>
              <span>
                {(() => {
                  const amount = parseFloat(invoice.amount);
                  const tax = amount * (invoice.tax / 100);
                  const grandTotal = amount + tax;

                  return invoice.method === "razorpay"
                    ? `₹${grandTotal.toFixed(0)}.00`
                    : `$${grandTotal.toFixed(0)}`;
                })()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Download Button */}
      <div className="text-center mt-4">
        <button
          className={`text-lg bg-teal-600 rounded-md w-52 py-2.5 ${
            processing ? "opacity-15" : ""
          }`}
          disabled={processing}
          onClick={handleDownload}
        >
          {processing ? (
            <span className="flex justify-center gap-3">
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
              <p>Downloading ....</p>
            </span>
          ) : (
            "Download Invoice"
          )}
        </button>
      </div>

      {/* Download-mode print styles */}
      <style>
        {`
        .download-mode {
          background-color: white !important;
          color: black !important;
          width: 800px !important;
          padding: 32px !important;
        }

        .download-mode *,
        .download-mode *::before,
        .download-mode *::after {
          background-color: transparent !important;
          color: black !important;
          max-width: none !important;
          width: auto !important;
        }

        /* Shared background */
        .download-mode .bg-popup-gray {
          background-color: #e5e5e5 !important;
        }

        /* Invoice table */
        .download-mode .invoice-table {
          background-color: #e5e5e5 !important;
          width: 100% !important;
        }

        .download-mode .invoice-table th,
        .download-mode .invoice-table td {
          color: black !important;
          border-color: #bbb !important;
        }

        .download-mode .invoice-table .text-gray-300,
        .download-mode .invoice-table .text-gray-400 {
          color: #333 !important;
        }

        .download-mode .invoice-table table {
          table-layout: fixed !important;
          width: 100% !important;        }

        /* Payment summary */
        .download-mode .payment-summary {
          background-color: #e5e5e5 !important;
          color: black !important;
          border-color: #bbb !important;
          width: 100% !important;
          margin-left: auto !important;
        }

        .download-mode .payment-summary .border-gray-600 {
          border-color: #bbb !important;
        }

        .download-mode .payment-summary .text-lg {
          color: black !important;
          font-weight: bold !important;
        }

        /* Layout overrides */
        .download-mode .flex,
        .download-mode .md\\:flex-row,
        .download-mode .md\\:justify-between,
        .download-mode .md\\:items-start {
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
        }

            .download-mode .sm\\:w-96,
        .download-mode .w-full {
          width: 370px !important;
        }

        .download-mode .max-w-3xl {
          width: 350px !important;
        }

        .download-mode .w-72 {
          width: 200px !important;
        }
        `}
      </style>
    </div>
  );
};

export default ViewInvoice;
