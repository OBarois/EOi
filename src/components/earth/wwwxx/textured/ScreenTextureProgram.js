import WorldWind from 'webworldwind-esa';

const {
    GpuProgram
} = WorldWind;

export default class ScreenTextureProgram extends GpuProgram {

    constructor(gl) {
        const vertexShaderSource =
            'attribute vec3 a_position;\n' +
            'attribute vec2 vertexTexCoord;\n' +

            'uniform vec2 u_resolution;\n' +

            'varying vec2 texCoord;\n' +

            'void main() {\n' +
            // convert the position from pixels to 0.0 to 1.0
            '   vec2 zeroToOne = a_position.xy / u_resolution;\n' +

            // convert from 0->1 to 0->2
            '   vec2 zeroToTwo = zeroToOne * 2.0;\n' +

            // convert from 0->2 to -1->+1 (clipspace)
            '   vec2 clipSpace = zeroToTwo - 1.0;\n' +

            '   gl_Position = vec4(clipSpace, 0, 1);\n' +
            '   gl_PointSize = 3.0;\n' +
            '   texCoord = vertexTexCoord;\n' +
            '}';

        const fragmentShaderSource =
            'precision mediump float;\n' +

            'uniform sampler2D textureSampler;\n' +

            'varying vec2 texCoord;\n' +

            'void main() {\n' +
            '   gl_FragColor = texture2D(textureSampler, texCoord);\n' +
            //'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
            '}';

        super(gl, vertexShaderSource, fragmentShaderSource, ['a_position', 'vertexTexCoord']);

        this.resolutionLocation = this.uniformLocation(gl, 'u_resolution');
        this.texUnitLocation = this.uniformLocation(gl, 'textureSampler');

        this.localCache = {
            resolution: {
                width: null,
                height: null,
            },
            textureUnit: null,
        };
    }

    loadResolution(gl, width, height) {
        if (this.localCache.resolution.width === width && this.localCache.resolution.height === height) {
            return;
        }
        gl.uniform2f(this.resolutionLocation, width, height);
        this.localCache.resolution.width = width;
        this.localCache.resolution.height = height;
    }

    loadTextureUnit(gl, unit) {
        if (this.localCache.textureUnit === unit) {
            return;
        }
        gl.uniform1i(this.texUnitLocation, unit - gl.TEXTURE0);
        this.localCache.textureUnit = unit;
    }

}

ScreenTextureProgram.key = 'WorldWindGpuScreenTextureProgram';