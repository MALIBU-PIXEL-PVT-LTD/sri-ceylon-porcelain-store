import { SignInForm } from "@/components/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-10 sm:px-6">
      <SignInForm />
    </div>
  );
}
