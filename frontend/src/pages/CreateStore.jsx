import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./CreateStore.css";

function CreateStore() {
  const navigate = useNavigate();

  const [store, setStore] = useState({
    store_name: "",
    category: "",
    description: "",
    business_email: "",
    phone: "",
    store_url: ""
  });

  const createStoreUrl = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "store_name") {
      setStore({
        ...store,
        store_name: value,
        store_url: createStoreUrl(value)
      });

      return;
    }

    if (name === "store_url") {
      setStore({
        ...store,
        store_url: createStoreUrl(value)
      });

      return;
    }

    setStore({
      ...store,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!store.store_url) {
      alert("Please enter a valid store name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/stores",
        {
          store_name: store.store_name,
          category: store.category,
          description: store.description,
          business_email: store.business_email,
          phone: store.phone,
          store_url: store.store_url
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      navigate("/templates", {
        state: {
          storeId: response.data.storeId
        }
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create store"
      );
    }
  };

  return (
    <div className="create-store-page">

      <div className="create-store-container">

        <div className="create-store-header">
          <div>
            <p className="step-text">STEP 1 OF 3</p>

            <h1>Create your store</h1>

            <p>
              Tell us a little about your business to get started.
            </p>
          </div>
        </div>

        <div className="store-form-card">

          <div className="form-section">
            <h2>Business Information</h2>

            <p>
              These details will appear on your online store.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <div className="store-input">
                <label>Store Name</label>

                <input
                  type="text"
                  name="store_name"
                  value={store.store_name}
                  onChange={handleChange}
                  placeholder="e.g. Arman's Store"
                  required
                />
              </div>

              <div className="store-input">
                <label>Business Category</label>

                <select
                  name="category"
                  value={store.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option>Clothing</option>
                  <option>Food & Beverage</option>
                  <option>Handmade Products</option>
                  <option>Electronics</option>
                  <option>Beauty & Wellness</option>
                  <option>Other</option>
                </select>
              </div>

            </div>

            <div className="store-input">
              <label>Store Description</label>

              <textarea
                name="description"
                rows="4"
                value={store.description}
                onChange={handleChange}
                placeholder="Tell customers about your business..."
              ></textarea>
            </div>

            <div className="form-row">

              <div className="store-input">
                <label>Business Email</label>

                <input
                  type="email"
                  name="business_email"
                  value={store.business_email}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div className="store-input">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={store.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

            </div>

            <div className="store-input">
              <label>Store URL</label>

              <div className="url-input">

                <span>storebuilder.com/</span>

                <input
                  type="text"
                  name="store_url"
                  value={store.store_url}
                  onChange={handleChange}
                  placeholder="your-store"
                  required
                />

              </div>

              <small>
                This will be your public store address.
              </small>
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>

              <button
                type="submit"
                className="continue-button"
              >
                Continue →
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateStore;