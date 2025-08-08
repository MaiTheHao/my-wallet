/**
 * Removes code block markers like ```json, ```typescript, etc. from a markdown string.
 * @param markdown The markdown string containing code blocks.
 * @returns The cleaned string without code block markers.
 */
export function removeCodeBlockMarkers(markdown: string): string {
	return markdown.replace(/```[a-zA-Z]+\s*([\s\S]*?)```/g, '$1');
}

/**
 * Removes all code block markers (regardless of type) from a markdown string.
 * @param markdown The markdown string containing code blocks.
 * @returns The cleaned string without any code block markers.
 */
export function removeAllCodeBlockMarkers(markdown: string): string {
	return markdown.replace(/```[\s\S]*?```/g, (match) => {
		// Remove the opening and closing ```
		return match.replace(/```[a-zA-Z]*\s*/, '').replace(/```$/, '');
	});
}
