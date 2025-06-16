import React, { useEffect, useState } from "react";
import AddRole from "./AddRole";
import SettingImage from "../../assets/setting.png";
import EditImage from "../../assets/edit.png";
import BinImage from "../../assets/bin.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../Host";
import DeleteModal from "../../components/DeleteModal";
import UpdateRole from "./UpdateRole";

const RolesPermission = () => {
  const [activeTab, setActiveTab] = useState("tab0");
  const [role, setRole] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState("");
  const navigate = useNavigate();
  const [addRole, setAddRole] = useState(false);

  useEffect(() => {
    fetchNewRole();
  }, [isDeleteModal]);

  const fetchNewRole = async () => {
    try {
      const response = await axios.get(`${API}/api/getroles`);
      const responseRoles = response.data.role;
      setRole(responseRoles);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteModal = (dataId) => {
    setOnDelete(`${API}/api/roles/${dataId}`);
    setIsDeleteModal(true);
  };
  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  const handleAdd = () => {
    setAddRole(!addRole);
  };

  const handleAddCloseModal = () => {
    setAddRole(false);
  };

  return (
    <>
      <div className="font-extralight grid grid-cols-9  ">
        <div className="  h-fit bg-[#000928] space-y-4 my-2 mx-3 px-3 lg:col-span-4 md:col-span-8 col-span-8">
          <div className="flex justify-between ">
            <p className="mx-2 mt-4">Roles</p>
            <p onClick={() => handleAdd()} className=" cursor-pointer mx-2 mt-4">
              Add Role
            </p>
          </div>
          {role &&
            role.map((data, index) => (
              <div
                key={index}
                className={` cursor-pointer flex justify-between items-center gap-1 text-md  pl-1 p-2 transition-all duration-700 hover:bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] font-extralight   ${
                  activeTab === "tab1"
                    ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  transition-all duration-500"
                    : " "
                }`}
              >
                <p className="mx-3  w-5/6">{data.role_name}</p>
                <div className="flex mr-3 w-1/6 size-5 gap-3">
                  {/* <img src={SettingImage} alt="Settings image" /> */}
                  <img
                    src={EditImage}
                    alt="Edit image"
                    onClick={() =>
                      navigate(`/updaterole`, {
                        state: {
                          roleId: data.role_name,
                          role: data._id,
                        },
                      })
                    }
                  />
                  <img
                    onClick={() => handleDeleteModal(data._id)}
                    src={BinImage}
                    alt="Delete image"
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="lg:col-span-5 md:col-span-9 col-span-9 mx-2">
          {addRole && (
            <AddRole
              onClose={handleAddCloseModal}
              fetchNewRole={fetchNewRole}
            />
          )}
        </div>
      </div>

      {isDeleteModal && (
        <DeleteModal
          onClose={handleCloseModal}
          title="Roles"
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default RolesPermission;
