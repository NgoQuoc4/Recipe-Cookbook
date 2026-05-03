import {
  ChefHat,
  Loader2,
  Plus,
  Refrigerator,
  Sparkles,
  Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useRecipeMutations } from "../hook/useRecipeMutations";
import toast from "react-hot-toast";

export default function AiRecipe() {
  const [ingredients, setIngredients] = useState<string[]>([]); //danh sách nguyên liệu
  const [inputValue, setInputValue] = useState(""); //ô nhập liệu
  const [isLoading, setIsLoading] = useState(false); // trạng thái chờ api
  const [recipe, setRecipe] = useState<any>(null); // lưu kết quả món ăn
  //hook
  const { createRecipe, isCreating } = useRecipeMutations();
  const resultRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống kết quả khi AI trả về
  useEffect(() => {
    if (recipe && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recipe]);

  // thêm nguyên liệu
  const addIngredient = () => {
    const value = inputValue.trim();
    if (value && !ingredients.includes(value)) {
      setIngredients([...ingredients, value]);
      setInputValue("");
    }
  };
  // xóa nguyên liệu
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSuggest = async () => {
    setIsLoading(true);
    setRecipe(null); // Reset món cũ
    try {
      const response = await api.post("/recipes/ai-suggest", { ingredients });
      setRecipe(response.data);
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      toast.error(
        "Không thể kết nối với Server. Hãy chắc chắn Server đang chạy!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // lưu món ăn
  const handleSave = async () => {
    if (!recipe) return;
    try {
      // Gộp nguyên liệu và loại bỏ trùng lặp
      const uniqueIngredients = Array.from(
        new Set([...ingredients, ...(recipe.additionalIngredients || [])]),
      );

      const payload = {
        ...recipe,
        title: recipe.name,
        ingredients: uniqueIngredients,
        isPublic: false, // Mặc định món AI lưu vào là riêng tư
      };

      await createRecipe(payload);
      setRecipe(null); // Reset sau khi lưu thành công
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      // Toast error đã được xử lý trong hook useRecipeMutations
    }
  };

  return (
    <>
      <div className="min-h-screen pb-20 mt-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="text-center py-12 relative animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="inline-flex p-6 bg-brand-primary/10 rounded-2xl mb-8 shadow-inner animate-float">
              <ChefHat className="text-brand-primary" size={56} />
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 text-[#1e1b4b] leading-tight">
              Sổ tay <br />
              <span className="text-brand-primary font-bold text-7xl md:text-9xl">
                Thông minh
              </span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
              Nhập nguyên liệu bạn đang có, AI sẽ giúp bạn biến chúng thành món
              ăn tuyệt hảo.
            </p>
          </div>

          {/* Input Card Container */}
          <div className="bg-white border border-indigo-100/50 rounded-2xl p-8 md:p-16 shadow-2xl shadow-indigo-200/50 relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-2xl blur-3xl -z-10" />

            <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pl-4">
              Bước 1: Kiểm tra tủ lạnh
            </label>

            <div className="relative group mb-10">
              <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-brand-primary transition-all duration-300">
                <Refrigerator size={32} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                placeholder="Hành tây, Trứng, Bột mì..."
                className="w-full bg-indigo-50/50 border-2 border-transparent rounded-2xl py-8 pl-18 pr-48 outline-none focus:bg-white focus:border-brand-primary focus:ring-8 focus:ring-brand-primary/5 transition-all text-2xl font-black text-[#1e1b4b] placeholder:text-slate-300 shadow-inner"
              />
              <button
                onClick={addIngredient}
                className="absolute right-4 top-4 bottom-4 bg-brand-primary hover:bg-violet-700 text-white px-10 rounded-2xl font-black text-xl flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-violet-500/30"
              >
                <Plus size={24} strokeWidth={3} />
                <span className="hidden sm:inline">Thêm</span>
              </button>
            </div>

            <label className="block text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pl-4">
              Bước 2: Nguyên liệu đã chọn
            </label>

            <div className="flex flex-wrap gap-4 min-h-[80px] p-6 bg-indigo-50/30 rounded-2xl border border-dashed border-indigo-100">
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white border border-indigo-100 text-[#1e1b4b] pl-6 pr-4 py-3 rounded-2xl font-black shadow-sm group hover:border-brand-primary hover:scale-105 transition-all animate-in zoom-in h-fit"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(index)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Xóa"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center py-4 text-slate-400 font-medium italic">
                  (Chưa có nguyên liệu nào được chọn)
                </div>
              )}
            </div>

            {ingredients.length > 0 && (
              <div className="mt-12 group">
                <button
                  onClick={handleSuggest}
                  disabled={isLoading}
                  className="w-full bg-brand-primary hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-10 rounded-2xl font-black text-3xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-violet-500/40 hover:-translate-y-2 active:translate-y-0 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={32} />
                  ) : (
                    <>
                      <Sparkles className="animate-pulse" size={36} />
                      Phân tích & gợi ý món ăn
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Result Card Container - Trình diễn món ăn AI */}
          {recipe && (
            <div
              ref={resultRef}
              className="mt-12 bg-white border-2 border-brand-primary/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-700"
            >
              {/* Header result */}
              <div className="bg-gradient-to-r from-brand-primary to-violet-600 p-8 md:p-12 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                    <Sparkles className="text-white animate-pulse" size={32} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
                    AI Đã tìm thấy cảm hứng!
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic">
                  {recipe.name}
                </h2>
              </div>

              {/* Content result */}
              <div className="p-8 md:p-12 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Ingredients needed */}
                  <div className="bg-indigo-50/30 p-10 rounded-2xl border border-indigo-100/50">
                    <h4 className="text-xl font-black text-[#1e1b4b] mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-brand-primary rounded-2xl" />
                      Nguyên liệu bổ sung
                    </h4>
                    <ul className="space-y-4">
                      {recipe.additionalIngredients?.length > 0 ? (
                        recipe.additionalIngredients.map(
                          (ing: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-4 text-slate-600 font-bold"
                            >
                              <div className="w-2.5 h-2.5 rounded-2xl bg-brand-primary/20" />
                              {ing}
                            </li>
                          ),
                        )
                      ) : (
                        <li className="text-slate-400 italic">
                          Tủ lạnh của bạn đã đủ để làm món này!
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="text-xl font-black text-[#1e1b4b] mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-brand-primary rounded-2xl" />
                      Cách chế biến
                    </h4>
                    <div className="space-y-8">
                      {recipe.steps?.map((step: string, i: number) => (
                        <div key={i} className="flex gap-6 group">
                          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-brand-primary font-black shrink-0 border border-indigo-100 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                            {i + 1}
                          </span>
                          <p className="text-slate-600 font-medium leading-relaxed pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-8 border-t border-indigo-50">
                  <button
                    onClick={handleSave}
                    disabled={isCreating}
                    className="w-full bg-brand-primary hover:bg-violet-700 text-white py-8 rounded-2xl font-black text-2xl shadow-xl shadow-violet-500/30 flex items-center justify-center gap-4 transition-all active:scale-95 disabled:bg-slate-200"
                  >
                    {isCreating ? (
                      <Loader2 className="animate-spin" size={32} />
                    ) : (
                      <Plus size={32} strokeWidth={3} />
                    )}
                    {isCreating
                      ? "Đang lưu vào sổ tay..."
                      : "Lưu món ăn này vào sổ tay"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
