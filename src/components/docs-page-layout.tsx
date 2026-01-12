import { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface DocsPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocsPageLayout({
  title,
  description,
  children,
}: DocsPageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>

        <Card className="p-8">
          <article className="mdx-content">{children}</article>
        </Card>
      </div>
    </div>
  );
}
