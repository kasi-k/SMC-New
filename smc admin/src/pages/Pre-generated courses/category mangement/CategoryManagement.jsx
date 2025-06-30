import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../../Host";
import BulkUpload from "../../../components/BulkUpload";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/DeleteModal";

const categorysample = `category,subCategory1,subCategory2
Engineering,Mechanical,Strength of Materials
Engineering,Mechanical,Fluid Mechanics
Engineering,Mechanical,Machine Design
Engineering,Mechanical,CAD
Engineering,CSE,Algorithms
Science,Physics,Quantum Mechanics`;
const CategoryManagement = () => {
  const [currentItems, setCurrentItems] = useState([]);
  const [bulkUpload, setBulkUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchCategory();
  }, [isDeleteModal]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API}/api/getAllCategoriesTable`, {
        // params: {
        //   page: currentPage,
        //   limit: itemsPerPage,
        //   search: searchQuery,
        //   category: category,
        //   subCategory1: subcategory1,
        //   subCategory2: subcategory2,
        // },
      });
      console.log(response);

      const responseData = response.data.data;

      setCurrentItems(responseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API}/api/uploadcategories`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("File uploaded successfully");
        setFile(null);
        fetchCategory();
        setBulkUpload(false);
      } else {
        toast.error("Data failed to Upload");
      }
    } catch (error) {
      toast.error("Upload failed!");
      console.log(error);
    }
  };

  const handleDeleteModal = (id) => {
    setOnDelete(`${API}/api/deletesubcategory1course/${id}`);
    setIsDeleteModal(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  return (
    <>
      {bulkUpload === false && (
        <div className=" font-poppins h-full mt-10 mx-4">
          <div className="mx-2 flex items-center justify-between gap-2">
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
            <div className="flex  gap-2">
              <p
                className=" cursor-pointer bg-white rounded-sm text-black flex items-center px-2 gap-2"
                onClick={() => setBulkUpload(true)}
              >
                <GoPlus /> Bulk upload
              </p>
              <p
                onClick={() => navigate("addcategorymanagement")}
                className=" cursor-pointer bg-cyan-300 rounded-sm text-black flex items-center px-2 gap-2"
              >
                <GoPlus /> Add Category
              </p>
            </div>
          </div>
          <div className="mx-2 my-2 overflow-auto no-scrollbar  ">
            <table className=" w-full">
              <thead className="text-slate-300">
                <tr className="text-sm font-medium text-nowrap text-black  bg-cyan-300 ">
                  <th className="p-2.5 border border-slate-100">Category Id</th>

                  <th className=" border border-slate-100 text-nowrap">
                    Category Name
                  </th>
                  <th className=" border border-slate-100">
                    Sub Category 1 ID
                  </th>
                  <th className="border border-slate-100">
                    Sub Category 1 Name
                  </th>
                  <th className=" border border-slate-100">
                    Sub Category 2 ID
                  </th>
                  <th className=" border border-slate-100">
                    Sub Category 2 Name
                  </th>
                  {/* <th className=" border border-slate-100">No Of Courses</th> */}
                  <th className="border border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody className=" ">
                {currentItems &&
                  currentItems.map((data, index) => (
                    <tr
                      className=" text-nowrap text-center bg-white text-black"
                      key={index}
                    >
                      <td className="border border-slate-100 px-2 ">
                        {data?.categoryId}
                      </td>
                      <td className="border border-slate-100 capitalize">
                        {data.category}
                      </td>
                      <td className="border border-slate-100 capitalize px-2">
                        {data.subCategory1Id}
                      </td>
                      <td className="border border-slate-100">
                        {data.subCategory1}
                      </td>
                      <td className="border border-slate-100 px-2">
                        {data.subCategory2Id}
                      </td>
                      <td className="border border-slate-100  capitalize">
                        {data.subCategory2}
                      </td>
                      {/* <td className="border border-slate-100 capitalize">
                        {" "}
                        15
                      </td> */}
                      <td className=" p-2.5 gap-4 border-slate-100 flex  justify-center items-center  ">
                        <p className=" cursor-pointer  text-cyan-400 ">
                          <BiSolidEdit size={22} />
                        </p>
                        <p
                          onClick={() => {
                            handleDeleteModal(data.subCategory2Id);
                          }}
                          className=" cursor-pointer  text-red-500 "
                        >
                          <RiDeleteBin5Fill size={20} />
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {bulkUpload === true && (
        <BulkUpload
          onClose={() => setBulkUpload(false)}
          title=" Categories"
          sampleData={categorysample}
          filename="category Sample"
          onUpload={handleUpload}
          setFile={setFile}
          file={file}
        />
      )}
      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="category"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default CategoryManagement;
