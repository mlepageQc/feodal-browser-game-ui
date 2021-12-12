export function getRoundedAttributeValueFromElement (element: HTMLElement, attribute: string): number {
	let value = getComputedStyle(element).getPropertyValue(attribute)
	value = value.substr(0, value.length - 2)
	return Math.round(parseFloat(value))
}
