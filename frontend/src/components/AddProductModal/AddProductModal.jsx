import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiX,
} from "react-icons/fi";

import styles from "./AddProductModal.module.css";

const AddProductModal = ({
  isOpen,
  onClose,
  baseUrl,
  subCategories = [],
  onProductCreated,
}) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    subCategoryId: "",
  });

  const [variants, setVariants] = useState([
    {
      ram: "",
      price: "",
      quantity: 1,
    },
  ]);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  if (!isOpen) {
    return null;
  }

  const handleProductChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  const increaseQuantity = (index) => {
    setVariants((prev) =>
      prev.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              quantity: Number(variant.quantity) + 1,
            }
          : variant
      )
    );
  };

  const decreaseQuantity = (index) => {
    setVariants((prev) =>
      prev.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              quantity: Math.max(
                0,
                Number(variant.quantity) - 1
              ),
            }
          : variant
      )
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        ram: "",
        price: "",
        quantity: 1,
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      return toast.error("At least one variant is required");
    }

    setVariants((prev) =>
      prev.filter((_, variantIndex) => variantIndex !== index)
    );
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    const updatedImages = [...images, ...files];

    if (updatedImages.length > 5) {
      return toast.error("Maximum 5 images are allowed");
    }

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImages(updatedImages);

    setImagePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const resetForm = () => {
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setProductData({
      name: "",
      description: "",
      subCategoryId: "",
    });

    setVariants([
      {
        ram: "",
        price: "",
        quantity: 1,
      },
    ]);

    setImages([]);
    setImagePreviews([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productData.name.trim() ||
      !productData.description.trim() ||
      !productData.subCategoryId
    ) {
      return toast.error("All product fields are required");
    }

    const invalidVariant = variants.some(
      (variant) =>
        !variant.ram.trim() ||
        variant.price === "" ||
        Number(variant.price) < 0 ||
        variant.quantity === "" ||
        Number(variant.quantity) < 0
    );

    if (invalidVariant) {
      return toast.error(
        "Each variant must contain valid RAM, price and quantity"
      );
    }

    if (images.length === 0) {
      return toast.error("At least one product image is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", productData.name.trim());

      formData.append(
        "description",
        productData.description.trim()
      );

      formData.append(
        "subCategoryId",
        productData.subCategoryId
      );

      const formattedVariants = variants.map((variant) => ({
        ram: variant.ram.trim(),
        price: Number(variant.price),
        quantity: Number(variant.quantity),
      }));

      formData.append(
        "variants",
        JSON.stringify(formattedVariants)
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${baseUrl}/api/product/createProduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      resetForm();

      await onProductCreated?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create product"
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
        <h2>Add Product</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Title :</label>

            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleProductChange}
              placeholder="Enter product title"
            />
          </div>

          <div
            className={`${styles.formRow} ${styles.variantFormRow}`}
          >
            <label>Variants :</label>

            <div className={styles.variantSection}>
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className={styles.variantRow}
                >
                  <div className={styles.variantField}>
                    <span>Ram:</span>

                    <input
                      type="text"
                      value={variant.ram}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "ram",
                          e.target.value
                        )
                      }
                      placeholder="4 GB"
                    />
                  </div>

                  <div className={styles.variantField}>
                    <span>Price:</span>

                    <input
                      type="number"
                      min="0"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="529.99"
                    />
                  </div>

                  <div className={styles.quantityField}>
                    <span>QTY:</span>

                    <div className={styles.quantityControl}>
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(index)
                        }
                      >
                        <FiChevronLeft />
                      </button>

                      <span>{variant.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(index)
                        }
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeVariantButton}
                      onClick={() => removeVariant(index)}
                      aria-label="Remove variant"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className={styles.addVariantButton}
                onClick={addVariant}
              >
                Add variants
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Sub category :</label>

            <select
              name="subCategoryId"
              value={productData.subCategoryId}
              onChange={handleProductChange}
            >
              <option value="">
                Select sub category
              </option>

              {subCategories.map((subCategory) => (
                <option
                  key={subCategory._id}
                  value={subCategory._id}
                >
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Description :</label>

            <input
              type="text"
              name="description"
              value={productData.description}
              onChange={handleProductChange}
              placeholder="Enter product description"
            />
          </div>

          <div
            className={`${styles.formRow} ${styles.imageFormRow}`}
          >
            <label>Upload image:</label>

            <div className={styles.imageList}>
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview}
                  className={styles.imagePreview}
                >
                  <img
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className={styles.imageUpload}>
                  <FiImage />

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                  />
                </label>
              )}
            </div>
          </div>

          <div className={styles.actionButtons}>
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
              disabled={loading}
            >
              DISCARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;