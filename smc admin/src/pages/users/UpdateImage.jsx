import React, { useState } from "react";
import Modal from "../../components/Modal";
import axios from "axios";
import { API } from "../../Host";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateImage = ({ CloseProfileModal }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [preview, setPreview] = useState("");
  const location = useLocation();
  const userId = location.state?.userId;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file!");
      return;
    }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds 2MB!");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setBase64Image(base64String);
      setPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }

    const payload = {
      name: selectedFile.name,
      user: userId,
      image: base64Image,
    };

    try {
      const response = await axios.post(`${API}/api/images`, payload);
      if (response.status === 200) {
        toast.success("Profile Image Updated Succesfully");
        CloseProfileModal();
      } else {
        toast.error("Failed to Upload");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal>
      <div className="w-[530px] min-h-[330px] my-3 mx-8 font-extralight font-poppins">
        <p
          className="text-end text-2xl font-medium"
          onClick={() => CloseProfileModal()}
        >
          x
        </p>
        <p className="mx-16 text-xl my-3">Choose Profile Image</p>

        <div className="relative w-2/3 mx-20">
          <div className="border bg-white rounded-lg py-1.5 my-1 ">
            <div className="absolute inset-y-0  left-0 rounded-lg px-2 py-5 flex items-center  bg-gray-300  pointer-events-none outline-none text-black">
              Choose Files
            </div>
            <input
              accept=".jpg,.jpeg,.png,.gif"
              type="file"
                className="opacity-0 w-28 text-black "
              id="file-input"
              onChange={handleFileChange}
            />

            <span
              className="absolute top-5 -translate-y-1/2 lg:right-2 md:right-4 right-16 text-normal text-black "
              id="file-name"
            >
              No Files Chosen
            </span>
          </div>
        </div>
        {preview && (
          <div className="text-center text-lg my-2">
            <p className="text-center text-xl my-2">Preview </p>
            <img src={preview} alt="Preview" className="w-60 mx-auto" />
          </div>
        )}
        <div className="flex justify-center my-8">
          <button
            className={` font-normal   bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2 `}
            onClick={handleUpload}
          >
            Change Image
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateImage;
