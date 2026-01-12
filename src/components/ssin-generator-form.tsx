"use client";

import {
  Gender,
  LocalDate,
  SSINExtractorHelper,
  SSINGeneratorHelper,
  Type,
} from "@bn3t/ssin-lib";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon, CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function SSINGeneratorForm() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [orderNumber, setOrderNumber] = useState("");
  const [generatedSSIN, setGeneratedSSIN] = useState("");
  const [copied, setCopied] = useState(false);

  const generateSSIN = () => {
    if (!birthDate || !gender) {
      return;
    }

    try {
      const year = birthDate.getFullYear();
      const month = birthDate.getMonth() + 1;
      const day = birthDate.getDate();

      const localDate = LocalDate.of(year, month, day);
      const genderEnum = gender === "male" ? Gender.MALE : Gender.FEMALE;

      let order: number | null = null;
      if (orderNumber) {
        order = parseInt(orderNumber, 10);
      }

      const ssinString = SSINGeneratorHelper.generate(
        localDate,
        genderEnum,
        order,
        Type.REGULAR,
      );
      const formattedSsin = SSINExtractorHelper.format(ssinString);
      setGeneratedSSIN(formattedSsin);
      setCopied(false);
    } catch (error) {
      console.error("Error generating SSIN:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSSIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card className="p-8 mb-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-lg h-10",
                    !birthDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={2100}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Gender</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                type="button"
                variant={gender === "male" ? "default" : "outline"}
                onClick={() => setGender("male")}
                className="h-auto py-4"
              >
                <div>
                  <div className="font-bold mb-1">Male</div>
                  <div className="text-xs opacity-70">Odd order numbers</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={gender === "female" ? "default" : "outline"}
                onClick={() => setGender("female")}
                className="h-auto py-4"
              >
                <div>
                  <div className="font-bold mb-1">Female</div>
                  <div className="text-xs opacity-70">Even order numbers</div>
                </div>
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="orderNumber">
              Order Number{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="orderNumber"
              type="text"
              placeholder="Leave empty for random"
              value={orderNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 3) {
                  setOrderNumber(value);
                }
              }}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {gender === "male" && "Must be odd (001, 003, ..., 997)"}
              {gender === "female" && "Must be even (002, 004, ..., 998)"}
              {!gender && "Select gender first"}
            </p>
          </div>

          <Button
            onClick={generateSSIN}
            className="w-full"
            size="lg"
            disabled={!birthDate || !gender}
          >
            Generate SSIN
          </Button>
        </div>
      </Card>

      {generatedSSIN && (
        <Card className="p-6 border-primary">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Generated SSIN</h3>
              <p className="text-muted-foreground">
                Your valid SSIN number is ready
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted mb-4">
              <code className="text-2xl font-mono font-bold">
                {generatedSSIN}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">Breakdown:</p>
              <div className="space-y-1">
                <p>
                  <Badge variant="outline">
                    {generatedSSIN.substring(0, 2)}
                  </Badge>{" "}
                  Year of birth
                </p>
                <p>
                  <Badge variant="outline">
                    {generatedSSIN.substring(3, 5)}
                  </Badge>{" "}
                  Month of birth
                </p>
                <p>
                  <Badge variant="outline">
                    {generatedSSIN.substring(6, 8)}
                  </Badge>{" "}
                  Day of birth
                </p>
                <p>
                  <Badge variant="outline">
                    {generatedSSIN.substring(9, 12)}
                  </Badge>{" "}
                  Order number ({gender})
                </p>
                <p>
                  <Badge variant="outline">
                    {generatedSSIN.substring(13, 15)}
                  </Badge>{" "}
                  Check digits
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 mt-8 bg-muted/50">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">About Order Numbers:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Males must use odd numbers (001, 003, ..., 997)</li>
              <li>Females must use even numbers (002, 004, ..., 998)</li>
              <li>Numbers identify people born on the same day</li>
            </ul>
          </div>
        </div>
      </Card>
    </>
  );
}
