import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import styles from "./Sidebar.module.css";

const Sidebar = ({
  categories = [],
  subCategories = [],
  selectedSubCategory,
  onSubCategorySelect,
}) => {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setOpenCategory((prev) =>
      prev === categoryId ? null : categoryId
    );
  };

  return (
    <aside className={styles.sidebar}>
      <h3>Categories</h3>

      <button
        type="button"
        className={styles.allCategories}
        onClick={() => onSubCategorySelect("")}
      >
        All categories
      </button>

      <div className={styles.categoryList}>
        {categories.map((category) => {
          const isOpen = openCategory === category._id;

          const categorySubCategories = subCategories.filter(
            (subCategory) => {
              const categoryId =
                subCategory.categoryId?._id ||
                subCategory.categoryId;

              return (
                categoryId?.toString() ===
                category._id?.toString()
              );
            }
          );

          return (
            <div
              key={category._id}
              className={styles.categoryItem}
            >
              <button
                type="button"
                className={styles.categoryButton}
                onClick={() =>
                  handleCategoryClick(category._id)
                }
              >
                <span>{category.name}</span>

                {isOpen ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </button>

              {isOpen && (
                <div className={styles.subCategoryList}>
                  {categorySubCategories.map(
                    (subCategory) => (
                      <button
                        key={subCategory._id}
                        type="button"
                        className={`${styles.subCategoryButton} ${
                          selectedSubCategory ===
                          subCategory._id
                            ? styles.active
                            : ""
                        }`}
                        onClick={() =>
                          onSubCategorySelect(
                            subCategory._id
                          )
                        }
                      >
                        <span
                          className={styles.categoryDot}
                        />

                        {subCategory.name}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;