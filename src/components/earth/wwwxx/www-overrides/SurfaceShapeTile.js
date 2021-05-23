import Framebuffer from '../framebuffer/Framebuffer';
import WorldWind from 'webworldwind-esa';

const {
    SurfaceShapeTile
} = WorldWind;

SurfaceShapeTile.prototype.updateTexture = function (dc) {
    var gl = dc.currentGlContext;
    // Mapping from lat/lon to x/y:
    //  lon = minlon => x = 0
    //  lon = maxLon => x = 256
    //  lat = minLat => y = 256
    //  lat = maxLat => y = 0
    //  (assuming texture size is 256)
    // So:
    //  x = 256 / sector.dlon * (lon - minLon)
    //  y = -256 / sector.dlat * (lat - maxLat)
    var xScale = this.tileWidth / this.sector.deltaLongitude(),
        yScale = -this.tileHeight / this.sector.deltaLatitude(),
        xOffset = -this.sector.minLongitude * xScale,
        yOffset = -this.sector.maxLatitude * yScale;

    // Reset the surface shape state keys
    this.asRenderedSurfaceShapeStateKeys = [];

    var fbo = dc.gpuResourceCache.resourceForKey('SurfaceShapeFBO');
    fbo.attachTexture(gl, this.tileWidth, this.tileHeight);
    fbo.clear(gl);

    for (var idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
        var shape = this.surfaceShapes[idx];
        this.asRenderedSurfaceShapeStateKeys.push(this.surfaceShapeStateKeys[idx]);

        shape.renderToTexture(dc, fbo, xScale, yScale, xOffset, yOffset);
    }

    this.gpuCacheKey = this.getCacheKey();

    var gpuResourceCache = dc.gpuResourceCache;
    var texture = fbo.texture;
    gpuResourceCache.putResource(this.gpuCacheKey, texture, texture.size);

    return texture;
};