import {
  FiHeart,
  FiStar,
} from "react-icons/fi";

import styles from "./ProductCard.module.css";

const ProductCard = ({
  product,
  baseUrl,
  onWishlist,
  onProductClick,
  isWishlisted = false,
}) => {
  const firstVariant = product?.variants?.[0];

  const imageUrl = product?.images?.[0]
    ? `${baseUrl}${product.images[0]}`
    : "";

  return (
    <article
      className={styles.productCard}
      onClick={() => onProductClick?.(product._id)}
    >
      <button
        type="button"
        className={`${styles.wishlistButton} ${
          isWishlisted ? styles.wishlisted : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();

          onWishlist?.(
            product._id,
            isWishlisted
          );
        }}
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <FiHeart
          fill={
            isWishlisted
              ? "currentColor"
              : "none"
          }
        />
      </button>

      <div className={styles.imageContainer}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
          />
        )}
      </div>

      <div className={styles.productInfo}>
        <h3>{product?.name || ""}</h3>

        <p className={styles.price}>
          ${firstVariant?.price ?? 0}
        </p>

        <div className={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar key={star} />
          ))}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;