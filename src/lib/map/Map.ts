import { AxiosResponse } from 'axios'
import CoordinatesSet from './types/coordinatesSet'
import { fetchMapBase64Image } from './api/map-api'
import { getRoundedAttributeValueFromElement } from '../../helpers/dom-helper'
import Minimap from './Minimap'
import MinimapSelectorChangeParams from './types/minimapSelectorChangeParams'
import { MAP_SIZE, MINIMAP_SIZE, TILE_SIZE } from './config'
import ZoomLevel from './types/zoomLevel'

export default class Map {
	private _map: HTMLDivElement = document.createElement('div')
	private _playground: HTMLDivElement = document.createElement('div')
	private _canvas: HTMLCanvasElement = document.createElement('canvas')
	private _hoveredTile: HTMLDivElement = document.createElement('div')
	private _selectedTile: HTMLDivElement = document.createElement('div')
	private _minimap: Minimap = new Minimap(this.container)
	private _isMounted: boolean = false
	private _isDragging: boolean = false
	private _initialClientX: number = 0
	private _initialClientY: number = 0
	private _initialMarginLeft: number = 0
	private _initialMarginTop: number = 0

	constructor(
		private readonly _container: HTMLDivElement,
		private _zoomLevel: ZoomLevel,
		private _onTileSelected: (coordinates: CoordinatesSet) => any
	) {}

	get isMounted (): boolean {
		return this._isMounted
	}

	private get isDragging (): boolean {
		return this._isDragging
	}

	private get initialClientX (): number {
		return this._initialClientX
	}

	private get initialClientY (): number {
		return this._initialClientY
	}

	private get initialMarginLeft (): number {
		return this._initialMarginLeft
	}

	private get initialMarginTop (): number {
		return this._initialMarginTop
	}

	private get container (): HTMLDivElement {
		return this._container
	}

	private get map (): HTMLDivElement {
		return this._map
	}

	private get playground (): HTMLDivElement {
		return this._playground
	}

	private get canvas (): HTMLCanvasElement {
		return this._canvas
	}

	private get minimap (): Minimap {
		return this._minimap!
	}

	private get hoveredTile (): HTMLDivElement {
		return this._hoveredTile
	}

	private get selectedTile (): HTMLDivElement {
		return this._selectedTile
	}

	private get containerWidth (): number {
		return getRoundedAttributeValueFromElement(this.container, 'width')
	}

	private get containerHeight (): number {
		return getRoundedAttributeValueFromElement(this.container, 'height')
	}

	private get zoomLevel (): ZoomLevel {
		return this._zoomLevel
	}

	private get onTileSelected (): (coordinates: CoordinatesSet) => any {
		return this._onTileSelected
	}

	private get canvasContext (): CanvasRenderingContext2D {
		return this.canvas.getContext('2d')!
	}

	private get dragStartX (): number {
		return this.initialClientX - this.initialMarginLeft
	}

	private get dragStartY (): number {
		return this.initialClientY - this.initialMarginTop
	}

	set isMounted (value: boolean) {
		this._isMounted = value
	}

	private set map (element: HTMLDivElement) {
		this._map = element
	}

	private set playground (element: HTMLDivElement) {
		this._playground = element
	}

	private set canvas (element: HTMLCanvasElement) {
		this._canvas = element
	}

	private set hoveredTile (element: HTMLDivElement) {
		this._hoveredTile = element
	}

	private set selectedTile (element: HTMLDivElement) {
		this._selectedTile = element
	}

	private set minimap (minimap: Minimap) {
		this._minimap = minimap
		this._minimap.onSelectionChange = this.onMinimapSelectionChange
	}

	private set isDragging (value: boolean) {
		this._isDragging = value
	}

	private set initialClientX (value: number) {
		this._initialClientX = value
	}

	private set initialClientY (value: number) {
		this._initialClientY = value
	}

	private set initialMarginLeft (value: number) {
		this._initialMarginLeft = value
	}

	private set initialMarginTop (value: number) {
		this._initialMarginTop = value
	}

	mount (): void {
		this.playground.appendChild(this.hoveredTile)
		this.playground.appendChild(this.selectedTile)
		this.playground.appendChild(this.canvas)

		this.setupMapAndAppendToContainer()
		this.setupPlaygroundAndAppendToMap()
		this.setupHoveredTileAndAppendToPlayground()
		this.setupSelectedTileAndAppendToPlayground()
		this.appendCanvasToPlayground()
		this.mountMinimap()
	}

	setup = async (coordinateSets: CoordinatesSet[]): Promise<void> => {
		this.render(await this.fetch(coordinateSets))
		this.attachPlaygroundEventListeners()
		this.isMounted = true
	}

	stopDrag (): void {
		this.isDragging = false
		this.playground.classList.add('map__playground_with-transition')
	}

	private setupMapAndAppendToContainer (): void {
		this.map.className = 'map'
		this.container.appendChild(this.map)
	}

	private setupPlaygroundAndAppendToMap (): void {
		this.playground.className = 'map__playground'
		this.map.appendChild(this.playground)
	}

	private setupHoveredTileAndAppendToPlayground (): void {
		this.hoveredTile.className = 'map__hovered-tile'
		this.playground.appendChild(this.hoveredTile)
	}

	private setupSelectedTileAndAppendToPlayground (): void {
		this.selectedTile.className = 'map__selected-tile'
		this.playground.appendChild(this.selectedTile)
	}

	private appendCanvasToPlayground (): void {
		this.playground.appendChild(this.canvas)
	}

