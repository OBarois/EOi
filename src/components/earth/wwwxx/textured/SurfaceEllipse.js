import WorldWind from 'webworldwind-esa';

import TexturedSurfaceShape from  './TexturedSurfaceShape';

const {
    Angle,
    Location,
    SurfaceShape,
    WWMath
} = WorldWind;

export default class SurfaceEllipse extends TexturedSurfaceShape {

    static staticStateKey(shape) {
        const shapeStateKey = SurfaceShape.staticStateKey(shape);

        return shapeStateKey +
            ' ce ' + shape.center.toString() +
            ' ma ' + shape.majorRadius.toString() +
            ' mi ' + shape.minorRadius.toString() +
            ' he ' + shape.heading.toString() +
            ' in ' + shape.intervals.toString();
    }

    constructor(center, majorRadius, minorRadius, heading, attributes) {
        super(attributes);

        this._center = center;
        this._majorRadius = majorRadius;
        this._minorRadius = minorRadius;
        this._heading = heading;
        this._intervals = SurfaceEllipse.DEFAULT_NUM_INTERVALS;
    }

    get center() {
        return this._center;
    }

    set center(value) {
        this.stateKeyInvalid = true;
        this._center = value;
    }

    get majorRadius() {
        return this._majorRadius;
    }

    set majorRadius(value) {
        this.stateKeyInvalid = true;
        this._majorRadius = value;
    }

    get minorRadius() {
        return this._minorRadius;
    }

    set minorRadius(value) {
        this.stateKeyInvalid = true;
        this._minorRadius = value;
    }

    get heading() {
        return this._heading;
    }

    set heading(value) {
        this.stateKeyInvalid = true;
        this._heading = value;
    }

    get intervals() {
        return this._intervals;
    }

    set intervals(value) {
        this.stateKeyInvalid = true;
        this._intervals = value;
    }

    computeStateKey() {
        return SurfaceEllipse.staticStateKey(this);
    }

    computeBoundaries(dc) {
        if (this._majorRadius === 0 && this._minorRadius === 0) {
            return null;
        }

        var globe = dc.globe,
            numLocations = 1 + Math.max(SurfaceEllipse.MIN_NUM_INTERVALS, this._intervals),
            da = (2 * Math.PI) / (numLocations - 1),
            globeRadius = globe.radiusAt(this._center.latitude, this._center.longitude);

        this._boundaries = [];

        for (var i = 0; i < numLocations; i++) {
            var angle = (i !== numLocations - 1) ? i * da : 0,
                xLength = this._majorRadius * Math.cos(angle),
                yLength = this._minorRadius * Math.sin(angle),
                distance = Math.sqrt(xLength * xLength + yLength * yLength);

            // azimuth runs positive clockwise from north and through 360 degrees.
            var azimuth = (Math.PI / 2.0) -
                (Math.acos(xLength / distance) * WWMath.signum(yLength) - this.heading * Angle.DEGREES_TO_RADIANS);

            var loc = Location.greatCircleLocation(this._center, azimuth * Angle.RADIANS_TO_DEGREES,
                distance / globeRadius, new Location(0, 0));
            this._boundaries.push(loc);
        }
    }
}

SurfaceEllipse.MIN_NUM_INTERVALS = 8;

SurfaceEllipse.DEFAULT_NUM_INTERVALS = 64;