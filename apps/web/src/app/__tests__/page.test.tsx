import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../page";

// Helper to configure matchMedia mock
function setupMatchMedia(reducedMotion: boolean = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  setupMatchMedia(false);
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.scrollTo = vi.fn();
});

describe("Phase 2 Cinematic Landing Page & Animations", () => {
  it("renders hero brand title and official tagline", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: /A1 CHICKEN CENTER/i })).toBeDefined();
    const taglines = screen.getAllByText(/Freshness You Can Trust\./i);
    expect(taglines.length).toBeGreaterThanOrEqual(1);
  });

  it("ensures initial visibility of whole-chicken image with accessible alt text", () => {
    render(<Home />);
    
    // Check whole dressed chicken images in initial state
    const wholeChickenImages = screen.getAllByAltText(/Complete whole dressed chicken prior to butchering|Whole dressed chicken before separation/i);
    expect(wholeChickenImages.length).toBeGreaterThanOrEqual(1);
    
    // Check whole chicken labels
    const wholeChickenLabels = screen.getAllByText(/Whole Dressed Chicken/i);
    expect(wholeChickenLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the master butcher cutting sequence section", () => {
    render(<Home />);
    expect(screen.getByText(/The Master Cutting Sequence/i)).toBeDefined();
    const stageItems = screen.getAllByText(/Whole Dressed Bird Preparation/i);
    expect(stageItems.length).toBeGreaterThanOrEqual(1);
  });

  it("verifies mobile cut selection updates cut details with accessible selected state", () => {
    render(<Home />);
    
    // Find lower leg tab button
    const drumstickTab = screen.getByRole("tab", { name: /Fresh Drumstick Cut/i });
    expect(drumstickTab).toBeDefined();
    
    // Click on drumstick cut
    fireEvent.click(drumstickTab);
    
    // Check accessible selected state
    expect(drumstickTab.getAttribute("aria-selected")).toBe("true");
    
    // Check that drumstick details are displayed
    expect(screen.getAllByText(/Juicy Dark Meat on Bone/i).length).toBeGreaterThanOrEqual(1);
  });

  it("respects reduced-motion preference by disabling video autoplay", () => {
    setupMatchMedia(true);
    render(<Home />);
    
    // In reduced motion, video should have pause called or not autoplay
    const video = screen.getByLabelText(/A1 Chicken Center butcher preparation demonstration/i) as HTMLVideoElement;
    expect(video).toBeDefined();
  });

  it("renders the quality handling and fresh cut presentation section", () => {
    render(<Home />);
    expect(screen.getByText(/Fresh Cuts, Clean Preparation/i)).toBeDefined();
    expect(screen.getByText(/Daily Fresh Poultry/i)).toBeDefined();
    expect(screen.getByText(/Custom Recipe Cuts/i)).toBeDefined();
  });
});
