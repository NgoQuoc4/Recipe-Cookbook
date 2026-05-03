import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

// Hook lấy danh sách món ăn cá nhân (Cookbook)
export const useMyRecipes = () => {
  return useQuery({
    queryKey: ["recipes", "mine"],
    queryFn: async () => {
      const { data } = await api.get("/recipes");
      return data;
    },
  });
};

// Hook lấy danh sách món ăn công khai (Home Feed)
export const usePublicRecipes = () => {
  return useQuery({
    queryKey: ["recipes", "public"],
    queryFn: async () => {
      const { data } = await api.get("/recipes/public");
      return data;
    },
  });
};

// Hook lấy chi tiết một món ăn
export const useRecipeById = (id: string | null) => {
  return useQuery({
    queryKey: ["recipes", "detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/recipes/${id}`);
      return data;
    },
    enabled: !!id, // Chỉ chạy khi có ID
  });
};

// Hook lấy danh sách danh mục
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/recipes/categories");
      return data;
    },
  });
};
