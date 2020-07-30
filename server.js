const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} = require("merge-graphql-schemas");
const connectDB = require("./models/connectDb");

dotenv.config({ path: "./config/.env" });

const PORT = process.env.PORT || 5060;

// DB
connectDB();

// Express server
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Type Definitions
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./typeDefs")));

// Resolvers
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

// Graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// Apply express as middleware
apolloServer.applyMiddleware({ app });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/v1", require("./routes/userRoutes"));

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
  )
);
