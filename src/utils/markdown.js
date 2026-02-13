const MARKDOWN_SYMBOL_PATTERN = /[#>*_`~\-\[\]()!|]/g;

export const markdownToPlainText = (value = "") => {
    if (!value) return "";
    return String(value)
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
        .replace(MARKDOWN_SYMBOL_PATTERN, " ")
        .replace(/\s+/g, " ")
        .trim();
};

export const markdownSummary = (value = "", maxLength = 120) => {
    const plain = markdownToPlainText(value);
    if (!plain) return "";
    if (plain.length <= maxLength) return plain;
    return `${plain.slice(0, maxLength).trim()}...`;
};
