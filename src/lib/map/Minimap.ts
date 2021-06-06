import { AxiosResponse } from 'axios'
import { fetchMinimapBase64Image } from './api/minimap-api'
import { getRoundedAttributeValueFromElement } from '../../helpers/dom-helper'
import { MAP_SIZE, MINIMAP_SIZE } from './config'
import MinimapSelectionChange from './types/minimapSelectionChange'
import CoordinatesSet from './types/coordinatesSet'
import MapSelectionChangeParams from './types/mapSelectionChangeParams'

// TODO Mechanism for partial images for minimap as well

export default class Minimap {
	_onSelectionChange: MinimapSelectionChange | null = null

	private _minimap: HTMLDivElement = document.createElement('div')
	private _playground: HTMLDivElement = document.createElement('div')
	private _canvas: HTMLCanvasElement = document.createElement('canvas')
	private _selector: HTMLDivElement = document.createElement('div')
	private _isDragging: boolean = false
	private _isSelectorMounted: boolean = false

	constructor (
		private readonly _container: HTMLDivElement
	) {}

	get onSelectionChange (): MinimapSelectionChange | null {
		return this._onSelectionChange
	}

	set onSelectionChange (changeFunction: MinimapSelectionChange | null) {
		this._onSelectionChange = changeFunction
	}

	private get minimap (): HTMLDivElement {
		return this._minimap
	}

	private get playground (): HTMLDivElement {
		return this._playground
	}
	
	private get canvas (): HTMLCanvasElement {
		return this._canvas
	}

	private get selector (): HTMLDivElement {
		return this._selector
	}

	private get container (): HTMLDivElement {
		return this._container
	}

	private get canvasContext (): CanvasRenderingContext2D {
		return this.canvas.getContext('2d')!
	}

	private get isDragging (): boolean {
		return this._isDragging
	}

	private get isSelectorMounted (): boolean {
		return this._isSelectorMounted
	}

	private get containerWidth (): number {
		return getRoundedAttributeValueFromElement(this.container, 'width')
	}

	private get containerHeight (): number {
		return getRoundedAttributeValueFromElement(this.container, 'height')
	}

	private set minimap (element: HTMLDivElement) {
		this._minimap = element
	}

	private set playground (element: HTMLDivElement) {
		this._playground = element
	}

	private set canvas (element: HTMLCanvasElement) {
		this._canvas = element
	}

	private set selector (element: HTMLDivElement) {
		this._selector = element
	}

	private set isDragging (value: boolean) {
		this._isDragging = value
	}

	private set isSelectorMounted (value: boolean) {
		this._isSelectorMounted = value
	}

	mount (): void {
		this.setupMinimapAndAppendToContainer()
		this.appendCanvasToMinimap()
		this.setupSelectorAndAppendToMinimap()
	}

	setup = async (): Promise<void> => {
		this.render(await this.fetch())
	}

	onMapDrag ({ overflowRight, overflowBottom, marginLeft, marginTop }: MapSelectionChangeParams) {
		let newX = -marginLeft / MAP_SIZE * MINIMAP_SIZE
		let newY = -marginTop / MAP_SIZE * MINIMAP_SIZE

		if (overflowRight) newX = MINIMAP_SIZE - this.selectorAttribute('width')
		if (overflowBottom) newY = MINIMAP_SIZE - this.selectorAttribute('height')

		this.translateMinimapSelector({ x: newX, y: newY })
	}

	private setupMinimapAndAppendToContainer (): void {
		this.minimap.className = 'minimap'
		this.container.appendChild(this.minimap)
	}

	private appendCanvasToMinimap (): void {
		this.minimap.appendChild(this.canvas)
	}

	private setupSelectorAndAppendToMinimap (): void {
		this.selector.className = 'minimap__selector'
		this.minimap.appendChild(this.selector)
	}

	private fetch = async (): Promise<AxiosResponse<any>> => {
		return fetchMinimapBase64Image()
	}

