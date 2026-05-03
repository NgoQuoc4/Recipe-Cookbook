import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { Recipe } from "../types/Recipe";

export const useRecipeMutations = () => {
  const queryClient = useQueryClient();

  // Mutation thêm món ăn
  const createRecipeMutation = useMutation({
    mutationFn: async (newRecipe: Recipe) =>
      await api.post("/recipes", newRecipe),
    onSuccess: () => {
      toast.success("Đã thêm món ăn vào sổ tay!");
      queryClient.invalidateQueries({ queryKey: ["recipes", "mine"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể thêm món ăn. Vui lòng thử lại!");
    },
  });

  // Mutation update món ăn
  const updateRecipeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Recipe }) => {
      return api.put(`/recipes/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Đã cập nhật món ăn!");
      queryClient.invalidateQueries({ queryKey: ["recipes", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Không thể cập nhật món ăn. Vui lòng thử lại!",
      );
    },
  });

  // Mutation xóa món ăn
  const deleteRecipeMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/recipes/${id}`);
    },
    onSuccess: () => {
      toast.success("Đã xóa món ăn khỏi sổ tay!");
      // Làm mới danh sách công thức của tôi
      queryClient.invalidateQueries({ queryKey: ["recipes", "mine"] });
    },
    onError: (error: any) => {
      if (error.response.status == 403) {
        toast.error("Không có quyền xóa!");
      } else {
        toast.error("Không thể xóa món ăn. Vui lòng thử lại!");
      }
    },
  });

  // Mutation thay đổi trạng thái công khai
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      return api.patch(`/recipes/${id}`, { isPublic });
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.isPublic
          ? "Đã công khai món ăn!"
          : "Đã chuyển món ăn sang riêng tư!",
      );
      // Làm mới danh sách cá nhân và danh sách công khai
      queryClient.invalidateQueries({ queryKey: ["recipes", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["recipes", "public"] });
    },
    onError: (error: any) => {
      if (error.response.status == 403) {
        toast.error("Không có quyền chỉnh sửa!");
      } else {
        toast.error("Không thể chỉnh sửa. Vui lòng thử lại!");
      }
    },
  });

  return {
    createRecipe: createRecipeMutation.mutateAsync,
    isCreating: createRecipeMutation.isPending,
    updateRecipe: updateRecipeMutation.mutateAsync,
    isUpdating: updateRecipeMutation.isPending,
    deleteRecipe: deleteRecipeMutation.mutate,
    isDeleting: deleteRecipeMutation.isPending,
    toggleVisibility: toggleVisibilityMutation.mutate,
    isToggling: toggleVisibilityMutation.isPending,
  };
};
