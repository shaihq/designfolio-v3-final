import React from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PricingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingPopup = ({ isOpen, onClose }: PricingPopupProps) => {
  const [selectedPlan, setSelectedPlan] = React.useState<"1month" | "3months" | "lifetime">("1month");

  const plans = {
    "1month": { 
      price: "₹1,999", 
      label: "one-time payment",
      title: "For Beginners",
      subtext: "Build your first serious portfolio. Explore what’s possible."
    },
    "3months": { 
      price: "₹4,999", 
      label: "one-time payment",
      title: "For Job Seekers",
      subtext: "Build a complete portfolio and start landing interviews fast."
    },
    "lifetime": { 
      price: "₹5,499", 
      label: "one-time payment",
      title: "Lifetime Access",
      subtext: "Own your portfolio forever. No expiry. No resets."
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden border-none bg-white rounded-[24px]">
        <div className="relative">
          {/* Header Gradient */}
          <div className="h-24 bg-gradient-to-b from-[#FF9838] to-[#FFF7ED] relative flex items-center justify-center">
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/80 hover:bg-white rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-800" />
            </button>
            
            {/* Crown Icon */}
            <div className="mt-4 flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-inner">
              <span className="text-3xl drop-shadow-md">👑</span>
            </div>
          </div>

          <div className="px-6 pb-8 pt-4">
            <h2 className="text-[22px] font-bold text-gray-900 leading-tight">
              {plans[selectedPlan].title}
            </h2>
            <p className="text-gray-500 mt-1.5 text-sm leading-relaxed whitespace-pre-line">
              {plans[selectedPlan].subtext}
            </p>

            {/* Plan Selector */}
            <div className="mt-6 bg-gray-100 p-1 rounded-xl flex">
              <button
                onClick={() => setSelectedPlan("1month")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedPlan === "1month" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                1 Month
              </button>
              <button
                onClick={() => setSelectedPlan("3months")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all relative ${
                  selectedPlan === "3months" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                3 Months
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5CC894] text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  Save 33%
                </span>
              </button>
              <button
                onClick={() => setSelectedPlan("lifetime")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedPlan === "lifetime" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Lifetime
              </button>
            </div>

            {/* Pricing Display */}
            <div className="mt-6">
              <div className="text-[32px] font-bold text-gray-900 leading-none">
                {plans[selectedPlan].price}
              </div>
              <div className="text-gray-500 mt-1 text-sm font-medium">
                {plans[selectedPlan].label}
              </div>
            </div>

            {/* Upgrade Button */}
            <Button className="w-full mt-6 bg-[#F0624D] hover:bg-[#E0523D] text-white py-5 rounded-xl text-lg font-bold shadow-lg shadow-[#F0624D]/20 border-none transition-all active:scale-[0.98]">
              Upgrade Now
            </Button>

            {/* Best Value Badge */}
            {selectedPlan === "lifetime" && (
              <div className="mt-5 flex items-center justify-center gap-1.5 bg-[#FFF7D6] py-2 px-3 rounded-full border border-[#FFE8A3]">
                <span className="text-sm">⏰</span>
                <span className="text-[#856404] font-semibold text-[11px] uppercase tracking-wider">
                  Lifetime price increasing next month
                </span>
              </div>
            )}

            {/* Features List */}
            <div className="mt-6 space-y-3">
              {[
                "Use your own custom domain",
                "Access all templates — now & forever",
                "Create unlimited projects (not just 2)",
                "Track views with built-in analytics"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#5CC894] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                  </div>
                  <span className="text-gray-600 text-[14px] font-medium leading-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
