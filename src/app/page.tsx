import SkillCard from "@/components/ui/SkillCard";
import Link from "next/link";

export default function Home() {
  const stats = [
    { value: "10,000+", label: "Active Learners" },
    { value: "500+", label: "Practice Tests" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Available" },
  ];

  const features = [
    {
      icon: "🎯",
      title: "Real Exam Simulation",
      description:
        "Experience authentic VSTEP test conditions with timed mock exams that mirror the actual test format.",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and personalized performance insights.",
    },
    {
      icon: "🎧",
      title: "4 Skills Practice",
      description:
        "Master Listening, Reading, Writing, and Speaking with specialized practice modules.",
    },
    {
      icon: "⚡",
      title: "Instant Feedback",
      description:
        "Get immediate scoring and explanations to understand your mistakes and improve faster.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-indigo-500/10 via-transparent to-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-indigo-400 text-sm font-medium">
                Trusted by 10,000+ learners
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Master </span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VSTEP
              </span>
              <br />
              <span className="text-white">With Confidence</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              The most comprehensive platform for Vietnamese Standardized Test
              of English Proficiency preparation. Practice all 4 skills and
              achieve your target level.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
              >
                Start Free Practice
              </Link>
              <Link
                href="/practice"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-slate-700 text-white font-semibold text-lg hover:bg-white/5 hover:border-slate-600 transition-all duration-300"
              >
                Explore Tests
              </Link>
            </div>

            {/* Level Badges */}
            <div className="flex items-center justify-center gap-4 mt-10">
              {["B1", "B2", "C1"].map((level) => (
                <div
                  key={level}
                  className="px-6 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 font-medium"
                >
                  Level {level}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Master All 4 Skills
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Practice each skill separately or take a full mock exam. Our
              comprehensive modules cover everything you need for VSTEP success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard skill="listening" />
            <SkillCard skill="reading" />
            <SkillCard skill="writing" />
            <SkillCard skill="speaking" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose VSTEP Master?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to prepare for your VSTEP examination in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 sm:p-12 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Ace Your VSTEP?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of successful learners who achieved their target
                VSTEP level with our platform.
              </p>
              <Link
                href="/auth/register"
                className="inline-block px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold text-lg hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Start Your Journey Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
