import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../components/CustomerNavbar";

import "./Cart.css";

function Cart() {

  const {
    cart,
    storeUrl,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();


  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );


  // ===============================
  // CONTINUE SHOPPING
  // ===============================

  const continueShopping = () => {

    if (storeUrl) {

      navigate(
        `/store/${storeUrl}`
      );

    } else {

      navigate("/");

    }

  };


  return (

    <>

      {/* ===============================
          CUSTOMER NAVBAR
      =============================== */}

      <CustomerNavbar />


      {/* ===============================
          CART PAGE
      =============================== */}

      <div className="cart-page">

        <div className="cart-container">


          {/* ===============================
              CART HEADER
          =============================== */}

          <div className="cart-header">

            <p>
              YOUR SHOPPING CART
            </p>

            <h1>
              Shopping Cart
            </h1>

          </div>


          {/* ===============================
              EMPTY CART
          =============================== */}

          {cart.length === 0 ? (

            <div className="empty-cart">

              <h2>
                Your cart is empty
              </h2>

              <p>
                Add some products to your cart
                to continue shopping.
              </p>

              <button
                onClick={continueShopping}
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <div className="cart-content">


              {/* ===============================
                  CART ITEMS
              =============================== */}

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item.id}
                  >


                    <div className="cart-product-image">

                      {item.image_url ? (

                        <img
                          src={item.image_url}
                          alt={item.name}
                          onError={(e) => {

                            e.currentTarget.style.display =
                              "none";

                            e.currentTarget.nextElementSibling.style.display =
                              "block";

                          }}
                        />

                      ) : null}


                      <span
                        style={{
                          display: item.image_url
                            ? "none"
                            : "block"
                        }}
                      >
                        📦
                      </span>

                    </div>


                    <div className="cart-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.category}
                      </p>

                      <strong>
                        ₹{item.price}
                      </strong>

                    </div>


                    {/* ===============================
                        QUANTITY CONTROLS
                    =============================== */}

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        +
                      </button>

                    </div>


                    {/* ===============================
                        ITEM TOTAL
                    =============================== */}

                    <div className="cart-item-total">

                      ₹
                      {Number(item.price) *
                        item.quantity}

                    </div>


                    {/* ===============================
                        REMOVE
                    =============================== */}

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>


              {/* ===============================
                  ORDER SUMMARY
              =============================== */}

              <div className="cart-summary">

                <h2>
                  Order Summary
                </h2>


                <div className="summary-row">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹{total}
                  </strong>

                </div>


                <div className="summary-row">

                  <span>
                    Delivery
                  </span>

                  <strong>
                    Free
                  </strong>

                </div>


                <div className="summary-divider"></div>


                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{total}
                  </strong>

                </div>


                {/* CHECKOUT */}

                <button
                  className="checkout-button"
                  onClick={() =>
                    navigate("/checkout")
                  }
                >
                  Proceed to Checkout
                </button>


                {/* CONTINUE SHOPPING */}

                <button
                  className="continue-button"
                  onClick={continueShopping}
                >
                  Continue Shopping
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </>

  );

}

export default Cart;