import libtess from './libtess';
import ScreenColorProgram from './ScreenColorProgram';
import ScreenTextureProgram from './ScreenTextureProgram';
import WorldWind from 'webworldwind-esa';

const {
    Angle,
    SurfaceShape,
    PickedObject,
    Texture,
    Location,
} = WorldWind;

const WGS84_SEMI_MAJOR_AXIS = 6378137.0;

export default class TexturedSurfaceShape extends SurfaceShape {

    static tesselator() {
        if (!TexturedSurfaceShape.tess) {
            TexturedSurfaceShape.tess = new libtess.GluTesselator();
        }
        return TexturedSurfaceShape.tess;
    }

    static nextId() {
        if (!TexturedSurfaceShape._nextId) {
            TexturedSurfaceShape._nextId = 0;
        }
        return TexturedSurfaceShape._nextId++;
    }

    static staticStateKey(shape) {
        shape.stateKeyInvalid = false;

        if (shape.highlighted) {
            if (!shape._highlightAttributes) {
                if (!shape._attributes) {
                    shape._attributesStateKey = null;
                } else {
                    shape._attributesStateKey = shape._attributes.stateKey;
                }
            } else {
                shape._attributesStateKey = shape._highlightAttributes.stateKey;
            }
        } else {
            if (!shape._attributes) {
                shape._attributesStateKey = null;
            } else {
                shape._attributesStateKey = shape._attributes.stateKey;
            }
        }

        return 'dn ' + shape.displayName +
            ' id ' + shape._id +
            ' at ' + (!shape._attributesStateKey ? 'null' : shape._attributesStateKey) +
            ' hi ' + shape.highlighted +
            ' en ' + shape.enabled +
            ' pt ' + shape.pathType +
            ' ne ' + shape.maximumNumEdgeIntervals +
            ' po ' + shape.polarThrottle +
            ' img ' + !!shape.image +
            ' se ' + '[' +
            shape.sector.minLatitude + ',' +
            shape.sector.maxLatitude + ',' +
            shape.sector.minLongitude + ',' +
            shape.sector.maxLongitude +
            ']';
    }

    constructor(attributes) {
        super(attributes);

        this._image = null;
        this._imageUUID = '';
        this._interiorVboCacheKey = '';
        this._outlineVboCacheKey = '';

        this._contoursPrepered = false;
        this._contoursInfo = [];

        this._id = TexturedSurfaceShape.nextId();
    }

    get image() {
        return this._image;
    }

    set image(img) {
        this._image = img;
        this.stateKeyInvalid = true;
    }

    get imageUUID() {
        return this._imageUUID;
    }

    set imageUUID(value) {
        this._imageUUID = value;
    }

    renderToTexture(dc, fbo, xScale, yScale, dx, dy) {
        const attributes = (this._highlighted ? (this._highlightAttributes || this._attributes) : this._attributes);
        const drawInterior = (!this._isInteriorInhibited && attributes.drawInterior);
        const drawOutline = (attributes.drawOutline && attributes.outlineWidth > 0);

        if (!drawInterior && !drawOutline) {
            return;
        }

        if (dc.pickingMode && !this.pickColor) {
            this.pickColor = dc.uniquePickColor();
        }

        //TODO pass width and height from SurfaceShapeTile
        const tileWidth = 256;
        const tileHeight = 256;

        var i;
        const interiorGeometry = this.mapGeometry(this._interiorGeometry, xScale, yScale, dx, dy);
        for (i = 0; i < interiorGeometry.length; i++) {
            if (!this._contoursPrepered) {
                var wo = this.windingOrder_all(interiorGeometry[i]);
                this._contoursInfo.push({wo: wo});
            }

            var points = interiorGeometry[i];
            if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
                points.pop();
                points.pop();
            }
        }

