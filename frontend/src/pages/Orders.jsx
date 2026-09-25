import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setOrders(response.data);

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load orders"
        );
      }
    };

    fetchOrders();
  }, []);

  const handleViewItems = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setOrderItems([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/orders/${orderId}/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrderItems(response.data);
      setExpandedOrder(orderId);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to load order items"
      );
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update order status"
      );
    }
  };

  return (
    <div className="orders-page">

      {/* ===============================
          DASHBOARD LINK
      =============================== */}

      <button
        className="dashboard-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>


      <div className="orders-header">

        <div>

          <h1>Orders</h1>

          <p>
            Manage your customer orders
          </p>

        </div>

      </div>


      {orders.length === 0 ? (

        <div className="no-orders">

          <h2>
            No Orders Yet
          </h2>

          <p>
            Customer orders will appear here once they
            place an order.
          </p>

        </div>

      ) : (

        <div className="orders-table-container">

          <table>

            <thead>

              <tr>

                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>

              </tr>

            </thead>


            <tbody>

              {orders.map((order) => (

                <>

                  <tr key={order.id}>

                    <td>
                      #{order.id}
                    </td>

                    <td>
                      {order.customer_name}
                    </td>

                    <td>
                      {order.customer_email}
                    </td>

                    <td>
                      {order.payment_method}
                    </td>

                    <td>
                      ₹{order.total_amount}
                    </td>

                    <td>

                      <select
                        className={`status-select ${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>

                    <td>

                      <button
                        className="view-items-btn"
                        onClick={() =>
                          handleViewItems(order.id)
                        }
                      >
                        {expandedOrder === order.id
                          ? "Hide"
                          : "View"}
                      </button>

                    </td>

                  </tr>


                  {expandedOrder === order.id && (

                    <tr>

                      <td colSpan="7">

                        <div className="order-items">

                          <h3>
                            Order Items
                          </h3>


                          <table>

                            <thead>

                              <tr>

                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>

                              </tr>

                            </thead>


                            <tbody>

                              {orderItems.map((item) => (

                                <tr key={item.id}>

                                  <td>
                                    {item.name}
                                  </td>

                                  <td>
                                    {item.quantity}
                                  </td>

                                  <td>
                                    ₹{item.price}
                                  </td>

                                  <td>
                                    ₹
                                    {(
                                      Number(item.price) *
                                      item.quantity
                                    ).toFixed(2)}
                                  </td>

                                </tr>

                              ))}

                            </tbody>

                          </table>

                        </div>

                      </td>

                    </tr>

                  )}

                </>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Orders;