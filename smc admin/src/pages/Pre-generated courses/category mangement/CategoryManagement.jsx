import { Search } from "lucide-react";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CategoryManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate=useNavigate();

  return (
    <>
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
            <p className=" cursor-pointer bg-white rounded-sm text-black flex items-center px-2 gap-2">
              <GoPlus /> Bulk upload
            </p>
            <p onClick={()=>navigate("addcategorymanagement")} className=" cursor-pointer bg-cyan-300 rounded-sm text-black flex items-center px-2 gap-2">
              <GoPlus /> Add Category
            </p>
          </div>
        </div>
        <div className="mx-2 my-2 overflow-auto no-scrollbar  ">
          <table className=" w-full">
            <thead className="text-slate-300">
              <tr className="text-sm font-medium text-nowrap text-black  bg-cyan-300 ">
                <th className="p-2.5 border border-slate-100">User Id</th>
            
                <th className=" border border-slate-100 text-nowrap">
                  Category Name
                </th>
                <th className=" border border-slate-100">Sub Category 1 ID</th>
                <th className="border border-slate-100">Sub Category 1 Name</th>
                <th className=" border border-slate-100">Sub Category 2 ID</th>
                <th className=" border border-slate-100">
                  Sub Category 2 Name
                </th>
                <th className=" border border-slate-100">No Of Courses</th>
                <th className="border border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody className=" ">
              <tr className=" text-nowrap text-center bg-white text-black">
                <td className="border border-slate-100 ">5348</td>
                <td className="border border-slate-100 capitalize">Technology</td>
                <td className="border border-slate-100 capitalize">5348</td>
                <td className="border border-slate-100">
                Development
                </td>
                <td className="border border-slate-100">5348</td>
                <td className="border border-slate-100  capitalize">
                  Python
                </td>
                <td className="border border-slate-100 capitalize">
                  {" "}
                  15
                </td>
                 <td className=" p-2.5 gap-4 border-slate-100 flex  justify-center items-center  ">
                                
                                     <p
                                    
                                       className=" cursor-pointer  text-cyan-400 "
                                     >
                                       <BiSolidEdit size={22} />
                                     </p>
                                     <p
                                    
                                       className=" cursor-pointer  text-red-500 "
                                     >
                                       <RiDeleteBin5Fill  size={20} />
                                     </p>
                                 
                                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
