"use client";

import { TECH_STACKS } from "@/constants";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Reusable animations
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// Motion-enhanced Link
const MotionLink = motion.create(Link);

function TechStacksSection() {
  return (
    <section id="tech-stacks" className="section-padding">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Tech Stack Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-xl font-bold max-md:leading-none md:text-2xl lg:text-3xl">
            Powered by Modern Technology
          </h2>
          <p className="text-muted-foreground max-w-lg font-medium">
            Everything you need to build modern apps.
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full space-y-3"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACKS.map((tech, i) => (
              <MotionLink
                key={i}
                href={tech.docs}
                target="_blank"
                variants={fadeUp}
                custom={i}
                className="group bg-background hover:bg-input cursor-pointer rounded-md border p-4 shadow-md duration-200 hover:scale-[102%]"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Image
                      src={tech.icon}
                      width={64}
                      height={64}
                      alt={tech.name}
                      className="size-10 rounded-md border-2 lg:size-12 xl:size-16"
                    />
                    <ExternalLink className="duration-200 group-hover:text-violet-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold md:text-base">
                      {tech.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-5 font-medium md:text-sm">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </MotionLink>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TechStacksSection;
