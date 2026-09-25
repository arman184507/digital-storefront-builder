const express = require("express");
const db = require("./config/db");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// MOCK PAYMENT STORAGE
// ===============================

const mockPayments = new Map();

const PORT = 5000;


// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Login required."
    });
  }

  jwt.verify(
    token,
    "storebuilder_secret_key",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token"
        });
      }

      req.user = user;

      next();
    }
  );
}


// ===============================
// AUTH TEST ROUTE
// ===============================

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user
  });
});


// ===============================
// PRODUCT APIs
// ===============================

// Get all products belonging to the logged-in user's stores
app.get("/api/products", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT products.*
    FROM products
    JOIN stores
      ON products.store_id = stores.id
    WHERE stores.user_id = ?
    ORDER BY products.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch products:", err.message);

      return res.status(500).json({
        message: "Failed to fetch products"
      });
    }

    res.json(results);
  });
});


// Get product by ID
app.get("/api/products/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.userId;

  const sql = `
    SELECT products.*
    FROM products
    JOIN stores
      ON products.store_id = stores.id
    WHERE products.id = ?
      AND stores.user_id = ?
  `;

  db.query(sql, [id, userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch product:", err.message);

      return res.status(500).json({
        message: "Failed to fetch product"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(results[0]);
  });
});


// Create a new product
app.post("/api/products", authenticateToken, (req, res) => {
  const {
    store_id,
    name,
    category,
    price,
    stock,
    description,
    image_url
  } = req.body;

  const userId = req.user.userId;

  if (
    !store_id ||
    !name ||
    !category ||
    price === undefined ||
    stock === undefined
  ) {
    return res.status(400).json({
      message: "Store ID, name, category, price and stock are required"
    });
  }

  // Check whether this store belongs to the logged-in user
  const storeCheckSql = `
    SELECT id
    FROM stores
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(
    storeCheckSql,
    [store_id, userId],
    (err, storeResults) => {

      if (err) {
        console.error(
          "Failed to verify store:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to verify store"
        });
      }

      if (storeResults.length === 0) {
        return res.status(403).json({
          message: "You are not authorized to add products to this store"
        });
      }

      const sql = `
        INSERT INTO products
        (
          store_id,
          name,
          category,
          price,
          stock,
          description,
          image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        store_id,
        name,
        category,
        price,
        stock,
        description,
        image_url
      ];

      db.query(sql, values, (err, result) => {

        if (err) {
          console.error(
            "Failed to add product:",
            err.message
          );

          return res.status(500).json({
            message: "Failed to add product"
          });
        }

        res.status(201).json({
          message: "Product added successfully",
          productId: result.insertId
        });
      });
    }
  );
});


