import { type Response, type Request } from "express";
import { type AuthRequest } from "../middlewares/authMiddleware.js";
import { suggestRecipe } from "../services/aiService.js";
import prisma from "../lib/prisma.js";
import {
  handleCheckPermission,
  handleCreateRecipe,
  handleDeleteRecipe,
  handleGetAllRecipe,
  handleGetCategories,
  handleGetRecipeById,
  handleGetRecipesByAuthor,
  handleUpdateRecipe,
  handleUpdateRecipePublic,
} from "../services/recipeService.js";

// LẤY BẢNG TIN CÔNG KHAI (HOME FEED)
export const getHomeFeed = async (req: Request, res: Response) => {
  try {
    const recipes = await handleGetAllRecipe();
    return res.json(recipes);
  } catch (error: any) {
    console.error("❌ Lỗi Home Feed:", error);
    return res
      .status(500)
      .json({ message: "Không thể lấy bảng tin cộng đồng", error: error?.message || String(error) });
  }
};

// GỢI Ý MÓN ĂN TỪ AI
export const getRecipeSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    const { ingredients } = req.body;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập!" });

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res.status(400).json({ message: "Thiếu nguyên liệu!" });
    }

    const suggestion = await suggestRecipe(ingredients);
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ message: "Lỗi AI Service" });
  }
};

// LƯU MÓN ĂN
export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      steps,
      ingredients,
      isPublic,
      categoryId,
      prepTime,
      cookTime,
      image,
    } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập!" });

    // Xác định Category ID (ưu tiên từ Client gửi lên)
    let finalCategoryId = categoryId;

    if (!finalCategoryId) {
      let category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({ data: { name: "Mặc định" } });
      }
      finalCategoryId = category.id;
    }

    const newRecipe = await handleCreateRecipe(
      {
        title,
        steps,
        prepTime: Number(prepTime) || 15,
        cookTime: Number(cookTime) || 15,
        ingredients,
        isPublic,
        categoryId: finalCategoryId,
        image,
        authorId: userId,
        difficulty: "EASY",
      },
      userId,
    );
    res.status(201).json({ message: "Đã lưu!", recipe: newRecipe });
  } catch (error) {
    console.error("❌ Lỗi createRecipe:", error);
    res.status(500).json({ message: "Không thể lưu vào Database" });
  }
};

// LẤY DANH SÁCH CÁ NHÂN
export const getAllRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.userId;
    if (!id || typeof id !== "string") {
      return res
        .status(401)
        .json({ message: "Bạn chưa đăng nhập hoặc ID không hợp lệ!" });
    }
    const listRecipe = await handleGetRecipesByAuthor(id);
    res.json(listRecipe);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách cá nhân" });
  }
};

// XÓA MÓN ĂN
export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập!" });
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID món ăn không hợp lệ!" });
    }
    // Kiểm tra quyền sở hữu trước khi xóa (Bảo mật thêm)
    const user = await handleCheckPermission(id, userId);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa món này!" });
    }
    await handleDeleteRecipe(id);
    res.json({ message: "Đã xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa món ăn" });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID món ăn không hợp lệ!" });
    }
    const recipe = await handleGetRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết món ăn:", error);
    res.status(500).json({ message: "Không thể lấy chi tiết món ăn" });
  }
};

export const updateRecipePublic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập!" });
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID món ăn không hợp lệ!" });
    }
    // Kiểm tra quyền sở hữu trước khi xóa (Bảo mật thêm)
    const user = await handleCheckPermission(id, userId);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa món này!" });
    }
    await handleUpdateRecipePublic(id, isPublic);
    res.json({ message: "Đã cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật món ăn" });
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      steps,
      prepTime,
      cookTime,
      ingredients,
      isPublic,
      categoryId,
      authorId,
      image,
    } = req.body;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập!" });
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID món ăn không hợp lệ!" });
    }
    // Kiểm tra quyền sở hữu trước khi xóa (Bảo mật thêm)
    const user = await handleCheckPermission(id, userId);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa món này!" });
    }
    await handleUpdateRecipe({
      id,
      title,
      steps,
      prepTime,
      cookTime,
      ingredients,
      isPublic,
      categoryId,
      authorId,
      image,
      difficulty: "EASY",
    });
    res.json({ message: "Đã cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật món ăn" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await handleGetCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh mục" });
  }
};
