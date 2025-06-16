import React, { useEffect, useState } from "react";
import StyledText from "../../components/StyledText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../Host";

const schema = yup.object().shape({
  terms: yup.string(),
  refund: yup.string(),
  billing: yup.string(),
  cancel: yup.string(),
  privacy: yup.string(),
});

const Policy = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [policy, setPolicy] = useState({
    terms: "",
    privacy: "",
    billing: "",
    refund: "",
    cancel: "",
  }); // Set default values to prevent undefined errors
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await axios.get(`${API}/api/policies`);
      const responseData = response.data.data || {};
      setPolicy({
        terms: responseData.terms || "",
        privacy: responseData.privacy || "",
        billing: responseData.billing || "",
        refund: responseData.refund || "",
        cancel: responseData.cancel || "",
      }); // Ensure all fields are set, even if empty
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    const fieldMap = {
      tab1: "terms",
      tab2: "privacy",
      tab3: "billing",
      tab4: "refund",
      tab5: "cancel",
    };
    const activeField = fieldMap[activeTab];
    const formData = {
      [activeField]: data[activeField],
    };

    try {
      const response = await axios.post(`${API}/api/policies`, formData);
      if (response.status === 200) {
        await fetchPolicy(); // Refresh the policy data
        reset(); // Clear input fields
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex my-4 w-full text-center">
        {["tab1", "tab2", "tab3", "tab4", "tab5"].map((tab, index) => {
          const labels = [
            "Terms & Conditions",
            "Privacy Policy",
            "Billing Policy",
            "Refund Policy",
            "Cancellation Policy",
          ];
          return (
            <p
              key={tab}
              className={`cursor-pointer text-base w-full px-1 py-2 my-1 transition-all duration-700 hover:bg-gradient-to-r from-[#110038] to-[#08006B] font-extralight ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#110038] to-[#08006B]"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {labels[index]}
            </p>
          );
        })}
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          {activeTab === "tab1" && (
            <TabContent
              label="Terms & Conditions"
              register={register("terms")}
              placeholder="Enter Terms & Conditions"
              value={policy.terms}
              errors={errors.terms}
            />
          )}
          {activeTab === "tab2" && (
            <TabContent
              label="Privacy Policy"
              register={register("privacy")}
              placeholder="Enter Privacy Policy"
              value={policy.privacy}
              errors={errors.privacy}
            />
          )}
          {activeTab === "tab3" && (
            <TabContent
              label="Billing Policy"
              register={register("billing")}
              placeholder="Enter Billing Policy"
              value={policy.billing}
              errors={errors.billing}
            />
          )}
          {activeTab === "tab4" && (
            <TabContent
              label="Refund Policy"
              register={register("refund")}
              placeholder="Enter Refund Policy"
              value={policy.refund}
              errors={errors.refund}
            />
          )}
          {activeTab === "tab5" && (
            <TabContent
              label="Cancellation Policy"
              register={register("cancel")}
              placeholder="Enter Cancellation Policy"
              value={policy.cancel}
              errors={errors.cancel}
            />
          )}
        </form>
      </div>
    </div>
  );
};

const TabContent = ({ label, register, placeholder, value, errors }) => (
  <div className="my-4">
    <input
      {...register}
      type="text"
      placeholder={placeholder}
      className="rounded-md w-1/3 my-4 mx-4 py-1.5 px-2 text-black"
    />
    {errors && <p className="text-red-500">{errors.message}</p>}
    <button className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-1.5">
      Submit
    </button>
    <p className="mx-4 my-1 text-2xl font-poppins">Policy</p>
    <hr className="my-2" />
    <StyledText text={value} />
  </div>
);

export default Policy;

