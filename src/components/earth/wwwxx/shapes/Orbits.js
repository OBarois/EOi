import WorldWind from 'webworldwind-esa';
import WordWindX from 'webworldwind-x';
const {
    EoUtils,
} = WordWindX;

const {
    ABSOLUTE,
    Color,
    Renderable,
    Path,
    ShapeAttributes
} = WorldWind;


/**
 * @exports Orbits
 */
class Orbits extends Renderable {
    /**
     * Constructs Orbits displaying the past and future position. The positions are calculated from the satrec. The
     * orbits are displayed from now back to past and
     * @param satrec {Object} SDG format representing the satellite.
     * @param time {Date} Date for which the orbits will be displayed.
     * @param timeWindow {Number} Amount of milliseconds for the time window.
     * @param orbitPoints {Number} Amount of the Panther.
     */
    constructor(satrec, startTime = new Date(), endTime = new Date(), color, orbitPoints = 120) {
        super();

        if(!satrec) {
            throw new Error('Orbits#constructor Satellite Record is missing.');
        }

        this._satrec = satrec;

        // this._timeWindow = timeWindow;
        this._orbitPoints = orbitPoints;

        this._trail = this.trail(this.trailAttributes(color));
        // this._futureTrail = this.trail(this.trailAttributes(new Color(1, 1, 0, 1)));

        if(endTime.getTime() === startTime.getTime()) {
            this._currentEndTime = new Date(startTime.getTime() + orbitPoints * 1000);
            this._previousEndTime = new Date(startTime.getTime() + orbitPoints * 1000);
        } else {
            this._currentEndTime = endTime;
            this._previousEndTime = endTime;
        }

        this._currentStartTime = startTime;
        this._previousStartTime = startTime;

        this.populate();
    }

    /**
     * Update information about when and where the satellite was. It fully rebuilds the positions for the trails.
     * @param satelliteRecord SPG format representing the satellite.
     */
    satrec(satelliteRecord, preventPopulate) {
        if(!satelliteRecord) {
            throw Error('No satellite record was provided');
        }
        this._satrec = satelliteRecord;
        // This must signalize somehow that it needs to be recalculated.

        if(preventPopulate !== true) {
            this.populate();
        }
    }

    /**
     * Update current time for this set of orbits.
     * @param startTime {Date} Start date for the orbit.
     * @param endTime {Date} End date for the orbit.
     */
    time(startTime, endTime, preventUpdate) {
        if(!startTime) {
            throw Error('No startTime was provided');
        }
        if(!endTime) {
            throw Error('No endTime was provided');
        }
        this._previousStartTime = this._currentStartTime;
        this._previousEndTime = this._currentEndTime;
        this._currentStartTime = startTime;
        this._currentEndTime = endTime;

        if(preventUpdate !== true) {
            this.update();
        }
    }

    /**
     * Renders all trails belonging to this Orbit if it is enabled.
     * @param dc {DrawContext} Shared state for one rendering.
     */
    render(dc) {
        if(!this.enabled) {
            return;
        }

        this._trail.render(dc);
        // this._futureTrail.render(dc);
    }

    /**
     * Updates the trails associated with this Orbit based on the current time and satrec. If there is no change in
     * either of these parameters nothing changes.
     * @param force {Boolean} If force, recalculate all positions
     * @private
     */
    update(force = false) {
        const startDate = this._currentStartTime.getTime();
        const now = startDate;
        const previousStartTime = this._previousStartTime.getTime();
        const previousTime = previousStartTime;
        const changeStart = startDate - previousStartTime;
        const endDate = this._currentEndTime.getTime();
        const previousEndTime = this._previousEndTime.getTime();
        const changeEnd = endDate - previousEndTime;
        if(changeStart === 0 && changeEnd === 0 && !force) {
            return;
        }

        if(force) {
            this.populate();
            return;
        }

        const timeWindow = endDate - startDate;

        const tick = Math.floor(timeWindow / this._orbitPoints);
        let positionsToReplace = (Math.ceil(Math.abs(now - previousTime) / tick)) + Math.ceil(Math.abs(endDate - previousEndTime) / tick);
        if(positionsToReplace > this._orbitPoints) {
            this.populate();
            return;
        }

        //if start change
        //update start
        if(changeStart) {
            //change to future
            if(changeStart > 0) {
                //remove olded possitions than current startDate
                let i = 0;
                while (this._trail.positions[i].time < startDate) {
                    this._trail.positions.shift();
                }
            }

            if(changeStart < 0) {
                //add possitions to startDate
                const positionsToReplace = Math.ceil(Math.abs(now - previousTime) / tick);
                for(let positionIndex = 0; positionIndex < positionsToReplace; positionIndex++) {
                    const time = new Date(previousTime - positionIndex * tick);
                    const position = EoUtils.getOrbitPositionWithPositionalData(this._satrec, time).position;
                    position.time = time.getTime();
                    this._trail.positions = [position, ...this._trail.positions];
                }
            }
        }
        

        //if end change
        //update end
        if(changeEnd) {
            //change to future
            if(changeEnd > 0) {
                //change to future
                const positionsToReplace = Math.ceil(Math.abs(endDate - previousEndTime) / tick);
                for(let positionIndex = 0; positionIndex < positionsToReplace; positionIndex++) {
                    const time = new Date(previousEndTime + positionIndex * tick);
                    const position = EoUtils.getOrbitPositionWithPositionalData(this._satrec, time).position;
                    position.time = time.getTime();
                    this._trail.positions.push(position);
                }
            }

            if(changeEnd < 0) {
                //remove olded possitions than current endDate
                let i = this._trail.positions.length - 1;
                while (this._trail.positions[i].time > endDate) {
                    this._trail.positions.pop();
                    i = this._trail.positions.length - 1;
                }
            }
        }
        this._trail.positions = [...this._trail.positions];
    }

    populate() {
        const startDate = this._currentStartTime.getTime();
        const endDate = this._currentEndTime.getTime();
        const timeWindow = endDate - startDate;
        const tick = Math.floor(timeWindow / this._orbitPoints);

        const positions = [];
        for(let positionIndex = 0; positionIndex < this._orbitPoints; positionIndex++) {
            const time = new Date(startDate + positionIndex * tick);
            const position = EoUtils.getOrbitPositionWithPositionalData(this._satrec, time).position;
            position.time = time.getTime();
            positions.push(position);
        }
        this._trail.positions = [...positions];
    }

    /**
     * Create the relevant shape which is used to display the orbit on the globe.
     * @private
     * @param attributes
     */
    trail(attributes) {
        const trail = new Path([]);
        trail.enabled = true;
        trail.altitudeMode = ABSOLUTE;
        trail.numSubSegments = 1;
        trail.attributes = attributes;
        // trail.extrude = true
        return trail;
    }

    /**
     * Create attributes for the proper visualization of the Orbit in more than one color.
     * @private
     * @param color
     */
    trailAttributes(color) {
        const attributes = new ShapeAttributes(null);
        attributes.outlineColor = color;
        attributes.outlineWidth = 2;
        attributes.drawOutline = true;
        attributes.drawInterior = true;
        return attributes;
    }
}

export default Orbits;