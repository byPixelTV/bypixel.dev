"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function SkillsScrollDownButton() {
    return (
        <div className="flex justify-center pb-8">
            <motion.div 
            className="flex flex-col items-center cursor-pointer"
            animate={{ y: [0, -10, 0] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            onClick={() => {
                const nextSection = document.querySelector('#skills');
                nextSection?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
                });
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            >
            <Icon 
                icon="eva:arrow-down-fill" 
                className="w-8 h-8 text-white hover:text-purple-400 transition-colors duration-300" 
            />
            </motion.div>
        </div>
    )
}