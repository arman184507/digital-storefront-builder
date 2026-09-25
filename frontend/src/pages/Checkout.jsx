import { useState } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../components/CustomerNavbar";

import "./Checkout.css";

function Checkout() {
  const { cart, storeUrl } = useCart();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [showPayment, setShowPayment] =
    useState(false);

  const [paymentId, setPaymentId] =
    useState("");

  const [paymentProcessing, setPaymentProcessing] =
    useState(false);

  // ===============================
  // CALCULATE TOTAL
  // ===============================

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  // ===============================
  // CUSTOMER INPUT
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer({
      ...customer,
      [name]: value
    });
  };

  // ===============================
  // GET STORE ID
  // ===============================

  const getStoreId = () => {
    const storeId = cart[0]?.store_id;

    if (!storeId) {
      alert(
        "Store information is missing from your cart. Please go back to the store and add the products again."
      );

      navigate("/cart");

      return null;
    }

    return storeId;
  };

  // ===============================
  // CHECK SAME STORE
  // ===============================

  const checkSameStore = (storeId) => {
    const differentStoreProduct = cart.find(
      (item) =>
        Number(item.store_id) !== Number(storeId)
    );

    if (differentStoreProduct) {
      alert(
        "You cannot checkout products from different stores at the same time."
      );

      navigate("/cart");

      return false;
    }

    return true;
  };

  // ===============================
  // CREATE ORDER
  // ===============================

  const createOrder = async (
    paymentStatus,
    paymentIdValue = null
  ) => {
    const storeId = getStoreId();

    if (!storeId) {
      return;
    }

    if (!checkSameStore(storeId)) {
      return;
    }

    try {
      const orderData = {
        store_id: storeId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        delivery_address: customer.address,
        payment_method: paymentMethod,
        total_amount: total,
        payment_status: paymentStatus,
        payment_id: paymentIdValue,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price)
        }))
      };

      console.log(
        "Order data:",
        orderData
      );

      const response = await api.post(
        "/orders",
        orderData
      );

      // ===============================
      // GO TO ORDER SUCCESS PAGE
      // ===============================

      navigate("/order-success", {
        state: {
          orderId: response.data.orderId,
          totalAmount: response.data.totalAmount,
          paymentStatus: response.data.paymentStatus,
          storeUrl: storeUrl
        }
      });
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to place order"
      );
    }
  };

  // ===============================
  // HANDLE CHECKOUT
  // ===============================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Check cart

    if (cart.length === 0) {
      alert(
        "Your cart is empty"
      );

      navigate("/cart");

      return;
    }

    // Check store

    const storeId = getStoreId();

    if (!storeId) {
      return;
    }

    // Check same store

    if (!checkSameStore(storeId)) {
      return;
    }

    // ===============================
    // COD
    // ===============================

    if (paymentMethod === "cod") {
      await createOrder(
        "Pending",
        null
      );

      return;
    }

    // ===============================
    // ONLINE PAYMENT
    // ===============================

    try {
      setPaymentProcessing(true);

      const response = await api.post(
        "/payment/mock/create",
        {
          amount: total,
          payment_method: paymentMethod
        }
      );

      setPaymentId(
        response.data.paymentId
      );

      setShowPayment(true);
    } catch (error) {
      console.error(
        "Payment creation error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to start payment"
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ===============================
  // SIMULATE PAYMENT
  // ===============================

  const handlePayment = async (status) => {
    if (!paymentId) {
      alert(
        "Payment information is missing."
      );

      return;
    }

    try {
      setPaymentProcessing(true);

      const response = await api.post(
        "/payment/mock/verify",
        {
          paymentId: paymentId,
          paymentStatus: status
        }
      );

      if (status === "success") {
        alert(
          "Payment successful!"
        );

        await createOrder(
          "Paid",
          response.data.paymentId
        );
      }
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Payment failed"
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ===============================
  // PAYMENT SCREEN
  // ===============================

  if (showPayment) {
    return (
      <>
        <CustomerNavbar />

        <div className="checkout-page">
          <div className="checkout-container">

            <div className="checkout-header">
              <p>
                SECURE PAYMENT
              </p>

              <h1>
                Complete Payment
              </h1>

              <span>
                This is a development payment screen.
              </span>
            </div>

            <div className="checkout-card">
              <h2>
                StoreBuilder Payment
              </h2>

              <div
                style={{
                  padding: "25px",
                  marginTop: "20px",
                  marginBottom: "20px",
                  borderRadius: "12px",
                  background: "#f8f9fc",
                  textAlign: "center"
                }}
              >
                <p>
                  Payment Method
                </p>

                <h3
                  style={{
                    marginTop: "8px",
                    textTransform: "uppercase"
                  }}
                >
                  {paymentMethod}
                </h3>

                <p
                  style={{
                    marginTop: "20px"
                  }}
                >
                  Amount
                </p>

                <h1
                  style={{
                    marginTop: "8px"
                  }}
                >
                  ₹{total}
                </h1>
              </div>

              <button
                type="button"
                className="place-order-button"
                disabled={paymentProcessing}
                onClick={() =>
                  handlePayment("success")
                }
              >
                {paymentProcessing
                  ? "Processing..."
                  : `Pay ₹${total}`}
              </button>

              <button
                type="button"
                className="back-to-cart-button"
                disabled={paymentProcessing}
                onClick={() =>
                  handlePayment("failed")
                }
              >
                Simulate Payment Failure
              </button>

              <button
                type="button"
                className="back-to-cart-button"
                disabled={paymentProcessing}
                onClick={() => {
                  setShowPayment(false);
                  setPaymentId("");
                }}
              >
                ← Back to Checkout
              </button>
            </div>

          </div>
        </div>
      </>
    );
  }

  // ===============================
  // NORMAL CHECKOUT
  // ===============================

  return (
    <>
      <CustomerNavbar />

      <div className="checkout-page">
        <div className="checkout-container">

          <div className="checkout-header">
            <p>
              SECURE CHECKOUT
            </p>

            <h1>
              Checkout
            </h1>

            <span>
              Complete your details to place your order.
            </span>
          </div>

          <form onSubmit={handlePlaceOrder}>

            <div className="checkout-content">

              {/* ===============================
                  CUSTOMER DETAILS
              =============================== */}

              <div className="customer-details">

                <div className="checkout-card">

                  <h2>
                    Customer Information
                  </h2>

                  <div className="checkout-form-row">

                    <div className="checkout-input">
                      <label>
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={customer.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="checkout-input">
                      <label>
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={customer.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                  </div>

                  <div className="checkout-input">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={customer.phone}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="checkout-input">

                    <label>
                      Delivery Address
                    </label>

                    <textarea
                      name="address"
                      rows="4"
                      placeholder="Enter your complete delivery address"
                      value={customer.address}
                      onChange={handleChange}
                      required
                    ></textarea>

                  </div>

                </div>

                {/* ===============================
                    PAYMENT
                =============================== */}

                <div className="checkout-card">

                  <h2>
                    Payment Method
                  </h2>

                  <div className="payment-options">

                    {/* COD */}

                    <label className="payment-option">

                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={
                          paymentMethod === "cod"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                      />

                      <div>
                        <strong>
                          Cash on Delivery
                        </strong>

                        <span>
                          Pay when your order arrives
                        </span>
                      </div>

                    </label>

                    {/* UPI */}

                    <label className="payment-option">

                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={
                          paymentMethod === "upi"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                      />

                      <div>
                        <strong>
                          UPI
                        </strong>

                        <span>
                          Pay securely using UPI
                        </span>
                      </div>

                    </label>

                    {/* CARD */}

                    <label className="payment-option">

                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={
                          paymentMethod === "card"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                      />

                      <div>
                        <strong>
                          Credit / Debit Card
                        </strong>

                        <span>
                          Pay securely using your card
                        </span>
                      </div>

                    </label>

                  </div>

                </div>

              </div>

              {/* ===============================
                  ORDER SUMMARY
              =============================== */}

              <div className="checkout-summary">

                <div className="checkout-card">

                  <h2>
                    Order Summary
                  </h2>

                  <div className="checkout-items">

                    {cart.map((item) => (
                      <div
                        className="checkout-item"
                        key={item.id}
                      >

                        <div className="checkout-item-image">
                          📦
                        </div>

                        <div className="checkout-item-info">

                          <h3>
                            {item.name}
                          </h3>

                          <span>
                            Qty: {item.quantity}
                          </span>

                        </div>

                        <strong>
                          ₹
                          {Number(item.price) *
                            item.quantity}
                        </strong>

                      </div>
                    ))}

                  </div>

                  <div className="checkout-divider"></div>

                  <div className="checkout-total-row">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹{total}
                    </strong>

                  </div>

                  <div className="checkout-total-row">

                    <span>
                      Delivery
                    </span>

                    <strong>
                      Free
                    </strong>

                  </div>

                  <div className="checkout-divider"></div>

                  <div className="checkout-final-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{total}
                    </strong>

                  </div>

                  <button
                    type="submit"
                    className="place-order-button"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing
                      ? "Processing..."
                      : paymentMethod === "cod"
                      ? "Place Order"
                      : `Pay ₹${total}`}
                  </button>

                  <button
                    type="button"
                    className="back-to-cart-button"
                    onClick={() =>
                      navigate("/cart")
                    }
                    disabled={paymentProcessing}
                  >
                    ← Back to Cart
                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>
      </div>
    </>
  );
}

export default Checkout;