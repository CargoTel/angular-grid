import { ElementRef, OnInit, Renderer2 } from "@angular/core";
import { NgGrid } from "../directives/NgGrid";
import { NgGridItemPosition, NgGridItemSize } from "../interfaces/INgGrid";
import * as i0 from "@angular/core";
export declare class NgGridPlaceholder implements OnInit {
    private _ngEl;
    private _renderer;
    private _size;
    private _position;
    private _ngGrid;
    private _cascadeMode;
    constructor(_ngEl: ElementRef, _renderer: Renderer2);
    registerGrid(ngGrid: NgGrid): void;
    ngOnInit(): void;
    setSize(newSize: NgGridItemSize): void;
    setGridPosition(newPosition: NgGridItemPosition): void;
    setCascadeMode(cascade: string): void;
    private _setDimensions;
    private _setPosition;
    private _recalculatePosition;
    private _recalculateDimensions;
    static ɵfac: i0.ɵɵFactoryDef<NgGridPlaceholder, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<NgGridPlaceholder, "ng-grid-placeholder", never, {}, {}, never, never>;
}