        if (this._image && !dc.pickingMode && !this.crossesAntiMeridian && !this.containsPole) {
            if (!this._contoursPrepered) {
                if (interiorGeometry.length === 1) {
                    const {anglesMap, topLeftIndex} = this.getCorners(interiorGeometry[0], this._contoursInfo[0].wo);
                    const uvs = this.computeUvs(this._contoursInfo[0].wo, anglesMap, topLeftIndex, this._interiorGeometry[0]);
                    this._contoursInfo[0].anglesMap = anglesMap;
                    this._contoursInfo[0].topLeftIndex = topLeftIndex;
                    this._contoursInfo[0].uvs = uvs;

                    var tessGeom = this.tessellate_p1(interiorGeometry[0], uvs);
                    var tessIndices = [];
                    for (i = 0; i < tessGeom.length; i += 5) {
                        var x = tessGeom[i];
                        var y = tessGeom[i + 1];

                        for (var j = 0; j < interiorGeometry[0].length; j += 2) {
                            var px = interiorGeometry[0][j];
                            var py = interiorGeometry[0][j + 1];
                            if (px === x && py === y) {
                                tessIndices.push(j / 2);
                                break;
                            }
                        }
                    }
                    this._contoursInfo[0].iboData = new Uint16Array(tessIndices);

                    var len = Math.floor(interiorGeometry[0].length / 2) * 5;
                    this._contoursInfo[0].vboData = new Float32Array(len);

                    var vboData = this._contoursInfo[0].vboData;
                    var k = 0;
                    for (i = 0; i < vboData.length; i += 5) {
                        vboData[i] = interiorGeometry[k];
                        vboData[i + 1] = interiorGeometry[k + 1];
                        vboData[i + 2] = 0;
                        vboData[i + 3] = uvs[k];
                        vboData[i + 4] = uvs[k + 1];
                        k += 2;
                    }

                    this._contoursPrepered = true;
                }
                else {

                }
                //this._contoursPrepered = true;
            }
            this.renderTexture(dc, {
                points: interiorGeometry[0],
                tileWidth,
                tileHeight,
                xScale,
                yScale,
                dx,
                dy,
            });
        }
        else {
            this.renderColor(dc, {
                tileWidth,
                tileHeight,
                xScale,
                yScale,
                dx,
                dy,
                drawInterior,
                interiorColor: attributes.interiorColor,
                drawOutline,
                outlineColor: attributes.outlineColor,
            });
            this._contoursPrepered = true;
        }

