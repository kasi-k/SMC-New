import React, { useEffect, useState, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import Gallery from "../../assets/gallery.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API, formatDate1, formatDate2 } from "../../Host";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import { AiOutlineLoading } from "react-icons/ai";

const Modal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  const [processing, setProcessing] = useState(false);
  const pdfRef = useRef(null);

  const handleDownload = async () => {
    setProcessing(true);
    toPng(pdfRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `Image.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Downloaded");
        setProcessing(false);
      })
      .catch((err) => {
        //DO NOTHING
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" relative w-[550px]  h-[350px]">
        <p
          onClick={onClose}
          className=" text-red-500 font-extrabold text-2xl absolute right-2 "
        >
          x
        </p>
        <img
          src={imageUrl}
          alt="Modal"
          className="w-full h-full"
          ref={pdfRef}
        />
        <div className="flex justify-center my-3 ">
          <button
            className={`text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-40 py-2.5 ${
              processing ? "opacity-15" : ""
            }`}
            disabled={processing}
            onClick={handleDownload}
          >
            {processing ? (
              <span className="flex justify-center gap-3">
                {" "}
                <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                <p>Downloading ....</p>
              </span>
            ) : (
              "Download"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Schema = yup.object().shape({
  desc2: yup.string().required("Please add reply"),
  status: yup.string().required("Please add status"),
  team: yup.string().required("Please add team"),
});

const ViewTicket = ({ permissions }) => {
  const hasReplyPermission = permissions?.includes("reply");

  const [userData, setUserData] = useState({});
  const location = useLocation();
  const ticketId = location.state?.ticketId;
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [adminImages, setAdminImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [optionsTeam, setOptionsTeam] = useState([]);
  const [optionsStatus, setOptionsStatus] = useState([]);

  useEffect(() => {
    fetchTicket();
    fetchAttachments();
    fetchTeamMember();
    fetchStatusOptions();
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const fetchTicket = async () => {
    try {
      const response = await axios.get(
        `${API}/api/getticketbyid?ticketId=${ticketId}`
      );
      const responseData = response.data.ticket;
      setUserData(responseData);
      setValue("desc2", responseData.desc2);
      setValue("status", responseData.Status);
      setValue("team", responseData.team);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAttachments = async () => {
    try {
      const response = await axios.get(
        `${API}/api/getattachments?ticketId=${ticketId}`
      );

      const responseData = await response.data.attachments;

      setAttachment(responseData);
      await loadAttachmentFiles(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAttachmentFiles = async (attachments) => {
    const userImagesTemp = [];
    const adminImagesTemp = [];

    for (const attachment of attachments) {
      try {
        const response = await axios.get(
          `${API}/api/file/${attachment.attachment}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = URL.createObjectURL(blob);
        if (attachment.createdby === "user") {
          userImagesTemp.push(url);
        } else if (attachment.createdby === "admin") {
          adminImagesTemp.push(url);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setUserImages(userImagesTemp);
    setAdminImages(adminImagesTemp);
  };
  const fetchTeamMember = async () => {
    try {
      const response = await axios.get(`${API}/api/getadmin`);
      if (Array.isArray(response.data.user)) {
        setOptionsTeam(response.data.user);
      } else {
        console.error(
          "Expected an array of tax options, but got:",
          response.data
        );
        setOptionsTeam([]); // Fallback to an empty array if the structure is unexpected
      }
    } catch (error) {
      console.error("Error fetching Team Member:", error);
    }
  };
  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get(`${API}/api/getstatus`);
      if (Array.isArray(response.data.status)) {
        setOptionsStatus(response.data.status);
      } else {
        console.error(
          "Expected an array of tax options, but got:",
          response.data
        );
        setOptionsStatus([]); // Fallback to an empty array if the structure is unexpected
      }
    } catch (error) {
      console.error("Error fetching Team Member:", error);
    }
  };
 

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
    };
    try {
      const response = await axios.put(
        `${API}/api/ticketupdate?ticketId=${ticketId}`,
        formData
      );

      if (response.status === 200) {
        toast.success("Ticket Updated Successfully");
        if (selectedFiles.length > 0) {
          const uploadData = new FormData();
          uploadData.append("user", localStorage.getItem("user"));
          uploadData.append("ticketId", ticketId);
          uploadData.append("createdby", "admin");

          selectedFiles.forEach((file) => {
            uploadData.append("files", file);
          });

          const uploadResponse = await axios.post(`${API}/post`, uploadData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (uploadResponse.status === 200) {
            toast.success("Files uploaded successfully");
          } else {
            toast.error("Failed to upload files");
          }
        }
        navigate("/helpsupport");
      }
    } catch (error) {
      console.error("Error updating Ticket:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" mx-4 my-2 font-extralight  ">
          <div className="flex justify-between">
            {userData && (
              <div className="space-y-1">
                <p>{userData.fname}</p>
                <p>Ticket No : {userData.ticketId}</p>
                <span className="grid py-2">
                  <p> Date : {formatDate2(userData.createdAt)} </p>
                  <p> Category : {userData.category} </p>
                  <p>Priority : {userData.priority}</p>
                </span>
                <div className="flex gap-2 items-center">
                  <p>Attachments :</p>{" "}
                  {userImages.map((img, index) => (
                    <span key={index} onClick={() => openModal(img)}>
                      <img
                        src={img}
                        alt="User  Attachment"
                        className="w-10 h-10 cursor-pointer rounded-md"
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p>Description:</p>
          {userData && <p>{userData.desc1}</p>}
          <hr />
          {userData?.desc2 === null ? (
            <div>
              {hasReplyPermission ? (
                <div>
                  <div className="flex lg:justify-end md:justify-end">
                    <div className="grid mx-2 my-2 ">
                      <label>
                        Team Member <span className="text-red-600">*</span>
                      </label>
                      <div className="relative inline-block  ">
                        <select
                          defaultValue=""
                          className="  text-black lg:w-72 md:w-72 w-64 px-2 py-1.5 outline-none rounded-md "
                          {...register("team")}
                        >
                          <option value="" disabled>
                            Select team member
                          </option>
                          {optionsTeam &&
                            optionsTeam.map((user, index) => (
                              <option key={index} value={user.fname}>
                                {user.fname}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0  flex items-center pr-5 bg-gray-300 px-4 rounded-lg pointer-events-none outline-none">
                          <FaCaretDown className="text-black text-2xl" />
                        </div>
                        {errors.team && (
                          <p className="text-red-700">{errors.team?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex flex-col ">
                      <label className="mx-6">Add Reply</label>
                      <textarea
                        rows={9}
                        placeholder="write Reply"
                        className="rounded-3xl text-center place-content-center outline-none text-black "
                        {...register("desc2")}
                      ></textarea>
                      <p className="text-red-700">{errors.desc2?.message}</p>
                      <div className="lg:flex md:flex grid  justify-between my-2">
                        <div className="relative">
                          <label htmlFor="">
                            Attachments (you can select multiple files)
                          </label>
                          <div className="border bg-white rounded-lg py-1.5 my-1 flex items-center">
                            <div className="absolute inset-y-1 top-7 left-0 rounded-lg px-2 py-2  flex items-center  bg-gray-300  pointer-events-none outline-none text-black">
                              Choose Files
                            </div>
                            <input
                              accept=".jpg,.jpeg,.png,.gif"
                              type="file"
                              className="opacity-0 w-28 text-black "
                              id="file-input"
                              multiple
                              onChange={(e) =>
                                setSelectedFiles(Array.from(e.target.files))
                              }
                            />
                            <span
                              className="absolute top-12 -translate-y-1/2 lg:right-2 md:right-4 right-16 text-normal text-black"
                              id="file-name"
                            >
                              {selectedFiles.length > 0
                                ? `${selectedFiles.length} Files Selected`
                                : "No Files Chosen"}
                            </span>
                          </div>
                        </div>

                        <div className="grid mx-2">
                          <label htmlFor="">
                            Ticket status<span className="text-red-600">*</span>
                          </label>
                          <div className="relative inline-block  ">
                            <select
                              defaultValue=""
                              className="  text-black lg:w-72 md:w-72 w-full px-2 py-1.5 outline-none rounded-md "
                              {...register("status")}
                            >
                              <option value="" disabled>
                                select Status
                              </option>
                              {optionsStatus &&
                                optionsStatus.map((options, index) => (
                                  <option key={index} value={options.status}>
                                    {options.status}
                                  </option>
                                ))}
                            </select>

                            <div className="absolute inset-y-0  lg:bottom-2 md:bottom-2 right-0  flex items-center pr-5 bg-gray-300 px-4 rounded-lg pointer-events-none outline-none">
                              <FaCaretDown className="text-black text-2xl" />
                            </div>
                            {errors.status && (
                              <p className="text-red-700">
                                {errors.status?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mx-2 bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-10 py-2 my-4"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xl my-16 font-poppins text-center">
                  {" "}
                  Reply Permission Denied
                </p>
              )}
            </div>
          ) : (
            <div className="">
              <p className="text-lg mt-3 mb-2 ">Support</p>
              <p className="text-normal font-normal my-4">
                Date : {formatDate1(userData?.updatedAt)}
              </p>
              <span className="flex items-center gap-2 my-3 flex-wrap">
                <p className="text-normal font-normal ">Attachments :</p>
                {adminImages.map((img, index) => (
                  <span key={index} onClick={() => openModal(img)}>
                    <img
                      src={img}
                      alt="Admin Attachment"
                      className="w-10 h-10 cursor-pointer rounded-md"
                    />
                  </span>
                ))}
              </span>
              <p className="text-normal font-normal my-2">Description :</p>
              <p className="text-normal mb-5">{userData?.desc2}</p>
              <hr className="my-3 mb-12" />
            </div>
          )}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          imageUrl={selectedImage}
        />
      </form>
    </>
  );
};

export default ViewTicket;
