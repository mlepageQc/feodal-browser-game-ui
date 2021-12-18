interface CoordinatesSet {
	x: number
	y: number
}

interface MapSelectionChangeParams {
	overflowRight: boolean
	overflowBottom: boolean
	marginLeft: number
	marginTop: number
}

enum MapSize {
	Xlarge = 32768,
	Large = 16384,
	Medium = 8192,
	Small = 4096,
	Xsmall = 2048
}

interface MinimapSelectorChangeParams {
	overflowRight: boolean
	overflowBottom: boolean
	newSelectorX: number
	newSelectorY: number
}

type MinimapSelectionChange = (params: MinimapSelectorChangeParams) => any

enum ZoomLevel {
	ZoomLevel0 = 0,
	ZoomLevel1 = 1,
	ZoomLevel2 = 2,
	ZoomLevel3 = 3
}

export {
	CoordinatesSet,
	MapSelectionChangeParams,
	MapSize,
	MinimapSelectionChange,
	MinimapSelectorChangeParams,
	ZoomLevel
}
