import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownPreview({ markdown = "", className = "" }) {
    return (
        <div className={className}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {markdown}
            </ReactMarkdown>
        </div>
    );
}
