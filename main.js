import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center text-xl">
      ✅ La app carga correctamente
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
