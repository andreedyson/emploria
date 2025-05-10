"use client";

import { Button } from "@/components/ui/button";
import { SquareKanban } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.6, duration: 0.6, ease: "easeOut" },
  },
};

function HeroSection() {
  return (
    <section className="w-full py-20">
      <div className="flex flex-col items-center gap-3">
        {/* Hero Title & Description */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-center md:gap-3">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0}
            viewport={{ once: true, amount: 0.5 }}
            className="flex items-center gap-1.5 rounded-full border px-4 py-1.5 shadow-lg max-md:mb-3 md:px-5 md:py-2"
          >
            <SquareKanban size={14} strokeWidth={2} />
            <p className="text-xs font-semibold md:text-sm">
              Build Modern Web App Faster
            </p>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={1}
            viewport={{ once: true }}
            className="text-2xl font-bold max-md:leading-none md:text-3xl lg:text-5xl"
          >
            Unlock Your Next.js Potential: <br /> Ready-to-Go Template
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={2}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-lg leading-5 tracking-tight max-md:text-sm"
          >
            Jumpstart your development with pre-configured tools, optimized
            performance, and a clean project structure.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={3}
            viewport={{ once: true }}
            className="mt-3 flex items-center gap-4"
          >
            <Button className="w-[120px] md:w-[150px]">Get Started</Button>
            <Link
              href={"https://github.com/andreedyson/emploria"}
              target="_blank"
            >
              <Button className="w-[120px] md:w-[150px]" variant={"link"}>
                View on GitHub
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          variants={imageVariant}
          initial="hidden"
          animate="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex w-[80%] items-center justify-center lg:w-full"
        >
          <Image
            src={"/assets/template-hero.svg"}
            width={1000}
            height={700}
            alt="Template Hero"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
