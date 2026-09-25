import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CustomerNavbar.css";

function CustomerNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const { cart, storeUrl } = useCart();


  // ===============================
  // CART COUNT
  // ===============================

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );


  // ===============================
  // GET CURRENT STORE URL
  // ===============================

  const currentStoreUrl =
    location.pathname.startsWith("/store/")
      ? location.pathname.split("/store/")[1]
      : storeUrl;


  // ===============================
  // GO TO STORE HOME
  // ===============================

  const goHome = () => {

    // If already on the storefront,
    // scroll directly to the Home section
    if (
      location.pathname.startsWith("/store/")
    ) {

      document
        .getElementById("home")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      return;

    }


    // If on Cart, Checkout or Order Success,
    // navigate back to the same store
    if (currentStoreUrl) {

      navigate(
        `/store/${currentStoreUrl}`
      );

      return;

    }


    // Fallback
    navigate("/");

  };


  // ===============================
  // GO TO PRODUCTS
  // ===============================

  const goToProducts = () => {

    // If customer is already on store page
    if (
      location.pathname.startsWith("/store/")
    ) {

      document
        .getElementById("products")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      return;

    }


    // If customer is on another page,
    // first go back to their store
    if (currentStoreUrl) {

      navigate(
        `/store/${currentStoreUrl}`
      );

      return;

    }

  };


  // ===============================
  // GO TO ABOUT
  // ===============================

  const goToAbout = () => {

    // If customer is already on store page
    if (
      location.pathname.startsWith("/store/")
    ) {

      document
        .getElementById("about")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      return;

    }


    // If customer is on another page,
    // first go back to their store
    if (currentStoreUrl) {

      navigate(
        `/store/${currentStoreUrl}`
      );

      return;

    }

  };


  // ===============================
  // GO TO DASHBOARD
  // ===============================

  const goToDashboard = (event) => {

    // Prevent the logo's onClick from running
    event.stopPropagation();

    navigate("/dashboard");

  };


  return (

    <nav className="customer-navbar">

      {/* ===============================
          LOGO + DASHBOARD
      =============================== */}

      <div
        className="customer-navbar-logo"
        onClick={goHome}
      >

        🏪

        <span>
          Store Builder
        </span>

        {/* DASHBOARD */}

        <button
          className="navbar-dashboard-link"
          onClick={goToDashboard}
        >
          Dashboard
        </button>

      </div>


      {/* ===============================
          NAVIGATION LINKS
      =============================== */}

      <div className="customer-navbar-links">

        {/* HOME */}

        <button
          className="customer-nav-link"
          onClick={goHome}
        >
          Home
        </button>


        {/* PRODUCTS */}

        <button
          className="customer-nav-link"
          onClick={goToProducts}
        >
          Products
        </button>


        {/* ABOUT */}

        <button
          className="customer-nav-link"
          onClick={goToAbout}
        >
          About
        </button>


        {/* CART */}

        <button
          className="customer-nav-link cart-nav-button"
          onClick={() =>
            navigate("/cart")
          }
        >

          🛒 Cart

          {cartCount > 0 && (

            <span className="cart-badge">
              {cartCount}
            </span>

          )}

        </button>

      </div>

    </nav>

  );

}

export default CustomerNavbar;