/**
 * Web Studio Layout - Wrapper avec le Provider
 */

import { Outlet } from "react-router-dom";
import { WebStudioProvider } from "@/contexts/WebStudioContext";

export default function WebStudioLayout() {
  return (
    <WebStudioProvider>
      <Outlet />
    </WebStudioProvider>
  );
}
