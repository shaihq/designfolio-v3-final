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
    "1month": { price: "₹1,199", label: "one-time payment" },
    "3months": { price: "₹2,999", label: "one-time payment" },
    "lifetime": { price: "₹4,999", label: "one-time payment" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-white rounded-[32px]">
        <div className="relative">
          {/* Header Gradient */}
          <div className="h-32 bg-gradient-to-b from-[#FF9838] to-[#FFF7ED] relative flex items-center justify-center">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
            
            {/* Crown Icon */}
            <div className="mt-8 flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 shadow-inner">
              <span className="text-5xl drop-shadow-md">👑</span>
            </div>
          </div>

          <div className="px-8 pb-10 pt-6">
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
              Designfolio Lifetime Access
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Just one payment. That's it. You get everything, forever.
            </p>

            {/* Plan Selector */}
            <div className="mt-8 bg-gray-100 p-1 rounded-2xl flex">
              <button
                onClick={() => setSelectedPlan("1month")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  selectedPlan === "1month" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                1 Month
              </button>
              <button
                onClick={() => setSelectedPlan("3months")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  selectedPlan === "3months" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                3 Months
              </button>
              <button
                onClick={() => setSelectedPlan("lifetime")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  selectedPlan === "lifetime" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Lifetime
              </button>
            </div>

            {/* Pricing Display */}
            <div className="mt-8">
              <div className="text-[44px] font-bold text-gray-900 leading-none">
                {plans[selectedPlan].price}
              </div>
              <div className="text-gray-500 mt-1 text-lg">
                {plans[selectedPlan].label}
              </div>
            </div>

            {/* Upgrade Button */}
            <Button className="w-full mt-8 bg-[#F0624D] hover:bg-[#E0523D] text-white py-7 rounded-2xl text-xl font-semibold shadow-lg shadow-[#F0624D]/20 border-none transition-all active:scale-[0.98]">
              Upgrade Now
            </Button>

            {/* Best Value Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 bg-[#FFF7D6] py-2.5 px-4 rounded-full border border-[#FFE8A3]">
              <span className="text-lg">⏰</span>
              <span className="text-[#856404] font-medium text-sm">
                Best value: Lifetime at ₹4,999 — unlock forever
              </span>
            </div>

            {/* Features List */}
            <div className="mt-8 space-y-4">
              {[
                "Use your own custom domain",
                "Access all templates — now & forever",
                "Create unlimited projects (not just 2)",
                "Track views with built-in analytics"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#5CC894] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-600 text-[17px] font-medium leading-tight">
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
