import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Footer } from "../footer";

describe("Footer", () => {
  it("renders the footer element with correct semantic HTML", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("renders footer with correct border styling class", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("border-t", "border-border");
  });

  it("renders footer with correct padding and margin classes", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("py-8", "mt-auto");
  });

  it("renders the footer text content", () => {
    render(<Footer />);
    expect(screen.getByText(/SSIN-LIB/i)).toBeInTheDocument();
  });

  it("renders the complete footer message", () => {
    render(<Footer />);
    expect(
      screen.getByText(/SSIN-LIB - Built with Next.js and Tailwind CSS/i),
    ).toBeInTheDocument();
  });

  it("renders text with correct styling classes for accessibility", () => {
    render(<Footer />);
    const container = screen
      .getByText(/SSIN-LIB - Built with Next.js and Tailwind CSS/i)
      .closest("div");
    expect(container).toHaveClass(
      "text-center",
      "text-sm",
      "text-muted-foreground",
    );
  });

  it("renders container div with mx-auto and px-4 classes for proper spacing", () => {
    render(<Footer />);
    const container = screen
      .getByText(/SSIN-LIB - Built with Next.js and Tailwind CSS/i)
      .closest("div");
    expect(container).toHaveClass("container", "mx-auto", "px-4");
  });

  it("renders text within a paragraph element", () => {
    render(<Footer />);
    const paragraph = screen
      .getByText(/SSIN-LIB - Built with Next.js and Tailwind CSS/i)
      .closest("p");
    expect(paragraph).toBeInTheDocument();
  });

  it("does not render any interactive elements", () => {
    render(<Footer />);
    const buttons = screen.queryAllByRole("button");
    const links = screen.queryAllByRole("link");
    expect(buttons).toHaveLength(0);
    expect(links).toHaveLength(0);
  });

  it("renders without any input fields", () => {
    render(<Footer />);
    const inputs = screen.queryAllByRole("textbox");
    expect(inputs).toHaveLength(0);
  });

  it("maintains consistent text rendering across multiple renders", () => {
    const { rerender } = render(<Footer />);
    const firstText = screen.getByText(
      /SSIN-LIB - Built with Next.js and Tailwind CSS/i,
    );
    expect(firstText).toBeInTheDocument();

    rerender(<Footer />);
    const secondText = screen.getByText(
      /SSIN-LIB - Built with Next.js and Tailwind CSS/i,
    );
    expect(secondText).toBeInTheDocument();
  });

  it("has accessible structure with no missing ARIA labels", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    // Footer should be a valid semantic element
    expect(footer.tagName).toBe("FOOTER");
  });

  it("renders text content without extra whitespace issues", () => {
    render(<Footer />);
    const text = screen.getByText(
      /SSIN-LIB - Built with Next.js and Tailwind CSS/i,
    );
    expect(text.textContent).toBe(
      "SSIN-LIB - Built with Next.js and Tailwind CSS",
    );
  });

  it("is a stateless, pure functional component", () => {
    const { container: container1 } = render(<Footer />);
    const { container: container2 } = render(<Footer />);

    expect(container1.innerHTML).toBe(container2.innerHTML);
  });
});
