import prisma from './src/lib/prisma.js';

async function main() {
  const users = await prisma.user.count();
  const recipes = await prisma.recipe.count();
  const lastRecipes = await prisma.recipe.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      isPublic: true,
      createdAt: true
    }
  });

  console.log('--- Database Stats ---');
  console.log(`Total Users: ${users}`);
  console.log(`Total Recipes: ${recipes}`);
  console.log('\n--- Recent Recipes ---');
  console.table(lastRecipes);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
