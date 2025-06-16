import React from "react";

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-center ">
      <div className="overflow-hidden shadow-lg shadow-black bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] flex items-end justify-between relative font-poppins mx-1">
        {children}
      </div>
    </div>
  );
};

export default Modal;
