import React, { useEffect, useState } from "react";
import Pdf from "../../assets/pdf.png";
import Csv from "../../assets/csv.png";
import Excel from "../../assets/excel.png";
import Pagination from "../../components/Pagination";
import { FaEye } from "react-icons/fa6";
import Delete from "../../assets/delete.png";
import DeleteModal from "../../components/DeleteModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../Host";
import { formatDate2 } from "../../Host";
import * as XLSX from "xlsx"; // For Excel export
import { CSVLink } from "react-csv"; // For CSV export
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Courses = ({ permissions }) => {
  const hasCreatePermission = permissions?.includes("create");
  const hasViewPermission = permissions?.includes("view");
  const hasDeletePermission = permissions?.includes("delete");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchNewCourses();
  }, [isDeleteModal]);

  const itemsPerPage = 10;

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedData = courses.slice(startIndex, startIndex + itemsPerPage);
    setData(selectedData);
  }, [currentPage,courses]);

  const fetchNewCourses = async () => {
    try {
      const response = await axios.get(`${API}/api/getcourses`);
      const responseData = response.data;
      setCourses(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/deletecourse/${dataId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Prepare table data for export (exclude unnecessary fields like IDs)
  const getExportData = () => {
    return courses.map((data) => ({
      "User Id": data._id,
      "First Name": data.fname,
      "Last Name": data.lname,
      Email: data.email,
      Phone: data.phone,
      Topic: data.mainTopic,
      Type: data.type,
      Date: formatDate2(data.date),
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
      { wpx: 120 },
      { wpx: 100 },
    ];

    ws["!cols"] = wscols; // Set the column widths
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "courses");
    XLSX.writeFile(wb, "SMC_courses.xlsx");
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
      "Topic",
      "Type",
      "Date",
    ];

    // Prepare the rows data for the table
    const rows = getExportData().map((userData) => [
      userData["User Id"],
      userData["First Name"],
      userData["Last Name"],
      userData["Email"],
      userData["Phone"],
      userData["Topic"],
      userData["Type"],
      userData["Date"],
    ]);

    // Add the table to the PDF
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

    doc.save("SMC_courses.pdf");
  };
  const handleCourse = (content, mainTopic, type, courseId, completed, end) => {
    const jsonData = JSON.parse(content);
    localStorage.setItem("courseId", courseId);
    localStorage.setItem("first", completed);
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
    let ending = "";
    if (completed) {
      ending = end;
    }
    navigate("/content", {
      state: {
        jsonData: jsonData,
        mainTopic: mainTopic.toUpperCase(),
        type: type.toLowerCase(),
        courseId: courseId,
        end: ending,
      },
    });
  };
  return (
    <>
      <div className=" font-extralight">
        <div className="flex justify-between items-center my-2">
          <p className=" mx-2 mt-6">Courses</p>
          <div className=" mx-2 flex gap-6 mt-4">
            <button onClick={exportToPDF}>
              <img className="size-8" src={Pdf} alt="Pdf image" />
            </button>
            <CSVLink
              data={getExportData()}
              filename={"SMC_courses.csv"}
              className="cursor-pointer"
              target="_blank"
            >
              <img className="size-8" src={Csv} alt="csv image" />
            </CSVLink>
            <button onClick={exportToExcel}>
              <img className="size-8 " src={Excel} alt="excel image" />
            </button>
          </div>
        </div>
        <div className="mx-1 overflow-auto no-scrollbar  ">
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
                <th className="font-extralight border border-slate-400">
                  Topic
                </th>
                <th className="font-extralight border border-slate-400">
                  Type
                </th>
                <th className="font-extralight border border-slate-400">
                  Date
                </th>
                <th className="font-extralight border border-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-400 ">
              {data &&
                data.map((data, index) => (
                  <tr className=" text-nowrap text-center" key={index}>
                    <td className="border border-slate-400">{data._id}</td>
                    <td className="border border-slate-400 capitalize">
                      {data.fname}
                    </td>
                    <td className="border border-slate-400 capitalize">
                      {data.lname}
                    </td>
                    <td className="border border-slate-400">{data.email}</td>
                    <td className="border border-slate-400">{data.phone}</td>
                    <td className="border border-slate-400  capitalize">
                      {data.mainTopic}
                    </td>
                    <td className="border border-slate-400 capitalize">
                      {" "}
                      {data.type}
                    </td>
                    <td className="border border-slate-400 text-slate-500 ">
                      {formatDate2(data.date)}
                    </td>
                    <td className=" border-b border-r border-slate-400 flex items-center justify-evenly  ">
                      {hasViewPermission && (
                        <p
                          onClick={() =>
                            handleCourse(
                              data.content,
                              data.mainTopic,
                              data.type,
                              data._id,
                              data.completed,
                              data.end
                            )
                          }
                          className=" cursor-pointer p-2  text-green-600 "
                        >
                          <FaEye size={24} />
                        </p>
                      )}
                      {hasDeletePermission && (
                        <p
                          onClick={() => handleDeleteModal(data._id)}
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
      <Pagination
        totalItems={courses.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="Course"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default Courses;
