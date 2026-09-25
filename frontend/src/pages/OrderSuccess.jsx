import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import CustomerNavbar from "../components/CustomerNavbar";

import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();

  // Get order information sent from Checkout
  const order = location.state;

  // ===============================
  // CLEAR CART
  // ===============================

  useEffect(() => {
    if (order?.orderId) {
      clearCart();
    }
  }, [order?.orderId]);

  // ===============================
  // HANDLE INVALID ACCESS
  // ===============================

  if (!order?.orderId) {
    return (
      <>
        <CustomerNavbar />

        <div className="order-success-page">
          <div className="order-success-container">

            <div className="order-success-card">

              <h1>
                No Order Found
              </h1>

              <p>
                We could not find any recent order information.
              </p>

              <button
                onClick={() => navigate("/")}
              >
                Go to Store
              </button>

            </div>

          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ===============================
          CUSTOMER NAVBAR
      =============================== */}

      <CustomerNavbar />

      {/* ===============================
          SUCCESS CONTENT
      =============================== */}

      <div className="order-success-page">

        <div className="order-success-container">

          <div className="order-success-card">

            <div className="success-icon">
              ✓
            </div>

            <p className="success-label">
              ORDER CONFIRMED
            </p>

            <h1>
              Thank You!
            </h1>

            <p className="success-message">
              Your order has been placed successfully.
            </p>

            {/* ===============================
                ORDER DETAILS
            =============================== */}

            <div className="order-details">

              <div className="order-detail-row">

                <span>
                  Order ID
                </span>

                <strong>
                  #{order.orderId}
                </strong>

              </div>

              <div className="order-detail-row">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{order.totalAmount}
                </strong>

              </div>

              <div className="order-detail-row">

                <span>
                  Payment Status
                </span>

                <strong className="payment-status">
                  {order.paymentStatus}
                </strong>

              </div>

            </div>

            {/* ===============================
                ACTION BUTTONS
            =============================== */}

            <div className="success-actions">

              <button
                className="continue-shopping-button"
                onClick={() => {
                  if (order.storeUrl) {
                    navigate(
                      `/store/${order.storeUrl}`
                    );
                  } else {
                    navigate("/storefront");
                  }
                }}
              >
                Continue Shopping
              </button>

              <button
                className="view-cart-button"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default OrderSuccess;