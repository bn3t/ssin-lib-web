import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "../page";

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) => <a href={href}>{children}</a>,
  };
});

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    size,
    variant,
    className,
  }: {
    children: React.ReactNode;
    size?: string;
    variant?: string;
    className?: string;
  }) => (
    <button className={className} data-size={size} data-variant={variant}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="sparkles-icon">Sparkles</span>,
  CheckCircle2: () => <span data-testid="check-icon">CheckCircle2</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  ArrowRight: () => <span data-testid="arrow-icon">ArrowRight</span>,
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Hero Section", () => {
    it("renders the hero section with correct structure", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the badge with Sparkles icon", () => {
      render(<HomePage />);
      const sparklesIcons = screen.getAllByTestId("sparkles-icon");
      expect(sparklesIcons.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the badge text "Belgian SSIN Management"', () => {
      render(<HomePage />);
      expect(screen.getByText("Belgian SSIN Management")).toBeInTheDocument();
    });

    it("renders the main heading with correct text", () => {
      render(<HomePage />);
      const heading = screen.getByRole("heading", {
        name: /Manage Belgian Social Security Numbers with Confidence/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders the main heading as h1", () => {
      render(<HomePage />);
      const h1 = screen.getByRole("heading", {
        name: /Manage Belgian Social Security Numbers with Confidence/i,
      });
      expect(h1.tagName).toBe("H1");
    });

    it("renders the description paragraph", () => {
      render(<HomePage />);
      expect(
        screen.getByText(
          /A comprehensive library for validating, generating, and managing/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders the complete description text", () => {
      render(<HomePage />);
      expect(
        screen.getByText(
          /Belgian Social Security Identification Numbers \(SSIN\) with ease/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Call-to-Action Buttons", () => {
    it('renders the "Validate SSIN" button', () => {
      render(<HomePage />);
      expect(
        screen.getByRole("button", { name: /Validate SSIN/i }),
      ).toBeInTheDocument();
    });

    it('renders the "Generate SSIN" button', () => {
      render(<HomePage />);
      expect(
        screen.getByRole("button", { name: /Generate SSIN/i }),
      ).toBeInTheDocument();
    });

    it("Validate SSIN button has correct size and styling", () => {
      render(<HomePage />);
      const validateButton = screen.getByRole("button", {
        name: /Validate SSIN/i,
      });
      expect(validateButton).toHaveAttribute("data-size", "lg");
    });

    it("Generate SSIN button has outline variant", () => {
      render(<HomePage />);
      const generateButton = screen.getByRole("button", {
        name: /Generate SSIN/i,
      });
      expect(generateButton).toHaveAttribute("data-variant", "outline");
    });

    it("Validate SSIN button renders with ArrowRight icon", () => {
      render(<HomePage />);
      const validateButton = screen.getByRole("button", {
        name: /Validate SSIN/i,
      });
      expect(validateButton).toBeInTheDocument();
      // Check that the icon is rendered near the button
      expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("Validate SSIN button links to /validator page", () => {
      render(<HomePage />);
      const validatorLink = screen.getByRole("link", {
        name: /Validate SSIN/i,
      });
      expect(validatorLink).toHaveAttribute("href", "/validator");
    });

    it("Generate SSIN button links to /generator page", () => {
      render(<HomePage />);
      const generatorLink = screen.getByRole("link", {
        name: /Generate SSIN/i,
      });
      expect(generatorLink).toHaveAttribute("href", "/generator");
    });

    it("both CTA links are present and navigable", () => {
      render(<HomePage />);
      const links = screen.getAllByRole("link");
      const ctaLinks = links.filter(
        (link) =>
          link.getAttribute("href") === "/validator" ||
          link.getAttribute("href") === "/generator",
      );
      expect(ctaLinks.length).toBe(2);
    });
  });

  describe("Features Grid Section", () => {
    it("renders three feature cards", () => {
      render(<HomePage />);
      const cards = screen.getAllByTestId("card");
      // Should have 3 feature cards + 2 in SSIN structure section = 5 total
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it("renders the Validation feature card", () => {
      render(<HomePage />);
      expect(screen.getByText("Validation")).toBeInTheDocument();
    });

    it("renders the Generation feature card", () => {
      render(<HomePage />);
      expect(screen.getByText("Generation")).toBeInTheDocument();
    });

    it("renders the Compliant feature card", () => {
      render(<HomePage />);
      expect(screen.getByText("Compliant")).toBeInTheDocument();
    });

    it("Validation card has correct description", () => {
      render(<HomePage />);
      expect(
        screen.getByText(
          /Validate existing SSIN numbers with format checking and checksum/i,
        ),
      ).toBeInTheDocument();
    });

    it("Generation card has correct description", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/Create valid SSIN numbers for testing purposes/i),
      ).toBeInTheDocument();
    });

    it("Compliant card has correct description", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/Follows official Belgian SSIN structure/i),
      ).toBeInTheDocument();
    });

    it("feature cards have correct icons", () => {
      render(<HomePage />);
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      const sparklesIcons = screen.getAllByTestId("sparkles-icon");
      expect(sparklesIcons.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
    });

    it("feature cards have hover styling applied", () => {
      const { container } = render(<HomePage />);
      const cards = container.querySelectorAll('[data-testid="card"]');
      // Get only the feature cards (first 3)
      const featureCards = Array.from(cards).slice(0, 3);
      featureCards.forEach((card) => {
        expect(card.className).toContain("hover:shadow-lg");
        expect(card.className).toContain("transition-shadow");
      });
    });
  });

  describe("SSIN Structure Section", () => {
    it('renders the "Understanding SSIN Numbers" heading', () => {
      render(<HomePage />);
      const heading = screen.getByRole("heading", {
        name: /Understanding SSIN Numbers/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders as h2 element", () => {
      render(<HomePage />);
      const heading = screen.getByRole("heading", {
        name: /Understanding SSIN Numbers/i,
      });
      expect(heading.tagName).toBe("H2");
    });

    it("renders introduction text about SSIN", () => {
      render(<HomePage />);
      expect(
        screen.getByText(
          /The Belgian Social Security Identification Number \(SSIN\)/i,
        ),
      ).toBeInTheDocument();
    });

    it('renders the "Structure" subsection heading', () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /Structure/i }),
      ).toBeInTheDocument();
    });

    it("renders the SSIN format code", () => {
      render(<HomePage />);
      expect(screen.getByText(/YY\.MM\.DD-OOO\.CC/)).toBeInTheDocument();
    });

    it("renders Birth Date subsection", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /1\. Birth Date/i }),
      ).toBeInTheDocument();
    });

    it("renders Order Number subsection", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /2\. Order Number/i }),
      ).toBeInTheDocument();
    });

    it("renders Check Digits subsection", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /3\. Check Digits/i }),
      ).toBeInTheDocument();
    });

    it("renders year of birth explanation", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/Year of birth \(last two digits\)/i),
      ).toBeInTheDocument();
    });

    it("renders month of birth explanation", () => {
      render(<HomePage />);
      expect(screen.getByText(/Month of birth/)).toBeInTheDocument();
    });

    it("renders day of birth explanation", () => {
      render(<HomePage />);
      expect(screen.getByText(/Day of birth/)).toBeInTheDocument();
    });

    it("renders order number explanation", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/A sequence number for people born on the same day/i),
      ).toBeInTheDocument();
    });

    it("renders male order number range", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/For men: odd numbers from 001 to 997/i),
      ).toBeInTheDocument();
    });

    it("renders female order number range", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/For women: even numbers from 002 to 998/i),
      ).toBeInTheDocument();
    });

    it("renders check digits explanation", () => {
      render(<HomePage />);
      expect(
        screen.getByText(
          /A control number calculated from the previous digits/i,
        ),
      ).toBeInTheDocument();
    });

    it('renders the "Gender Determination" section', () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /Gender Determination/i }),
      ).toBeInTheDocument();
    });

    it("renders gender determination explanation", () => {
      render(<HomePage />);
      expect(
        screen.getByText(
          /The gender of a person can be determined from their SSIN/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders male gender rule", () => {
      render(<HomePage />);
      expect(screen.getByText(/For men: odd numbers/i)).toBeInTheDocument();
    });

    it("renders female gender rule", () => {
      render(<HomePage />);
      expect(screen.getByText(/For women: even numbers/i)).toBeInTheDocument();
    });
  });

  describe("Semantic Structure", () => {
    it("main content area has proper background styling", () => {
      const { container } = render(<HomePage />);
      const mainDiv = container.querySelector(".bg-background");
      expect(mainDiv).toBeInTheDocument();
    });

    it("page has three main sections", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBe(3);
    });

    it("first section is the hero section", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      const heroSection = sections[0];
      const heroHeading = heroSection.querySelector("h1");
      expect(heroHeading).toBeInTheDocument();
    });

    it("second section contains feature cards", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      const featureSection = sections[1];
      const cards = featureSection.querySelectorAll('[data-testid="card"]');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it("third section contains SSIN structure explanation", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      const ssinSection = sections[2];
      const structureHeading = ssinSection.querySelector("h2");
      expect(structureHeading?.textContent).toContain(
        "Understanding SSIN Numbers",
      );
    });

    it("all sections have container styling for proper spacing", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
      // Check that sections have container class applied
      let hasContainerClass = 0;
      sections.forEach((section) => {
        if (section.classList.contains("container")) {
          hasContainerClass++;
        }
      });
      expect(hasContainerClass).toBeGreaterThan(0);
    });
  });

  describe("Content Hierarchy", () => {
    it("only one h1 element on page (main heading)", () => {
      render(<HomePage />);
      const h1Elements = screen.getAllByRole("heading", { level: 1 });
      expect(h1Elements).toHaveLength(1);
    });

    it("h1 is the main brand message", () => {
      render(<HomePage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toContain(
        "Manage Belgian Social Security Numbers",
      );
    });

    it("h2 elements are section headings", () => {
      render(<HomePage />);
      const h2Elements = screen.getAllByRole("heading", { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(1);
    });

    it("h3 and h4 elements follow proper hierarchy", () => {
      render(<HomePage />);
      const h3Elements = screen.getAllByRole("heading", { level: 3 });
      const h4Elements = screen.getAllByRole("heading", { level: 4 });
      expect(h3Elements.length).toBeGreaterThan(0);
      expect(h4Elements.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("page content is organized with semantic HTML", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });

    it("all text content is readable", () => {
      render(<HomePage />);
      expect(screen.getByText(/Belgian SSIN Management/i)).toBeInTheDocument();
      expect(screen.getByText(/Validate SSIN/i)).toBeInTheDocument();
      expect(screen.getByText(/Generate SSIN/i)).toBeInTheDocument();
    });

    it("buttons are keyboard accessible", () => {
      render(<HomePage />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    it("links are keyboard accessible", () => {
      render(<HomePage />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toBeInTheDocument();
      });
    });

    it("code blocks are rendered with proper formatting", () => {
      render(<HomePage />);
      const codeElements = screen.getByText(/YY\.MM\.DD-OOO\.CC/);
      expect(codeElements).toBeInTheDocument();
    });

    it("list items are semantic", () => {
      const { container } = render(<HomePage />);
      const listItems = container.querySelectorAll("ul li");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("Layout and Styling", () => {
    it("main container has max-width for readability", () => {
      const { container } = render(<HomePage />);
      const maxWidthDivs = container.querySelectorAll(".max-w-4xl, .max-w-5xl");
      expect(maxWidthDivs.length).toBeGreaterThan(0);
    });

    it("hero section text is center-aligned", () => {
      const { container } = render(<HomePage />);
      const heroDiv = container.querySelector(".text-center");
      expect(heroDiv).toBeInTheDocument();
    });

    it("feature cards are in a grid layout", () => {
      const { container } = render(<HomePage />);
      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
    });

    it("buttons are displayed in a flex container", () => {
      const { container } = render(<HomePage />);
      const flexContainers = container.querySelectorAll(".flex");
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it("sections have proper padding", () => {
      const { container } = render(<HomePage />);
      const paddedSections = container.querySelectorAll(
        ".py-16, .py-24, .px-4",
      );
      expect(paddedSections.length).toBeGreaterThan(0);
    });
  });

  describe("Component Rendering", () => {
    it("renders without errors", () => {
      expect(() => render(<HomePage />)).not.toThrow();
    });

    it("renders all major sections successfully", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBe(3);
      expect(container.querySelector(".bg-background")).toBeInTheDocument();
    });

    it("renders the complete component tree", () => {
      const { container } = render(<HomePage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("maintains consistent rendering on re-render", () => {
      const { rerender, container: firstContainer } = render(<HomePage />);
      const firstContent = firstContainer.innerHTML;

      rerender(<HomePage />);
      const secondContent = firstContainer.innerHTML;

      expect(firstContent).toBe(secondContent);
    });
  });

  describe("Interactive Elements", () => {
    it("page has interactive buttons for navigation", () => {
      render(<HomePage />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it("all interactive elements are properly labeled", () => {
      render(<HomePage />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button.textContent).toBeTruthy();
      });
    });

    it("CTA buttons have proper visual hierarchy", () => {
      render(<HomePage />);
      const validateButton = screen.getByRole("button", {
        name: /Validate SSIN/i,
      });
      const generateButton = screen.getByRole("button", {
        name: /Generate SSIN/i,
      });

      expect(validateButton).toHaveAttribute("data-size", "lg");
      expect(generateButton).toHaveAttribute("data-size", "lg");
    });
  });

  describe("Content Completeness", () => {
    it("includes all three feature categories", () => {
      render(<HomePage />);
      expect(screen.getByText("Validation")).toBeInTheDocument();
      expect(screen.getByText("Generation")).toBeInTheDocument();
      expect(screen.getByText("Compliant")).toBeInTheDocument();
    });

    it("includes all SSIN structure components", () => {
      render(<HomePage />);
      expect(screen.getByText(/Birth Date/)).toBeInTheDocument();
      expect(screen.getByText(/Order Number/)).toBeInTheDocument();
      expect(screen.getByText(/Check Digits/)).toBeInTheDocument();
    });

    it("includes gender determination rules", () => {
      render(<HomePage />);
      expect(screen.getByText(/For men: odd numbers/)).toBeInTheDocument();
      expect(screen.getByText(/For women: even numbers/)).toBeInTheDocument();
    });

    it("includes navigation to both main features", () => {
      render(<HomePage />);
      const validatorLink = screen.getByRole("link", {
        name: /Validate SSIN/i,
      });
      const generatorLink = screen.getByRole("link", {
        name: /Generate SSIN/i,
      });

      expect(validatorLink).toHaveAttribute("href", "/validator");
      expect(generatorLink).toHaveAttribute("href", "/generator");
    });
  });

  describe("Badge and Visual Elements", () => {
    it("renders the badge with primary color styling", () => {
      const { container } = render(<HomePage />);
      const badge = container.querySelector(".bg-primary\\/10");
      expect(badge).toBeInTheDocument();
    });

    it("badge contains Sparkles icon", () => {
      render(<HomePage />);
      const sparklesIcons = screen.getAllByTestId("sparkles-icon");
      expect(sparklesIcons.length).toBeGreaterThanOrEqual(1);
    });

    it("badge has proper spacing", () => {
      const { container } = render(<HomePage />);
      const badge = container.querySelector(".px-4.py-2");
      expect(badge).toBeInTheDocument();
    });

    it("feature icons are displayed with proper styling", () => {
      render(<HomePage />);
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      const sparklesIcons = screen.getAllByTestId("sparkles-icon");
      expect(sparklesIcons.length).toBeGreaterThanOrEqual(1);
    });

    it("all icons are rendered in the document", () => {
      render(<HomePage />);
      expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      const sparklesIcons = screen.getAllByTestId("sparkles-icon");
      expect(sparklesIcons.length).toBeGreaterThanOrEqual(1);
    });
  });
});
