import { useState } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const storeId = location.state?.storeId;

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image_url: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeId) {
      alert("No store selected. Please select a store first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/products",
        {
          store_id: storeId,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          stock: Number(product.stock),
          description: product.description,
          image_url: product.image_url
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      navigate("/products", {
        state: { storeId: storeId }
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add product"
      );
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-container">

        <div className="add-product-header">
          <p>PRODUCT MANAGEMENT</p>

          <h1>Add New Product</h1>

          <span>
            Add a product to your online store.
          </span>
        </div>

        <div className="add-product-card">

          <form onSubmit={handleSubmit}>

            <div className="product-form-row">

              <div className="product-input">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Handmade Mug"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="product-input">
                <label>Category</label>

                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option>Home Decor</option>
                  <option>Handmade</option>
                  <option>Accessories</option>
                  <option>Beauty</option>
                  <option>Food & Beverage</option>
                </select>
              </div>

            </div>

            <div className="product-form-row">

              <div className="product-input">
                <label>Price (₹)</label>

                <input
                  type="number"
                  name="price"
                  placeholder="499"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="product-input">
                <label>Stock Quantity</label>

                <input
                  type="number"
                  name="stock"
                  placeholder="20"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

            </div>

            <div className="product-input">
              <label>Description</label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe your product..."
                value={product.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="product-input">
              <label>Product Image URL</label>

              <input
                type="url"
                name="image_url"
                placeholder="https://example.com/product-image.jpg"
                value={product.image_url}
                onChange={handleChange}
              />

              <small>
                Optional. Add a direct URL to your product image.
              </small>
            </div>

            <div className="product-form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/products", {
                    state: { storeId: storeId }
                  })
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-button"
              >
                Add Product
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddProduct;