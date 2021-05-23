import TexturedSurfaceShape from './TexturedSurfaceShape';

export default class TexturedSurfacePolygon extends TexturedSurfaceShape {

    static staticStateKey(shape) {
        return TexturedSurfaceShape.staticStateKey(shape);
    }

    constructor(boundaries, attributes) {
        super(attributes);

        if (!Array.isArray(boundaries)) {
            throw new Error('TexturedSurfacePolygon - constructor - The specified boundary is not an array.');

        }

        //this._boundaries = boundaries;
        this._boundaries = this.removeDuplicateLocations(boundaries);
    }

    get boundaries() {
        return this._boundaries;
    }

    set boundaries(boundaries) {
        if (!Array.isArray(boundaries)) {
            throw new Error('TexturedSurfacePolygon - set boundaries - The specified boundary is not an array.');
        }
        //this._boundaries = boundaries;
        this._boundaries = this.removeDuplicateLocations(boundaries);
        this.isPrepared = false;
        this.stateKeyInvalid = true;
    }

    removeDuplicateLocations(boundaries) {
        if (Array.isArray(boundaries[0])) {
            const newBoundaries = [];
            for (var i = 0; i < boundaries.length; i++) {
                var contour = this.removeDuplicateLocationsFromContour(boundaries[i]);
                newBoundaries.push(contour);
            }
            return newBoundaries;
        }
        else {
            return this.removeDuplicateLocationsFromContour(boundaries);
        }
    }

    removeDuplicateLocationsFromContour(contour) {
        const newBoundaries = [];

        for (var i = 0; i < contour.length ; i++) {
            var loc = contour[i];
            newBoundaries.push(loc);
            for (var j = i + 1; j < contour.length; j++) {
                var loc2 = contour[j];
                if (loc.latitude !== loc2.latitude || loc.longitude !== loc2.longitude) {
                    break;
                }
                i++;
            }
        }

        return newBoundaries;
    }

    computeStateKey() {
        return TexturedSurfacePolygon.staticStateKey(this);
    }

}