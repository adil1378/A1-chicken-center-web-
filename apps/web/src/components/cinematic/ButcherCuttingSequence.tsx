"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Slice, Utensils, CheckCircle2, ChevronRight, Layers } from "lucide-react";

interface CuttingStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  cutType: string;
  cookingStyle: string;
  cutProfile: string;
}

const STAGES: CuttingStage[] = [
  {
    id: "stage-1",
    stepNumber: "01",
    title: "Whole Dressed Chicken",
    subtitle: "Whole Carcass Portion",
    description:
      "A complete dressed chicken ready for whole-bird recipes, rotisserie cooking, or home portioning.",
    imageSrc: "/assets/images/whole-dressed-center.jpg",
    cutType: "Complete Dressed Chicken",
    cookingStyle: "Roasting, Rotisserie, Traditional Broths",
    cutProfile: "Full carcass cut ready for whole cooking",
  },
  {
    id: "stage-2",
    stepNumber: "02",
    title: "Legs & Drumsticks",
    subtitle: "Bone-in Dark Meat",
    description:
      "Tender drumstick and thigh portions separated along natural joints, keeping bone ends intact.",
    imageSrc: "/assets/images/drumstick-cut.jpg",
    cutType: "Bone-in Leg Quarters & Drumsticks",
    cookingStyle: "Dum Biryani, Slow Gravies, Grilling",
    cutProfile: "Moisture-retaining dark meat on the bone",
  },
  {
    id: "stage-3",
    stepNumber: "03",
    title: "Boneless Breast Fillets",
    subtitle: "Skinless White Meat",
    description:
      "Lean breast meat portioned into boneless fillets suited for fast stovetop and grill cooking.",
    imageSrc: "/assets/images/boneless-breast.jpg",
    cutType: "Skinless Boneless Breast Meat",
    cookingStyle: "Tandoori Tikka, Stir-Fries, Grills",
    cutProfile: "Quick-cooking lean cuts that absorb marinades",
  },
  {
    id: "stage-4",
    stepNumber: "04",
    title: "Curry Cut Portions",
    subtitle: "Evenly Sliced Pieces",
    description:
      "Uniform pieces cut to balanced sizes to ensure even cooking throughout curries and gravies.",
    imageSrc: "/assets/images/diced-cubes.jpg",
    cutType: "Uniform Diced & Curry Cut Pieces",
    cookingStyle: "Home Curries, Handi, Korma Recipes",
    cutProfile: "Consistent sizing for even cooking times",
  },
];

export default function ButcherCuttingSequence() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const activeStage = STAGES[activeStageIndex];

  return (
    <section id="cutting-sequence" className="relative py-24 sm:py-32 bg-black-surface text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-500 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Cut Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            The Primary Chicken Cuts
          </h2>

          <p className="text-sm sm:text-base text-black-muted leading-relaxed">
            Explore the main chicken cut options portioned for different home recipes and cooking styles.
          </p>
        </div>

        {/* Step Selector Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12" role="tablist" aria-label="Chicken cut stages">
          {STAGES.map((stage, index) => {
            const isActive = index === activeStageIndex;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(index)}
                className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-brand-950/60 border-brand-600 shadow-lg shadow-brand-950"
                    : "bg-black-deep/60 border-black-border hover:border-brand-900/50 hover:bg-black-deep"
                }`}
                role="tab"
                aria-selected={isActive}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isActive ? "bg-brand-600 text-white" : "bg-black-surface text-black-muted"
                    }`}
                  >
                    CUT {stage.stepNumber}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                </div>
                <h3 className={`text-xs sm:text-sm font-bold truncate ${isActive ? "text-white" : "text-white-off/70"}`}>
                  {stage.title}
                </h3>
                {isActive && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black-deep border border-black-border rounded-2xl p-6 sm:p-10 shadow-2xl">
          {/* Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-black-border bg-black-surface">
              <Image
                src={stageImageFor(activeStage.imageSrc)}
                alt={activeStage.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-deep/80 via-transparent to-transparent pointer-events-none" />

              {/* Stage Badge on image */}
              <div className="absolute top-4 left-4 bg-black-deep/90 border border-brand-800/80 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <span className="text-xs font-mono text-brand-500 font-bold uppercase tracking-wider">
                  Cut {activeStage.stepNumber} &bull; {activeStage.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Cut Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                {activeStage.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4 leading-tight">
                {activeStage.title}
              </h3>
              <p className="text-sm sm:text-base text-black-muted leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            {/* Culinary Details */}
            <div className="space-y-3 pt-4 border-t border-black-border">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-md bg-brand-950 flex items-center justify-center shrink-0 border border-brand-800/40 text-brand-500">
                  <Slice className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-black-muted block">Cut Type:</span>
                  <span className="text-white-off font-medium">{activeStage.cutType}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-md bg-brand-950 flex items-center justify-center shrink-0 border border-brand-800/40 text-brand-500">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-black-muted block">Recommended Cooking:</span>
                  <span className="text-white-off font-medium">{activeStage.cookingStyle}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-md bg-brand-950 flex items-center justify-center shrink-0 border border-brand-800/40 text-brand-500">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-black-muted block">Culinary Character:</span>
                  <span className="text-white-off font-medium">{activeStage.cutProfile}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function stageImageFor(path: string): string {
  return path;
}
