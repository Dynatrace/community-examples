// NOTE: written against the documented APIs but not yet run in CI. Verify after `npm install`.
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { CommunityHeader } from "./CommunityHeader";

vi.mock("@dynatrace-sdk/app-environment", () => ({
  getAppName: () => "Sample Trace Explorer",
  getAppVersion: () => "0.1.0",
  getAppId: () => "my.team.sample.trace.explorer",
  getCurrentUserDetails: () => ({ email: "dev@example.com" }),
}));
vi.mock("@dynatrace-sdk/navigation", () => ({ sendIntent: vi.fn() }));

const setup = (props = {}) =>
  render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <CommunityHeader {...props} />
      </MemoryRouter>
    </IntlProvider>
  );

describe("CommunityHeader", () => {
  it("always shows the Community chip", () => {
    setup();
    // Strato renders the logo chip with our overridden label; guards against a changed Strato message id
    expect(screen.getAllByText("Community").length).toBeGreaterThan(0);
    expect(screen.queryByText("Preview")).toBeNull();
  });

  it("shows the app name as the home link", () => {
    setup();
    expect(screen.getAllByText("Sample Trace Explorer")[0].closest("a")?.getAttribute("href")).toBe("/");
  });

  it("renders the tabs it is given", () => {
    setup({ tabs: [{ label: "Overview", to: "/" }] });
    expect(screen.getAllByText("Overview").length).toBeGreaterThan(0);
  });
});