	private mountMinimap (): void {
		this.minimap.mount()
	}

	private fetch = async (coordinateSets: CoordinatesSet[]): Promise<AxiosResponse<any>[]> => {
		return Promise.all(
			coordinateSets.map(coordinates => {
				return fetchMapBase64Image({ ...coordinates, zoomLevel: this.zoomLevel })
			})
		)
	}

	private render (mapResponse: AxiosResponse<any>[]): void {
		mapResponse.forEach(partialImage => {
			return this.loadPartialImage(partialImage.data, partialImage.config.params)
		})
	}

	private loadPartialImage (base64PartialImage: string, coordinates: CoordinatesSet): void {
		const image = new window.Image()
		image.onload = () => this.addPartialImageTocanvas(image, coordinates)
		image.src = `data:image/png;base64,${base64PartialImage}`
	}

	private addPartialImageTocanvas (partialImage: HTMLImageElement, { x, y }: CoordinatesSet): void {
		this.canvasContext.drawImage(partialImage, x, y)
	}

	private attachPlaygroundEventListeners (): void {
		this.playground.addEventListener('mousedown', this.onMouseDown)
		this.playground.addEventListener('mousemove', this.onMouseMove)
		this.playground.addEventListener('mouseup', this.onMouseUp)
		this.playground.addEventListener('mouseout', this.onMouseOut)
	}

	private onMouseDown (event: MouseEvent): void {
		this.playground.classList.remove('map__playground_with-transition')
		this.isDragging = true
		this.initialClientX = event.clientX
		this.initialClientY = event.clientY
		this.initialMarginLeft = this.playgroundAttribute('marginLeft')
		this.initialMarginTop = this.playgroundAttribute('marginTop')
	}

	private playgroundAttribute (attribute: string): number {
		return getRoundedAttributeValueFromElement(this.playground, attribute)
	}

	private onMouseMove (event: MouseEvent): boolean | void {
		this.hoverTile(event)
		if (!this.isDragging) return false

		this.dragMap(
			this.initialClientX - this.dragStartX,
			this.initialClientY - this.dragStartY
		)
	}

	private onMouseUp (event: MouseEvent): void {
		this.isDragging = false
		// We give a range in which the dragging will select the tile
		// This is to prevent unconsistent selection behavior
		const movedX = Math.abs(this.dragStartX - (event.clientX - this.initialMarginLeft)) <= 3
		const movedY = Math.abs(this.dragStartY - (event.clientY - this.initialMarginTop)) <= 3
		
		if (movedX || movedY) this.selectTile(event)
	}

	private onMouseOut (): void {
		this.hideHoveredTile()
	}

	private hoverTile (event: any): void {
		this.showHoveredTile()
		this.hoveredTile.style.left = `${event.layerX - event.layerX % TILE_SIZE}px`
		this.hoveredTile.style.top = `${event.layerY - event.layerY % TILE_SIZE}px`
	}

	private hideHoveredTile (): void {
		this.hoveredTile.style.display = 'none'
	}

	private showHoveredTile (): void {
		this.hoveredTile.style.display = 'block'
	}

	private selectTile (event: any): void {
		this.hideHoveredTile()

		const selectedTileLeft = event.layerX - event.layerX % TILE_SIZE
    const selectedTileTop = event.layerY - event.layerY % TILE_SIZE

		this.selectedTile.style.left = `${selectedTileLeft}px`
		this.selectedTile.style.top = `${selectedTileTop}px`

		this.dragMap(
			-selectedTileLeft + this.containerWidth / 2 - TILE_SIZE / 2, 
			-selectedTileTop + this.containerHeight / 2 - TILE_SIZE / 2
		)

		this.onTileSelected({ x: selectedTileLeft, y: selectedTileTop })
	}

	private dragMap (marginLeft: number, marginTop: number): void {
		let overflowRight = false
		let overflowBottom = false

		if (marginLeft > 0) {
			marginLeft = 0
		} else if (marginLeft < (this.containerWidth - this.playgroundAttribute('width'))) {
			marginLeft = this.containerWidth - this.playgroundAttribute('width')
			overflowRight = true
		}

		if (marginTop > 0) {
			marginTop = 0
		} else if (marginTop < (this.containerHeight - this.playgroundAttribute('height'))) {
			marginTop = this.containerHeight - this.playgroundAttribute('height')
			overflowBottom = true
		}

		this.translateMap(marginLeft, marginTop)
		this.minimap.onMapDrag({ overflowRight, overflowBottom, marginLeft, marginTop })
	}

	private translateMap (marginLeft: number, marginTop: number) {
		this.playground.style.marginLeft = `${marginLeft}px`
		this.playground.style.marginTop = `${marginTop}px`
	}

	private onMinimapSelectionChange ({ overflowRight, overflowBottom, newSelectorX, newSelectorY }: MinimapSelectorChangeParams) {
		let marginLeft = -(newSelectorX / MINIMAP_SIZE * MAP_SIZE)
		let marginTop = -(newSelectorY / MINIMAP_SIZE * MAP_SIZE)

		if (overflowRight) {
			marginLeft = this.containerWidth - this.playgroundAttribute('width')
		} else if (marginLeft > 0) {
			marginLeft = 0
		}

		if (overflowBottom) {
			marginTop = this.containerHeight - this.playgroundAttribute('height')
		} else if (marginTop > 0) {
			marginTop = 0
		}

		this.translateMap(marginLeft, marginTop)
	}
}