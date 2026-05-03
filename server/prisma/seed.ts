import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("🌱 Đang bắt đầu nạp dữ liệu mẫu...");

  const categories = [
    { name: "Món Á" },
    { name: "Món Âu" },
    { name: "Món Chay" },
    { name: "Tráng miệng" },
    { name: "Đồ uống" },
    { name: "Món Khai vị" },
    { name: "Món Chính" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: "" }, // Dummy where for upsert with name check if needed, but we use create logic here
      update: {},
      create: category,
    });
  }

  // Cách an toàn hơn để tránh trùng lặp nếu dùng name làm chuẩn:
  // Vì trong schema hiện tại Category chưa có @unique cho name,
  // tôi sẽ check tay trước khi tạo để tránh tạo trùng khi chạy seed nhiều lần.

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name },
    });

    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`✅ Đã tạo danh mục: ${cat.name}`);
    } else {
      console.log(`⏩ Danh mục đã tồn tại: ${cat.name}`);
    }
  }
  console.log("✨ Hoàn tất nạp dữ liệu mẫu!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
