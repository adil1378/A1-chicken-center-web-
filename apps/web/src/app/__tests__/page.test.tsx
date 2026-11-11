import React from "react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

// Setup mocks for jsdom environment
beforeAll(() => {
  // Mock matchMedia for responsive / reduced motion checks
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock HTMLMediaElement play/pause
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.scrollTo = vi.fn();
});

describe("Phase 2 Cinematic Landing Page", () => {
  it("renders hero brand title and official tagline", () => {
    render(<Home />);
    
    // Check main brand headline
    expect(screen.getByRole("heading", { level: 1, name: /A1 CHICKEN CENTER/i })).toBeDefined();
    
    // Check tagline
    const taglines = screen.getAllByText(/Freshness You Can Trust\./i);
    expect(taglines.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the master butcher cutting sequence section", () => {
    render(<Home />);
    expect(screen.getByText(/The Master Cutting Sequence/i)).toBeDefined();
    const stageItems = screen.getAllByText(/Whole Dressed Bird Preparation/i);
    expect(stageItems.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the scroll-driven anatomical cuts separation section", () => {
    render(<Home />);
    expect(screen.getByText(/Anatomy of Freshness: The Cut Separation/i)).toBeDefined();
  });

  it("renders the hygiene and food safety promise section", () => {
    render(<Home />);
    expect(screen.getByText(/The A1 Hygiene Promise/i)).toBeDefined();
    expect(screen.getByText(/Single-Use Blue Glove Protocol/i)).toBeDefined();
  });
});
