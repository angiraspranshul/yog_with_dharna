const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const classesToSeed = [
  {
    title: "Vinyasa Flow",
    description: "A dynamic and fluid practice connecting breath to movement. Flow through creative sequences designed to build full-body strength, active flexibility, and calm mindfulness.",
    duration: 60,
    level: "All Levels",
    price: 500,
    imageUrl: "/images/vinyasa.jpg"
  },
  {
    title: "Hatha Alignment & Strength",
    description: "A slower-paced session focused on foundational poses, physical alignment, and deep breathing techniques. Excellent for beginners and seasoned yogis looking to refine their practice.",
    duration: 75,
    level: "Beginner",
    price: 600,
    imageUrl: "/images/hatha.jpg"
  },
  {
    title: "Restorative & Yin Yoga",
    description: "Calm your nervous system and release deep-seated physical and mental tension. Passive floor poses are held for 3–5 minutes to target deep connective tissues and induce deep relaxation.",
    duration: 60,
    level: "Beginner",
    price: 550,
    imageUrl: "/images/yin.jpg"
  },
  {
    title: "Power Yoga Cardio",
    description: "A high-energy, vigorous flow that combines traditional yoga asanas with core-strengthening intervals and high-intensity moves. Be ready to build stamina, sweat, and feel energized!",
    duration: 60,
    level: "Intermediate",
    price: 600,
    imageUrl: "/images/power.jpg"
  },
  {
    title: "Pranayama & Meditation",
    description: "A dedicated sanctuary session focusing on ancient breath control techniques (Pranayama) followed by guided meditation. Designed to calm mental chatter, improve focus, and relieve anxiety.",
    duration: 45,
    level: "Beginner",
    price: 400,
    imageUrl: "/images/meditation.jpg"
  },
  {
    title: "Ashtanga Primary Series Intro",
    description: "A structured, physically demanding practice based on the traditional Ashtanga primary series. Synchronize breath, locks (bandhas), and gaze (drishti) for an intense moving meditation.",
    duration: 90,
    level: "Advanced",
    price: 700,
    imageUrl: "/images/ashtanga.jpg"
  }
];

async function main() {
  console.log("🌱 Starting database seeding...");
  
  // Clean existing classes (cascading deletes will clean slots/bookings)
  await prisma.class.deleteMany();
  console.log("🗑️ Cleaned up existing classes.");

  for (const c of classesToSeed) {
    const createdClass = await prisma.class.create({
      data: c
    });
    console.log(`✅ Seeded class: "${createdClass.title}" (${createdClass.level})`);
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
