import prisma from "../lib/prisma.js";
import type { CreateRecipeParams } from "../types/recipe.js";

// lấy danh sách recipe home feed
export const handleGetAllRecipe = async () => {
  return await prisma.recipe.findMany({
    where: { isPublic: true },
    include: {
      author: { select: { name: true } }, // CHỈ lấy tên, bảo mật mật khẩu
      ingredients: { include: { ingredient: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// tạo mới recipe
export const handleCreateRecipe = async (
  {
    title,
    steps,
    prepTime = 15,
    cookTime = 20,
    ingredients,
    isPublic,
    categoryId,
    authorId,
    image,
  }: CreateRecipeParams,
  userId: string,
) => {
  const newRecipe = await prisma.recipe.create({
    data: {
      title,
      steps,
      prepTime,
      cookTime,
      difficulty: "EASY",
      isPublic: !!isPublic,
      authorId,
      categoryId: categoryId,
      image: image || "",
      ingredients: {
        create: (ingredients || []).map((ingredient: string) => ({
          quantity: "1",
          unit: "PCS",
          ingredient: {
            connectOrCreate: {
              where: { name: ingredient },
              create: { name: ingredient },
            },
          },
        })),
      },
    },
  });
  return newRecipe;
};

// lấy danh sách recipe theo id công thức
export const handleGetRecipeById = async (id: string) => {
  return await prisma.recipe.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      ingredients: { include: { ingredient: true } },
      category: { select: { name: true } },
    },
  });
};

// lấy danh sách recipe theo authorId (người tạo)
export const handleGetRecipesByAuthor = async (authorId: string) => {
  const listRecipe = await prisma.recipe.findMany({
    where: { authorId },
    include: {
      author: { select: { name: true } },
      ingredients: { include: { ingredient: true } },
      category: { select: { name: true } },
    },

    orderBy: { createdAt: "desc" },
  });

  return listRecipe;
};

// check quyền xóa recipe , có thuộc quyền sở hữu không
export const handleCheckPermission = async (id: string, userId: string) => {
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) {
    return false;
  }
  return recipe.authorId === userId;
};

// xóa recipe
export const handleDeleteRecipe = async (id: string) => {
  return await prisma.recipe.delete({ where: { id } });
};

// cập nhật recipe
export const handleUpdateRecipePublic = async (
  id: string,
  isPublic: boolean,
) => {
  return await prisma.recipe.update({
    where: { id },
    data: {
      isPublic: isPublic,
    },
  });
};

export const handleUpdateRecipe = async ({
  id,
  title,
  steps,
  prepTime = 15,
  cookTime = 20,
  ingredients,
  isPublic,
  categoryId,
  authorId,
  image,
  difficulty,
}: CreateRecipeParams) => {
  return await prisma.recipe.update({
    where: { id: id! },
    data: {
      title,
      steps,
      prepTime,
      cookTime,
      difficulty,
      isPublic: !!isPublic,
      authorId,
      categoryId,
      image: image || "",
      ingredients: {
        deleteMany: {},
        create: (ingredients || []).map((ingredient: string) => ({
          quantity: "1",
          unit: "PCS",
          ingredient: {
            connectOrCreate: {
              where: { name: ingredient },
              create: { name: ingredient },
            },
          },
        })),
      },
    },
  });
};

export const handleGetCategories = async () => {
  const res = await prisma.category.findMany();
  console.log("res", res);
  return res;
};
