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
import PaginationBar from "../../components/PaginationBar";

const csvData = `si,fname,email,lname,phone,dob,type,company
1,john,user20@gmail.com,doe,9784561230,11-25-2024,free,seenit`;

const User = ({ permissions }) => {
  const hasCreatePermission = permissions?.includes("create");
  const hasEditPermission = permissions?.includes("edit");
  const hasDeletePermission = permissions?.includes("delete");
  const hasDownloadPermission = permissions?.includes("download");
  const hasViewPermission = permissions?.includes("view");
  const [user, setUser] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const [file, setFile] = useState(null);
  const [buttonText, setButtonText] = useState("Bulk Upload");
  const fileInputRef = useRef(null);
  const plan = localStorage.getItem("plan");
  const courses = localStorage.getItem("courses");
    const [currentPage, setCurrentPage] = useState(1);
      const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNewUser();
  }, [isDeleteModal]);

  const fetchNewUser = async () => {
    try {
      const response = await axios.get(`${API}/api/getusers`);
      const responsedata = response.data.user;
      setUser(responsedata);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCourses = user.filter((user) =>
    user.fname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/deleteuser?id=${dataId}`);
    setIsDeleteModal(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  const handleAddUserModal = () => {
    navigate("/adduser");
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

      const response = await axios.post(`${API}/api/useruploadcsv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("File uploaded successfully");
        setButtonText("Bulk Upload");
        setFile(null);
        fetchNewUser();
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
    a.download = "bulkupload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownload = () => {
    downloadCSV(csvData);
  };

  const getExportData = () => {
    return user.map((data) => ({
      "User Id": data._id,
      "First Name": data.fname,
      "Last Name": data.lname,
      Email: data.email,
      Phone: data.phone,
      DOB: formatDate2(data.dob),
      Plan: data.type, // Or any other plan logic
      // Courses: 2, // Or any dynamic value you want to show
      // "Subscription Date": "22-05-1990", // Adjust based on your needs
    }));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getExportData());
    const wscols = [
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 180 },
      { wpx: 100 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 100 },
    ];
    ws["!cols"] = wscols;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "SMC_users.xlsx");
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "User Id",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "DOB",
      "Plan",
      "Courses",
      "Subscription Date",
    ];

    const rows = getExportData().map((userData) => [
      userData["User Id"],
      userData["First Name"],
      userData["Last Name"],
      userData["Email"],
      userData["Phone"],
      userData["DOB"],
      userData["Plan"],
      userData["Courses"],
      userData["Subscription Date"],
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

    doc.save("SMC_users.pdf");
  };
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  return (
    <>
      <div className="mx-2 font-poppins h-full">
        <div className="flex justify-between items-center my-2 ">
          <p className="mx-2 mt-6">User</p>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={exportToPDF}>
              <img className="size-8" src={Pdf} alt="Pdf image" />
            </button>

            <CSVLink
              data={getExportData()}
              filename={"SMC_users.csv"}
              className="cursor-pointer"
              target="_blank"
            >
              <img className="size-8" src={Csv} alt="csv image" />
            </CSVLink>

            <button onClick={exportToExcel}>
              <img className="size-8" src={Excel} alt="excel image" />
            </button>

            <div className="flex mx-3 space-x-6">
              <button
                onClick={handleDownload}
                className=" cursor-pointer  rounded-md bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-nowrap py-1 lg:px-4 md:px-4 px-1"
              >
                CSV Template
              </button>
              <button
                onClick={handleButtonClick}
                className=" cursor-pointer  rounded-md bg-white text-nowrap text-black py-1 lg:px-4 md:px-4 px-1"
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
                  onClick={handleAddUserModal}
                  className=" cursor-pointer  rounded-md bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-nowrap py-1 lg:px-4 md:px-4 px-1"
                >
                  Add user
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mx-1 overflow-auto no-scrollbar ">
          <table className="w-full">
            <thead className="text-nowrap text-slate-300">
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
                  Plan
                </th>
                {/* <th className="font-extralight border border-slate-400">
                  Courses
                </th>
                <th className="font-extralight border border-slate-400">
                  Subscription Date
                </th> */}

                <th className="font-extralight border border-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-400 ">
              {user &&
                user.map((data, index) => (
                  <tr className="text-nowrap text-center" key={index}>
                    <td className="border border-slate-400">{data._id}</td>
                    <td className="border border-slate-400 capitalize">
                      {data.fname}
                    </td>
                    <td className="border border-slate-400 capitalize">
                      {data.lname}
                    </td>
                    <td className="border border-slate-400">{data.email}</td>
                    <td className="border border-slate-400">{data.phone}</td>
                    <td className="border border-slate-400">
                      {formatDate2(data.dob)}
                    </td>
                    <td className="border border-slate-400">{data.type}</td>
                    {/* <td className="border border-slate-400">{courses}</td>
                    <td className="border border-slate-400">22-05-1990</td> */}

                    <td className="border-b border-r border-slate-400 flex justify-around items-center">
                      {hasEditPermission && (
                        <p
                          onClick={() =>
                            navigate(`/edituser`, {
                              state: {
                                userId: data._id,
                              },
                            })
                          }
                          className="cursor-pointer mx-1 p-1 text-green-600"
                        >
                          <img className="size-6" src={Edit} alt="edit image" />
                        </p>
                      )}
                      {hasDeletePermission && (
                        <p
                          onClick={() => {
                            handleDeleteModal(data._id);
                          }}
                          className="cursor-pointer"
                        >
                          <img
                            className="size-6 my-1"
                            src={Delete}
                            alt="delete image"
                          />
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
   
        <PaginationBar
        Length={currentItems.length}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        paginate={paginate}
        hasNextPage={currentPage < totalPages}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
  
      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="user"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default User;
