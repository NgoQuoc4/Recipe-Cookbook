import dotenv from "dotenv";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { getCategories } from "./controllers/recipeController.js";

dotenv.config();
const app = express(); //khởi tạo ứng dụng express
const PORT = process.env.PORT || 5000; //khởi tạo cổng

app.use(cors()); //cho phép các domain khác gọi vào API
app.use(express.json()); //cho phép server nhận dữ liệu dạng JSON

// Logger middleware để debug
app.use((req, res, next) => {
  console.log(`📡 [Incoming Request]: ${req.method} ${req.url}`);
  next();
});

//kiểm tra kết nối DB khi khởi động
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Kết nối DB thành công!");

    app.listen(PORT, () => {
      console.log(`✅ Server chạy ở cổng http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Kết nối DB thất bại:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "production") {
  main(); //gọi hàm main để khởi động server locally
}

// Export app for Vercel Serverless Functions
export default app;

// auth routes
app.use("/api/auth", authRoutes);
// recipe routes
app.use("/api/recipes", recipeRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});
