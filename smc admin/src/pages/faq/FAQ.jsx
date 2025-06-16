import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Accordion from "../../components/Accordion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  title: yup.string().required("Question is required"),
  content: yup.string().required("Content is required"),
});

const FAQ = () => {
  const [faq, setFaq] = useState([]);
  const [newFaq, setNewFaq] = useState([]);
  const [addFaq, setAddFaq] = useState(null);

  useEffect(() => {
    fetchNewFaq();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const formData = {
      ...data,
    };

    try {
      // Step 1: Authenticate the user
      const response = await axios.post(`${API}/api/faq`, formData);
      setFaq(response.data);

      if (response.status === 200) {
        fetchNewFaq();
        toast.success("FAQ created  Successfully");
        reset();
        setAddFaq(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNewFaq = async () => {
    try {
      const response = await axios.get(`${API}/api/getfaq`);
      const responseFaq = response.data.faq;
      setNewFaq(responseFaq);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFaq = () => {
    setAddFaq(!addFaq);
  };
  
  const handleCancel = () => {
    setAddFaq(null)
  }
  const Accdata = [
    ...(newFaq
      ? newFaq.map((data) => ({
          dataId: data._id,
          title: data.title, // Directly access the `title` property
          content: data.content, // Directly access the `content` property
        }))
      : []),
  ];

  return (
    <>
      <div className="mx-4 my-6 font-poppins">
        {addFaq !== null  && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-3 grid gap-2 w-96"
          >
            <label htmlFor="">Generate a FAQ ?</label>
            <textarea
              {...register("title")}
              name="title"
              id="question"
              className=" bg-transparent px-3 py-3 text-white border border-white rounded-lg placeholder-center"
              placeholder="Enter a  FAQ ?"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
            <label htmlFor="">FAQ Description</label>
            <textarea
              {...register("content")}
              name="content"
              id="answer"
              className=" bg-transparent px-3 py-4  text-white border border-white rounded-lg placeholder-center"
              placeholder="Enter description"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
            <div className="flex justify-center my-2 gap-2 ">
              <button
                type="submit"
                className=" text-white  text-lg  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-2 px-6  "
              >
                Save
              </button>
              <p
              onClick={handleCancel} className="cursor-pointer text-lg  bg-white  border-2 border-black  text-black px-6 py-2"
              >
               Cancel
              </p>
            </div>
          </form>
        )}
        <div className="flex justify-between items-center flex-wrap gap-3 mx-2">
          <p className="text-lg font-extralight">FAQ</p>
          <div className="flex gap-2">
            <button
              onClick={handleAddFaq}
              className=" text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-2 px-6  "
            >
              Add FAQ
            </button>
          </div>
        </div>
        <hr className="my-2 " />
        {Accdata.map(({ title, content, dataId }) => (
          <Accordion
            title={title}
            content={content}
            dataId={dataId}
            fetchNewFaq={fetchNewFaq}
          />
        ))}
      </div>
    </>
  );
};

export default FAQ;
