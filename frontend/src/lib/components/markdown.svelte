<script lang="ts">
    import { marked } from "marked";
    import hljs from "highlight.js/lib/core";
    import javascript from "highlight.js/lib/languages/javascript";
    import typescript from "highlight.js/lib/languages/typescript";
    import python from "highlight.js/lib/languages/python";
    import json from "highlight.js/lib/languages/json";
    import xml from "highlight.js/lib/languages/xml";
    import css from "highlight.js/lib/languages/css";
    import bash from "highlight.js/lib/languages/bash";

    // Register languages
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("typescript", typescript);
    hljs.registerLanguage("python", python);
    hljs.registerLanguage("json", json);
    hljs.registerLanguage("xml", xml);
    hljs.registerLanguage("html", xml);
    hljs.registerLanguage("css", css);
    hljs.registerLanguage("bash", bash);
    hljs.registerLanguage("sh", bash);

    let { content }: { content: string } = $props();

    // Configure marked renderer for code blocks
    const renderer = new marked.Renderer();
    renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
        const escapedText = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        if (lang && hljs.getLanguage(lang)) {
            try {
                const highlighted = hljs.highlight(text, {
                    language: lang,
                }).value;
                return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
            } catch (err) {
                console.error("Highlight error:", err);
            }
        }

        return `<pre><code>${escapedText}</code></pre>`;
    };

    // Configure marked with custom renderer
    marked.setOptions({
        renderer,
        breaks: true,
        gfm: true,
    });

    // Parse markdown
    const html = $derived(marked.parse(content) as string);
</script>

<div class="markdown-content">
    {@html html}
</div>

<style>
    .markdown-content :global(h1) {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    .markdown-content :global(h2) {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .markdown-content :global(h3) {
        font-size: 1.125rem;
        font-weight: 600;
        margin-top: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .markdown-content :global(p) {
        margin-bottom: 0.75rem;
        line-height: 1.6;
    }

    .markdown-content :global(code) {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.875em;
    }

    .markdown-content :global(pre) {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.75rem;
        border-radius: 0.375rem;
        overflow-x: auto;
        margin-bottom: 0.75rem;
    }

    .markdown-content :global(pre code) {
        background-color: transparent;
        padding: 0;
        border-radius: 0;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .markdown-content :global(ul),
    .markdown-content :global(ol) {
        margin-bottom: 0.75rem;
        padding-left: 1.5rem;
    }

    .markdown-content :global(li) {
        margin-bottom: 0.25rem;
    }

    .markdown-content :global(blockquote) {
        border-left: 3px solid currentColor;
        padding-left: 1rem;
        margin: 0.75rem 0;
        opacity: 0.8;
    }

    .markdown-content :global(a) {
        color: var(--color-primary, #3b82f6);
        text-decoration: underline;
    }

    .markdown-content :global(strong) {
        font-weight: 600;
    }

    .markdown-content :global(em) {
        font-style: italic;
    }

    .markdown-content :global(hr) {
        border: none;
        border-top: 1px solid currentColor;
        opacity: 0.2;
        margin: 1rem 0;
    }

    .markdown-content :global(table) {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.75rem;
    }

    .markdown-content :global(th),
    .markdown-content :global(td) {
        border: 1px solid currentColor;
        padding: 0.5rem;
        text-align: left;
    }

    .markdown-content :global(th) {
        font-weight: 600;
        background-color: rgba(0, 0, 0, 0.05);
    }

    /* Syntax highlighting theme - minimal dark-friendly */
    .markdown-content :global(.hljs-keyword),
    .markdown-content :global(.hljs-selector-tag),
    .markdown-content :global(.hljs-literal),
    .markdown-content :global(.hljs-section),
    .markdown-content :global(.hljs-link) {
        color: #569cd6;
    }

    .markdown-content :global(.hljs-string) {
        color: #ce9178;
    }

    .markdown-content :global(.hljs-title),
    .markdown-content :global(.hljs-name),
    .markdown-content :global(.hljs-type),
    .markdown-content :global(.hljs-attribute),
    .markdown-content :global(.hljs-symbol),
    .markdown-content :global(.hljs-bullet),
    .markdown-content :global(.hljs-built_in),
    .markdown-content :global(.hljs-addition),
    .markdown-content :global(.hljs-variable),
    .markdown-content :global(.hljs-template-tag),
    .markdown-content :global(.hljs-template-variable) {
        color: #4ec9b0;
    }

    .markdown-content :global(.hljs-comment),
    .markdown-content :global(.hljs-quote),
    .markdown-content :global(.hljs-deletion),
    .markdown-content :global(.hljs-meta) {
        color: #6a9955;
    }

    .markdown-content :global(.hljs-number),
    .markdown-content :global(.hljs-regexp),
    .markdown-content :global(.hljs-selector-id),
    .markdown-content :global(.hljs-selector-class),
    .markdown-content :global(.hljs-selector-attr),
    .markdown-content :global(.hljs-selector-pseudo) {
        color: #b5cea8;
    }

    .markdown-content :global(.hljs-function) {
        color: #dcdcaa;
    }
</style>
