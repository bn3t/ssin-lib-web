"use client";

import { Gender, SSIN, SSINValidatorHelper, Type } from "@bn3t/ssin-lib";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import posthog from "posthog-js";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ValidationResult {
  isValid: boolean;
  message: string;
  parsed?: {
    formattedSsin: string;
    birthdate: string | null;
    gender: string;
    orderNumber: string;
    controlNumber: string;
    type: string;
  };
}

export function SSINValidatorForm() {
  const [ssin, setSsin] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const validateSSIN = () => {
    const cleanedSsin = SSINValidatorHelper.clean(ssin);

    if (cleanedSsin.length !== 11) {
      setValidationResult({
        isValid: false,
        message: "SSIN must contain exactly 11 digits",
      });

      // PostHog: Track invalid validation - wrong length
      posthog.capture("ssin_validated", {
        is_valid: false,
        failure_reason: "wrong_length",
      });
      return;
    }

    if (!SSINValidatorHelper.isValid(cleanedSsin)) {
      setValidationResult({
        isValid: false,
        message: "Invalid SSIN - checksum does not match",
      });

      // PostHog: Track invalid validation - checksum mismatch
      posthog.capture("ssin_validated", {
        is_valid: false,
        failure_reason: "checksum_mismatch",
      });
      return;
    }

    try {
      const ssinObj = new SSIN(cleanedSsin);
      const birthdate = ssinObj.getBirthdate();
      const gender = ssinObj.getGender();

      const ssinType = formatType(ssinObj.getType());
      const ssinGender = formatGender(gender);

      setValidationResult({
        isValid: true,
        message: "Valid SSIN number",
        parsed: {
          formattedSsin: ssinObj.getFormattedSSIN(),
          birthdate: birthdate?.toString() ?? null,
          gender: ssinGender,
          orderNumber: ssinObj.getOrderNumber(),
          controlNumber: ssinObj.getControlNumber(),
          type: ssinType,
        },
      });

      // PostHog: Track successful validation
      posthog.capture("ssin_validated", {
        is_valid: true,
        ssin_type: ssinType.toLowerCase(),
        gender: ssinGender.toLowerCase(),
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: "Error parsing SSIN",
      });

      // PostHog: Track validation parsing error
      posthog.capture("ssin_validated", {
        is_valid: false,
        failure_reason: "parsing_error",
      });
      posthog.captureException(error);
    }
  };

  const formatGender = (gender: Gender | null): string => {
    switch (gender) {
      case Gender.MALE:
        return "Male";
      case Gender.FEMALE:
        return "Female";
      default:
        return "Unknown";
    }
  };

  const formatType = (type: Type): string => {
    switch (type) {
      case Type.REGULAR:
        return "Regular";
      case Type.DOB_UNKNOWN:
        return "Unknown DOB";
      case Type.BIS:
        return "BIS";
      case Type.TER:
        return "TER";
      case Type.UNOFFICIAL:
        return "Unofficial";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <Card className="p-8 mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ssin">SSIN Number</Label>
            <Input
              id="ssin"
              type="text"
              placeholder="Example: 05.02.09-407.53"
              value={ssin}
              onChange={(e) => setSsin(e.target.value)}
              className="text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validateSSIN();
                }
              }}
            />
          </div>
          <Button
            onClick={validateSSIN}
            className="w-full"
            size="lg"
            disabled={!ssin.trim()}
          >
            Validate SSIN
          </Button>
        </div>
      </Card>

      {validationResult && (
        <Card
          className={`p-6 ${validationResult.isValid ? "border-primary" : "border-destructive"}`}
        >
          <div className="flex items-start gap-3 mb-4">
            {validationResult.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-lg mb-1">
                {validationResult.isValid ? "Valid SSIN" : "Invalid SSIN"}
              </h3>
              <p className="text-muted-foreground">
                {validationResult.message}
              </p>
            </div>
          </div>

          {validationResult.isValid && validationResult.parsed && (
            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <h4 className="font-semibold mb-3">Parsed Information:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm text-muted-foreground">
                    Formatted
                  </span>
                  <Badge variant="secondary">
                    {validationResult.parsed.formattedSsin}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="secondary">
                    {validationResult.parsed.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm text-muted-foreground">
                    Birth Date
                  </span>
                  <Badge variant="secondary">
                    {validationResult.parsed.birthdate ?? "Unknown"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <Badge variant="secondary">
                    {validationResult.parsed.gender}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm text-muted-foreground">
                    Order Number
                  </span>
                  <Badge variant="secondary">
                    {validationResult.parsed.orderNumber}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm text-muted-foreground">
                    Control Number
                  </span>
                  <Badge variant="secondary">
                    {validationResult.parsed.controlNumber}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 mt-8 bg-muted/50">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">SSIN Format:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                  YY
                </code>
                : Year of birth (00-99)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                  MM
                </code>
                : Month of birth (01-12)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                  DD
                </code>
                : Day of birth (01-31)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                  OOO
                </code>
                : Order number (odd for males, even for females)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                  CC
                </code>
                : Check digits
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </>
  );
}
