import { NgModule } from "@angular/core";
import { NgGrid, NgGridItem, NgGridPlaceholder } from "../main";
var NgGridModule = /** @class */ (function () {
    function NgGridModule() {
    }
    NgGridModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgGrid, NgGridItem, NgGridPlaceholder],
                    entryComponents: [NgGridPlaceholder],
                    exports: [NgGrid, NgGridItem],
                },] },
    ];
    return NgGridModule;
}());
export { NgGridModule };
//# sourceMappingURL=NgGrid.module.js.map