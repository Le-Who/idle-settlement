
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameLogProps {
  logs: string[];
}

const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  return (
    <div className="bg-stone-900 text-stone-300 p-4 rounded-xl font-mono text-sm h-48 overflow-y-auto border-4 border-stone-800 shadow-inner">
      <div className="flex flex-col-reverse space-y-reverse space-y-1">
        <AnimatePresence initial={false}>
          {logs.map((log, index) => (
            <motion.div
              key={index + log}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-2 border-stone-700 pl-2"
            >
              <span className="text-stone-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameLog;
