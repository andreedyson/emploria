"use client";

import { IconCloud } from "@/components/magicui/icon-cloud";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_LISTS } from "@/constants";
import { motion } from "framer-motion";

const icons = [
  "/assets/logo/nextjs.svg",
  "/assets/logo/typescript.svg",
  "/assets/logo/tailwind.svg",
  "/assets/logo/shadcn.svg",
  "/assets/logo/prisma.svg",
  "/assets/logo/postgre.svg",
  "/assets/logo/framer.svg",
  "/assets/logo/nextauth.png",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const faqVariants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const faqImageVariants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function FAQSection() {
  return (
    <section id="faq" className="section-padding">
      <div className="flex flex-col gap-4">
        {/* FAQ Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-xl font-bold max-md:leading-none md:text-2xl lg:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-[400px] font-medium">
            Get the complete guide to the Next.js Starter Kit. Need more info?
            Contact out our team!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* FAQ Lists */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 gap-3"
          >
            {FAQ_LISTS.map((faq, i) => (
              <motion.div key={i} variants={faqVariants}>
                <Accordion type="multiple">
                  <AccordionItem value={i.toString()}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Image */}
          <motion.div
            variants={faqImageVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-background relative flex size-full items-center justify-center overflow-hidden rounded-lg max-md:hidden"
          >
            <IconCloud images={icons} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
