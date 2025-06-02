export function formatMessage(content: string): string {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, `<code>$1</code>`)
        .replace(/\n/g, `<br>`)
}
