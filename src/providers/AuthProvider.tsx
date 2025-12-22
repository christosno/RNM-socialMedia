import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/models";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "session";

type Session = {
  user: User;
  accessToken: string;
};

const AuthContext = createContext<{
  login: (handle: string) => void;
  logout: () => void;
  session: Session | null;
  isLoading: boolean;
}>({
  login: () => {},
  logout: () => {},
  session: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const login = (handle: string) => {
    const session = {
      user: {
        id: "1",
        name: "John Doe",
        handle: handle,
        avatar:
          "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg",
      },
      accessToken: "1234567890",
    };
    setSession(session);
    saveSession(session);
  };

  const logout = () => {
    setSession(null);
    saveSession(null);
  };

  const saveSession = async (value: Session | null) => {
    if (value) {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(value));
    } else {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    }
  };

  const loadSession = async () => {
    const session = await SecureStore.getItemAsync(SESSION_KEY);
    if (session) {
      setSession(JSON.parse(session));
    } else {
      setSession(null);
    }

    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
