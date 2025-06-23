import React, { useEffect } from "react";
import { useState } from "react";
import { FiShare2 } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../Host";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";

const Package = ({ permissions }) => {
  const hasCreatePermission = permissions?.includes("add");
  const hasEditPermission = permissions?.includes("edit");
  const hasDeletePermission = permissions?.includes("delete");
  const hasViewPermission = permissions?.includes("view");
  const [data, setData] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionPlan();
  }, [isDeleteModal]);

  const fetchSubscriptionPlan = async () => {
    try {
      const response = await axios.get(`${API}/api/getsubscriptionplan`);
      const responseData = response.data.plans;
      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteModal = (planId) => {
    setOnDelete(`${API}/api/subscriptionplan/${planId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };
  const handlePackage = () => {
    navigate("/addpackage");
  };
  const handleUserPackage = () => {
    navigate("/adduserPackage");
  };

  return (
    <>
      <div className=" font-poppins flex justify-end mx-4 gap-4 my-3 ">
        {hasCreatePermission && (
          <button
            onClick={handlePackage}
            className=" cursor-pointer flex items-center text-blue-950  bg-white px-4 py-1 rounded-md"
          >
            <GoPlus /> Add package
          </button>
        )}
        <button
          onClick={handleUserPackage}
          className=" cursor-pointer bg-gradient-to-r from-blue-900 to-fuchsia-600 px-4 py-1 flex items-center rounded-md"
        >
          <GoPlus />
          Add user to package
        </button>
      </div>
      <hr />
      <div className="h-11/12 overflow-auto no-scrollbar ">
      <div className=" grid  gap-2 my-6 mx-6  lg:grid-cols-9 md:grid-cols-6 ">
        {data &&
          data.map((plan, index) => (
            <div
              className="col-span-3 bg-darkest-blue rounded-lg p-4 shadow-lg"
              key={index}
            >
              <div className="flex justify-end items-center gap-3 ">
                {hasEditPermission && (
                  <p
                    onClick={() =>
                      navigate(`/editpackage`, {
                        state: {
                          userId: plan._id,
                        },
                      })
                    }
                  >
                    <FiEdit size={20} />
                  </p>
                )}
                <p>
                  <FiShare2 size={20} />
                </p>

                {hasDeletePermission && (
                  <p
                    onClick={() => {
                      handleDeleteModal(plan._id);
                    }}
                  >
                    <RiDeleteBinLine size={20} />
                  </p>
                )}
              </div>
              <div className=" grid  justify-center">
                <p className=" text-center capitalize font-semibold text-xl">
                  {plan.packagename}
                </p>
                <p className="capitalize font-medium text-lg">
                  ₹{plan.inr} / {plan.duration}
                </p>
              </div>
              <div className=" text-sm text-gray-300  py-4 space-y-1">
                <p className=" capitalize">package id: {plan._id}</p>
                <p className="capitalize text-nowrap">
                  No Of Courses:  {plan.course}{" "}
                </p>
                <p> No of subtopics: {plan.subtopic} </p>
                <p> Tax: {plan.subtopic} %Gst </p>
                <p> Razor Pay Id: 6879456123012  </p>
                <p> No Of Users: 1000 </p>
                <p> Courses Generated: 34445787848748 </p>

                <div className="  pt-4 ">
                  <p className="font-extrabold">Features</p>
                  <p className="">Theory & Image course</p>
           
                  {plan.coursetype === "Theory & Image course" && (
                    <p>Theory & Image course </p>
                  )}
                  {plan.coursetype === "Video & Text Course" && (
                    <p>Theory & Video Course </p>
                  )}
                     <p> Study Groups  </p>
                <p>Pre-Generated Courses</p>
                <p> Quiz</p>
                </div>
                
              </div>
            </div>
          ))}
      </div>
</div>
      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="package"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default Package;
