import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import baseUrl from "../../baseUrl";
import styles from "./HomePage.module.css";
import AddCategoryModal from "../../components/AddCategoryModal/AddCategoryModal";
import AddSubCategoryModal from "../../components/AddSubCategoryModal/AddSubCategoryModal";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import WishlistDrawer from "../../components/WishlistDrawer/WishlistDrawer";
const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const limit = 6;
  const token = localStorage.getItem("token");
  const fetchProducts = async () => {
    try {
      const params = {
        page: currentPage,
        limit,
      };

      if (search) {
        params.search = search;
      }

      if (selectedSubCategory) {
        params.subCategoryId = selectedSubCategory;
      }

      const res = await axios.get(`${baseUrl}/api/product/getProduct`, {
        params,
      });
      console.log(res);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/category/getCategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data.categories);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
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
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${baseUrl}/api/wishList/getWishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlist = res.data.wishlist || [];

      const ids = wishlist.map((product) => product._id);

      setWishlistIds(ids);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchWishlist();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, selectedSubCategory]);

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleWishlist = async (productId, isWishlisted) => {
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

        setWishlistIds((prev) => prev.filter((id) => id !== productId));

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

        setWishlistIds((prev) => [...prev, productId]);

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };
  const displayedProducts = Math.min(currentPage * limit, totalProducts);
  return (
    <div className={styles.homePage}>
      <Navbar
        search={search}
        setSearch={setSearch}
        onWishlistOpen={() => setIsWishlistOpen(true)}
      />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <span>Home</span>
          <span>›</span>
        </div>

        <div className={styles.actionButtons}>
          <button type="button" onClick={() => setIsCategoryModalOpen(true)}>
            Add category
          </button>

          <button type="button" onClick={() => setIsSubCategoryModalOpen(true)}>
            Add sub category
          </button>

          <button type="button" onClick={() => setIsProductModalOpen(true)}>
            Add product
          </button>
        </div>

        <div className={styles.content}>
          <Sidebar
            categories={categories}
            subCategories={subCategories}
            selectedSubCategory={selectedSubCategory}
            onSubCategorySelect={handleSubCategorySelect}
          />

          <section className={styles.productSection}>
            {products.length > 0 ? (
              <>
                <div className={styles.productGrid}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      baseUrl={baseUrl}
                      isWishlisted={wishlistIds.includes(product._id)}
                      onWishlist={handleWishlist}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>

                <div className={styles.productFooter}>
                  <p style={{ marginTop: "20px", textAlign: "right" }}>
                    {displayedProducts} of {totalProducts} items
                  </p>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className={styles.noProducts}>No products found</div>
            )}
          </section>
        </div>
      </main>
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        baseUrl={baseUrl}
        onCategoryCreated={fetchCategories}
      />
      <AddSubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        baseUrl={baseUrl}
        categories={categories}
        onSubCategoryCreated={fetchSubCategories}
      />
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        baseUrl={baseUrl}
        subCategories={subCategories}
        onProductCreated={fetchProducts}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => {
          setIsWishlistOpen(false);
          fetchWishlist();
        }}
        baseUrl={baseUrl}
        onProductClick={(productId) => navigate(`/product/${productId}`)}
      />
    </div>
  );
};

export default HomePage;
