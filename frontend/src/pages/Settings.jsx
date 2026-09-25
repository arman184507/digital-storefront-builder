import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState(null);

  const [store, setStore] = useState({
    store_name: "",
    category: "",
    business_email: "",
    phone: "",
    store_url: "",
    description: "",
    template: "",
    theme: "",
    tagline: ""
  });

  // ===============================
  // FETCH ALL STORES
  // ===============================

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/stores",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.length === 0) {
          alert("No store found. Please create a store first.");
          return;
        }

        setStores(response.data);

        // Select the first store by default
        setStoreId(response.data[0].id);

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load stores"
        );
      }
    };

    fetchStores();
  }, []);


  // ===============================
  // FETCH SELECTED STORE
  // ===============================

  useEffect(() => {

    if (!storeId) {
      return;
    }

    const fetchStore = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await api.get(
          `/stores/${storeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStore(response.data);

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Failed to load store settings"
        );

      }

    };

    fetchStore();

  }, [storeId]);


  // ===============================
  // CHANGE SELECTED STORE
  // ===============================

  const handleStoreChange = (e) => {

    setStoreId(Number(e.target.value));

  };


  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================

  const handleChange = (e) => {

    setStore({
      ...store,
      [e.target.name]: e.target.value
    });

  };


  // ===============================
  // SAVE SETTINGS
  // ===============================

  const handleSave = async (e) => {

    e.preventDefault();

    if (!storeId) {

      alert("No store selected");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/stores/${storeId}`,
        {
          store_name: store.store_name,
          category: store.category,
          business_email: store.business_email,
          phone: store.phone,
          store_url: store.store_url,
          description: store.description,
          template: store.template,
          theme: store.theme,
          tagline: store.tagline
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to update store"
      );

    }

  };


  return (

    <div className="settings-page">

      {/* ===============================
          DASHBOARD LINK
      =============================== */}

      <button
        className="dashboard-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>


      {/* ===============================
          SETTINGS HEADER
      =============================== */}

      <div className="settings-header">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Manage your store information and settings.
          </p>

        </div>

      </div>


      {/* ===============================
          STORE SELECTOR
      =============================== */}

      <div className="store-selector">

        <label>
          Select Store
        </label>

        <select
          value={storeId || ""}
          onChange={handleStoreChange}
        >

          {stores.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >
              {item.store_name}
            </option>

          ))}

        </select>

      </div>


      {/* ===============================
          STORE INFORMATION
      =============================== */}

      <div className="settings-card">

        <h2>
          Store Information
        </h2>

        <p className="settings-description">
          Update the basic information of your online store.
        </p>


        <form onSubmit={handleSave}>

          {/* STORE NAME */}

          <div className="form-group">

            <label>
              Store Name
            </label>

            <input
              type="text"
              name="store_name"
              value={store.store_name}
              onChange={handleChange}
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              value={store.category}
              onChange={handleChange}
              required
            />

          </div>


          {/* BUSINESS EMAIL */}

          <div className="form-group">

            <label>
              Business Email
            </label>

            <input
              type="email"
              name="business_email"
              value={store.business_email || ""}
              onChange={handleChange}
            />

          </div>


          {/* PHONE */}

          <div className="form-group">

            <label>
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={store.phone || ""}
              onChange={handleChange}
            />

          </div>


          {/* STORE URL */}

          <div className="form-group">

            <label>
              Store URL
            </label>

            <input
              type="text"
              name="store_url"
              value={store.store_url || ""}
              onChange={handleChange}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={store.description || ""}
              onChange={handleChange}
              rows="5"
            />

          </div>


          {/* SAVE */}

          <button
            type="submit"
            className="save-settings-button"
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>

  );
}

export default Settings;