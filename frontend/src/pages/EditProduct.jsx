import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const productId = location.state?.productId;
  const storeId = location.state?.storeId;

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image_url: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {

      if (!productId) {
        alert("Product information not found.");
        navigate("/products");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          `/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const existingProduct = response.data;

        setProduct({
          name: existingProduct.name,
          category: existingProduct.category,
          price: existingProduct.price,
          stock: existingProduct.stock,
          description: existingProduct.description || "",
          image_url: existingProduct.image_url || ""
        });

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load product"
        );

        navigate("/products", {
          state: { storeId: storeId }
        });
      }
    };

    fetchProduct();

  }, [productId, navigate, storeId]);


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
      alert("Store information not found.");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/products/${productId}`,
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
        "Failed to update product"
      );
    }
  };


  return (
    <div className="edit-product-page">

      <div className="edit-product-card">

        <div className="edit-product-header">
          <h1>Edit Product</h1>
          <p>Update your product information</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Enter stock"
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>

          <div className="form-group">
            <label>Product Image URL</label>

            <input
              type="url"
              name="image_url"
              value={product.image_url}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
            />

            <small>
              Optional. Add or update the product image URL.
            </small>
          </div>

          <div className="form-actions">

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
              className="update-button"
            >
              Update Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;