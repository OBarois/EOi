import SurfaceEllipse from './SurfaceEllipse';

export default class SurfaceCircle extends SurfaceEllipse {

    static staticStateKey(shape) {
        const shapeStateKey = SurfaceEllipse.staticStateKey(shape);

        return shapeStateKey +
            ' ra ' + shape.radius.toString();
    }

    constructor(center, radius, attributes) {
        super(center, radius, radius, 0, attributes);

        this._radius = radius;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this.stateKeyInvalid = true;
        this._radius = value;
    }

    computeStateKey() {
        return SurfaceCircle.staticStateKey(this);
    }

}