import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PawPrint,
  Sparkles,
  Menu,
  X,
  Truck,
  Shield,
  Leaf,
  Check,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

/**
 * PawBox UK – Full site (EN-UK version)
 * - All UI text translated to English (UK tone)
 * - Keeps sections: Header, Hero, Plans, Why, Personalise, Testimonials, About, Footer
 * - Soft animal background images via BgSoft (low opacity + blur)
 * - Dog/cat images with graceful fallbacks (Unsplash/Pexels/placeholder)
 * - Safe Stripe env access (doesn’t crash if key missing)
 * - Light self-tests (console.assert) in dev only
 */

// ---- Design tokens ----
const PALETTE = {
  ink: "#111827",
  text: "#374151",
  subtle: "#6B7280",
  border: "#E5E7EB",
  surface: "#FFFFFF",
  cream: "#FAF7F2",
  accent: "#D4A017",
};

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-300";

const cx = (...a) => a.filter(Boolean).join(" ");

// ---- Safe env (works in Vite & sandbox) ----
function getEnv(key, fallback = undefined) {
  const viteVal =
    typeof import.meta !== "undefined" ? import.meta?.env?.[key] : undefined;
  const nodeVal =
    typeof process !== "undefined" ? process?.env?.[key] : undefined;
  return viteVal ?? nodeVal ?? fallback;
}

// ---- Data ----
const plans = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Everyday starter",
    features: ["Natural treat", "Simple toy", "Monthly tips"],
    pricing: { small: 21.99, medium: 24.99, large: 27.99 },
  },
  {
    id: "essential",
    name: "Essential",
    tagline: "Balanced nutrition & play",
    features: ["Tailored recipes", "2 healthy treats", "Durable toy"],
    pricing: { small: 32.99, medium: 36.99, large: 39.99 },
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Complete experience",
    features: ["Premium selection", "2 toys + accessory", "Surprise gift"],
    pricing: { small: 49.99, medium: 54.99, large: 59.99 },
  },
];

const STRIPE_PUBLISHABLE_KEY = getEnv(
  "VITE_STRIPE_PUBLISHABLE_KEY",
  "pk_test_replace_me"
);
const PRICE_IDS = {
  basic_small: "price_basic_small_replace",
  basic_medium: "price_basic_medium_replace",
  basic_large: "price_basic_large_replace",
  essential_small: "price_essential_small_replace",
  essential_medium: "price_essential_medium_replace",
  essential_large: "price_essential_large_replace",
  premium_small: "price_premium_small_replace",
  premium_medium: "price_premium_medium_replace",
  premium_large: "price_premium_large_replace",
};

async function handleCheckout(planId, weightKey) {
  const priceId = PRICE_IDS[`${planId}_${weightKey}`];
  const isPlaceholder =
    !STRIPE_PUBLISHABLE_KEY ||
    STRIPE_PUBLISHABLE_KEY === "pk_test_replace_me";
  if (isPlaceholder || !priceId) {
    alert(
      "Demo: configure VITE_STRIPE_PUBLISHABLE_KEY and PRICE_IDS to enable checkout."
    );
    return;
  }
  const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    successUrl: `${window.location.origin}?status=success`,
    cancelUrl: `${window.location.origin}?status=cancel`,
  });
  if (error) alert(error.message);
}

// ---- Motion ----
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function App() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
      <Header />
      <main>
        <Hero />
        <Plans />
        <Why />
        <Personalise />
        <Testimonials />
        <About />
      </main>
      <Footer />
    </div>
  );
}

// -------------------------------- Header
function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { href: "#plans", label: "Plans" },
    { href: "#why", label: "Why us" },
    { href: "#personalise", label: "Personalise" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b"
      style={{ borderColor: PALETTE.border }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className={cx("flex items-center gap-2", RING)}>
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: PALETTE.accent, color: "white" }}
          >
            <PawPrint className="h-5 w-5" />
          </span>
          <span
            className="font-serif text-xl md:text-2xl tracking-tight"
            style={{ color: PALETTE.ink }}
          >
            PawBox UK
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: PALETTE.text }}>
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-black/80">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#personalise"
            className={cx(
              "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium shadow-sm transition hover:shadow-md",
              RING
            )}
            style={{ background: PALETTE.accent, color: "white" }}
          >
            <Sparkles className="h-4 w-4" /> Get started
          </a>
        </div>

        <button
          className={cx("md:hidden p-2 rounded-lg", RING)}
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: PALETTE.border }}>
          <div className="px-4 py-4 flex flex-col gap-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-1"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#personalise"
              onClick={() => setOpen(false)}
              className={cx(
                "mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium shadow-sm",
                RING
              )}
              style={{ background: PALETTE.accent, color: "white", width: "fit-content" }}
            >
              <Sparkles className="h-4 w-4" /> Get started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// -------------------------------- Hero
