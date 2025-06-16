import React, { useEffect, useRef, useState } from "react";
import certificate from "../../assets/certificate.jpg";
import Logo from "../../assets/SMC Logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import {toPng} from 'html-to-image'
import { toast } from "react-toastify";
import { formatDate2 } from "../../Host";
import { AiOutlineLoading } from "react-icons/ai";

const ViewCertificate = () => {
  const [processing, setProcessing] = useState(false);
  const userName = localStorage.getItem('fname');
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseTitle, end } = state || {};

  const pdfRef = useRef(null);

  const handleDownload = async () => {
    setProcessing(true);
      toPng(pdfRef.current, { cacheBust: false })
          .then((dataUrl) => {
              const link = document.createElement("a");
              link.download = "SMC Certificate.png";
              link.href = dataUrl;
              link.click();
              toast.success("Downloaded")
              setProcessing(false);
          })
          .catch((err) => {
              //DO NOTHING
          });
  };

  useEffect(() => {

    if (!courseTitle) {
        navigate("/create");
    }

}, []);

  return (
    <>
    <div className="relative font-poppins my-12"  ref={pdfRef}>
     
      <img src={certificate} alt="Certificate" className="w-full max-w-3xl h-auto mx-auto" />

      
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
        <img
          src={Logo}
          alt="Logo"
          className="  lg:w-72  md:w-72 w-60 mx-6 my-2" // Adjust logo size for responsiveness
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          CERTIFICATE OF COMPLETION
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6">This is to certify that</p>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-5">
         {userName}
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-8">
          has successfully completed the course on
        </p>
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4">
        {courseTitle}
        </h3>
        <p className="text-sm sm:text-base md:text-lg mb-4">on {formatDate2(end)}</p>
      </div>
      
    </div>
    <div className="flex justify-center my-8 ">
          <button  className={`text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-52 py-2.5 ${processing ? 'opacity-15' : ''}`}  disabled={processing} onClick={handleDownload}>
          {processing ?  <span className="flex justify-center gap-3"> <AiOutlineLoading className="h-6 w-6 animate-spin" /> <p>Downloading ....</p></span> : "Download Certificate" }
          </button>
    </div>
    </>
  );
};

export default ViewCertificate;