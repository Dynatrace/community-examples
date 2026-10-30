import React from "react";
import { PageLayout } from "@dynatrace/strato-components/layouts";
import { Route, Routes } from "react-router-dom";
import { CommunityHeader } from "./components/CommunityHeader";
import { Data } from "./pages/Data";
import { Home } from "./pages/Home";

// Tabs are optional. Use them only if the app has several top-level flows.
const tabs = [
  { label: "Overview", to: "/" },
  { label: "Explore Data", to: "/data" },
];

export const App = () => (
  <PageLayout>
    <PageLayout.Header>
      <CommunityHeader tabs={tabs} />
    </PageLayout.Header>
    <PageLayout.Content>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </PageLayout.Content>
  </PageLayout>
);
