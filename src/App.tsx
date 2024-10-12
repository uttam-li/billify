import { Route, Routes } from "react-router-dom";
import Layout from "./components/global/layout";
import PageNotFound from "./components/global/404";
import LandingPage from "./pages/landing-page/page";
import Authentication from "./pages/authentication";
import RequireAuth from "./components/require-auth";
import OAuthSuccess from "./pages/oauth-success";
import StartupPage from "./pages/startup-page";
import BussSelectionPage from "./pages/buss-selection";
import DashLayout from "./components/global/dash-layout";
import { DashboardComponent } from "./pages/dashboard";
import { Settings } from "./pages/settings";
import { Customers } from "./pages/customers";
import { Products } from "./pages/products";
import { Invoices } from "./pages/invoices";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Authentication />} />
        <Route element={<RequireAuth />}>
          <Route path="/startup" element={<StartupPage />} />
          <Route path="/buss" element={<BussSelectionPage />} />
          <Route path="/buss/:id" element={<DashLayout />}>
            <Route path="dashboard" element={<DashboardComponent />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
