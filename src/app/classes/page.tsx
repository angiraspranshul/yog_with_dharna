import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { prisma } from "../../lib/db";

const fallbackClasses = [
  {
    id: "1",
    title: "Vinyasa Flow",
    description: "A dynamic and fluid practice connecting breath to movement. Flow through creative sequences designed to build full-body strength, active flexibility, and calm mindfulness.",
    duration: 60,
    level: "All Levels",
    price: 500,
    imageUrl: null
  },
  {
    id: "2",
    title: "Hatha Alignment & Strength",
    description: "A slower-paced session focused on foundational poses, physical alignment, and deep breathing techniques. Excellent for beginners and seasoned yogis looking to refine their practice.",
    duration: 75,
    level: "Beginner",
    price: 600,
    imageUrl: null
  },
  {
    id: "3",
    title: "Restorative & Yin Yoga",
    description: "Calm your nervous system and release deep-seated physical and mental tension. Passive floor poses are held for 3–5 minutes to target deep connective tissues and induce deep relaxation.",
    duration: 60,
    level: "Beginner",
    price: 550,
    imageUrl: null
  },
  {
    id: "4",
    title: "Power Yoga Cardio",
    description: "A high-energy, vigorous flow that combines traditional yoga asanas with core-strengthening intervals and high-intensity moves. Be ready to build stamina, sweat, and feel energized!",
    duration: 60,
    level: "Intermediate",
    price: 600,
    imageUrl: null
  },
  {
    id: "5",
    title: "Pranayama & Meditation",
    description: "A dedicated sanctuary session focusing on ancient breath control techniques (Pranayama) followed by guided meditation. Designed to calm mental chatter, improve focus, and relieve anxiety.",
    duration: 45,
    level: "Beginner",
    price: 400,
    imageUrl: null
  },
  {
    id: "6",
    title: "Ashtanga Primary Series Intro",
    description: "A structured, physically demanding practice based on the traditional Ashtanga primary series. Synchronize breath, locks (bandhas), and gaze (drishti) for an intense moving meditation.",
    duration: 90,
    level: "Advanced",
    price: 700,
    imageUrl: null
  }
];

export const revalidate = 60;

export default async function ClassesPage() {
  let classes = [];
  let dbError = false;

  try {
    classes = await prisma.class.findMany();
  } catch (error) {
    console.error("Database connection fallback active on classes page:", error);
    dbError = true;
  }

  const displayClasses = classes.length > 0 ? classes : fallbackClasses;

  return (
    <>
      <Header />
      
      {/* Header Banner */}
      <section className="bg-stone-50/50 dark:bg-stone-950/20 py-20 border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Our Yoga Directory
          </h1>
          <p className="text-muted text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Find the practice that perfectly aligns with your energy, physical framework, and mental targets. Book live cloud classes instantly.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayClasses.map((c) => (
            <div 
              key={c.id} 
              className="glass-effect rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full group hover:-translate-y-1"
            >
              {/* Visual Card Header */}
              <div className="h-48 w-full bg-stone-100 dark:bg-stone-900 relative overflow-hidden flex items-center justify-center border-b border-border">
                <span className="text-7xl opacity-20 filter grayscale group-hover:scale-105 transition-transform duration-500">🧘‍♀️</span>
                <div className="absolute top-4 right-4 bg-gold/10 text-gold px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-gold/20">
                  {c.level}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1 gap-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-gold transition-colors">
                  {c.title}
                </h2>
                <p className="text-muted text-sm sm:text-base leading-relaxed line-clamp-4">
                  {c.description}
                </p>
                
                {/* Meta details */}
                <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted/80 uppercase tracking-widest font-semibold">Duration</span>
                    <span className="text-stone-900 dark:text-stone-100 font-semibold text-sm">{c.duration} mins</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-muted/80 uppercase tracking-widest font-semibold">Price</span>
                    <span className="gold-gradient-text font-bold text-base sm:text-lg">₹{c.price}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-8 pb-8 pt-2">
                <Link 
                  href={`/book?class=${c.id}`} 
                  className="block w-full py-4 text-center rounded-2xl gold-gradient-bg text-white hover:shadow-md transition-all duration-300 font-semibold text-sm transform hover:-translate-y-0.5"
                >
                  Book Class Session
                </Link>
              </div>
            </div>
          ))}
        </div>

        {dbError && (
          <div className="mt-8 text-center text-xs text-muted/55">
            💡 Previewing mock classes (remote Supabase database credentials not yet loaded).
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
