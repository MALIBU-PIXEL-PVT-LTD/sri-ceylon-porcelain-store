type ErrorMassageProps = {
  title?: string;
  message: string;
};

export function ErrorMassage({
  title = "Something went wrong",
  message,
}: ErrorMassageProps) {
  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900"
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}
