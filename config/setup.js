import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { COOKIE_PASSWORD } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import Category from "../models/CategoryModel.js";

AdminJS.registerAdapter(AdminJSMongoose);
const DEFAULT_ADMIN = {
  email: "aniketjha917928@gmail.com",
  password: "012345678",
};

const Authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};
export const buildAdminJS = async (app) => {
  const admin = new AdminJS({
    resources: [
      { resource: Product },
      { resource: Category },
      { resource: Order },
      { resource: User },
      { resource: Transaction },
    ],
    branding: {
      companyName: "Kart",
      withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: "/admin",
  });
  const MongoDBStore = ConnectMongoDBSession(session);
  const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions",
  });
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: COOKIE_PASSWORD,
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
      name: "adminjs",
    }
  );
};
