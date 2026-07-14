import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiX,
} from "react-icons/fi";

import styles from "./EditProductModal.module.css";

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  baseUrl,
  subCategories = [],
  onProductUpdated,
}) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    subCategoryId: "",
  });

  const [variants, setVariants] = useState([]);

  const [existingImages, setExistingImages] = useState([]);

  const [newImages, setNewImages] = useState([]);

  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setProductData({
        name: product.name || "",
        description: product.description || "",
        subCategoryId:
          product.subCategoryId?._id ||
          product.subCategoryId ||
          "",
      });

      setVariants(
        product.variants?.map((variant) => ({
          ram: variant.ram,
          price: variant.price,
          quantity: variant.quantity,
        })) || []
      );

      setExistingImages(product.images || []);
    }
  }, [isOpen, product]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [newImagePreviews]);

  if (!isOpen || !product) {
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
      return toast.error(
        "At least one variant is required"
      );
    }

    setVariants((prev) =>
      prev.filter(
        (_, variantIndex) => variantIndex !== index
      )
    );
  };

  const removeExistingImage = (index) => {
    const totalImages =
      existingImages.length + newImages.length;

    if (totalImages === 1) {
      return toast.error(
        "At least one product image is required"
      );
    }

    setExistingImages((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    const totalImages =
      existingImages.length +
      newImages.length +
      files.length;

    if (totalImages > 5) {
      e.target.value = "";

      return toast.error(
        "Maximum 5 images are allowed"
      );
    }

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImages((prev) => [
      ...prev,
      ...files,
    ]);

    setNewImagePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    const totalImages =
      existingImages.length + newImages.length;

    if (totalImages === 1) {
      return toast.error(
        "At least one product image is required"
      );
    }

    URL.revokeObjectURL(newImagePreviews[index]);

    setNewImages((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );

    setNewImagePreviews((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  const resetNewImages = () => {
    newImagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setNewImages([]);
    setNewImagePreviews([]);
  };

  const handleClose = () => {
    resetNewImages();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productData.name.trim() ||
      !productData.description.trim() ||
      !productData.subCategoryId
    ) {
      return toast.error(
        "All product fields are required"
      );
    }

    if (variants.length === 0) {
      return toast.error(
        "At least one variant is required"
      );
    }

    const invalidVariant = variants.some(
      (variant) =>
        !variant.ram?.trim() ||
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

    if (
      existingImages.length + newImages.length ===
      0
    ) {
      return toast.error(
        "At least one product image is required"
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "name",
        productData.name.trim()
      );

      formData.append(
        "description",
        productData.description.trim()
      );

      formData.append(
        "subCategoryId",
        productData.subCategoryId
      );

      const formattedVariants = variants.map(
        (variant) => ({
          ram: variant.ram.trim(),
          price: Number(variant.price),
          quantity: Number(variant.quantity),
        })
      );

      formData.append(
        "variants",
        JSON.stringify(formattedVariants)
      );

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${baseUrl}/api/product/updateProduct/${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      resetNewImages();

      await onProductUpdated?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
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
        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Title :</label>

            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleProductChange}
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
                      className={
                        styles.removeVariantButton
                      }
                      onClick={() =>
                        removeVariant(index)
                      }
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
            />
          </div>

          <div
            className={`${styles.formRow} ${styles.imageFormRow}`}
          >
            <label>Upload image:</label>

            <div className={styles.imageList}>
              {existingImages.map((image, index) => (
                <div
                  key={image}
                  className={styles.imagePreview}
                >
                  <img
                    src={`${baseUrl}${image}`}
                    alt={`Product ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeExistingImage(index)
                    }
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {newImagePreviews.map(
                (preview, index) => (
                  <div
                    key={preview}
                    className={styles.imagePreview}
                  >
                    <img
                      src={preview}
                      alt={`New product ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                    >
                      <FiX />
                    </button>
                  </div>
                )
              )}

              {existingImages.length +
                newImages.length <
                5 && (
                <label className={styles.imageUpload}>
                  <FiImage />

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImages}
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
              {loading ? "UPDATING..." : "UPDATE"}
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

export default EditProductModal;