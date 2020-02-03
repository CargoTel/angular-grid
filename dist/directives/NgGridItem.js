import { Directive, EventEmitter, Output } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "./NgGrid";
var NgGridItem = /** @class */ (function () {
    //	Constructor
    function NgGridItem(_differs, _ngEl, _renderer, _ngGrid, containerRef) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._ngGrid = _ngGrid;
        this.containerRef = containerRef;
        //	Event Emitters
        this.onItemChange = new EventEmitter(false);
        this.onDragStart = new EventEmitter();
        this.onDrag = new EventEmitter();
        this.onDragStop = new EventEmitter();
        this.onDragAny = new EventEmitter();
        this.onResizeStart = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onResizeStop = new EventEmitter();
        this.onResizeAny = new EventEmitter();
        this.onChangeStart = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onChangeStop = new EventEmitter();
        this.onChangeAny = new EventEmitter();
        this.ngGridItemChange = new EventEmitter();
        // tslint:enable:object-literal-sort-keys
        this.isFixed = false;
        this.isDraggable = true;
        this.isResizable = true;
        this.minWidth = 0;
        this.minHeight = 0;
        this.uid = null;
        this._currentPosition = { col: 1, row: 1 };
        this._size = { x: 1, y: 1 };
        this._config = NgGridItem.CONST_DEFAULT_CONFIG;
        this._userConfig = null;
        this._dragHandle = null;
        this._resizeHandle = null;
        this._borderSize = 25;
        this._added = false;
        this._maxCols = 0;
        this._minCols = 0;
        this._maxRows = 0;
        this._minRows = 0;
        this._resizeDirections = [];
        this._zIndex = 0;
    }
    Object.defineProperty(NgGridItem.prototype, "zIndex", {
        get: function () {
            return this._zIndex;
        },
        set: function (zIndex) {
            this._renderer.setStyle(this._ngEl.nativeElement, "z-index", zIndex.toString());
            this._zIndex = zIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "config", {
        //	[ng-grid-item] handler
        set: function (v) {
            this._userConfig = v;
            var configObject = Object.assign({}, NgGridItem.CONST_DEFAULT_CONFIG, v);
            for (var x in NgGridItem.CONST_DEFAULT_CONFIG)
                if (configObject[x] == null)
                    configObject[x] = NgGridItem.CONST_DEFAULT_CONFIG[x];
            this.setConfig(configObject);
            if (this._userConfig != null) {
                if (this._differ == null) {
                    this._differ = this._differs.find(this._userConfig).create();
                }
                this._differ.diff(this._userConfig);
            }
            if (!this._added) {
                this._added = true;
                this._ngGrid.addItem(this);
            }
            this._recalculateDimensions();
            this._recalculatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "sizex", {
        get: function () {
            return this._size.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "sizey", {
        get: function () {
            return this._size.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "col", {
        get: function () {
            return this._currentPosition.col;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "row", {
        get: function () {
            return this._currentPosition.row;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "currentCol", {
        get: function () {
            return this._currentPosition.col;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "currentRow", {
        get: function () {
            return this._currentPosition.row;
        },
        enumerable: true,
        configurable: true
    });
    NgGridItem.prototype.onResizeStartEvent = function () {
        var event = this.getEventOutput();
        this.onResizeStart.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onResizeEvent = function () {
        var event = this.getEventOutput();
        this.onResize.emit(event);
        this.onResizeAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onResizeStopEvent = function () {
        var event = this.getEventOutput();
        this.onResizeStop.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);
        this.onConfigChangeEvent();
    };
    NgGridItem.prototype.onDragStartEvent = function () {
        var event = this.getEventOutput();
        this.onDragStart.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onDragEvent = function () {
        var event = this.getEventOutput();
        this.onDrag.emit(event);
        this.onDragAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onDragStopEvent = function () {
        var event = this.getEventOutput();
        this.onDragStop.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);
        this.onConfigChangeEvent();
    };
    NgGridItem.prototype.onCascadeEvent = function () {
        this.onConfigChangeEvent();
    };
    NgGridItem.prototype.ngOnInit = function () {
        this._renderer.addClass(this._ngEl.nativeElement, "grid-item");
        if (this._ngGrid.autoStyle)
            this._renderer.setStyle(this._ngEl.nativeElement, "position", "absolute");
        this._recalculateDimensions();
        this._recalculatePosition();
        if (!this._added) {
            this._added = true;
            this._ngGrid.addItem(this);
        }
    };
    //	Public methods
    NgGridItem.prototype.canDrag = function (e) {
        if (!this.isDraggable)
            return false;
        if (this._dragHandle) {
            return this.findHandle(this._dragHandle, e.target);
        }
        return true;
    };
    NgGridItem.prototype.findHandle = function (handleSelector, startElement) {
        try {
            var targetElem = startElement;
            while (targetElem && targetElem !== this._ngEl.nativeElement) {
                if (this.elementMatches(targetElem, handleSelector))
                    return true;
                targetElem = targetElem.parentElement;
            }
        }
        catch (err) { } // tslint:disable-line:no-empty
        return false;
    };
    NgGridItem.prototype.canResize = function (e) {
        if (!this.isResizable)
            return null;
        if (this._resizeHandle) {
            if (typeof this._resizeHandle === "string") {
                return this.findHandle(this._resizeHandle, e.target) ? "bottomright" : null;
            }
            if (typeof this._resizeHandle !== "object")
                return null;
            for (var _i = 0, _a = this._resizeDirections; _i < _a.length; _i++) {
                var direction = _a[_i];
                if (direction in this._resizeHandle) {
                    if (this.findHandle(this._resizeHandle[direction], e.target)) {
                        return direction;
                    }
                }
            }
            return null;
        }
        if (this._borderSize <= 0)
            return null;
        var mousePos = this._getMousePosition(e);
        for (var _b = 0, _c = this._resizeDirections; _b < _c.length; _b++) {
            var direction = _c[_b];
            if (this.canResizeInDirection(direction, mousePos)) {
                return direction;
            }
        }
        return null;
    };
    NgGridItem.prototype.onMouseMove = function (e) {
        if (this._ngGrid.autoStyle) {
            if (this._ngGrid.resizeEnable) {
                var resizeDirection = this.canResize(e);
                var cursor = "default";
                switch (resizeDirection) {
                    case "bottomright":
                    case "topleft":
                        cursor = "nwse-resize";
                        break;
                    case "topright":
                    case "bottomleft":
                        cursor = "nesw-resize";
                        break;
                    case "top":
                    case "bottom":
                        cursor = "ns-resize";
                        break;
                    case "left":
                    case "right":
                        cursor = "ew-resize";
                        break;
                    default:
                        if (this._ngGrid.dragEnable && this.canDrag(e)) {
                            cursor = "move";
                        }
                        break;
                }
                this._renderer.setStyle(this._ngEl.nativeElement, "cursor", cursor);
            }
            else if (this._ngGrid.dragEnable && this.canDrag(e)) {
                this._renderer.setStyle(this._ngEl.nativeElement, "cursor", "move");
            }
            else {
                this._renderer.setStyle(this._ngEl.nativeElement, "cursor", "default");
            }
        }
    };
    NgGridItem.prototype.ngOnDestroy = function () {
        if (this._added)
            this._ngGrid.removeItem(this);
    };
    //	Getters
    NgGridItem.prototype.getElement = function () {
        return this._ngEl;
    };
    NgGridItem.prototype.getDragHandle = function () {
        return this._dragHandle;
    };
    NgGridItem.prototype.getResizeHandle = function () {
        return this._resizeHandle;
    };
    NgGridItem.prototype.getDimensions = function () {
        return { width: this._elemWidth, height: this._elemHeight };
    };
    NgGridItem.prototype.getSize = function () {
        return this._size;
    };
    NgGridItem.prototype.getPosition = function () {
        return { left: this._elemLeft, top: this._elemTop };
    };
    NgGridItem.prototype.getGridPosition = function () {
        return this._currentPosition;
    };
    //	Setters
    NgGridItem.prototype.setConfig = function (config) {
        this._config = config;
        this._payload = config.payload;
        this._currentPosition.col = config.col ? config.col : NgGridItem.CONST_DEFAULT_CONFIG.col;
        this._currentPosition.row = config.row ? config.row : NgGridItem.CONST_DEFAULT_CONFIG.row;
        this._size.x = config.sizex ? config.sizex : NgGridItem.CONST_DEFAULT_CONFIG.sizex;
        this._size.y = config.sizey ? config.sizey : NgGridItem.CONST_DEFAULT_CONFIG.sizey;
        this._dragHandle = config.dragHandle;
        this._resizeHandle = config.resizeHandle;
        this._borderSize = config.borderSize;
        this.isDraggable = config.draggable ? true : false;
        this.isResizable = config.resizable ? true : false;
        this.isFixed = config.fixed ? true : false;
        this._resizeDirections = config.resizeDirections || this._ngGrid.resizeDirections;
        this._maxCols = !isNaN(config.maxCols) && isFinite(config.maxCols) ? config.maxCols : 0;
        this._minCols = !isNaN(config.minCols) && isFinite(config.minCols) ? config.minCols : 0;
        this._maxRows = !isNaN(config.maxRows) && isFinite(config.maxRows) ? config.maxRows : 0;
        this._minRows = !isNaN(config.minRows) && isFinite(config.minRows) ? config.minRows : 0;
        this.minWidth = !isNaN(config.minWidth) && isFinite(config.minWidth) ? config.minWidth : 0;
        this.minHeight = !isNaN(config.minHeight) && isFinite(config.minHeight) ? config.minHeight : 0;
        if (this._minCols > 0 && this._maxCols > 0 && this._minCols > this._maxCols)
            this._minCols = 0;
        if (this._minRows > 0 && this._maxRows > 0 && this._minRows > this._maxRows)
            this._minRows = 0;
        if (this._added) {
            this._ngGrid.updateItem(this);
        }
        this._size = this.fixResize(this._size);
        this._recalculatePosition();
        this._recalculateDimensions();
    };
    NgGridItem.prototype.ngDoCheck = function () {
        if (this._differ != null) {
            var changes = this._differ.diff(this._userConfig);
            if (changes != null) {
                return this._applyChanges(changes);
            }
        }
        return false;
    };
    NgGridItem.prototype.setSize = function (newSize, update) {
        if (update === void 0) { update = true; }
        newSize = this.fixResize(newSize);
        this._size = newSize;
        if (update)
            this._recalculateDimensions();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.setGridPosition = function (gridPosition, update) {
        if (update === void 0) { update = true; }
        this._currentPosition = gridPosition;
        if (update)
            this._recalculatePosition();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.getEventOutput = function () {
        return {
            col: this._currentPosition.col,
            height: this._elemHeight,
            left: this._elemLeft,
            payload: this._payload,
            row: this._currentPosition.row,
            sizex: this._size.x,
            sizey: this._size.y,
            top: this._elemTop,
            uid: this.uid,
            width: this._elemWidth,
        };
    };
    NgGridItem.prototype.setPosition = function (x, y) {
        switch (this._cascadeMode) {
            case "up":
            case "left":
            default:
                this._renderer.setStyle(this._ngEl.nativeElement, "left", x + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "top", y + "px");
                break;
            case "right":
                this._renderer.setStyle(this._ngEl.nativeElement, "right", x + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "top", y + "px");
                break;
            case "down":
                this._renderer.setStyle(this._ngEl.nativeElement, "left", x + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "bottom", y + "px");
                break;
        }
        this._elemLeft = x;
        this._elemTop = y;
    };
    NgGridItem.prototype.setCascadeMode = function (cascade) {
        this._cascadeMode = cascade;
        switch (cascade) {
            case "up":
            case "left":
            default:
                this._renderer.setStyle(this._ngEl.nativeElement, "left", this._elemLeft + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "top", this._elemTop + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "right", null);
                this._renderer.setStyle(this._ngEl.nativeElement, "bottom", null);
                break;
            case "right":
                this._renderer.setStyle(this._ngEl.nativeElement, "right", this._elemLeft + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "top", this._elemTop + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "left", null);
                this._renderer.setStyle(this._ngEl.nativeElement, "bottom", null);
                break;
            case "down":
                this._renderer.setStyle(this._ngEl.nativeElement, "left", this._elemLeft + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "bottom", this._elemTop + "px");
                this._renderer.setStyle(this._ngEl.nativeElement, "right", null);
                this._renderer.setStyle(this._ngEl.nativeElement, "top", null);
                break;
        }
    };
    NgGridItem.prototype.setDimensions = function (w, h) {
        if (w < this.minWidth)
            w = this.minWidth;
        if (h < this.minHeight)
            h = this.minHeight;
        this._renderer.setStyle(this._ngEl.nativeElement, "width", w + "px");
        this._renderer.setStyle(this._ngEl.nativeElement, "height", h + "px");
        this._elemWidth = w;
        this._elemHeight = h;
    };
    NgGridItem.prototype.startMoving = function () {
        this._renderer.addClass(this._ngEl.nativeElement, "moving");
        var style = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngGrid.autoStyle)
            this._renderer.setStyle(this._ngEl.nativeElement, "z-index", (parseInt(style.getPropertyValue("z-index"), 10) + 1).toString());
    };
    NgGridItem.prototype.stopMoving = function () {
        this._renderer.addClass(this._ngEl.nativeElement, "moving");
        var style = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngGrid.autoStyle)
            this._renderer.setStyle(this._ngEl.nativeElement, "z-index", (parseInt(style.getPropertyValue("z-index"), 10) - 1).toString());
    };
    NgGridItem.prototype.recalculateSelf = function () {
        this._recalculatePosition();
        this._recalculateDimensions();
    };
    NgGridItem.prototype.fixResize = function (newSize) {
        if (this._maxCols > 0 && newSize.x > this._maxCols)
            newSize.x = this._maxCols;
        if (this._maxRows > 0 && newSize.y > this._maxRows)
            newSize.y = this._maxRows;
        if (this._minCols > 0 && newSize.x < this._minCols)
            newSize.x = this._minCols;
        if (this._minRows > 0 && newSize.y < this._minRows)
            newSize.y = this._minRows;
        var itemWidth = (newSize.x * this._ngGrid.colWidth) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (newSize.x - 1));
        if (itemWidth < this.minWidth)
            newSize.x = Math.ceil((this.minWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft) / (this._ngGrid.colWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft));
        var itemHeight = (newSize.y * this._ngGrid.rowHeight) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (newSize.y - 1));
        if (itemHeight < this.minHeight)
            newSize.y = Math.ceil((this.minHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop) / (this._ngGrid.rowHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop));
        return newSize;
    };
    //	Private methods
    NgGridItem.prototype.elementMatches = function (element, selector) {
        if (!element)
            return false;
        if (element.matches)
            return element.matches(selector);
        if (element.oMatchesSelector)
            return element.oMatchesSelector(selector);
        if (element.msMatchesSelector)
            return element.msMatchesSelector(selector);
        if (element.mozMatchesSelector)
            return element.mozMatchesSelector(selector);
        if (element.webkitMatchesSelector)
            return element.webkitMatchesSelector(selector);
        if (!element.document || !element.ownerDocument)
            return false;
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
        for (var i = matches.length - 1; i >= 0; i--) {
            if (matches.item(i) === element) {
                return true;
            }
        }
        return false;
    };
    NgGridItem.prototype._recalculatePosition = function () {
        var x = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._currentPosition.col - 1) + this._ngGrid.marginLeft + this._ngGrid.screenMargin;
        var y = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._currentPosition.row - 1) + this._ngGrid.marginTop;
        this.setPosition(x, y);
    };
    NgGridItem.prototype._recalculateDimensions = function () {
        if (this._size.x < this._ngGrid.minCols)
            this._size.x = this._ngGrid.minCols;
        if (this._size.y < this._ngGrid.minRows)
            this._size.y = this._ngGrid.minRows;
        var newWidth = (this._ngGrid.colWidth * this._size.x) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
        var newHeight = (this._ngGrid.rowHeight * this._size.y) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
        var w = Math.max(this.minWidth, this._ngGrid.minWidth, newWidth);
        var h = Math.max(this.minHeight, this._ngGrid.minHeight, newHeight);
        this.setDimensions(w, h);
    };
    NgGridItem.prototype._getMousePosition = function (e) {
        if (e.originalEvent && e.originalEvent.touches) {
            var oe = e.originalEvent;
            e = oe.touches.length ? oe.touches[0] : (oe.changedTouches.length ? oe.changedTouches[0] : e);
        }
        else if (e.touches) {
            e = e.touches.length ? e.touches[0] : (e.changedTouches.length ? e.changedTouches[0] : e);
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        return {
            left: e.clientX - refPos.left,
            top: e.clientY - refPos.top,
        };
    };
    NgGridItem.prototype._applyChanges = function (changes) {
        var _this = this;
        var changed = false;
        var changeCheck = function (record) {
            if (_this._config[record.key] !== record.currentValue) {
                _this._config[record.key] = record.currentValue;
                changed = true;
            }
        };
        changes.forEachAddedItem(changeCheck);
        changes.forEachChangedItem(changeCheck);
        changes.forEachRemovedItem(function (record) {
            changed = true;
            delete _this._config[record.key];
        });
        if (changed) {
            this.setConfig(this._config);
        }
        return changed;
    };
    NgGridItem.prototype.onConfigChangeEvent = function () {
        if (this._userConfig === null)
            return;
        this._config.sizex = this._userConfig.sizex = this._size.x;
        this._config.sizey = this._userConfig.sizey = this._size.y;
        this._config.col = this._userConfig.col = this._currentPosition.col;
        this._config.row = this._userConfig.row = this._currentPosition.row;
        this.ngGridItemChange.emit(this._userConfig);
    };
    NgGridItem.prototype.canResizeInDirection = function (direction, mousePos) {
        switch (direction) {
            case "bottomright":
                return mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                    && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize; // tslint:disable-line:indent
            case "bottomleft":
                return mousePos.left < this._borderSize && mousePos.top < this._elemHeight
                    && mousePos.top > this._elemHeight - this._borderSize; // tslint:disable-line:indent
            case "topright":
                return mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                    && mousePos.top < this._borderSize; // tslint:disable-line:indent
            case "topleft":
                return mousePos.left < this._borderSize && mousePos.top < this._borderSize;
            case "right":
                return mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize;
            case "left":
                return mousePos.left < this._borderSize;
            case "bottom":
                return mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize;
            case "top":
                return mousePos.top < this._borderSize;
            default:
                return false;
        }
    };
    //	Default config
    // tslint:disable:object-literal-sort-keys
    // tslint:disable-next-line:member-ordering
    NgGridItem.CONST_DEFAULT_CONFIG = {
        uid: null,
        col: 1,
        row: 1,
        sizex: 1,
        sizey: 1,
        dragHandle: null,
        resizeHandle: null,
        fixed: false,
        draggable: true,
        resizable: true,
        borderSize: 25,
        resizeDirections: null,
    };
    NgGridItem.ɵfac = function NgGridItem_Factory(t) { return new (t || NgGridItem)(i0.ɵɵdirectiveInject(i0.KeyValueDiffers), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i1.NgGrid), i0.ɵɵdirectiveInject(i0.ViewContainerRef)); };
    NgGridItem.ɵdir = i0.ɵɵdefineDirective({ type: NgGridItem, selectors: [["", "ngGridItem", ""]], inputs: { config: ["ngGridItem", "config"] }, outputs: { onItemChange: "onItemChange", onDragStart: "onDragStart", onDrag: "onDrag", onDragStop: "onDragStop", onDragAny: "onDragAny", onResizeStart: "onResizeStart", onResize: "onResize", onResizeStop: "onResizeStop", onResizeAny: "onResizeAny", onChangeStart: "onChangeStart", onChange: "onChange", onChangeStop: "onChangeStop", onChangeAny: "onChangeAny", ngGridItemChange: "ngGridItemChange" } });
    return NgGridItem;
}());
export { NgGridItem };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgGridItem, [{
        type: Directive,
        args: [{
                inputs: ["config: ngGridItem"],
                selector: "[ngGridItem]",
            }]
    }], function () { return [{ type: i0.KeyValueDiffers }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.NgGrid }, { type: i0.ViewContainerRef }]; }, { onItemChange: [{
            type: Output
        }], onDragStart: [{
            type: Output
        }], onDrag: [{
            type: Output
        }], onDragStop: [{
            type: Output
        }], onDragAny: [{
            type: Output
        }], onResizeStart: [{
            type: Output
        }], onResize: [{
            type: Output
        }], onResizeStop: [{
            type: Output
        }], onResizeAny: [{
            type: Output
        }], onChangeStart: [{
            type: Output
        }], onChange: [{
            type: Output
        }], onChangeStop: [{
            type: Output
        }], onChangeAny: [{
            type: Output
        }], ngGridItemChange: [{
            type: Output
        }] }); })();
//# sourceMappingURL=NgGridItem.js.map