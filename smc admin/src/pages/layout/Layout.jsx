import React, { Suspense, useEffect, useState } from "react";
import Headers from "./Headers";
import profile from "../../assets/profile.png";
import { LuGraduationCap } from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbBulb } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiBarChartAlt } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Loading from "../../Loading";
import LogOut from "../auth/LogOut";
import axios from "axios";
import { API } from "../../Host";
const Layout = ({ permissions }) => {
  const location = useLocation();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isLogOutModalOpen, setLogOutModalOpen] = useState(false);
  const fname = localStorage.getItem("fname");
  const lname = localStorage.getItem("lname");
  const admin = localStorage.getItem("user");
  const [userImage, setUserImage] = useState({});

  useEffect(() => {
    fetchImage();
  }, []);

  const Menus = [
    {
      title: "Dashboard",
      icon: <LuLayoutDashboard size={20} />,
      to: "/dashboard",
    },
    permissions["packages"] && {
      title: "Packages",
      icon: <LiaRupeeSignSolid size={20} />,
      to: "/packages",
    },
    permissions["users"] && {
      title: "User Management",
      icon: <HiOutlineUserGroup size={20} />,
      to: "/users",
    },
    permissions["subscription"] && {
      title: "Subscriptions",
      icon: <LiaRupeeSignSolid size={20} />,
      to: "/subscription",
    },

    {
      title: "Pre-Generated Courses",
      icon: <LuGraduationCap size={20} />,
      submenu: true,
      submenuItems: [
        {
          title: "Category Management",
          icon: <LuGraduationCap size={20} />,
          to: "/categorymanagement",
        },
        {
          title: "Course Management",
          icon: <LuGraduationCap size={20} />,
          to: "/coursemanagement",
        },
        {
          title: "Generate Courses",
          icon: <LuGraduationCap size={20} />,
          to: "/pregeneratecourses",
        },
      ].filter(Boolean),
    },
    {
      title: "Quiz Management",
      icon: <TbBulb size={20} />,
      submenu1: true,
      submenuItems1: [
        {
          title: "My Study Groups",
          to: "#",
        },
      ].filter(Boolean),
    },

    permissions["courses"] && {
      title: "Courses",
      icon: <TbBulb size={20} />,
      to: "/courses",
    },
    { title: "Generate course", icon: <TbBulb size={20} />, to: "/create" },
    {
      title: "Study Groups",
      icon: <HiOutlineUserGroup />,
      to: "#",
    },
    {
      title: "Refer & Earn",
      icon: <LiaRupeeSignSolid size={20} />,
      to: "/referrals",
    },
    {
      title: "Notifications",
      icon: <IoNotificationsOutline size={20} />,
      to: "#",
    },

    permissions["team"] && {
      title: "Team",
      icon: <HiOutlineUserGroup size={20} />,
      to: "/team",
    },
    // permissions["support"] && {
    //   title: "Help & Support",
    //   icon: help,
    //   to: "/helpsupport",
    // },
    permissions["report"] && {
      title: "Reports",
      icon: <BiBarChartAlt size={20} />,
      to: "/report",
    },

    permissions["setting"] && {
      title: "Settings",
      icon: <IoSettingsOutline size={20} />,
      to: "/setting",
    },
    // { title: "Policy", icon: policy, to: "/policy" },
    // { title: "FAQ", icon: Faq, to: "/faq" },

    {
      title: "Logout",
      icon: <TbLogout />,
      to: "#",
      onClick: () => setLogOutModalOpen(true),
    },
  ].filter(Boolean);
  const handleCloseModal = () => {
    setLogOutModalOpen(false);
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${API}/api/getimagebyid?user=${admin}`);
      const responseData = response.data.user;
      setUserImage(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="font-poppins">
      <Headers Menus={Menus} />
      <div className="flex w-full h-screen pt-14 font-poppins  ">
        <div className="w-2/12   bg-[#200098] text-white lg:block md:hidden hidden overflow-auto no-scrollbar ">
          <div className="flex gap-2 items-center pt-3 flex-wrap justify-center ">
            <img
              src={userImage?.image ? userImage.image : profile}
              alt="Profile"
              className={`w-14 h-14 ${
                userImage?.image ? " rounded-xl object-cover" : ""
              }`}
            />
            <div>
              <p className="capitalize text-xl font-extralight">
                Hello ! {fname} {lname}
              </p>
              <p className="text-xs font-extralight pt-1">
                Subscription : Gold
              </p>
              <p className="text-xs font-extralight whitespace-nowrap py-1">
                Subscription Expiry : 12/12/26
              </p>
            </div>
          </div>

          <div className="my-1 ">
            <ul className="pt-2">
           {Menus.map((menu, index) => {

  const isActive =
    location.pathname === menu.to ||
    (menu.submenu &&
      menu.submenuItems?.some((item) => location.pathname === item.to)) ||
    (menu.submenu1 &&
      menu.submenuItems1?.some((item) => location.pathname === item.to));

  return (
    <React.Fragment key={index}>
      <NavLink to={menu.to} onClick={menu.onClick}>
        <li
          className={`cursor-pointer flex items-center gap-x-3 p-1.5 mt-1 pl-3 transition-all duration-700 hover:bg-gradient-to-r from-[#110038] to-[#08006B] font-extralight
            ${isActive ? "bg-gradient-to-r from-[#110038] to-[#08006B] font-medium text-white" : ""}
          `}
        >
          <div className="flex items-center gap-x-2 ">
            <span className="px-1 py-1 rounded-lg text-white ">
              {menu.icon}
            </span>
            <span className="font-extralight duration-300">
              {menu.title}
            </span>
          </div>
          {menu.submenu && (
            <BsChevronDown
              className={`cursor-pointer transition-transform delay-100 ${openMenuIndex === index ? "rotate-180" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setOpenMenuIndex(openMenuIndex === index ? null : index);
              }}
            />
          )}
          {menu.submenu1 && (
            <BsChevronDown
              className={`cursor-pointer transition-transform delay-100 ${openMenuIndex === index ? "rotate-180" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setOpenMenuIndex(openMenuIndex === index ? null : index);
              }}
            />
          )}
        </li>
      </NavLink>
      {menu.submenu && openMenuIndex === index && (
        <ul>
          {menu.submenuItems.map((submenuitem, subIndex) => (
            <NavLink
              to={submenuitem.to}
              onClick={submenuitem.onClick}
              key={subIndex}
            >
              <li
                className={`cursor-pointer font-extralight flex items-center gap-2 p-1 pl-8 hover:bg-gradient-to-r from-[#110038] to-[#08006B] ${
                  location.pathname === submenuitem.to
                    ? "bg-[#A71CD2]"
                    : "text-gray-200 font-extralight"
                }`}
              >
                <span className="px-1 py-1 rounded-lg text-white">
                  {submenuitem.icon}
                </span>
                <span>{submenuitem.title}</span>
              </li>
            </NavLink>
          ))}
        </ul>
      )}
      {menu.submenu1 && openMenuIndex === index && (
        <ul>
          {menu.submenuItems1.map((submenuitem, subIndex) => (
            <NavLink
              to={submenuitem.to}
              onClick={submenuitem.onClick}
              key={subIndex}
            >
              <li
                className={`cursor-pointer font-extralight flex items-center gap-x-2 p-1 pl-8 hover:bg-gradient-to-r from-[#110038] to-[#08006B] ${
                  location.pathname === submenuitem.to
                    ? "bg-[#A71CD2]"
                    : "text-gray-200 font-extralight"
                }`}
              >
                <span className="px-1 py-1 rounded-lg text-white">
                  {submenuitem.icon}
                </span>
                <span>{submenuitem.title}</span>
              </li>
            </NavLink>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
})}
            </ul>
          </div>
        </div>
        <div className="lg:w-10/12 md:w-full w-full  bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] text-white  overflow-auto ">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
          <div className=" text-end px-2 text-xs text-white   ">
            Designed with
            <span className="text-red-500">&#x2764;</span>
            <span>Morpheus Code</span>
          </div>
        </div>
        
      </div>
      {isLogOutModalOpen && <LogOut handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default Layout;
