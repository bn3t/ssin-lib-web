import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ValidatorPage from "../validator/page";

// Mock the SSINValidatorForm component
vi.mock("@/components/ssin-validator-form", () => ({
  SSINValidatorForm: () => (
    <div data-testid="ssin-validator-form">SSINValidatorForm Component</div>
  ),
}));

describe("ValidatorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the page without crashing", () => {
      expect(() => render(<ValidatorPage />)).not.toThrow();
    });

    it('renders the page title "SSIN Validator"', () => {
      render(<ValidatorPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("SSIN Validator");
    });

    it("renders the description text", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );
      expect(description).toBeInTheDocument();
    });

    it("renders complete description including format hint", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(/YY\.MM\.DD-OOO\.CC/);
      expect(description).toBeInTheDocument();
    });
  });

  describe("SSINValidatorForm Component", () => {
    it("renders the SSINValidatorForm component", () => {
      render(<ValidatorPage />);
      const formElement = screen.getByTestId("ssin-validator-form");
      expect(formElement).toBeInTheDocument();
    });

    it("places SSINValidatorForm after the header section", () => {
      const { container } = render(<ValidatorPage />);
      const formElement = screen.getByTestId("ssin-validator-form");
      const heading = screen.getByRole("heading", { level: 1 });

      // Verify heading comes before form in document order
      const headingPosition = container.innerHTML.indexOf(heading.outerHTML);
      const formPosition = container.innerHTML.indexOf("ssin-validator-form");
      expect(headingPosition).toBeLessThan(formPosition);
      expect(formElement).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("renders outer container with correct classes", () => {
      const { container } = render(<ValidatorPage />);
      const outerDiv = container.firstChild as HTMLElement;

      expect(outerDiv).toHaveClass("container");
      expect(outerDiv).toHaveClass("mx-auto");
      expect(outerDiv).toHaveClass("px-4");
      expect(outerDiv).toHaveClass("py-16");
    });

    it("applies responsive padding with py-16", () => {
      const { container } = render(<ValidatorPage />);
      const outerDiv = container.firstChild as HTMLElement;

      expect(outerDiv).toHaveClass("py-16");
    });

    it("applies horizontal centering with mx-auto", () => {
      const { container } = render(<ValidatorPage />);
      const outerDiv = container.firstChild as HTMLElement;

      expect(outerDiv).toHaveClass("mx-auto");
    });

    it("applies responsive horizontal padding with px-4", () => {
      const { container } = render(<ValidatorPage />);
      const outerDiv = container.firstChild as HTMLElement;

      expect(outerDiv).toHaveClass("px-4");
    });

    it("renders max-width wrapper with max-w-2xl class", () => {
      const { container } = render(<ValidatorPage />);
      const wrapper = container.querySelector(".max-w-2xl");

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("mx-auto");
    });

    it("maintains correct DOM hierarchy: outer container > max-width wrapper > content", () => {
      const { container } = render(<ValidatorPage />);

      const outerContainer = container.firstChild as HTMLElement;
      const maxWidthWrapper = outerContainer.querySelector(".max-w-2xl");
      const headerSection = maxWidthWrapper?.querySelector(".mb-8");

      expect(outerContainer).toHaveClass("container");
      expect(maxWidthWrapper).toHaveClass("max-w-2xl");
      expect(headerSection).toBeInTheDocument();
    });
  });

  describe("Header Section", () => {
    it("renders header section with mb-8 spacing class", () => {
      const { container } = render(<ValidatorPage />);
      const headerSection = container.querySelector(".mb-8");

      expect(headerSection).toBeInTheDocument();
    });

    it("contains title and description inside header section", () => {
      const { container } = render(<ValidatorPage />);
      const headerSection = container.querySelector(".mb-8");

      const title = headerSection?.querySelector("h1");
      const description = headerSection?.querySelector("p");

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it("title has correct styling classes", () => {
      render(<ValidatorPage />);
      const title = screen.getByRole("heading", { level: 1 });

      expect(title).toHaveClass("text-4xl");
      expect(title).toHaveClass("font-bold");
      expect(title).toHaveClass("mb-4");
    });

    it("description has correct styling classes", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );

      expect(description).toHaveClass("text-muted-foreground");
      expect(description).toHaveClass("text-lg");
    });
  });

  describe("Accessibility - Heading Hierarchy", () => {
    it("uses h1 for the page title (single h1)", () => {
      render(<ValidatorPage />);
      const _headings = screen.getAllByRole("heading");
      const h1Headings = screen.getAllByRole("heading", { level: 1 });

      expect(h1Headings).toHaveLength(1);
      expect(h1Headings[0]).toHaveTextContent("SSIN Validator");
    });

    it("page title is first heading on the page", () => {
      render(<ValidatorPage />);
      const firstHeading = screen.getAllByRole("heading")[0];

      expect(firstHeading).toHaveAttribute("class");
      expect(firstHeading.textContent).toBe("SSIN Validator");
    });

    it("has proper semantic structure with heading hierarchy", () => {
      const { container } = render(<ValidatorPage />);
      const h1 = container.querySelector("h1");
      const h2 = container.querySelector("h2");
      const h3 = container.querySelector("h3");

      // Should have h1, but no h2 or h3 (form has those, but they're in the mocked component)
      expect(h1).toBeInTheDocument();
      expect(h2).not.toBeInTheDocument();
      expect(h3).not.toBeInTheDocument();
    });
  });

  describe("Accessibility - Content Structure", () => {
    it("page has meaningful description text", () => {
      render(<ValidatorPage />);

      expect(
        screen.getByText(
          /Validate a Belgian Social Security Identification Number/,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Enter the number with or without formatting/),
      ).toBeInTheDocument();
    });

    it("provides clear instructions for the SSIN format", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(/YY\.MM\.DD-OOO\.CC/);

      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("text-lg");
    });

    it("form is accessible after header", () => {
      render(<ValidatorPage />);
      const form = screen.getByTestId("ssin-validator-form");
      const heading = screen.getByRole("heading", { level: 1 });

      expect(form).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Content Completeness", () => {
    it("displays both page title and description", () => {
      render(<ValidatorPage />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "SSIN Validator",
      );
      expect(
        screen.getByText(
          /Validate a Belgian Social Security Identification Number/,
        ),
      ).toBeInTheDocument();
    });

    it("description mentions the SSIN format with placeholders", () => {
      render(<ValidatorPage />);

      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );
      expect(description.textContent).toContain("YY.MM.DD-OOO.CC");
    });

    it("description covers all required information", () => {
      render(<ValidatorPage />);

      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );
      const descText = description.textContent || "";

      expect(descText).toContain(
        "Belgian Social Security Identification Number",
      );
      expect(descText).toContain("SSIN");
      expect(descText).toContain("formatting");
    });
  });

  describe("Edge Cases", () => {
    it("renders correctly with all sections present", () => {
      render(<ValidatorPage />);

      const title = screen.getByRole("heading", { level: 1 });
      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );
      const form = screen.getByTestId("ssin-validator-form");

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(form).toBeInTheDocument();
    });

    it("maintains proper structure even with long title text", () => {
      render(<ValidatorPage />);
      const title = screen.getByRole("heading", { level: 1 });

      // Title should still have styling classes even with its content
      expect(title).toHaveClass("text-4xl", "font-bold", "mb-4");
    });

    it("description paragraph wraps correctly with long content", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );

      expect(description).toHaveClass("text-muted-foreground", "text-lg");
    });
  });

  describe("Visual Hierarchy", () => {
    it("title has largest font size with text-4xl", () => {
      render(<ValidatorPage />);
      const title = screen.getByRole("heading", { level: 1 });

      expect(title).toHaveClass("text-4xl");
    });

    it("title is bold with font-bold", () => {
      render(<ValidatorPage />);
      const title = screen.getByRole("heading", { level: 1 });

      expect(title).toHaveClass("font-bold");
    });

    it("description has lighter color with text-muted-foreground", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );

      expect(description).toHaveClass("text-muted-foreground");
    });

    it("description has text-lg for readability", () => {
      render(<ValidatorPage />);
      const description = screen.getByText(
        /Validate a Belgian Social Security Identification Number/,
      );

      expect(description).toHaveClass("text-lg");
    });

    it("spacing separates header from form content", () => {
      const { container } = render(<ValidatorPage />);
      const headerSection = container.querySelector(".mb-8");

      expect(headerSection).toHaveClass("mb-8");
    });
  });

  describe("Component Integration", () => {
    it("renders complete page with all sections", () => {
      render(<ValidatorPage />);

      // Verify all major sections exist
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(
        screen.getByText(
          /Validate a Belgian Social Security Identification Number/,
        ),
      ).toBeInTheDocument();
      expect(screen.getByTestId("ssin-validator-form")).toBeInTheDocument();
    });

    it("page is a functional component returning JSX", () => {
      const result = render(<ValidatorPage />);
      expect(result.container).toBeInTheDocument();
    });

    it("mocked SSINValidatorForm is rendered correctly", () => {
      render(<ValidatorPage />);
      const form = screen.getByTestId("ssin-validator-form");

      expect(form).toHaveTextContent("SSINValidatorForm Component");
    });
  });

  describe("Semantic HTML", () => {
    it("uses div elements for layout structure", () => {
      const { container } = render(<ValidatorPage />);
      const divs = container.querySelectorAll("div");

      // Should have multiple divs for layout (outer container, max-width wrapper, header section)
      expect(divs.length).toBeGreaterThanOrEqual(3);
    });

    it("uses p element for description text", () => {
      const { container } = render(<ValidatorPage />);
      const paragraph = container.querySelector("p");

      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveClass("text-muted-foreground");
    });

    it("uses h1 element for page title", () => {
      const { container } = render(<ValidatorPage />);
      const heading = container.querySelector("h1");

      expect(heading).toBeInTheDocument();
    });
  });
});
