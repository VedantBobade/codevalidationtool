import ScriptValidator from "@/components/ScriptValidator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Code Validation Tool</h1>
      <ScriptValidator />
    </div>
  );
}
