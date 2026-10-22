import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">Payment cancelled</h1>
      <Link href="/patient/appointments" className="mt-4 inline-block text-blue-600 underline">
        Back to appointments
      </Link>
    </div>
  );
}