import WorldWind from 'webworldwind-esa';

const {
    TiledImageLayer
} = WorldWind;

var index = 0;

TiledImageLayer.prototype.retrieveTileImage = function (dc, tile, suppressRedraw) {
    if (!this.pendingRequests) {
        this.pendingRequests = [];
    }
    if (!this.MAX_REQUESTS) {
        this.MAX_REQUESTS = 16;
    }

    const isBeingRetrieved = this.currentRetrievals.indexOf(tile.imagePath) >= 0;
    if (isBeingRetrieved) {
        return;
    }

    const isPending = this.pendingRequests.some(t => t.imagePath === tile.imagePath);
    if (isPending) {
        return;
    }

    if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
        return;
    }

    const url = this.resourceUrlForTile(tile, this.retrievalImageFormat);
    //const imagePath = tile.imagePath;

    if (!url) {
        this.currentTilesInvalid = true;
        return;
    }

    /*this.pendingRequests.push(tile);
    if (this.pendingRequests.length === 100) {
        console.log('pendingRequests', this.pendingRequests.length, 'currentRetrievals', this.currentRetrievals.length);
        //console.log('pendingRequests', this.pendingRequests.slice());

        this.pendingRequests = this.pendingRequests.slice(80);

        console.log('pendingRequests', this.pendingRequests.length, 'currentRetrievals', this.currentRetrievals.length);
    }*/
    if (this.pendingRequests.length === 20) {
        //console.log(20);
        this.pendingRequests.shift();
    }
    this.pendingRequests.push(tile);

    if (this.currentRetrievals.length <= this.MAX_REQUESTS) {
        this.fetchMoreImages(dc, this);
    }
};

TiledImageLayer.prototype.fetchMoreImages = function (dc, layer) {
    const before = layer.pendingRequests.length;
    layer.pendingRequests = layer.pendingRequests.filter(pendingTile => layer.isTileVisible(dc, pendingTile));
    if (!layer.pendingRequests.length) {
        return;
    }

    const skip = before - layer.pendingRequests.length

    //if (skip) console.log('skip tiles', skip);

    var pendingTile = layer.pendingRequests.shift();
    var imagePath = pendingTile.imagePath;
    var url = layer.resourceUrlForTile(pendingTile, layer.retrievalImageFormat);

    if (!imagePath || !url) {
        return;
    }

    const cache = dc.gpuResourceCache;
    //const layer = self;

    layer.fetchImage(url, function (err, image) {
        if (err) {
            layer.removeFromCurrentRetrievals(imagePath);
            layer.absentResourceList.markResourceAbsent(imagePath);

            if (layer.currentRetrievals.length <= layer.MAX_REQUESTS) {
                layer.fetchMoreImages(dc, layer);
            }
            return;
        }

        var texture = layer.createTexture(dc, null, image);
        layer.removeFromCurrentRetrievals(imagePath);

        if (texture) {
            cache.putResource(imagePath, texture, texture.size);

            layer.currentTilesInvalid = true;
            layer.absentResourceList.unmarkResourceAbsent(imagePath);

            var e = document.createEvent('Event');
            e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
            window.dispatchEvent(e);
        }

        if (layer.currentRetrievals.length <= layer.MAX_REQUESTS) {
            layer.fetchMoreImages(dc, layer);
        }
    });

    layer.currentRetrievals.push(imagePath);
};

TiledImageLayer.prototype.fetchImage = function (url, cb) {
    const image = new Image();

    image.onload = function () {
        cb(null, image);
    };

    image.onerror = function () {
        cb(new Error('Image retrieval failed'), null);
    };

    image.crossOrigin = 'anonymous';

    if (window.webkit) {
        // url = '/proxy?url=' + encodeURIComponent(url);
    }
    else if (!window.webkit && !window.AndroidApp) {
        // url = '/proxy?url=' + encodeURIComponent(url);
    }

    image.src = url;
};

TiledImageLayer.prototype.doRender_ = function (dc) {
    if (!dc.terrain)
        return;

    if (this.currentTilesInvalid
        || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
        || dc.globeStateKey !== this.lastGlobeStateKey) {
        this.currentTilesInvalid = false;

        this.assembleTiles(dc);

        // Tile fading works visually only when the surface tiles are opaque, otherwise the surface flashes
        // when two tiles are drawn over the same area, even though one of them is semi-transparent.
        // So do not provide fading when the surface opacity is less than 1;
        /*if (dc.surfaceOpacity >= 1 && this.opacity >= 1) {
            // Fading of outgoing tiles requires determination of the those tiles. Prepare an object with all of
            // the preceding frame's tiles so that we can subsequently compare the list of newly selected tiles
            // with the previously selected tiles.
            this.previousTiles = {};
            for (var j = 0; j < this.currentTiles.length; j++) {
                this.previousTiles[this.currentTiles[j].imagePath] = this.currentTiles[j];
            }

            this.assembleTiles(dc);
            this.fadeOutgoingTiles(dc);
        } else {
            this.assembleTiles(dc);
        }*/

    }

    this.lasTtMVP = dc.navigatorState.modelviewProjection;
    this.lastGlobeStateKey = dc.globeStateKey;

    //this.cleanCache(dc);

    if (this.currentTiles.length > 0) {
        dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity, dc.surfaceOpacity >= 1);
        dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
        this.inCurrentFrame = true;
    }
};

TiledImageLayer.prototype.cleanCache = function () {

};