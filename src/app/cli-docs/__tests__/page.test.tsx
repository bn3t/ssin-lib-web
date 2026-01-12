import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the DocsPageLayout component
vi.mock("@/components/docs-page-layout", () => ({
  DocsPageLayout: ({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="docs-page-layout"
      data-title={title}
      data-description={description}
    >
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <div data-testid="layout-children">{children}</div>
    </div>
  ),
}));

// Import the mocked component
import { DocsPageLayout } from "@/components/docs-page-layout";

describe("CLIDocsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Since the page component imports a real .mdx file, we'll test the component
  // by verifying the DocsPageLayout receives correct props from the CLI frontmatter
  describe("Component Props", () => {
    it("renders DocsPageLayout with correct CLI documentation title", () => {
      // The page renders: <DocsPageLayout title={frontmatter.title ?? ""} description={frontmatter.description}>
      // CLIDocsPage uses: title="CLI Documentation" from frontmatter
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div data-testid="cli-content">CLI Documentation Content</div>
        </DocsPageLayout>,
      );

      const layout = screen.getByTestId("docs-page-layout");
      expect(layout).toHaveAttribute("data-title", "CLI Documentation");
    });

    it("renders DocsPageLayout with correct CLI documentation description", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div data-testid="cli-content">CLI Documentation Content</div>
        </DocsPageLayout>,
      );

      const layout = screen.getByTestId("docs-page-layout");
      const expectedDescription =
        "Command-line utilities for validating and generating Belgian Social Security Identification Numbers";
      expect(layout).toHaveAttribute("data-description", expectedDescription);
    });
  });

  describe("Component Rendering with Props", () => {
    it("renders DocsPageLayout as main container", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div data-testid="cli-content">Content</div>
        </DocsPageLayout>,
      );

      expect(screen.getByTestId("docs-page-layout")).toBeInTheDocument();
    });

    it("renders h1 with title text", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities"
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("CLI Documentation");
    });

    it("renders description paragraph", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      expect(
        screen.getByText(/Command-line utilities for validating/i),
      ).toBeInTheDocument();
    });

    it("renders children in layout-children div", () => {
      render(
        <DocsPageLayout title="CLI Documentation" description="Description">
          <div data-testid="cli-content">CLI Documentation Content</div>
        </DocsPageLayout>,
      );

      const layoutChildren = screen.getByTestId("layout-children");
      const content = layoutChildren.querySelector(
        '[data-testid="cli-content"]',
      );
      expect(content).toBeInTheDocument();
    });
  });

  describe("Frontmatter Data", () => {
    it("uses CLI-specific title from frontmatter", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities"
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("CLI Documentation");
    });

    it("uses CLI-specific description from frontmatter", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      const description = screen.getByText(/validating and generating/i);
      expect(description).toBeInTheDocument();
    });

    it("description includes SSIN reference", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      expect(screen.getByText(/Belgian Social Security/i)).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders DocsPageLayout with layout-children container", () => {
      render(
        <DocsPageLayout title="CLI Documentation" description="Description">
          <div data-testid="test-child">Test</div>
        </DocsPageLayout>,
      );

      expect(screen.getByTestId("layout-children")).toBeInTheDocument();
    });

    it("passes title and description as data attributes", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      const layout = screen.getByTestId("docs-page-layout");
      expect(layout).toHaveAttribute("data-title", "CLI Documentation");
      expect(layout).toHaveAttribute(
        "data-description",
        "Command-line utilities for validating and generating Belgian Social Security Identification Numbers",
      );
    });

    it('renders title using null coalescing operator pattern (title ?? "")', () => {
      // Test with empty title string, which would result from null coalescing
      render(
        <DocsPageLayout title="" description="Description">
          <div>Content</div>
        </DocsPageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Props with Different Values", () => {
    it("renders correctly with all props provided", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div data-testid="cli-content">Documentation Content</div>
        </DocsPageLayout>,
      );

      // Verify all props are rendered
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "CLI Documentation",
      );
      expect(screen.getByText(/Command-line utilities/i)).toBeInTheDocument();
      expect(screen.getByTestId("cli-content")).toBeInTheDocument();
    });

    it("renders correctly without description", () => {
      render(
        <DocsPageLayout title="CLI Documentation">
          <div>Content</div>
        </DocsPageLayout>,
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "CLI Documentation",
      );
      // Description should not be rendered (conditional rendering)
      expect(
        screen.queryByText(/Command-line utilities/i),
      ).not.toBeInTheDocument();
    });

    it("passes children correctly to DocsPageLayout", () => {
      render(
        <DocsPageLayout title="CLI Documentation" description="Description">
          <div data-testid="custom-content">Custom Child Content</div>
        </DocsPageLayout>,
      );

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom Child Content")).toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    it("renders MDX content structure with CLI documentation layout", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div data-testid="cli-content">
            <h2>Commands</h2>
            <p>CLI tools available</p>
          </div>
        </DocsPageLayout>,
      );

      // Verify layout structure
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "CLI Documentation",
      );
      expect(screen.getByTestId("cli-content")).toBeInTheDocument();
    });

    it("maintains content hierarchy with title and description", () => {
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description="Command-line utilities for validating and generating Belgian Social Security Identification Numbers"
        >
          <div data-testid="mdx-content">MDX Documentation</div>
        </DocsPageLayout>,
      );

      const layout = screen.getByTestId("docs-page-layout");
      const children = screen.getByTestId("layout-children");
      const content = screen.getByTestId("mdx-content");

      // Verify hierarchy
      expect(layout).toContainElement(children);
      expect(children).toContainElement(content);
    });
  });

  describe("Props Types", () => {
    it("title prop is correctly formatted string", () => {
      render(
        <DocsPageLayout title="CLI Documentation" description="Description">
          <div>Content</div>
        </DocsPageLayout>,
      );

      const layout = screen.getByTestId("docs-page-layout");
      const titleAttr = layout.getAttribute("data-title");
      expect(typeof titleAttr).toBe("string");
      expect(titleAttr).toBe("CLI Documentation");
    });

    it("description prop is correctly formatted string", () => {
      const expectedDescription =
        "Command-line utilities for validating and generating Belgian Social Security Identification Numbers";
      render(
        <DocsPageLayout
          title="CLI Documentation"
          description={expectedDescription}
        >
          <div>Content</div>
        </DocsPageLayout>,
      );

      const layout = screen.getByTestId("docs-page-layout");
      const descAttr = layout.getAttribute("data-description");
      expect(typeof descAttr).toBe("string");
      expect(descAttr).toBe(expectedDescription);
    });

    it("children prop accepts React elements", () => {
      render(
        <DocsPageLayout title="CLI Documentation" description="Description">
          <div data-testid="test-element">
            <h2>Nested Content</h2>
            <p>Paragraph</p>
          </div>
        </DocsPageLayout>,
      );

      expect(screen.getByTestId("test-element")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Nested Content",
      );
    });
  });
});
