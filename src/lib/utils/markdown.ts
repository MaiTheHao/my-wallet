export function removeCodeBlockMarkers(markdown: string): string {
	return markdown.replace(/```[a-zA-Z]+\s*([\s\S]*?)```/g, '$1');
}

export function removeAllCodeBlockMarkers(markdown: string): string {
	return markdown.replace(/```[\s\S]*?```/g, (match) => {
		return match.replace(/```[a-zA-Z]*\s*/, '').replace(/```$/, '');
	});
}
