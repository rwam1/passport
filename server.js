const express = require("express");
const session = require("express-session");
const { passport, generateToken } = require("./config");
const authMiddleware = require("./auth");

const app = express();
app.use(express.json());
app.use(session({ secret: "mySecret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// 🔹 LOGIN ROUTE using `app.route()`
app.route("/login")
  .post(passport.authenticate("local"), (req, res) => {
    const token = generateToken(req.user);
    console.log(token);
    
    res.json({ message: "Login successful", token });
  });

// 🔹 DASHBOARD ROUTE (Protected)
app.route("/dashboard")
  .get(authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}` });
  });

// 🔹 LOGOUT ROUTE using `app.route()`
app.route("/logout")
  .get((req, res) => {
    req.logout(() => res.json({ message: "Logged out successfully" }));
  });

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
