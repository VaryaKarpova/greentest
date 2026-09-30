import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthPage } from "./pages/AuthPage";
import { ChatPage } from "./pages/ChatPage";
import type { Credentials } from "./types";

const SESSION_KEY = "max-bridge-credentials";

function readCredentials(): Credentials | null {
  try {
    const storedValue = sessionStorage.getItem(SESSION_KEY);

    if (!storedValue) {
      return null;
    }

    const credentials: unknown = JSON.parse(storedValue);

    if (
      typeof credentials === "object" &&
      credentials !== null &&
      "idInstance" in credentials &&
      "apiTokenInstance" in credentials &&
      typeof credentials.idInstance === "string" &&
      typeof credentials.apiTokenInstance === "string" &&
      credentials.idInstance.length > 0 &&
      credentials.apiTokenInstance.length > 0
    ) {
      return credentials as Credentials;
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }

  return null;
}

export function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(readCredentials);
  const queryClient = useQueryClient();

  const handleLogin = (nextCredentials: Credentials) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextCredentials));
    setCredentials(nextCredentials);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    queryClient.clear();
    setCredentials(null);
  };

  return credentials ? (
    <ChatPage idInstance={credentials.idInstance} onLogout={handleLogout} />
  ) : (
    <AuthPage onLogin={handleLogin} />
  );
}
