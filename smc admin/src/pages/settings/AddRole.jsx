import React, { useState } from "react";
import { LuGraduationCap } from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbBulb } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiBarChartAlt } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../Host";

const AddRole = ({ onClose, fetchNewRole }) => {
  const [roleName, setRoleName] = useState("");

  const [features, setFeatures] = useState([
    {
      name: "Dashboard",
      icon: <LuLayoutDashboard size={20} />,
      value: "dashboard",
      permissions: [
        { label: "Total Courses Generated", value: "totalcourse" },
        { label: "Total No Of Users", value: "totalusers" },
        { label: "Revenue Generated", value: "totalrevenue" },
        { label: "Course Type", value: "coursetype" },
        { label: "Subscriptions", value: "subscription" },
        { label: "Recurring Revenue", value: "recurringrevenue" },
        { label: "Ticket Status", value: "ticketstatus" },
        { label: "Monthly Activity Progress", value: "monthlyProgress" },
        { label: "Revenue", value: "revenue" },
      ],
    },
    {
      name: "Packages",
        icon: <LuLayoutDashboard size={20} />,
      value: "packages",
      permissions: [
        { label: "Can view Packages", value: "view" },
        { label: "Can add Packages", value: "add" },
        { label: "Can edit Packages", value: "edit" },
        { label: "Can delete Packages", value: "delete" },
      ],
    },
    {
      name: "Courses",
       icon: <LuLayoutDashboard size={20} />,
      value: "courses",
      permissions: [
        { label: "Can view Courses", value: "view" },
        { label: "Can Generate Courses", value: "create" },
        { label: "Can delete Courses", value: "delete" },
      ],
    },
    {
      name: "Subscriptions",
       icon: <LuLayoutDashboard size={20} />,
      value: "subscription",
      permissions: [{ label: "Can view Subscriptions", value: "view" }],
    },
    {
      name: "Users",
       icon: <LuLayoutDashboard size={20} />,
      value: "users",
      permissions: [
        { label: "Can View Users", value: "view" },
        { label: "Can add Users", value: "create" },
        { label: "Can Edit Users", value: "edit" },
        { label: "Can Delete Users", value: "delete" },
      ],
    },
    {
      name: "Team",
  
       icon: <LuLayoutDashboard size={20} />,
      permissions: [
        { label: "Can View Team", value: "view" },
        { label: "Can add Team", value: "create" },
        { label: "Can Edit Team", value: "edit" },
        { label: "Can Delete Team", value: "delete" },
      ],
    },
    {
      name: "Help & Support",
       icon: <LuLayoutDashboard size={20} />,
      value: "support",
      permissions: [
        { label: "Can view Tickets", value: "view" },
        { label: "Can assign Tickets", value: "assign" },
        { label: "Can reply to all tickets", value: "reply" },
        { label: "Can reply to self tickets", value: "self" },
      ],
    },
    {
      name: "Reports",
       icon: <LuLayoutDashboard size={20} />,
      value: "report",
      permissions: [
        { label: "Can view Reports", value: "view" },
        { label: "Can Download Reports", value: "download" },
      ],
    },
    {
      name: "Settings",
      icon: <LuLayoutDashboard size={20} />,
      value: "setting",
      permissions: [
        { label: "Roles & permission", value: "roles" },
        { label: "Taxes", value: "tax" },
        { label: "Help & Support", value: "support" },
      ],
    },
  ]);
  const [accessLevels, setAccessLevels] = useState([]);

  const handleFeatureChange = (index) => {
    const newFeatures = [...features];
    newFeatures[index].checked = !newFeatures[index].checked;
    setFeatures(newFeatures);

    if (newFeatures[index].checked) {
      // Add feature and all permissions
      setAccessLevels((prevAccessLevels) => {
        const newAccessLevel = {
          feature: newFeatures[index].value,
          permissions: newFeatures[index].permissions.map((p) => p.value),
        };
        return [...prevAccessLevels, newAccessLevel];
      });
    } else {
      // Remove feature and all permissions
      setAccessLevels(
        accessLevels.filter(
          (level) => level.feature !== newFeatures[index].value
        )
      );
    }
  };

  // const handleFeatureChange = (index) => {
  //   const newFeatures = [...features];
  //   newFeatures[index].checked = !newFeatures[index].checked;
  //   setFeatures(newFeatures);

  //   if (newFeatures[index].checked) {
  //     // Add feature and all permissions
  //     setAccessLevels((prevAccessLevels) => {
  //       const newAccessLevel = {
  //         feature: newFeatures[index].value,
  //         permissions: [], // Start with an empty permissions array
  //       };
  //       return [...prevAccessLevels, newAccessLevel];
  //     });
  //   } else {
  //     // Remove feature and all permissions
  //     setAccessLevels(
  //       accessLevels.filter((level) => level.feature !== newFeatures[index].value)
  //     );
  //   }
  // };

  const handlePermissionChange = (index, permission) => {
    const newAccessLevels = [...accessLevels];
    const featureIndex = newAccessLevels.findIndex(
      (level) => level.feature === features[index].value
    );

    if (featureIndex !== -1) {
      if (newAccessLevels[featureIndex].permissions.includes(permission)) {
        newAccessLevels[featureIndex].permissions = newAccessLevels[
          featureIndex
        ].permissions.filter((p) => p !== permission);
      } else {
        newAccessLevels[featureIndex].permissions.push(permission);
      }
      setAccessLevels(newAccessLevels);
    }
  };

  const handleSave = async () => {
    const roleAccessLevel = {
      role_name: roleName,
      accessLevels: accessLevels,
      status: "active", // or any other status you want to set
    };

    // Here you can send roleAccessLevel to your backend API

    try {
      const response = await axios.post(
        `${API}/api/roleaccesslevel`,
        roleAccessLevel,
        {}
      );

      if (response.status === 200) {
        toast.success("Role created Successfully");
        onClose();
        fetchNewRole();
      } else {
        console.error("Error in posting data", response);
        toast.error("Failed to Upload");
      }
    } catch (error) {
      console.error("Error in posting data", error);
    }
  };

  return (
    <div className="bg-[#000928] py-3">
      <div className="mb-2 mx-6">
        <h3 className="my-2 text-base text-white">Role Name:</h3>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="py-1 mb-5 rounded-md text-center text-black w-3/4 "
        />
        {features.map((feature, index) => (
          <div className="grid mb-3 text-base" key={index}>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 w-3/6">
                 <span className="size-5 text-xl">{feature.icon}</span>
                {feature.name}
              </label>
              <input
                type="checkbox"
                checked={feature.checked || false}
                onChange={() => handleFeatureChange(index)}
              />
            </div>
            {feature.checked && (
              <div className="grid mx-6">
                {feature.permissions.map((permission, permIndex) => (
                  <div className="flex items-center gap-2" key={permIndex}>
                    <label className="text-sm w-4/6">{permission.label}</label>
                    <input
                      type="checkbox"
                      value={permission.value}
                      checked={
                        accessLevels
                          .find((level) => level.feature === feature.value)
                          ?.permissions.includes(permission.value) || false
                      }
                      onChange={() =>
                        handlePermissionChange(index, permission.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center my-8">
        <button
          className="text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-1.5"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddRole;
