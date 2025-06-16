import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { API } from "../../Host";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../Firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";

const phoneSchema = yup.object().shape({
  phone: yup.string().required("Phone is required"),
});

const UpdatePhone = ({ ClosePhoneModal }) => {
  const email = localStorage.getItem("useremail");
  const oldPhone = localStorage.getItem("userphone");
  const [phone, setPhone] = useState(oldPhone || ""); // Initialize with oldPhone
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [countryCode, setCountryCode] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(phoneSchema),
  });

  useEffect(() => {
    if (oldPhone) {
      setValue("phone", oldPhone);
    }
  }, [oldPhone, setValue]);

  const onsubmit = async (data) => {
    const formData = { ...data };
    try {
      const response = await axios.post(
        `${API}/api/phoneupdate?email=${email}`,
        formData
      );
      if (response.status === 200) {
        toast.success("Phone updated successfully");
        localStorage.setItem("userphone", data.phone);
        ClosePhoneModal();
      } else {
        toast.error("Failed to update phone number");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating phone number");
    }
  };
  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data.dialCode);
  };
  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved:");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired.");
          },
        }
      );
    }
  };

  // Send OTP
  const sendOtp = async () => {
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = `+${phone}`;

      // Ensure the phone number has the country code
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      setConfirmationResult(confirmation);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      toast.error("Mobile Number already exists");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      if (!confirmationResult) {
        toast.error("Please send OTP first.");
        return;
      }
      await confirmationResult.confirm(otp);
      const localPhoneNumber = phone.slice(countryCode.length);

      // Call backend to update the phone number
      const formData = { phone: localPhoneNumber };

      const response = await axios.post(
        `${API}/api/phoneupdate?email=${email}`,
        formData
      );

      if (response.status === 200) {
        toast.success("Phone number verified and updated successfully!");
        localStorage.setItem("userphone", localPhoneNumber);
        ClosePhoneModal();
      } else {
        toast.error("Failed to update phone number in backend.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <Modal>
      <div className="w-[530px] min-h-[330px] my-3 mx-8 font-extralight font-poppins">
        <p
          className="text-end text-2xl font-medium"
          onClick={() => ClosePhoneModal()}
        >
          x
        </p>
        {!confirmationResult ? (
          <div>
            <p className="text-center text-lg my-2">Update Phone</p>
            <p className="text-center text-sm lg:mx-12 md:mx-12 mx-4 my-6">
              Enter your new Phone Number (please note we will send an OTP to
              your new phone number)
            </p>
            <div className="lg:mx-6 md:mx-6 mx-1 my-8">
              <label htmlFor="phone" className="text-normal">
                Phone
              </label>
              <PhoneInput
                country={"in"}
                className="text-black"
                value={phone} // Set phone state here
                onChange={handlePhoneChange} // Update phone state on change
                inputStyle={{
                  width: "230px",
                  height: "30px",
                  fontSize: "16px",
                  background: "transparent",
                  color: "white",
                  border: "none",
                }}
                buttonStyle={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px",
                  width: "60px",
                }}
                dropdownStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  maxHeight: "140px",
                  overflowY: "auto",
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div className="flex justify-center my-8">
              <button
                className={`font-normal bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2`}
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>
            <div id="recaptcha-container"></div>
          </div>
        ) : (
          <div className="text-center my-8 mx-6">
            <p className="my-2 font-bold text-2xl">Enter OTP</p>
            <OtpInput
              numInputs={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "50px",
                height: "50px",
                color: "black",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "20px",
                textAlign: "center",
                margin: "15px",
                outline: "none",
              }}
              focusStyle={{
                border: "2px solid #007BFF",
                outline: "none",
              }}
            />
            <button
              onClick={verifyOtp}
              className="bg-green-700 my-4 px-4 py-2 text-xl font-extralight"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UpdatePhone;
