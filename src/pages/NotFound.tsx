/**
 * NotFound - Minimal 404 Page
 * Apple Cupertino style
 */

import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-dvh flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#F5F5F7" }}
    >
      <div className="text-center">
        <p 
          className="text-6xl font-semibold mb-4"
          style={{ color: "#1D1D1F" }}
        >
          404
        </p>
        <p 
          className="text-lg font-medium mb-8"
          style={{ color: "#8E8E93" }}
        >
          Page introuvable
        </p>
        <button
          onClick={() => navigate("/admin")}
          className="px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "#007AFF",
            color: "#FFFFFF",
          }}
        >
          Retour
        </button>
      </div>
    </div>
  );
}
