import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";
import { occasions } from "@/config/occasions";

describe("Landing page", () => {
  it("renders the hero headline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /make every moment special/i }),
    ).toBeInTheDocument();
  });

  it("renders one tile per occasion with correct href", () => {
    render(<Home />);
    for (const occasion of occasions) {
      const link = screen.getByRole("link", { name: new RegExp(occasion.name, "i") });
      expect(link).toHaveAttribute("href", `/${occasion.slug}`);
    }
  });

  it("labels implemented occasions with 'Create card' and stubs with 'Coming soon'", () => {
    render(<Home />);
    const tiles = screen.getAllByRole("link");
    const occasionTiles = tiles.filter((tile) =>
      tile.getAttribute("href")?.startsWith("/") &&
      tile.getAttribute("href") !== "/" &&
      !tile.getAttribute("href")?.includes("instagram"),
    );
    expect(occasionTiles).toHaveLength(occasions.length);

    const createCardCount = occasions.filter((o) => o.implemented).length;
    const comingSoonCount = occasions.filter((o) => !o.implemented).length;

    expect(screen.getAllByText(/create card/i)).toHaveLength(createCardCount);
    expect(screen.getAllByText(/coming soon/i)).toHaveLength(comingSoonCount);
  });
});
