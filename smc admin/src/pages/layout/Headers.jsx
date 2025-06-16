import React, { useEffect, useState } from 'react';
import SMCLogo from '../../assets/SMC Logo.png';
import { IoNotifications } from "react-icons/io5";
import profile from "../../assets/profile.png";
import { NavLink, useLocation } from 'react-router-dom';
import { API } from '../../Host';
import axios from 'axios';
import { TfiAlignJustify } from "react-icons/tfi";

const Headers = ({ Menus }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const fname=localStorage.getItem("fname")
  const lname = localStorage.getItem("lname")
  const admin = localStorage.getItem("user")
  const [userImage, setUserImage] = useState({});

  useEffect(() => {
    fetchImage();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="flex justify-between items-center px-3  bg-gradient-to-r from-[#110038] to-[#08006B] z-50 fixed w-full h-14">
    <img src={SMCLogo} alt="PickMyCourse" className="w-52 " />

    <p
      className="text-2xl text-white md:block lg:hidden block"
      onClick={toggleDropdown}
    >
     <span className='flex items-center gap-2'>Menu<TfiAlignJustify className='size-6' /></span>
    </p>

    {isDropdownOpen && (
      <div className="absolute right-0 top-14 w-full bg-[#200098] text-white shadow-md lg:hidden md:block block">
        <div className="flex gap-2 items-center pt-3 mx-3">
        <img   src={userImage?.image ? userImage.image : profile}
            alt="Profile"
            className={`w-14 h-14 ${userImage?.image ? ' rounded-xl object-cover' : ''}`}  />
          <div>
            <p className="text-xl font-extralight capitalize">Hello! John Doe</p>
            <p className="text-xs font-extralight pt-1">Subscription: Gold</p>
            <p className="text-xs font-extralight whitespace-nowrap py-1">
              Subscription Expiry: 12/12/26
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap py-5 ">
          {Menus.map((menu, index) => (
            <NavLink to={menu.to} onClick={menu.onClick} key={index}>
              <li
                className={`cursor-pointer text-md flex items-center gap-x-3 p-2 mt-1 pl-3 transition-all duration-700 ${
                  location.pathname === menu.to
                    ? "text-white bg-gradient-to-r from-[#110038] to-[#08006B]"
                    : "text-white"
                }`}
                onClick={toggleDropdown}
              >
                <div className="flex items-center gap-x-6 px-2">
                  <img src={menu.icon} alt="icons" className="w-6 h-6" />
                  <span className="font-poppins text-lg flex-1 duration-300 whitespace-nowrap">
                    {menu.title}
                  </span>
                </div>
              </li>
            </NavLink>
          ))}
        </ul>
      </div>
    )}
      <div className="relative">
        <IoNotifications className='lg:w-7 lg:h-7 md:w-6 md:h-6 w-5 h-5 text-white cursor-pointer' />
      </div>
    </div>
  );
};

export default Headers;
