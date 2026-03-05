import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Heart, Check, X, AlertTriangle, Star } from "lucide-react";
import { Icon } from "./Icon";

describe("Icon", () => {
  describe("rendering", () => {
    it("renders icon with Lucide icon component", () => {
      render(<Icon icon={Heart} aria-label="Heart icon" />);
      const icon = screen.getByLabelText("Heart icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("role", "button");
    });

    it("renders icon with custom React node", () => {
      render(
        <Icon icon={<span data-testid="custom-icon">★</span>} aria-label="Star" />
      );
      const icon = screen.getByLabelText("Star");
      expect(icon).toBeInTheDocument();
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("applies circular background", () => {
      const { container } = render(<Icon icon={Check} />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("rounded-full");
    });
  });

  describe("variants", () => {
    it("applies primary variant by default", () => {
      const { container } = render(<Icon icon={Check} />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("bg-[var(--primary)]");
    });

    it("applies secondary variant", () => {
      const { container } = render(<Icon icon={Check} variant="secondary" />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("bg-[var(--secondary)]");
    });

    it("applies success variant", () => {
      const { container } = render(<Icon icon={Check} variant="success" />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("bg-[var(--success)]");
    });

    it("applies danger variant", () => {
      const { container } = render(<Icon icon={X} variant="danger" />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("bg-[var(--danger)]");
    });

    it("applies warning variant", () => {
      const { container } = render(<Icon icon={AlertTriangle} variant="warning" />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("bg-[var(--warning)]");
    });
  });

  describe("sizes", () => {
    it("applies md size by default", () => {
      const { container } = render(<Icon icon={Check} />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("h-10 w-10");
    });

    it("applies sm size", () => {
      const { container } = render(<Icon icon={Check} size="sm" />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("h-8 w-8");
    });

    it("applies lg size", () => {
      const { container } = render(<Icon icon={Check} size="lg" />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("h-12 w-12");
    });
  });

  describe("disabled state", () => {
    it("applies disabled styles when disabled", () => {
      const { container } = render(<Icon icon={Check} disabled />);
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("opacity-50");
      expect(iconContainer).toHaveClass("cursor-not-allowed");
    });

    it("sets aria-disabled when disabled", () => {
      render(<Icon icon={Check} disabled aria-label="Disabled icon" />);
      const icon = screen.getByLabelText("Disabled icon");
      expect(icon).toHaveAttribute("aria-disabled", "true");
    });

    it("changes role to img when disabled", () => {
      render(<Icon icon={Check} disabled aria-label="Disabled icon" />);
      const icon = screen.getByLabelText("Disabled icon");
      expect(icon).toHaveAttribute("role", "img");
    });

    it("sets tabIndex to -1 when disabled", () => {
      render(<Icon icon={Check} disabled aria-label="Disabled icon" />);
      const icon = screen.getByLabelText("Disabled icon");
      expect(icon).toHaveAttribute("tabIndex", "-1");
    });

    it("is not clickable when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Icon icon={Check} disabled onClick={onClick} />);
      const icon = screen.getByRole("img");
      await user.click(icon);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("accepts aria-label prop", () => {
      render(<Icon icon={Heart} aria-label="Favorite" />);
      const icon = screen.getByLabelText("Favorite");
      expect(icon).toBeInTheDocument();
    });

    it("is focusable when not disabled", () => {
      render(<Icon icon={Check} aria-label="Check" />);
      const icon = screen.getByLabelText("Check");
      expect(icon).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <Icon icon={Check} className="custom-class" />
      );
      const iconContainer = container.firstChild as HTMLElement;
      expect(iconContainer).toHaveClass("custom-class");
    });
  });

  describe("click handling", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Icon icon={Heart} onClick={onClick} aria-label="Click me" />);
      const icon = screen.getByLabelText("Click me");
      await user.click(icon);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick when Enter key is pressed", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Icon icon={Heart} onClick={onClick} aria-label="Click me" />);
      const icon = screen.getByLabelText("Click me");
      icon.focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick when Space key is pressed", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Icon icon={Heart} onClick={onClick} aria-label="Click me" />);
      const icon = screen.getByLabelText("Click me");
      icon.focus();
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
