import Framebuffer from '../framebuffer/Framebuffer';
import WorldWind from 'webworldwind-esa';

const {
    ArgumentError,
    Logger,
    SurfaceShapeTileBuilder,
    SurfaceShape,
    PickedObject
} = WorldWind;

const fboCacheKey = 'SurfaceShapeFBO';

SurfaceShapeTileBuilder.prototype.buildTiles = function (dc) {
    if (!dc) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, 'SurfaceShapeTileBuilder', 'buildTiles', 'missingDc'));
    }

    if (!this.surfaceShapes || this.surfaceShapes.length < 1) {
        return;
    }

    // Assemble the current visible tiles and update their associated textures if necessary.
    this.assembleTiles(dc);

    if (SurfaceShapeTileBuilder.__fboBound__) {
        const fbo = SurfaceShapeTileBuilder.getFbo(dc);
        fbo.unbind(dc.currentGlContext, dc.currentFramebuffer);
        SurfaceShapeTileBuilder.__fboBound__ = false;
    }

    // Clean up references to all surface shapes to avoid dangling references. The surface shape list is no
    // longer needed, now that the shapes are held by each tile.
    this.surfaceShapes.splice(0, this.surfaceShapes.length);
    for (var idx = 0, len = this.surfaceShapeTiles.length; idx < len; idx += 1) {
        var tile = this.surfaceShapeTiles[idx];
        tile.clearShapes();
    }
};


SurfaceShapeTileBuilder.prototype.addTile = function (dc, tile) {
    if (dc.pickingMode) {
        tile.pickSequence = SurfaceShapeTileBuilder.pickSequence;
    }

    if (tile.needsUpdate(dc)) {

        const fbo = SurfaceShapeTileBuilder.getFbo(dc);
        if (!SurfaceShapeTileBuilder.__fboBound__) {
            fbo.bind(dc.currentGlContext, this.tileWidth, this.tileHeight);
            SurfaceShapeTileBuilder.__fboBound__ = true;
        }

        tile.updateTexture(dc);
    }

    this.surfaceShapeTiles.push(tile);
};


/**
 * Perform the rendering of any accumulated surface shapes by building the surface shape tiles that contain these
 * shapes and then rendering those tiles.
 *
 * @param {DrawContext} dc The drawing context.
 */
SurfaceShapeTileBuilder.prototype.doRender = function (dc) {
    if (dc.pickingMode) {
        // Picking rendering strategy:
        //  1) save all tiles created prior to picking,
        //  2) construct and render new tiles with pick-based contents (colored with pick IDs),
        //  3) restore all prior tiles.
        // This has a big potential win for normal rendering, since there is a lot of coherence
        // from frame to frame if no picking is occurring.
        for (var idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
            this.surfaceShapes[idx].resetPickColor();
        }

        SurfaceShapeTileBuilder.pickSequence += 1;

        var savedTiles = this.surfaceShapeTiles;
        var savedTopLevelTiles = this.topLevelTiles;

        this.surfaceShapeTiles = [];
        this.topLevelTiles = [];

        this.buildTiles(dc);

        if (dc.deepPicking) {
            // Normally, we render all shapes together in one tile (or a small number, but this detail
            // doesn't matter). For deep picking, we need to render each shape individually.
            this.doDeepPickingRender(dc);

        } else {
            dc.surfaceTileRenderer.renderTiles(dc, this.surfaceShapeTiles, 1);
        }

        this.surfaceShapeTiles = savedTiles;
        this.topLevelTiles = savedTopLevelTiles;
    } else {
        this.buildTiles(dc);

        dc.surfaceTileRenderer.renderTiles(dc, this.surfaceShapeTiles, 1);
    }
};

