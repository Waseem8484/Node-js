const express = require("express");
const app = express();
const morgan = require("morgan");
const authController = require("./Controller/authController");
const UserTourController = require("./Controller/UserTourController");
const BookingController = require("./Controller/BookingController");
const rateLimit = require("express-rate-limit");
const mongosanatize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use("/api", apiLimiter);
app.use(mongosanatize());
app.use(xss());
app.use(hpp({ whitelist: ["duration"] }));
const databasemongose =
  "mongodb+srv://waseemanjum:OUpqIYGxhXUB5TXA@cluster0.xhzufpu.mongodb.net/WaseemAnjum?retryWrites=true&w=majority";
const mongoose = require("mongoose");
app.use(express.json());
mongoose
  .connect(databasemongose, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("successful connected___________");
  })
  .catch((err) => {
    console.log("errrr++++++++++", err);
  });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(compression());
app.route("/api/signUp").post(authController.singUp);
app.route("/api/loginUser").post(authController.loginUser);
app.route("/api/forgetPassword").post(authController.Forgetpassword);
app.route("/api/Resetpaasword/:token").get(authController.Resetpassword);
app
  .route("/api/updetephoto")
  .post(
    authController.userPhoto,
    authController.resizephoto,
    authController.putphoto
  );
app
  .route("/api/Updatemypassword")
  .patch(authController.Protect, authController.updatedPassword);

// booking Api through stripe
app.route("/api/Booking/:id").post(BookingController.SessionBooking);

// all crud operation
app
  .route("/api/v1/tour")
  .get(UserTourController.getAllData)
  .post(UserTourController.postData);
app
  .route("/api/v1/tour/:id")
  .get(authController.Protect, UserTourController.getTourById)
  .patch(authController.Protect, UserTourController.PatchData)
  .delete(authController.Protect, UserTourController.DeleteData);
// port
const port = 4000;
app.listen(port, "127.0.0.1", (res) => {
  console.log("App Running on this podrts");
});
