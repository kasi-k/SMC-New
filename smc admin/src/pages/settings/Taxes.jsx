import React, { useEffect, useState } from "react";
import EditImage from "../../assets/edit.png";
import BinImage from "../../assets/bin.png";
import AddTax from "./AddTax";
import axios from "axios";
import { API } from "../../Host";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";

const Taxes = () => {
  const [addtaxmodal, setAddTaxModal] = useState(false);
  const [addTax, setAddTax] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState();
  const [onEdit, setOnEdit] = useState(null);
  const [taxname, setTaxName] = useState("");
  const [percentage, setPercentage] = useState("");

  useEffect(() => {
    fetchTax();
  }, [isDeleteModal]);

  const fetchTax = async () => {
    try {
      const response = await axios.get(`${API}/api/gettax`);
      setAddTax(response.data.tax);
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

  const handleUpdateTax = async () => {
    try {
      const response = await axios.put(`${API}/api/taxupdate/${onEdit}`, {
        taxname,
        percentage,
      });

      if (response.status === 200) {
        fetchTax();
        setOnEdit(null);
        setTaxName("");
        setPercentage("");
        toast.success("Tax Updated Successfully");
      }
    } catch (error) {
      console.error("Error updating tax:", error);
    }
  };

  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/tax/${dataId}`);
    setIsDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModal(false);
  };

  const handleEditModal = (taxId, taxName, taxPercentage) => {
    setOnEdit(taxId);
    setTaxName(taxName);
    setPercentage(taxPercentage);
    setAddTaxModal(false)
  };
  const handleAddModal = ()=>{
    setAddTaxModal(!addtaxmodal);
    setOnEdit(null)
  }

  

  return (
    <>
      <div className="font-extralight">
        <div className="lg:w-7/12 md:w-9/12 w-9/12 w- h-fit bg-[#000928] space-y-2 my-2 mx-4">
          <div className="flex justify-between">
            <p className="mx-2 mt-1">Taxes</p>
            <p
              onClick={() => handleAddModal()}
              className="mx-2 mt-3 text-sm cursor-pointer"
            >
              Add Tax
            </p>
          </div>
          <hr />
          {addTax &&
            addTax.map((data, index) => (
              <div key={index}>
                <div className="flex justify-between mx-2">
                  <p>{data.taxname}</p>
                  <div className="flex items-center mr-14 size-4 gap-2">
                    <p>{data.percentage}%</p>
                    <img
                      onClick={() =>
                        handleEditModal(data._id, data.taxname, data.percentage)
                      }
                      src={EditImage}
                      alt="Edit image"
                      className="cursor-pointer"
                    />
                    <img
                      onClick={() => handleDeleteModal(data._id)}
                      src={BinImage}
                      alt="Delete image"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <hr />
              </div>
            ))}
            
        </div>
        {addtaxmodal && <AddTax onClose={() => setAddTaxModal(false)} fetchTax={fetchTax} />}
        {isDeleteModal && (
          <DeleteModal
            title="tax"
            onClose={handleCloseDeleteModal}
            onDelete={onDelete}
          />
        )}

        {onEdit !==null && (
          <div className="grid font-extralight my-12 mx-4 space-y-6">
            <p>Edit Tax</p>
            <p>Tax name</p>
            <input
              type="text"
              value={taxname}
              placeholder=" Enter Category Name"
              className="rounded-md w-1/2 py-1.5 px-1 text-black"
              onChange={(e) => setTaxName(e.target.value)}
            />
            <p>Tax Percentage</p>
            <input
              type="text"
              value={percentage}
              placeholder=" Enter Category Name"
              className="rounded-md w-1/2 py-1.5 px-1 text-black"
              onChange={(e) => setPercentage(e.target.value)}
            />
            <div >
            <button
              onClick={handleUpdateTax}
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
          </div>
        )}
      </div>
    </>
  );
};

export default Taxes;
