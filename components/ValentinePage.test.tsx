import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

let mockSearchParams = new URLSearchParams("");

import { ValentinePage } from "./ValentinePage";
import { valentineConfig } from "@/config/valentine";

describe("ValentinePage", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams("");
  });

  it("renders the default headline when no name is provided", () => {
    render(<ValentinePage />);
    expect(
      screen.getByRole("heading", {
        name: new RegExp(valentineConfig.headline.line1, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("personalizes the headline with ?name=Jane", () => {
    mockSearchParams = new URLSearchParams("name=jane");
    render(<ValentinePage />);
    expect(
      screen.getByRole("heading", { name: /jane, will you be/i }),
    ).toBeInTheDocument();
  });

  it("renders Yes and No buttons", () => {
    render(<ValentinePage />);
    expect(screen.getByRole("button", { name: /^yes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^no/i })).toBeInTheDocument();
  });

  it("renders the promise text on first paint", () => {
    render(<ValentinePage />);
    expect(
      screen.getByText(valentineConfig.promise),
    ).toBeInTheDocument();
  });

  it("transitions to the success screen on Yes click", async () => {
    const user = userEvent.setup();
    render(<ValentinePage />);
    const yesButton = screen.getByRole("button", { name: /^yes/i });

    await user.click(yesButton);

    expect(
      screen.getByRole("heading", {
        name: new RegExp(valentineConfig.success.headline, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("shows the music toggle when backgroundMusic is configured", () => {
    render(<ValentinePage />);
    if (valentineConfig.backgroundMusic) {
      expect(
        screen.getByRole("button", { name: /play background music/i }),
      ).toBeInTheDocument();
    }
  });
});
