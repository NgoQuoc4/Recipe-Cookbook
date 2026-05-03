import { ChefHat } from "lucide-react";

export default function NotFoundView({
  handleBack,
}: {
  handleBack: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <ChefHat size={48} />
      </div>
      <h2 className="text-3xl font-black text-indigo-900 mb-2">
        Oops! Không tìm thấy món ăn
      </h2>
      <p className="text-slate-500 mb-8">
        Có vẻ như món ăn này đã bị "cuốn đi" hoặc ID không chính xác.
      </p>
      <button
        onClick={() => handleBack()}
        className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-violet-500/20 transition-all"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