        if (dc.pickingMode) {
            var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
                null, this.layer, false);
            dc.resolvePick(po);
        }
    }

    renderColor(dc, {tileWidth, tileHeight, xScale, yScale, dx, dy, drawInterior, interiorColor}) {
        if (!this.tessGeom) {
            this.tessGeom = this.tessellate(this._interiorGeometry);
            this.tessTris = new Float32Array(this.tessGeom.length);
        }

        if (!this.wo) {
            const interiorGeometry = this.mapGeometry(this._interiorGeometry, xScale, yScale, dx, dy);
            this.wo = this.windingOrder_all(interiorGeometry[0]);
        }

        const gl = dc.currentGlContext;
        const program = dc.findAndBindProgram(ScreenColorProgram);
        program.loadResolution(gl, tileWidth, tileHeight);
        gl.enableVertexAttribArray(0);

        if (drawInterior) {
            program.loadColor(gl, dc.pickingMode ? this.pickColor : interiorColor);

            for (var i = 0; i < this.tessGeom.length; i += 3) {
                var x = this.tessGeom[i];
                var y = this.tessGeom[i + 1];
                this.tessTris[i] = x * Angle.RADIANS_TO_DEGREES * xScale + dx;
                this.tessTris[i + 1] = y * Angle.RADIANS_TO_DEGREES * yScale + dy;
                this.tessTris[i + 2] = 0;
            }

            this.bindInteriorVbo(dc, this.tessTris, null);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

            if (this.wo === 'CW') {
                gl.frontFace(gl.CW);
            }
            gl.drawArrays(gl.TRIANGLES, 0, Math.floor(this.tessTris.length / 3));

            if (this.wo === 'CW') {
                gl.frontFace(gl.CCW);
            }
        }

        //if (drawOutline || true) {
        /*program.loadColor(gl, attributes.outlineColor);
        this.bindOutlineVbo(dc, new Float32Array(outlineGeometry[0]), null);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, Math.floor(outlineGeometry[0].length / 2));*/
        //}
    }

    renderTexture(dc, {points, tileWidth, tileHeight, xScale, yScale, dx, dy, anglesMap, topLeftIndex}) {

        var vboData = this._contoursInfo[0].vboData;
        var k = 0;
        for (var i = 0; i < vboData.length; i += 5) {
            vboData[i] = points[k];
            vboData[i + 1] = points[k + 1];
            k += 2;
        }

        const gl = dc.currentGlContext;
        const program = dc.findAndBindProgram(ScreenTextureProgram);
        program.loadResolution(gl, tileWidth, tileHeight);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        program.loadTextureUnit(gl, gl.TEXTURE0);
        const imageTextureKey = this._imageUUID || this._image.src;
        if (!imageTextureKey) {
            console.error('TexturedSurfaceShape, no uuid for image. Use shape.imageUUID to set a unique id');
        }
        let imageTexture = dc.gpuResourceCache.resourceForKey(imageTextureKey);

        if (!imageTexture) {
            imageTexture = new Texture(gl, this._image, null, true);
            dc.gpuResourceCache.putResource(imageTextureKey, imageTexture, imageTexture.size);
        }

        imageTexture.bind(dc);

        this.bindInteriorVbo(dc, vboData, null);
        this.bindInteriorIbo(dc, this._contoursInfo[0].iboData, null);
        /*var buf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._contoursInfo[0].iboData, gl.STATIC_DRAW);*/
        const valuesPerVertex = 3 + 2; //3 values for position and 2 values for uvs
        const sizeOfFloat32 = 4;
        const vertexSize = valuesPerVertex * sizeOfFloat32;

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, vertexSize, 0);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, vertexSize, 3 * sizeOfFloat32);

        if (this._contoursInfo[0].wo === 'CW') {
            gl.frontFace(gl.CW);
        }

        gl.drawElements(gl.TRIANGLES, this._contoursInfo[0].iboData.length, gl.UNSIGNED_SHORT, 0);

        //gl.drawArrays(gl.TRIANGLES, 0, Math.floor(this._contoursInfo[0].tessTris.length / 5));
        //gl.drawArrays(gl.POINTS, 0,  Math.floor(this.tessTris.length / 5));
        /*for (var i =0 ; i < this.tessTris.length; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        }*/

        if (this._contoursInfo[0].wo === 'CW') {
            gl.frontFace(gl.CCW);
        }

        gl.disableVertexAttribArray(1);
    }

    computeUvs(wo, anglesMap, topLeftIndex, locations1) {
        const locations = locations1.slice();
        locations.pop();
        var uvs = new Float32Array(locations.length * 2);
        var side = '';

        for (var i = topLeftIndex; i < locations.length + topLeftIndex; i++) {
            var index = i % locations.length;
            var uv = {s: -1, t: -1};

            if (anglesMap[index]) {
                //is corner
                side = this.nextSide(side, wo);

                var sideStart = locations[index];
                var sideEnd = null;
                for (var j = i + 1; j < locations.length + topLeftIndex; j++) {
                    var jIndex = j % locations.length;
                    if (anglesMap[jIndex] != null) {
                        sideEnd = locations[jIndex];
                        break;
                    }
                }
                if (!sideEnd) {
                    sideEnd = locations[topLeftIndex];
                }
                var sideDistance = Location.greatCircleDistance(sideStart, sideEnd) * WGS84_SEMI_MAJOR_AXIS;
            }

            var distance = Location.greatCircleDistance(sideStart, locations[index]) * WGS84_SEMI_MAJOR_AXIS;

            if (wo === 'CW') {
                if (side === 'top') {
                    uv.s = distance / sideDistance;
                    uv.t = 0;
                }
                else if (side === 'right') {
                    uv.s = 1;
                    uv.t = distance / sideDistance;
                }
                else if (side === 'bottom') {
                    uv.s = 1 - distance / sideDistance;
                    uv.t = 1;
                }
                else if (side === 'left') {
                    uv.s = 0;
                    uv.t = 1 - distance / sideDistance;
                }
            }
            else {
                if (side === 'left') {
                    uv.s = 0;
                    uv.t = distance / sideDistance;
                }
                else if (side === 'bottom') {
                    uv.s = distance / sideDistance;
                    uv.t = 1;
                }
                else if (side === 'right') {
                    uv.s = 1;
                    uv.t = 1 - distance / sideDistance;
                }
                else if (side === 'top') {
                    uv.s = 1 - distance / sideDistance;
                    uv.t = 0;
                }
            }

            uvs[index * 2] = uv.s;
            uvs[index * 2 + 1] = uv.t;
        }

        return uvs;
    }

    nextSide(side, wo) {
        var nextSide = '';
        if (wo === 'CW') {
            nextSide = 'top';
            if (side === 'top') {
                nextSide = 'right';
            }
            else if (side === 'right') {
                nextSide = 'bottom';
            }
            else if (side === 'bottom') {
                nextSide = 'left';
            }
            else if (side === 'left') {
                nextSide = 'top';
            }
        }
        else {
            nextSide = 'left';
            if (side === 'left') {
                nextSide = 'bottom';
            }
            else if (side === 'bottom') {
                nextSide = 'right';
            }
            else if (side === 'right') {
                nextSide = 'top';
            }
            else if (side === 'top') {
                nextSide = 'left';
            }
        }

        return nextSide;
    }

    mapGeometry(contours, xScale, yScale, dx, dy) {
        return contours.map(contour => {
            return contour.reduce((acc, location) => {
                const x = location.longitude * xScale + dx;
                const y = location.latitude * yScale + dy;
                acc.push(x, y);
                return acc;
            }, []);
        });
    }

    bindInteriorVbo(dc, vboData, vboUsage) {
        vboUsage = vboUsage || dc.currentGlContext.STATIC_DRAW;
        if (!this._interiorVboCacheKey) {
            this._interiorVboCacheKey = dc.gpuResourceCache.generateCacheKey();
        }

        this.bindVbo(dc, vboData, vboUsage, this._interiorVboCacheKey);
    }

    bindOutlineVbo(dc, vboData, vboUsage) {
        vboUsage = vboUsage || dc.currentGlContext.STATIC_DRAW;
        if (!this._outlineVboCacheKey) {
            this._outlineVboCacheKey = dc.gpuResourceCache.generateCacheKey();
        }

        this.bindVbo(dc, vboData, vboUsage, this._outlineVboCacheKey);
    }

    bindVbo(dc, vboData, vboUsage, cacheKey) {
        const gl = dc.currentGlContext;

        let vbo = dc.gpuResourceCache.resourceForKey(cacheKey);
        const vboEntry = dc.gpuResourceCache.entries.entries[cacheKey];
        let vboSize = 0;
        if (vboEntry) {
            vboSize = vboEntry.size;
        }
        if (!vbo || vboSize < vboData.length * vboData.BYTES_PER_ELEMENT) {
            vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, vboData, vboUsage);
            dc.gpuResourceCache.putResource(cacheKey, vbo, vboData.length * vboData.BYTES_PER_ELEMENT);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, vboData);
        }
    }

    bindInteriorIbo(dc, iboData, iboUsage) {
        iboUsage = iboUsage || dc.currentGlContext.STATIC_DRAW;
        if (!this._interiorIboCacheKey) {
            this._interiorIboCacheKey = dc.gpuResourceCache.generateCacheKey();
        }

        this.bindIbo(dc, iboData, iboUsage, this._interiorIboCacheKey);
    }

    bindIbo(dc, iboData, iboUsage, cacheKey) {
        const gl = dc.currentGlContext;

        let ibo = dc.gpuResourceCache.resourceForKey(cacheKey);
        const vboEntry = dc.gpuResourceCache.entries.entries[cacheKey];
        let iboSize = 0;
        if (vboEntry) {
            iboSize = vboEntry.size;
        }
        if (!ibo || iboSize < iboData.length * iboData.BYTES_PER_ELEMENT) {
            ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iboData, iboUsage);
            dc.gpuResourceCache.putResource(cacheKey, ibo, iboData.length * iboData.BYTES_PER_ELEMENT);
        }
        else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        }
    }

    tessellate_p(points, uvs) {
        var tess = TexturedSurfaceShape.tesselator();
        var triangles = [];

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, function (prim) {
            if (prim !== libtess.primitiveType.GL_TRIANGLES) {
                console.error('Tessellation error, primitive is not TRIANGLES.');
            }
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, function (coords, data, weight) {
            var newCoords = [coords[0], coords[1], coords[2]];

            if (uvs && uvs.length) {
                for (var i = 3; i <= 4; i++) {
                    var value = 0;
                    for (var w = 0; w < 4; w++) {
                        if (weight[w] > 0) {
                            value += weight[w] * data[w][i];
                        }
                    }

                    newCoords[i] = value;
                }
            }

            return newCoords;
        });

        //prevents triangle fans and strips
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function () {
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function (data, tris) {
            tris.push(data[0]);
            tris.push(data[1]);
            tris.push(data[2]);

            if (uvs && uvs.length) {
                tris.push(data[3]);
                tris.push(data[4]);
            }
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function (errno) {
            console.error('tess err', errno);
        });

        tess.gluTessBeginPolygon(triangles);
        tess.gluTessBeginContour();

        var k = 0;
        for (var i = 0; i < points.length; i++) {

            var vertex = [points[i].x, points[i].y, 0];
            if (uvs && uvs.length) {
                vertex.push(uvs[k], uvs[k + 1]);
                k += 2;
            }

            tess.gluTessVertex(vertex, vertex);
        }

        tess.gluTessEndContour();
        tess.gluTessEndPolygon();

        return triangles;
    }

    tessellate_p1(points, uvs) {
        var tess = TexturedSurfaceShape.tesselator();
        var triangles = [];

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, function (prim) {
            if (prim !== libtess.primitiveType.GL_TRIANGLES) {
                console.error('Tessellation error, primitive is not TRIANGLES.');
            }
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, function (coords, data, weight) {
            var newCoords = [coords[0], coords[1], coords[2]];

            if (uvs && uvs.length) {
                for (var i = 3; i <= 4; i++) {
                    var value = 0;
                    for (var w = 0; w < 4; w++) {
                        if (weight[w] > 0) {
                            value += weight[w] * data[w][i];
                        }
                    }

                    newCoords[i] = value;
                }
            }

            return newCoords;
        });

        //prevents triangle fans and strips
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function () {
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function (data, tris) {
            tris.push(data[0]);
            tris.push(data[1]);
            tris.push(data[2]);

            if (uvs && uvs.length) {
                tris.push(data[3]);
                tris.push(data[4]);
            }
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function (errno) {
            console.error('tess err', errno);
        });

        tess.gluTessBeginPolygon(triangles);
        tess.gluTessBeginContour();

        var k = 0;
        for (var i = 0; i < points.length; i += 2) {

            var vertex = [points[i], points[i + 1], 0];
            if (uvs && uvs.length) {
                vertex.push(uvs[k], uvs[k + 1]);
                k += 2;
            }

            tess.gluTessVertex(vertex, vertex);
        }

        tess.gluTessEndContour();
        tess.gluTessEndPolygon();

        return triangles;
    }

    tessellate(contours, uvs) {
        var tess = TexturedSurfaceShape.tesselator();
        var triangles = [];

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, function (prim) {
            if (prim !== libtess.primitiveType.GL_TRIANGLES) {
                console.error('Tessellation error, primitive is not TRIANGLES.');
            }
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, function (coords, data, weight) {
            var newCoords = [coords[0], coords[1], coords[2]];

            if (uvs && uvs.length) {
                for (var i = 3; i <= 4; i++) {
                    var value = 0;
                    for (var w = 0; w < 4; w++) {
                        if (weight[w] > 0) {
                            value += weight[w] * data[w][i];
                        }
                    }

                    newCoords[i] = value;
                }
            }

            return newCoords;
        });

        //prevents triangle fans and strips
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function () {
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function (data, tris) {
            tris.push(data[0]);
            tris.push(data[1]);
            tris.push(data[2]);

            if (uvs && uvs.length) {
                tris.push(data[3]);
                tris.push(data[4]);
            }
        });

        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function (errno) {
            console.error('tess err', errno);
        });

        // Tessellate the polygon.
        tess.gluTessBeginPolygon(triangles);
        var k = 0;
        for (var i = 0; i < contours.length; i++) {
            tess.gluTessBeginContour();
            var contour = contours[i];
            for (var j = 0; j < contour.length; j += 1) {
                var pos = contour[j];
                var x = pos.longitude * Angle.DEGREES_TO_RADIANS;
                var y = pos.latitude * Angle.DEGREES_TO_RADIANS;
                var vertex = [x, y, 0];
                if (uvs && uvs.length) {
                    vertex.push(uvs[k], uvs[k + 1]);
                    k += 2;
                }
                //console.log('vertex', vertex);
                tess.gluTessVertex(vertex, vertex);
            }
            tess.gluTessEndContour();
        }
        tess.gluTessEndPolygon();

        return triangles;
    }

    getBbox(points) {
        const bbox = {
            minX: Number.MAX_SAFE_INTEGER,
            maxX: Number.MIN_SAFE_INTEGER,
            minY: Number.MAX_SAFE_INTEGER,
            maxY: Number.MIN_SAFE_INTEGER,
            width: 0,
            height: 0
        };

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            bbox.minX = Math.min(bbox.minX, point.x);
            bbox.maxX = Math.max(bbox.maxX, point.x);
            bbox.minY = Math.min(bbox.minY, point.y);
            bbox.maxY = Math.max(bbox.maxY, point.y);
        }

        bbox.width = Math.abs(bbox.maxX - bbox.minX);
        bbox.height = Math.abs(bbox.maxY - bbox.minY);

        return bbox;
    }

    getCorners(points, wo) {
        if (points.length === 4) {
            //return this.reindexCorners(points);
        }

        var angles = [];
        for (var i = 0; i < points.length; i += 2) {
            var prevX;
            var prevY;
            var currentX;
            var currentY;
            var nextX;
            var nextY;

            if (i === 0) {
                prevX = points[points.length - 2];
                prevY = points[points.length - 1];
            }
            else {
                prevX = points[i - 2];
                prevY = points[i - 1];
            }

            currentX = points[i];
            currentY = points[i + 1];

            if (i === points.length - 2) {
                nextX = points[0];
                nextY = points[1];
            }
            else {
                nextX = points[i + 2];
                nextY = points[i + 3];
            }

            var angle = Math.atan2(nextY - currentY, nextX - currentX) -
                Math.atan2(prevY - currentY, prevX - currentX);

            angles.push({
                index: i / 2,
                angle: Math.abs(angle) * Angle.RADIANS_TO_DEGREES
            });
        }

        angles = angles.filter(el => {
            if (el.angle < 170 || el.angle > 190) {
                return true;
            }
            return false;
        });

        /*var p0 = points[angles[0].index];
        var p1 = points[angles[1].index];
        var p2 = points[angles[2].index];
        var p3 = points[angles[3].index];*/

        var p0 = {x: points[angles[0].index * 2], y: points[angles[0].index * 2 + 1], index: angles[0].index};
        var p1 = {x: points[angles[1].index * 2], y: points[angles[1].index * 2 + 1], index: angles[1].index};
        var p2 = {x: points[angles[2].index * 2], y: points[angles[2].index * 2 + 1], index: angles[2].index};
        var p3 = {x: points[angles[3].index * 2], y: points[angles[3].index * 2 + 1], index: angles[3].index};

       /* p0.index = angles[0].index;
        p1.index = angles[1].index;
        p2.index = angles[2].index;
        p3.index = angles[3].index;*/

        //const corners = this.reindexCorners([p0, p1, p2, p3]);
        const corners = this.findWhichCorners([p0, p1, p2, p3]);
        const topLeftIndex = corners[0].index;

        /*const newPoints = [];
        const topLeftIndex = corners[0].index;
        for (i = topLeftIndex; i < points.length + topLeftIndex; i++) {
            newPoints.push(points[i % points.length]);
        }*/

        var anglesMap = angles.reduce((map, el) => {
            var type = '';
            var i = corners.findIndex(c => c.index === el.index);
            if (wo === 'CW') {
                if (i === 0) {
                    type = 'tl';
                }
                else if (i === 1) {
                    type = 'tr';
                }
                else if (i === 2) {
                    type = 'br';
                }
                else if (i === 3) {
                    type = 'bl';
                }
            }
            else {
                if (i === 0) {
                    type = 'tl';
                }
                else if (i === 1) {
                    type = 'bl';
                }
                else if (i === 2) {
                    type = 'br';
                }
                else if (i === 3) {
                    type = 'tr';
                }
            }
            map[el.index] = type;
            return map;
        }, Object.create(null));

        return {anglesMap, topLeftIndex};
    }

    findWhichCorners(corners) {
        const userProps = this.userProperties;
        if (userProps && userProps.identifier) {
            var id = userProps.identifier;
            //id = "S3A_OL_1_ERR____20190110T190220_20190110T194614_20190110T211413_2634_040_113______SVL_O_NR_002.SEN3"
            if (id.indexOf('S3') === 0 && id.indexOf('OL_1_ERR___') !== -1) {
                //these shapes span from pole to pole and became twisted in 2D
                var geom = this._interiorGeometry[0];
                var cornerLocations = corners.map(c => {
                    var location = geom[c.index];
                    return {latitude: location.latitude, longitude: location.longitude, index: c.index};
                });
                cornerLocations.sort((a, b) => a.latitude - b.latitude);
                cornerLocations.length = 2;
                var c0 = cornerLocations[0];
                var c1 = cornerLocations[1];
                if ((c0.longitude < 0 && c1.longitude > 0) ||
                    (c0.longitude > 0 && c1.longitude < 0)) {
                    cornerLocations.sort((a, b) => Math.abs(b.longitude) - Math.abs(a.longitude));
                }
                else {
                    cornerLocations.sort((a, b) => Math.abs(a.longitude) - Math.abs(b.longitude));
                }

                var topLeftIndex = corners.findIndex(corner => corner.index === cornerLocations[0].index);
                var newCorners;
                if (topLeftIndex > 0) {
                    newCorners = [];
                    for (var i = topLeftIndex; i < corners.length + topLeftIndex; i++) {
                        newCorners.push(corners[i % corners.length]);
                    }
                }

                return newCorners || corners;
            }
        }

        return this.reindexCorners(corners);
    }

    getCorners_old(points, bbox) {
        if (this.isEqualPoints(points[0], points[points.length - 1])) {
            points.pop();
        }

        if (points.length === 4) {
            return this.reindexCorners(points);
        }

        bbox = bbox || this.getBbox(points);

        var corners = [];
        for (var i = 0; i < points.length - 1; i++) {
            var point = points[i];
            if (point.x === bbox.minX || point.x === bbox.maxX) {
                corners.push(point);
            }
            else if (point.y === bbox.minY || point.y === bbox.maxY) {
                corners.push(point);
            }
        }

        if (corners.length < 4) {
            return corners;
        }

        return this.reindexCorners(corners);
    }

    reindexCorners(corners) {
        //return corners;

        var topLeftIndex = -1;
        var c = corners.slice();
        c.sort((a, b) => b.y - a.y);
        c.length = 2;
        c.sort((a, b) => a.x - b.x);
        topLeftIndex = c[0].index;
        topLeftIndex = corners.findIndex(corner => corner.index === c[0].index);

        //return topLeftIndex;

        var newCorners;
        if (topLeftIndex > 0) {
            newCorners = [];
            for (var i = topLeftIndex; i < corners.length + topLeftIndex; i++) {
                newCorners.push(corners[i % corners.length]);
            }
        }

        return newCorners || corners;
    }

    reindexCorners_old(corners) {
        var topLeftIndex = -1;
        var slope1 = this.getSlope(corners[0], corners[2]);
        if (slope1 > 0) {
            if (corners[0].y < corners[2].y) {
                topLeftIndex = 0;
            }
            else {
                topLeftIndex = 2;
            }
        }
        var slope2 = this.getSlope(corners[1], corners[3]);
        if (slope2 > 0) {
            if (corners[1].y < corners[3].y) {
                if (topLeftIndex !== -1) {
                    console.error('slope method is not ok 1');
                }
                topLeftIndex = 1;
            }
            else {
                if (topLeftIndex !== -1) {
                    console.error('slope method is not ok 2');
                }
                topLeftIndex = 3;
            }
        }

        if (topLeftIndex === -1) {
            console.error('slope method could not determine topLeft');
        }

        var newCorners;
        if (topLeftIndex > 0) {
            newCorners = [];
            for (var i = topLeftIndex; i < corners.length + topLeftIndex; i++) {
                newCorners.push(corners[i % corners.length]);
            }
        }

        return newCorners || corners;
    }

    isEqualPoints(p1, p2) {
        return (
            p1.x === p2.x &&
            p1.y === p2.y
        );
    }

    windingOrder(corners) {
        const e0 = (corners[1].x - corners[0].x) * (corners[1].y + corners[0].y);
        const e1 = (corners[2].x - corners[1].x) * (corners[2].y + corners[1].y);
        const e2 = (corners[3].x - corners[2].x) * (corners[3].y + corners[2].y);
        const e3 = (corners[0].x - corners[3].x) * (corners[0].y + corners[3].y);
        const sum = e0 + e1 + e2 + e3;
        if (sum < 0) {
            return 'CCW';
        }
        return 'CW';
    }

    windingOrder_all(list) {
        let sum = 0;
        for (let i = 0; i < list.length - 2; i += 2) {
            let i1 = (i + 2) % list.length;
            let i0 = i % list.length;
            let p1x = list[i1];
            let p1y = list[i1 + 1];
            let p0x = list[i0];
            let p0y = list[i0 + 1];
            sum += ((p1x - p0x) * (p1y + p0y));
        }
        if (sum < 0) {
            return 'CCW';
        }
        return 'CW';
    }

    getSlope(p1, p2) {
        return (p1.y - p2.y) / (p1.x - p2.x);
    }

    distance2D(p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

}

var a = [
    {latitude: -71.0573, longitude: -119.968}, //TL
    {latitude: -79.6085, longitude: -149.754}, //TR
    {latitude: 55.7391, longitude: 27.7961}, //BR
    {latitude: 58.487, longitude: 6.61523}, //BL
];

var b = [
    {latitude: -70.6695, longitude: -54.5441}, //TL
    {latitude: -79.8964, longitude: -85.1012}, //TR
    {latitude: 55.9681, longitude: 91.5418}, //BR
    {latitude: 58.7238, longitude: 70.2286}, //BL
];