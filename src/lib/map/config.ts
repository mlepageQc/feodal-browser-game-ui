import { ZoomLevel } from './types'

export const MAP_SIZE = 8192
export const TILE_SIZE = 64
export const ZOOM_RATIO = 1.5

export const MAP_ZOOM_SIZES = [
	MAP_SIZE, 
	MAP_SIZE * 2, 
	MAP_SIZE * 4
]

export const ORDERED_ZOOM_LEVELS: ZoomLevel[] = [4, 2, 1, 0.5, 0.25]