import * as MarkdownIt from "markdown-it";
import hljs from "highlight.js";

/**
 * Convert Markdown string to HTML string.
 * @param {string} markdown - the Markdown string
 * @returns {string} html - the HTML string
 * @description
 * convertMarkdownToHtml is a function that converts Markdown string to HTML string.
 * It is used to display the Markdown content in the webview.
 */
export default function convertMarkdownToHtml(markdown: string): string {
  // convert Markdown to HTML
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return "";
    },
  });
  const html =
    md.render(markdown) +
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">`;

  return html;
}
