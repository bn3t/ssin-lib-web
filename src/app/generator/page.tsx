import { SSINGeneratorForm } from "@/components/ssin-generator-form";

export default function GeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">SSIN Generator</h1>
          <p className="text-muted-foreground text-lg">
            Generate a valid Belgian Social Security Identification Number
            (SSIN).
          </p>
        </div>

        <SSINGeneratorForm />
      </div>
    </div>
  );
}
