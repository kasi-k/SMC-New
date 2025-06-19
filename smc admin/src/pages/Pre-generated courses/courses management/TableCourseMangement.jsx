import React, { useEffect, useState } from "react";
import Pagination from "../../../components/Pagination";

const TableCourseManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);

  const itemsPerPage = 10;

//   useEffect(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const selectedData = courses.slice(startIndex, startIndex + itemsPerPage);
//     setData(selectedData);
//   }, [currentPage, courses]);

  return (
    <>
      <div className=" font-poppins">
 
        <div className="mx-2 my-2 overflow-auto no-scrollbar  ">
          <table className=" w-full">
            <thead className="text-slate-300">
              <tr className="text-sm font-medium text-nowrap text-black  bg-cyan-300 ">
                <th className="p-1.4 border border-slate-100">
                  User Id
                </th>
                <th className=" border border-slate-100 text-nowrap">
                  First Name
                </th>
                <th className=" border border-slate-100 text-nowrap">
                  Last Name
                </th>
                <th className=" border border-slate-100">
                  Email
                </th>
                <th className="border border-slate-100">
                Phone Number
                </th>
                <th className=" border border-slate-100">
                  Course Status
                </th>
                <th className=" border border-slate-100">
                  User Type
                </th>
                <th className=" border border-slate-100">
                  Associated Entity
                </th>
                <th className="border border-slate-100">
                  Start Date
                </th>
                <th className=" ">
                  Completed Date
                </th>
              </tr>
            </thead>
            <tbody className=" ">
         
                  <tr className=" text-nowrap text-center bg-white text-black" >
                    <td className="border border-slate-100">5348</td>
                    <td className="border border-slate-100 capitalize">
                   Aarav
                    </td>
                    <td className="border border-slate-100 capitalize">
                        Sharma
                    </td>
                    <td className="border border-slate-100">aarav.sharma@gmail.com</td>
                    <td className="border border-slate-100">96565588669</td>
                    <td className="border border-slate-100  capitalize">
                     Completed
                    </td>
                    <td className="border border-slate-100 capitalize">
                      {" "}
                   Individual
                    </td>
                    <td className="border border-slate-100 capitalize">
                      {" "}
                   ABC Company
                    </td>
                    <td className="border border-slate-100 ">
                      22-05-2025
                    </td>
                    <td className="border border-slate-100  ">
                      22-05-2025
                    </td>
                
                  </tr>
              
            </tbody>
          </table>
        </div>
      </div>
      {/* <Pagination
        totalItems={courses.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      /> */}
      
    </>
  );
};

export default TableCourseManagement;
