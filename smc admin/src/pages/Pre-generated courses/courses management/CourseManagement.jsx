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
  const [category, setCategory] = useState("");
  const [subcategory1, setSubCategory1] = useState("");
  const [subcategory2, setSubCategory2] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/api/precourseslimit`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            category: category,
            subCategory1: subcategory1,
            subCategory2: subcategory2,
          },
        });
        const responseData = response.data.data;

        setCurrentItems(responseData);
        setTotalPages(response.data.metadata.totalPages);
        setTotalItems(response.data.metadata.totalItems);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [currentPage, itemsPerPage, searchQuery,category, subcategory1, subcategory2]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API}/api/getcategorycourse`);

      if (Array.isArray(response.data.cate)) {
        setOptions(response.data.cate);
      } else {
        console.error("Expected an array of  options, but got:", response.data);
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
    const handleCourse = (content, mainTopic, type, courseId, completed, end) => {

    localStorage.setItem("courseId", courseId);
    localStorage.setItem("first", completed);
 
    navigate("viewcoursemanagement", {
      state: {
     
 
        courseId: courseId,
     
      },
    });
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
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              Select Category
            </option>
            {options.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>

          <select
            value={subcategory1}
            onChange={(e) => {
              setSubCategory1(e.target.value);
              setCurrentPage(1);
            }}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              Select Sub Category 1
            </option>
            {options.map((cat) => (
              <option key={cat.subCategory1} value={cat.subCategory1}>
                {cat.subCategory1}
              </option>
            ))}
          </select>

          <select
            value={subcategory2}
            onChange={(e) => {
              setSubCategory2(e.target.value);
              setCurrentPage(1);
            }}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              Select Sub Category 2
            </option>
            {options.map((cat) => (
              <option key={cat.subCategory2} value={cat.subCategory2}>
                {cat.subCategory2}
              </option>
            ))}
          </select>
        </div>
        <div className=" mx-2 grid grid-cols-1  md:grid-cols-6 lg:grid-cols-12  gap-4 py-4  ">
          {currentItems &&
            currentItems.map((precourse, index) => (
              <div
                className="col-span-6 grid grid-cols-12  p-4 text-white rounded-2xl bg-darkest-blue "
                key={index}
              >
                <img
                  src={precourse.photo || photo}
                  alt="Course"
                  className=" col-span-6 h-full w-full rounded-2xl  "
                />
                <div className=" col-span-6 text-xs font-extralight px-4 leading-relaxed">
                  <p>
                    <span>Date:</span>
                    {formatDate(precourse.createdAt)}
                  </p>
                  <p className="capitalize">{precourse.mainTopic}</p>

                  <p>
                    <span>Type:</span>
                    {precourse.type}
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
                    <span>Sub Category 1:</span>
                    {precourse.subCategory1}
                  </p>
                  <p>
                    <span>Sub Category 2:</span> {precourse.subCategory2}
                  </p>
                  <p>
                    <span>Accessed Count:</span> {precourse.user.length}
                  </p>
                  <p>
                    <span>Completed Count:</span> 25
                  </p>
                </div>
                <div
               
                  className="flex mt-2  justify-end items-center col-span-8 -mx-2"
                >
                  <p onClick={() =>
                            handleCourse(
                              precourse.content,
                              precourse.mainTopic,
                              precourse.type,
                              precourse._id,
                              precourse.completed,
                              precourse.end
                            )
                          } className=" cursor-pointer bg-teal-400 text-black px-7 py-1 rounded-md text-sm">
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
