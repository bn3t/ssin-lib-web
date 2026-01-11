import { DocsPageLayout } from "@/components/docs-page-layout";
import CLIContent, { frontmatter } from "@/content/docs/cli.mdx";

export default function CLIDocsPage() {
  return (
    <DocsPageLayout
      title={frontmatter.title ?? ""}
      description={frontmatter.description}
    >
      <CLIContent />
    </DocsPageLayout>
  );
}
