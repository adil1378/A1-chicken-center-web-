"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Slice, ShieldCheck, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

interface CuttingStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  toolUsed: string;
  knifeAngle: string;
  sanitationNote: string;
  culinaryYield: string;
}

const STAGES: CuttingStage[] = [
  {
    id: "stage-1",
    stepNumber: "01",
    title: "Whole Dressed Bird Preparation",
    subtitle: "Visual Inspection & Clean Prep",
    description:
      "Every bird is inspected upon arrival to verify clean skin texture, natural color, and firmness before cutting. The bird is thoroughly rinsed with clean water and placed on a clean prep station.",
    imageSrc: "/assets/images/whole-dressed-center.jpg",
    toolUsed: "Butcher Prep Block & Clean Cleaver",
    knifeAngle: "Stationary resting position",
    sanitationNote: "Thorough clean rinse before cutting",
    culinaryYield: "Clean whole dressed bird ready for division",
  },
  {
    id: "stage-2",
    stepNumber: "02",
    title: "Anatomical Joint & Leg Separation",
    subtitle: "Joint Separation along Natural Cartilage",
    description:
      "The drumstick and thigh quarters are separated along natural joint cartilage with a sharp blade. Cutting through joint sockets rather than sawing through bone helps minimize bone fragments.",
    imageSrc: "/assets/images/drumstick-cut.jpg",
    toolUsed: "8-inch Stainless Steel Butcher Knife",
    knifeAngle: "Joint socket incision angle",
    sanitationNote: "Cutting board kept wiped down and clean",
    culinaryYield: "Cleanly separated drumstick and whole leg cuts",
  },
  {
    id: "stage-3",
    stepNumber: "03",
    title: "Careful Boneless Breast Filleting",
    subtitle: "Gloved Filleting on Clean Boards",
    description:
      "Working on dedicated meat boards with single-use gloves, the butcher carefully fillets the tender breast meat off the rib cage, trimming away excess skin and fat.",
    imageSrc: "/assets/images/boneless-breast.jpg",
    toolUsed: "Flexible Boning Knife",
    knifeAngle: "Rib-line contour cut",
    sanitationNote: "Gloved handling on dedicated board",
    culinaryYield: "Trimmed boneless breast fillets",
  },
  {
    id: "stage-4",
    stepNumber: "04",
    title: "Uniform Curry & Tikka Dicing",
    subtitle: "Evenly Sized Pieces for Home Cooking",
    description:
      "The meat is sliced into uniform pieces based on customer preference. Consistent sizing ensures that all pieces cook through at an even rate in your pan or pot.",
    imageSrc: "/assets/images/diced-cubes.jpg",
    toolUsed: "Utility Dicing Knife",
    knifeAngle: "Cross-grain uniform slices",
    sanitationNote: "Packed directly into clean food-safe packaging",
    culinaryYield: "Uniform diced cuts ready for home cooking",
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
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Butchery Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            The Master Cutting Sequence
          </h2>

          <p className="text-sm sm:text-base text-black-muted leading-relaxed">
            See how whole birds are cleanly separated into individual cuts using proper knife
            technique, dedicated clean cutting surfaces, and careful portioning.
          </p>
        </div>

        {/* Step Selector Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
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
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isActive ? "bg-brand-600 text-white" : "bg-black-surface text-black-muted"
                    }`}
                  >
                    STEP {stage.stepNumber}
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
                  Step {activeStage.stepNumber} &bull; {activeStage.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Telemetry & Description (5 cols) */}
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

            {/* Practical Butchery Details */}
            <div className="space-y-3 pt-4 border-t border-black-border">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-md bg-brand-950 flex items-center justify-center shrink-0 border border-brand-800/40 text-brand-500">
                  <Slice className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-black-muted block">Blade & Tool:</span>
                  <span className="text-white-off font-medium">{activeStage.toolUsed}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-md bg-brand-950 flex items-center justify-center shrink-0 border border-brand-800/40 text-brand-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-black-muted block">Cleanliness Practice:</span>
                  <span className="text-white-off font-medium">{activeStage.sanitationNote}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-md bg-brand-950 flex items-center justify-center shrink-0 border border-brand-800/40 text-brand-500">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-black-muted block">Intended Result:</span>
                  <span className="text-white-off font-medium">{activeStage.culinaryYield}</span>
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
