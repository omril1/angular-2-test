//export let parseElementRectangle = function (target: any) {
//    return {
//        left: Number(target.style.left.replace('px', '')),
//        top: Number(target.style.top.replace('px', '')),
//        width: Number(target.style.width.replace('px', '')),
//        height: Number(target.style.height.replace('px', ''))
//    };
//}
/**
  * Draw the ghost image outside of the screen, AKA no ghost image.
  * @param event DragEvent of the element's ghost to hide.
  */
export let noGhostImage = function (event: DragEvent) {
    event.dataTransfer.setDragImage(<HTMLLIElement>event.currentTarget, -99999, -99999);
}
export let roundAngle = function (angle, variance = 7) {
    for (let a of [0, 90, 180]) {
        let sign = angle > 0 ? 1 : -1;
        if (angle < a + variance && angle > a - variance || angle < -a + variance && angle > -a - variance)
            angle = a * sign;
    }
    return angle;
}