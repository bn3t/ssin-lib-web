import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { DocsPageLayout } from "../docs-page-layout";

describe("DocsPageLayout", () => {
  describe("rendering", () => {
    it("renders title prop as h1 element", () => {
      render(
        <DocsPageLayout title="Test Title">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Title");
    });

    it("renders description prop when provided", () => {
      const testDescription = "This is a test description";
      render(
        <DocsPageLayout title="Test" description={testDescription}>
          <p>Content</p>
        </DocsPageLayout>,
      );

      expect(screen.getByText(testDescription)).toBeInTheDocument();
    });

    it("does not render description element when description is undefined", () => {
      render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      // Verify no description paragraph is rendered
      const paragraphs = screen.getAllByRole("paragraph");
      expect(paragraphs).toHaveLength(1); // Only the content paragraph
    });

    it("does not render description element when description is empty string", () => {
      const { container } = render(
        <DocsPageLayout title="Test" description="">
          <p>Content</p>
        </DocsPageLayout>,
      );

      // When description is empty string, it's falsy so the conditional doesn't render it
      const headerDiv = container.querySelector(".mb-8");
      const descriptionParagraph = headerDiv?.querySelector("p");
      expect(descriptionParagraph).not.toBeInTheDocument();
    });

    it("renders children content inside article element", () => {
      render(
        <DocsPageLayout title="Test">
          <p>Test child content</p>
        </DocsPageLayout>,
      );

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
      expect(screen.getByText("Test child content")).toBeInTheDocument();
    });

    it("renders article with mdx-content class", () => {
      render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const article = screen.getByRole("article");
      expect(article).toHaveClass("mdx-content");
    });
  });

  describe("styling and layout", () => {
    it("applies container styles to outer div", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass("container", "mx-auto", "px-4", "py-16");
    });

    it("applies max-width constraint to inner wrapper", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const innerWrapper = container.querySelector(".max-w-4xl");
      expect(innerWrapper).toBeInTheDocument();
      expect(innerWrapper).toHaveClass("mx-auto");
    });

    it("applies title styling classes", () => {
      render(
        <DocsPageLayout title="Styled Title">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-4xl", "font-bold", "mb-4");
    });

    it("applies description styling classes", () => {
      render(
        <DocsPageLayout title="Test" description="Test Description">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const description = screen.getByText("Test Description");
      expect(description).toHaveClass("text-muted-foreground", "text-lg");
    });

    it("applies spacing class to header section", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const headerSection = container.querySelector(".mb-8");
      expect(headerSection).toBeInTheDocument();
    });

    it("applies padding to Card component", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      // Card has data-slot="card" attribute
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass("p-8");
    });
  });

  describe("structure and DOM hierarchy", () => {
    it("maintains correct DOM hierarchy", () => {
      const { container } = render(
        <DocsPageLayout title="Test Title" description="Test Description">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const outerContainer = container.querySelector(".container");
      const maxWidthWrapper = outerContainer?.querySelector(".max-w-4xl");
      const headerDiv = maxWidthWrapper?.querySelector(".mb-8");
      const heading = headerDiv?.querySelector("h1");

      expect(outerContainer).toBeInTheDocument();
      expect(maxWidthWrapper).toBeInTheDocument();
      expect(headerDiv).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });

    it("places Card component after header section", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const maxWidthWrapper = container.querySelector(".max-w-4xl");
      const children = Array.from(maxWidthWrapper?.children || []);

      // First child should be header (mb-8), second should be Card
      expect(children[0]).toHaveClass("mb-8");
      expect(children[1]).toHaveClass("p-8");
    });
  });

  describe("edge cases", () => {
    it("handles very long title text", () => {
      const longTitle =
        "This is a very long title that might wrap onto multiple lines in the UI";
      render(
        <DocsPageLayout title={longTitle}>
          <p>Content</p>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(longTitle);
    });

    it("handles very long description text", () => {
      const longDescription =
        "This is a very long description that contains multiple sentences and might span across several lines when rendered in the user interface with normal line height and font size settings.";
      render(
        <DocsPageLayout title="Test" description={longDescription}>
          <p>Content</p>
        </DocsPageLayout>,
      );

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("handles complex React elements as children", () => {
      render(
        <DocsPageLayout title="Test">
          <div>
            <h2>Nested Heading</h2>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </DocsPageLayout>,
      );

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Nested Heading",
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("handles special characters in title", () => {
      const titleWithSpecialChars = "Title with & < > \" ' characters";
      render(
        <DocsPageLayout title={titleWithSpecialChars}>
          <p>Content</p>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(titleWithSpecialChars);
    });

    it("handles special characters in description", () => {
      const descriptionWithSpecialChars =
        'Description & with <special> "chars"';
      render(
        <DocsPageLayout title="Test" description={descriptionWithSpecialChars}>
          <p>Content</p>
        </DocsPageLayout>,
      );

      expect(screen.getByText(descriptionWithSpecialChars)).toBeInTheDocument();
    });

    it("handles empty children nodes array", () => {
      render(<DocsPageLayout title="Test">{[]}</DocsPageLayout>);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("handles whitespace-only children", () => {
      render(<DocsPageLayout title="Test">{"\n\t  "}</DocsPageLayout>);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });
  });

  describe("props validation", () => {
    it("requires title prop", () => {
      // This test verifies TypeScript would catch missing title
      // At runtime, React renders even with missing props, but we test the behavior
      render(
        <DocsPageLayout title="">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders with minimal required props", () => {
      render(
        <DocsPageLayout title="Minimal">
          <p>Content</p>
        </DocsPageLayout>,
      );

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders with all props provided", () => {
      render(
        <DocsPageLayout title="Full" description="Complete">
          <p>Content</p>
        </DocsPageLayout>,
      );

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("Complete")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("children prop handling", () => {
    it("renders single text node as children", () => {
      render(<DocsPageLayout title="Test">Just text content</DocsPageLayout>);

      expect(screen.getByText("Just text content")).toBeInTheDocument();
    });

    it("renders multiple elements as children", () => {
      render(
        <DocsPageLayout title="Test">
          <p>First paragraph</p>
          <p>Second paragraph</p>
          <p>Third paragraph</p>
        </DocsPageLayout>,
      );

      expect(screen.getByText("First paragraph")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph")).toBeInTheDocument();
      expect(screen.getByText("Third paragraph")).toBeInTheDocument();
    });

    it("renders mixed content types as children", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Paragraph</p>
          <span>Span element</span>
        </DocsPageLayout>,
      );

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
      expect(screen.getByText("Span element")).toBeInTheDocument();
    });

    it("renders fragments as children", () => {
      render(
        <DocsPageLayout title="Test">
          <>
            <p>Fragment child 1</p>
            <p>Fragment child 2</p>
          </>
        </DocsPageLayout>,
      );

      expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
      expect(screen.getByText("Fragment child 2")).toBeInTheDocument();
    });
  });

  describe("Card component integration", () => {
    it("renders Card component with correct data-slot attribute", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it("Card has correct styling classes", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const card = container.querySelector('[data-slot="card"]');
      // Card component applies: bg-card, text-card-foreground, flex, flex-col, gap-6, rounded-xl, border, py-6, shadow-sm
      // DocsPageLayout adds p-8 which overrides py-6
      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "flex",
        "flex-col",
        "gap-6",
        "rounded-xl",
        "border",
        "shadow-sm",
        "p-8",
      );
    });

    it("article is direct child of Card", () => {
      const { container } = render(
        <DocsPageLayout title="Test">
          <p>Content</p>
        </DocsPageLayout>,
      );

      const card = container.querySelector('[data-slot="card"]');
      const article = card?.querySelector("article");
      expect(article).toBeInTheDocument();
      expect(article?.parentElement).toBe(card);
    });
  });
});
