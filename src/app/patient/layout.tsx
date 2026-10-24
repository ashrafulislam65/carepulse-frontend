import PatientNav from "@/components/PatientNav";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PatientNav />
      {children}
    </div>
  );
}