import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";

import { TrackedLink } from "@/components/tracked-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Belgian SSIN Management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Manage Belgian Social Security Numbers with Confidence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
            A comprehensive library for validating, generating, and managing
            Belgian Social Security Identification Numbers (SSIN) with ease.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <TrackedLink
              href="/validator"
              eventName="cta_clicked"
              eventProperties={{ label: "Validate SSIN", source: "home_hero" }}
            >
              <Button size="lg" className="gap-2">
                Validate SSIN
                <ArrowRight className="w-4 h-4" />
              </Button>
            </TrackedLink>
            <TrackedLink
              href="/generator"
              eventName="cta_clicked"
              eventProperties={{ label: "Generate SSIN", source: "home_hero" }}
            >
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
              >
                Generate SSIN
              </Button>
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Validation</h3>
            <p className="text-muted-foreground">
              Validate existing SSIN numbers with format checking and checksum
              verification.
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Generation</h3>
            <p className="text-muted-foreground">
              Create valid SSIN numbers for testing purposes with proper
              formatting and rules.
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compliant</h3>
            <p className="text-muted-foreground">
              Follows official Belgian SSIN structure and validation rules
              accurately.
            </p>
          </Card>
        </div>
      </section>

      {/* SSIN Structure Explanation */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Understanding SSIN Numbers
          </h2>
          <Card className="p-8 mb-8">
            <p className="text-muted-foreground mb-6">
              The Belgian Social Security Identification Number (SSIN), formerly
              known as the National Number, is a unique identifier assigned to
              each citizen. This document explains the structure, rules, and
              characteristics of SSIN numbers.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">Structure</h3>
                <p className="mb-4">
                  An SSIN consists of 11 digits, typically formatted as:{" "}
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                    YY.MM.DD-OOO.CC
                  </code>
                </p>
                <p className="text-muted-foreground mb-4">
                  The number is composed of three main parts:
                </p>
              </div>

              <div className="space-y-4">
                <div className="pl-4 border-l-4 border-primary">
                  <h4 className="font-bold mb-2">1. Birth Date (6 digits)</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                        YY
                      </code>
                      : Year of birth (last two digits)
                    </li>
                    <li>
                      <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                        MM
                      </code>
                      : Month of birth
                    </li>
                    <li>
                      <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                        DD
                      </code>
                      : Day of birth
                    </li>
                  </ul>
                </div>

                <div className="pl-4 border-l-4 border-primary">
                  <h4 className="font-bold mb-2">2. Order Number (3 digits)</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                        OOO
                      </code>
                      : A sequence number for people born on the same day
                    </li>
                    <li>For men: odd numbers from 001 to 997</li>
                    <li>For women: even numbers from 002 to 998</li>
                  </ul>
                </div>

                <div className="pl-4 border-l-4 border-primary">
                  <h4 className="font-bold mb-2">3. Check Digits (2 digits)</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                        CC
                      </code>
                      : A control number calculated from the previous digits
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Gender Determination</h3>
            <p className="text-muted-foreground mb-4">
              The gender of a person can be determined from their SSIN:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                If the order number is{" "}
                <span className="font-semibold text-foreground">odd</span> (001,
                003, ..., 997), the person is{" "}
                <span className="font-semibold text-foreground">male</span>
              </li>
              <li>
                If the order number is{" "}
                <span className="font-semibold text-foreground">even</span>{" "}
                (002, 004, ..., 998), the person is{" "}
                <span className="font-semibold text-foreground">female</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
