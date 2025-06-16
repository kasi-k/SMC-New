import React, { useState } from "react";
import RolesPermission from "./RolesPermission";
import Taxes from "./Taxes";
import HelpSupport from "./HelpSupport";

const Setting = ({ permissions }) => {
  const hasRolesPermission = permissions?.includes("roles");
  const hasTaxPermission = permissions?.includes("tax");
  const hasSupportPermission = permissions?.includes("support");
  const [activeTab, setActiveTab] = useState("");
  return (
    <>
      <div className="grid grid-cols-12 h-screen my-2 overflow-auto">
        <div className="lg:col-span-3 md:col-span-4 col-span-4    border-r-[1px] ">
          <div className="my-6 space-y-2 ">
            <p>Setting</p>
            {hasRolesPermission && (
              <p
                className={` cursor-pointer text-base  w-full  px-1 py-2 transition-all duration-700 hover:bg-gradient-to-r from-[#110038] to-[#08006B] font-extralight   ${
                  activeTab === "tab1"
                    ? "bg-gradient-to-r from-[#110038] to-[#08006B]  transition-all duration-500"
                    : " "
                }`}
                onClick={() => setActiveTab("tab1")}
              >
                Roles & Permission
              </p>
            )}
            {hasTaxPermission && (
            <p
              className={` cursor-pointer text-md w-full pl-1 p-2 transition-all duration-700 hover:bg-gradient-to-r from-[#110038] to-[#08006B] font-extralight   ${
                activeTab === "tab2"
                  ? "bg-gradient-to-r from-[#110038] to-[#08006B]  transition-all duration-500"
                  : " "
              }`}
              onClick={() => setActiveTab("tab2")}
            >
              Taxes
            </p>
          )}
          {hasSupportPermission && (
            <p
              className={` cursor-pointer text-md w-full pl-1 p-2 transition-all duration-700 hover:bg-gradient-to-r from-[#110038] to-[#08006B] font-extralight   ${
                activeTab === "tab3"
                  ? "bg-gradient-to-r from-[#110038] to-[#08006B]  transition-all duration-500"
                  : " "
              }`}
              onClick={() => setActiveTab("tab3")}
            >
              Help & Support
            </p>
          )}
          </div>
        </div>
        <div className=" lg:col-span-9 md:col-span-8 col-span-8 ">
          {activeTab === "tab1" && <RolesPermission />}
          {activeTab === "tab2" && <Taxes />}
          {activeTab === "tab3" && <HelpSupport />}
        </div>
      </div>
    </>
  );
};

export default Setting;
