import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import TableCourseManagement from "./TableCourseMangement";
import axios from "axios";
import { API, formatDate } from "../../../Host";
import { useLocation, useNavigate } from "react-router-dom";

const ViewCourseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentItems, setCurrentItems] = useState({});
  const [userData, setUserData] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const location = useLocation();
  const courseId = location?.state?.courseId;

  const filteredUserData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return userData.filter((user) => {
      const email = user.userId?.email?.toLowerCase() || "";
      const fname = user.userId?.fname?.toLowerCase() || "";
      const id = user.userId?._id?.toLowerCase() || "";
      const userType = user.userId?.type || "";
      const matchesSearch =
        !query ||
        email.includes(query) ||
        fname.includes(query) ||
        id.includes(query);
      const matchesType = !selectedUserType || userType === selectedUserType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, userData, selectedUserType]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${API}/api/getprecourseId?courseId=${courseId}`
        );
        const responseData = response.data.data;
        setCurrentItems(responseData);
        setUserData(responseData.user);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourse = (content, mainTopic, type, courseId, completed, end) => {
    const jsonData = JSON.parse(content);
    localStorage.setItem("courseId", courseId);
    localStorage.setItem("first", completed);
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
    let ending = "";
    if (completed) {
      ending = end;
    }
    navigate("/contentpregenerate", {
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
      <div className="mx-2 mt-6 font-poppins h-full">
        <div className=" mx-2   gap-4  ">
          {currentItems && (
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
                  <span>Accessed Count:</span> {userData.length}
                </p>
                <p>
                  <span>Completed Count:</span> 25
                </p>
              </div>
              <div
                onClick={() =>
                  handleCourse(
                    currentItems.content,
                    currentItems.mainTopic,
                    currentItems.type,
                    currentItems._id,
                    currentItems.completed,
                    currentItems.end
                  )
                }
                className="flex  justify-center  items-center col-span-7 "
              >
                <p className=" cursor-pointer bg-teal-400 text-black px-7 py-1 rounded-sm text-sm">
                  View
                </p>
              </div>
            </div>
          )}
        </div>
                {filteredUserData.length === 0 ? (
    <div className="text-center text-red-500 font-semibold py-8">
      No users for this course
    </div>
  ) : (
    <>
        <div className="flex items-center gap-2">
          <p className="py-2 flex items-center  ">
            <input
              type="text"
              placeholder="Search by email,phone,name,id"
              className="text-white placeholder:text-white rounded-l-full px-4 py-2 w-66   bg-darkest-blue outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <button className="text-white font-bold bg-darkest-blue rounded-r-full pr-4 py-2">
              <Search />
            </button>
          </p>
          <select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="" disabled>
              User Type
            </option>
            {options.map((type) => (
              <option key={type._id} value={type.packagename}>
                {type.packagename}
              </option>
            ))}
          </select>
        </div>

    <TableCourseManagement userData={filteredUserData} />
    </>
  )}
      </div>
    </>
  );
};

export default ViewCourseManagement;
