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

export interface MinimapSelectorChangeParams {
	overflowRight: boolean
	overflowBottom: boolean
	newSelectorX: number
	newSelectorY: number
}

export type MinimapSelectionChange = (params: MinimapSelectorChangeParams) => any

export enum ZoomLevel {
	ZoomLevel0 = 0,
	ZoomLevel1 = 1,
	ZoomLevel2 = 2,
	ZoomLevel3 = 3
}

export type MapImageParams = CoordinatesSet & { data: string }
