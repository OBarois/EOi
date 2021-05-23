import WorldWind from 'webworldwind-esa';
import SurfaceShape from './SurfaceShape';

const {
    DrawContext,
    // SurfaceShape,
} = WorldWind;

/**
 * Determines whether a specified picked object is under the pick point, and if it is adds it to this draw
 * context's list of picked objects. This method should be called by shapes during ordered rendering
 * after the shape is drawn. If this draw context is in single-picking mode, the specified pickable object
 * is added to the list of picked objects whether or not it is under the pick point.
 * @param pickableObject
 * @returns {null}
 */
DrawContext.prototype.resolvePick = function (pickableObject) {
    if (!(pickableObject.userObject instanceof SurfaceShape) && this.deepPicking && !this.regionPicking) {
        var color = this.readPickColor(this.pickPoint);
        if (!color) { // getPickColor returns null if the pick point selects the clear color
            return null;
        }

        if (pickableObject.color.equals(color)) {
            this.addPickedObject(pickableObject);
        }
    } else {
        // Don't resolve. Just add the object to the pick list. It will be resolved later.
        this.addPickedObject(pickableObject);
    }
};