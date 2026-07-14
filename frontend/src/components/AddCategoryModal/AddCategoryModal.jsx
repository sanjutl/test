import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

import styles from "./AddCategoryModal.module.css";

const AddCategoryModal = ({
  isOpen,
  onClose,
  baseUrl,
  onCategoryCreated,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${baseUrl}/api/category/createCategory`,
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setName("");

      onCategoryCreated?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
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
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
        >
          <FiX />
        </button>

        <h2>Add Category</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="categoryName">
            Category name
          </label>

          <input
            id="categoryName"
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;