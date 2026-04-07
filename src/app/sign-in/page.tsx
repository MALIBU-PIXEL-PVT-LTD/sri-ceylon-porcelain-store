"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SignInForm } from "@/components/auth";
import { auth } from "@/lib/firebase/firebase";

export default function SignInPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
        return;
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-stone-500">Checking account...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-10 sm:px-6">
      <SignInForm />
    </div>
  );
}
