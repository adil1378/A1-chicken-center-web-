import React from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { gsap } from "gsap";
import Home from "../page";

/**
 * High-fidelity matchMedia controller that accurately evaluates
 * min-width, max-width, prefers-reduced-motion and compound queries,
 * and notifies active listeners on environment changes.
 */
class MatchMediaController {
  private width: number;
  private reducedMotion: boolean;
  private listeners: Map<string, Set<(e: MediaQueryListEvent) => void>>;

  constructor(initialWidth = 1440, initialReducedMotion = false) {
    this.width = initialWidth;
    this.reducedMotion = initialReducedMotion;
    this.listeners = new Map();
  }

  evaluate(query: string, width = this.width, reducedMotion = this.reducedMotion): boolean {
    const orParts = query.split(",").map((s) => s.trim());
    return orParts.some((part) => {
      const andParts = part.split(/\sand\s/i).map((s) => s.trim());
      return andParts.every((clause) => {
        if (clause.includes("min-width")) {
          const match = clause.match(/min-width:\s*(\d+)px/);
          return match ? width >= parseInt(match[1], 10) : false;
        }
        if (clause.includes("max-width")) {
          const match = clause.match(/max-width:\s*(\d+)px/);
          return match ? width <= parseInt(match[1], 10) : false;
        }
        if (clause.includes("prefers-reduced-motion: reduce")) {
          return reducedMotion === true;
        }
        if (clause.includes("prefers-reduced-motion: no-preference")) {
          return reducedMotion === false;
        }
        return false;
      });
    });
  }

  evaluateWith(query: string, w: number, rm: boolean): boolean {
    return this.evaluate(query, w, rm);
  }

  setEnvironment({ width, reducedMotion }: { width?: number; reducedMotion?: boolean }) {
    const prevWidth = this.width;
    const prevReduced = this.reducedMotion;

    if (width !== undefined) {
      this.width = width;
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width });
    }
    if (reducedMotion !== undefined) {
      this.reducedMotion = reducedMotion;
    }

    this.listeners.forEach((callbacks, query) => {
      const prevMatch = this.evaluateWith(query, prevWidth, prevReduced);
      const nextMatch = this.evaluate(query);
      if (prevMatch !== nextMatch) {
        callbacks.forEach((cb) => {
          cb({ matches: nextMatch, media: query } as MediaQueryListEvent);
        });
      }
    });

    window.dispatchEvent(new Event("resize"));
  }

  createMock() {
    return (query: string): MediaQueryList => {
      const self = this;
      if (!this.listeners.has(query)) {
        this.listeners.set(query, new Set());
      }
      return {
        get matches() {
          return self.evaluate(query);
        },
        media: query,
        onchange: null,
        addListener: (listener: any) => {
          if (typeof listener === "function") {
            self.listeners.get(query)?.add(listener);
          }
        },
        removeListener: (listener: any) => {
          if (typeof listener === "function") {
            self.listeners.get(query)?.delete(listener);
          }
        },
        addEventListener: (type: string, listener: any) => {
          if (type === "change" && typeof listener === "function") {
            self.listeners.get(query)?.add(listener);
          }
        },
        removeEventListener: (type: string, listener: any) => {
          if (type === "change" && typeof listener === "function") {
            self.listeners.get(query)?.delete(listener);
          }
        },
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList;
    };
  }

  getActiveListenerCount(): number {
    let count = 0;
    this.listeners.forEach((set) => {
      count += set.size;
    });
    return count;
  }
}

let controller: MatchMediaController;

