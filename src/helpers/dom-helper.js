export function getRoundedAttributeValueFromElement (element, attribute) {
	let value = getComputedStyle(element)[attribute]
	value = value.substr(0, value.length - 2)
	return Math.round(parseFloat(value))
}