import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Customers.css";

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/customers",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setCustomers(response.data);
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Failed to load customers"
        );
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.customer_name} ${customer.customer_email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">

      {/* ===============================
          DASHBOARD LINK
      =============================== */}

      <button
        className="dashboard-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>


      <div className="customers-header">

        <div>

          <h1>Customers</h1>

          <p>
            Manage and view your store customers
          </p>

        </div>


        <div className="customer-count">
          {customers.length} Customers
        </div>

      </div>


      <div className="customers-toolbar">

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {filteredCustomers.length === 0 ? (

        <div className="no-customers">

          <div className="customer-icon">
            👥
          </div>

          <h2>
            No Customers Found
          </h2>

          <p>
            Customers will appear here after they place
            an order.
          </p>

        </div>

      ) : (

        <div className="customers-table-container">

          <table>

            <thead>

              <tr>

                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>

              </tr>

            </thead>


            <tbody>

              {filteredCustomers.map((customer, index) => (

                <tr key={index}>

                  <td>

                    <div className="customer-name">

                      <div className="customer-avatar">

                        {customer.customer_name
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <span>
                        {customer.customer_name}
                      </span>

                    </div>

                  </td>


                  <td>
                    {customer.customer_email}
                  </td>


                  <td>
                    {customer.customer_phone}
                  </td>


                  <td>

                    <span className="orders-badge">
                      {customer.total_orders}
                    </span>

                  </td>


                  <td className="total-spent">

                    ₹
                    {Number(
                      customer.total_spent
                    ).toFixed(2)}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Customers;