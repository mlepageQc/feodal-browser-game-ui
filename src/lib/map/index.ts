import Map from '@lib/map/Map'

let map: Map | null = null

export function setMap (new_map: Map) {
	map = new_map
}

export default map