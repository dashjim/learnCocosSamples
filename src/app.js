function trace() {
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var ColorLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        var grossini = new cc.Sprite("res/grossini.png");
        this.addChild(grossini);
        grossini.x = cc.winSize.width/2;
        grossini.y = cc.winSize.height/2;
        grossini.color = cc.color(255, 0, 0);   //red
        grossini.color = cc.color(100, 100, 100);   //darker
        return true;
    }
});

cc.GLNode = cc.GLNode || cc.Node.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    _initRendererCmd:function(){
        this._rendererCmd = new cc.CustomRenderCmdWebGL(this, function(){
            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            cc.kmGLPushMatrix();
            cc.kmGLLoadMatrix(this._stackMatrix);
            this.draw();
            cc.kmGLPopMatrix();
        });
    }
});

var BlueTriangleLayer = cc.Layer.extend({

    ctor:function() {
        this._super();

        if( 'opengl' in cc.sys.capabilities ) {
            var glnode = new cc.GLNode();
            this.addChild(glnode);

            this.shader = cc.shaderCache.getProgram("ShaderPositionColor");
            this.initBuffers();

            glnode.draw = function() {

                this.shader.use();
                this.shader.setUniformsForBuiltins();

                // Draw fullscreen Triangle
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

                gl.bindBuffer(gl.ARRAY_BUFFER, null);

            }.bind(this);

        }
    },

    initBuffers:function() {
        var winSize = cc.winSize;
        var triangleVertexPositionBuffer = this.triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
            winSize.width/2,   winSize.height,
            0,                 0,
            winSize.width,     0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var triangleVertexColorBuffer = this.triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        var colors = [
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
});

var Filter = {

    DEFAULT_VERTEX_SHADER:
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}",

    GRAY_SCALE_FRAGMENT_SHADER:
        "varying vec2 v_texCoord;   \n"
        //+ "uniform sampler2D CC_Texture0; \n"   //cocos2d 3.0jsb 3.1jsb/html5开始自动加入这个属性，不需要手工声明
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114; \n"
        + "    gl_FragColor = vec4(gray,gray,gray, texColor.a);  \n"
        + "}",

    SEPIA_FRAGMENT_SHADER:
        "varying vec2 v_texCoord;   \n"
        + "uniform float u_degree; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    float r = texColor.r * 0.393 + texColor.g * 0.769 + texColor.b * 0.189; \n"
        + "    float g = texColor.r * 0.349 + texColor.g * 0.686 + texColor.b * 0.168; \n"
        + "    float b = texColor.r * 0.272 + texColor.g * 0.534 + texColor.b * 0.131; \n"
        + "    gl_FragColor = mix(texColor, vec4(r, g, b, texColor.a), u_degree);  \n"
        + "}",

    programs:{},

    /**
     * 灰度
     * @param sprite
     */
    grayScale: function (sprite) {
        var program = Filter.programs["grayScale"];
        if(!program){
            program = new cc.GLProgram();
            program.retain();          //jsb需要retain一下，否则会被回收了
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.GRAY_SCALE_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            Filter.programs["grayScale"] = program;
        }
        sprite.shaderProgram = program;
    },


    sepia: function (sprite, degree) {
        var program = Filter.programs["sepia" + degree];
        if (!program) {
            program = new cc.GLProgram();
            program.retain();
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.SEPIA_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            var degreeLocation = program.getUniformLocationForName("u_degree");
            program.setUniformLocationF32(degreeLocation, degree);
            Filter.programs["sepia" + degree] = program;
        }
        sprite.shaderProgram = program;
    }
};

var GrayScaleLayer = cc.Layer.extend({

    ctor:function() {
        this._super();

        if( 'opengl' in cc.sys.capabilities ) {
            var grossini = new cc.Sprite("res/grossini.png");
            this.addChild(grossini);
            grossini.x = cc.winSize.width/2;
            grossini.y = cc.winSize.height/2;
            Filter.grayScale(grossini);
        }
    }
});

var SepiaLayer = cc.Layer.extend({

    ctor:function() {
        this._super();

        if( 'opengl' in cc.sys.capabilities ) {
            var grossini = new cc.Sprite("res/grossini.png");
            this.addChild(grossini);
            grossini.x = cc.winSize.width/2;
            grossini.y = cc.winSize.height/2;
            Filter.sepia(grossini, 0.9);
        }
    }
});


var BlendLayer = cc.Layer.extend({

    ctor:function() {
        this._super();

        var bg = new cc.LayerColor(cc.color(100,100,100));
        this.addChild(bg, 1);

        var grossini = new cc.Sprite("res/grossini.png");
        this.addChild(grossini, 2);
        grossini.x = cc.winSize.width/2;
        grossini.y = cc.winSize.height/2;

        var light = new cc.LayerColor(cc.color(255,255,255), grossini.width, grossini.height);
        this.addChild(light, 3);
        light.x = cc.winSize.width/2 - grossini.width/2;
        light.y = cc.winSize.height/2 - grossini.height/2;
        light.setBlendFunc(cc.DST_COLOR, cc.ONE);
    }
});


var BlendLayer2 = cc.Layer.extend({

    ctor:function() {
        this._super();

        var bg = new cc.LayerColor(cc.color(100,100,100));
        this.addChild(bg, 1);

        var grossini = new cc.Sprite("res/grossini.png");
        this.addChild(grossini, 2);
        grossini.x = cc.winSize.width/2;
        grossini.y = cc.winSize.height/2;

        var light = new cc.Sprite("res/mask.png");
        this.addChild(light, 3);
        light.scale = 4;
        light.x = grossini.x;
        light.y = grossini.y + 40;
        light.setBlendFunc(cc.DST_COLOR, cc.SRC_ALPHA);
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
//        var layer = new ColorLayer();
//        var layer = new BlueTriangleLayer();
//        var layer = new GrayScaleLayer();
//        var layer = new SepiaLayer();
//        var layer = new BlendLayer();
        var layer = new BlendLayer2();
        this.addChild(layer);
    }
});