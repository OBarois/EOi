import WorldWind from 'webworldwind-esa';

const {
    GpuProgram
} = WorldWind;

export default class ScreenColorProgram extends GpuProgram {

    constructor(gl) {
        const vertexShaderSource =
            'attribute vec3 a_position;\n' +

            'uniform vec2 u_resolution;\n' +

            'void main() {\n' +
                // convert the position from pixels to 0.0 to 1.0
            '   vec2 zeroToOne = a_position.xy / u_resolution;\n' +

                // convert from 0->1 to 0->2
            '   vec2 zeroToTwo = zeroToOne * 2.0;\n' +

                // convert from 0->2 to -1->+1 (clipspace)
            '   vec2 clipSpace = zeroToTwo - 1.0;\n' +

            '   gl_Position = vec4(clipSpace, 0, 1);\n' +
            '}';

        const fragmentShaderSource =
            'precision mediump float;\n' +

            'uniform vec4 color;\n' +

            'void main() {\n' +
            '   gl_FragColor = color;\n' +
            '}';

        super(gl, vertexShaderSource, fragmentShaderSource, ['a_position']);

        this.resolutionLocation = this.uniformLocation(gl, 'u_resolution');
        this.colorLocation = this.uniformLocation(gl, 'color');

        this.localCache = {
            resolution: {
                width: null,
                height: null,
            },
            color: {
                r: null,
                g: null,
                b: null,
                a: null,
            },
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

    loadColor(gl, color) {
        const cacheColor = this.localCache.color;
        if (cacheColor.r === color.red &&
            cacheColor.g === color.green &&
            cacheColor.b === color.blue &&
            cacheColor.a === color.alpha) {
            return;
        }
        const a = color.alpha;
        gl.uniform4f(this.colorLocation, color.red * a, color.green * a, color.blue * a, color.alpha);
        cacheColor.r = color.red;
        cacheColor.g = color.green;
        cacheColor.b = color.blue;
        cacheColor.a = color.alpha;
    }

}

ScreenColorProgram.key = 'WorldWindGpuScreenColorProgram';