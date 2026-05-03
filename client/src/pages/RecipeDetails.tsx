import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Utensils,
} from "lucide-react";
import { useRecipeDetails } from "../hook/useRecipeDetails";
import LoadingView from "../components/LoadingView/LoadingView";
import NotFoundView from "../components/NotFoundView/NotFoundView";

export default function RecipeDetails() {
  // hook get recipe details
  const { recipe, loading, UNIT_LABELS, handleBack, navigate } =
    useRecipeDetails();

  // loading
  if (loading) return <LoadingView />;
  // không tìm thấy recipe
  if (!recipe) return <NotFoundView handleBack={handleBack} />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-indigo-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-primary font-black transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
              <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                {recipe.author?.name?.charAt(0) || "G"}
              </div>
              <span className="text-xs font-black text-indigo-900">
                {recipe.author?.name || "Đầu bếp"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="space-y-10 mb-10">
          <h1 className="text-5xl md:text-7xl font-black text-[#1e1b4b] leading-[1.1] tracking-tighter italic">
            {recipe.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Info & Ingredients */}

          {/* Hero Section */}
          <div className="lg:col-span-5 space-y-10">
            <div className="relative aspect-[4/3] bg-indigo-50">
              <div className="absolute inset-0 flex items-center justify-center text-indigo-300 bg-gradient-to-br from-indigo-50 to-white">
                <ChefHat size={64} strokeWidth={1} />
              </div>
            </div>
            {/* Ingredients Card */}
            <div className="bg-white border border-indigo-100 rounded-2xl p-10 shadow-2xl shadow-indigo-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-2xl font-black text-[#1e1b4b] mb-8 flex items-center gap-4">
                <div className="w-2 h-10 bg-brand-primary rounded-full" />
                Nguyên liệu
              </h3>
              <div className="space-y-4">
                {recipe.ingredients?.map((ing: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-transparent hover:border-brand-primary/20 hover:bg-white transition-all group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white border border-indigo-200 flex items-center justify-center text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-slate-600 font-bold">
                      {ing.ingredient.name}
                      {ing.quantity !== "1" || ing.unit !== "PCS" ? (
                        <span className="ml-2 text-brand-primary italic opacity-70">
                          ({ing.quantity} {UNIT_LABELS[ing.unit] || ing.unit})
                        </span>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column: Instructions */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-indigo-100 rounded-2xl p-10 md:p-16 shadow-2xl shadow-indigo-200/50">
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center gap-3 bg-white border border-indigo-100 px-6 py-4 rounded-2xl shadow-sm">
                  <Clock size={20} className="text-brand-primary" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Thời gian
                    </p>
                    <p className="text-sm font-black text-indigo-900">
                      {recipe.prepTime + recipe.cookTime} phút
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-indigo-100 px-6 py-4 rounded-2xl shadow-sm">
                  <Flame size={20} className="text-orange-500" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Độ khó
                    </p>
                    <p className="text-sm font-black text-indigo-900">
                      {recipe.difficulty === "EASY"
                        ? "Dễ"
                        : recipe.difficulty === "MEDIUM"
                          ? "Trung bình"
                          : "Khó"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-indigo-100 px-6 py-4 rounded-2xl shadow-sm">
                  <Utensils size={20} className="text-orange-500" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Danh mục
                    </p>
                    <p className="text-sm font-black text-indigo-900">
                      {recipe.category?.name || "Công thức chọn lọc"}
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#1e1b4b] mb-12 flex items-center gap-4">
                <div className="w-2 h-10 bg-brand-primary rounded-full" />
                Các bước thực hiện
              </h3>
              <div className="space-y-12">
                {recipe.steps?.map((step: string, i: number) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-brand-primary font-black flex items-center justify-center text-xl border-2 border-indigo-100 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-500 shrink-0">
                        {i + 1}
                      </div>
                      {i < recipe.steps.length - 1 && (
                        <div className="absolute top-16 bottom-[-3rem] left-1/2 w-0.5 bg-dashed bg-gradient-to-b from-indigo-100 to-transparent" />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="text-slate-600 text-xl font-medium leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Finish Mark */}
              <div className="mt-20 pt-10 border-t border-indigo-50 text-center">
                <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-2xl mb-4">
                  <ChefHat size={32} />
                </div>
                <h4 className="text-xl font-black text-indigo-900">
                  Món ăn của bạn đã hoàn thành!
                </h4>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                  Chúc bạn ngon miệng với thực đơn từ {recipe.author?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