SurfaceShapeTileBuilder.prototype.doDeepPickingRender = function (dc) {
    var idxTile, lenTiles, idxShape, lenShapes, idxPick, lenPicks, po, shape, tile;

    // Determine the shapes that were drawn during buildTiles. These shapes may not actually be
    // at the pick point, but they are candidates for deep picking.
    var deepPickShapes = [];
    for (idxPick = 0, lenPicks = dc.objectsAtPickPoint.objects.length; idxPick < lenPicks; idxPick += 1) {
        po = dc.objectsAtPickPoint.objects[idxPick];
        if (po.userObject instanceof SurfaceShape) {
            shape = po.userObject;

            // If the shape was not already in the collection of deep picked shapes, ...
            if (deepPickShapes.indexOf(shape) < 0) {
                deepPickShapes.push(shape);

                // Delete the shape that was drawn during buildTiles from the pick list.
                dc.objectsAtPickPoint.objects.splice(idxPick, 1);

                // Update the index and length to reflect the deletion.
                idxPick -= 1;
                lenPicks -= 1;
            }
        }
    }

    if (deepPickShapes.length <= 0) {
        return;
    }

    // For all shapes,
    //  1) force that shape to be the only shape in a tile,
    //  2) re-render the tile, and
    //  3) use the surfaceTileRenderer to render the tile on the terrain,
    //  4) read the color to see if it is attributable to the current shape.
    var resolvablePickObjects = [];
    for (idxShape = 0, lenShapes = deepPickShapes.length; idxShape < lenShapes; idxShape += 1) {
        shape = deepPickShapes[idxShape];

        const fbo = SurfaceShapeTileBuilder.getFbo(dc);
        if (!SurfaceShapeTileBuilder.__fboBound__) {
            fbo.bind(dc.currentGlContext, this.tileWidth, this.tileHeight);
            SurfaceShapeTileBuilder.__fboBound__ = true;
        }

        for (idxTile = 0, lenTiles = this.surfaceShapeTiles.length; idxTile < lenTiles; idxTile += 1) {
            tile = this.surfaceShapeTiles[idxTile];
            tile.setShapes([shape]);

            tile.updateTexture(dc);
        }

        if (SurfaceShapeTileBuilder.__fboBound__) {
            const fbo = SurfaceShapeTileBuilder.getFbo(dc);
            fbo.unbind(dc.currentGlContext, dc.currentFramebuffer);
            SurfaceShapeTileBuilder.__fboBound__ = false;
        }

        dc.surfaceTileRenderer.renderTiles(dc, this.surfaceShapeTiles, 1);

        var pickColor = dc.readPickColor(dc.pickPoint);
        if (!!pickColor && shape.pickColor.equals(pickColor)) {
            po = new PickedObject(shape.pickColor.clone(),
                shape.pickDelegate ? shape.pickDelegate : shape, null, shape.layer, false);
            resolvablePickObjects.push(po);
        }
    }

    // Flush surface shapes that have accumulated in the updateTexture pass just completed on all shapes.
    for (idxPick = 0, lenPicks = dc.objectsAtPickPoint.objects.length; idxPick < lenPicks; idxPick += 1) {
        po = dc.objectsAtPickPoint.objects[idxPick];
        if (po.userObject instanceof SurfaceShape) {
            // Delete the shape that was picked in the most recent pass.
            dc.objectsAtPickPoint.objects.splice(idxPick, 1);

            // Update the index and length to reflect the deletion.
            idxPick -= 1;
            lenPicks -= 1;
        }
    }

    // Add the resolvable pick objects for surface shapes that were actually visible at the pick point
    // to the pick list.
    for (idxPick = 0, lenPicks = resolvablePickObjects.length; idxPick < lenPicks; idxPick += 1) {
        po = resolvablePickObjects[idxPick];
        dc.objectsAtPickPoint.objects.push(po);
    }
};

SurfaceShapeTileBuilder.getFbo = function (dc) {
    let fbo = dc.gpuResourceCache.resourceForKey(fboCacheKey);
    if (!fbo) {
        fbo = new Framebuffer();
        dc.gpuResourceCache.putResource(fboCacheKey, fbo, 1);
    }
    return fbo;
};

SurfaceShapeTileBuilder.__frameStart__ = false;
SurfaceShapeTileBuilder.__fboBound__ = false;