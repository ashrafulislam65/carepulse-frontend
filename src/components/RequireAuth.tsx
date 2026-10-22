"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/roles";
import { Role } from "@/lib/types";

export default function RequireAuth({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = !!user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace(homeFor(user.role));
  }, [user, loading, allowed, router]);

  if (loading || !allowed) return <p className="p-4 text-gray-500">Loading...</p>;
  return <>{children}</>;
}