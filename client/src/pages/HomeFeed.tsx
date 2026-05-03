import { Sparkles } from "lucide-react";
import { usePublicRecipes } from "../hook/useRecipesQuery";
import ListRecipe from "../components/ListRecipe";

export default function HomeFeed() {
  const { data: recipes = [], isLoading: loading } = usePublicRecipes();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="animate-pulse text-brand-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="pb-20 px-6 max-w-7xl mx-auto mt-16 animate-in fade-in duration-700">
      <div className="mb-20 text-center md:text-left relative py-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-2xl blur-3xl -z-10" />
        <h1 className="text-5xl md:text-8xl font-black text-[#1e1b4b] mb-6 tracking-tighter leading-tight">
          Hôm nay{" "}
          <span className="text-brand-primary relative">
            Ăn Gì
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-brand-primary/10 -skew-x-12" />
          </span>
        </h1>
        <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed">
          Khám phá và chia sẻ cảm hứng nấu ăn mỗi ngày từ hàng ngàn công thức
          sáng tạo.
        </p>
      </div>

      <ListRecipe
        title="Món ngon cộng đồng"
        description="Có món này ngon mà người khác chưa biết, chia sẻ ngay nhé!"
        recipes={recipes}
        showAddButton={false}
      />
    </div>
  );
}
