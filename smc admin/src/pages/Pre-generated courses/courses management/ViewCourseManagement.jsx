import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import PaginationBar from "../../../components/PaginationBar";
import Image from "../../../assets/Courses.jpeg";
import TableCourseManagement from "./TableCourseMangement";
import axios from "axios";
import { API, formatDate } from "../../../Host";
import { useLocation } from "react-router-dom";

const ViewCourseManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState({});
  const location = useLocation();
  const courseId = location?.state?.courseId
  console.log(courseId);
  


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/api/getprecourseId?courseId=${courseId}`);
        console.log(response);
        
        const responseData = response.data.data;
        console.log(responseData,"curr");
        

        setCurrentItems(responseData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <>
      <div className="mx-2 mt-6 font-poppins h-full">
        <div className=" mx-2   gap-4  ">
          {currentItems &&
         
              <div className=" grid grid-cols-12  p-4 text-white rounded-2xl bg-darkest-blue ">
                <img
                  src={currentItems.photo}
                  alt="Course"
                  className=" col-span-3 h-full w-full rounded-2xl  "
                />
                <div className=" col-span-6 text-xs font-extralight px-4 leading-relaxed">
                  <p>
                    <span>Date:</span>
                    {formatDate(currentItems.createdAt)}
                  </p>
                  <p className="capitalize">{currentItems.mainTopic}</p>

                  <p>
                    <span>Type:</span>
                    {currentItems.type}
                  </p>
                  <p>
                    <span>No Of subtopic:</span> 05
                  </p>
                  <p>
                    <span>Language:</span> {currentItems.lang}
                  </p>
                  <p>
                    <span>Category:</span> {currentItems.category}
                  </p>
                  <p>
                    <span>Sub Category 1:</span>
                    {currentItems.subCategory1}
                  </p>
                  <p>
                    <span>Sub Category 2:</span> {currentItems.subCategory2}
                  </p>
                  <p>
                    {/* <span>Accessed Count:</span> {currentItems.user.length} */}
                  </p>
                  <p>
                    <span>Completed Count:</span> 25
                  </p>
                </div>
                <div className="flex  justify-center  items-center col-span-7 ">
                  <p className=" cursor-pointer bg-teal-400 text-black px-7 py-1 rounded-sm text-sm">
                    View
                  </p>
                </div>
              </div>
            }
        </div>
        <div className="flex items-center gap-2">
          <p className="py-2 flex items-center  ">
            <input
              type="text"
              placeholder="Search by email,phone,name,id"
              className="text-white placeholder:text-white rounded-l-full px-4 py-2 w-66   bg-darkest-blue outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="text-white font-bold bg-darkest-blue rounded-r-full pr-4 py-2">
              <Search />
            </button>
          </p>
          <select
            defaultValue=""
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              User Type
            </option>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
        </div>
        <TableCourseManagement />
      </div>
    </>
  );
};

export default ViewCourseManagement;
