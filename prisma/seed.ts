// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { addDays, subMonths, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1️⃣ Get existing users (you might already have them)
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("❌ No users found. Please create users first.");
    return;
  }

  // 2️⃣ Create 10 products
  await prisma.product.createMany({
    data: [
      { name: "Laptop Pro 14", category: "Electronics", price: 1200 },
      { name: "Wireless Earbuds", category: "Electronics", price: 150 },
      { name: "Smart Watch", category: "Accessories", price: 180 },
      { name: "Office Chair", category: "Furniture", price: 230 },
      { name: "Standing Desk", category: "Furniture", price: 400 },
      { name: "LED Desk Lamp", category: "Lighting", price: 45 },
      { name: "Espresso Machine", category: "Appliances", price: 350 },
      { name: "Air Purifier", category: "Appliances", price: 200 },
      { name: "Bluetooth Speaker", category: "Electronics", price: 90 },
      { name: "Mechanical Keyboard", category: "Accessories", price: 120 },
    ],
  });

  console.log("✅ 10 products created");

  // 3️⃣ Fetch them back for relationships
  const allProducts = await prisma.product.findMany();

  const startOfThisMonth = startOfMonth(new Date());
  const startOfLastMonth = subMonths(startOfThisMonth, 1);

  // 4️⃣ Create 100 random sales
  const salesData = Array.from({ length: 100 }).map(() => {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = allProducts[Math.floor(Math.random() * allProducts.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const saleDate =
      Math.random() > 0.5
        ? addDays(startOfThisMonth, Math.floor(Math.random() * 15)) // this month
        : addDays(startOfLastMonth, Math.floor(Math.random() * 30)); // last month

    return {
      userId: user.id,
      productId: product.id,
      quantity,
      totalAmount: quantity * product.price,
      saleDate,
    };
  });

  await prisma.sale.createMany({ data: salesData });
  console.log("✅ 100 sales created");
}

main()
  .then(async () => {
    console.log("🌱 Seed complete!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
