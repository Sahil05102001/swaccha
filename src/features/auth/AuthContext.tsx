import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";

import { auth } from "@/firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => { },
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hadUser = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // A signed-in user just signed out: drop their cached data.
      if (!firebaseUser && hadUser.current) {
        queryClient.clear();
      }

      hadUser.current = Boolean(firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [queryClient]);

  const refreshUser = async () => {
    if (!auth.currentUser) return;

    await auth.currentUser.reload();

    // Force a new login token, so the "email verified" flag that
    // Firestore rules check is up to date right after verification.
    await auth.currentUser.getIdToken(true);

    setUser({ ...auth.currentUser });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}