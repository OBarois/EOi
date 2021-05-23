import FramebufferTexture from './FramebufferTexture';

export default class Framebuffer {

    constructor() {
        this.framebufferId = null;
        this.textureId = null;
        this.width = 0;
        this.height = 0;
        this.texture = null;
    }

    attachTexture(gl, width, height) {
        this.textureId = this.createTexture(gl, width, height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureId, 0);

        /*const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (e !== gl.FRAMEBUFFER_COMPLETE) {
            console.log('bind Error creating framebuffer', e);
            this.framebufferId = null;
            this.textureId = null;
            return false;
        }*/

        this.texture = new FramebufferTexture(this.textureId, width, height);

        return true;
    }

    bind(gl, width, height) {
        if(!this.framebufferId) {
            this.framebufferId = gl.createFramebuffer();
        }

        this.width = width;
        this.height = height;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferId);
        gl.viewport(0, 0, width, height);
    }

    bind_or(gl, width, height) {
        /*if (!this.framebufferId) {
            return false;
        }*/

        if(!this.framebufferId) {
            this.framebufferId = gl.createFramebuffer();
        }

        this.width = width;
        this.height = height;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferId);
        gl.viewport(0, 0, width, height);
        this.textureId = this.createTexture(gl, width, height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureId, 0);

        /*const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (e !== gl.FRAMEBUFFER_COMPLETE) {
            console.log('bind Error creating framebuffer', e);
            this.framebufferId = null;
            this.textureId = null;
            return false;
        }*/

        this.texture = new FramebufferTexture(this.textureId, width, height);

        return true;
    }

    clear(gl) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    unbind(gl, fbo) {
        if (!fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
        else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebufferId);
            gl.viewport(0, 0, fbo.width, fbo.height);

        }
    }

    createTexture(gl, width, height) {
        if (width !== 256) {
            console.log('width', width);
        }
        if (height !== 256) {
            console.log('width', height);
        }
        const textureId = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureId);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        /*var ext = (
            gl.getExtension("EXT_texture_filter_anisotropic") ||
            gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic"));
        if (ext) {
            gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16);
        }*/

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        //gl.generateMipmap(gl.TEXTURE_2D);
        //gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureId, 0);
        return textureId;
    }

}