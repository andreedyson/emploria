"use client";

import { FEATURES_SECTION } from "@/constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function FeatureSection() {
  return (
    <section id="features" className="section-padding">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Feature Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-xl font-bold max-md:leading-none md:text-2xl lg:text-3xl">
            Packed with <span className="text-shadow-violet-600">Powerful</span>{" "}
            Features
          </h2>
          <p className="text-muted-foreground max-w-lg font-medium">
            Discover a set of powerful Next.js starter kit designed to help you
            develop web app faster using the best web development technology.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {FEATURES_SECTION.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="flex items-center gap-2 rounded-lg border border-violet-600 px-3 py-4 shadow-[5px_5px_0px_0px_rgba(109,40,217)]"
            >
              <p className="rounded-full bg-slate-200 p-1.5 text-base lg:p-3 lg:text-lg">
                {feature.icon}
              </p>
              <div>
                <h3 className="text-base font-semibold md:text-lg">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureSection;
