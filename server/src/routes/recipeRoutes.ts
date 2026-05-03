import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getRecipeSuggestions,
  createRecipe,
  getAllRecipes,
  deleteRecipe,
  getHomeFeed,
  getRecipeById,
  updateRecipe,
  updateRecipePublic,
  getCategories,
} from "../controllers/recipeController.js";
import { Router } from "express";

const router = Router();

// Route công khai
router.get("/public", getHomeFeed);
router.get("/categories", getCategories);
router.get("/:id", getRecipeById);

// Từ đây trở xuống, mọi request đều phải có Token hợp lệ
router.use(authenticateToken);

// Các hành động cần Đăng nhập
router.post("/ai-suggest", getRecipeSuggestions);

router.get("/", getAllRecipes);

router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.patch("/:id", updateRecipePublic);
router.delete("/:id", deleteRecipe);

export default router;
