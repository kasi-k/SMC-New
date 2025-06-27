import React, { useEffect, useState } from "react";
import { MdEdit, MdSave } from "react-icons/md";
import ProfileImg from "../../assets/profile.png";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/Courses.jpeg";
import axios from "axios";
import { API } from "../../Host";
import { useLocation } from "react-router-dom";
import UpdateImage from "./UpdateImage";

const UserProfile = () => {
  const location = useLocation();
  const user = location.state?.userId;
  const [userImage, setUserImage] = useState({});
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [formState, setFormState] = useState({});

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/api/getusersbyid?id=${user}`);
      const response = res.data.user;
      setFormState(response);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${API}/api/getimagebyid?user=${user}`
        );
        const responseData = response.data.user;

        setUserImage(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImage();
  }, [userImage]);

  const CloseProfileModal = () => {
    setIsProfileModal(!isProfileModal);
  };

  const calculateProfileCompletion = () => {
    let totalFields = 0;
    let filledFields = 0;

    const fieldsToCheck = {
      fname: formState.fname,
      lname: formState.lname,
      email: formState.email,
      phone: formState.phone,
      dob: formState.dob,
      about: formState.about,
      facebook: formState.facebook,
      instagram: formState.instagram,
      twitter: formState.twitter,
      linkedIn: formState.linkedIn,
      goals: formState.goals,
      experience: formState.experience,
      resource: formState.resource,
      skills: formState.skills,
      areaOfInterest: formState.areaOfInterest,
      addressline1: formState.addressline1,
      addressline2: formState.addressline2,
      city: formState.city,
      state: formState.state,
      country: formState.country,
      zipcode: formState.zipcode,
    };

    Object.values(fieldsToCheck).forEach((value) => {
      totalFields++;
      if (value && value.toString().trim() !== "") {
        filledFields++;
      }
    });

    return Math.round((filledFields / totalFields) * 100);
  };
  const profileCompletion = calculateProfileCompletion();

  const handleSaveEmail = async (fieldName) => {
    try {
      const Update = { email: formState.email };
      await axios.post(
        `${API}/api/emailupdate?phone=${formState.phone}`,
        Update
      );
      setEditFields((prev) => ({ ...prev, [fieldName]: false }));
      fetchUser();
    } catch (err) {
      console.error("Failed to save email:", err);
    }
  };

  const handleSavePhone = async (fieldName) => {
    try {
      const Update = { phone: formState.phone };
      await axios.post(
        `${API}/api/phoneupdate?email=${formState.email}`,
        Update
      );
      setEditFields((prev) => ({ ...prev, [fieldName]: false }));
      fetchUser();
    } catch (err) {
      console.error("Failed to save phone:", err);
    }
  };

  const handleSaveSocialmedia = async () => {
    try {
      const updatedData = {
        user: user,
        facebook: formState.facebook,
        instagram: formState.instagram,
        linkedIn: formState.linkedIn,
        twitter: formState.twitter,
      };
      await axios.post(`${API}/api/usersocialmedia?id=${user}`, updatedData);
      setEditFields({});
      fetchUser();
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  const handleSaveBio = async () => {
    try {
      const updatedData = {
        user: user,
        about: formState.about,
      };
      await axios.post(`${API}/api/userabout?id=${user}`, updatedData);
      setEditFields({});
      fetchUser();
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  const handleSaveLeanersProfile = async () => {
    try {
      const updatedData = {
        user: user,
        goals: formState.goals,
        experience: formState.experience,
        areaOfInterest: formState.areaOfInterest,
        resource: formState.resource,
        skills: formState.skills,
      };
      await axios.post(`${API}/api/userprofile?id=${user}`, updatedData);

      setEditFields({});
      fetchUser();
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  const handleSaveBilling = async () => {
    try {
      const updatedBilling = {
        user: user,
        addressline1: formState.addressline1,
        addressline2: formState.addressline2,
        city: formState.city,
        state: formState.state,
        country: formState.country,
        zipcode: formState.zipcode,
      };
      console.log(updatedBilling);

      await axios.post(`${API}/api/billinginfo?id=${user}`, updatedBilling);
      setEditFields({});
      fetchUser();
    } catch (err) {
      console.error("Failed to save billing info:", err);
    }
  };

  const handleInputChange = (fieldName) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 grid-rows-12 gap-2  p-4 ">
        <div className="col-span-4 row-span-1 content-center  p-3 px-4 bg-[#02002E] font-extralight relative rounded-xl">
          <p className="text-xs flex gap-1 items-center absolute top-0.5 right-3">
            {" "}
            <MdEdit size={12} /> Edit{" "}
          </p>
          <p className="grid  grid-cols-2 ">
            <span>Account Status:</span>
            <span className="text-[#00E6DC]"> Active </span>
          </p>
        </div>
        <div className="col-span-8 row-span-3 p-1 space-y-3 bg-[#02002E] content-center font-extralight rounded-xl">
          <div className="flex justify-between items-center">
            <p>Subscription Information</p>
            <button className="py-1 px-14 bg-[#00E6DC] text-black rounded-lg">
              Change Plan
            </button>
          </div>
          <div className="grid  grid-cols-3 p-2 my-1 gap-2 ">
            {[
              { label: "Current Plan", value: "Seek Pro" },
              { label: "Subscription Status", value: "Active" },
              { label: "Billing Cycle", value: "Monthly" },
              { label: "Next Renewal Date", value: "12-06-2025" },
              { label: "Current Billing Amount", value: "₹549.00" },
            ].map((item, index) => (
              <p
                key={index}
                className="col-span-1 grid grid-cols-2 space-y-2 px-2 p-1 bg-[#200043] rounded-xl "
              >
                <span className="text-sm col-span-2">{item.label}</span>
                <span className="text-[#00E6DC] col-span-2 text-center text-xl">
                  {item.value}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div className="col-span-4 row-span-2 p-2 content-center bg-[#02002E] rounded-xl">
          <p className="grid  grid-cols-2 space-y-2 ">
            {[
              { label: "Signup Date", value: "12-05-2025" },
              { label: "Signup IP Address", value: "192.168.0.1" },
              { label: "Last Login Date", value: "12-05-2025" },
              { label: "Last Login Time", value: "10:00:00 AM" },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <span>{item.label} :</span>
                <span className="text-[#00E6DC] ">{item.value}</span>
              </React.Fragment>
            ))}
          </p>
        </div>
        {/* Profile */}
        <div className="col-span-4 row-span-5 p-2 space-y-3 bg-[#02002E] rounded-xl">
          <div className="flex justify-start px-4 text-center  content-center text-white py-2 p-1">
            <p>UserID:</p>
            <p className="px-2">{formState._id}</p>
          </div>
          <div className=" grid grid-cols-6 grid-rows-5 gap-3 pb-2 p-1">
            <div className="col-span-2 row-span-2 p-1">
              <div className=" flex flex-col justify-center items-center gap-2.5 ">
                <img
                  src={userImage?.image ? userImage.image : ProfileImg}
                  alt="profile pic"
                  className="w-24 h-[89px]  rounded-full border-3 p-0.5 border-[#00E6DC]"
                />
                <button className="bg-[#00E6DC] px-4 text-black rounded-md"
                   onClick={() => setIsProfileModal(true)}>
                  Change
                </button>
              </div>
            </div>
            {/* Editable Fields */}
            <div className="col-span-4 row-span-2   text-white py-5 px-1">
              <div className="flex flex-col  justify-center w-full">
                <span className="text-white  text-lg ">Profile Completion</span>
                <span className="text-white text-end text-lg">
                  {profileCompletion}%
                </span>
                <div className="w-full h-[3px] bg-white rounded-full flex items-center">
                  <div
                    className="bg-[#00E6DC] h-[12px] "
                    style={{ width: `${profileCompletion}%` }} // adjust based on your needs
                  />
                </div>
              </div>
            </div>
            {/* profile field */}
            {[
              { name: "fname", label: "First Name", colSpan: 3 },
              { name: "lname", label: "Last Name", colSpan: 3 },
              { name: "email", label: "Email Id", colSpan: 6 },
              { name: "phone", label: "Phone Number", colSpan: 3 },
              { name: "dob", label: "Date of Birth", colSpan: 3 },
            ].map((field) => {
              const isEditing = editFields[field.name] || false;
              const showEditButton = !["fname", "lname", "dob"].includes(
                field.name
              );

              return (
                <div
                  key={field.name}
                  className={`col-span-${field.colSpan} content-center row-span-1 gap-3 text-white px-1`}
                >
                  <p className="flex pb-2 justify-between">
                    <span className="text-xs">{field.label}</span>

                    {showEditButton && (
                      <button
                        type="button"
                        className="text-[9px] flex gap-1 items-center cursor-pointer"
                        onClick={async () => {
                          if (isEditing) {
                            // Save logic
                            if (field.name === "email")
                              await handleSaveEmail(field.name);
                            else if (field.name === "phone")
                              await handleSavePhone(field.name);
                          } else {
                            // Switch to editing
                            setEditFields((prev) => ({
                              ...prev,
                              [field.name]: true,
                            }));
                          }
                        }}
                      >
                        {isEditing ? (
                          <MdSave size={12} />
                        ) : (
                          <MdEdit size={12} />
                        )}
                        {isEditing ? "Save" : "Edit"}
                      </button>
                    )}
                  </p>

                  <input
                    type="text"
                    className="border-b px-2 w-full bg-transparent text-white"
                    name={field.name}
                    value={formState[field.name] || ""}
                    placeholder={user[field.name] || "not completed"}
                    disabled={showEditButton ? !isEditing : true}
                    onChange={handleInputChange(field.name)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* AI Courses */}
        <div className="col-span-8 row-span-3 p-1 space-y-2 bg-[#02002E] content-center font-extralight rounded-xl">
          <div className="col-span-8 row-span-3 p-1 bg-[#02002E] font-extralight rounded-xl">
            <div className="flex justify-between items-center">
              <p>AI Course Generation Limit</p>
              <button className="py-1 px-6 bg-[#00E6DC] text-black rounded-lg">
                Add Course Count
              </button>
            </div>
            <div className="grid grid-cols-3 p-2 my-1 gap-2 ">
              {[
                { label: "Current Plan Limit", value: "20" },
                { label: "Current Cycle Courses Generated", value: "12" },
                { label: "Current Cycle Courses Left", value: "08" },
                { label: "Lifetime Courses Generated", value: "78" },
                { label: "Completed Courses", value: "67" },
              ].map((item, index) => (
                <p
                  key={index}
                  className="col-span-1 grid grid-cols-2 px-2 p-1 gap-2 bg-[#200043] rounded-xl"
                >
                  <span className="text-sm col-span-2">{item.label}</span>
                  <span className="text-[#00E6DC] col-span-2 text-center text-xl">
                    {item.value}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>
        {/* Pre-generated courses */}
        <div className="col-span-3 row-span-3 space-y-3 content-center p-2 bg-[#02002E] rounded-xl">
          <p>Pre-Generated Courses Count</p>
          {[
            { label: "Courses Accessed", value: "20" },
            { label: "Courses Completed", value: "12" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 p-2   bg-[#200043] rounded-xl"
            >
              <span className="text-sm col-span-2">{item.label}</span>
              <span className="text-[#00E6DC] col-span-2 text-center text-xl">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {/* Quizzes */}
        <div className="col-span-3 row-span-3 content-center space-y-3 p-2 bg-[#02002E] rounded-xl">
          <p>Quizzes Count</p>
          {[
            { label: "Quiz Attempted", value: "20" },
            { label: "Quiz Passed", value: "12" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 p-2   bg-[#200043] rounded-xl"
            >
              <span className="text-sm col-span-2">{item.label}</span>
              <span className="text-[#00E6DC] col-span-2 text-center text-xl">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {/* Empty */}
        <div className="col-span-2 row-span-3 p-2  rounded-xl">
          <></>
        </div>
        {/* Billing Information */}
        <div className="col-span-4 row-span-4 py-2 px-3 content-center space-y-2 bg-[#02002E] rounded-xl">
          <p className="flex pb-2 justify-between">
            <span className="">Billing Information</span>
            <button
              className="text-xs flex gap-1 items-center"
              onClick={() => {
                if (editFields["billingEditing"]) {
                  handleSaveBilling(); // Define this function to save billing data
                  setEditFields((prev) => ({ ...prev, billingEditing: false }));
                } else {
                  setEditFields((prev) => ({ ...prev, billingEditing: true }));
                }
              }}
            >
              {editFields["billingEditing"] ? (
                <MdSave size={12} />
              ) : (
                <MdEdit size={12} />
              )}
              {editFields["billingEditing"] ? "Save" : "Edit"}
            </button>
          </p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Address Line 1", name: "addressline1", colSpan: 4 },
              { label: "Address Line 2", name: "addressline2", colSpan: 4 },
              { label: "City", name: "city", colSpan: 2 },
              { label: "State", name: "state", colSpan: 2 },
              { label: "Zip", name: "zipcode", colSpan: 2 },
              { label: "Country", name: "country", colSpan: 2 },
            ].map((field) => (
              <div
                key={field.name}
                className={`col-span-${field.colSpan} border-b flex flex-col text-sm gap-2`}
              >
                <p>{field.label}</p>
                <input
                  type="text"
                  name={field.name}
                  className="outline-none bg-transparent text-white"
                  value={formState[field.name] || " "}
                  onChange={handleInputChange(field.name)}
                  disabled={!editFields["billingEditing"]}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Social Profile */}
        <div className="col-span-4 row-span-3 p-2 content-center bg-[#02002E] rounded-xl">
          <div className="flex pb-2 justify-between">
            <p>Social Profiles</p>
            <button
              type="button"
              className="text-[12px] flex gap-1 items-center cursor-pointer"
              onClick={() => {
                if (editFields["socialMediaEditing"]) {
                  handleSaveSocialmedia();
                  setEditFields((prev) => ({
                    ...prev,
                    socialMediaEditing: false,
                  }));
                } else {
                  setEditFields((prev) => ({
                    ...prev,
                    socialMediaEditing: true,
                  }));
                }
              }}
            >
              {editFields["socialMediaEditing"] ? (
                <MdSave size={12} />
              ) : (
                <MdEdit size={12} />
              )}
              {editFields["socialMediaEditing"] ? "Save" : "Edit"}
            </button>
          </div>

          {[
            {
              logo: <FaFacebookF size={18} />,
              name: "facebook",
              label: "Facebook",
            },
            {
              logo: <IoLogoInstagram size={18} />,
              name: "instagram",
              label: "Instagram",
            },
            {
              logo: <FaLinkedinIn size={18} />,
              name: "linkedIn",
              label: "LinkedIn",
            },
            {
              logo: <FaXTwitter size={18} />,
              name: "twitter",
              label: "Twitter",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1 p-3 bg-[#200043] rounded-xl text-white"
            >
              <div className="flex gap-2 items-center">
                <p className="bg-[#00E6DC] p-1 rounded-full text-black">
                  {item.logo}
                </p>
                <input
                  type="text"
                  name={item.name}
                  value={formState[item.name] || ""}
                  disabled={!editFields["socialMediaEditing"]}
                  onChange={handleInputChange(item.name)}
                  placeholder="Not completed"
                  className={`text-black border-2 w-full bg-gray-200 outline-none px-2 rounded-lg ${
                    editFields["socialMediaEditing"]
                      ? "border-[#00E6DC]"
                      : "border-white"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Bio */}
        <div className="col-span-4 row-span-3 p-2 content-center bg-[#1E1E1E] rounded-xl">
          <p className="flex pb-2 justify-between">
            <span className="">Bio</span>
            <button
              className="text-xs flex gap-1 items-center"
              onClick={() => {
                if (editFields["bioEditing"]) {
                  handleSaveBio();
                  setEditFields((prev) => ({ ...prev, bioEditing: false }));
                } else {
                  setEditFields((prev) => ({ ...prev, bioEditing: true }));
                }
              }}
            >
              {editFields["bioEditing"] ? (
                <MdSave size={12} />
              ) : (
                <MdEdit size={12} />
              )}
              {editFields["bioEditing"] ? "Save" : "Edit"}
            </button>
          </p>
          <textarea
            className={`text-sm overflow-auto w-full px-1 h-48 flex flex-nowrap text-white bg-[#1E1E1E] p-2 rounded-md
    ${editFields["bioEditing"] ? "outline outline-[#00E6DC]" : "outline-none"}`}
            value={formState.about || ""}
            onChange={handleInputChange("about")}
            disabled={!editFields["bioEditing"]}
          />
        </div>
      </div>
      {/* page 2 */}
      <div className="grid grid-cols-3 gap-2 px-4">
        {/* Leaners Profile */}
        <div className="col-span-1 p-3 space-y-2 bg-[#02002E] rounded-xl">
          <p className="flex pb-2 justify-between">
            <span>Learning Profiles</span>
            <button
              className="text-xs flex gap-1 items-center"
              onClick={() => {
                if (editFields["learningProfileEditing"]) {
                  handleSaveLeanersProfile();
                  setEditFields((prev) => ({
                    ...prev,
                    learningProfileEditing: false,
                  }));
                } else {
                  setEditFields((prev) => ({
                    ...prev,
                    learningProfileEditing: true,
                  }));
                }
              }}
            >
              {editFields["learningProfileEditing"] ? (
                <MdSave size={12} />
              ) : (
                <MdEdit size={12} />
              )}
              {editFields["learningProfileEditing"] ? "Save" : "Edit"}
            </button>
          </p>

          {[
            { label: "Learning Goals", key: "goals" },
            { label: "Experience Level", key: "experience" },
            { label: "Area of Interest", key: "areaOfInterest" },
            { label: "Resources Needs", key: "resource" },
            { label: "New Skills Target", key: "skills" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col gap-2 p-2 rounded-xl">
              <p className="text-xs col-span-2">{item.label}:</p>
              <textarea
                className="text-white bg-[#200043] col-span-2 rounded-md p-2 h-28 text-sm"
                value={formState[item.key] || ""}
                onChange={handleInputChange(item.key)}
                disabled={!editFields["learningProfileEditing"]}
              />
            </div>
          ))}
        </div>
        {/* Recent Courses */}
        <div className="col-span-2 p-3 bg-[#02002E] rounded-lg">
          <p className="flex pb-2 justify-between ">
            <span className="">Recent Generated Courses</span>
            <span className="text-sm  flex gap-1 items-center ">view all</span>
          </p>
          <div className="grid grid-cols-2 gap-2 h-screen overflow-auto">
            {Array.from({ length: 17 }, (_, i) => (
              <div className="flex gap-2 bg-[#200043] rounded-2xl ">
                <img src={logo} alt="img" className="w-48 rounded-2xl  " />
                <div className=" flex flex-col gap-2 py-2">
                  <p className="flex flex-col text-[10px]">
                    <span>Date: 12-Mar-2025</span>
                    <span>CCNA Security For starters</span>
                    <span>Type: Video & Theory Course</span>
                    <span>No of Subtopics: 05</span>
                    <span>Language: English</span>
                    <span>Status : Pending</span>
                  </p>
                  <button className=" w-fit px-6 text-sm bg-[#00E6DC] text-black rounded-md">
                    view
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isProfileModal && <UpdateImage CloseProfileModal={CloseProfileModal} />}
    </>
  );
};

export default UserProfile;
