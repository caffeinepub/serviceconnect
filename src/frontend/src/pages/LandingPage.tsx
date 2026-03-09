import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Clock,
  Search,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";
import { allCategories, categoryMeta } from "../utils/serviceUtils";

const howItWorks = [
  {
    step: "01",
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Register Your Skills",
    description:
      "Fill out a simple form with your professional details, experience, and availability. Takes less than 5 minutes.",
  },
  {
    step: "02",
    icon: <Shield className="w-6 h-6" />,
    title: "Get Verified & Approved",
    description:
      "Our team reviews your application to ensure quality and trustworthiness for the community.",
  },
  {
    step: "03",
    icon: <Search className="w-6 h-6" />,
    title: "Get Found by Clients",
    description:
      "Your profile becomes visible to people in your area searching for your specific skills.",
  },
];

const stats = [
  {
    value: "500+",
    label: "Registered Providers",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: "4.9★",
    label: "Average Rating",
    icon: <Star className="w-4 h-4" />,
  },
  {
    value: "24h",
    label: "Avg. Response Time",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    value: "8",
    label: "Service Categories",
    icon: <CheckCircle className="w-4 h-4" />,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/browse", search: { search: searchQuery } });
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative overflow-hidden gradient-hero min-h-[88vh] flex items-center">
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-serviceconnect.dim_1200x600.jpg"
            alt="ServiceConnect professionals network"
            className="w-full h-full object-cover opacity-20"
            loading="eager"
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.9 0 0 / 0.15) 1px, transparent 1px), linear-gradient(to right, oklch(0.9 0 0 / 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-24">
          <motion.div
            className="max-w-3xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Connecting communities with skilled professionals
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
            >
              Find Trusted{" "}
              <span
                className="relative"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.9 0.14 85) 0%, oklch(0.75 0.16 70) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Professionals
              </span>{" "}
              Near You
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-white/75 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            >
              ServiceConnect bridges the gap between skilled service providers
              and the people who need them — from nurses and electricians to
              plumbers and carpenters.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              <Link to="/browse">
                <Button
                  size="lg"
                  className="gap-2 text-base font-semibold shadow-primary-glow"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.12 75), oklch(0.68 0.14 65))",
                    color: "oklch(0.18 0.04 55)",
                    border: "none",
                  }}
                >
                  <Search className="w-4 h-4" />
                  Find a Service Provider
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base font-semibold text-white border-white/30 bg-white/10 hover:bg-white/20 hover:text-white"
                >
                  <ClipboardList className="w-4 h-4" />
                  Register as a Provider
                </Button>
              </Link>
            </motion.div>

            {/* ── Hero Search Bar ─────────────────── */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSearch}
              className="mt-8 w-full max-w-xl"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-white/50 pointer-events-none" />
                <Input
                  data-ocid="hero.search_input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="How can I help you today?"
                  className="pl-12 pr-32 h-14 text-base rounded-2xl bg-white/10 border-white/25 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/50 focus-visible:ring-1 focus-visible:ring-white/40 transition-all backdrop-blur-sm"
                />
                <Button
                  data-ocid="hero.search_button"
                  type="submit"
                  size="sm"
                  className="absolute right-2 h-10 px-5 rounded-xl font-semibold text-sm gap-1.5"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.12 75), oklch(0.68 0.14 65))",
                    color: "oklch(0.18 0.04 55)",
                    border: "none",
                  }}
                >
                  Search
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.form>
          </motion.div>
        </div>

        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
            role="presentation"
          >
            <title>Decorative wave</title>
            <path
              d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z"
              fill="oklch(0.97 0.008 95)"
            />
          </svg>
        </div>
      </section>

      {/* ── Stats ────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-6 rounded-2xl bg-card border border-border/60 shadow-card"
              >
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2">
                  {stat.icon}
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
                <div className="font-display text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Service Categories ───────────────── */}
      <section className="py-20 gradient-section">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Services We Connect
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From emergency plumbing to in-home nursing care — find or offer
              the professional service you need.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {allCategories.map((cat) => {
              const meta = categoryMeta[cat];
              return (
                <motion.div key={cat} variants={itemVariants}>
                  <Link to="/browse" search={{ category: cat }}>
                    <div
                      className={`group p-5 rounded-2xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer hover:-translate-y-1 ${meta.borderClass}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${meta.bgClass} flex items-center justify-center text-2xl mb-3`}
                      >
                        {meta.icon}
                      </div>
                      <h3
                        className={`font-display font-semibold text-sm ${meta.colorClass}`}
                      >
                        {meta.label}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
                        {meta.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Getting started as a service provider is simple and
              straightforward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {/* Connector line */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}

                <div className="relative z-10 text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                    {step.icon}
                  </div>
                  <div className="font-display text-xs font-bold text-primary/60 tracking-widest mb-2 uppercase">
                    Step {step.step}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/register">
              <Button
                size="lg"
                className="gap-2 font-semibold shadow-primary-glow"
              >
                Start Your Registration
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="rounded-3xl gradient-hero relative overflow-hidden p-12 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, oklch(0.9 0.1 85 / 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 50%, oklch(0.6 0.1 195 / 0.5) 0%, transparent 50%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to grow your business?
              </h2>
              <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">
                Join hundreds of professionals already connecting with clients
                in their communities.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="gap-2 font-semibold"
                    style={{
                      background: "oklch(0.78 0.12 75)",
                      color: "oklch(0.18 0.04 55)",
                      border: "none",
                    }}
                  >
                    Register Now — It's Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 font-semibold text-white border-white/30 bg-white/10 hover:bg-white/20 hover:text-white"
                  >
                    Browse Providers
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
