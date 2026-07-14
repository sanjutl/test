import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSun,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";

import styles from "./Navbar.module.css";

const Navbar = ({
  search,
  setSearch,
  onWishlistOpen,
}) => {
  const [searchInput, setSearchInput] = useState(
    search || ""
  );

  const navigate = useNavigate();

  const handleSearch = () => {
    setSearch(searchInput.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.navSpacer} />

        <form
          className={styles.searchContainer}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search any things"
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        <div className={styles.navActions}>
          <FiSun />

          

          <div className={styles.action}>
            <FiShoppingCart />
            <span>Cart</span>
          </div>

          <button
            type="button"
            className={styles.actionButton}
            onClick={() => onWishlistOpen?.()}
          >
            <FiHeart />
            <span>Items</span>
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;