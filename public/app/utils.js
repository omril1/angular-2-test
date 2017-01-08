"use strict";
exports.parseElementRectangle = function (target) {
    return {
        left: Number(target.style.left.replace('px', '')),
        top: Number(target.style.top.replace('px', '')),
        width: Number(target.style.width.replace('px', '')),
        height: Number(target.style.height.replace('px', '')),
        rotation: Number(target.style.transform.replace('rotate(', '').replace('rad)', ''))
    };
};
/**
  * Draw the ghost image outside of the screen, AKA no ghost image.
  * @param event DragEvent of the element's ghost to hide.
  */
exports.noGhostImage = function (event) {
    event.dataTransfer.setDragImage(event.srcElement, -99999, -99999);
};
exports.createLineElement = function (x, y, length, angle) {
    var line = document.createElement("div");
    var styles = 'border: 1px solid black; '
        + 'width: ' + length + 'px; '
        + 'height: 0px; '
        + 'transform: rotate(' + angle + 'rad); '
        + 'position: absolute; '
        + 'top: ' + y + 'px; '
        + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);
    return line;
};
exports.createLine = function (x1, y1, x2, y2) {
    var a = x1 - x2, b = y1 - y2, c = Math.sqrt(a * a + b * b);
    var sx = (x1 + x2) / 2, sy = (y1 + y2) / 2;
    var x = sx - c / 2, y = sy;
    var alpha = Math.PI - Math.atan2(-b, a);
    return exports.createLineElement(x, y, c, alpha);
};
//# sourceMappingURL=utils.js.map