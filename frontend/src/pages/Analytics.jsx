import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Analytics.css";

function Analytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({
    total_sales: 0,
    total_orders: 0,
    total_customers: 0,
    products_sold: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setAnalytics(response.data);
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Failed to load analytics"
        );
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-page">

      {/* ===============================
          DASHBOARD LINK
      =============================== */}

      <button
        className="dashboard-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>


      <div className="analytics-header">

        <div>

          <h1>Analytics</h1>

          <p>
            Track your store performance
          </p>

        </div>

      </div>


      <div className="analytics-cards">

        <div className="analytics-card">

          <div className="analytics-icon">
            ₹
          </div>

          <div>

            <p>
              Total Sales
            </p>

            <h2>
              ₹{Number(
                analytics.total_sales
              ).toFixed(2)}
            </h2>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-icon">
            📦
          </div>

          <div>

            <p>
              Total Orders
            </p>

            <h2>
              {analytics.total_orders}
            </h2>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-icon">
            👥
          </div>

          <div>

            <p>
              Total Customers
            </p>

            <h2>
              {analytics.total_customers}
            </h2>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-icon">
            🛒
          </div>

          <div>

            <p>
              Products Sold
            </p>

            <h2>
              {analytics.products_sold}
            </h2>

          </div>

        </div>

      </div>


      <div className="analytics-info">

        <div className="analytics-section">

          <h2>
            Store Performance
          </h2>

          <p>
            Your analytics are calculated from the orders
            and products stored in your database.
          </p>

        </div>


        <div className="analytics-section">

          <h2>
            Sales Overview
          </h2>


          <div className="sales-row">

            <span>
              Total Revenue
            </span>

            <strong>
              ₹{Number(
                analytics.total_sales
              ).toFixed(2)}
            </strong>

          </div>


          <div className="sales-row">

            <span>
              Orders Received
            </span>

            <strong>
              {analytics.total_orders}
            </strong>

          </div>


          <div className="sales-row">

            <span>
              Customers
            </span>

            <strong>
              {analytics.total_customers}
            </strong>

          </div>


          <div className="sales-row">

            <span>
              Items Sold
            </span>

            <strong>
              {analytics.products_sold}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;