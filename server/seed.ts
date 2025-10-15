import { db } from "./db";
import { drivers } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const driverData = [
    { name: "Mohammed Ali", phone: "+971 50 123 4567", isActive: true },
    { name: "Khalid Hassan", phone: "+971 55 987 6543", isActive: true },
    { name: "Ahmed Nasser", phone: "+971 52 456 7890", isActive: true },
    { name: "Omar Rashid", phone: "+971 56 789 0123", isActive: true },
  ];

  for (const driver of driverData) {
    try {
      await db.insert(drivers).values(driver).onConflictDoNothing();
      console.log(`✓ Created driver: ${driver.name}`);
    } catch (error) {
      console.log(`- Driver ${driver.name} already exists`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
