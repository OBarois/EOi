/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports GeoJSONParser
 */
import WorldWind from 'webworldwind-esa';
import TexturedSurfacePolygon from '../../wwwxx/textured/TexturedSurfacePolygon'



    const { 
        ArgumentError,
        GeoJSONConstants,
        GeoJSONParser,
        Location ,
        Logger,
        RenderableLayer
              
            } = WorldWind;

        /**
         * Creates a {@link SurfacePolygon} for a Polygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryPolygon} geometry The Polygon geometry object.
         * @param {Object} properties The properties related to the Polygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSONParser.prototype.addRenderablesForPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                var pBoundaries = [];
                for (var boundariesIndex = 0, boundaries = geometry.coordinates;
                     boundariesIndex < boundaries.length; boundariesIndex++) {
                    var positions = [];

                    for (var positionIndex = 0, points = boundaries[boundariesIndex];
                         positionIndex < points.length; positionIndex++) {
                        var longitude = points[positionIndex][0],
                            latitude = points[positionIndex][1];
                        //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,
                        var reprojectedCoordinate = this.getReprojectedIfRequired(
                            latitude,
                            longitude,
                            this.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }
                    pBoundaries.push(positions);
                }

                    var shape;
                    shape = new TexturedSurfacePolygon(
                        pBoundaries,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.name) {
                        shape.displayName = configuration.name;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    if (configuration && configuration.timeRange) {
                        shape.timeRange = configuration.timeRange;
                    }
                    layer.addRenderable(shape);
            }
        };

        GeoJSONParser.prototype.load = function (parserCompletionCallback, shapeConfigurationCallback, layer) {
            if (parserCompletionCallback) {
                this._parserCompletionCallback = parserCompletionCallback;
            }
            if (shapeConfigurationCallback) {
                this._shapeConfigurationCallback = shapeConfigurationCallback;
            }
            this._layer = layer || new RenderableLayer();
            var dataSourceType = (typeof this.dataSource);
            if (dataSourceType === 'string') {
                var obj = GeoJSONParser.tryParseJSONString(this.dataSource);
                if (obj !== null) {
                    this.handle(obj);
                } else {
                    this.requestUrl(this.dataSource);
                }
            } else if (dataSourceType === 'object') {
                this.handle(this.dataSource);
            } else {
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "load",
                    "Unsupported data source type: " + dataSourceType);
            }
        };



        GeoJSONParser.prototype.addRenderablesForMultiPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                        "missingLayer"));
            }
            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                        "missingGeometry"));
            }
            var configuration = this.shapeConfigurationCallback(geometry, properties);
            if (!this.crs || this.crs.isCRSSupported()) {
                for (var polygonsIndex = 0, polygons = geometry.coordinates;
                     polygonsIndex < polygons.length; polygonsIndex++) {
                    var boundaries = [];
                    for (var boundariesIndex = 0; boundariesIndex < polygons[polygonsIndex].length; boundariesIndex++) {
                        var positions = [];
                        for (var positionIndex = 0, points = polygons[polygonsIndex][boundariesIndex];
                             positionIndex < points.length; positionIndex++) {
                            var longitude = points[positionIndex][0],
                                latitude = points[positionIndex][1];
                            //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,;
                            var reprojectedCoordinate = this.getReprojectedIfRequired(
                                latitude,
                                longitude,
                                this.crs);
                            var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                            positions.push(position);
                        }
                        boundaries.push(positions);
                    }
                    var shape;
                    shape = new TexturedSurfacePolygon(
                        boundaries,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.name) {
                        shape.displayName = configuration.name;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    if (configuration && configuration.timeRange) {
                        shape.timeRange = configuration.timeRange;
                    }
                    layer.addRenderable(shape);
                }
            }
        };


