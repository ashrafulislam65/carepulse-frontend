import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment successful</h1>
      <p className="mt-2 text-gray-600">Payment confirm hote kichu second lagte pare.</p>
      <Link href="/patient/appointments" className="mt-4 inline-block text-blue-600 underline">
        Back to appointments
      </Link>
    </div>
  );
}