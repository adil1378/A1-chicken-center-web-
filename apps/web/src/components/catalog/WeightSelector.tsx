"use client";

import React, { useState } from "react";
import { Scale, AlertCircle } from "lucide-react";
import { UnitType } from "@/types/catalog";

interface WeightSelectorProps {
  unitType: UnitType;
  selectedWeight: number;
  onWeightChange: (weight: number) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export default function WeightSelector({
  unitType,
  selectedWeight,
  onWeightChange,
  onValidityChange,
}: WeightSelectorProps) {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    unitType === "kg" && selectedWeight !== 0.5 && selectedWeight !== 1.0
  );
  const [customInput, setCustomInput] = useState<string>(
    isCustomMode ? selectedWeight.toString() : ""
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  interface PresetOption {
    label: string;
    value: number;
    subtext?: string;
  }

  // Kg presets
  const kgPresets: PresetOption[] = [
    { label: "500 g", value: 0.5, subtext: "0.5 kg" },
    { label: "1 kg", value: 1.0, subtext: "1000 g" },
  ];

  // Discrete unit presets (packs/trays)
  const discretePresets: PresetOption[] = [
    { label: "1 Unit", value: 1 },
    { label: "2 Units", value: 2 },
    { label: "3 Units", value: 3 },
  ];

  const handlePresetSelect = (val: number) => {
    setIsCustomMode(false);
    setErrorMessage(null);
    onValidityChange?.(true);
    onWeightChange(val);
  };

  const handleCustomModeToggle = () => {
    setIsCustomMode(true);
    const initialVal = selectedWeight.toString();
    setCustomInput(initialVal);
    validateAndApply(initialVal);
  };

  const validateAndApply = (rawVal: string) => {
    const trimmed = rawVal.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a valid weight value.");
      onValidityChange?.(false);
      return;
    }

    const num = Number(trimmed);
    if (isNaN(num)) {
      setErrorMessage("Weight must be a valid numeric amount.");
      onValidityChange?.(false);
      return;
    }

    if (num <= 0) {
      setErrorMessage("Weight must be greater than zero.");
      onValidityChange?.(false);
      return;
    }

    if (unitType === "kg") {
      if (num < 0.25) {
        setErrorMessage("Provisional limit: Minimum selection is 0.25 kg (250 g). Subject to shop confirmation.");
        onValidityChange?.(false);
        return;
      }
      if (num > 50) {
        setErrorMessage("Provisional limit: Maximum selection is 50 kg. For bulk orders, please confirm directly with the shop.");
        onValidityChange?.(false);
        return;
      }
    } else {
      if (!Number.isInteger(num)) {
        setErrorMessage(`Please enter a whole number of ${unitType}s.`);
        onValidityChange?.(false);
        return;
      }
      if (num > 50) {
        setErrorMessage(`Provisional limit: Maximum quantity is 50 ${unitType}s.`);
        onValidityChange?.(false);
        return;
      }
    }

    // Valid: apply without silent rounding
    setErrorMessage(null);
    onValidityChange?.(true);
    onWeightChange(num);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    validateAndApply(val);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-brand-500" />
          <span>Select {unitType === "kg" ? "Portion / Weight" : "Quantity"}:</span>
        </label>
        <span className="text-xs font-mono text-brand-500 font-bold">
          {unitType === "kg"
            ? `${selectedWeight} kg (${Math.round(selectedWeight * 1000)} g)`
            : `${selectedWeight} ${unitType}${selectedWeight > 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Portion presets">
        {(unitType === "kg" ? kgPresets : discretePresets).map((preset) => {
          const isSelected = !isCustomMode && selectedWeight === preset.value;
          return (
            <button
              type="button"
              key={preset.value}
              onClick={() => handlePresetSelect(preset.value)}
              className={`py-2 px-3 rounded-xl border text-left transition ${
                isSelected
                  ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-950"
                  : "bg-black-surface border-black-border text-white-off hover:border-brand-800"
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-xs font-bold block">{preset.label}</span>
              {"subtext" in preset && (
                <span className={`text-[10px] block ${isSelected ? "text-white/80" : "text-black-muted"}`}>
                  {preset.subtext}
                </span>
              )}
            </button>
          );
        })}

        {/* Custom button */}
        <button
          type="button"
          onClick={handleCustomModeToggle}
          className={`py-2 px-3 rounded-xl border text-left transition ${
            isCustomMode
              ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-950"
              : "bg-black-surface border-black-border text-white-off hover:border-brand-800"
          }`}
          aria-pressed={isCustomMode}
        >
          <span className="text-xs font-bold block">Custom</span>
          <span className={`text-[10px] block ${isCustomMode ? "text-white/80" : "text-black-muted"}`}>
            Exact {unitType}
          </span>
        </button>
      </div>

      {/* Custom input panel */}
      {isCustomMode && (
        <div className="p-3 rounded-xl bg-black-surface border border-brand-900/60 space-y-2 animate-in fade-in duration-200">
          <label htmlFor="custom-weight-input" className="text-xs text-white-off/80 block font-medium">
            Enter exact {unitType === "kg" ? "weight in kilograms (e.g. 0.75, 1.5, 2.5)" : `number of ${unitType}s`}:
          </label>
          <div className="relative">
            <input
              id="custom-weight-input"
              type="number"
              step={unitType === "kg" ? "0.05" : "1"}
              min={unitType === "kg" ? "0.25" : "1"}
              max="50"
              value={customInput}
              onChange={handleCustomInputChange}
              placeholder={unitType === "kg" ? "e.g. 1.25" : "e.g. 2"}
              className="w-full bg-black-deep border border-black-border focus:border-brand-500 focus:outline-none rounded-lg px-3 py-2 text-sm font-mono text-white"
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? "weight-validation-error" : undefined}
            />
            <span className="absolute right-3 top-2 text-xs font-mono text-black-muted">
              {unitType}
            </span>
          </div>
          <p className="text-[10px] text-black-muted font-mono">
            Provisional bounds for selection tool ({unitType === "kg" ? "0.25 kg min, 50 kg max" : `1 to 50 ${unitType}s`}). Final portion confirmed by shop.
          </p>

          {errorMessage && (
            <div
              id="weight-validation-error"
              className="flex items-center gap-1.5 text-xs text-brand-500 font-medium pt-1"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
