import axios from "axios";
import React, { useState } from "react";
import { API } from "../../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const AddCategoryManagement = () => {
    const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    subCategory1: [],
    subCategory2: [],
  });

  const [newSubCatInput, setNewSubCatInput] = useState("");
  const [newNestedSubInput, setNewNestedSubInput] = useState({});
  const [newMainSubInput, setNewMainSubInput] = useState("");

  // Handle category input
  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  // Add new subCategory1 via input
  const handleAddSubCategory1 = () => {
    if (newMainSubInput.trim() && !formData.subCategory1.includes(newMainSubInput.trim())) {
      setFormData({
        ...formData,
        subCategory1: [...formData.subCategory1, newMainSubInput.trim()],
        subCategory2: [
          ...formData.subCategory2,
          { subCategory1: newMainSubInput.trim(), subCategories: [] },
        ],
      });
      setNewMainSubInput(""); // Clear input
    }
  };

  // Remove subCategory1 and its nested subcategories
  const removeSubCategory1 = (index) => {
    const updatedSubCategory1 = formData.subCategory1.filter((_, i) => i !== index);
    const updatedSubCategory2 = formData.subCategory2.filter(
      (item) => item.subCategory1 !== formData.subCategory1[index]
    );

    setFormData({
      ...formData,
      subCategory1: updatedSubCategory1,
      subCategory2: updatedSubCategory2,
    });
  };

  // Add subCategory under a specific subCategory1 via inline input
  const handleAddSubCategory = (subCatName) => {
    const value = newNestedSubInput[subCatName] || "";
    if (value.trim()) {
      const updatedSubCategory2 = formData.subCategory2.map((item) => {
        if (item.subCategory1 === subCatName) {
          return {
            ...item,
            subCategories: [...item.subCategories, value.trim()],
          };
        }
        return item;
      });

      setFormData({
        ...formData,
        subCategory2: updatedSubCategory2,
      });

      setNewNestedSubInput({
        ...newNestedSubInput,
        [subCatName]: "",
      });
    }
  };

  // Remove a specific subCategory
  const removeSubCategory = (subCatName, index) => {
    const updatedSubCategory2 = formData.subCategory2.map((item) => {
      if (item.subCategory1 === subCatName) {
        return {
          ...item,
          subCategories: item.subCategories.filter((_, i) => i !== index),
        };
      }
      return item;
    });

    setFormData({
      ...formData,
      subCategory2: updatedSubCategory2,
    });
  };

  // Submit handler
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    try {
      setIsSaving(true);
      const response = await axios.post(`${API}/api/categorycourse`, formData);
      if (response.status === 201) {
        toast.success("Category created successfully");
       navigate("/categorymanagement");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 rounded shadow ">
      <div className="mb-4">
        <label className="block text-white font-bold mb-2">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={handleCategoryChange}
          placeholder="e.g. Engineering"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-bold mb-2">Sub Category 1</label>
        <ul className="space-y-6 mb-2">
          {formData.subCategory1.map((subCat, index) => (
            <li key={index} className="flex flex-col space-y-4 border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{subCat}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => removeSubCategory1(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Inline Input for Adding Nested Subcategory */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Add SubCategory 2"
                  className="flex-1 border rounded px-3 py-1 text-sm"
                  value={newNestedSubInput[subCat] || ""}
                  onChange={(e) =>
                    setNewNestedSubInput({
                      ...newNestedSubInput,
                      [subCat]: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => handleAddSubCategory(subCat)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Add
                </button>
              </div>

              {/* List of Nested Subcategories */}
              {formData.subCategory2.find((item) => item.subCategory1 === subCat)?.subCategories.length > 0 && (
                <ul className="pl-4 space-y-1 mt-1">
                  {formData.subCategory2
                    .find((item) => item.subCategory1 === subCat)
                    ?.subCategories.map((s, i) => (
                      <li key={i} className="flex gap-6 text-sm">
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => removeSubCategory(subCat, i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}

          {/* Add New Main SubCategory Input */}
          <div className="mt-4 flex space-x-2 pt-5 ">
            <input
              type="text"
              placeholder="Add new Sub Category 1"
              className="flex-1 border rounded px-3 py-1"
              value={newMainSubInput}
              onChange={(e) => setNewMainSubInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddSubCategory1}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Add
            </button>
          </div>
        </ul>
      </div>

       <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <AiOutlineLoading className="animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Category"
            )}
          </button>
    </form>
  );
};

export default AddCategoryManagement;