// Update a product
app.put("/api/products/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.userId;

  const {
    store_id,
    name,
    category,
    price,
    stock,
    description,
    image_url
  } = req.body;

  if (
    !store_id ||
    !name ||
    !category ||
    price === undefined ||
    stock === undefined
  ) {
    return res.status(400).json({
      message: "Store ID, name, category, price and stock are required"
    });
  }

  // Verify that the store belongs to the logged-in user
  const storeCheckSql = `
    SELECT id
    FROM stores
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(
    storeCheckSql,
    [store_id, userId],
    (err, storeResults) => {

      if (err) {
        console.error(
          "Failed to verify store:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to verify store"
        });
      }

      if (storeResults.length === 0) {
        return res.status(403).json({
          message: "You are not authorized to use this store"
        });
      }

      const sql = `
        UPDATE products
        SET
          store_id = ?,
          name = ?,
          category = ?,
          price = ?,
          stock = ?,
          description = ?,
          image_url = ?
        WHERE id = ?
        AND store_id IN (
          SELECT id
          FROM stores
          WHERE user_id = ?
        )
      `;

      const values = [
        store_id,
        name,
        category,
        price,
        stock,
        description,
        image_url,
        id,
        userId
      ];

      db.query(sql, values, (err, result) => {

        if (err) {
          console.error(
            "Failed to update product:",
            err.message
          );

          return res.status(500).json({
            message: "Failed to update product"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Product not found"
          });
        }

        res.json({
          message: "Product updated successfully"
        });
      });
    }
  );
});


// Delete a product
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.userId;

  const sql = `
    DELETE products
    FROM products
    JOIN stores
      ON products.store_id = stores.id
    WHERE products.id = ?
      AND stores.user_id = ?
  `;

  db.query(sql, [id, userId], (err, result) => {

    if (err) {
      console.error(
        "Failed to delete product:",
        err.message
      );

      return res.status(500).json({
        message: "Failed to delete product"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  });
});


// ===============================
// STORE APIs
// ===============================

// Get stores belonging to the logged-in user
app.get("/api/stores", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT *
    FROM stores
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch stores:", err.message);

      return res.status(500).json({
        message: "Failed to fetch stores"
      });
    }

    res.json(results);
  });
});


// Get store by ID
app.get("/api/stores/:id", authenticateToken, (req, res) => {
  const storeId = Number(req.params.id);
  const userId = req.user.userId;

  const sql = `
    SELECT *
    FROM stores
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(sql, [storeId, userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch store:", err.message);

      return res.status(500).json({
        message: "Failed to fetch store"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    res.json(results[0]);
  });
});


// Create a new store
app.post("/api/stores", authenticateToken, (req, res) => {
  const {
    store_name,
    category,
    description,
    business_email,
    phone,
    store_url,
    template,
    theme,
    tagline
  } = req.body;

  const user_id = req.user.userId;

  if (!store_name || !category) {
    return res.status(400).json({
      message: "Store name and category are required"
    });
  }

  const sql = `
    INSERT INTO stores
    (
      user_id,
      store_name,
      category,
      description,
      business_email,
      phone,
      store_url,
      template,
      theme,
      tagline
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id,
    store_name,
    category,
    description,
    business_email,
    phone,
    store_url,
    template,
    theme,
    tagline
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Failed to create store:", err.message);

      // Handle duplicate store URL
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "This store URL is already taken. Please choose another one."
        });
      }

      return res.status(500).json({
        message: "Failed to create store"
      });
    }

    res.status(201).json({
      message: "Store created successfully",
      storeId: result.insertId
    });
  });
});


// Update a store
app.put("/api/stores/:id", authenticateToken, (req, res) => {
  const storeId = Number(req.params.id);
  const userId = req.user.userId;

  const {
    store_name,
    category,
    description,
    business_email,
    phone,
    store_url,
    template,
    theme,
    tagline
  } = req.body;

  if (!store_name || !category) {
    return res.status(400).json({
      message: "Store name and category are required"
    });
  }

  const sql = `
    UPDATE stores
    SET
      store_name = ?,
      category = ?,
      description = ?,
      business_email = ?,
      phone = ?,
      store_url = ?,
      template = ?,
      theme = ?,
      tagline = ?
    WHERE id = ?
      AND user_id = ?
  `;

  const values = [
    store_name,
    category,
    description,
    business_email,
    phone,
    store_url,
    template,
    theme,
    tagline,
    storeId,
    userId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Failed to update store:", err.message);

      return res.status(500).json({
        message: "Failed to update store"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    res.json({
      message: "Store updated successfully"
    });
  });
});


// Delete a store
app.delete("/api/stores/:id", authenticateToken, (req, res) => {
  const storeId = Number(req.params.id);
  const userId = req.user.userId;

  if (!storeId || storeId <= 0) {
    return res.status(400).json({
      message: "Invalid store ID"
    });
  }

  // ===============================
  // VERIFY STORE OWNERSHIP
  // ===============================

  const storeCheckSql = `
    SELECT id, store_name
    FROM stores
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(
    storeCheckSql,
    [storeId, userId],
    (err, storeResults) => {

      if (err) {
        console.error(
          "Failed to verify store:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to verify store"
        });
      }

      if (storeResults.length === 0) {
        return res.status(404).json({
          message: "Store not found"
        });
      }

      const storeName = storeResults[0].store_name;

      // ===============================
      // START TRANSACTION
      // ===============================

      db.beginTransaction((err) => {

        if (err) {
          console.error(
            "Failed to start delete transaction:",
            err.message
          );

          return res.status(500).json({
            message: "Failed to delete store"
          });
        }

        // ===============================
        // DELETE ORDER ITEMS
        // ===============================

        const deleteOrderItemsSql = `
          DELETE order_items
          FROM order_items
          INNER JOIN orders
            ON order_items.order_id = orders.id
          WHERE orders.store_id = ?
        `;

        db.query(
          deleteOrderItemsSql,
          [storeId],
          (err) => {

            if (err) {
              console.error(
                "Failed to delete order items:",
                err.message
              );

              return db.rollback(() => {
                res.status(500).json({
                  message:
                    "Failed to delete store order items"
                });
              });
            }

            // ===============================
            // DELETE ORDERS
            // ===============================

            const deleteOrdersSql = `
              DELETE FROM orders
              WHERE store_id = ?
            `;

            db.query(
              deleteOrdersSql,
              [storeId],
              (err) => {

                if (err) {
                  console.error(
                    "Failed to delete orders:",
                    err.message
                  );

                  return db.rollback(() => {
                    res.status(500).json({
                      message:
                        "Failed to delete store orders"
                    });
                  });
                }

                // ===============================
                // DELETE PRODUCTS
                // ===============================

                const deleteProductsSql = `
                  DELETE FROM products
                  WHERE store_id = ?
                `;

                db.query(
                  deleteProductsSql,
                  [storeId],
                  (err) => {

                    if (err) {
                      console.error(
                        "Failed to delete products:",
                        err.message
                      );

                      return db.rollback(() => {
                        res.status(500).json({
                          message:
                            "Failed to delete store products"
                        });
                      });
                    }

                    // ===============================
                    // DELETE STORE
                    // ===============================

                    const deleteStoreSql = `
                      DELETE FROM stores
                      WHERE id = ?
                        AND user_id = ?
                    `;

                    db.query(
                      deleteStoreSql,
                      [storeId, userId],
                      (err, result) => {

                        if (err) {
                          console.error(
                            "Failed to delete store:",
                            err.message
                          );

                          return db.rollback(() => {
                            res.status(500).json({
                              message:
                                "Failed to delete store"
                            });
                          });
                        }

                        if (
                          result.affectedRows === 0
                        ) {
                          return db.rollback(() => {
                            res.status(404).json({
                              message:
                                "Store not found"
                            });
                          });
                        }

                        // ===============================
                        // COMMIT TRANSACTION
                        // ===============================

                        db.commit((err) => {

                          if (err) {
                            console.error(
                              "Failed to commit store deletion:",
                              err.message
                            );

                            return db.rollback(() => {
                              res.status(500).json({
                                message:
                                  "Failed to complete store deletion"
                              });
                            });
                          }

                          res.json({
                            message:
                              "Store deleted successfully",
                            storeName:
                              storeName
                          });

                        });

                      }
                    );

                  }
                );

              }
            );

          }
        );

      });

    }
  );
});


