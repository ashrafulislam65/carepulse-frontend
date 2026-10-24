"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
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

  if (loading || !allowed) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin text-brand-600" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }
  return <>{children}</>;
}