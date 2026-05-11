import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Dashboard } from "./pages/Dashboard";
import { UploadView } from "./pages/UploadView";
import { AnalysisView } from "./pages/AnalysisView";
import { TerrainView } from "./pages/TerrainView";
import { AnalyticsView } from "./pages/AnalyticsView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "upload", Component: UploadView },
      { path: "enhancement", Component: AnalysisView },
      { path: "ice-detection", Component: AnalysisView },
      { path: "analysis", Component: AnalysisView },
      { path: "terrain", Component: TerrainView },
      { path: "analytics", Component: AnalyticsView },
      { path: "reports", Component: Dashboard }, // Mocked out
      { path: "settings", Component: Dashboard }, // Mocked out
      { path: "*", Component: Dashboard },
    ],
  },
]);
