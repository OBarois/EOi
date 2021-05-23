export default class FramebufferTexture {

    constructor(textureId, width, height) {
        this.textureId = textureId || null;
        this.imageWidth = width;
        this.imageHeight = height;
        this.size = width * height * 4;
        this.originalImageWidth = width;
        this.originalImageHeight = height;
        this.creationTime = new Date();
    }

    bind(dc) {
        dc.currentGlContext.bindTexture(dc.currentGlContext.TEXTURE_2D, this.textureId);
        dc.frameStatistics.incrementTextureLoadCount(1);
        return true;
    }

    dispose(gl) {
        gl.deleteTexture(this.textureId);
        delete this.textureId;
    }

}
