import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3500,
          // Main
          style: {
            background: "#ffffff",
            color: "#374151",
            fontSize: "12px",
            fontWeight: "500",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
            border: "1px solid #f3f4f6",
          },
          // (Success)
          success: {
            iconTheme: {
              primary: "#2563eb", 
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #2563eb",
            },
          },
          // (Error)
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />
      <AppRoutes />
    </>
  );
}