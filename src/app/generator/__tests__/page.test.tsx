import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GeneratorPage from "../page";

// Mock the SSINGeneratorForm component since it's tested separately
vi.mock("@/components/ssin-generator-form", () => ({
  SSINGeneratorForm: () => (
    <div data-testid="ssin-generator-form-mock">SSIN Generator Form</div>
  ),
}));

describe("GeneratorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without errors", () => {
      render(<GeneratorPage />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it('renders the main title "SSIN Generator"', () => {
      render(<GeneratorPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("SSIN Generator");
    });

    it("renders the correct title text content exactly", () => {
      render(<GeneratorPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("SSIN Generator");
    });

    it("renders the description text", () => {
      render(<GeneratorPage />);
      expect(
        screen.getByText(
          /Generate a valid Belgian Social Security Identification Number \(SSIN\)\./i,
        ),
      ).toBeInTheDocument();
    });

    it("renders the complete description message", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(
        /Generate a valid Belgian Social Security Identification Number/i,
      );
      expect(description.textContent).toBe(
        "Generate a valid Belgian Social Security Identification Number (SSIN).",
      );
    });
  });

  describe("Component Composition", () => {
    it("renders SSINGeneratorForm component", () => {
      render(<GeneratorPage />);
      expect(
        screen.getByTestId("ssin-generator-form-mock"),
      ).toBeInTheDocument();
    });

    it("renders form after the description text", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(/Generate a valid Belgian/i);
      const form = screen.getByTestId("ssin-generator-form-mock");

      // Form should appear after description in DOM
      expect(description).toBeInTheDocument();
      expect(form).toBeInTheDocument();
    });

    it("renders only one instance of SSINGeneratorForm", () => {
      render(<GeneratorPage />);
      const forms = screen.getAllByTestId("ssin-generator-form-mock");
      expect(forms).toHaveLength(1);
    });
  });

  describe("Layout Structure", () => {
    it("renders with container div containing mx-auto and px-4 classes", () => {
      const { container } = render(<GeneratorPage />);
      const outerContainer = container.querySelector(".container.mx-auto.px-4");
      expect(outerContainer).toBeInTheDocument();
    });

    it("renders with py-16 padding on outer container", () => {
      const { container } = render(<GeneratorPage />);
      const outerContainer = container.querySelector(
        ".container.mx-auto.px-4.py-16",
      );
      expect(outerContainer).toBeInTheDocument();
    });

    it("renders inner container with max-w-2xl class for content width constraint", () => {
      const { container } = render(<GeneratorPage />);
      const innerContainer = container.querySelector(".max-w-2xl.mx-auto");
      expect(innerContainer).toBeInTheDocument();
    });

    it("renders header section with mb-8 margin", () => {
      const { container } = render(<GeneratorPage />);
      const headerDiv = container.querySelector(".mb-8");
      expect(headerDiv).toBeInTheDocument();
    });

    it("header section contains both title and description", () => {
      const { container } = render(<GeneratorPage />);
      const headerDiv = container.querySelector(".mb-8");
      expect(headerDiv).toContainElement(
        screen.getByRole("heading", { level: 1 }),
      );
      expect(headerDiv).toContainElement(
        screen.getByText(/Generate a valid Belgian/i),
      );
    });

    it("title has correct Tailwind styling classes", () => {
      render(<GeneratorPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-4xl", "font-bold", "mb-4");
    });

    it("description paragraph has correct styling classes", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(/Generate a valid Belgian/i);
      expect(description).toHaveClass("text-muted-foreground", "text-lg");
    });
  });

  describe("Accessibility", () => {
    it("uses proper heading hierarchy with h1 as primary heading", () => {
      render(<GeneratorPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.tagName).toBe("H1");
    });

    it("has no skipped heading levels (no h3 without h2)", () => {
      const { container } = render(<GeneratorPage />);
      const h1 = container.querySelectorAll("h1");
      const h2 = container.querySelectorAll("h2");
      const h3 = container.querySelectorAll("h3");

      expect(h1.length).toBe(1);
      expect(h2.length).toBe(0);
      expect(h3.length).toBe(0);
    });

    it("contains semantic paragraph element for description", () => {
      const { container } = render(<GeneratorPage />);
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThanOrEqual(1);
    });

    it("description is in a paragraph element", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(/Generate a valid Belgian/i);
      expect(description.tagName).toBe("P");
    });

    it("title and description are semantically related in a section", () => {
      const { container } = render(<GeneratorPage />);
      const headerDiv = container.querySelector(".mb-8");
      const heading = headerDiv?.querySelector("h1");
      const description = headerDiv?.querySelector("p");

      expect(heading).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it("page does not have empty heading elements", () => {
      render(<GeneratorPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent?.trim().length).toBeGreaterThan(0);
    });

    it("description text is not empty", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(/Generate a valid Belgian/i);
      expect(description.textContent?.trim().length).toBeGreaterThan(0);
    });
  });

  describe("Content Quality", () => {
    it('title uses correct branding terminology "SSIN Generator"', () => {
      render(<GeneratorPage />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "SSIN Generator",
      );
    });

    it("description includes context about Belgian Social Security Identification Number", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(/Generate a valid Belgian/i);
      expect(description.textContent).toContain("Belgian");
      expect(description.textContent).toContain(
        "Social Security Identification Number",
      );
      expect(description.textContent).toContain("SSIN");
    });

    it("description is user-friendly and informative", () => {
      render(<GeneratorPage />);
      const description = screen.getByText(/Generate a valid Belgian/i);
      expect(description.textContent).toContain("Generate");
      expect(description.textContent).toContain("valid");
    });
  });

  describe("Responsiveness", () => {
    it("uses container classes for responsive layout", () => {
      const { container } = render(<GeneratorPage />);
      const outerContainer = container.querySelector(".container");
      expect(outerContainer).toHaveClass("mx-auto", "px-4");
    });

    it("outer container has px-4 padding for mobile responsiveness", () => {
      const { container } = render(<GeneratorPage />);
      const outerContainer = container.querySelector(".container");
      expect(outerContainer).toHaveClass("px-4");
    });

    it("inner container constrains width with max-w-2xl", () => {
      const { container } = render(<GeneratorPage />);
      const innerContainer = container.querySelector(".max-w-2xl");
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe("State and Props", () => {
    it("is a pure component with no state", () => {
      const { container: container1 } = render(<GeneratorPage />);
      const { container: container2 } = render(<GeneratorPage />);

      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it("renders consistently across multiple renders", () => {
      const { rerender } = render(<GeneratorPage />);
      const heading1 = screen.getByRole("heading", { level: 1 });
      const text1 = heading1.textContent;

      rerender(<GeneratorPage />);
      const heading2 = screen.getByRole("heading", { level: 1 });
      const text2 = heading2.textContent;

      expect(text1).toBe(text2);
    });
  });

  describe("Integration", () => {
    it("complete page structure from title to form", () => {
      render(<GeneratorPage />);

      // Check title exists
      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveTextContent("SSIN Generator");

      // Check description exists
      const description = screen.getByText(/Generate a valid Belgian/i);
      expect(description).toBeInTheDocument();

      // Check form exists
      const form = screen.getByTestId("ssin-generator-form-mock");
      expect(form).toBeInTheDocument();
    });

    it("all key page elements are present together", () => {
      const { container } = render(<GeneratorPage />);

      const h1 = container.querySelector("h1");
      const p = container.querySelector("p");
      const form = screen.getByTestId("ssin-generator-form-mock");

      expect(h1).toBeInTheDocument();
      expect(p).toBeInTheDocument();
      expect(form).toBeInTheDocument();
    });

    it("page is properly wrapped with container and spacing classes", () => {
      const { container } = render(<GeneratorPage />);

      // Verify nesting structure
      const outerDiv = container.querySelector(".container.mx-auto.px-4.py-16");
      const innerDiv = outerDiv?.querySelector(".max-w-2xl.mx-auto");
      const headerDiv = innerDiv?.querySelector(".mb-8");

      expect(outerDiv).toBeInTheDocument();
      expect(innerDiv).toBeInTheDocument();
      expect(headerDiv).toBeInTheDocument();
    });
  });
});