	private render (minimapResponse: AxiosResponse<any>): void {
		this.loadImage(minimapResponse.data)
	}

	private loadImage (base64Image: AxiosResponse<any>) {
		const image = new window.Image()
		image.onload = () => {
			this.addImageToCanvas(image, { x: 0, y: 0 })
			this.setupSelector()
			this.attachPlaygroundEventListeners()
		}
		image.src = `data:image/png;base64,${base64Image}`
	}

	private addImageToCanvas (image: HTMLImageElement, { x, y }: CoordinatesSet): void {
		this.canvas.width = MINIMAP_SIZE
		this.canvas.height = MINIMAP_SIZE
		this.canvasContext.drawImage(image, x, y)
	}

	private setupSelector (): void {
		const selectorWidth = Math.round(this.containerWidth / MAP_SIZE * MINIMAP_SIZE)
		const selectorHeight = Math.round(this.containerHeight / MAP_SIZE * MINIMAP_SIZE)

		this.selector.style.height = `${selectorHeight}px`
		this.selector.style.width = `${selectorWidth}px`
		this.isSelectorMounted = true
	}

	private attachPlaygroundEventListeners (): void {
		this.playground.addEventListener('mousedown', this.onMouseDown)
		this.playground.addEventListener('mousemove', this.onMouseMove)
		this.playground.addEventListener('mouseup', this.onMouseUp)
	}

	private onMouseDown (event: MouseEvent): void {
		this.isDragging = true
		this.moveSelector(event)
	}

	private onMouseMove (event: MouseEvent): boolean | void {
		if (!this.isDragging) return true

		this.moveSelector(event)
	}

	private onMouseUp (): void {
		this.isDragging = false
	}

	private moveSelector (event: MouseEvent): void {
		let overflowRight = false
		let overflowBottom = false
		let newX = 0
		let newY = 0

		if (this.willSelectorOverflowRight(event)) {
			newX = MINIMAP_SIZE - this.selectorAttribute('width')
			overflowRight = true
		} else if (!this.willSelectorOverflowLeft(event)) {
			newX =  this.movedSelectorCenterX(event)
		}

		if (this.willSelectorOverflowBottom(event)) {
			newY = MINIMAP_SIZE - this.selectorAttribute('height')
			overflowBottom = true
		} else if (!this.willSelectorOverflowTop(event)) {
			newY = this.movedSelectorCenterY(event)
		}

		this.translateMinimapSelector({ x: newX, y: newY })
		if (!this.onSelectionChange) return

		this.onSelectionChange({
			overflowRight,
			overflowBottom,
			newSelectorX: newX,
			newSelectorY: newY
		})
	}

	private willSelectorOverflowLeft (event: any): boolean {
		return (event.layerX - this.selectorAttribute('width') / 2) <= 0
	}

	private willSelectorOverflowRight (event: any): boolean {
		return (event.layerX + this.selectorAttribute('width') / 2) >= MINIMAP_SIZE
	}

	private willSelectorOverflowTop (event: any): boolean {
		return (event.layerY - this.selectorAttribute('height') / 2) <= 0
	}

	private willSelectorOverflowBottom (event: any): boolean {
		return (event.layerY + this.selectorAttribute('height') / 2) >= MINIMAP_SIZE
	}

	private movedSelectorCenterX (event: any): number {
		return (event.layerX - this.selectorAttribute('width') / 2) - this.selectorAttribute('borderLeftWidth') * 2
	}

	private movedSelectorCenterY (event: any): number {
		return (event.layerY - this.selectorAttribute('height') / 2) - this.selectorAttribute('borderTopWidth') * 2
	}

	private selectorAttribute (attribute: string): number {
		return getRoundedAttributeValueFromElement(this.selector, attribute)
	}

	private translateMinimapSelector ({ x, y }: CoordinatesSet) {
		this.selector.style.left = `${x}px`
		this.selector.style.top = `${y}px`
	}
}