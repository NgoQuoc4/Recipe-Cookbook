import { Loader2 } from "lucide-react";

export default function LoadingView() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-indigo-50/30">
      <Loader2 className="animate-spin text-brand-primary mb-4" size={48} />
      <p className="text-indigo-900 font-black animate-pulse">
        Đang chuẩn bị nguyên liệu...
      </p>
    </div>
  );
}
