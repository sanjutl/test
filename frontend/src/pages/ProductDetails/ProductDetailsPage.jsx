import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiCheck,
  FiChevronRight,
  FiHeart,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

import Navbar from "../../components/Navbar/Navbar";
import styles from "./ProductDetailsPage.module.css";
import baseUrl from "../../baseUrl";
import EditProductModal from "../../components/EditProductModal/EditProductModal";
import WishlistDrawer from "../../components/WishlistDrawer/WishlistDrawer";
const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseUrl}/api/product/getProduct/${productId}`,
      );

      const productData = res.data.product;

      setProduct(productData);

      if (productData.images?.length > 0) {
        setSelectedImage(productData.images[0]);
      }

      if (productData.variants?.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/subcategory/getSubCategory`);
      setSubCategories(res.data.subcategory);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch subcategories",
      );
    }
  };
  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${baseUrl}/api/wishlist/getWishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlist = res.data.wishlist || [];

      const exists = wishlist.some((item) => item._id === productId);

      setIsWishlisted(exists);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchSubCategories();
    checkWishlistStatus();
  }, [productId]);

  const increaseQuantity = () => {
    if (!selectedVariant) {
      return;
    }

    if (quantity >= selectedVariant.quantity) {
      return toast.error("Maximum stock reached");
    }

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (isWishlisted) {
        const res = await axios.delete(
          `${baseUrl}/api/wishList/removeFromWishlist/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setIsWishlisted(false);

        toast.success(res.data.message);
      } else {
        const res = await axios.post(
          `${baseUrl}/api/wishList/addToWishlist/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setIsWishlisted(true);

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading product...</div>;
  }

  if (!product) {
    return <div className={styles.loading}>Product not found</div>;
  }

  const totalStock = product.variants?.reduce(
    (total, variant) => total + Number(variant.quantity),
    0,
  );

  return (
    <div className={styles.productDetailsPage}>
      <Navbar
        search={search}
        setSearch={setSearch}
        onWishlistOpen={() => {
          console.log("Opening wishlist", isWishlistOpen);
          setIsWishlistOpen(true);
        }}
      />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <button type="button" onClick={() => navigate("/home")}>
            Home
          </button>

          <FiChevronRight />

          <span>Product details</span>

          <FiChevronRight />
        </div>

        <div className={styles.productContainer}>
          <section className={styles.productGallery}>
            <div className={styles.mainImage}>
              <img src={`${baseUrl}${selectedImage}`} alt={product.name} />
            </div>

            <div className={styles.thumbnailList}>
              {product.images?.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`${styles.thumbnail} ${
                    selectedImage === image ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={`${baseUrl}${image}`} alt={product.name} />
                </button>
              ))}
            </div>
          </section>

          <section className={styles.productInfo}>
            <h1>{product.name}</h1>

            <p className={styles.price}>${selectedVariant?.price ?? 0}</p>

            <div className={styles.availability}>
              <span>Availability:</span>

              {selectedVariant?.quantity > 0 ? (
                <div className={styles.inStock}>
                  <FiCheck />
                  <span>In stock</span>
                </div>
              ) : (
                <span className={styles.outOfStock}>Out of stock</span>
              )}
            </div>

            <p className={styles.stockMessage}>
              Hurry up! only {selectedVariant?.quantity ?? 0} product left in
              stock!
            </p>

            <div className={styles.divider} />

            <div className={styles.variantContainer}>
              <span>Ram:</span>

              <div className={styles.variantList}>
                {product.variants?.map((variant) => (
                  <button
                    key={variant._id}
                    type="button"
                    className={
                      selectedVariant?._id === variant._id
                        ? styles.activeVariant
                        : ""
                    }
                    onClick={() => handleVariantSelect(variant)}
                  >
                    {variant.ram}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.quantityContainer}>
              <span>Quantity :</span>

              <div className={styles.quantityControl}>
                <button type="button" onClick={decreaseQuantity}>
                  <FiMinus />
                </button>

                <span>{quantity}</span>

                <button type="button" onClick={increaseQuantity}>
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit product
              </button>

              <button
                type="button"
                className={styles.buyButton}
                disabled={selectedVariant?.quantity <= 0}
              >
                Buy it now
              </button>

              <button
                type="button"
                className={`${styles.wishlistButton} ${
                  isWishlisted ? styles.wishlisted : ""
                }`}
                onClick={handleWishlist}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <FiHeart fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </section>
        </div>
      </main>
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        baseUrl={baseUrl}
        subCategories={subCategories}
        onProductUpdated={fetchProduct}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        baseUrl={baseUrl}
        onProductClick={(productId) => navigate(`/product/${productId}`)}
      />
    </div>
  );
};

export default ProductDetailsPage;
