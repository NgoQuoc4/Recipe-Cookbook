import {
  ChefHat,
  Clock,
  Copy,
  Eye,
  EyeClosed,
  Heart,
  MessageCircle,
  Trash,
} from "lucide-react";
import { useMatch, useNavigate } from "react-router-dom";
import { usePopup } from "../context/PopupContext";
import { useRecipeMutations } from "../hook/useRecipeMutations";
import toast from "react-hot-toast";

interface RecipeCardProps {
  recipe: any;
  isProfile?: boolean;
}

export default function RecipeCard({
  recipe,
  isProfile = false,
}: RecipeCardProps) {
  const isMyRecipesPage = !!useMatch("/my-recipes");

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/recipe/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Đã sao chép liên kết món ăn!");
  };

  const navigate = useNavigate();
  const { openPopup } = usePopup();
  const { deleteRecipe, toggleVisibility } = useRecipeMutations();

  const handleQuickView = () => {
    openPopup(recipe.id);
  };

  return (
    <div className="group bg-white border border-indigo-100/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-violet-200 transition-all duration-500 hover:-translate-y-2 flex flex-col relative">
      {/* Badge trạng thái - Chỉ hiện ở trang cá nhân */}
      {isProfile && (
        <div
          className={`absolute top-6 right-8 z-10 text-[10px] font-black px-4 py-1.5 rounded-2xl backdrop-blur-md border shadow-sm ${
            recipe.isPublic
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-amber-50 text-amber-600 border-amber-100"
          }`}
        >
          {recipe.isPublic ? "CÔNG KHAI" : "RIÊNG TƯ"}
        </div>
      )}

      {/* Ảnh / Thumbnail */}
      <div className="relative aspect-[4/3] bg-indigo-50">
        <div className="absolute inset-0 flex items-center justify-center text-indigo-300 bg-gradient-to-br from-indigo-50 to-white">
          <ChefHat size={64} strokeWidth={1} />
        </div>
        <div className="absolute top-6 left-6 bg-brand-primary/90 text-white text-[10px] font-black px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg shadow-violet-500/20">
          {recipe.category?.name || "AI SUGGESTED"}
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-primary font-bold text-xs uppercase shadow-inner">
            {recipe.author?.name?.charAt(0) || "G"}
          </div>
          <div>
            <p className="text-[#1e1b4b] font-black text-sm">
              {recipe.author?.name || "Đầu bếp ẩn danh"}
            </p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => navigate(`/recipe/${recipe.id}`)}
          className="text-2xl font-black text-[#1e1b4b] mb-4 line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors h-14 cursor-pointer"
        >
          {recipe.title}
        </h3>

        {/* Specs */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-black bg-indigo-50/50 px-4 py-2 rounded-2xl border border-indigo-100/50">
            <Clock size={14} className="text-brand-primary" />
            {recipe.prepTime + recipe.cookTime} phút
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-indigo-50 flex items-center justify-between flex-wrap gap-4">
          {/* Reaction stats */}
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer group/stat">
              <Heart size={18} className="group-hover/stat:fill-red-500" />
              <span className="text-xs font-black">
                {recipe.reviews?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-pointer group/stat">
              <MessageCircle
                size={18}
                className="group-hover/stat:fill-brand-primary"
              />
              <span className="text-xs font-black">0</span>
            </div>
          </div>

          {/* Group buttons */}
          <div className="flex gap-2 items-center w-full justify-between">
            <button
              onClick={() => handleQuickView()}
              className="text-xs font-black bg-indigo-50 text-brand-primary px-4 py-2.5 rounded-2xl hover:bg-brand-primary hover:text-white transition-all duration-300"
            >
              Chi tiết
            </button>

            <button
              onClick={() => handleShare(recipe.id)}
              className="text-xs font-black bg-indigo-50 text-brand-primary px-4 py-2.5 rounded-2xl hover:bg-brand-primary hover:text-white transition-all duration-300"
            >
              <Copy size={18} />
            </button>

            {/* Quản lý */}
            {isMyRecipesPage && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toggleVisibility({
                      id: recipe.id,
                      isPublic: !recipe.isPublic,
                    })
                  }
                  className={`p-2.5 rounded-2xl transition-all duration-300 border ${
                    recipe.isPublic
                      ? "bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-500 hover:text-white"
                      : "bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary hover:text-white"
                  }`}
                >
                  {recipe.isPublic ? (
                    <Eye size={18} />
                  ) : (
                    <EyeClosed size={18} />
                  )}
                </button>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className="p-2.5 bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <Trash size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
