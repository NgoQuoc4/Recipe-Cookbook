import { useState } from "react";
import { Plus } from "lucide-react";
import RecipeCard from "./RecipeCard";
import CreateRecipe from "./CreateRecipe";
import PopupRecipeDetail from "./PopupRecipeDetail/PopupRecipeDetail";
import { usePopup } from "../context/PopupContext";

export default function ListRecipe({
  title,
  description,
  recipes,
  showAddButton,
}: {
  title: string;
  description?: string;
  recipes: any;
  showAddButton: boolean;
}) {
  // sử dụng context popup
  const { isOpen, activeRecipeId, openPopup, closePopup } = usePopup();
  const [isCreateRecipe, setIsCreateRecipe] = useState(false); // trạng thái tạo món ăn

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-6 mt-20 mb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="flex justify-between items-center">
          <div className="mb-16">
            <label className="block text-sm font-black text-brand-primary uppercase tracking-[0.3em] mb-4">
              {description}
            </label>
            <h2 className="text-4xl md:text-6xl font-black text-[#1e1b4b] tracking-tighter leading-tight italic">
              {title}
            </h2>
          </div>
          <div className="mb-16">
            {/* Nút thêm món ăn chỉ hiển thị tại my recipes */}
            {showAddButton && (
              <button
                type="button"
                onClick={() => setIsCreateRecipe(true)}
                className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} strokeWidth={3} />
                Thêm món ăn
              </button>
            )}
          </div>
        </div>
        {/* Pop-up thêm món ăn */}
        {isCreateRecipe && (
          <CreateRecipe
            isEditing={false}
            onClose={() => setIsCreateRecipe(false)}
          />
        )}
        {/* Render danh sách món ăn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} isProfile={true} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-indigo-50/30 rounded-2xl border border-dashed border-indigo-100">
              <p className="text-slate-400 text-xl italic">
                Sổ tay của bạn đang trống. Hãy thêm món ăn mới nhé!
              </p>
            </div>
          )}
        </div>
        {/* Pop-up chi tiết món ăn */}
        {isOpen && (
          <PopupRecipeDetail manualId={activeRecipeId} onClose={closePopup} />
        )}
      </section>
    </>
  );
}
