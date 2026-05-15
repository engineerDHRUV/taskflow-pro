import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = true) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !token) {
      router.replace("/login");
    }
  }, [token, requireAuth, router]);

  return { user, token, isAuthenticated: !!token, isAdmin: user?.role === "ADMIN" };
}
