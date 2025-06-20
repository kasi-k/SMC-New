import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import PaginationBar from "../../../components/PaginationBar";
import Image from "../../../assets/Courses.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, formatDate, formatDate1 } from "../../../Host";

const CourseManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [courses, setCourses] = useState([]);
    const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/api/preallcourses`);
      console.log(response);

      const responseData = response.data;
      setCourses(responseData);
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API}/api/getcategorycourse`);
      
      if (Array.isArray(response.data.cate)) {
        setOptions(response.data.cate);
      } else {
        console.error(
          "Expected an array of  options, but got:",
          response.data
        );
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };


  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <>
      <div className="mx-2 mt-6 font-poppins ">
        <div className="flex items-center gap-2">
          <p className="py-2 flex items-center ">
            <input
              type="text"
              placeholder="Search by topicName"
              className="text-white placeholder:text-white rounded-l-full px-4 py-2 bg-darkest-blue outline-none"
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
              Select Category
            </option>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
          <select
            defaultValue=""
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              Select Sub Category 1
            </option>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
          <select
            defaultValue=""
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              Select Sub Category 2
            </option>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
        </div>
        <div className=" mx-2 grid grid-cols-1  md:grid-cols-6 lg:grid-cols-12  gap-4 py-4  ">
          {courses &&
            courses.map((precourse,index) => (
              <div className="col-span-6 grid grid-cols-12  p-4 text-white rounded-2xl bg-darkest-blue "key={index}>
                <img
                  src={Image}
                  alt="Course"
                  className=" col-span-6 h-full w-full rounded-2xl  "
                />
                <div className=" col-span-6 text-xs font-extralight px-4 leading-relaxed">
                  <p>
                    <span>Date:</span>{formatDate(precourse.createdAt)}
                  </p>
                  <p className="capitalize">{precourse.mainTopic}</p>

                  <p>
                    <span>Type:</span>{precourse.type}
                  </p>
                  <p>
                    <span>No Of subtopic:</span> 05
                  </p>
                  <p>
                    <span>Language:</span> {precourse.lang}
                  </p>
                  <p>
                    <span>Category:</span> {precourse.category}
                  </p>
                  <p>
                    <span>Sub Category 1:</span>{precourse.subCategory1}
                  </p>
                  <p>
                    <span>Sub Category 2:</span> {precourse.subCategory2}
                  </p>
                  <p>
                    <span>Accessed Count:</span> 10
                  </p>
                  <p>
                    <span>Completed Count:</span> 25
                  </p>
                </div>
                <div
                  onClick={() => navigate("viewcoursemanagement")}
                  className="flex mt-2  justify-end items-center col-span-8 -mx-2"
                >
                  <p className=" cursor-pointer bg-teal-400 text-black px-7 py-1 rounded-md text-sm">
                    View
                  </p>
                </div>
              </div>
            ))}
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
    </>
  );
};

export default CourseManagement;
