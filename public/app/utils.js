"use strict";
/**
  * Draw the ghost image outside of the screen, AKA no ghost image.
  * @param event DragEvent of the element's ghost to hide.
  */
exports.noGhostImage = function (event) {
    event.dataTransfer.setDragImage(event.currentTarget, -99999, -99999);
    //(<any>event.dataTransfer).setDragImage(new Image(), 0, 0);
};
/**
  * Rounds the angle to the nearest whole right angle if possible.
  * @returns the angle after rounding.
  * @param angle the angle to round.
  * @param variance how much degrees from a right angle to round.
  */
exports.roundAngle = function (angle, variance) {
    if (variance === void 0) { variance = 7; }
    for (var _i = 0, _a = [0, 90, 180]; _i < _a.length; _i++) {
        var a = _a[_i];
        var sign = angle > 0 ? 1 : -1;
        if (angle < a + variance && angle > a - variance || angle < -a + variance && angle > -a - variance)
            angle = a * sign;
    }
    return angle;
};
//# sourceMappingURL=utils.js.map