import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ProductCatalog.css";

function ProductCatalog() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the selected store ID
  const storeId = location.state?.storeId;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/products",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Show products belonging to the selected store
        const storeProducts = response.data.filter(
          (product) => product.store_id === storeId
        );

        setProducts(storeProducts);

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load products"
        );
      }
    };

    if (storeId) {
      fetchProducts();
    }
  }, [storeId]);

  const filteredProducts = products.filter((product) => {

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product.id !== productId
        )
      );

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete product"
      );
    }
  };

  return (
    <div className="products-page">

      {/* ===============================
          DASHBOARD LINK
      =============================== */}

      <button
        className="dashboard-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>


      <header className="products-header">

        <div>
          <p className="page-label">STORE MANAGEMENT</p>

          <h1>Products</h1>

          <p>
            Manage the products available in your online store.
          </p>
        </div>

        <Link
          to="/add-product"
          state={{ storeId: storeId }}
          className="add-product-button"
        >
          + Add Product
        </Link>

      </header>

      <div className="products-toolbar">

        <div className="search-box">
          🔍

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All Categories</option>
          <option>Home Decor</option>
          <option>Handmade</option>
          <option>Accessories</option>
          <option>Beauty</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Food & Beverage</option>
        </select>

      </div>

      <div className="products-count">
        {filteredProducts.length} products
      </div>

      <div className="products-grid">

        {filteredProducts.map((product) => (

          <div
            className="product-card"
            key={product.id}
          >

            <div className="product-image">

              {product.image_url ? (

                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "block";
                  }}
                />

              ) : null}

              <span
                style={{
                  display: product.image_url ? "none" : "block"
                }}
              >
                📦
              </span>

            </div>

            <div className="product-info">

              <div className="product-category">
                {product.category}
              </div>

              <h2>{product.name}</h2>

              <div className="product-bottom">

                <div>

                  <p className="product-price">
                    ₹{product.price}
                  </p>

                  <p className="stock">
                    {product.stock} in stock
                  </p>

                </div>

                <div className="product-actions">

                  <button
                    onClick={() =>
                      navigate("/edit-product", {
                        state: {
                          productId: product.id,
                          storeId: storeId
                        }
                      })
                    }
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    🗑️
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ProductCatalog;