// Publish a store
app.put("/api/stores/:id/publish", authenticateToken, (req, res) => {
  const storeId = Number(req.params.id);
  const userId = req.user.userId;

  const sql = `
    UPDATE stores
    SET is_published = TRUE
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(sql, [storeId, userId], (err, result) => {
    if (err) {
      console.error("Failed to publish store:", err.message);

      return res.status(500).json({
        message: "Failed to publish store"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    res.json({
      message: "Store published successfully"
    });
  });
});


// ===============================
// PUBLIC STOREFRONT API
// ===============================

// Get a published store using its public store URL
app.get("/api/public/stores/:storeUrl", (req, res) => {
  const storeUrl = req.params.storeUrl;

  const storeSql = `
    SELECT
      id,
      store_name,
      category,
      description,
      business_email,
      phone,
      store_url,
      template,
      theme,
      tagline,
      is_published
    FROM stores
    WHERE store_url = ?
      AND is_published = TRUE
  `;

  db.query(storeSql, [storeUrl], (err, storeResults) => {

    if (err) {
      console.error(
        "Failed to fetch public store:",
        err.message
      );

      return res.status(500).json({
        message: "Failed to load store"
      });
    }

    if (storeResults.length === 0) {
      return res.status(404).json({
        message: "Store not found or not published"
      });
    }

    const store = storeResults[0];

    const productSql = `
      SELECT
        id,
        store_id,
        name,
        category,
        price,
        stock,
        description,
        image_url
      FROM products
      WHERE store_id = ?
      ORDER BY id DESC
    `;

    db.query(productSql, [store.id], (err, products) => {

      if (err) {
        console.error(
          "Failed to fetch public store products:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to load store products"
        });
      }

      res.json({
        store: store,
        products: products
      });

    });

  });
});


// ===============================
// AUTH APIs
// ===============================

// Register user
app.post("/api/auth/register", async (req, res) => {
  const {
    full_name,
    email,
    password,
    business_name
  } = req.body;

  if (!full_name || !email || !password || !business_name) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (full_name, email, password, business_name)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      full_name,
      email,
      hashedPassword,
      business_name
    ];

    db.query(sql, values, (err, result) => {
      if (err) {

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "Email already registered"
          });
        }

        console.error("Registration failed:", err.message);

        return res.status(500).json({
          message: "Registration failed"
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId
      });
    });

  } catch (error) {

    console.error("Password hashing failed:", error.message);

    res.status(500).json({
      message: "Registration failed"
    });
  }
});


// Login user
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Login failed:", err.message);

      return res.status(500).json({
        message: "Login failed"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      "storebuilder_secret_key",
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        business_name: user.business_name
      }
    });
  });
});


// ===============================
// MOCK PAYMENT API
// ===============================

// Create a mock payment
app.post("/api/payment/mock/create", (req, res) => {

  const {
    amount,
    payment_method
  } = req.body;


  // ===============================
  // VALIDATE AMOUNT
  // ===============================

  if (!amount || Number(amount) <= 0) {

    return res.status(400).json({
      message: "Invalid payment amount"
    });

  }


  // ===============================
  // VALIDATE PAYMENT METHOD
  // ===============================

  if (
    !payment_method ||
    !["upi", "card"].includes(payment_method)
  ) {

    return res.status(400).json({
      message: "Invalid payment method"
    });

  }


  // ===============================
  // CREATE PAYMENT ID
  // ===============================

  const paymentId =
    "MOCK_PAY_" + Date.now();


  // Store payment information
  mockPayments.set(paymentId, {

    amount: Number(amount),

    paymentMethod: payment_method,

    status: "created"

  });


  res.json({

    message: "Mock payment created",

    paymentId: paymentId,

    amount: Number(amount),

    paymentMethod: payment_method

  });

});


// ===============================
// VERIFY MOCK PAYMENT
// ===============================

app.post("/api/payment/mock/verify", (req, res) => {

  const {
    paymentId,
    paymentStatus
  } = req.body;


  // ===============================
  // CHECK PAYMENT ID
  // ===============================

  if (!paymentId) {

    return res.status(400).json({
      message: "Payment ID is required"
    });

  }


  // Find payment
  const payment = mockPayments.get(paymentId);


  if (!payment) {

    return res.status(404).json({
      message: "Payment not found"
    });

  }


  // ===============================
  // CHECK PAYMENT STATUS
  // ===============================

  if (
    !["success", "failed"].includes(
      paymentStatus
    )
  ) {

    return res.status(400).json({
      message: "Invalid payment status"
    });

  }


  // ===============================
  // SUCCESS
  // ===============================

  if (paymentStatus === "success") {

    payment.status = "paid";

    mockPayments.set(
      paymentId,
      payment
    );


    return res.json({

      message:
        "Payment verified successfully",

      paymentId: paymentId,

      paymentStatus: "Paid",

      amount: payment.amount

    });

  }


  // ===============================
  // FAILURE
  // ===============================

  payment.status = "failed";

  mockPayments.set(
    paymentId,
    payment
  );


  return res.status(400).json({

    message: "Payment failed",

    paymentId: paymentId,

    paymentStatus: "Failed"

  });

});


// ===============================
// CUSTOMER ORDER API
// ===============================

app.post("/api/orders", (req, res) => {

  const {
    store_id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    payment_method,
    payment_status,
    payment_id,
    items
  } = req.body;


  // ===============================
  // CHECK REQUIRED INFORMATION
  // ===============================

  if (
    !store_id ||
    !customer_name ||
    !customer_email ||
    !customer_phone ||
    !delivery_address ||
    !payment_method ||
    !items ||
    items.length === 0
  ) {

    return res.status(400).json({
      message: "All order details are required"
    });

  }


  // ===============================
  // VALIDATE PAYMENT METHOD
  // ===============================

  const allowedPaymentMethods = [
    "cod",
    "upi",
    "card"
  ];


  if (!allowedPaymentMethods.includes(payment_method)) {

    return res.status(400).json({
      message: "Invalid payment method"
    });

  }


  // ===============================
  // VERIFY STORE
  // ===============================

  const storeSql = `
    SELECT id
    FROM stores
    WHERE id = ?
  `;


  db.query(
    storeSql,
    [store_id],
    (err, storeResults) => {

      if (err) {

        console.error(
          "Failed to verify store:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to verify store"
        });

      }


      if (storeResults.length === 0) {

        return res.status(404).json({
          message: "Store not found"
        });

      }


      // Continue with product verification
      verifyProducts();

    }
  );


  // ===============================
  // VERIFY PRODUCTS
  // ===============================

  function verifyProducts() {

    const productIds = items.map(
      (item) => Number(item.product_id)
    );


    // Check duplicate products
    const uniqueProductIds = [
      ...new Set(productIds)
    ];


    if (
      uniqueProductIds.length !==
      productIds.length
    ) {

      return res.status(400).json({
        message:
          "Duplicate products are not allowed"
      });

    }


    const placeholders =
      uniqueProductIds
        .map(() => "?")
        .join(",");


    const productSql = `
      SELECT
        id,
        store_id,
        name,
        price,
        stock
      FROM products
      WHERE id IN (${placeholders})
    `;


    db.query(
      productSql,
      uniqueProductIds,
      (err, products) => {

        if (err) {

          console.error(
            "Failed to verify products:",
            err.message
          );

          return res.status(500).json({
            message:
              "Failed to verify products"
          });

        }


        // ===============================
        // CHECK ALL PRODUCTS EXIST
        // ===============================

        if (
          products.length !==
          uniqueProductIds.length
        ) {

          return res.status(400).json({
            message:
              "One or more products were not found"
          });

        }


        // ===============================
        // VALIDATE PRODUCTS
        // ===============================

        let calculatedTotal = 0;


        for (const item of items) {

          const product =
            products.find(
              (product) =>
                Number(product.id) ===
                Number(item.product_id)
            );


          if (!product) {

            return res.status(400).json({
              message:
                "Product not found"
            });

          }


          // Product must belong to store
          if (
            Number(product.store_id) !==
            Number(store_id)
          ) {

            return res.status(400).json({
              message:
                `Product "${product.name}" does not belong to this store`
            });

          }


          // Validate quantity
          const quantity =
            Number(item.quantity);


          if (
            !Number.isInteger(quantity) ||
            quantity <= 0
          ) {

            return res.status(400).json({
              message:
                `Invalid quantity for "${product.name}"`
            });

          }


          // Check stock
          if (
            quantity >
            Number(product.stock)
          ) {

            return res.status(400).json({
              message:
                `Not enough stock for "${product.name}"`
            });

          }


          // IMPORTANT:
          // Use database price,
          // NOT frontend price

          calculatedTotal +=
            Number(product.price) *
            quantity;

        }


        // ===============================
        // PAYMENT VALIDATION
        // ===============================

        let finalPaymentStatus =
          "Pending";

        let finalPaymentId = null;


        // COD
        if (payment_method === "cod") {

          finalPaymentStatus =
            "Pending";

          finalPaymentId = null;

        }


        // ONLINE PAYMENT
        else {

          if (
            payment_status !== "Paid" ||
            !payment_id
          ) {

            return res.status(400).json({
              message:
                "Valid payment is required before placing this order"
            });

          }


          // Check payment exists
          const payment =
            mockPayments.get(payment_id);


          if (!payment) {

            return res.status(400).json({
              message:
                "Payment could not be verified"
            });

          }


          // Payment must be successful
          if (payment.status !== "paid") {

            return res.status(400).json({
              message:
                "Payment has not been completed"
            });

          }


          // Payment method must match
          if (
            payment.paymentMethod !==
            payment_method
          ) {

            return res.status(400).json({
              message:
                "Payment method mismatch"
            });

          }


          // Payment amount must match
          if (
            Number(payment.amount) !==
            Number(calculatedTotal)
          ) {

            return res.status(400).json({
              message:
                "Payment amount does not match order total"
            });

          }


          finalPaymentStatus =
            "Paid";

          finalPaymentId =
            payment_id;

        }


        // ===============================
        // START DATABASE TRANSACTION
        // ===============================

        db.beginTransaction((err) => {

          if (err) {

            console.error(
              "Failed to start transaction:",
              err.message
            );

            return res.status(500).json({
              message:
                "Failed to start order transaction"
            });

          }


          // ===============================
          // CREATE ORDER
          // ===============================

          const orderSql = `
            INSERT INTO orders
            (
              store_id,
              customer_name,
              customer_email,
              customer_phone,
              delivery_address,
              payment_method,
              total_amount,
              payment_id,
              payment_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;


          const orderValues = [

            store_id,

            customer_name,

            customer_email,

            customer_phone,

            delivery_address,

            payment_method,

            calculatedTotal,

            finalPaymentId,

            finalPaymentStatus

          ];


          db.query(
            orderSql,
            orderValues,
            (err, orderResult) => {

              if (err) {

                console.error(
                  "Failed to create order:",
                  err.message
                );

                return db.rollback(() => {

                  res.status(500).json({
                    message:
                      "Failed to create order"
                  });

                });

              }


              const orderId =
                orderResult.insertId;


              // ===============================
              // CREATE ORDER ITEMS
              // ===============================

              const itemSql = `
                INSERT INTO order_items
                (
                  order_id,
                  product_id,
                  quantity,
                  price
                )
                VALUES ?
              `;


              const itemValues =
                items.map((item) => {

                  const product =
                    products.find(
                      (product) =>
                        Number(product.id) ===
                        Number(item.product_id)
                    );


                  return [

                    orderId,

                    product.id,

                    Number(item.quantity),

                    Number(product.price)

                  ];

                });


              db.query(
                itemSql,
                [itemValues],
                (err) => {

                  if (err) {

                    console.error(
                      "Failed to create order items:",
                      err.message
                    );

                    return db.rollback(() => {

                      res.status(500).json({
                        message:
                          "Failed to save order items"
                      });

                    });

                  }


                  // ===============================
                  // UPDATE STOCK
                  // ===============================

                  updateStock(0);


                  function updateStock(index) {

                    // All products updated
                    if (
                      index >= items.length
                    ) {

                      // ===============================
                      // COMMIT TRANSACTION
                      // ===============================

                      return db.commit((err) => {

                        if (err) {

                          console.error(
                            "Failed to commit transaction:",
                            err.message
                          );

                          return db.rollback(() => {

                            res.status(500).json({
                              message:
                                "Failed to complete order"
                            });

                          });

                        }


                        // ===============================
                        // REMOVE USED MOCK PAYMENT
                        // ===============================

                        if (finalPaymentId) {

                          mockPayments.delete(
                            finalPaymentId
                          );

                        }


                        // ===============================
                        // ORDER SUCCESS
                        // ===============================

                        res.status(201).json({

                          message:
                            "Order placed successfully",

                          orderId:
                            orderId,

                          totalAmount:
                            calculatedTotal,

                          paymentStatus:
                            finalPaymentStatus,

                          paymentId:
                            finalPaymentId

                        });

                      });

                    }


                    const item =
                      items[index];


                    const quantity =
                      Number(item.quantity);


                    const stockSql = `
                      UPDATE products
                      SET stock = stock - ?
                      WHERE id = ?
                        AND stock >= ?
                    `;


                    db.query(
                      stockSql,
                      [
                        quantity,
                        item.product_id,
                        quantity
                      ],
                      (err, result) => {

                        if (err) {

                          console.error(
                            "Failed to update stock:",
                            err.message
                          );

                          return db.rollback(() => {

                            res.status(500).json({
                              message:
                                "Failed to update product stock"
                            });

                          });

                        }


                        // Stock changed successfully
                        if (
                          result.affectedRows === 0
                        ) {

                          return db.rollback(() => {

                            res.status(400).json({
                              message:
                                "Stock changed while placing the order. Please try again."
                            });

                          });

                        }


                        // Move to next product
                        updateStock(index + 1);

                      }
                    );

                  }

                }

              );

            }

          );

        });

      }

    );

  }

});



