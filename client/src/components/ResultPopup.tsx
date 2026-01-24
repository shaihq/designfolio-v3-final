import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ResultPopupProps {
  content: string;
  onClose: () => void;
}

export function ResultPopup({ content, onClose }: ResultPopupProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-heading font-semibold">Your Portfolio Content</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 sm:p-10">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-foreground/90">
              {content}
            </div>
          </div>
          <div className="p-4 border-t flex justify-end">
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
