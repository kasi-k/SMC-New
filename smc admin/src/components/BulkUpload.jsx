import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuFileText } from "react-icons/lu";

const BulkUpload = ({
  title = "",
  onUpload,
  onClose,
  sampleData,
  filename,
}) => {
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = () => {
    if (onUpload && file) {
      onUpload(file);
    }
  };

  const downloadSample = (data) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownload = () => {
    downloadSample(sampleData);
  };

  return (
    <div className="mx-8 mt-10 space-y-2 h-full">
      <p className="text-gray-300">Bulk Upload {title}</p>
      <div className="flex flex-col justify-between px-4 pt-4 w-full h-96 gap-2 bg-white rounded-lg">
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          htmlFor="dropzone-file"
        >
          <div className="flex flex-col items-center pt-5 pb-6 border-2 border-black border-dashed rounded-lg cursor-pointer">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <div className="mb-2 text-sm grid text-center text-gray-500">
              <span className="font-semibold">Click to upload</span> or{" "}
              <p>Drag and drop documents here</p>
            </div>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <p className="flex items-center  gap-2 text-black text-xs mt-4">
            <span className="text-black border-b-8 border-green-600 py-1 ">
              <LuFileText size={80} />
            </span>
            {file.name}
          </p>
        )}
        <div className="flex justify-end pb-2 gap-1 text-sm">
          <p
            onClick={handleDownload}
            className="cursor-pointer border border-black text-black rounded-sm px-4 py-1"
          >
            Download Sample File
          </p>
          <p
            onClick={onClose}
            className="cursor-pointer border border-black text-black rounded-sm px-4 py-1"
          >
            Close
          </p>
          <p
            onClick={handleUpload}
            className={`cursor-pointer rounded-sm px-4 py-1 bg-gradient-to-r from-blue-900 to-fuchsia-600 ${
              !file ? "opacity-80  pointer-events-none" : ""
            }`}
          >
            Upload
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
