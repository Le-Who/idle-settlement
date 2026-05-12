
import React from 'react';
import { Tech } from '../constants/techData';
import { Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchListProps {
  techs: Tech[];
  science: number;
  onResearch: (id: string) => void;
}

const ResearchList: React.FC<ResearchListProps> = ({ techs, science, onResearch }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {techs.map((tech) => (
        <motion.div
          key={tech.id}
          whileHover={!tech.unlocked ? { scale: 1.02 } : {}}
          className={`p-6 rounded-2xl border-2 transition-all ${
            tech.unlocked 
              ? 'bg-green-50 border-green-200' 
              : science >= tech.cost 
                ? 'bg-white border-blue-200 shadow-md' 
                : 'bg-gray-50 border-gray-100 opacity-60'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${tech.unlocked ? 'bg-green-100' : 'bg-blue-100'}`}>
                <Beaker className={`w-6 h-6 ${tech.unlocked ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{tech.name}</h3>
                <p className="text-xs text-gray-500">{tech.description}</p>
              </div>
            </div>
            {tech.unlocked && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Completed
              </span>
            )}
          </div>

          {!tech.unlocked && (
            <div className="mt-6">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-blue-600">{tech.cost} Science</span>
                <span className="text-xs text-gray-400">{(science / tech.cost * 100).toFixed(0)}% ready</span>
              </div>
              <button
                onClick={() => onResearch(tech.id)}
                disabled={science < tech.cost}
                className={`w-full py-2 rounded-xl font-bold transition-all ${
                  science >= tech.cost 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Research
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ResearchList;
