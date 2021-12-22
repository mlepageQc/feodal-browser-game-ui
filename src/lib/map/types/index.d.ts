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

export enum ZoomLevel {
	ZoomLevel0 = 0,
	ZoomLevel1 = 1,
	ZoomLevel2 = 2,
	ZoomLevel3 = 3
}

export type ImageDataUrl = CoordinatesSet & { url: string }

export type ImageDataBase64String = CoordinatesSet & { data: string }

export type ImageParams = CoordinatesSet & { zoomLevel: ZoomLevel }
