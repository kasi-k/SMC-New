import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import PaginationBar from "../../../components/PaginationBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, formatDate } from "../../../Host";

const Quizzes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories1, setSubCategories1] = useState([]);
  const [subCategories2, setSubCategories2] = useState([]);

  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subcategory1, setSubCategory1] = useState("");
  const [subcategory1Name, setSubCategory1Name] = useState("");
  const [subcategory2, setSubCategory2] = useState("");
  const [subcategory2Name, setSubCategory2Name] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/getonlyCategory`);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subCategory1 when category changes
  useEffect(() => {
    if (category) {
      const fetchSubCategory1 = async () => {
        try {
          const res = await axios.get(`${API}/api/getbasedOnCategory`, {
            params: { category },
          });
          setSubCategories1(res.data.data || []);
          setSubCategory1(""); // Reset subCategory1
          setSubCategory1Name(""); // Reset subCategory1Name
          setSubCategory2(""); // Reset subCategory2
          setSubCategory2Name(""); // Reset subCategory2Name
        } catch (error) {
          console.error("Error fetching subCategory1:", error);
        }
      };

      fetchSubCategory1();
    } else {
      setSubCategories1([]);
      setSubCategory1("");
      setSubCategory1Name("");
      setSubCategory2("");
      setSubCategory2Name("");
    }
  }, [category]);

  // Fetch subCategory2 when subCategory1 changes
  useEffect(() => {
    if (subcategory1) {
      const fetchSubCategory2 = async () => {
        try {
          const res = await axios.get(`${API}/api/getbasedOnSubategory1`, {
            params: { subCategory1: subcategory1 },
          });
          setSubCategories2(res.data.data || []);
          setSubCategory2(""); // Reset subCategory2
          setSubCategory2Name(""); // Reset subCategory2Name
        } catch (error) {
          console.error("Error fetching subCategory2:", error);
        }
      };

      fetchSubCategory2();
    } else {
      setSubCategories2([]);
      setSubCategory2("");
      setSubCategory2Name("");
    }
  }, [subcategory1]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/api/precourseslimit`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            category: categoryName,
            subCategory1: subcategory1Name,
            subCategory2: subcategory2Name,
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
  }, [
    currentPage,
    itemsPerPage,
    searchQuery,
    category,
    subcategory1,
    subcategory2,
  ]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleCourse = (content, mainTopic, type, courseId, completed, end) => {
    localStorage.setItem("courseId", courseId);
    localStorage.setItem("first", completed);

    navigate("/viewquiz", {
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
              const selectedId = e.target.value;
              const selectedCat = categories.find(
                (cat) => cat._id === selectedId
              );

              if (selectedCat) {
                setCategory(selectedId);
                setCategoryName(selectedCat.name);
              } else {
                setCategory("");
                setCategoryName("");
              }

              // Reset child selects
              setSubCategory1("");
              setSubCategory1Name("");
              setSubCategory2("");
              setSubCategory2Name("");

              setCurrentPage(1);
            }}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={subcategory1}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedSC1 = subCategories1.find(
                (sc1) => sc1._id === selectedId
              );

              if (selectedSC1) {
                setSubCategory1(selectedId);
                setSubCategory1Name(selectedSC1.name);
              } else {
                setSubCategory1("");
                setSubCategory1Name("");
              }

              // Reset subCategory2
              setSubCategory2("");
              setSubCategory2Name("");

              setCurrentPage(1);
            }}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
            disabled={!category}
          >
            <option value="">All SubCategory1</option>
            {subCategories1.map((sc1) => (
              <option key={sc1._id} value={sc1._id}>
                {sc1.name}
              </option>
            ))}
          </select>

          <select
            value={subcategory2}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedSC2 = subCategories2.find(
                (sc2) => sc2._id === selectedId
              );

              if (selectedSC2) {
                setSubCategory2(selectedId);
                setSubCategory2Name(selectedSC2.name);
              } else {
                setSubCategory2("");
                setSubCategory2Name("");
              }

              setCurrentPage(1);
            }}
            className="text-white placeholder:text-white rounded-full px-4 py-2 bg-darkest-blue outline-none"
            disabled={!subcategory1}
          >
            <option value="">All SubCategory2</option>
            {subCategories2.map((sc2) => (
              <option key={sc2._id} value={sc2._id}>
                {sc2.name}
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
                  src={precourse.photo}
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
                    <span>Language:</span> {precourse.lang}
                  </p>

                  <p>
                    <span>No Of Questions:</span> 10
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
                <div className="flex mt-2  justify-end items-center col-span-8 -mx-2">
                  <p
                    onClick={() =>
                      handleCourse(
                        precourse.content,
                        precourse.mainTopic,
                        precourse.type,
                        precourse._id,
                        precourse.completed,
                        precourse.end
                      )
                    }
                    className=" cursor-pointer bg-teal-400 text-black px-7 py-1 rounded-md text-sm"
                  >
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

export default Quizzes;
