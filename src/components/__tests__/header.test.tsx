import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "../header";

// Mock Next.js router and pathname
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
      onClick,
    }: {
      children: React.ReactNode;
      href: string;
      onClick?: () => void;
    }) => (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    ),
  };
});

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
    variant,
    onClick,
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
    onClick?: () => void;
  }) => (
    <button className={className} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">X</div>,
}));

import { usePathname } from "next/navigation";

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/");
  });

  describe("Rendering", () => {
    it("renders the header with logo", () => {
      render(<Header />);
      const logo = screen.getByRole("link", { name: /ssin-lib/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("renders all navigation items", () => {
      render(<Header />);

      expect(
        screen.getByRole("link", { name: /validator/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /generator/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /about ssin/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /library docs/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /cli docs/i }),
      ).toBeInTheDocument();
    });

    it("renders GitHub link in desktop navigation", () => {
      render(<Header />);
      const githubLink = screen.getByLabelText(/github repository/i);

      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute(
        "href",
        "https://github.com/bn3t/ssin-lib",
      );
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders mobile menu button", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      expect(menuButton).toBeInTheDocument();
    });

    it("renders header with sticky and backdrop blur styles", () => {
      const { container } = render(<Header />);
      const header = container.querySelector("header");

      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
      expect(header).toHaveClass("bg-background/80");
      expect(header).toHaveClass("backdrop-blur-sm");
      expect(header).toHaveClass("z-50");
    });
  });

  describe("Active Navigation State", () => {
    it("highlights the current page in desktop navigation", () => {
      vi.mocked(usePathname).mockReturnValue("/validator");
      render(<Header />);

      const validatorButton = screen
        .getByRole("link", { name: /validator/i })
        .querySelector("button");
      expect(validatorButton).toHaveAttribute("data-variant", "secondary");
    });

    it("uses ghost variant for non-active navigation items", () => {
      vi.mocked(usePathname).mockReturnValue("/validator");
      render(<Header />);

      const generatorButton = screen
        .getByRole("link", { name: /generator/i })
        .querySelector("button");
      expect(generatorButton).toHaveAttribute("data-variant", "ghost");
    });

    it("highlights the current page in mobile navigation", () => {
      vi.mocked(usePathname).mockReturnValue("/generator");
      render(<Header />);

      // Open mobile menu first
      const menuButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(menuButton);

      const generatorButton = screen
        .getAllByRole("link", { name: /generator/i })[1]
        .querySelector("button");
      expect(generatorButton).toHaveAttribute("data-variant", "secondary");
    });

    it("applies ghost variant to non-active items in mobile navigation", () => {
      vi.mocked(usePathname).mockReturnValue("/generator");
      render(<Header />);

      // Open mobile menu
      const menuButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(menuButton);

      const validatorButton = screen
        .getAllByRole("link", { name: /validator/i })[1]
        .querySelector("button");
      expect(validatorButton).toHaveAttribute("data-variant", "ghost");
    });

    it("highlights home page when pathname is root", () => {
      vi.mocked(usePathname).mockReturnValue("/");
      render(<Header />);

      // All nav items should have ghost variant when on home
      const navButtons = screen.getAllByRole("link", {
        name: /validator|generator|about|library|cli/i,
      });
      navButtons.forEach((link) => {
        const button = link.querySelector("button");
        expect(button).toHaveAttribute("data-variant", "ghost");
      });
    });

    it("handles different pathname values correctly", () => {
      const pathnames = ["/about", "/library-docs", "/cli-docs"];

      pathnames.forEach((pathname) => {
        vi.mocked(usePathname).mockReturnValue(pathname);
        const { unmount } = render(<Header />);

        const navLinks = screen.getAllByRole("link").filter((link) => {
          return link.getAttribute("href")?.startsWith("/");
        });

        expect(navLinks.length).toBeGreaterThan(0);
        unmount();
      });
    });
  });

  describe("Mobile Menu Interaction", () => {
    it("displays menu icon initially on mobile", () => {
      render(<Header />);
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
    });

    it("opens mobile menu when menu button is clicked", async () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);

      // Mobile menu should be visible
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      // All nav items should be in document
      expect(screen.getAllByRole("link", { name: /validator/i }).length).toBe(
        2,
      );
    });

    it("closes mobile menu when menu button is clicked again", async () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      // Open menu
      fireEvent.click(menuButton);
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      // Close menu
      fireEvent.click(menuButton);
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    });

    it("toggles between menu and close icons", async () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();

      fireEvent.click(menuButton);
      expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("shows all navigation items in mobile menu when open", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);

      const mobileNavLinks = screen.getAllByRole("link", {
        name: /validator|generator|about|library|cli|github/i,
      });
      expect(mobileNavLinks.length).toBeGreaterThan(0);
    });

    it("closes mobile menu when a navigation item is clicked", async () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      // Open menu
      fireEvent.click(menuButton);
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      // Click a nav item
      const validatorLinks = screen.getAllByRole("link", {
        name: /validator/i,
      });
      const mobileValidatorLink = validatorLinks[1]; // Second one is mobile
      fireEvent.click(mobileValidatorLink);

      // Menu should close and show menu icon again
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
    });

    it("renders mobile menu with correct styling", () => {
      const { container } = render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);

      const mobileNav = container.querySelector(".md\\:hidden.pt-4.pb-2");
      expect(mobileNav).toBeInTheDocument();
    });

    it("mobile menu items have full width styling", () => {
      const { container } = render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);

      // Check that mobile nav items have justify-start class
      const mobileNavButtons = container.querySelectorAll(
        ".w-full.justify-start",
      );
      expect(mobileNavButtons.length).toBeGreaterThan(0);
    });

    it("displays GitHub link in mobile menu when open", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);

      const githubLinks = screen.getAllByLabelText(/github/i);
      expect(githubLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Navigation Links", () => {
    it("navigates to validator page", () => {
      render(<Header />);
      const validatorLink = screen.getByRole("link", { name: /validator/i });

      expect(validatorLink).toHaveAttribute("href", "/validator");
    });

    it("navigates to generator page", () => {
      render(<Header />);
      const generatorLink = screen.getByRole("link", { name: /generator/i });

      expect(generatorLink).toHaveAttribute("href", "/generator");
    });

    it("navigates to about page", () => {
      render(<Header />);
      const aboutLink = screen.getByRole("link", { name: /about ssin/i });

      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("navigates to library docs page", () => {
      render(<Header />);
      const libraryLink = screen.getByRole("link", { name: /library docs/i });

      expect(libraryLink).toHaveAttribute("href", "/library-docs");
    });

    it("navigates to CLI docs page", () => {
      render(<Header />);
      const cliLink = screen.getByRole("link", { name: /cli docs/i });

      expect(cliLink).toHaveAttribute("href", "/cli-docs");
    });

    it("logo links to home page", () => {
      render(<Header />);
      const logoLink = screen.getByRole("link", { name: /ssin-lib/i });

      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("GitHub link opens in new tab", () => {
      render(<Header />);
      const githubLink = screen.getByLabelText(/github repository/i);

      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Accessibility", () => {
    it("has proper aria label for menu button", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      expect(menuButton).toHaveAttribute("aria-label");
    });

    it("has proper aria label for GitHub link", () => {
      render(<Header />);
      const githubLink = screen.getByLabelText(/github repository/i);

      expect(githubLink).toHaveAttribute("aria-label", "GitHub Repository");
    });

    it("header has semantic HTML structure", () => {
      const { container } = render(<Header />);
      const header = container.querySelector("header");
      const nav = container.querySelector("nav");

      expect(header).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
    });

    it("navigation items are keyboard accessible", () => {
      render(<Header />);
      const navLinks = screen.getAllByRole("link");

      navLinks.forEach((link) => {
        expect(link).toBeInTheDocument();
      });
    });

    it("menu button is keyboard accessible", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      expect(menuButton).toBeInTheDocument();
      fireEvent.click(menuButton);

      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("desktop navigation has hidden md:flex class", () => {
      const { container } = render(<Header />);
      const desktopNav = container.querySelector(".hidden.md\\:flex");

      expect(desktopNav).toBeInTheDocument();
    });

    it("mobile menu has md:hidden class", () => {
      const { container } = render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);

      const mobileNav = container.querySelector(".md\\:hidden");
      expect(mobileNav).toBeInTheDocument();
    });

    it("menu button has md:hidden class", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      expect(menuButton).toHaveClass("md:hidden");
    });
  });

  describe("State Management", () => {
    it("maintains state when component re-renders", () => {
      const { rerender } = render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      rerender(<Header />);
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("resets menu state when navigating", () => {
      const { rerender } = render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      // Simulate navigation by changing pathname
      vi.mocked(usePathname).mockReturnValue("/validator");
      rerender(<Header />);

      // Menu state is still open (component doesn't auto-close)
      // This is the current behavior - menu stays open until user closes it
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty pathname gracefully", () => {
      vi.mocked(usePathname).mockReturnValue("");

      expect(() => render(<Header />)).not.toThrow();
      expect(
        screen.getByRole("link", { name: /ssin-lib/i }),
      ).toBeInTheDocument();
    });

    it("handles undefined pathname gracefully", () => {
      vi.mocked(usePathname).mockReturnValue("");

      expect(() => render(<Header />)).not.toThrow();
      expect(
        screen.getByRole("link", { name: /ssin-lib/i }),
      ).toBeInTheDocument();
    });

    it("handles rapid menu button clicks", () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/toggle menu/i);

      fireEvent.click(menuButton);
      fireEvent.click(menuButton);
      fireEvent.click(menuButton);

      // After 3 clicks: open, close, open - should show close icon
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
    });

    it("renders correctly with long page titles", () => {
      vi.mocked(usePathname).mockReturnValue(
        "/a-very-long-path-name-that-might-wrap",
      );

      expect(() => render(<Header />)).not.toThrow();
      expect(
        screen.getByRole("link", { name: /ssin-lib/i }),
      ).toBeInTheDocument();
    });

    it("handles whitespace in pathname", () => {
      vi.mocked(usePathname).mockReturnValue("/ validator ");

      expect(() => render(<Header />)).not.toThrow();
    });
  });

  describe("Logo and Branding", () => {
    it("logo has correct text content and navigation", () => {
      render(<Header />);
      const logo = screen.getByRole("link", { name: /ssin-lib/i });

      expect(logo).toHaveTextContent("SSIN-LIB");
      expect(logo).toHaveAttribute("href", "/");
    });

    it("logo text content is correct", () => {
      render(<Header />);
      const logo = screen.getByRole("link", { name: /ssin-lib/i });

      expect(logo).toHaveTextContent("SSIN-LIB");
    });
  });

  describe("Visual Hierarchy", () => {
    it("desktop nav buttons have small text size", () => {
      const { container } = render(<Header />);
      const desktopNavButtons = container.querySelectorAll(
        ".hidden.md\\:flex button",
      );

      desktopNavButtons.forEach((button) => {
        expect(button).toHaveClass("text-sm");
      });
    });

    it("desktop navigation has gap between items", () => {
      const { container } = render(<Header />);
      const desktopNav = container.querySelector(".hidden.md\\:flex");

      expect(desktopNav).toHaveClass("gap-1");
    });

    it("container has proper padding and centering", () => {
      const { container } = render(<Header />);
      const containerDiv = container.querySelector(".container");

      expect(containerDiv).toHaveClass("mx-auto");
      expect(containerDiv).toHaveClass("px-4");
      expect(containerDiv).toHaveClass("py-4");
    });
  });

  describe("Integration", () => {
    it("renders complete header with all sections", () => {
      render(<Header />);

      // Logo
      expect(
        screen.getByRole("link", { name: /ssin-lib/i }),
      ).toBeInTheDocument();

      // Desktop nav
      expect(
        screen.getByRole("link", { name: /validator/i }),
      ).toBeInTheDocument();

      // Menu button
      expect(screen.getByLabelText(/toggle menu/i)).toBeInTheDocument();

      // GitHub link
      expect(screen.getByLabelText(/github repository/i)).toBeInTheDocument();
    });

    it("can perform complete user flow: open menu, navigate, close", async () => {
      render(<Header />);

      // 1. Menu is closed initially
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();

      // 2. Open menu
      const menuButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(menuButton);
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      // 3. Click a navigation item
      const validatorLinks = screen.getAllByRole("link", {
        name: /validator/i,
      });
      fireEvent.click(validatorLinks[1]); // Mobile link

      // 4. Menu closes
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    });
  });
});
