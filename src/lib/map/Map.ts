import { CoordinatesSet, ImageData } from './types'
import { getRoundedAttributeValueFromElement } from './helpers/DomHelper'
import { debounce } from 'lodash'

export default class Map {
	private readonly _map: HTMLDivElement = document.createElement('div')
	private readonly _playground: HTMLDivElement = document.createElement('div')
	private readonly _canvas: HTMLCanvasElement = document.createElement('canvas')
	private readonly _hoveredTile: HTMLDivElement = document.createElement('div')
	private readonly _selectedTile: HTMLDivElement = document.createElement('div')
	private readonly _onMapDragged: () => any
	private _isDragging: boolean = false
	private _initialClientX: number = 0
	private _initialClientY: number = 0
	private _initialMarginLeft: number = 0
	private _initialMarginTop: number = 0

	constructor(
		private readonly _container: HTMLDivElement,
		private readonly _onTileSelected: (coordinates: CoordinatesSet) => any,
		_onMapDragged: (marginLeft: number, marginTop: number) => any,
		private readonly _mapSize: number,
		private readonly _tileSize: number
	) {
		this._onMapDragged = debounce(() => {
			_onMapDragged(
				this.playgroundAttribute('margin-left'),
				this.playgroundAttribute('margin-top')
			)
		}, 100)
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

	private get mapSize (): number {
		return this._mapSize
	}

	private get tileSize (): number {
		return this._tileSize
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

	private get onTileSelected (): (coordinates: CoordinatesSet) => any {
		return this._onTileSelected
	}

	private get onMapDragged (): () => any {
		return this._onMapDragged
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

	async mount (): Promise<void> {
		this.playground.appendChild(this.hoveredTile)
		this.playground.appendChild(this.selectedTile)
		this.playground.appendChild(this.canvas)

		this.setupMapAndAppendToContainer()
		this.setupPlaygroundAndAppendToMap()
		this.setupHoveredTileAndAppendToPlayground()
		this.setupSelectedTileAndAppendToPlayground()
		this.appendCanvasToPlayground()
		this.attachPlaygroundEventListeners()
		this.adjustMapHeightToContainer()

		this.playground.style.width = this.mapSize + 'px'
		this.playground.style.height = this.mapSize + 'px'
		this.canvas.width = this.mapSize
		this.canvas.height = this.mapSize

		document.addEventListener('mouseleave', this.stopDrag)
	}

	drawImages (imagesData: ImageData[]): Promise<void[]> {
		return Promise.all(
			imagesData.map(params => this.drawImage(params))
		)
	}

	drawImage (imageData: ImageData): Promise<void> {
		return new Promise((resolve, _reject) => {
			const image = new window.Image()
			image.onload = () => {
				this.canvasContext.drawImage(image, imageData.x, imageData.y)
				resolve()
			}
			image.src = `data:image/png;base64,${imageData.data}`
		})
	}

	drawImageFromUrl (x: number, y: number, url: string): Promise<void> {
		return new Promise((resolve, _reject) => {
			const image = new window.Image()
			image.onload = () => {
				this.canvasContext.drawImage(image, x, y)
				resolve()
			}
			image.src = url
		})
	}

	stopDrag = (): void => {
		this.isDragging = false
		this.addPlaygroundTransition()
	}

	setSelectedTile (marginLeft: number, marginTop: number): void {		
		this.selectedTile.style.left = `${marginLeft}px`
		this.selectedTile.style.top = `${marginTop}px`

		this.dragMap(
			-marginLeft + this.containerWidth / 2 - this.tileSize / 2, 
			-marginTop + this.containerHeight / 2 - this.tileSize / 2
		)
		this.adjustMapHeightToContainer()
	}

	adjustMapHeightToContainer (): void {
		this.map.style.height = this.containerHeight + 'px'
	}

	reCenter (): void {
    this.dragMap(
			this.playgroundAttribute('margin-left'),
			this.playgroundAttribute('margin-top')
		) 
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
		this.onMapDragged()
	}

	private addPlaygroundTransition (): void {
		this.playground.classList.add('map--playground_with-transition')
	}

	private removePlaygroundTransition (): void {
		this.playground.classList.remove('map--playground_with-transition')
	}

	private setupMapAndAppendToContainer (): void {
		this.map.className = 'map'
		this.container.appendChild(this.map)
	}

	private setupPlaygroundAndAppendToMap (): void {
		this.playground.className = 'map--playground'
		this.map.appendChild(this.playground)
		this.map.addEventListener('mouseleave', () => this.stopDrag())
	}

	private setupHoveredTileAndAppendToPlayground (): void {
		this.hoveredTile.className = 'map--hovered-tile'
		this.hoveredTile.style.width = `${this.tileSize}px`
		this.hoveredTile.style.height = `${this.tileSize}px`
		this.playground.appendChild(this.hoveredTile)
	}

	private setupSelectedTileAndAppendToPlayground (): void {
		this.selectedTile.className = 'map--selected-tile'
		this.selectedTile.style.width = `${this.tileSize}px`
		this.selectedTile.style.height = `${this.tileSize}px`
		this.playground.appendChild(this.selectedTile)
	}

	private appendCanvasToPlayground (): void {
		this.playground.appendChild(this.canvas)
	}

	private attachPlaygroundEventListeners (): void {
		this.playground.addEventListener('mousedown', this.onMouseDown)
		this.playground.addEventListener('mousemove', this.onMouseMove)
		this.playground.addEventListener('mouseup', this.onMouseUp)
		this.playground.addEventListener('mouseout', this.onMouseOut)
		this.playground.addEventListener('transitionend', this.onMapDragged)
	}

	private onMouseDown = (event: MouseEvent): void => {
		this.removePlaygroundTransition()
		this.isDragging = true
		this.initialClientX = event.clientX
		this.initialClientY = event.clientY
		this.initialMarginLeft = this.playgroundAttribute('margin-left')
		this.initialMarginTop = this.playgroundAttribute('margin-top')
		event.preventDefault()
	}

	private playgroundAttribute (attribute: string): number {
		return getRoundedAttributeValueFromElement(this.playground, attribute)
	}

	private onMouseMove = (event: MouseEvent): boolean | void => {
		this.hoverTile(event)
		if (!this.isDragging) return false

		this.dragMap(
			event.clientX - this.dragStartX,
			event.clientY - this.dragStartY
		)
	}

	private onMouseUp = (event: MouseEvent): void => {
		this.stopDrag()	
		// We give a range in which the dragging will select the tile
		// This is to prevent unconsistent selection behavior
		const movedX = Math.abs(this.dragStartX - (event.clientX - this.initialMarginLeft)) <= 3
		const movedY = Math.abs(this.dragStartY - (event.clientY - this.initialMarginTop)) <= 3		
		if (movedX || movedY) this.selectTile(event)
	}

	private onMouseOut = (): void => {
		this.hideHoveredTile()
	}

	private hoverTile (event: any): void {
		this.showHoveredTile()
		this.hoveredTile.style.left = `${event.layerX - event.layerX % this.tileSize}px`
		this.hoveredTile.style.top = `${event.layerY - event.layerY % this.tileSize}px`
	}

	private hideHoveredTile (): void {
		this.hoveredTile.style.display = 'none'
	}

	private showHoveredTile (): void {
		this.hoveredTile.style.display = 'block'
	}

	private selectTile (event: any): void {
		this.hideHoveredTile()

		const selectedTileLeft = event.layerX - event.layerX % this.tileSize
    const selectedTileTop = event.layerY - event.layerY % this.tileSize

		this.onTileSelected({ x: selectedTileLeft, y: selectedTileTop })
	}

	private translateMap (marginLeft: number, marginTop: number) {
		this.playground.style.marginLeft = `${marginLeft}px`
		this.playground.style.marginTop = `${marginTop}px`
	}
}
