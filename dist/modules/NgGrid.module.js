import { NgModule } from "@angular/core";
import { NgGrid, NgGridItem, NgGridPlaceholder } from "../main";
import * as i0 from "@angular/core";
var NgGridModule = /** @class */ (function () {
    function NgGridModule() {
    }
    NgGridModule.ɵmod = i0.ɵɵdefineNgModule({ type: NgGridModule });
    NgGridModule.ɵinj = i0.ɵɵdefineInjector({ factory: function NgGridModule_Factory(t) { return new (t || NgGridModule)(); } });
    return NgGridModule;
}());
export { NgGridModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgGridModule, { declarations: [NgGrid, NgGridItem, NgGridPlaceholder], exports: [NgGrid, NgGridItem] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgGridModule, [{
        type: NgModule,
        args: [{
                declarations: [NgGrid, NgGridItem, NgGridPlaceholder],
                entryComponents: [NgGridPlaceholder],
                exports: [NgGrid, NgGridItem],
            }]
    }], null, null); })();
//# sourceMappingURL=NgGrid.module.js.map