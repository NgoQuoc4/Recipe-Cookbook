import { type Request, type Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//khai báo biến môi trường
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
//thời gian hết hạn của token
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req: Request, res: Response) => {
  try {
    //nhận dữ liệu từ client
    const { name, email, password } = req.body;
    //kiểm tra dữ liệu nhập
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    // kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    // mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    // tạo tài khoản mới
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "Đăng ký thành công", userId: user.id });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi khi đăng ký người dùng" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi khi đăng nhập" });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
