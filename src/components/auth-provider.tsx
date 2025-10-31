"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { KyozoConnectLogo } from "@/components/icons";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === "/login";
    
    if (!user && !isAuthPage) {
      router.replace("/login");
    } else if (user && isAuthPage) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <KyozoConnectLogo className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading KyozoConnect2...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = pathname === "/login";
  if ((!user && !isAuthPage) || (user && isAuthPage)) {
    // While redirecting, show the loader to prevent content flash
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <KyozoConnectLogo className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading KyozoConnect2...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
