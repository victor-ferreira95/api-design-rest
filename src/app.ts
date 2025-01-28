import express from "express";
import { createDatabaseConnection } from "./database";
import customerRoutes from "./routes/customer.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import adminProductRoutes from "./routes/admin/admin-product.routes";
import adminCustomerRoutes from "./routes/admin/admin-customer.routes";
import adminCategoryRoutes from "./routes/admin/admin-category.routes";
import loginRoutes from "./routes/session-auth.routes";
import jwtAuthRoutes from "./routes/jwt-auth.routes";
import { createCustomerService, UserAlreadyExistsError } from "./services/customer.service";
// import session from "express-session";
import jwt from "jsonwebtoken";
import { Resource } from "./http/resource";
import { User } from "./entities/User";
import { ValidationError } from "./errors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// desabilitar a verificação de origem do cors para testes
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return next();
//   }

//   const origin = req.headers.origin;

//   // Verifica se o header Origin existe
//   if (!origin) {
//     return res.status(400).json({
//       title: "Bad Request",
//       status: 400,
//       detail: "Origin header is required",
//     });
//   }

//   // Valida se a origem está na lista de permitidas
//   if (!(defaultCorsOptions.origin! as string).split(",").includes(origin)) {
//     return res.status(403).json({
//       title: "Forbidden",
//       status: 403,
//       detail: "Origin not allowed",
//     });
//   }

//   next();
// });

app.use(async (req, res, next) => {
  if (!req.headers["content-type"]) {
    return next();
  }

  const allowedContentTypes = [
    "application/json",
    "application/x-www-form-urlencoded",
  ];

  if (!allowedContentTypes.includes(req.headers["content-type"])) {
    return res.status(415).json({
      title: "Unsupported Media Type",
      status: 415,
      detail:
        "Unsupported Media Type. Please use application/json or application/x-www-form-urlencoded",
    });
  }

  next();
});

app.use(async (req, res, next) => {
  const routesAllowingAlternateAccept = [
    {
      url: "/admin/products",
      method: "GET",
      accept: "text/csv",
    },
  ];

  const acceptHeader = req.headers["accept"];
  if (!acceptHeader) {
    return next();
  }

  if (acceptHeader === "application/json" || acceptHeader === "*/*") {
    return next();
  }

  const route = routesAllowingAlternateAccept.find((route) => {
    return req.url.startsWith(route.url) && req.method === route.method;
  });

  if (route && acceptHeader === route.accept) {
    return next();
  }

  return res.status(406).send({
    title: "Not Acceptable",
    status: 406,
    detail: `Not Acceptable format requested: ${req.headers["accept"]}, only application/json and text/csv are supported`,
  });
});

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const protectedRoutes = ["/admin", "/orders"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.url.startsWith(route)
  );

  if (isProtectedRoute) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(200).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "123");
      //@ts-expect-error
      req.userId = decoded.sub;
    } catch (e) {
      return res.status(200).send({ message: "Unauthorized" });
    }
  }

  next();
});

app.use("/jwt", jwtAuthRoutes);
app.use("/session", loginRoutes);
app.use("/customers", customerRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/admin/customers", adminCustomerRoutes);
app.use("/admin/categories", adminCategoryRoutes);

app.get("/", async (req, res) => {
  await createDatabaseConnection();
  res.send("Hello World!");
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!(err instanceof Error)) {
    return next(err);
  }
  console.error(err);

  if (err instanceof SyntaxError) {
    return res.status(400).send({
      title: "Bad Request",
      status: 400,
      detail: err.message,

    });
  }

  if (err instanceof UserAlreadyExistsError) {
    return res.status(409).send({
      title: "Conflit",
      status: 409,
      detail: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(422).send({
      title: "Unprocessable Entity",
      status: 422,
      detail: {
        errors: err.error.map((e) => ({
          field: e.property,
          message: e.constraints,
        })),
      }
    });
  }

  res.status(500).send({
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected error occurred",
  })
});

app.use(async (result: Resource, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (result instanceof Resource) {
    return res.json(result.toJson());
  }

  next(result);
});

app.listen(PORT, async () => {
  const customerService = await createCustomerService();
  //create a admin user
  await customerService.registerCustomer({
    name: "admin",
    email: "admin@user.com",
    password: "admin",
    phone: "1234567890",
    address: "admin address",
  });
  //create a customer user
  await customerService.registerCustomer({
    name: "customer",
    email: "customer@user.com",
    password: "customer",
    phone: "1234567890",
    address: "customer address",
  });
  console.log(`Server is running on http://localhost:${PORT}`);
});
