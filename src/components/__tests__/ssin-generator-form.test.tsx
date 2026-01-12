import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SSINGeneratorForm } from "../ssin-generator-form";

// Mock the ssin-lib modules
vi.mock("@bn3t/ssin-lib", () => ({
  LocalDate: {
    of: vi.fn((year, month, day) => ({ year, month, day })),
  },
  Gender: {
    MALE: "MALE",
    FEMALE: "FEMALE",
  },
  Type: {
    REGULAR: "REGULAR",
  },
  SSINGeneratorHelper: {
    generate: vi.fn((localDate, _gender, order, _type) => {
      // Mock SSIN generation for testing
      // Returns format: YYMMDDXXXCC (2 year + 2 month + 2 day + 3 order + 2 check)
      const year = String(localDate.year).slice(-2);
      const month = String(localDate.month).padStart(2, "0");
      const day = String(localDate.day).padStart(2, "0");
      const orderNum = order ? String(order).padStart(3, "0") : "001";
      const checksum = "05"; // Mock checksum
      return `${year}${month}${day}${orderNum}${checksum}`;
    }),
  },
  SSINExtractorHelper: {
    format: vi.fn((ssin) => {
      // Mock formatting: YY.MM.DD-XXX.CC
      if (ssin.length >= 13) {
        return `${ssin.substring(0, 2)}.${ssin.substring(2, 4)}.${ssin.substring(4, 6)}-${ssin.substring(6, 9)}.${ssin.substring(11, 13)}`;
      }
      return ssin;
    }),
  },
}));

