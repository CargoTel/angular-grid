import { NgModule } from "@angular/core";
import { NgGrid, NgGridItem, NgGridPlaceholder } from "../main";
import * as i0 from "@angular/core";
var NgGridModule = /** @class */ (function () {
    function NgGridModule() {
    }
    NgGridModule.ɵfac = function NgGridModule_Factory(t) { return new (t || NgGridModule)(); };
    NgGridModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: NgGridModule });
    NgGridModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
    return NgGridModule;
}());
export { NgGridModule };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NgGridModule, [{
        type: NgModule,
        args: [{
                declarations: [NgGrid, NgGridItem, NgGridPlaceholder],
                entryComponents: [NgGridPlaceholder],
                exports: [NgGrid, NgGridItem],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgGridModule, { declarations: [NgGrid, NgGridItem, NgGridPlaceholder], exports: [NgGrid, NgGridItem] }); })();
//# sourceMappingURL=NgGrid.module.js.map