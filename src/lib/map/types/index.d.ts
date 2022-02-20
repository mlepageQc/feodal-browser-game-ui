export interface CoordinatesSet {
	x: number
	y: number
}

export interface MapSelectionChangeParams {
	overflowRight: boolean
	overflowBottom: boolean
	marginLeft: number
	marginTop: number
}

export type ZoomLevel = 1 | 2 | 4

export type ImageDataUrl = CoordinatesSet & { url: string }

export type ImageDataBase64String = CoordinatesSet & { data: string }

export type ImageParams = CoordinatesSet & { zoomLevel: ZoomLevel }
