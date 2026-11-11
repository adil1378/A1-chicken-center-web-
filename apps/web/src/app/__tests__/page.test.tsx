import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("HomePage Component", () => {
  it("renders brand name and tagline accurately", () => {
    render(<Home />);
    
    // Check brand name
    expect(screen.getByRole("heading", { level: 1, name: /A1 CHICKEN CENTER/i })).toBeDefined();
    
    // Check tagline
    expect(screen.getByText(/Freshness You Can Trust\./i)).toBeDefined();
  });

  it("displays Phase 1 of 8 indicator", () => {
    render(<Home />);
    expect(screen.getByText(/Phase 1 of 8/i)).toBeDefined();
    expect(screen.getByText(/Foundation & Architecture Initialized/i)).toBeDefined();
  });

  it("displays architectural foundations for Frontend, Backend, and Database", () => {
    render(<Home />);
    expect(screen.getByText(/Next\.js App Router/i)).toBeDefined();
    expect(screen.getByText(/FastAPI \(Python 3\.12\+\)/i)).toBeDefined();
    const dbElements = screen.getAllByText(/Supabase PostgreSQL/i);
    expect(dbElements.length).toBeGreaterThanOrEqual(1);
  });
});
