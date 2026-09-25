import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";

import { useCart } from "../context/CartContext";

import CustomerNavbar from "../components/CustomerNavbar";

import "./Storefront.css";

function Storefront() {

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  const {
    addToCart,
    setCurrentStore
  } = useCart();

  // Get store URL from browser URL
  const { storeUrl } = useParams();


  // ===============================
  // FETCH STOREFRONT
  // ===============================

  useEffect(() => {

    const fetchStorefront = async () => {

      try {

        // Remember the current store
        setCurrentStore(storeUrl);


        // Get public store and its products
        const response = await api.get(
          `/public/stores/${storeUrl}`
        );


        // Store information
        setStore(response.data.store);


        // Products belonging to this store
        setProducts(response.data.products);

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Failed to load storefront"
        );

      }

    };


    fetchStorefront();

  }, [storeUrl]);


  // ===============================
  // LOADING
  // ===============================

  if (!store) {

    return (
      <p>Loading store...</p>
    );

  }


  return (

    <div className="storefront-page">

      {/* ===============================
          CUSTOMER NAVBAR
      =============================== */}

      <CustomerNavbar />


      {/* ===============================
          HERO SECTION
      =============================== */}

      <section
        className="storefront-hero"
        id="home"
      >

        <div className="hero-content">

          <p className="hero-label">
            WELCOME TO OUR STORE
          </p>


          <h1>
            {store.tagline ||
              "Beautiful Products, Made For You."}
          </h1>


          <p>
            {store.description ||
              "Discover our collection of carefully selected products made with quality and care."}
          </p>


          <button
            className="shop-button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            Shop Now
          </button>

        </div>

      </section>


      {/* ===============================
          PRODUCTS SECTION
      =============================== */}

      <section
        className="products-section"
        id="products"
      >

        <div className="section-heading">

          <p>
            OUR COLLECTION
          </p>


          <h2>
            Featured Products
          </h2>


          <span>
            Explore our most popular products.
          </span>

        </div>


        <div className="storefront-products">

          {products.length === 0 ? (

            <p>
              No products available yet.
            </p>

          ) : (

            products.map((product) => (

              <div
                className="storefront-product-card"
                key={product.id}
              >

                <div className="product-image">

                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display = "block";
                      }}
                    />
                  ) : null}

                  <span
                    style={{
                      display: product.image_url ? "none" : "block"
                    }}
                  >
                    📦
                  </span>

                </div>


                <div className="product-details">

                  <span>
                    {product.category}
                  </span>


                  <h3>
                    {product.name}
                  </h3>


                  <p>
                    {product.description ||
                      "Quality product from our store."}
                  </p>


                  <div className="product-bottom">

                    <strong>
                      ₹{product.price}
                    </strong>


                    <button
                      onClick={() =>
                        addToCart(
                          product,
                          storeUrl
                        )
                      }
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {/* ===============================
          ABOUT SECTION
      =============================== */}

      <section
        className="about-section"
        id="about"
      >

        <h2>
          About Our Store
        </h2>


        <p>
          {store.description ||
            "We believe in providing quality products that bring value and happiness to our customers."}
        </p>

      </section>

    </div>

  );

}

export default Storefront;