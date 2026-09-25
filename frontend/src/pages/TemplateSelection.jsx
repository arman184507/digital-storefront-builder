import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./TemplateSelection.css";

function TemplateSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const storeId = location.state?.storeId;

  const templates = [
    {
      id: 1,
      name: "Minimal Store",
      category: "Clean & Simple",
      description: "A clean design perfect for modern products.",
    },
    {
      id: 2,
      name: "Craft Store",
      category: "Creative & Handmade",
      description: "A warm design for handmade and creative businesses.",
    },
    {
      id: 3,
      name: "Fresh Market",
      category: "Food & Lifestyle",
      description: "A fresh and vibrant layout for food businesses.",
    },
  ];

  const handleSelectTemplate = async (templateName) => {
    if (!storeId) {
      alert("Store information not found. Please create your store again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // First get the existing store
      const storeResponse = await api.get(
        `/stores/${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const store = storeResponse.data;

      // Update only the template while keeping existing store information
      await api.put(
        `/stores/${storeId}`,
        {
          store_name: store.store_name,
          category: store.category,
          description: store.description,
          business_email: store.business_email,
          phone: store.phone,
          store_url: store.store_url,
          template: templateName,
          theme: store.theme,
          tagline: store.tagline
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Template selected successfully!");

      navigate("/store-editor", {
        state: { storeId: storeId }
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to select template"
      );
    }
  };

  const handleSkip = () => {
    if (!storeId) {
      alert("Store information not found. Please create your store again.");
      return;
    }

    navigate("/store-editor", {
      state: { storeId: storeId }
    });
  };

  return (
    <div className="template-page">

      <div className="template-header">
        <div>
          <p className="step-text">STEP 2 OF 3</p>

          <h1>Choose a template</h1>

          <p>
            Pick a design that matches your business.
            You can customize it later.
          </p>
        </div>

        <button
          className="skip-button"
          onClick={handleSkip}
        >
          Skip for now
        </button>
      </div>

      <div className="template-grid">

        {templates.map((template) => (
          <div
            className="template-card"
            key={template.id}
          >

            <div
              className={`template-preview preview-${template.id}`}
            >
              <div className="preview-content">

                <div className="preview-logo">
                  YOUR STORE
                </div>

                <div className="preview-title">
                  Beautiful Products
                </div>

                <div className="preview-line"></div>

                <div className="preview-products">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>
            </div>

            <div className="template-info">

              <div>
                <h2>{template.name}</h2>

                <span>{template.category}</span>
              </div>

              <p>{template.description}</p>

              <button
                className="select-button"
                onClick={() =>
                  handleSelectTemplate(template.name)
                }
              >
                Use This Template →
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default TemplateSelection;