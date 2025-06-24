import React, { useEffect, useState } from "react";
import Pdf from "../../assets/pdf.png";
import Csv from "../../assets/csv.png";
import Excel from "../../assets/excel.png";
import { FaEye } from "react-icons/fa6";
import Invoice from "./ViewInvoice";
import axios from "axios";
import { API } from "../../Host";
import { formatDate2 } from "../../Host";
import * as XLSX from "xlsx"; 
import { CSVLink } from "react-csv"; 
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const Subscription = ({ permissions }) => {
  const navigate = useNavigate();
  const hasViewPermission = permissions?.includes("view");
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState({});
  const [sub, setSub] = useState([]);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(`${API}/api/getallsubs`);
      const responseData = response.data.sub;
      setSub(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const getExportData = () => {
    return sub.map((data) => ({
      "User Id": data._id,
      "First Name": data.fname,
      "Last Name": data.lname,
      Email: data.email,
      Phone: data.phone,
      Date: formatDate2(data.date),
      Plan: data.plan,
      Amount: data.amount,
      Transaction: data.subscriberId,
      "Payment Mode": data.method,
    }));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getExportData());

    const wscols = [
      { wpx: 180 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 180 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
    ];

    ws["!cols"] = wscols;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "subscription");
    XLSX.writeFile(wb, "SMC Subscription.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "User Id",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Date",
      "Plan",
      "Amount",
      "Transaction",
      "Payment Mode",
    ];

    const rows = getExportData().map((userData) => [
      userData["User Id"],
      userData["First Name"],
      userData["Last Name"],
      userData["Email"],
      userData["Phone"],
      userData["Date"],
      userData["Plan"],
      userData["Amount"],
      userData["Transaction"],
      userData["Payment Mode"],
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [97, 144, 213],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        halign: "center",
      },
    });

    doc.save("SMC_Subscription.pdf");
  };

  return (
    <>
      <div className=" font-poppins h-full">
        <div className="flex justify-between items-center my-2">
          <p className=" mx-2 mt-6">Subscription</p>
          <div className=" mx-2 flex gap-6 mt-4">
            <button onClick={exportToPDF}>
              <img className="size-8" src={Pdf} alt="Pdf image" />
            </button>
            <CSVLink
              data={getExportData()}
              filename={"SMC_Subscription.csv"}
              className="cursor-pointer"
              target="_blank"
            >
              <img className="size-8" src={Csv} alt="csv image" />
            </CSVLink>
            <button onClick={exportToExcel}>
              <img className=" size-8" src={Excel} alt="excel image" />
            </button>
          </div>
        </div>
        <div className="mx-1 overflow-auto no-scrollbar ">
          <table className="w-full">
            <thead className="">
              <tr className="  text-xs text-nowrap text-black  bg-cyan-300 ">
                {[
                  "User ID",
                  "Transaction ID",
                  "First Name",
                  "Last Name ",
                  "Email",
                  "Phone",
                  "Date",
                  "Status",
                  "Plan",
                  "Billing Cycle",
                  "Amount",
                  "Next Renewal",
                  "Payment Method",
                  "Referred By Email",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="p-2 border-gray-100 border-[1px] "
                  >
                    <h1 className="flex items-center justify-center  gap-1">
                      {heading}
                    </h1>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-100 font-extralight text-sm  ">
              {sub &&
                sub.map((data, index) => (
                  <tr className=" text-nowrap text-center" key={index}>
                    <td className="p-1 border border-slate-100  ">
                      {data._id}
                    </td>
                    <td className=" p-1 border border-slate-100 capitalize ">
                      {data.fname}{" "}
                    </td>
                    <td className="p-1 border border-slate-100 capitalize ">
                      {data.lname}
                    </td>
                    <td className="p-1 border border-slate-100">
                      {data.email}
                    </td>
                    <td className="p-1 border border-slate-100">
                      {data.phone}
                    </td>
                    <td className="p-1 border border-slate-100">
                      {formatDate2(data.date)}
                    </td>
                    <td className="p-1 border border-slate-100 px-2 capitalize ">
                      {" "}
                      {data.plan}
                    </td>
                    <td className="p-1 border border-slate-100 ">
                      {data.amount}
                    </td>
                    <td className="p-1 border border-slate-100 ">
                      {data.subscriberId}
                    </td>
                    <td className="p-1 border border-slate-100 capitalize">
                      {data.method}
                    </td>
                    <td className="p-1 border border-slate-100 capitalize">
                      {data.method}
                    </td>
                    <td className="p-1 border border-slate-100 capitalize">
                      {data.method}
                    </td>
                    <td className="p-1 border border-slate-100 capitalize">
                      {data.method}
                    </td>
                    <td className="p-1 border border-slate-100 capitalize">
                      {data.method}
                    </td>
                    <td className=" p-1 border-b border-r border-slate-100 flex  justify-center items-center  ">
                      {hasViewPermission && (
                        <p
                          onClick={() =>  navigate("/viewinvoice",{state:{
                            subId:data._id
                          }})}
                          className=" cursor-pointer p-2  text-green-600 "
                        >
                          <FaEye size={24} />
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    
    </>
  );
};

export default Subscription;
