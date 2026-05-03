import { useEffect, useState } from "react";
import { CircleX, Plus, Trash2 } from "lucide-react";
import { useRecipeMutations } from "../hook/useRecipeMutations";
import { useCategories } from "../hook/useRecipesQuery";

export default function CreateRecipe({
  onClose,
  recipe,
  isEditing,
}: {
  isEditing: boolean;
  onClose: () => void;
  recipe?: any;
}) {
  // hooks useRecipeMutations
  const { createRecipe, isCreating, updateRecipe, isUpdating } =
    useRecipeMutations();

  // init form
  const [formData, setFormData] = useState({
    title: "",
    prepTime: 15,
    cookTime: 15,
    ingredients: [""],
    steps: [""],
    difficulty: "EASY",
    categoryId: "",
    isPublic: false,
  });

  // init image
  const [image, setImage] = useState<File | null>(null);

  //  if isEditing
  useEffect(() => {
    if (isEditing && recipe) {
      setFormData({
        ...formData,
        title: recipe.title,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        categoryId: recipe.categoryId,
        ingredients: recipe.ingredients.map(
          (item: any) => item.ingredient.name,
        ),
        steps: recipe.steps,
        isPublic: recipe.isPublic,
      });
    }
  }, [isEditing, recipe]);

  // query category
  const { data: categories = [], isLoading } = useCategories();

  // add ingredient
  const handleAddIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };
  // update ingredient
  const handleUpdateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };
  // remove ingredient
  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };
  // add step
  const handleAddStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ""] });
  };
  // update step
  const handleUpdateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };
  // remove step
  const handleRemoveStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    });
  };

  // handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      image,
      ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
      steps: formData.steps.filter((step) => step.trim() !== ""),
    };

    if (isEditing) {
      try {
        await updateRecipe({ id: recipe.id, data: finalData });
        onClose();
      } catch (error) {
        console.error("Error updating recipe:", error);
      }
    } else {
      try {
        await createRecipe(finalData);
        onClose();
      } catch (error) {
        console.error("Error creating recipe:", error);
      }
    }
  };

  // loading
  const isSaving = isCreating || isUpdating;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-violet-200/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-indigo-900">
              {isEditing ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}
            </h2>
            <CircleX
              size={24}
              className="text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
              onClick={onClose}
            />
          </div>
          {/* form */}
          <form onSubmit={handleSubmit}>
            {/* Tên món ăn */}
            <div className="mb-2">
              <label className="block text-sm font-black text-indigo-900 mb-2">
                Tên món ăn
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900 placeholder-indigo-300"
                placeholder="Ví dụ: Phở Bò Truyền Thống"
                required
              />
            </div>

            {/* Thời gian chuẩn bị & nấu */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-black text-indigo-900 mb-2">
                  Thời gian chuẩn bị (phút)
                </label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prepTime: Number(e.target.value),
                    })
                  }
                  className="w-full px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900 placeholder-indigo-300"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-indigo-900 mb-2">
                  Thời gian nấu (phút)
                </label>
                <input
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cookTime: Number(e.target.value),
                    })
                  }
                  className="w-full px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900 placeholder-indigo-300"
                  min="0"
                />
              </div>
            </div>
            {/* Nguyên liệu */}
            <div className="mt-4">
              <label className="block text-sm font-black text-indigo-900 mb-2">
                Nguyên liệu
              </label>
              <div className="space-y-2">
                {formData.ingredients.map(
                  (ingredient: string, index: number) => {
                    return (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) =>
                            handleUpdateIngredient(index, e.target.value)
                          }
                          className="flex-1 px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900"
                          placeholder="Ví dụ: Thịt bò"
                        />
                        <Trash2
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          size={24}
                          className="w-8 h-8 p-2 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center cursor-pointer"
                        />
                      </div>
                    );
                  },
                )}
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="w-full px-6 py-4 rounded-2xl bg-indigo-100 text-brand-primary font-black hover:bg-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={24} />
                  Thêm nguyên liệu
                </button>
              </div>
            </div>
            {/* Các bước thực hiện */}
            <div className="mt-4">
              <label className="block text-sm font-black text-indigo-900 mb-2">
                Các bước thực hiện
              </label>
              <div className="space-y-2">
                {formData.steps.map((step, index) => {
                  return (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 font-black flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) =>
                          handleUpdateStep(index, e.target.value)
                        }
                        className="flex-1 px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900"
                        placeholder={`Bước ${index + 1}`}
                      />
                      <Trash2
                        type="button"
                        onClick={() => handleRemoveStep(index)}
                        size={24}
                        className="w-8 h-8 p-2 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center cursor-pointer"
                      />
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="w-full px-6 py-4 rounded-2xl bg-indigo-100 text-brand-primary font-black hover:bg-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={24} />
                  Thêm bước
                </button>
              </div>
            </div>
            {/* Hình ảnh và độ khó */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-black text-indigo-900 mb-2">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-black text-indigo-900 mb-2">
                  Độ khó
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value,
                    })
                  }
                  className="w-full px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900 cursor-pointer"
                >
                  <option value="EASY">Dễ</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HARD">Khó</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label>Danh mục</label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                  })
                }
                className="mt-2 w-full px-6 py-4 rounded-2xl bg-white/60 border-2 border-indigo-200 focus:border-brand-primary focus:outline-none transition-all text-indigo-900 cursor-pointer"
              >
                <option value="">
                  {isLoading ? "Đang tải danh mục..." : "Chọn danh mục"}
                </option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-4 w-full py-5 rounded-2xl bg-brand-primary text-white font-black text-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isEditing
                ? isSaving
                  ? "Đang cập nhật..."
                  : "Cập nhật món ăn"
                : isSaving
                  ? "Đang lưu..."
                  : "Lưu món ăn"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
