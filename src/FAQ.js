import React, { useState } from "react";
import "./FAQ.css";
import faqData from "./FaqData";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <h1 className="faq-title">Frequently Asked Questions</h1>

      <div className="faq-container">
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;

          return (
            <motion.div
              key={index}
              className={`faq-item ${isOpen ? "active" : ""}`}
              layout
            >
              {/* QUESTION */}
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.question}</span>

                <motion.span
                  className="faq-icon"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? "−" : "+"}
                </motion.span>
              </div>

              {/* ANSWER */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* multiline / bullets support */}
                    {item.answer.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}

                    {/* Bottom Close */}
                    <div
                      className="faq-close-bottom"
                      onClick={() => setActiveIndex(null)}
                    >
                      − 
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
