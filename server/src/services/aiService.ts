import { loadEnv } from "../lib/env.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
loadEnv(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface SuggestionResponse {
  name: string;
  additionalIngredients: string[];
  steps: string[];
}

export const suggestRecipe = async (
  ingredients: string[],
): Promise<SuggestionResponse> => {
  console.log("🚀 Đang gọi Gemini AI với Key:", process.env.GEMINI_API_KEY?.substring(0, 7) + "...");
  
  const modelsToTry = [
    "gemini-flash-latest", // Bản Flash ổn định nhất
    "gemini-pro-latest", // Bản Pro ổn định nhất
    "gemini-1.5-flash-8b", // Bản siêu tiết kiệm
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`📡 [AI] Đang thử sử dụng model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `
        Bạn là một chuyên gia đầu bếp. 
        Tôi có các nguyên liệu sau: ${ingredients.join(", ")}.
        Hãy gợi ý cho tôi 1 món ăn ngon nhất có thể nấu từ các nguyên liệu này.
        
        Yêu cầu bắt buộc:
        - Trả về kết quả ĐỘC NHẤT dưới dạng JSON.
        - Cấu trúc JSON: { "name": "...", "additionalIngredients": ["..."], "steps": ["..."] }
        - Ngôn ngữ: Tiếng Việt.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`✅ [AI] Thành công với model ${modelName}!`);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI trả về kết quả không đúng format");
      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.warn(`⚠️ [AI] Model ${modelName} thất bại:`, error.message);
      // Nếu là lỗi 404, tiếp tục thử model khác trong vòng lặp
      if (error.status === 404 || error.message.includes("404")) {
        continue;
      }
      // Nếu là lỗi khác (như hết hạn mức), dừng lại và dùng Fallback
      break;
    }
  }

  // Fallback: Khi tất cả model đều thất bại
  console.warn("⚠️ [AI] Đang dùng dữ liệu mẫu (Fallback)...");
  return {
    name: "Thịt kho tàu (Dữ liệu mẫu)",
    additionalIngredients: ["Trứng cút", "Nước dừa", "Hành tím"],
    steps: [
      "Ướp thịt với mắm, đường, tiêu trong 30 phút",
      "Thắng nước màu rồi cho thịt vào xào săn",
      "Đổ nước dừa ngập thịt, đun sôi rồi cho trứng cút vào hầm nhỏ lửa",
    ],
  };
};
