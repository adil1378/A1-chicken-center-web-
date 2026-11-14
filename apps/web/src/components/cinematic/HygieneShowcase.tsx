"use client";

import React from "react";
import Image from "next/image";
import { Utensils, Sparkles, CheckCircle2, PackageCheck } from "lucide-react";

export default function HygieneShowcase() {
  const pillars = [
    {
      icon: Utensils,
      title: "Curry Cut Chicken",
      description:
        "Balanced bone-in pieces that release rich flavor into curries, stews, and slow-simmered gravies.",
    },
    {
      icon: Sparkles,
      title: "Boneless Breast Fillets",
      description:
        "Tender, skinless breast cuts suited for quick cooking, pan-searing, tandoori tikka, and stir-fries.",
    },
    {
      icon: CheckCircle2,
      title: "Legs & Drumsticks",
      description:
        "Moist and flavorful dark meat portions on the bone, ideal for dum biryanis and tandoori roasts.",
    },
    {
      icon: PackageCheck,
      title: "Custom Recipe Portions",
      description:
        "Cut and portioned to match your specific cooking needs, from whole birds to specialized recipe sizes.",
    },
  ];

  return (
    <section className="relative py-20 bg-black-surface border-t border-black-border text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-brand-800/60 shadow-2xl bg-black-deep">
              <Image
                src="/assets/images/boneless-breast.jpg"
                alt="Poultry cuts prepared for home cooking at A1 Chicken Center"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black-deep/90 border border-brand-800/80 backdrop-blur-md">
                <span className="text-xs font-mono text-brand-500 font-bold uppercase tracking-wider block mb-1">
                  Cut Options
                </span>
                <p className="text-sm font-semibold text-white">
                  Portioned for Your Cooking Style
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                Custom Butchery &amp; Cuts
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 mb-4">
                Cuts for Every Cooking Style
              </h2>
              <p className="text-sm sm:text-base text-black-muted leading-relaxed">
                From bone-in cuts for hearty stews to quick-cooking boneless fillets, explore our primary
                chicken cut options designed for everyday cooking and authentic recipes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-black-deep border border-black-border hover:border-brand-800/50 transition group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-950 border border-brand-800/40 flex items-center justify-center text-brand-500 mb-3 group-hover:bg-brand-900/60 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                    <p className="text-xs text-black-muted leading-relaxed">{pillar.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
