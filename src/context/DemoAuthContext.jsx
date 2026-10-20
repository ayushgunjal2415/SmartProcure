
import { createContext, useContext, useState } from "react";

const DemoAuthContext = createContext(null);

const DEMO_ROLES = ["Employee", "Officer", "Manager", "Vendor", "Admin"];

export function DemoAuthProvider({ children }) {
  const [role, setRole] = useState("Employee");

  function switchRole(nextRole) {
    if (DEMO_ROLES.includes(nextRole)) {
      setRole(nextRole);
    }
  }

  return (
    <DemoAuthContext.Provider value={{ role, switchRole, DEMO_ROLES }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);

  if (!context) {
    throw new Error("useDemoAuth must be used inside DemoAuthProvider.");
  }

  return context;
}
