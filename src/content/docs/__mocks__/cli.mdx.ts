import React from "react";

export const frontmatter = {
  title: "CLI Documentation",
  description:
    "Command-line utilities for validating and generating Belgian Social Security Identification Numbers",
};

export default function CLIContent() {
  return React.createElement(
    "div",
    { "data-testid": "cli-content" },
    "CLI Documentation Content",
  );
}
