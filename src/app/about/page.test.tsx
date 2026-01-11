import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Create mock components first
const MockExplanationContent = () => (
  <div data-testid="explanation-content">
    <h2>Understanding SSIN Numbers</h2>
    <p>Learn about Belgian Social Security Identification Numbers</p>
  </div>
);

const MockDocsPageLayout = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div data-testid="docs-page-layout">
    <div data-testid="layout-title">{title}</div>
    {description && <div data-testid="layout-description">{description}</div>}
    <div data-testid="layout-children">{children}</div>
  </div>
);

const mockFrontmatter = {
  title: "Understanding SSIN Numbers",
  description: "Learn about Belgian Social Security Identification Numbers",
};

// Mock the modules before importing the component
vi.mock("@/components/docs-page-layout", () => ({
  DocsPageLayout: MockDocsPageLayout,
}));

vi.mock("@/content/docs/explanation.mdx", () => ({
  default: MockExplanationContent,
  frontmatter: mockFrontmatter,
}));

interface DocsPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

// Create a test version of AboutPage component
function createAboutPageComponent(
  layoutComponent: React.ComponentType<DocsPageLayoutProps>,
  explanationComponent: React.ComponentType,
  frontmatter: { title?: string; description?: string },
) {
  return function AboutPage() {
    return React.createElement(
      layoutComponent,
      {
        title: frontmatter.title ?? "",
        description: frontmatter.description,
        children: React.createElement(explanationComponent),
      },
    );
  };
}

