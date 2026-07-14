import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import styles from "./AddSubCategoryModal.module.css";

const AddSubCategoryModal = ({
  isOpen,
  onClose,
  baseUrl,
  categories = [],
  onSubCategoryCreated,
}) => {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setCategoryId("");
    setName("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      return toast.error("Please select a category");
    }

    if (!name.trim()) {
      return toast.error("Sub category name is required");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${baseUrl}/api/subcategory/createSubCategory`,
        {
          name: name.trim(),
          categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      resetForm();

      onSubCategoryCreated?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create sub category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add Sub Category</h2>

        <form onSubmit={handleSubmit}>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter sub category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.addButton}
              disabled={loading}
            >
              {loading ? "ADDING..." : "ADD"}
            </button>

            <button
              type="button"
              className={styles.discardButton}
              onClick={handleClose}
            >
              DISCARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;