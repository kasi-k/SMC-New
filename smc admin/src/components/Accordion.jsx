import React, { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import Delete from "../assets/delete.png";
import DeleteModal from "./DeleteModal";
import { API } from "../Host";

const Accordion = ({ title, content, dataId, fetchNewFaq }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");

  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/deletefaq/${dataId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
    fetchNewFaq();
  };

  return (
    <>
      <div className="accordion-item">
        <div
          className="accordion-title flex items-center justify-between p-1 cursor-pointer mx-3 font-poppins font-extralight"
          onClick={() => setIsActive(!isActive)}
        >
          <div>{title}</div>
          <FaCaretDown
            className={`text-4xl ${isActive ? " rotate-180 " : ""}`}
          />
        </div>
        {isActive && (
          <div className="accordion-content flex justify-between items-center text-white font-poppins font-extralight p-2 mx-3">
            <p>{content}</p>
            <p
              onClick={() => {
                handleDeleteModal(dataId);
              }}
              className="cursor-pointer size-6"
            >
              <img src={Delete} alt="delete image" />
            </p>
          </div>
        )}
        <hr className="my-2 " />
      </div>
      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="Faq"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default Accordion;
