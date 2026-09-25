import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./StoreEditor.css";

function StoreEditor() {
  const location = useLocation();
  const navigate = useNavigate();

  const storeId = location.state?.storeId;

  const [storeName, setStoreName] = useState("Arman's Store");
  const [tagline, setTagline] = useState(
    "Beautiful products, made for you."
  );
  const [theme, setTheme] = useState("purple");
  const [storeUrl, setStoreUrl] = useState("");

  useEffect(() => {
    const loadStore = async () => {
      if (!storeId) {
        alert(
          "Store information not found. Please create your store again."
        );
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/stores/${storeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const store = response.data;

        setStoreName(store.store_name);
        setTagline(
          store.tagline || "Beautiful products, made for you."
        );
        setTheme(store.theme || "purple");
        setStoreUrl(store.store_url || "");

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load store"
        );
      }
    };

    loadStore();
  }, [storeId]);


  // ===============================
  // SAVE STORE
  // ===============================

  const handleSave = async () => {
    if (!storeId) {
      alert(
        "Store information not found. Please create your store again."
      );
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/stores/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const store = response.data;

      await api.put(
        `/stores/${storeId}`,
        {
          store_name: storeName,
          category: store.category,
          description: store.description,
          business_email: store.business_email,
          phone: store.phone,
          store_url: store.store_url,
          template: store.template,
          theme: theme,
          tagline: tagline
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Keep the URL available for Preview Store
      setStoreUrl(store.store_url || "");

      alert("Store changes saved successfully!");

      return true;

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to save store changes"
      );

      return false;
    }
  };


  // ===============================
  // PREVIEW STORE
  // ===============================

  const handlePreview = async () => {
    if (!storeId) {
      alert(
        "Store information not found. Please create your store again."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/stores/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const store = response.data;

      if (!store.store_url) {
        alert(
          "Store URL is missing. Please save your store first."
        );
        return;
      }

      navigate(`/store/${store.store_url}`);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to open store preview"
      );
    }
  };


  // ===============================
  // PUBLISH STORE
  // ===============================

  const handlePublish = async () => {
    if (!storeId) {
      alert(
        "Store information not found. Please create your store again."
      );
      return;
    }

    try {

      // Save changes first
      const saveSuccessful = await handleSave();

      // Stop if saving failed
      if (!saveSuccessful) {
        return;
      }

      const token = localStorage.getItem("token");

      await api.put(
        `/stores/${storeId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Store published successfully!");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to publish store"
      );
    }
  };


  // ===============================
  // PREVIEW NAVIGATION
  // ===============================

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth"
      });
    }
  };


  return (
    <div className={`editor-page ${theme}`}>

      {/* ===============================
          HEADER
      =============================== */}

      <header className="editor-header">

        <div className="editor-brand">
          StoreBuilder
          <span> / Store Editor</span>
        </div>

        <div className="editor-actions">

          {/* MY STORES */}

          <button
            className="my-stores-button"
            onClick={() => navigate("/my-stores")}
          >
            My Stores
          </button>

          {/* PREVIEW STORE */}

          <button
            className="preview-button"
            onClick={handlePreview}
          >
            Preview Store
          </button>

          {/* PUBLISH STORE */}

          <button
            className="publish-button"
            onClick={handlePublish}
          >
            Publish Store
          </button>

        </div>

      </header>


      <div className="editor-layout">

        {/* ===============================
            LEFT - SETTINGS
        =============================== */}

        <aside className="editor-panel">

          <div className="panel-heading">

            <p>
              STORE CUSTOMIZATION
            </p>

            <h2>
              Customize your store
            </h2>

          </div>


          {/* STORE NAME */}

          <div className="setting-group">

            <label>
              Store Name
            </label>

            <input
              type="text"
              value={storeName}
              onChange={(e) =>
                setStoreName(e.target.value)
              }
            />

          </div>


          {/* TAGLINE */}

          <div className="setting-group">

            <label>
              Store Tagline
            </label>

            <textarea
              rows="3"
              value={tagline}
              onChange={(e) =>
                setTagline(e.target.value)
              }
            />

          </div>


          {/* THEME */}

          <div className="setting-group">

            <label>
              Choose Theme
            </label>

            <div className="theme-options">

              <button
                className="theme purple-theme"
                onClick={() =>
                  setTheme("purple")
                }
              >
                Purple
              </button>

              <button
                className="theme blue-theme"
                onClick={() =>
                  setTheme("blue")
                }
              >
                Blue
              </button>

              <button
                className="theme green-theme"
                onClick={() =>
                  setTheme("green")
                }
              >
                Green
              </button>

            </div>

          </div>


          {/* SAVE */}

          <button
            className="save-button"
            onClick={handleSave}
          >
            Save Changes
          </button>

        </aside>


        {/* ===============================
            RIGHT - LIVE PREVIEW
        =============================== */}

        <main className="preview-area">

          <div className="preview-label">
            LIVE PREVIEW
          </div>


          <div className="store-preview">


            {/* ===============================
                STORE NAVIGATION
            =============================== */}

            <nav className="store-nav">

              <div
                className="store-logo"
                onClick={() =>
                  scrollToSection("preview-home")
                }
                style={{ cursor: "pointer" }}
              >
                {storeName}
              </div>


              <div className="store-links">

                <span
                  onClick={() =>
                    scrollToSection("preview-home")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Home
                </span>

                <span
                  onClick={() =>
                    scrollToSection("preview-products")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Shop
                </span>

                <span
                  onClick={() =>
                    scrollToSection("preview-about")
                  }
                  style={{ cursor: "pointer" }}
                >
                  About
                </span>

              </div>


              {/* CART */}

              <div
                className="cart-icon"
                onClick={() =>
                  navigate("/cart")
                }
                style={{ cursor: "pointer" }}
              >
                🛒
              </div>

            </nav>


            {/* ===============================
                HERO
            =============================== */}

            <section
              className="store-hero"
              id="preview-home"
            >

              <p>
                WELCOME TO OUR STORE
              </p>

              <h1>
                {storeName}
              </h1>

              <h3>
                {tagline}
              </h3>

              <button
                onClick={() =>
                  scrollToSection(
                    "preview-products"
                  )
                }
              >
                Shop Now →
              </button>

            </section>


            {/* ===============================
                PRODUCTS
            =============================== */}

            <section
              className="preview-products"
              id="preview-products"
            >

              <h2>
                Featured Products
              </h2>


              <div className="product-preview-grid">


                {/* PRODUCT 1 */}

                <div className="preview-product">

                  <div className="product-image"></div>

                  <h3>
                    Handmade Mug
                  </h3>

                  <p>
                    ₹499
                  </p>

                </div>


                {/* PRODUCT 2 */}

                <div className="preview-product">

                  <div className="product-image"></div>

                  <h3>
                    Wooden Basket
                  </h3>

                  <p>
                    ₹799
                  </p>

                </div>


                {/* PRODUCT 3 */}

                <div className="preview-product">

                  <div className="product-image"></div>

                  <h3>
                    Decorative Candle
                  </h3>

                  <p>
                    ₹349
                  </p>

                </div>

              </div>

            </section>


            {/* ===============================
                ABOUT
            =============================== */}

            <section
              id="preview-about"
              style={{
                padding: "60px 40px",
                textAlign: "center"
              }}
            >

              <h2>
                About Our Store
              </h2>

              <p
                style={{
                  maxWidth: "650px",
                  margin: "15px auto",
                  lineHeight: "1.7"
                }}
              >
                Create a beautiful online store
                and showcase your products to
                customers.
              </p>

            </section>


          </div>

        </main>

      </div>

    </div>
  );
}

export default StoreEditor;