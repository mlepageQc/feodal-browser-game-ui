export function getRoundedAttributeValueFromElement (element: HTMLElement, attribute: string): number {
	console.log(attribute)
	let value = getComputedStyle(element).getPropertyValue(attribute)
	value = value.substr(0, value.length - 2)
	console.log(value)
	return Math.round(parseFloat(value))
}
