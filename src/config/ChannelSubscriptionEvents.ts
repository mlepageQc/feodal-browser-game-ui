// Parsing `identifier` to string is necessary even though it seems redundant

export const MapChannelSubscriptionEvent: string = JSON.stringify({
	'command': 'subscribe',
	'identifier': JSON.stringify({ 'channel': 'MapChannel' })
})