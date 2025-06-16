import React, { useEffect, useRef, useState } from "react";
import Pdf from "../../assets/pdf.png";
import Csv from "../../assets/csv.png";
import Excel from "../../assets/excel.png";
import Edit from "../../assets/pencil.png";
import DeleteModal from "../../components/DeleteModal";
import Delete from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../Host";
import { formatDate2 } from "../../Host";
import * as XLSX from "xlsx"; // For Excel export
import { CSVLink } from "react-csv"; // For CSV export
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

const csvData = `si,fname,email,lname,phone,dob,designation,type,password
1,john,admin12@gmail.com,doe,9784561230,11-25-2024,1,free,Admin@123`;

const Team = ({ permissions }) => {
  const hasCreatePermission = permissions?.includes("create");
  const hasEditPermission = permissions?.includes("edit");
  const hasDeletePermission = permissions?.includes("delete");
  const hasDownloadPermission = permissions?.includes("download");
  const hasViewPermission = permissions?.includes("view");
  const [team, setTeam] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const [file, setFile] = useState(null);
  const [buttonText, setButtonText] = useState("Bulk Upload");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewAdmin();
  }, [isDeleteModal]);

  const fetchNewAdmin = async () => {
    try {
      const response = await axios.get(`${API}/api/getadmin`);
      const responseTeam = response.data.user;
      setTeam(responseTeam);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/deleteadmin/${dataId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  const handleAddTeamModal = () => {
    navigate("/addteam");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setButtonText("Upload");
  };

  const handleButtonClick = () => {
    if (buttonText === "Bulk Upload") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      // Call your  here to upload the file
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API}/api/adminuploadcsv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setButtonText("Bulk Upload");
        setFile(null);
        fetchNewAdmin();
        toast.success("Data Uploaded Successfully");
      } else {
        toast.error("Data failed to Upload");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const downloadCSV = (csvData) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SMC bulkupload_template Team.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownload = () => {
    downloadCSV(csvData);
  };
  // Prepare table data for export (exclude unnecessary fields like IDs)
  const getExportData = () => {
    return team.map((data) => ({
      "User Id": data._id,
      "First Name": data.fname,
      "Last Name": data.lname,
      Email: data.email,
      Phone: data.phone,
      DOB: formatDate2(data.dob),
      Designation: data.designation,
    }));
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getExportData());
    // Format the columns to ensure they have proper width
    const wscols = [
      { wpx: 180 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 180 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
    ];

    ws["!cols"] = wscols; // Set the column widths
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");
    XLSX.writeFile(wb, "SMC_teams.xlsx");
  };

  // Export to PDF with Table Format
  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "User Id",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "DOB",
      "Designation",
    ];

    // Prepare the rows data for the table
    const rows = getExportData().map((userData) => [
      userData["User Id"],
      userData["First Name"],
      userData["Last Name"],
      userData["Email"],
      userData["Phone"],
      userData["DOB"],
      userData["Designation"],
    ]);

    // Add the table to the PDF
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20, // Start position for the table
      theme: "grid", // Optional: to add grid lines
      headStyles: {
        fillColor: [97, 144, 213], // Header background color
        textColor: [255, 255, 255], // Header text color
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [0, 0, 0], // Body text color
        halign: "center",
      },
    });

    doc.save("SMC_teams.pdf");
  };
  return (
    <>
      <div className="font-extralight">
        <div className="flex justify-between items-center my-2 ">
          <p className=" mx-2 mt-6">Team</p>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={exportToPDF}>
              <img className=" size-8" src={Pdf} alt="Pdf image" />
            </button>

            <CSVLink
              data={getExportData()}
              filename={"SMC_teams.csv"}
              className="cursor-pointer"
              target="_blank"
            >
              <img className="size-8" src={Csv} alt="csv image" />
            </CSVLink>

            <button onClick={exportToExcel}>
              <img className=" size-8" src={Excel} alt="excel image" />
            </button>

            <div className=" flex mx-3 space-x-6">
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-nowrap py-1 lg:px-4 md:px-4 px-1"
              >
                CSV Template
              </button>
              <button
                onClick={handleButtonClick}
                className="bg-white text-nowrap text-black py-1 lg:px-4 md:px-4 px-1"
              >
                {buttonText}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </button>
              {hasCreatePermission && (
                <button
                  onClick={handleAddTeamModal}
                  className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  text-nowrap py-1 lg:px-4 md:px-4 px-1  "
                >
                  Add team
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mx-1 overflow-auto no-scrollbar ">
          <table className=" w-full">
            <thead className="text-slate-300">
              <tr>
                <th className="p-2 font-extralight border border-slate-400">
                  User Id
                </th>
                <th className="font-extralight border border-slate-400 text-nowrap">
                  First Name
                </th>
                <th className="font-extralight border border-slate-400 text-nowrap">
                  Last Name
                </th>
                <th className="font-extralight border border-slate-400">
                  Email
                </th>
                <th className="font-extralight border border-slate-400">
                  Phone
                </th>
                <th className="font-extralight border border-slate-400">DOB</th>
                <th className="font-extralight border border-slate-400">
                  Designation
                </th>
                <th className="font-extralight border border-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-400 ">
              {team &&
                team.map((data, index) => (
                  <tr className=" text-nowrap text-center" key={index}>
                    <td className="border border-slate-400 ">{data._id}</td>
                    <td className="border border-slate-400 capitalize">
                      {data.fname}
                    </td>
                    <td className="border border-slate-400 captialize">
                      {data.lname}
                    </td>
                    <td className="border border-slate-400">{data.email}</td>
                    <td className="border border-slate-400">{data.phone}</td>
                    <td className="border border-slate-400">
                      {formatDate2(data.dob)}
                    </td>
                    <td className="border border-slate-400 ">
                      {data.designation}
                    </td>
                    <td className=" border-b border-r border-slate-400 flex justify-around items-center  ">
                      {hasEditPermission && (
                        <p
                          onClick={() =>
                            navigate(`/editteam`, {
                              state: {
                                userId: data._id,
                              },
                            })
                          }
                          className=" cursor-pointer p-1  text-green-600 "
                        >
                          <img className="size-6" src={Edit} alt="edit image" />
                        </p>
                      )}
                      {hasDeletePermission && (
                        <p
                          onClick={() => {
                            handleDeleteModal(data._id);
                          }}
                          className="cursor-pointer size-6"
                        >
                          <img src={Delete} alt="delete image" />
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="team"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default Team;
