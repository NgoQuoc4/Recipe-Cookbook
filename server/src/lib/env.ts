import fs from "fs";
import path from "path";

export function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    
    envContent.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const firstPart = parts[0];
        if (firstPart) {
          const key = firstPart.trim();
          const value = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    });
    console.log("🛠️  [Env] Đã nạp biến môi trường thủ công thành công!");
  } catch (error) {
    console.error("❌ [Env] Lỗi khi nạp file .env:", error);
  }
}
