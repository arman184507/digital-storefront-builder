import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    total_orders: 0,
    total_revenue: 0,
    total_products: 0,
    total_customers: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);


  // ===============================
  // LOAD DASHBOARD DATA
  // ===============================

  useEffect(() => {
    const fetchDashboard = async () => {

      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setDashboardData(
          response.data.statistics
        );

        setRecentOrders(
          response.data.recentOrders
        );

      } catch (error) {

        console.error(
          "Failed to load dashboard:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchDashboard();

  }, []);


  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true
    });
  };


  // ===============================
  // FORMAT CURRENCY
  // ===============================

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };


  // ===============================
  // FORMAT ORDER ID
  // ===============================

  const formatOrderId = (id) => {
    return `#ORD-${String(id).padStart(4, "0")}`;
  };


  // ===============================
  // GET STATUS CLASS
  // ===============================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "pending";

      case "Confirmed":
        return "confirmed";

      case "Processing":
        return "processing";

      case "Shipped":
        return "shipped";

      case "Delivered":
        return "delivered";

      case "Cancelled":
        return "cancelled";

      default:
        return "pending";

    }
  };


  return (
    <div className="dashboard">

      {/* ===============================
          SIDEBAR
      =============================== */}

      <aside className="sidebar">

        <div className="dashboard-logo">
          StoreBuilder
        </div>


        <nav>

          <a
            className="active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </a>


          <a
            onClick={() =>
              navigate("/my-stores")
            }
          >
            My Store
          </a>


          <a
            onClick={() =>
              navigate("/products")
            }
          >
            Products
          </a>


          <a
            onClick={() =>
              navigate("/orders")
            }
          >
            Orders
          </a>


          <a
            onClick={() =>
              navigate("/customers")
            }
          >
            Customers
          </a>


          <a
            onClick={() =>
              navigate("/analytics")
            }
          >
            Analytics
          </a>


          <a
            onClick={() =>
              navigate("/settings")
            }
          >
            Settings
          </a>


          {/* LOGOUT */}

          <a
            onClick={handleLogout}
            className="logout-link"
          >
            Logout
          </a>

        </nav>

      </aside>


      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Good morning, Arman 👋
            </h1>

            <p>
              Here's what's happening with your store.
            </p>

          </div>


          <button
            className="store-button"
            onClick={() =>
              navigate("/my-stores")
            }
          >
            View Store
          </button>

        </header>


        {/* ===============================
            STATISTICS
        =============================== */}

        <section className="stats">


          {/* ORDERS */}

          <div className="stat-card">

            <span>
              Total Orders
            </span>

            <h2>
              {loading
                ? "..."
                : dashboardData.total_orders}
            </h2>

            <p>
              Orders received
            </p>

          </div>


          {/* REVENUE */}

          <div className="stat-card">

            <span>
              Total Revenue
            </span>

            <h2>
              {loading
                ? "..."
                : `₹${formatCurrency(
                    dashboardData.total_revenue
                  )}`}
            </h2>

            <p>
              Total sales
            </p>

          </div>


          {/* PRODUCTS */}

          <div className="stat-card">

            <span>
              Products
            </span>

            <h2>
              {loading
                ? "..."
                : dashboardData.total_products}
            </h2>

            <p>
              Products in your stores
            </p>

          </div>


          {/* CUSTOMERS */}

          <div className="stat-card">

            <span>
              Customers
            </span>

            <h2>
              {loading
                ? "..."
                : dashboardData.total_customers}
            </h2>

            <p>
              Unique customers
            </p>

          </div>


        </section>


        {/* ===============================
            RECENT ORDERS
        =============================== */}

        <section className="orders-section">


          <div className="section-header">

            <h2>
              Recent Orders
            </h2>


            <button
              onClick={() =>
                navigate("/orders")
              }
            >
              View All
            </button>

          </div>


          <div className="orders-table">


            {/* TABLE HEADER */}

            <div className="order-row order-heading">

              <span>
                Order
              </span>

              <span>
                Customer
              </span>

              <span>
                Amount
              </span>

              <span>
                Status
              </span>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="order-row">

                <span>
                  Loading...
                </span>

              </div>

            )}


            {/* NO ORDERS */}

            {!loading &&
              recentOrders.length === 0 && (

                <div className="order-row">

                  <span>
                    No orders yet
                  </span>

                  <span>
                    -
                  </span>

                  <span>
                    ₹0
                  </span>

                  <span>
                    -
                  </span>

                </div>

            )}


            {/* REAL ORDERS */}

            {!loading &&
              recentOrders.map((order) => (

                <div
                  className="order-row"
                  key={order.id}
                >

                  <span>
                    {formatOrderId(
                      order.id
                    )}
                  </span>


                  <span>
                    {order.customer_name}
                  </span>


                  <span>
                    ₹
                    {formatCurrency(
                      order.total_amount
                    )}
                  </span>


                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {order.status}
                  </span>

                </div>

            ))}


          </div>

        </section>


      </main>

    </div>
  );
}

export default Dashboard;