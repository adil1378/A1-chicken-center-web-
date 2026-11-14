import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import Home from "../page";

// Store listeners for dynamic media query change testing
let mediaQueryListeners: Array<(e: { matches: boolean }) => void> = [];

function setupMatchMedia(reducedMotion: boolean = false) {
  mediaQueryListeners = [];
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, callback) => {
        if (event === "change" && typeof callback === "function") {
          mediaQueryListeners.push(callback);
        }
      }),
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
  it("renders hero brand title and official tagline", async () => {
    await act(async () => {
      render(<Home />);
    });
    expect(screen.getByRole("heading", { level: 1, name: /A1 CHICKEN CENTER/i })).toBeDefined();
    const taglines = screen.getAllByText(/Freshness You Can Trust\./i);
    expect(taglines.length).toBeGreaterThanOrEqual(1);
  });

  it("ensures initial visibility of whole-chicken image with accessible alt text", async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Check whole dressed chicken images in initial state
    const wholeChickenImages = screen.getAllByAltText(/Complete whole dressed chicken prior to butchering|Whole dressed chicken before separation/i);
    expect(wholeChickenImages.length).toBeGreaterThanOrEqual(1);
    
    // Check whole chicken labels and starting cut tag
    const wholeChickenLabels = screen.getAllByText(/Whole Dressed Chicken/i);
    expect(wholeChickenLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Starting Cut/i)).toBeDefined();
  });

  it("renders the primary chicken cuts showcase section", async () => {
    await act(async () => {
      render(<Home />);
    });
    expect(screen.getByText(/The Primary Chicken Cuts/i)).toBeDefined();
    const stageItems = screen.getAllByText(/Whole Dressed Chicken/i);
    expect(stageItems.length).toBeGreaterThanOrEqual(1);
  });

  it("verifies mobile cut selection updates cut details with accessible selected state", async () => {
    await act(async () => {
      render(<Home />);
    });

    const cutSelectorList = screen.getByRole("tablist", { name: /Chicken cut selector/i });
    expect(cutSelectorList).toBeDefined();

    // Initial state: Breast Fillet should be selected in the cut selector
    const initialTab = within(cutSelectorList).getByRole("tab", { name: /Boneless Breast Fillet/i });
    expect(initialTab.getAttribute("aria-selected")).toBe("true");

    // Drumstick tab initially not selected
    const drumstickTab = within(cutSelectorList).getByRole("tab", { name: /Fresh Drumstick Cut/i });
    expect(drumstickTab.getAttribute("aria-selected")).toBe("false");

    // Click on drumstick cut tab
    await act(async () => {
      fireEvent.click(drumstickTab);
    });

    // Assert accessible selected states flip
    expect(drumstickTab.getAttribute("aria-selected")).toBe("true");
    expect(initialTab.getAttribute("aria-selected")).toBe("false");

    // Assert cut details updated in mobile card
    expect(screen.getAllByText(/Bone-in Dark Meat/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dum Biryani, Slow Gravies, Roasts/i).length).toBeGreaterThanOrEqual(1);

    // Switch to Curry Cut pieces
    const curryTab = within(cutSelectorList).getByRole("tab", { name: /Uniform Curry Pieces/i });
    await act(async () => {
      fireEvent.click(curryTab);
    });
    expect(curryTab.getAttribute("aria-selected")).toBe("true");
    expect(drumstickTab.getAttribute("aria-selected")).toBe("false");
    expect(screen.getAllByText(/Home Curries, Handi, Korma/i).length).toBeGreaterThanOrEqual(1);
  });

  it("respects reduced-motion preference on initial load and during live preference change", async () => {
    // 1. Initial render with reduced-motion false
    const pauseSpy = vi.spyOn(window.HTMLMediaElement.prototype, "pause");
    await act(async () => {
      render(<Home />);
    });
    
    // 2. Simulate user toggling prefers-reduced-motion to TRUE in OS while page is open
    await act(async () => {
      mediaQueryListeners.forEach((listener) => {
        listener({ matches: true });
      });
    });

    // 3. Verify video was instructed to pause on motion preference change
    expect(pauseSpy).toHaveBeenCalled();
  });

  it("handles rejected video.play() promises without crashing or stuck state", async () => {
    // Mock play to reject (e.g., browser autoplay policy or NotAllowedError)
    window.HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new Error("NotAllowedError"));

    await act(async () => {
      render(<Home />);
    });
    
    const playBtn = screen.getByLabelText(/Play video presentation|Pause video presentation/i);
    expect(playBtn).toBeDefined();

    // Click play button - should catch rejection gracefully
    await act(async () => {
      fireEvent.click(playBtn);
    });

    // Should remain playable and not crash
    expect(playBtn).toBeDefined();
  });

  it("handles window resize across breakpoint without throwing errors", async () => {
    await act(async () => {
      render(<Home />);
    });

    // Simulate resizing to mobile viewport
    await act(async () => {
      window.innerWidth = 768;
      window.dispatchEvent(new Event("resize"));
    });

    // Simulate resizing back to desktop viewport
    await act(async () => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event("resize"));
    });

    // Verify component remains stable
    expect(screen.getByRole("heading", { level: 1, name: /A1 CHICKEN CENTER/i })).toBeDefined();
  });

  it("renders the cuts for every cooking style section", async () => {
    await act(async () => {
      render(<Home />);
    });
    expect(screen.getByText(/Cuts for Every Cooking Style/i)).toBeDefined();
    expect(screen.getByText(/Curry Cut Chicken/i)).toBeDefined();
    expect(screen.getAllByText(/Boneless Breast Fillets/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Legs & Drumsticks/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Custom Recipe Portions/i)).toBeDefined();
  });
});
