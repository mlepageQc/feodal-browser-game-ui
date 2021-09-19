import { getRoundedAttributeValueFromElement } from './helpers/DomHelper'
import { MAP_SIZE, MINIMAP_SIZE } from './config'
import {
	CoordinatesSet, 
	MapSelectionChangeParams,
	MinimapSelectionChange 
} from './types'

export default class Minimap {
	private _minimap: HTMLDivElement = document.createElement('div')
	private _canvas: HTMLCanvasElement = document.createElement('canvas')
	private _selector: HTMLDivElement = document.createElement('div')
	private _isDragging: boolean = false
	private _isSelectorMounted: boolean = false

	constructor (
		private readonly _container: HTMLDivElement,
		private readonly _minimapBase64String: string,
		private readonly _onSelectionChange: MinimapSelectionChange
	) {}

	get onSelectionChange (): MinimapSelectionChange | null {
		return this._onSelectionChange
	}

	get minimapBase64String (): string {
		return this._minimapBase64String
	}

	get isDragging (): boolean {
		return this._isDragging
	}

	get minimap (): HTMLDivElement {
		return this._minimap
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

	private get isSelectorMounted (): boolean {
		return this._isSelectorMounted
	}

	private get containerWidth (): number {
		return getRoundedAttributeValueFromElement(this.container, 'width')
	}

	private get containerHeight (): number {
		return getRoundedAttributeValueFromElement(this.container, 'height')
	}

	set minimap (element: HTMLDivElement) {
		this._minimap = element
	}

	private set canvas (element: HTMLCanvasElement) {
		this._canvas = element
	}

	private set selector (element: HTMLDivElement) {
		this._selector = element
	}

	set isDragging (value: boolean) {
		this._isDragging = value
	}

	private set isSelectorMounted (value: boolean) {
		this._isSelectorMounted = value
	}

	async mount (): Promise<void> {
		await this.renderImage()
		
		this.setupMinimapAndAppendToContainer()
		this.appendCanvasToMinimap()
		this.setupSelectorAndAppendToMinimap()
	}

	onMapDrag ({ overflowRight, overflowBottom, marginLeft, marginTop }: MapSelectionChangeParams) {
		let newX = -marginLeft / MAP_SIZE * MINIMAP_SIZE
		let newY = -marginTop / MAP_SIZE * MINIMAP_SIZE

		if (overflowRight) newX = MINIMAP_SIZE - this.selectorAttribute('width')
		if (overflowBottom) newY = MINIMAP_SIZE - this.selectorAttribute('height')

		this.translateMinimapSelector({ x: newX, y: newY })
	}

	setupSelector (): void {
		const selectorWidth = Math.round(this.containerWidth / MAP_SIZE * MINIMAP_SIZE)
		const selectorHeight = Math.round(this.containerHeight / MAP_SIZE * MINIMAP_SIZE)

		this.selector.style.height = `${selectorHeight}px`
		this.selector.style.width = `${selectorWidth}px`
		this.isSelectorMounted = true
	}

	private setupMinimapAndAppendToContainer (): void {
		this.minimap.className = 'minimap'
		this.container.appendChild(this.minimap)
	}

	private appendCanvasToMinimap (): void {
		this.minimap.appendChild(this.canvas)
	}

	private setupSelectorAndAppendToMinimap (): void {
		this.selector.className = 'minimap--selector'
		this.minimap.appendChild(this.selector)
	}

	private renderImage (): Promise<void> {
		return new Promise((resolve, _reject) => {
			const image = new window.Image()
			image.onload = () => {
				this.canvas.width = image.width
				this.canvas.height = image.height
				this.canvasContext.drawImage(image, 0, 0)
				this.setupSelector()
				this.attachMinimapEventListeners()
				resolve()
			}
			image.src = `data:image/png;base64,${this.minimapBase64String}`
		})	
	}

	private attachMinimapEventListeners (): void {
		this.minimap.addEventListener('mousedown', this.onMouseDown)
		this.minimap.addEventListener('mousemove', this.onMouseMove)
		this.minimap.addEventListener('mouseup', this.onMouseUp)
	}

	private onMouseDown = (event: MouseEvent): void => {
		this.isDragging = true
		this.moveSelector(event)
		event.preventDefault()
	}

	private onMouseMove = (event: MouseEvent): boolean | void => {
		if (!this.isDragging) return true

		this.moveSelector(event)
	}

	private onMouseUp = (): void => {
		this.isDragging = false
	}

	private moveSelector (event: any): void {
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
		return (event.layerX - this.selectorAttribute('width') / 2)
	}

	private movedSelectorCenterY (event: any): number {
		return (event.layerY - this.selectorAttribute('height') / 2)
	}

	private selectorAttribute (attribute: string): number {
		return getRoundedAttributeValueFromElement(this.selector, attribute)
	}

	private translateMinimapSelector ({ x, y }: CoordinatesSet) {
		this.selector.style.left = `${x}px`
		this.selector.style.top = `${y}px`
	}
}