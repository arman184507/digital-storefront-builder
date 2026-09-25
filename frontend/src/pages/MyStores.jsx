import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./MyStores.css";

function MyStores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH STORES
  // ===============================

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await api.get(
          "/stores",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStores(response.data);
      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load stores"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // ===============================
  // GO TO DASHBOARD
  // ===============================

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  // ===============================
  // EDIT STORE
  // ===============================

  const handleEditStore = (storeId) => {
    navigate(
      "/store-editor",
      {
        state: {
          storeId: storeId
        }
      }
    );
  };

  // ===============================
  // MANAGE PRODUCTS
  // ===============================

  const handleManageProducts = (storeId) => {
    navigate(
      "/products",
      {
        state: {
          storeId: storeId
        }
      }
    );
  };

  // ===============================
  // VIEW STORE
  // ===============================

  const handleViewStore = (store) => {
    if (!store.store_url) {
      alert(
        "Store URL is not available."
      );

      return;
    }

    if (!store.is_published) {
      alert(
        "Please publish your store before viewing it."
      );

      return;
    }

    navigate(
      `/store/${store.store_url}`
    );
  };

  // ===============================
  // DELETE STORE
  // ===============================

  const handleDeleteStore = async (store) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${store.store_name}"?\n\nThis will also delete its products, orders, and order items. This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/stores/${store.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Remove the deleted store immediately
      // from the page
      setStores((previousStores) =>
        previousStores.filter(
          (item) => item.id !== store.id
        )
      );

      alert(
        "Store deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete store error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete store"
      );
    }
  };

  // ===============================
  // CREATE STORE
  // ===============================

  const handleCreateStore = () => {
    navigate("/create-store");
  };

  return (
    <div className="my-stores-page">

      <div className="my-stores-container">

        {/* ===============================
            DASHBOARD NAVIGATION
        =============================== */}

        <button
          className="dashboard-back-button"
          onClick={handleDashboard}
        >
          ← Dashboard
        </button>

        {/* ===============================
            PAGE HEADER
        =============================== */}

        <div className="my-stores-header">

          <div>

            <p className="page-label">
              STORE MANAGEMENT
            </p>

            <h1>
              My Stores
            </h1>

            <p>
              Manage and customize your online stores.
            </p>

          </div>

          <button
            className="create-store-button"
            onClick={handleCreateStore}
          >
            + Create New Store
          </button>

        </div>

        {/* ===============================
            STORE LIST
        =============================== */}

        {loading ? (

          <div className="empty-message">
            Loading your stores...
          </div>

        ) : stores.length === 0 ? (

          <div className="empty-message">

            <h2>
              No stores yet
            </h2>

            <p>
              Create your first online store
              to get started.
            </p>

            <button
              className="create-store-button"
              onClick={handleCreateStore}
            >
              + Create Store
            </button>

          </div>

        ) : (

          <div className="stores-grid">

            {stores.map((store) => (

              <div
                className="store-card"
                key={store.id}
              >

                <div className="store-card-top">

                  <div className="store-icon">
                    🛍️
                  </div>

                  <span
                    className={
                      store.is_published
                        ? "status published"
                        : "status draft"
                    }
                  >
                    {store.is_published
                      ? "Published"
                      : "Draft"}
                  </span>

                </div>

                <div className="store-card-content">

                  <h2>
                    {store.store_name}
                  </h2>

                  <p className="store-category">
                    {store.category}
                  </p>

                  <p className="store-description">
                    {store.description ||
                      "No store description added yet."}
                  </p>

                </div>

                <div className="store-card-footer">

                  <div className="store-details">

                    <span>
                      🎨{" "}
                      {store.template ||
                        "No template"}
                    </span>

                    <span>
                      🌈{" "}
                      {store.theme ||
                        "Default"}
                    </span>

                  </div>

                  <div className="store-card-actions">

                    <button
                      className="view-store-button"
                      onClick={() =>
                        handleViewStore(store)
                      }
                    >
                      View Store →
                    </button>

                    <button
                      className="manage-products-button"
                      onClick={() =>
                        handleManageProducts(
                          store.id
                        )
                      }
                    >
                      Products →
                    </button>

                    <button
                      className="edit-store-button"
                      onClick={() =>
                        handleEditStore(
                          store.id
                        )
                      }
                    >
                      Edit Store →
                    </button>

                    <button
                      className="delete-store-button"
                      onClick={() =>
                        handleDeleteStore(store)
                      }
                    >
                      Delete Store
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyStores;