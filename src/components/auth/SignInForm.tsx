"use client";

import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { auth, googleProvider } from "@/lib/firebase/firebase";
import { ErrorMassage } from "@/components/ui";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function SignInForm() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_STORE_BACKEND_URL;
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const getFriendlyAuthError = (
    error: unknown,
    fallback: string,
  ): string => {
    if (!(error instanceof FirebaseError)) {
      return fallback;
    }

    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in with your password.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Incorrect email or password.";
      case "auth/user-not-found":
        return "No account found for this email.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was closed before completion.";
      case "auth/popup-blocked":
        return "Popup was blocked by the browser. Please allow popups and try again.";
      case "auth/network-request-failed":
        return "Network issue detected. Check your internet and try again.";
      default:
        return fallback;
    }
  };

  const syncCustomerToBackend = async (idToken: string) => {
    const endpoints = [
      backendUrl,
      "https://portal.sriceylonporcelain.com/api/graphql",
      "http://localhost:7300/graphql",
    ].filter(Boolean) as string[];

    let lastError = "Unable to sync account profile";

    for (const endpoint of endpoints) {
      try {
        const syncResponse = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation SyncCustomerAuthUser($idToken: String!) {
                syncCustomerAuthUser(idToken: $idToken) {
                  firebaseUid
                }
              }
            `,
            variables: { idToken },
          }),
        });

        const syncPayload = await syncResponse.json();
        if (syncResponse.ok && !syncPayload?.errors?.length) {
          return;
        }

        lastError = syncPayload?.errors?.[0]?.message || `Sync failed at ${endpoint}`;
      } catch (error) {
        lastError = error instanceof Error ? error.message : `Sync failed at ${endpoint}`;
      }
    }

    throw new Error(lastError);
  };

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      setEmailLoading(true);
      setEmailError(null);
      setGoogleError(null);
      const methods = await fetchSignInMethodsForEmail(auth, email);
      let credential;
      if (methods.length === 0) {
        credential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        credential = await signInWithEmailAndPassword(auth, email, password);
      }
      const idToken = await credential.user.getIdToken();
      await syncCustomerToBackend(idToken);
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : getFriendlyAuthError(error, "Sign in failed. Please try again.");
      setEmailError(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError(null);
      setEmailError(null);
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      await syncCustomerToBackend(idToken);
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : getFriendlyAuthError(error, "Google sign in failed. Please try again.");
      setGoogleError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="text-center text-sm font-medium uppercase tracking-[0.24em] text-stone-900 sm:text-base">
        Sri Ceylon Porcelain
      </p>
      <h1 className="mt-2 text-center text-sm font-medium tracking-normal text-stone-600">
        Sign in to your account
      </h1>

      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <form className="space-y-5" onSubmit={handleEmailSignIn}>
        <div>
          <label
            htmlFor="sign-in-email"
            className="block text-sm font-medium text-stone-800"
          >
            Email address
          </label>
          <input
            id="sign-in-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-md border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          />
        </div>

        <div>
          <label
            htmlFor="sign-in-password"
            className="block text-sm font-medium text-stone-800"
          >
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="sign-in-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-stone-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 inline-flex items-center pr-3 text-stone-500 transition-colors hover:text-stone-800"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
            <input
              name="remember"
              type="checkbox"
              className="size-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
            />
            Remember me
          </label>
          <a
            href="#"
            className="text-sm font-medium text-stone-700 underline-offset-4 transition-colors hover:text-stone-900 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={emailLoading}
          className="flex h-11 w-full items-center justify-center rounded-md bg-stone-900 text-sm font-semibold text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
        >
          {emailLoading ? "Signing in..." : "Sign in"}
        </button>
        {emailError ? <ErrorMassage title="Sign in failed" message={emailError} /> : null}
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs font-medium">
            <span className="bg-white px-3 text-stone-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            <GoogleIcon className="size-5 shrink-0" />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>
          {googleError ? (
            <div className="mt-3">
              <ErrorMassage title="Google sign-in failed" message={googleError} />
            </div>
          ) : null}
        </div>
      </div>
      {googleLoading ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
            <p className="text-sm font-medium text-stone-900">
              Logging in with Google...
            </p>
            <p className="mt-1 text-xs text-stone-500">Please wait</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
