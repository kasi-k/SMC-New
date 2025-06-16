import React, { useEffect, useState } from "react";
import EditImage from "../../assets/edit.png";
import BinImage from "../../assets/bin.png";
import axios from "axios";
import { API } from "../../Host";
import DeleteModal from "../../components/DeleteModal";
import AddPriority from "./AddPriority";
import { toast } from "react-toastify";

const Priority = () => {
  const [priority, setPriority] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const [onEdit, setOnEdit] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [addPriority, setAddPriority] = useState(false);

  useEffect(() => {
    fetchPriority();
  }, [isDeleteModal]);

  const fetchPriority = async () => {
    try {
      const response = await axios.get(`${API}/api/getpriority`);
      const responseData = response.data.priority;
      setPriority(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdatePriority = async () => {
    try {
      const response = await axios.put(`${API}/api/priority/${onEdit}`, {
        priority: editValue,
      });

      if (response.status === 200) {
        fetchPriority();
        setOnEdit(null);
        setEditValue("");
        toast.success("Priority Updated Successfully");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/priority/${dataId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };
  const handleEditModal = (priorityId, priorityName) => {
    setOnEdit(priorityId);
    setEditValue(priorityName);
    setAddPriority(false);
  };
  const handleAddModal = () => {
    setAddPriority(!addPriority);
    setOnEdit(null);
  };

  return (
    <>
      <div className="-mt-14 font-extralight bg-[#000928] h-fit  mx-2 lg:w-4/5 md:w-5/6 w-4/5 p-1.5 my-2">
        <p className="mx-3 lg:mt-0.5 md:mt-0.5 mt-6 mb-3  place-self-end cursor-pointer" onClick={() => handleAddModal()}>
          Add Priority
        </p>
        <hr />
        {priority &&
          priority.map((data, index) => (
            <div key={index}>
              <div className="flex justify-between mx-4 py-2 ">
                <p className="capitalize">{data.priority}</p>
                <div className="flex mr-6 size-4 gap-2 cursor-pointer">
                  <img
                    onClick={() => handleEditModal(data._id, data.priority)}
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
              </div>
              <hr />
            </div>
          ))}
        {}
        {isDeleteModal && (
          <DeleteModal
            onClose={handleCloseModal}
            title="priority"
            onDelete={onDelete}
          />
        )}
      </div>
      {onEdit !== null && (
        <div className=" font-extralight my-12 mx-4 space-y-6  lg:w-4/5 md:w-5/6 w-4/5 p-1.5 ">
          <p>Edit Priority</p>
          <input
            type="text"
            value={editValue}
            placeholder=" Enter Category Name"
            className="rounded-md w-4/5 py-1.5 px-1 text-black"
            onChange={(e) => setEditValue(e.target.value)}
          />
          <button
            onClick={handleUpdatePriority}
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
      {addPriority && (
        <AddPriority
          onClose={() => setAddPriority(false)}
          fetchPriority={fetchPriority}
        />
      )}
    </>
  );
};

export default Priority;
