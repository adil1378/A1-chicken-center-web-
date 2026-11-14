export type CategoryId =
  | "all"
  | "curry-cut"
  | "boneless"
  | "legs-drumsticks"
  | "lollipop-wings"
  | "whole-chicken"
  | "country-chicken"
  | "eggs";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  iconName: "Flame" | "Utensils" | "Sparkles" | "Layers" | "Feather" | "Egg" | "Grid";
}

export type PieceSizeOption = "Small (Curry)" | "Medium (Standard)" | "Large (Biryani)";
export type SkinOption = "Skin Off" | "Skin On";
export type KeemaOption = "Regular Cut (Not Minced)" | "Fine Keema (Minced)" | "Coarse Keema";
export type CleaningOption =
  | "Standard Dressing"
  | "Standard Whole Bird Dressing"
  | "Cut into Halves"
  | "Portioned into 4 Quarters";

export interface CustomizationCapabilities {
  supportsPieceSize?: boolean;
  pieceSizes?: PieceSizeOption[];
  supportsSkinOption?: boolean;
  skinOptions?: SkinOption[];
  supportsKeema?: boolean;
  keemaOptions?: KeemaOption[];
  supportsCleaningStyle?: boolean;
  cleaningOptions?: CleaningOption[];
  customNotesAllowed?: boolean;
}

export type UnitType = "kg" | "pack" | "tray" | "piece";

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  description: string;
  culinaryUse: string;
  imageSrc: string | null; // null indicates intentional themed illustration placeholder
  unitType: UnitType;
  defaultWeight: number; // in unitType (e.g. 1.0 for kg, 1 for tray)
  // PRICING INTEGRITY:
  // Model as nullable. A value of null signifies unconfirmed shop price.
  // Never fabricate or hardcode arbitrary prices.
  pricePerUnit: number | null;
  // AVAILABILITY INTEGRITY:
  // Product availability is unconfirmed until live shop inventory integration.
  availability: "unconfirmed" | "available" | "unavailable";
  customizations: CustomizationCapabilities;
}

export interface SelectedCustomizations {
  pieceSize?: PieceSizeOption;
  skinOption?: SkinOption;
  keemaOption?: KeemaOption;
  cleaningOption?: CleaningOption;
  customerNote?: string;
}

export interface CartItem {
  id: string; // unique cart item id (product id + serialized customizations + weight)
  productId: string;
  productName: string;
  categoryId: CategoryId;
  categoryName: string;
  imageSrc: string | null;
  weightAmount: number; // e.g. 0.5, 1.0, 2.5
  unitType: UnitType;
  quantity: number;
  customizations: SelectedCustomizations;
  pricePerUnit: number | null; // null if shop price is not confirmed
}