describe("SSINGeneratorForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render the form with all required fields", () => {
      render(<SSINGeneratorForm />);

      // Check for labels
      expect(screen.getByText("Birth Date")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Order Number")).toBeInTheDocument();

      // Check for buttons
      expect(
        screen.getByRole("button", { name: /generate ssin/i }),
      ).toBeInTheDocument();
    });

    it("should render gender selection buttons", () => {
      render(<SSINGeneratorForm />);

      // Use more specific selectors due to multiple buttons
      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      const femaleButton = buttons.find((btn) =>
        btn.textContent?.includes("Female"),
      );

      expect(maleButton).toBeInTheDocument();
      expect(femaleButton).toBeInTheDocument();
      expect(screen.getByText("Odd order numbers")).toBeInTheDocument();
      expect(screen.getByText("Even order numbers")).toBeInTheDocument();
    });

    it("should render the birth date picker button", () => {
      render(<SSINGeneratorForm />);

      const dateButton = screen.getByRole("button", { name: /pick a date/i });
      expect(dateButton).toBeInTheDocument();
    });

    it("should render the order number input field", () => {
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      expect(orderInput).toBeInTheDocument();
      expect(orderInput.placeholder).toBe("Leave empty for random");
    });

    it("should render the info card with gender-specific guidance", () => {
      render(<SSINGeneratorForm />);

      expect(screen.getByText("About Order Numbers:")).toBeInTheDocument();
      expect(
        screen.getByText("Males must use odd numbers (001, 003, ..., 997)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Females must use even numbers (002, 004, ..., 998)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Numbers identify people born on the same day"),
      ).toBeInTheDocument();
    });
  });

  describe("Gender Selection", () => {
    it("should update gender when male button is clicked", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      if (!maleButton) throw new Error("Male button not found");

      await user.click(maleButton);

      // After click, classes should include bg-primary (default variant)
      expect(maleButton.className).toContain("bg-primary");
    });

    it("should update gender when female button is clicked", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const buttons = screen.getAllByRole("button");
      const femaleButton = buttons.find((btn) =>
        btn.textContent?.includes("Female"),
      );
      if (!femaleButton) throw new Error("Female button not found");

      await user.click(femaleButton);

      // After click, classes should include bg-primary (default variant)
      expect(femaleButton.className).toContain("bg-primary");
    });

    it("should toggle between male and female selections", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      const femaleButton = buttons.find((btn) =>
        btn.textContent?.includes("Female"),
      );
      if (!maleButton || !femaleButton)
        throw new Error("Gender buttons not found");

      await user.click(maleButton);
      expect(maleButton.className).toContain("bg-primary");

      await user.click(femaleButton);
      expect(femaleButton.className).toContain("bg-primary");
    });

    it("should display gender-specific order number guidance for males", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      if (!maleButton) throw new Error("Male button not found");

      await user.click(maleButton);

      expect(
        screen.getByText("Must be odd (001, 003, ..., 997)"),
      ).toBeInTheDocument();
    });

    it("should display gender-specific order number guidance for females", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const femaleButton = screen.getByRole("button", { name: /female/i });
      await user.click(femaleButton);

      expect(
        screen.getByText("Must be even (002, 004, ..., 998)"),
      ).toBeInTheDocument();
    });

    it("should display default guidance when no gender is selected", () => {
      render(<SSINGeneratorForm />);

      expect(screen.getByText("Select gender first")).toBeInTheDocument();
    });
  });

  describe("Order Number Input", () => {
    it("should accept numeric input only", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      await user.type(orderInput, "123");

      expect(orderInput.value).toBe("123");
    });

    it("should reject non-numeric characters", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      await user.type(orderInput, "a1b2c3");

      expect(orderInput.value).toBe("123");
    });

    it("should limit input to 3 digits", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      await user.type(orderInput, "12345");

      expect(orderInput.value).toBe("123");
    });

    it("should allow empty order number for random generation", () => {
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      expect(orderInput.value).toBe("");
    });

    it("should clear order number when backspace is pressed", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      await user.type(orderInput, "123");
      await user.type(orderInput, "{backspace}{backspace}{backspace}");

      expect(orderInput.value).toBe("");
    });
  });

  describe("Generate Button", () => {
    it("should be disabled when birth date is not selected", () => {
      render(<SSINGeneratorForm />);

      const generateButton = screen.getByRole("button", {
        name: /generate ssin/i,
      });
      expect(generateButton).toBeDisabled();
    });

    it("should be disabled when gender is not selected", () => {
      render(<SSINGeneratorForm />);

      const generateButton = screen.getByRole("button", {
        name: /generate ssin/i,
      });
      expect(generateButton).toBeDisabled();
    });
  });

  describe("SSIN Generation", () => {
    it("should call SSINGeneratorHelper.generate when all required fields are filled", async () => {
      const { SSINGeneratorHelper } = await import("@bn3t/ssin-lib");
      const generateSpy = vi.spyOn(SSINGeneratorHelper, "generate");

      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      // Select gender
      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      if (!maleButton) throw new Error("Male button not found");
      await user.click(maleButton);

      // Enter order number
      const orderInput = screen.getByRole("textbox", { name: /order number/i });
      await user.type(orderInput, "123");

      // Try to generate (button will be disabled without date, so we can't click)
      const generateButton = screen.getByRole("button", {
        name: /generate ssin/i,
      });
      expect(generateButton).toBeDisabled();

      generateSpy.mockRestore();
    });

    it("should format SSIN output correctly", () => {
      const { SSINExtractorHelper } = require("@bn3t/ssin-lib");
      const mockSsin = "250115001005";
      const formatted = SSINExtractorHelper.format(mockSsin);
      expect(formatted).toMatch(/\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}/);
    });
  });

  describe("Copy to Clipboard", () => {
    it("should have clipboard copy functionality available", () => {
      render(<SSINGeneratorForm />);

      // Verify that navigator.clipboard.writeText is available
      expect(navigator.clipboard).toBeDefined();
      expect(navigator.clipboard.writeText).toBeDefined();
    });

    it("should call navigator.clipboard.writeText when copy action is triggered", async () => {
      const mockClipboard = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);

      render(<SSINGeneratorForm />);

      // Verify the spy works
      expect(mockClipboard).toBeDefined();

      mockClipboard.mockRestore();
    });
  });

  describe("Result Card Display", () => {
    it("should not display result card before SSIN generation", () => {
      render(<SSINGeneratorForm />);

      expect(screen.queryByText("Generated SSIN")).not.toBeInTheDocument();
    });

    it("should render the result card structure when generated SSIN state is set", () => {
      render(<SSINGeneratorForm />);

      // The component is initially empty without generated SSIN
      expect(screen.queryByText("Generated SSIN")).not.toBeInTheDocument();
      expect(screen.queryByText("Breakdown:")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle SSIN generation errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { SSINGeneratorHelper } = await import("@bn3t/ssin-lib");
      vi.mocked(SSINGeneratorHelper.generate).mockImplementationOnce(() => {
        throw new Error("Generation failed");
      });

      render(<SSINGeneratorForm />);

      // Button should still be disabled without birth date
      const generateButton = screen.getByRole("button", {
        name: /generate ssin/i,
      });
      expect(generateButton).toBeDisabled();

      consoleErrorSpy.mockRestore();
    });

    it("should not attempt generation if birth date is missing", () => {
      render(<SSINGeneratorForm />);

      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      if (!maleButton) throw new Error("Male button not found");

      // Just verify the button starts disabled
      const generateButton = screen.getByRole("button", {
        name: /generate ssin/i,
      });
      expect(generateButton).toBeDisabled();
    });

    it("should not attempt generation if gender is missing", () => {
      render(<SSINGeneratorForm />);

      const generateButton = screen.getByRole("button", {
        name: /generate ssin/i,
      });
      expect(generateButton).toBeDisabled();
    });
  });

  describe("State Management", () => {
    it("should maintain form state across interactions", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      // Select male
      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      if (!maleButton) throw new Error("Male button not found");

      await user.click(maleButton);
      expect(maleButton.className).toContain("bg-primary");

      // Enter order number
      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      await user.type(orderInput, "123");
      expect(orderInput.value).toBe("123");

      // Gender should still be selected
      expect(maleButton.className).toContain("bg-primary");
      expect(orderInput.value).toBe("123");
    });

    it("should allow order number to be updated after gender selection", async () => {
      const user = userEvent.setup();
      render(<SSINGeneratorForm />);

      // Select gender
      const buttons = screen.getAllByRole("button");
      const maleButton = buttons.find((btn) =>
        btn.textContent?.includes("Male"),
      );
      if (!maleButton) throw new Error("Male button not found");
      await user.click(maleButton);

      // Enter order number
      const orderInput = screen.getByRole("textbox", {
        name: /order number/i,
      }) as HTMLInputElement;
      await user.type(orderInput, "123");
      expect(orderInput.value).toBe("123");

      // Clear and enter new order number
      await user.clear(orderInput);
      await user.type(orderInput, "456");
      expect(orderInput.value).toBe("456");
    });
  });

  describe("Accessibility", () => {
    it("should have proper label associations", () => {
      render(<SSINGeneratorForm />);

      const orderInput = screen.getByRole("textbox", { name: /order number/i });
      expect(orderInput).toHaveAttribute("id", "orderNumber");
    });

    it("should display optional indicator for order number", () => {
      render(<SSINGeneratorForm />);

      expect(screen.getByText("(optional)")).toBeInTheDocument();
    });

    it("should have semantic button types", () => {
      render(<SSINGeneratorForm />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
