import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/SMC Logo.png";
import Modal from "../../components/Modal";
import { API, formatDate2 } from "../../Host";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";

const Invoice = ({ onClose, invoiceData }) => {
  const [invoiceSub, setInvoiceSub] = useState([]);
  const [processing, setProcessing] = useState(false);
  const pdfRef = useRef();

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(invoiceData);
      const responseData = response.data.sub;
      setInvoiceSub(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async () => {
    setProcessing(true); // Start processing
    try {
      // Capture the element as a canvas
      const canvas = await html2canvas(pdfRef.current, { scale: 2 }); // Higher scale for better quality
      const imgData = canvas.toDataURL("image/png"); // Convert to image

      // Create a new PDF document
      const pdf = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size

      // Calculate dimensions to fit the content
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF

      // Save the PDF
      pdf.save("SMC_Invoice.pdf");

      toast.success("Invoice downloaded as PDF!"); // Show success toast
    } catch (error) {
      console.error("Error generating PDF:", error); // Log error
      toast.error("Failed to generate PDF."); // Show error toast
    } finally {
      setProcessing(false); // Reset processing state
    }
  };

  // Helper function to format amounts based on the payment method
  const formatAmount = (amount, method) => {
    const isStripe = method === "stripe"; // Payment method is Stripe
    const isRazorpay = method === "razorpay"; // Payment method is Razorpay

    if (isStripe) {
      return `$ ${amount}`;
    } else if (isRazorpay) {
      return `₹ ${amount}`;
    } else {
      return `${amount}`;
    }
  };

  const formatMethod = (amount, method) => {
    const isStripe = method === "stripe";
    const isRazorpay = method === "razorpay";

    if (isStripe) {
      return `${amount} USD`;
    } else if (isRazorpay) {
      return `${amount} INR`;
    } else {
      return `${amount}`;
    }
  };

  return (
    <Modal>
      <div className="bg-white">
        {invoiceSub && (
          <div
            className="max-w-xl h-auto bg-white py-1 px-2 font-poppins font-extralight"
            ref={pdfRef}
          >
            <span className="flex justify-center my-3">
              <img src={Logo} alt="Image" className="w-48 " />
            </span>
            <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
              <div className="col-span-6 font-normal">
                <p className="font-normal">Payment Method:</p>
                <p>Plan:</p>
                <p>Subscription ID:</p>
                <p>Customer ID:</p>
                <p>Amount:</p>
              </div>
              <div className="col-span-6 ">
                <p>{invoiceSub.method}</p>
                <p>{invoiceSub.plan}</p>
                <p>{invoiceSub.subscriberId}</p>
                <p>cus_QXoP8hrt4tOqIh</p>
                <p>{formatMethod(invoiceSub.amount, invoiceSub.method)}</p>
              </div>
            </div>
            <hr className="my-2 mx-5" />
            <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
              <div className="col-span-6 font-normal ">
                <p>Receipt #:</p>
                <p>Date:</p>
              </div>
              <div className="col-span-6 ">
                <p>256746746444</p>
                <p>{formatDate2(invoiceSub.date)}</p>
              </div>
            </div>
            <hr className="my-2 mx-5" />
            <div className="grid grid-cols-12 gap-3 text-black mx-3">
              <div className="col-span-6 ">
                <p className="font-normal">Basic Monthly Plan:</p>
                <p>Qty {invoiceSub.course}</p>
              </div>
              <div className="col-span-6 ">
                <p>{formatAmount(invoiceSub.amount, invoiceSub.method)}</p>
              </div>
            </div>
            <hr className="my-2 mx-5" />
            <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
              <div className="col-span-6 ">
                <p className="font-normal">Tax:</p>
                <p>{invoiceSub.tax}%</p>
              </div>
              <div className="col-span-6 ">
                <p>
                  {/* Divide tax by 100 and show tax in the right currency */}
                  {invoiceSub.method === "razorpay"
                    ? `₹ ${(Number(invoiceSub.tax) / 100).toFixed(2)}`
                    : `$ ${(Number(invoiceSub.tax) / 100).toFixed(2)}`}
                </p>
              </div>
            </div>
            <hr className="my-2 mx-5" />
            <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
              <div className="col-span-6 font-normal">
                <p>Grand Total:</p>
              </div>
              <div className="col-span-6 ">
                {invoiceSub.amount && invoiceSub.tax && (
                  <p>
                    {invoiceSub.method === "razorpay"
                      ? `₹ ${(
                          Number(invoiceSub.amount) +
                          Number(invoiceSub.tax) / 100
                        ).toFixed(0)}`
                      : `$ ${(
                          Number(invoiceSub.amount) +
                          Number(invoiceSub.tax) / 100
                        ).toFixed(2)}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-evenly items-center my-8 ">
          <p
            onClick={onClose}
            className=" cursor-pointer text-lg  bg-white  border-2 border-black text-center text-black px-10 py-2.5  "
          >
            Cancel
          </p>
          <button
            className={`text-lg  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-52 py-2.5 ${
              processing ? "opacity-15" : ""
            }`}
            disabled={processing}
            onClick={handleDownload}
          >
            {processing ? (
              <span className="flex justify-center gap-3">
                {" "}
                <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                <p>Downloading ....</p>
              </span>
            ) : (
              "Download Invoice"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Invoice;
