import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "@/features/auth/AuthContext";
import { db } from "@/firebase/firestore";

/** True only for admins. One read per session, then cached. */
export function useIsAdmin(): boolean {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["user-role", user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "users", user!.uid));
      return snap.data()?.role === "admin";
    },
    enabled: !!user,
    staleTime: 30 * 60_000,
    retry: false,
  });

  return data === true;
}