import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Disclaimer } from "../disclaimer";

describe("Disclaimer", () => {
  it("renders the disclaimer component", () => {
    render(<Disclaimer />);
    expect(screen.getByText(/disclaimer/i)).toBeInTheDocument();
  });

  it("renders the Card wrapper with correct styling", () => {
    const { container } = render(<Disclaimer />);
    const card = container.querySelector('[data-slot="card"]');

    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("p-6");
    expect(card).toHaveClass("bg-muted/50");
  });

  it("displays the disclaimer heading with semibold styling", () => {
    render(<Disclaimer />);
    const disclaimerSpan = screen.getByText("Disclaimer:");

    expect(disclaimerSpan).toBeInTheDocument();
    expect(disclaimerSpan).toHaveClass("font-semibold");
    expect(disclaimerSpan).toHaveClass("text-foreground");
  });

  it("renders the complete disclaimer text", () => {
    render(<Disclaimer />);

    const disclaimerText = screen.getByText(
      /all tools, documentation, and resources/i,
    );
    expect(disclaimerText).toBeInTheDocument();
  });

  it("includes mention of SSIN generator tool", () => {
    render(<Disclaimer />);
    expect(screen.getByText(/ssin generator/i)).toBeInTheDocument();
  });

  it("includes mention of SSIN validator tool", () => {
    render(<Disclaimer />);
    expect(screen.getByText(/ssin.*validator/i)).toBeInTheDocument();
  });

  it("includes mention of SSIN library", () => {
    render(<Disclaimer />);
    expect(screen.getByText(/ssin.*library/i)).toBeInTheDocument();
  });

  it("mentions educational and testing purposes", () => {
    render(<Disclaimer />);
    expect(
      screen.getByText(/educational and testing purposes/i),
    ).toBeInTheDocument();
  });

  it("states that generated SSIN numbers are not official", () => {
    render(<Disclaimer />);
    expect(
      screen.getByText(/generated ssin numbers are not official/i),
    ).toBeInTheDocument();
  });

  it("includes warning about misuse and legal consequences", () => {
    render(<Disclaimer />);
    expect(
      screen.getByText(/misuse.*fraudulent or illegal.*legal consequences/i),
    ).toBeInTheDocument();
  });

  it("disclaims liability for unauthorized or unlawful use", () => {
    render(<Disclaimer />);
    expect(
      screen.getByText(
        /authors assume no liability.*unauthorized or unlawful use/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the paragraph with muted text styling", () => {
    const { container } = render(<Disclaimer />);
    const paragraph = container.querySelector("p");

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass("text-sm");
    expect(paragraph).toHaveClass("text-muted-foreground");
  });

  it("renders all disclaimer content within a single paragraph element", () => {
    const { container } = render(<Disclaimer />);
    const paragraphs = container.querySelectorAll("p");

    expect(paragraphs).toHaveLength(1);
  });

  it("contains the span element with disclaimer label inside the paragraph", () => {
    const { container } = render(<Disclaimer />);
    const paragraph = container.querySelector("p");
    const disclaimerSpan = paragraph?.querySelector("span");

    expect(disclaimerSpan).toBeInTheDocument();
    expect(disclaimerSpan?.textContent).toBe("Disclaimer:");
  });

  it("does not render any interactive elements", () => {
    const { container } = render(<Disclaimer />);

    const buttons = container.querySelectorAll("button");
    const links = container.querySelectorAll("a");
    const inputs = container.querySelectorAll("input, textarea, select");

    expect(buttons).toHaveLength(0);
    expect(links).toHaveLength(0);
    expect(inputs).toHaveLength(0);
  });

  it("is a functional component with no state or props", () => {
    const { rerender } = render(<Disclaimer />);
    const firstRender = screen.getByText(/disclaimer/i).textContent;

    rerender(<Disclaimer />);
    const secondRender = screen.getByText(/disclaimer/i).textContent;

    expect(firstRender).toBe(secondRender);
  });

  it("renders consistently without props", () => {
    const { container: container1 } = render(<Disclaimer />);
    const text1 = container1.textContent;

    const { container: container2 } = render(<Disclaimer />);
    const text2 = container2.textContent;

    expect(text1).toBe(text2);
  });
});