// Get orders belonging to the logged-in user's stores
app.get("/api/orders", authenticateToken, (req, res) => {

  const userId = req.user.userId;

  const orderSql = `
    SELECT orders.*
    FROM orders
    JOIN stores
      ON orders.store_id = stores.id
    WHERE stores.user_id = ?
    ORDER BY orders.created_at DESC
  `;

  db.query(orderSql, [userId], (err, orders) => {

    if (err) {
      console.error("Failed to fetch orders:", err.message);

      return res.status(500).json({
        message: "Failed to fetch orders"
      });
    }

    res.json(orders);

  });

});


// Get items belonging to a specific order
app.get("/api/orders/:id/items", authenticateToken, (req, res) => {

  const orderId = Number(req.params.id);
  const userId = req.user.userId;

  const sql = `
    SELECT
      order_items.id,
      order_items.order_id,
      order_items.product_id,
      order_items.quantity,
      order_items.price,
      products.name
    FROM order_items
    JOIN products
      ON order_items.product_id = products.id
    JOIN orders
      ON order_items.order_id = orders.id
    JOIN stores
      ON orders.store_id = stores.id
    WHERE order_items.order_id = ?
      AND stores.user_id = ?
  `;

  db.query(sql, [orderId, userId], (err, results) => {

    if (err) {
      console.error(
        "Failed to fetch order items:",
        err.message
      );

      return res.status(500).json({
        message: "Failed to fetch order items"
      });
    }

    res.json(results);

  });

});


