import React, { useState } from "react";
import Select from "react-select";
import { FaCaretDown } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";

const schema = yup
  .object()
  .shape({
    status: yup.string().trim().required("Priority Name is required"),
    color: yup
      .string()
      .required("Please select a color")
      .oneOf(["green", "blue", "yellow"], "Invalid color selection"),
  })
  .required();

const AddStatus = ({ onClose, fetchStatus }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorData, setColorData] = useState([]);

  const colorOptions = [
    { value: "green", color: "green" },
    { value: "blue", color: "blue" },
    { value: "yellow", color: "yellow" },
  ];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    setColorData([...colorData, data.color]);

    const formData = {
      ...data,
    };

    try {
      const response = await axios.post(`${API}/api/status`, formData);

      const responseData = response.data.Status;

      if (response.status === 200) {
        toast.success("New status Added");
        if (onClose) {
          onClose();
          fetchStatus();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedColor(selectedOption);
  };
  return (
    <div className="mx-4">
      <p className="my-8">Add Status</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 items-center my-4 "
      >
        <label htmlFor="">
          Status Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Status Name"
          className=" text-black rounded-md lg:w-7/12 md:w-3/5 w-5/6 py-2 px-3 "
          {...register("status")}
        />
        <label htmlFor="">
          Select Color <span className="text-red-600 ">*</span>
        </label>
        <div className="relative inline-block lg:w-7/12 md:w-3/5 w-5/6 ">
          <Controller
            name="color"
            control={control}
            rules={{ required: "Please select a color" }}
            render={({ field }) => (
              <Select
                {...field}
                className=" outline-none rounded-md"
                value={selectedColor}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  handleChange(selectedOption);
                }}
                options={colorOptions}
                getOptionLabel={(e) => (
                  <div
                    style={{
                      backgroundColor: e.color,
                      padding: "16px",
                      width: "95%",
                    }}
                  ></div>
                )}
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.color?.message}</p>
          <div className="absolute inset-y-0 right-0.5   flex items-center pr-5 bg-gray-300 px-4 rounded-lg pointer-events-none outline-none">
            <FaCaretDown className="text-black text-2xl" />
          </div>
        </div>
        <div className="flex justify-center my-4 w-7/12">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5  "
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStatus;
