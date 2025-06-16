import React, { useEffect, useState } from "react";
import EditImage from "../../assets/edit.png";
import BinImage from "../../assets/bin.png";
import axios from "axios";
import { API } from "../../Host";
import DeleteModal from "../../components/DeleteModal";
import AddCategory from "./AddCategory";
import { toast } from "react-toastify";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const [onEdit, setOnEdit] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [addCategory, setAddCategory] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [isDeleteModal]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API}/api/getcategory`);
      const responseData = response.data.cate;
      setCategory(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateCategory = async () => {
    try {
      const response = await axios.put(`${API}/api/category/${onEdit}`, {
        category: editValue,
      });

      if (response.status === 200) {
        fetchCategory();
        setOnEdit(null);
        setEditValue("");
        toast.success("Category Updated Successfully");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/category/${dataId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };
  const handleEditModal = (categoryId, categoryName) => {
    setOnEdit(categoryId);
    setEditValue(categoryName);
    setAddCategory(false);
  };

  const handleAddModal = () => {
    setAddCategory(!addCategory);
    setOnEdit(null);
  };

  return (
    <>
      <div className="-mt-14 font-extralight bg-[#000928] h-fit  mx-2 lg:w-4/5 md:w-5/6 w-4/5 p-1.5 my-2">
        <p className=" mx-3 lg:mt-0.5 md:mt-0.5 mt-6 mb-4 place-self-end cursor-pointer " onClick={() => handleAddModal()}>
          Add Category
        </p>
        <hr />
        {category &&
          category.map((data, index) => (
            <div key={index}>
              <div className="flex justify-between mx-4 py-2 ">
                <p className="capitalize">{data.category}</p>
                <div className="flex mr-6 size-4 gap-2 cursor-pointer">
                  <img
                    onClick={() => handleEditModal(data._id, data.category)}
                    src={EditImage}
                    alt="Edit image"
                  />
                  <img
                    onClick={() => {
                      handleDeleteModal(data._id);
                    }}
                    src={BinImage}
                    alt="Delete image"
                  />
                </div>
              </div>{" "}
              <hr />
            </div>
          ))}

        {isDeleteModal && (
          <DeleteModal
            onClose={handleCloseModal}
            title="category"
            onDelete={onDelete}
          />
        )}
      </div>
      {onEdit !== null && (
        <div className=" font-extralight my-12 mx-4 space-y-6  lg:w-4/5 md:w-5/6 w-4/5 p-1.5 ">
          <p>Edit Category</p>
          <input
            type="text"
            value={editValue}
            placeholder=" Enter Category Name"
            className="rounded-md w-4/5 py-1.5 px-1 text-black"
            onChange={(e) => setEditValue(e.target.value)}
          />
          <button
            onClick={handleUpdateCategory}
            className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5 mx-2"
          >
            Update
          </button>
          <button
            onClick={() => setOnEdit(null)}
            className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5"
          >
            Cancel
          </button>
        </div>
      )}
      {addCategory && (
        <AddCategory
          onClose={() => setAddCategory(false)}
          fetchCategory={fetchCategory}
        />
      )}
    </>
  );
};

export default Category;