// Update order status
app.put("/api/orders/:id/status", authenticateToken, (req, res) => {

  const orderId = Number(req.params.id);
  const userId = req.user.userId;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status"
    });
  }

  const sql = `
    UPDATE orders
    JOIN stores
      ON orders.store_id = stores.id
    SET orders.status = ?
    WHERE orders.id = ?
      AND stores.user_id = ?
  `;

  db.query(
    sql,
    [status, orderId, userId],
    (err, result) => {

      if (err) {
        console.error(
          "Failed to update order status:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to update order status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      res.json({
        message: "Order status updated successfully"
      });

    }
  );

});



// ===============================
// DASHBOARD API
// ===============================

app.get("/api/dashboard", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Get dashboard statistics
  const statsSql = `
    SELECT

      (
        SELECT COUNT(*)
        FROM orders o
        JOIN stores s
          ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_orders,

      (
        SELECT COALESCE(SUM(o.total_amount), 0)
        FROM orders o
        JOIN stores s
          ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_revenue,

      (
        SELECT COUNT(*)
        FROM products p
        JOIN stores s
          ON p.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_products,

      (
        SELECT COUNT(DISTINCT o.customer_email)
        FROM orders o
        JOIN stores s
          ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_customers
  `;

  db.query(
    statsSql,
    [userId, userId, userId, userId],
    (err, statsResults) => {

      if (err) {
        console.error(
          "Failed to fetch dashboard statistics:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to fetch dashboard statistics"
        });
      }


      // Get recent orders
      const ordersSql = `
        SELECT
          o.id,
          o.customer_name,
          o.total_amount,
          o.status,
          o.created_at
        FROM orders o
        JOIN stores s
          ON o.store_id = s.id
        WHERE s.user_id = ?
        ORDER BY o.created_at DESC
        LIMIT 5
      `;

      db.query(
        ordersSql,
        [userId],
        (err, ordersResults) => {

          if (err) {
            console.error(
              "Failed to fetch recent orders:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to fetch recent orders"
            });
          }


          res.json({
            statistics: statsResults[0],
            recentOrders: ordersResults
          });

        }
      );

    }
  );
});