function Hero() {
  return (
    <section id="home" className="relative pt-28 md:pt-32">
      <BgSoft
        images={[
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop",
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-10 items-center">
        <motion.div {...fadeUp} className="md:col-span-7">
          <h1
            className="font-serif text-5xl md:text-6xl tracking-tight"
            style={{ color: PALETTE.ink }}
          >
            A <span style={{ color: PALETTE.accent }}>premium</span> monthly box
            for dogs & cats
          </h1>
          <p className="mt-5 leading-relaxed" style={{ color: PALETTE.text }}>
            Healthy treats, quality accessories and little surprises every
            month. Fast UK delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#personalise"
              className={cx(
                "rounded-full px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md transition",
                RING
              )}
              style={{ background: PALETTE.accent, color: "white" }}
            >
              Personalise my box
            </a>
            <a
              href="#plans"
              className={cx(
                "rounded-full px-6 py-3 text-sm font-medium border",
                RING
              )}
              style={{ borderColor: PALETTE.border, color: PALETTE.ink }}
            >
              See plans
            </a>
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="md:col-span-5">
          <div
            className="aspect-[4/3] w-full rounded-3xl overflow-hidden border"
            style={{ borderColor: PALETTE.border }}
          >
            <SafeImg
              srcSet={[
                "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop",
                "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg",
                "https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg",
              ]}
              alt="Relaxed cat"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// -------------------------------- Plans (centred)
function Plans() {
  return (
    <section id="plans" className="relative py-20" style={{ background: PALETTE.cream }}>
      <BgSoft
        images={[
          "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=1200&auto=format&fit=crop",
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl" style={{ color: PALETTE.ink }}>
            Choose your plan
          </h2>
          <p className="mt-3" style={{ color: PALETTE.text }}>
            Three clear tiers, price by pet weight.
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3 place-items-center">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col justify-between items-center text-center bg-white rounded-3xl border shadow-sm p-8 w-full max-w-sm h-full overflow-hidden"
              style={{ borderColor: plan.highlight ? "#FCD34D80" : PALETTE.border }}
            >
              <div>
                <h3 className="font-serif text-2xl mb-1" style={{ color: PALETTE.ink }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: PALETTE.subtle }}>
                  {plan.tagline}
                </p>
                <div className="flex justify-center gap-4 mb-6 w-full flex-wrap">
                  {Object.entries(plan.pricing).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-col items-center justify-center rounded-2xl border px-4 py-3 w-24 h-20"
                      style={{ borderColor: PALETTE.border }}
                      aria-label={`Price for ${k === "small" ? "<10 kg" : k === "medium" ? "10–20 kg" : ">20 kg"}: £${v.toFixed(2)}`}
                    >
                      <div className="text-[11px] mb-1" style={{ color: PALETTE.subtle }}>
                        {k === "small" ? "<10 kg" : k === "medium" ? "10–20 kg" : ">20 kg"}
                      </div>
                      <div className="font-serif font-semibold text-lg" style={{ color: PALETTE.ink }}>
                        £{v.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 text-sm" style={{ color: PALETTE.text }}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4" style={{ color: PALETTE.accent }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={cx(
                  "mt-6 inline-block rounded-full px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md transition",
                  RING
                )}
                style={{ background: PALETTE.accent, color: "white" }}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------- Why
function Why() {
  const items = [
    {
      icon: <Leaf />,
      title: "Healthy ingredients",
      text: "Natural treats, no unnecessary additives.",
    },
    { icon: <Truck />, title: "Fast UK delivery", text: "Shipped monthly with clear tracking." },
    { icon: <Shield />, title: "Money-back guarantee", text: "Easy cancellation, responsive support." },
  ];
  return (
    <section id="why" className="relative py-20 bg-white">
      <BgSoft
        images={[
          "https://images.unsplash.com/photo-1592194996308-7b43878e84a3?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop",
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-10 items-center">
        <motion.div {...fadeUp} className="md:col-span-6">
          <h2 className="font-serif text-4xl md:text-5xl" style={{ color: PALETTE.ink }}>
            Why PawBox?
          </h2>
          <p className="mt-3" style={{ color: PALETTE.text }}>
            Designed for your pet’s wellbeing and your peace of mind.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {items.map((it, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/90 backdrop-blur p-5 border"
                style={{ borderColor: PALETTE.border }}
              >
                <div className="mb-2" style={{ color: PALETTE.accent }}>
                  {it.icon}
                </div>
                <div className="font-medium" style={{ color: PALETTE.ink }}>
                  {it.title}
                </div>
                <div className="text-sm mt-1" style={{ color: PALETTE.text }}>
                  {it.text}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="md:col-span-6">
          <div
            className="aspect-[4/3] w-full rounded-3xl overflow-hidden border"
            style={{ borderColor: PALETTE.border }}
          >
            <SafeImg
              srcSet={[
                "https://images.unsplash.com/photo-1516366434321-728a48e6b7b3?q=80&w=1600&auto=format&fit=crop",
                "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
                "https://images.pexels.com/photos/573186/pexels-photo-573186.jpeg",
              ]}
              alt="Cat and dog together"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// -------------------------------- Personalise
function Personalise() {
  const [animal, setAnimal] = useState("dog");
  const [age, setAge] = useState("adult");
  const [weight, setWeight] = useState("small");
  const [plan, setPlan] = useState("essential");
  const [name, setName] = useState("");

  const price = useMemo(() => {
    const p = plans.find((x) => x.id === plan);
    return p ? p.pricing[weight] : 0;
  }, [plan, weight]);

  return (
    <section id="personalise" className="py-20" style={{ background: PALETTE.cream }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl" style={{ color: PALETTE.ink }}>
            Personalise your box
          </h2>
          <p className="mt-3" style={{ color: PALETTE.text }}>
            Tailor the box to your companion’s profile.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 border" style={{ borderColor: PALETTE.border }}>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Pet type">
                <select
                  value={animal}
                  onChange={(e) => setAnimal(e.target.value)}
                  className={cx("w-full rounded-xl border px-3 py-2", RING)}
                  style={{ borderColor: PALETTE.border }}
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
              </Field>
              <Field label="Age">
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={cx("w-full rounded-xl border px-3 py-2", RING)}
                  style={{ borderColor: PALETTE.border }}
                >
                  <option value="puppy">Young</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                </select>
              </Field>
              <Field label="Weight">
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={cx("w-full rounded-xl border px-3 py-2", RING)}
                  style={{ borderColor: PALETTE.border }}
                >
                  <option value="small">&lt; 10 kg</option>
                  <option value="medium">10 – 20 kg</option>
                  <option value="large">&gt; 20 kg</option>
                </select>
              </Field>
              <Field label="Plan">
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className={cx("w-full rounded-xl border px-3 py-2", RING)}
                  style={{ borderColor: PALETTE.border }}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field full label="Pet’s name (optional)">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rocky"
                  className={cx("w-full rounded-xl border px-3 py-2", RING)}
                  style={{ borderColor: PALETTE.border }}
                />
              </Field>
            </div>
            <div
              className="mt-6 rounded-2xl border p-4 text-sm"
              style={{ background: "#FFFDF8", borderColor: "#FDE68A" }}
            >
              <p style={{ color: PALETTE.text }}>
                Calculated for a <span className="font-medium">{animal === "dog" ? "dog" : "cat"}</span>{" "}
                {age === "puppy" ? "young" : age} —{" "}
                {weight === "small" ? "<10 kg" : weight === "medium" ? "10–20 kg" : ">20 kg"} — plan{" "}
                <span className="font-medium">
                  {plans.find((p) => p.id === plan)?.name}
                </span>.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 border h-fit" style={{ borderColor: PALETTE.border }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm" style={{ color: PALETTE.subtle }}>
                  Monthly total
                </div>
                <div className="text-4xl font-serif" style={{ color: PALETTE.ink }}>
                  £{price.toFixed(2)}
                </div>
              </div>
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden border"
                style={{ borderColor: PALETTE.border }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=1600&auto=format&fit=crop"
                  alt="Snack"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {(plans.find((x) => x.id === plan)?.features || []).map((f) => (
                <li key={f} className="flex items-start gap-2" style={{ color: PALETTE.text }}>
                  <Check className="h-4 w-4 mt-0.5" style={{ color: PALETTE.accent }} /> {f}
                </li>
              ))}
            </ul>
            <button
              className={cx(
                "mt-6 w-full rounded-full px-5 py-3 text-sm font-medium shadow-sm hover:shadow-md transition",
                RING
              )}
              style={{ background: PALETTE.accent, color: "white" }}
              onClick={() => handleCheckout(plan, weight)}
            >
              Continue to checkout
            </button>
            <p className="mt-3 text-xs" style={{ color: PALETTE.subtle }}>
              Recurring payment, cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------- Testimonials
function Testimonials() {
  const items = [
    { quote: "My dog waits for PawBox every month!", author: "Emily, London" },
    { quote: "Perfect for our senior cat, great quality.", author: "James, Manchester" },
    { quote: "Brilliant support and flexible plans.", author: "Sophie, Bristol" },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl" style={{ color: PALETTE.ink }}>
            Loved already
          </h2>
          <p className="mt-3" style={{ color: PALETTE.text }}>
            A few words from UK customers.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure
              key={i}
              {...fadeUp}
              className="rounded-3xl bg-white p-6 border"
              style={{ borderColor: PALETTE.border }}
            >
              <blockquote style={{ color: PALETTE.ink }}>“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm" style={{ color: PALETTE.subtle }}>
                {t.author}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------- About
function About() {
  return (
    <section id="about" className="relative py-20" style={{ background: PALETTE.cream }}>
      <BgSoft
        images={[
          "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1200&auto=format&fit=crop",
        ]}
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl" style={{ color: PALETTE.ink }}>
            About PawBox
          </h2>
          <p className="mt-4" style={{ color: PALETTE.text }}>
            Small UK-based team, focused on pet wellbeing. We minimise packaging
            and favour useful, healthy products.
          </p>
          <ul className="mt-6 space-y-2 text-sm" style={{ color: PALETTE.text }}>
            <li className="flex items-start gap-2">
              <Leaf className="h-4 w-4 mt-0.5" style={{ color: PALETTE.accent }} /> Recyclable packaging
            </li>
            <li className="flex items-start gap-2">
              <Truck className="h-4 w-4 mt-0.5" style={{ color: PALETTE.accent }} /> UK logistics partners
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5" style={{ color: PALETTE.accent }} /> 30-day money-back guarantee
            </li>
          </ul>
        </div>
        <div
          className="aspect-[4/3] w-full rounded-3xl overflow-hidden border"
          style={{ borderColor: PALETTE.border }}
        >
          <img
            src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1600&auto=format&fit=crop"
            alt="Owner and dog"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

// -------------------------------- Footer
function Footer() {
  return (
    <footer id="contact" className="border-t bg-white" style={{ borderColor: PALETTE.border }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: PALETTE.accent, color: "white" }}
            >
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg" style={{ color: PALETTE.ink }}>
              PawBox UK
            </span>
          </div>
          <p className="mt-3 text-sm max-w-md" style={{ color: PALETTE.text }}>
            Premium monthly boxes, personalised for your pet’s wellbeing. UK delivery.
          </p>
          <p className="mt-3 text-xs" style={{ color: PALETTE.subtle }}>
            © {new Date().getFullYear()} PawBox UK. All rights reserved.
          </p>
        </div>
        <div>
          <div className="font-medium" style={{ color: PALETTE.ink }}>
            Links
          </div>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: PALETTE.text }}>
            <li>
              <a href="#plans" className="hover:underline">
                Plans
              </a>
            </li>
            <li>
              <a href="#personalise" className="hover:underline">
                Personalise
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium" style={{ color: PALETTE.ink }}>
            Contact
          </div>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: PALETTE.text }}>
            <li>hello@pawbox.co.uk</li>
            <li>Mon–Fri 9:00–17:00</li>
            <li>UK only</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

// -------------------------------- Primitives
// Subtle background images (low-visibility, keeps layout clean)
function BgSoft({ images = [] }) {
  return (
    <div aria-hidden className="pointer-events-none select-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-16 -left-16 hidden md:block w-80 h-80 opacity-5 blur-sm">
        <img src={images[0]} alt="" className="w-full h-full object-cover rounded-3xl" />
      </div>
      <div className="absolute -bottom-16 -right-16 hidden md:block w-96 h-96 opacity-5 blur-sm">
        <img src={images[1] || images[0]} alt="" className="w-full h-full object-cover rounded-3xl" />
      </div>
    </div>
  );
}

// --- Self-tests (development only) ---
(function () {
  const isDev =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV !== "production") ||
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.MODE !== "production");
  if (!isDev) return;
  try {
    if (typeof window !== "undefined") {
      window.__PB_BGSOFT_DEFINED = (window.__PB_BGSOFT_DEFINED || 0) + 1;
      console.assert(
        window.__PB_BGSOFT_DEFINED === 1,
        "BgSoft declared multiple times (duplicate definition)"
      );
    }
    console.assert(typeof BgSoft === "function", "BgSoft must be a function");
    const key = STRIPE_PUBLISHABLE_KEY;
    console.assert(typeof key === "string", "Stripe key must be a string");
  } catch (e) {
    // never break render in prod
  }
})();

function SafeImg({ srcSet = [], alt = "", className = "" }) {
  const [i, setI] = useState(0);
  const fallbacks = [
    ...srcSet,
    "https://placehold.co/1200x900?text=Image+not+available",
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23787b80" font-family="Arial" font-size="28">Image unavailable</text></svg>',
  ];
  const src = fallbacks[i] || fallbacks[fallbacks.length - 1];
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() =>
        setI((prev) => (prev + 1 < fallbacks.length ? prev + 1 : prev))
      }
    />
  );
}

function Field({ label, full, children }) {
  return (
    <label className={cx("block", full && "sm:col-span-2")}>
      <span className="mb-2 block text-sm font-medium" style={{ color: PALETTE.ink }}>
        {label}
      </span>
      {children}
    </label>
  );
}
