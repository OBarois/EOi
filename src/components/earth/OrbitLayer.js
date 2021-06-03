import WorldWind from 'webworldwind-esa';
import Orbits from './wwwxx/shapes/Orbits';
const {
    RenderableLayer,
    Color
} = WorldWind;

/**
 * Class extending WorldWind.RenderableLayer. It`s possible to set time of orbit.
 * @param options {Object}
 * @param options.key {String}
 * @param options.time {Date} Selected time
 * @param options.currentTime {Date} 
 * @param options.opacity {Number} 
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class OrbitLayer extends RenderableLayer {
	constructor(options) {
        super(options);
        this._rerenderMap = null;
        this.satRec = null;
        this.key = options.key;
        this.timeWindow = 1000 * 60 * 15
        this.opacity = Number.isFinite(options.opacity) && options.opacity > -1 && options.opacity < 101 ? options.opacity : 100;
        this._beforeCurrentOrbit = new Orbits(options.satRec, new Date(), new Date(), new Color(213 / 255, 214  / 255, 210 / 255, 0.5));
        this._afterCurrentOrbit = new Orbits(options.satRec, new Date(), new Date(), new Color(1, 1, 0, 0.5));
        this.addRenderable(this._beforeCurrentOrbit);
        // this.addRenderable(this._afterCurrentOrbit);
        this.currentTime = null;
        this.selectTime = null;
        this.endTime = null;
        this.endTime = null;
        this.satRec = null;
        this.setSatRec(options.satRec);
        this.setTime(options.currentTime, options.time);
        
    };

    
    /**
     * @param {Array.<lte>} satRec  Lte.
     */
    setSatRec(satRec, preventUpdate) {
        if(satRec) {
            // this.satRec = satRec;
            // console.log(satRec)

            this._beforeCurrentOrbit.satrec(satRec, true);
            if(preventUpdate !== true) {
                this._beforeCurrentOrbit.update(true);
            }
            this._afterCurrentOrbit.satrec(satRec, true);
            if(preventUpdate !== true) {
                this._afterCurrentOrbit.update(true);
            }
            this.doRerender();
        }
    }

    /**
     * @param {Date} time Time of the orbit.
     */
     setTime(selectTime) {
        if(selectTime) {
            // this.currentTime = currentTime;
            this.selectTime = selectTime;

            this.startTime = new Date(selectTime.getTime() - this.timeWindow);
            this.endTime = new Date(selectTime.getTime() + this.timeWindow);

            // this.removeRenderable(this._beforeCurrentOrbit);
            // this.removeRenderable(this._afterCurrentOrbit);

            this._beforeCurrentOrbit.time(this.startTime, this.selectTime, false);
            // this._afterCurrentOrbit.time(this.selectTime, this.endTime, false);
            // this.addRenderable(this._beforeCurrentOrbit);
            // this.addRenderable(this._afterCurrentOrbit);

            this.doRerender();
        }
    }

    setTime2(currentTime, selectTime, preventUpdate) {
        if(currentTime && selectTime) {
            this.currentTime = currentTime;
            this.selectTime = selectTime;

            this.startTime = new Date(selectTime.getTime() - this.timeWindow);
            this.endTime = new Date(selectTime.getTime() + this.timeWindow);

            this.removeRenderable(this._beforeCurrentOrbit);
            this.removeRenderable(this._afterCurrentOrbit);

            if(currentTime.getTime() < this.startTime.getTime()) {
                //all in future
                this._afterCurrentOrbit.time(this.startTime, this.endTime, preventUpdate);
                this.addRenderable(this._afterCurrentOrbit);
            } else if(this.startTime.getTime() < currentTime.getTime() && currentTime.getTime() < this.endTime.getTime()) {
                //select time visible
                this._beforeCurrentOrbit.time(this.startTime, currentTime, preventUpdate);
                this._afterCurrentOrbit.time(currentTime, this.endTime, preventUpdate);
                this.addRenderable(this._beforeCurrentOrbit);
                this.addRenderable(this._afterCurrentOrbit);
            } else if(currentTime.getTime() > this.endTime.getTime()) {
                //all in past
                this._beforeCurrentOrbit.time(this.startTime, this.endTime, preventUpdate);
                this.addRenderable(this._beforeCurrentOrbit);
            }

            this.doRerender();
        }
    }

    forceUpdate() {
        this._afterCurrentOrbit.update(true);
        this._beforeCurrentOrbit.update(true);
    }
    
	setRerender(rerenderer) {
		if(typeof rerenderer === 'function') {
			this._rerenderMap = rerenderer;
		}
	}

	doRerender() {
		if(typeof this._rerenderMap === 'function') {
			this._rerenderMap();
		}
	}
}

export default OrbitLayer;