// ===============================
// CUSTOMER API
// ===============================

app.get("/api/customers", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
      orders.customer_name,
      orders.customer_email,
      orders.customer_phone,
      COUNT(orders.id) AS total_orders,
      SUM(orders.total_amount) AS total_spent
    FROM orders
    JOIN stores ON orders.store_id = stores.id
    WHERE stores.user_id = ?
    GROUP BY
      orders.customer_name,
      orders.customer_email,
      orders.customer_phone
    ORDER BY total_spent DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch customers:", err.message);

      return res.status(500).json({
        message: "Failed to fetch customers"
      });
    }

    res.json(results);
  });
});


// ===============================
// ANALYTICS API
// ===============================

app.get("/api/analytics", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
      (
        SELECT COALESCE(SUM(o.total_amount), 0)
        FROM orders o
        JOIN stores s ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_sales,

      (
        SELECT COUNT(*)
        FROM orders o
        JOIN stores s ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_orders,

      (
        SELECT COUNT(DISTINCT o.customer_email)
        FROM orders o
        JOIN stores s ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS total_customers,

      (
        SELECT COALESCE(SUM(oi.quantity), 0)
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN stores s ON o.store_id = s.id
        WHERE s.user_id = ?
      ) AS products_sold
  `;

  db.query(
    sql,
    [userId, userId, userId, userId],
    (err, results) => {

      if (err) {
        console.error("Failed to fetch analytics:", err.message);

        return res.status(500).json({
          message: "Failed to fetch analytics"
        });
      }

      res.json(results[0]);
    }
  );
});


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("Digital Storefront Builder Backend is running!");
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});