import React, { useEffect, useRef, useState } from "react";
import Pdf from "../../assets/pdf.png";
import Csv from "../../assets/csv.png";
import Excel from "../../assets/excel.png";
import { BiSolidEdit } from "react-icons/bi";
import DeleteModal from "../../components/DeleteModal";
import { RiDeleteBin5Fill } from "react-icons/ri";
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
import { MdBlock } from "react-icons/md";
import { FiUnlock } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import BulkUpload from "../../components/BulkUpload";

const csvData = `id,status,fname,email,lname,phone,dob,type,company,coursegenerated,pregeneratecourses,quizattempted,studygroups
1,Active,john,user@gmail.com,doe,9784561230,11-25-2024,free,seenit,1,1,10,1`;

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
  const [bulkUploadUers, setBulkUploadUsers] = useState(false);

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

const handleUpload = async () => {
  if (!file) {
    toast.error("Please select a file to upload.");
    return;
  }
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
    } else {
      toast.error("Data failed to Upload");
    }
  } catch (error) {
    toast.error("Upload failed!");
    console.log(error);
  }
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
      {bulkUploadUers === false && (
        <>
          <div className="mx-2 mt-8 font-poppins h-full">
            <div className="flex justify-end gap-2">
              {hasCreatePermission && (
                <button
                  onClick={handleAddUserModal}
                  className=" flex items-center gap-2 cursor-pointer  rounded bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-nowrap py-1 lg:px-4 md:px-4 px-1"
                >
                  <LuPlus /> Add user
                </button>
              )}
              <p
                onClick={() => setBulkUploadUsers(true)}
                className=" cursor-pointer flex items-center gap-2 bg-white text-black rounded py-1 px-4"
              >
                <LuPlus />
                Bulk Upload users
              </p>
            </div>
            <div className="flex justify-between items-center my-2 ">
              <p className="mx-2 mt-6">User</p>
              <div className="flex  items-center gap-3 mt-4">
                {/* <button onClick={exportToPDF}>
              <img className="size-8" src={Pdf} alt="Pdf image" />
            </button> */}

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

              </div>
            </div>
            <div className="mx-1 overflow-auto no-scrollbar ">
              <table className="w-full ">
                <thead className="font-semibold   text-black  bg-cyan-300 ">
                  <tr>
                    <th className=" font-extralight border border-slate-400">
                      Id
                    </th>
                    {/* <th className="font-extralight border border-slate-400">
                      Status
                    </th> */}
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
                    <th className="font-extralight border border-slate-400">
                      DOB
                    </th>
                    <th className="font-extralight border border-slate-400">
                      Plan
                    </th>
                    <th className="font-extralight border border-slate-400">
                      Courses Generated
                    </th>
                    <th className="font-extralight border border-slate-400">
                      Pregenerated Courses
                    </th>
                    <th className="font-extralight border border-slate-400">
                      Quizzes Attempted
                    </th>
                    <th className="font-extralight border border-slate-400">
                      Study Groups
                    </th>

                    <th className="font-extralight border border-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-black ">
                  {user &&
                    user.map((data, index) => (
                      <tr className="text-nowrap text-center" key={index}>
                        <td className="p-2 border border-slate-400">
                          {data._id}
                        </td>
                        {/* <td className="border border-slate-400">
                          {" "}
                          {data.blocked ? "Blocked" : "Active"}
                        </td> */}
                        <td className="border border-slate-400 capitalize">
                          {data.fname}
                        </td>
                        <td className="border border-slate-400 capitalize">
                          {data.lname}
                        </td>
                        <td className="border border-slate-400">
                          {data.email}
                        </td>
                        <td className="border border-slate-400">
                          {data.phone}
                        </td>
                        <td className="border border-slate-400">
                          {formatDate2(data.dob)}
                        </td>
                        <td className="border border-slate-400">{data.type}</td>
                        <td className="border border-slate-400">0</td>
                        <td className="border border-slate-400">0</td>
                        <td className="border border-slate-400">0</td>
                        <td className="border border-slate-400">0</td>

                        <td className="border-b border-r border-slate-400 flex items-center justify-around p-2.5 gap-2">
                          {hasEditPermission && (
                            <p
                              onClick={() =>
                                navigate(`/edituser`, {
                                  state: {
                                    userId: data._id,
                                  },
                                })
                              }
                              className="cursor-pointer  text-cyan-300"
                            >
                              <BiSolidEdit size={22} />
                            </p>
                          )}
                          {/* <p className="cursor-pointer">
                            {data.blocked ? (
                              <FiUnlock size={22} className="text-cyan-300" />
                            ) : (
                              <MdBlock size={22} className="text-red-500" />
                            )}
                          </p> */}
                          {hasDeletePermission && (
                            <p
                              onClick={() => {
                                handleDeleteModal(data._id);
                              }}
                              className="cursor-pointer text-red-500"
                            >
                              <RiDeleteBin5Fill size={22} />
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
      )}
      {
        bulkUploadUers === true && (
          <BulkUpload onClose={()=>setBulkUploadUsers(false)} title="Users" sampleData={csvData} onUpload={handleUpload} filename="Userdata" setFile={setFile}   file={file} />
        )
      }
    </>
  );
};

export default User;
