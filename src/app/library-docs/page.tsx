import { DocsPageLayout } from "@/components/docs-page-layout";
import LibraryContent, { frontmatter } from "@/content/docs/library.mdx";

export default function LibraryDocsPage() {
  return (
    <DocsPageLayout
      title={frontmatter.title ?? ""}
      description={frontmatter.description}
    >
      <LibraryContent />
    </DocsPageLayout>
  );
}
