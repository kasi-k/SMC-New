import React, { useState } from "react";
import Category from "./Category";
import Priority from "./Priority";
import Status from "./Status";

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <>
      <div className="font-extralight bg-[#000928]  mx-2 lg:w-4/5 md:w-5/6 w-4/5 p-1.5 my-2">
        <div className="my-4 mx-4">
          <div className="flex lg:gap-8 md:gap-8 gap-6 overflow-auto ">
            <p
              className={` cursor-pointer flex justify-between items-center text-md  transition-all duration-700  font-extralight   ${
                activeTab === "tab1"
                  ? "text-blue-300  transition-all duration-500"
                  : " "
              }`}
              onClick={() => setActiveTab("tab1")}
            >
              Category
            </p>
            <p
              className={` cursor-pointer flex justify-between items-center text-md  transition-all duration-700  font-extralight   ${
                activeTab === "tab2"
                  ? "text-blue-300  transition-all duration-500"
                  : " "
              }`}
              onClick={() => setActiveTab("tab2")}
            >
              Priority
            </p>
            <p
              className={` cursor-pointer flex justify-between items-center text-md  transition-all duration-700  font-extralight   ${
                activeTab === "tab3"
                  ? "text-blue-300  transition-all duration-500"
                  : " "
              }`}
              onClick={() => setActiveTab("tab3")}
            >
              Status
            </p>
          </div>
        </div>
      </div>
      {activeTab === "tab1" && <Category />}
      {activeTab === "tab2" && <Priority />}
      {activeTab === "tab3" && <Status />}
    </>
  );
};

export default HelpSupport;
