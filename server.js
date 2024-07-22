const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const path = require("path");


require("dotenv").config();
console.log(process.env.MONGODB_URI, process.env.SESSION_SECRET);



const initialize = require("./config/passportConfig");
initialize(passport);

const homeRouter = require("./routes/api/homeRouter");
const boardRouter = require("./routes/api/boardRouter");
const listRouter = require("./routes/api/listRouter");
const cardRouter = require("./routes/api/cardRouter");

const app = express();

const port = process.env.PORT || 5000;

const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: "sessions",
  }),
};

app.use(helmet());
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", homeRouter);
app.use("/api", boardRouter);
app.use("/api", listRouter);
app.use("/api", cardRouter);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); 

  app.use(express.static(path.join(__dirname, "./client/build")));

 
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build", "index.html"));
  });
}

app.listen(port, () => {
  
  require("./config/mongoConfig");
  console.log(`Server is running on port: ${port}`);
});
