import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { prisma } from "../lib/db";

// Fallback seeded classes if database is empty or not yet migrated
const fallbackClasses = [
  {
    id: "1",
    title: "Vinyasa Flow",
    description: "A dynamic and fluid practice connecting breath to movement. Flow through creative sequences designed to build full-body strength, active flexibility, and calm mindfulness.",
    duration: 60,
    level: "All Levels",
    price: 500,
  },
  {
    id: "2",
    title: "Hatha Alignment & Strength",
    description: "A slower-paced session focused on foundational poses, physical alignment, and deep breathing techniques. Excellent for beginners and seasoned yogis looking to refine their practice.",
    duration: 75,
    level: "Beginner",
    price: 600,
  },
  {
    id: "3",
    title: "Restorative & Yin Yoga",
    description: "Calm your nervous system and release deep-seated physical and mental tension. Passive floor poses are held for 3–5 minutes to target deep connective tissues and induce deep relaxation.",
    duration: 60,
    level: "Beginner",
    price: 550,
  }
];

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  let classes: any[] = [];
  let dbError = false;

  try {
    classes = await prisma.class.findMany({
      take: 3
    });
  } catch (error) {
    console.error("Database connection fallback active:", error);
    dbError = true;
  }

  // Use seeded fallback if database is empty or has error
  const displayClasses = classes.length > 0 ? classes : fallbackClasses;

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pb-32 lg:pt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold font-medium text-xs tracking-wider uppercase w-fit">
              <span className="w-1.5 h-1.5 rounded-full gold-gradient-bg animate-ping"></span>
              Live & Personalized Yoga Sessions
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-stone-900 dark:text-stone-50">
              Nurture your soul. <br />
              Strengthen your <span className="gold-gradient-text">Inner Self</span>.
            </h1>
            
            <p className="text-muted text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
              Embark on a dynamic journey of self-discovery, breathing techniques, and somatic movement with instructor <span className="text-stone-900 dark:text-stone-100 font-semibold">Dhaarna</span>. Balanced, tailored paths for all experience levels.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 font-semibold text-sm sm:text-base">
              <Link 
                href="/book" 
                className="px-8 py-4 rounded-full gold-gradient-bg text-white hover:shadow-lg transition-all duration-300 text-center transform hover:-translate-y-0.5"
              >
                Book Your Free First Class
              </Link>
              <Link 
                href="/classes" 
                className="px-8 py-4 rounded-full border border-border/80 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 text-center"
              >
                Explore Classes
              </Link>
            </div>
          </div>

          {/* Right Visual Artifact */}
          <div className="lg:col-span-5 flex justify-center items-center relative animate-float">
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-gold/20 flex items-center justify-center p-6 bg-gold/[0.02]">
              <div className="w-full h-full rounded-full border border-gold/40 flex items-center justify-center p-8 bg-gold/[0.04] shadow-inner">
                <div className="w-full h-full rounded-full gold-gradient-bg flex items-center justify-center text-white text-7xl sm:text-8xl md:text-9xl font-serif font-bold shadow-lg">
                  ॐ
                </div>
              </div>
            </div>
            {/* Soft backdrop blur decoration */}
            <div className="absolute w-64 h-64 bg-gold/10 blur-3xl -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Philosophy / Values Section */}
      <section className="bg-stone-50/50 dark:bg-stone-950/20 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Why Practice with Dhaarna?
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              Achieve deep harmony through mindful somatic integration, dynamic alignment, and deep nervous system recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Feature 1 */}
            <div className="glass-effect rounded-3xl p-8 hover:shadow-md transition-all duration-300 border border-border group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center text-white mb-6">
                🧘‍♂️
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-stone-900 dark:text-stone-50 group-hover:text-gold transition-colors">
                Personalized Alignment
              </h3>
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                Every body is unique. Dhaarna designs specialized guidance structures and adjustments to respect your physical framework and capabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect rounded-3xl p-8 hover:shadow-md transition-all duration-300 border border-border group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center text-white mb-6">
                💨
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-stone-900 dark:text-stone-50 group-hover:text-gold transition-colors">
                Pranayama & Integration
              </h3>
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                Connect your energy path. Incorporate deep rhythmic breath control that expands cognitive lung capacity, clears brain fog, and dissolves anxiety.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect rounded-3xl p-8 hover:shadow-md transition-all duration-300 border border-border group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center text-white mb-6">
                🌱
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-stone-900 dark:text-stone-50 group-hover:text-gold transition-colors">
                Holistic Lifestyle
              </h3>
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                Bridge the mat with daily reality. Gain dynamic recovery advice, postural patterns, and mindful breathing practices you can take anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Database Classes Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col gap-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Featured Yoga Classes
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-lg">
                Explore classes designed to fit your unique schedule and targets. Book in seconds and join remotely.
              </p>
            </div>
            <Link 
              href="/classes" 
              className="text-gold hover:text-gold-hover font-semibold text-sm sm:text-base flex items-center gap-2 group tracking-wide uppercase shrink-0"
            >
              See All Classes 
              <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayClasses.map((c: any) => (
              <div 
                key={c.id} 
                className="glass-effect rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full group hover:-translate-y-1"
              >
                {/* Visual card placeholder top */}
                <div className="h-44 w-full bg-stone-100 dark:bg-stone-900 relative overflow-hidden flex items-center justify-center border-b border-border">
                  <span className="text-6xl opacity-20 filter grayscale group-hover:scale-105 transition-transform duration-500">🧘‍♀️</span>
                  <div className="absolute top-4 right-4 bg-gold/10 text-gold px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-gold/20">
                    {c.level}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1 gap-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-gold transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-muted text-sm sm:text-base leading-relaxed line-clamp-3">
                    {c.description}
                  </p>
                  
                  {/* Class Meta */}
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

                <div className="px-8 pb-8 pt-2">
                  <Link 
                    href={`/book?class=${c.id}`} 
                    className="block w-full py-3.5 text-center rounded-2xl gold-gradient-bg text-white hover:shadow-md transition-all duration-300 font-semibold text-sm transform hover:-translate-y-0.5"
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-50/50 dark:bg-stone-950/20 py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-16 text-stone-900 dark:text-stone-100">
            What Practitioners Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-effect rounded-3xl p-8 border border-border text-left relative">
              <span className="absolute top-4 right-8 font-serif text-6xl text-gold/20 select-none">“</span>
              <p className="text-muted text-sm sm:text-base leading-relaxed italic mb-6">
                "Practicing with Dhaarna has completely shifted my mindset towards structural core alignment. I used to suffer from severe lower back discomfort, but her tailored adjustments and steady Vinyasa sequences have restored my spinal flexibility entirely."
              </p>
              <div className="font-serif font-bold text-stone-950 dark:text-stone-50">— Priya M., Bangalore</div>
            </div>

            <div className="glass-effect rounded-3xl p-8 border border-border text-left relative">
              <span className="absolute top-4 right-8 font-serif text-6xl text-gold/20 select-none">“</span>
              <p className="text-muted text-sm sm:text-base leading-relaxed italic mb-6">
                "Dhaarna's Pranayama and meditation flows are like hitting a deep mental reset button. After a stressful 60-hour work week, her Sunday Restorative sessions completely melt my anxiety. Highly recommend her live slots!"
              </p>
              <div className="font-serif font-bold text-stone-950 dark:text-stone-50">— Rahul K., Mumbai</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking CTA */}
      <section className="py-24 relative overflow-hidden bg-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col gap-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Ready to Begin Your <span className="gold-gradient-text">Yoga Path</span>?
          </h2>
          <p className="text-stone-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Reserve your dynamic Hatha flow or calming Pranayama slot in under 60 seconds. Manage your schedule directly in the cloud.
          </p>
          <div className="mt-4">
            <Link 
              href="/book" 
              className="inline-block px-10 py-4 rounded-full gold-gradient-bg text-white hover:shadow-lg transition-all duration-300 font-semibold text-base transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
            >
              Reserve Your Slot Now
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(194,149,71,0.08)_0%,transparent_70%)]"></div>
      </section>

      <Footer />
    </>
  );
}