beforeEach(() => {
  controller = new MatchMediaController(1440, false);
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1440 });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: controller.createMock(),
  });

  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  window.scrollTo = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Phase 2 Cinematic Landing Page & Animations", () => {
  it("verifies MatchMediaController correctly evaluates compound and comma-separated queries", () => {
    // 1. Compound 'and' query
    expect(controller.evaluateWith("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", 1440, false)).toBe(true);
    expect(controller.evaluateWith("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", 800, false)).toBe(false);
    expect(controller.evaluateWith("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", 1440, true)).toBe(false);

    // 2. Comma-separated 'or' query with compound clauses
    const mobileOrReduced = "(max-width: 1023px), (prefers-reduced-motion: reduce)";
    expect(controller.evaluateWith(mobileOrReduced, 800, false)).toBe(true);
    expect(controller.evaluateWith(mobileOrReduced, 1440, true)).toBe(true);
    expect(controller.evaluateWith(mobileOrReduced, 1440, false)).toBe(false);
  });

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
    
    const wholeChickenImages = screen.getAllByAltText(/Complete whole dressed chicken prior to butchering|Whole dressed chicken before separation/i);
    expect(wholeChickenImages.length).toBeGreaterThanOrEqual(1);
    
    const wholeChickenLabels = screen.getAllByText(/Whole Dressed Chicken/i);
    expect(wholeChickenLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Starting Cut/i)).toBeDefined();
  });

  it("verifies mobile cut selector uses role='group' and accessible aria-pressed states", async () => {
    await act(async () => {
      render(<Home />);
    });

    const cutSelectorGroup = screen.getByRole("group", { name: /Mobile cut selector buttons/i });
    expect(cutSelectorGroup).toBeDefined();

    // Initial state: Breast Fillet selected
    const breastBtn = within(cutSelectorGroup).getByRole("button", { name: /Select Boneless Breast Fillet/i });
    expect(breastBtn.getAttribute("aria-pressed")).toBe("true");

    // Drumstick button initially unselected
    const drumstickBtn = within(cutSelectorGroup).getByRole("button", { name: /Select Fresh Drumstick Cut/i });
    expect(drumstickBtn.getAttribute("aria-pressed")).toBe("false");

    // Click drumstick button
    await act(async () => {
      fireEvent.click(drumstickBtn);
    });

    // Assert pressed state flipped
    expect(drumstickBtn.getAttribute("aria-pressed")).toBe("true");
    expect(breastBtn.getAttribute("aria-pressed")).toBe("false");

    // Assert cut details updated in mobile view
    expect(screen.getAllByText(/Bone-in Dark Meat/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dum Biryani, Slow Gravies, Roasts/i).length).toBeGreaterThanOrEqual(1);

    // Switch to Curry Cut pieces
    const curryBtn = within(cutSelectorGroup).getByRole("button", { name: /Select Uniform Curry Pieces/i });
    await act(async () => {
      fireEvent.click(curryBtn);
    });
    expect(curryBtn.getAttribute("aria-pressed")).toBe("true");
    expect(drumstickBtn.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getAllByText(/Home Curries, Handi, Korma/i).length).toBeGreaterThanOrEqual(1);
  });

  it("verifies butcher cutting sequence uses role='group' and accessible aria-pressed states", async () => {
    await act(async () => {
      render(<Home />);
    });

    const stepGroup = screen.getByRole("group", { name: /Butcher cutting sequence stages/i });
    expect(stepGroup).toBeDefined();

    // Step 1 initial
    const step1Btn = within(stepGroup).getByRole("button", { name: /Select cut step 01: Whole Dressed Chicken/i });
    expect(step1Btn.getAttribute("aria-pressed")).toBe("true");

    // Step 2
    const step2Btn = within(stepGroup).getByRole("button", { name: /Select cut step 02: Legs & Drumsticks/i });
    expect(step2Btn.getAttribute("aria-pressed")).toBe("false");

    await act(async () => {
      fireEvent.click(step2Btn);
    });
    expect(step2Btn.getAttribute("aria-pressed")).toBe("true");
    expect(step1Btn.getAttribute("aria-pressed")).toBe("false");
  });

  it("verifies rejected video.play() leaves the control in the Play state", async () => {
    // Mock play to reject with NotAllowedError before rendering
    window.HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new Error("NotAllowedError"));

    await act(async () => {
      render(<Home />);
    });
    
    // Autoplay rejected: control should immediately show "Play"
    const playBtn = screen.getByLabelText(/Play video presentation/i);
    expect(playBtn).toBeDefined();

    // User attempts to click Play button
    await act(async () => {
      fireEvent.click(playBtn);
    });

    // Control should remain in "Play" state
    expect(screen.getByLabelText(/Play video presentation/i)).toBeDefined();
    expect(screen.queryByLabelText(/Pause video presentation/i)).toBeNull();
  });

  it("verifies explicit reduced-motion transition pauses video and disables GSAP timeline", async () => {
    controller.setEnvironment({ width: 1440, reducedMotion: false });
    const pauseSpy = vi.spyOn(window.HTMLMediaElement.prototype, "pause");

    let activeTimeline: gsap.core.Timeline | null = null;
    const origTimeline = gsap.timeline;
    vi.spyOn(gsap, "timeline").mockImplementation((...args) => {
      const tl = origTimeline.apply(gsap, args);
      activeTimeline = tl;
      vi.spyOn(tl, "kill");
      return tl;
    });

    await act(async () => {
      render(<Home />);
    });

    expect(activeTimeline).not.toBeNull();
    const killSpy = vi.spyOn(activeTimeline!, "kill");

    // Toggle reduced motion to TRUE dynamically while page is active
    await act(async () => {
      controller.setEnvironment({ reducedMotion: true });
    });

    // 1. Assert video was paused
    expect(pauseSpy).toHaveBeenCalled();
    // 2. Assert play control reflects Play state
    expect(screen.getByLabelText(/Play video presentation/i)).toBeDefined();
    // 3. Assert desktop GSAP timeline was killed
    expect(killSpy).toHaveBeenCalled();
  });

  it("tests actual desktop -> mobile -> desktop media-query transitions with GSAP kill and reconstruction", async () => {
    let latestTimeline: gsap.core.Timeline | null = null;
    const origTimeline = gsap.timeline;
    const timelineSpy = vi.spyOn(gsap, "timeline").mockImplementation((...args) => {
      const tl = origTimeline.apply(gsap, args);
      latestTimeline = tl;
      vi.spyOn(tl, "kill");
      return tl;
    });

    // 1. Initial desktop render
    controller.setEnvironment({ width: 1440, reducedMotion: false });
    await act(async () => {
      render(<Home />);
    });

    expect(latestTimeline).not.toBeNull();
    const firstTimelineKillSpy = vi.spyOn(latestTimeline!, "kill");
    const initialTimelineCalls = timelineSpy.mock.calls.length;
    expect(initialTimelineCalls).toBeGreaterThanOrEqual(1);

    // 2. Transition to mobile viewport (390px)
    await act(async () => {
      controller.setEnvironment({ width: 390 });
    });

    // Verify the desktop timeline was explicitly killed during transition to mobile
    expect(firstTimelineKillSpy).toHaveBeenCalled();

    // 3. Transition back to desktop viewport (1440px)
    await act(async () => {
      controller.setEnvironment({ width: 1440 });
    });

    // Verify GSAP timeline was reconstructed fresh for desktop
    expect(timelineSpy.mock.calls.length).toBeGreaterThan(initialTimelineCalls);
  });

  it("verifies component unmount cleanup triggers mm.revert() and removes all listeners", async () => {
    let matchMediaInstance: any = null;
    const origMatchMedia = gsap.matchMedia;
    const revertSpy = vi.fn();

    vi.spyOn(gsap, "matchMedia").mockImplementation((...args) => {
      const instance = origMatchMedia.apply(gsap, args);
      matchMediaInstance = instance;
      const origRevert = instance.revert.bind(instance);
      instance.revert = () => {
        revertSpy();
        origRevert();
      };
      return instance;
    });

    let unmountFn: () => void = () => {};
    await act(async () => {
      const { unmount } = render(<Home />);
      unmountFn = unmount;
    });

    expect(controller.getActiveListenerCount()).toBeGreaterThan(0);
    expect(matchMediaInstance).not.toBeNull();

    // Unmount component
    await act(async () => {
      unmountFn();
    });

    // Verify GSAP matchMedia.revert() was invoked
    expect(revertSpy).toHaveBeenCalled();

    // Verify all media query listeners have been cleanly removed
    expect(controller.getActiveListenerCount()).toBe(0);
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
