import { Card } from "@/components/ui/card";

export function Disclaimer() {
  return (
    <Card className="p-6 bg-muted/50">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Disclaimer:</span> All
        tools, documentation, and resources provided on this website—including
        the SSIN generator, validator, library, and related information—are
        intended for educational and testing purposes only. Generated SSIN
        numbers are not official and should not be used for any official
        purpose. Any misuse of these tools or information for fraudulent or
        illegal purposes is strictly prohibited and may lead to legal
        consequences. The authors assume no liability for any unauthorized or
        unlawful use.
      </p>
    </Card>
  );
}