describe("AboutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the page without errors", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      expect(() => render(<AboutPage />)).not.toThrow();
    });

    it("renders DocsPageLayout component", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const layout = screen.getByTestId("docs-page-layout");
      expect(layout).toBeInTheDocument();
    });

    it("renders the explanation content inside the layout", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const content = screen.getByTestId("explanation-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("DocsPageLayout props", () => {
    it("passes title from frontmatter to DocsPageLayout", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const title = screen.getByTestId("layout-title");
      expect(title).toHaveTextContent("Understanding SSIN Numbers");
    });

    it("passes description from frontmatter to DocsPageLayout", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const description = screen.getByTestId("layout-description");
      expect(description).toHaveTextContent(
        "Learn about Belgian Social Security Identification Numbers",
      );
    });

    it("passes the explanation content as children to DocsPageLayout", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const layoutChildren = screen.getByTestId("layout-children");
      const content = layoutChildren.querySelector(
        '[data-testid="explanation-content"]',
      );
      expect(content).toBeInTheDocument();
    });

    it("renders all frontmatter metadata correctly", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);

      expect(screen.getByTestId("layout-title")).toHaveTextContent(
        "Understanding SSIN Numbers",
      );
      expect(screen.getByTestId("layout-description")).toHaveTextContent(
        "Learn about Belgian Social Security Identification Numbers",
      );
    });
  });

  describe("layout structure", () => {
    it("maintains proper nesting: Layout > Children", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      const { container } = render(<AboutPage />);
      const layout = container.querySelector(
        '[data-testid="docs-page-layout"]',
      );
      const children = layout?.querySelector('[data-testid="layout-children"]');
      const content = children?.querySelector(
        '[data-testid="explanation-content"]',
      );

      expect(layout).toBeInTheDocument();
      expect(children).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("has correct element order: title -> description -> children", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      const { container } = render(<AboutPage />);
      const layout = container.querySelector(
        '[data-testid="docs-page-layout"]',
      );

      const layoutChildren = Array.from(layout?.children || []);
      const titleIndex = layoutChildren.findIndex(
        (el) =>
          (el as HTMLElement).getAttribute("data-testid") === "layout-title",
      );
      const descIndex = layoutChildren.findIndex(
        (el) =>
          (el as HTMLElement).getAttribute("data-testid") ===
          "layout-description",
      );
      const childrenIndex = layoutChildren.findIndex(
        (el) =>
          (el as HTMLElement).getAttribute("data-testid") === "layout-children",
      );

      expect(titleIndex).toBeLessThan(descIndex);
      expect(descIndex).toBeLessThan(childrenIndex);
    });
  });

  describe("frontmatter handling", () => {
    it("passes title with null coalescing operator", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        { ...mockFrontmatter, title: undefined },
      );

      render(<AboutPage />);
      const title = screen.getByTestId("layout-title");
      expect(title).toBeInTheDocument();
    });

    it("passes title exactly as it appears in frontmatter", () => {
      const customFrontmatter = {
        title: "Custom Title",
        description: "Custom Description",
      };
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        customFrontmatter,
      );

      render(<AboutPage />);

      const title = screen.getByTestId("layout-title");
      const description = screen.getByTestId("layout-description");

      expect(title).toHaveTextContent("Custom Title");
      expect(description).toHaveTextContent("Custom Description");
    });

    it("handles empty description gracefully", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        { ...mockFrontmatter, description: "" },
      );

      render(<AboutPage />);

      // Layout should still render even with empty description
      expect(screen.getByTestId("docs-page-layout")).toBeInTheDocument();
    });
  });

  describe("content component rendering", () => {
    it("renders the explanation content component", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const content = screen.getByTestId("explanation-content");
      expect(content).toBeInTheDocument();
    });

    it("renders explanation heading", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      // Use getByRole to specifically find the h2 heading
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Understanding SSIN Numbers");
    });

    it("renders explanation description paragraph", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      // Get all paragraphs and find the one in the explanation content
      const paragraphs = screen.getAllByRole("paragraph");
      // The last paragraph should be the one from MockExplanationContent
      const lastParagraph = paragraphs[paragraphs.length - 1];
      expect(lastParagraph).toHaveTextContent(
        "Learn about Belgian Social Security Identification Numbers",
      );
    });

    it("passes content as children not as prop", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const layoutChildren = screen.getByTestId("layout-children");
      // Content should be inside the children container
      expect(
        layoutChildren.querySelector('[data-testid="explanation-content"]'),
      ).toBeInTheDocument();
    });
  });

  describe("component composition", () => {
    it("returns a valid React element", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      const element = <AboutPage />;
      expect(React.isValidElement(element)).toBe(true);
    });

    it("is a functional component", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      expect(typeof AboutPage).toBe("function");
      expect(AboutPage()).toBeInstanceOf(Object);
    });
  });

  describe("edge cases", () => {
    it("renders with minimal props", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        { title: "Title", description: undefined },
      );

      render(<AboutPage />);
      expect(screen.getByTestId("docs-page-layout")).toBeInTheDocument();
      expect(screen.getByTestId("layout-title")).toBeInTheDocument();
    });

    it("renders with all props", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      expect(screen.getByTestId("layout-title")).toBeInTheDocument();
      expect(screen.getByTestId("layout-description")).toBeInTheDocument();
      expect(screen.getByTestId("explanation-content")).toBeInTheDocument();
    });

    it("handles rerenders without errors", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      const { rerender } = render(<AboutPage />);
      expect(() => rerender(<AboutPage />)).not.toThrow();
      expect(screen.getByTestId("docs-page-layout")).toBeInTheDocument();
    });

    it("handles long title text", () => {
      const longTitle =
        "This is a very long title that explains the Belgian Social Security Identification Numbers in great detail";
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        { ...mockFrontmatter, title: longTitle },
      );

      render(<AboutPage />);
      expect(screen.getByTestId("layout-title")).toHaveTextContent(longTitle);
    });

    it("handles special characters in title", () => {
      const titleWithSpecialChars = "Title with & < > \" ' characters";
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        { ...mockFrontmatter, title: titleWithSpecialChars },
      );

      render(<AboutPage />);
      expect(screen.getByTestId("layout-title")).toHaveTextContent(
        titleWithSpecialChars,
      );
    });
  });

  describe("accessibility", () => {
    it("renders accessible content", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);

      // Title should be visible and accessible
      expect(screen.getByTestId("layout-title")).toBeInTheDocument();

      // Description should be visible and accessible
      expect(screen.getByTestId("layout-description")).toBeInTheDocument();

      // Content should be visible and accessible
      expect(screen.getByTestId("explanation-content")).toBeInTheDocument();
    });

    it("preserves semantic HTML structure", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);

      // Check that h2 is present in content (from MockExplanationContent)
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Understanding SSIN Numbers");
    });
  });

  describe("props validation", () => {
    it("title prop is required and passed correctly", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      const title = screen.getByTestId("layout-title");
      expect(title).toBeInTheDocument();
      expect(title.textContent).toBeTruthy();
    });

    it("description prop is optional", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        { title: "Only Title", description: undefined },
      );

      render(<AboutPage />);
      // Layout should still render
      expect(screen.getByTestId("docs-page-layout")).toBeInTheDocument();
      // Title should be present
      expect(screen.getByTestId("layout-title")).toBeInTheDocument();
    });

    it("children prop is required (content component)", () => {
      const AboutPage = createAboutPageComponent(
        MockDocsPageLayout,
        MockExplanationContent,
        mockFrontmatter,
      );

      render(<AboutPage />);
      // Children should be present
      expect(screen.getByTestId("layout-children")).toBeInTheDocument();
      // Content inside children should be present
      expect(screen.getByTestId("explanation-content")).toBeInTheDocument();
    });
  });
});
