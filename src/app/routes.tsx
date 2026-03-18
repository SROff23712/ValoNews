import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { NewsPage } from "./pages/NewsPage";
import { AgentsPage } from "./pages/AgentsPage";
import { MapsPage } from "./pages/MapsPage";
import { SkinsPage } from "./pages/SkinsPage";
import { WeaponSkinsPage } from "./pages/WeaponSkinsPage";
import { SkinDetailPage } from "./pages/SkinDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: NewsPage },
      { path: "agents", Component: AgentsPage },
      { path: "cartes", Component: MapsPage },
      {
        path: "skins",
        children: [
          { index: true, Component: SkinsPage },
          { path: ":weaponUuid", Component: WeaponSkinsPage },
          { path: "details/:skinUuid", Component: SkinDetailPage },
        ],
      },
    ],
  },
]);
