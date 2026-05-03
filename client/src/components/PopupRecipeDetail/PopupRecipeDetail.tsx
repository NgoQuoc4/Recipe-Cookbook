import { useEffect, useState } from "react";
import { Loader2, Plus, SquarePen, X } from "lucide-react";
import { useRecipeDetails } from "../../hook/useRecipeDetails";
import LoadingView from "../LoadingView/LoadingView";
import { usePopup } from "../../context/PopupContext";

interface DetailRecipeProps {
  onClose: () => void;
  manualId?: string;
}

export default function PopupRecipeDetail({
  onClose,
  manualId,
}: DetailRecipeProps) {
  //popup
  //   const { isOpen, activeRecipeId, openPopup, closePopup } = usePopup();

  const { recipe, loading, UNIT_LABELS, handleBack, navigate } =
    useRecipeDetails(manualId);

  if (loading) return <LoadingView />;
  if (!recipe) return null;

  const { title, ingredients, steps } = recipe;

  //   Xử lý hiển thị nguyên liệu
  const ingredientsList = ingredients
    ? ingredients.map((ing: any) => {
        const name = ing.ingredient.name;
        const quantity = ing.quantity;
        const unitLabel = UNIT_LABELS[ing.unit] || ing.unit;
        // Nếu là công thức từ AI (Quantity = 1, Unit = PCS) thì thường tên đã bao gồm số lượng
        // Ví dụ: "200g bột mì" -> chỉ hiện "200g bột mì" thay vì "200g bột mì (1 phần)"
        if (quantity === "1" && ing.unit === "PCS") {
          return name;
        }

        return `${name} (${quantity} ${unitLabel})`;
      })
    : [];

  console.log("ingredientsList", ingredientsList);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-indigo-950/20 backdrop-blur-xl animate-in fade-in duration-300">
      <div
        className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white border border-indigo-100 rounded-2xl shadow-2xl p-8 md:p-16 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-2xl transition-all z-20"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-brand-primary uppercase tracking-[0.3em]">
                Chi tiết món ăn
              </label>
              <h3 className="text-4xl md:text-6xl font-black text-[#1e1b4b] leading-tight tracking-tighter italic">
                {title}
              </h3>
            </div>

            {/* {handleSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 bg-brand-primary hover:bg-violet-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-violet-500/30 transition-all active:scale-95 disabled:bg-slate-300"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus size={24} strokeWidth={3} />
                )}
                {isSaving ? "Đang lưu..." : "Lưu vào sổ tay"}
              </button>
            )} */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Ingredients */}
            <div className="bg-indigo-50/30 p-10 rounded-2xl border border-indigo-100/50">
              <h4 className="text-xl font-black text-[#1e1b4b] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-brand-primary rounded-2xl" />
                Nguyên liệu
              </h4>
              <ul className="space-y-5">
                {ingredientsList.length > 0 ? (
                  ingredientsList.map((ing: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-4 text-slate-600 text-lg font-medium group"
                    >
                      <div className="w-2.5 h-2.5 rounded-2xl bg-brand-primary/20 group-hover:bg-brand-primary transition-colors shrink-0" />
                      {ing}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">
                    Không có thông tin nguyên liệu
                  </li>
                )}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-xl font-black text-[#1e1b4b] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-brand-primary rounded-2xl" />
                Các bước thực hiện
              </h4>
              <ol className="space-y-8">
                {steps?.map((step: string, index: number) => (
                  <li
                    key={index}
                    className="flex gap-6 text-slate-600 leading-relaxed text-lg group"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-brand-primary font-black shrink-0 border border-indigo-100 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                      {index + 1}
                    </span>
                    <p className="font-medium pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
