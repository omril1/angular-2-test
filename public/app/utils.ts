/**
  * Draw the ghost image outside of the screen, AKA no ghost image.
  * @param event DragEvent of the element's ghost to hide.
  */
export let noGhostImage = function (event: DragEvent) {
    (<any>event.dataTransfer).setDragImage(<HTMLLIElement>event.currentTarget, -99999, -99999);
}
/**
  * Rounds the angle to the nearest whole right angle if possible.
  * @returns the angle after rounding.
  * @param angle the angle to round.
  * @param variance how much degrees from a right angle to round.
  */
export let roundAngle = function (angle: number, variance = 7) {
    for (let a of [0, 90, 180]) {
        let sign = angle > 0 ? 1 : -1;
        if (angle < a + variance && angle > a - variance || angle < -a + variance && angle > -a - variance)
            angle = a * sign;
    }
    return angle;
}