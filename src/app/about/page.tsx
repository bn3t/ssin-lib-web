import { DocsPageLayout } from "@/components/docs-page-layout";
import ExplanationContent, {
  frontmatter,
} from "@/content/docs/explanation.mdx";

export default function AboutPage() {
  return (
    <DocsPageLayout
      title={frontmatter.title ?? ""}
      description={frontmatter.description}
    >
      <ExplanationContent />
    </DocsPageLayout>
  );
}
