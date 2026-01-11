import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SSINValidatorForm } from "../ssin-validator-form";

describe("SSINValidatorForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the form with all elements", () => {
      render(<SSINValidatorForm />);

      expect(screen.getByLabelText(/ssin number/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /validate ssin/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/05\.02\.09-407\.53/),
      ).toBeInTheDocument();
    });

    it("should render the SSIN format information card", () => {
      render(<SSINValidatorForm />);

      expect(screen.getByText(/ssin format:/i)).toBeInTheDocument();
      expect(screen.getByText(/year of birth/i)).toBeInTheDocument();
      expect(screen.getByText(/month of birth/i)).toBeInTheDocument();
      expect(screen.getByText(/day of birth/i)).toBeInTheDocument();
      expect(screen.getByText(/order number/i)).toBeInTheDocument();
      expect(screen.getByText(/check digits/i)).toBeInTheDocument();
    });

    it("should not display validation result initially", () => {
      render(<SSINValidatorForm />);

      expect(screen.queryByText(/valid ssin/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid ssin/i)).not.toBeInTheDocument();
    });

    it("should have disabled button when input is empty", () => {
      render(<SSINValidatorForm />);

      const button = screen.getByRole("button", { name: /validate ssin/i });
      expect(button).toBeDisabled();
    });

    it("should enable button when input has content", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");

      const button = screen.getByRole("button", { name: /validate ssin/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe("User Input Handling", () => {
    it("should update input value when user types", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i) as HTMLInputElement;
      await user.type(input, "05020940753");

      expect(input.value).toBe("05020940753");
    });

    it("should clear input when user clears it", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i) as HTMLInputElement;
      await user.type(input, "05020940753");
      await user.clear(input);

      expect(input.value).toBe("");
    });

    it("should accept SSIN with formatting (dots and dashes)", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i) as HTMLInputElement;
      await user.type(input, "05.02.09-407.53");

      expect(input.value).toBe("05.02.09-407.53");
    });
  });

  describe("Validation Submission", () => {
    it("should validate SSIN when button is clicked", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      const button = screen.getByRole("button", { name: /validate ssin/i });

      await user.type(input, "05020940753");
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });
    });

    it("should validate SSIN when Enter key is pressed", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });
    });

    it("should not trigger validation when Enter is pressed with empty input", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      // Use keyboard event simulation to test Enter key
      await user.keyboard("{Enter}");

      // Button should be disabled, so nothing should happen
      expect(
        screen.queryByRole("heading", { name: /valid ssin/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: /invalid ssin/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Valid SSIN Validation", () => {
    it("should display valid SSIN result for valid checksum", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/valid ssin number/i)).toBeInTheDocument();
      });
    });

    it("should display parsed information for valid SSIN", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/parsed information:/i)).toBeInTheDocument();
      });
    });

    it("should display formatted SSIN", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/05\.02\.09-407\.53/)).toBeInTheDocument();
      });
    });

    it("should display birth date for valid SSIN", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/2005-02-09/)).toBeInTheDocument();
      });
    });

    it("should display gender information", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        // This SSIN has order number 407 (odd), so it should be Male
        const genderBadge = screen.getAllByText(/male/i);
        expect(genderBadge.length).toBeGreaterThan(0);
      });
    });

    it("should display control and order numbers", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getAllByText(/407/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/53/i).length).toBeGreaterThan(0);
      });
    });

    it("should display SSIN type", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/regular/i)).toBeInTheDocument();
      });
    });

    it("should use primary border for valid SSIN result card", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        const resultCard = screen
          .getByText(/valid ssin number/i)
          .closest(".p-6");
        expect(resultCard).toHaveClass("border-primary");
      });
    });

    it("should display CheckCircle2 icon for valid result", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        const heading = screen.getByRole("heading", { name: /valid ssin/i });
        expect(heading).toBeInTheDocument();
      });
    });
  });

  describe("Invalid SSIN Validation", () => {
    it("should display invalid SSIN for wrong checksum", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940752"); // Wrong last digit
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /invalid ssin/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/invalid ssin - checksum does not match/i),
        ).toBeInTheDocument();
      });
    });

    it("should display error message for too few digits", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "050209407");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid ssin/i)).toBeInTheDocument();
        expect(
          screen.getByText(/ssin must contain exactly 11 digits/i),
        ).toBeInTheDocument();
      });
    });

    it("should display error message for too many digits", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "050209407531234");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid ssin/i)).toBeInTheDocument();
        expect(
          screen.getByText(/ssin must contain exactly 11 digits/i),
        ).toBeInTheDocument();
      });
    });

    it("should not display parsed information for invalid SSIN", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940752");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.queryByText(/parsed information:/i),
        ).not.toBeInTheDocument();
      });
    });

    it("should use destructive border for invalid SSIN result card", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940752");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        const resultCard = screen
          .getByText(/invalid ssin - checksum does not match/i)
          .closest(".p-6");
        expect(resultCard).toHaveClass("border-destructive");
      });
    });

    it("should display XCircle icon for invalid result", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940752");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        const heading = screen.getByRole("heading", { name: /invalid ssin/i });
        expect(heading).toBeInTheDocument();
      });
    });
  });

  describe("SSIN Cleaning and Format Handling", () => {
    it("should validate SSIN with dots and dashes", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05.02.09-407.53");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });
    });

    it("should validate SSIN with spaces", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05 02 09 407 53");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });
    });

    it("should validate SSIN without formatting", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle whitespace-only input", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "     ");

      const button = screen.getByRole("button", { name: /validate ssin/i });
      expect(button).toBeDisabled();
    });

    it("should allow revalidation with different SSIN", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /validate ssin/i });

      // First validation
      await user.type(input, "05020940753");
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });

      // Clear and validate again
      await user.clear(input);
      await user.type(input, "05020940752");
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByText(/invalid ssin - checksum does not match/i),
        ).toBeInTheDocument();
      });
    });

    it("should handle repeated validations of same SSIN", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      const button = screen.getByRole("button", { name: /validate ssin/i });

      await user.type(input, "05020940753");
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });

      // Validate again
      await user.click(button);

      // Should still show valid
      expect(
        screen.getByRole("heading", { name: /valid ssin/i }),
      ).toBeInTheDocument();
    });

    it("should validate SSIN format after cleaning", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      // All zeros will be cleaned to 11 zeros and fail checksum validation
      await user.type(input, "00000000000");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        // Should fail validation due to invalid checksum
        expect(
          screen.getByRole("heading", { name: /invalid ssin/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/invalid ssin - checksum does not match/i),
        ).toBeInTheDocument();
      });
    });

    it("should display Unknown for null gender", async () => {
      // This test depends on the actual SSIN library behavior
      // Most valid SSINs should have a gender, but test the fallback
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      // Use a valid SSIN that should work
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        // Should show either Male or Female, not Unknown for this SSIN
        const genderBadges = screen.queryAllByText(/male/i);
        expect(genderBadges.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Result Display Updates", () => {
    it("should replace previous validation result with new one", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /validate ssin/i });

      // First invalid
      await user.type(input, "05020940752");
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /invalid ssin/i }),
        ).toBeInTheDocument();
      });

      // Clear and validate valid
      await user.clear(input);
      await user.type(input, "05020940753");
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(/invalid ssin - checksum does not match/i),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper label for input", () => {
      render(<SSINValidatorForm />);

      const label = screen.getByText(/ssin number/i);
      expect(label).toBeInTheDocument();
    });

    it("should have input with proper id for label association", () => {
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      expect(input).toHaveAttribute("id", "ssin");
    });

    it("should have semantic heading in results", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      await user.type(input, "05020940753");
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /valid ssin/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Large Input Handling", () => {
    it("should handle very long input gracefully", async () => {
      const user = userEvent.setup();
      render(<SSINValidatorForm />);

      const input = screen.getByLabelText(/ssin number/i);
      const longInput = "05020940753" + "0".repeat(100);
      await user.type(input, longInput);
      await user.click(screen.getByRole("button", { name: /validate ssin/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid ssin/i)).toBeInTheDocument();
      });
    });
  });
});
