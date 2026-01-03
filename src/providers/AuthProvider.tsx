import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/models";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInRequest } from "../services/authService";

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
  const queryClient = useQueryClient();
  
  const { mutate: login } = useMutation({
    mutationFn: (handle: string) => signInRequest(handle),
    onSuccess: (data) => {
      setSession(data);
      saveSession(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    loadSession();
  }, []);

  const logout = () => {
    setSession(null);
    saveSession(null);
    queryClient.clear();
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
