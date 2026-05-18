import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";
import { occasions } from "@/config/occasions";

describe("Landing page", () => {
  it("renders the hero headline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /make every moment/i }),
    ).toBeInTheDocument();
  });

  it("renders at least one link per occasion pointing at the right route", () => {
    render(<Home />);
    for (const occasion of occasions) {
      const links = screen.getAllByRole("link", {
        name: new RegExp(occasion.name, "i"),
      });
      // Grid tile + footer link may both exist; at least one must point at the route.
      expect(
        links.some((link) => link.getAttribute("href") === `/${occasion.slug}`),
      ).toBe(true);
    }
  });

  it("labels implemented occasions with 'Create card' and stubs with 'Coming soon'", () => {
    render(<Home />);

    const createCardCount = occasions.filter((o) => o.implemented).length;
    const comingSoonCount = occasions.filter((o) => !o.implemented).length;

    expect(screen.getAllByText(/create card/i)).toHaveLength(createCardCount);
    expect(screen.getAllByText(/coming soon/i)).toHaveLength(comingSoonCount);
  });
});
