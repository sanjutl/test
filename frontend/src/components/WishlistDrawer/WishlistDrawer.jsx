import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiChevronRight,
  FiHeart,
  FiStar,
  FiXCircle,
} from "react-icons/fi";

import styles from "./WishlistDrawer.module.css";
import baseUrl from "../../baseUrl";
const WishlistDrawer = ({
  isOpen,
  onClose,
  baseUrl,
  onProductClick,
}) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${baseUrl}/api/wishList/getWishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist(res.data.wishlist || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWishlist();
    }
  }, [isOpen]);

  const handleRemoveWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${baseUrl}/api/wishlist/removeFromWishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setWishlist((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  return (
    <div
      className={`${styles.drawerOverlay} ${
        isOpen ? styles.open : ""
      }`}
      onClick={onClose}
    >
      <aside
        className={`${styles.drawer} ${
          isOpen ? styles.drawerOpen : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.heartIcon}>
              <FiHeart />
            </div>

            <h2>Items</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <FiChevronRight />
          </button>
        </div>

        <div className={styles.wishlistContent}>
          {loading ? (
            <p className={styles.message}>
              Loading wishlist...
            </p>
          ) : wishlist.length === 0 ? (
            <p className={styles.message}>
              Your wishlist is empty
            </p>
          ) : (
            wishlist.map((product) => {
              const firstVariant = product.variants?.[0];

              return (
                <div
                  key={product._id}
                  className={styles.wishlistItem}
                >
                  <button
                    type="button"
                    className={styles.productContent}
                    onClick={() => {
                      onProductClick?.(product._id);
                      onClose();
                    }}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={`${baseUrl}${product.images?.[0]}`}
                        alt={product.name}
                      />
                    </div>

                    <div className={styles.productInfo}>
                      <h3>{product.name}</h3>

                      <p>
                        ${firstVariant?.price ?? 0}
                      </p>

                      <div className={styles.rating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar key={star} />
                        ))}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() =>
                      handleRemoveWishlist(product._id)
                    }
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <FiXCircle />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};

export default WishlistDrawer;