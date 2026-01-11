import { SSINValidatorForm } from "@/components/ssin-validator-form";

export default function ValidatorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">SSIN Validator</h1>
          <p className="text-muted-foreground text-lg">
            Validate a Belgian Social Security Identification Number (SSIN).
            Enter the number with or without formatting (YY.MM.DD-OOO.CC).
          </p>
        </div>

        <SSINValidatorForm />
      </div>
    </div>
  );
}
