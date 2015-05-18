// Joint And Object (JOA) Framework - Version 1.3

    var gl;
	var TextureCount = 1;

    function initGL(canvas)
	{
        try 
		 {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } 
		 catch (e)
		 {
        }
        if (!gl) 
		 {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k)
		 {
            if (k.nodeType == 3)
			 {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment")
		 {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } 
		 else if (shaderScript.type == "x-shader/x-vertex")
		 {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } 
		 else 
		 {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		 {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() 
	{
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		 {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    }

    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

	var rttFramebuffer;
    var rttTexture;

    function mvPushMatrix()
	{
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() 
	{
        if (mvMatrixStack.length == 0) 
		 {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms()
	{
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function degToRad(degrees)
	{
        return degrees * Math.PI / 180;
    }
	
    function initPickBuffer() 
	{
        rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        rttFramebuffer.width = 512;
        rttFramebuffer.height = 512;

        rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, rttTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

    function handleLoadedTexture(texture)
	{
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
	
	function handleCreatingTexture(texture)
	{
		var cB = Math.floor(Math.floor(TextureCount/256)/256);
		var cG = Math.floor((TextureCount - (cB*256*256))/256);
		var cR = TextureCount - (cB*256*256) - (cG*256);
		
		document.getElementById("canvas-secondary").getContext("2d").fillStyle = "rgb("+cR+","+cG+","+cB+")";
		document.getElementById("canvas-secondary").getContext("2d").fillRect (0, 0, 32, 32); 
		TextureCount = TextureCount + 1;
	
		gl.bindTexture(gl.TEXTURE_2D, texture);  
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("canvas-secondary"));  
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);  
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);  
		gl.generateMipmap(gl.TEXTURE_2D);  
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	var PressedKeys = {};
	var KeyEventType = 0;
	var DropTick = 0;

	function ProcessMove(event)
	{
		ProcessMouseEvent("Move",event);
	}
	
	function ProcessDown(event)
	{
		ProcessMouseEvent("Down",event);
	}
	
	function ProcessUp(event)
	{
		ProcessMouseEvent("Up",event);
	}

	function ProcessMouseEvent(state,event)
	{
		var x = event.clientX-parseInt(document.getElementById("canvas-holder").style.left);
		var y = 512-(event.clientY-parseInt(document.getElementById("canvas-holder").style.top));
		
		if(state!="Move")
		{
		
			var PixelColor = new Uint8Array(4);
		
			DropTick = 1;
		
			gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
		
			// Clear GL Surface
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			// Prepare Perspective Transformation
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);

			// Draw All Objects
			mat4.identity(mvMatrix);
			Objects.Draw(1);

			// Read Pixel Color
			gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,PixelColor);
											
			// Return GL Clear To User Colors
			gl.clearColor(Objects.Content("Background.Red"),Objects.Content("Background.Green"),Objects.Content("Background.Blue"),Objects.Content("Background.Alpha"));
						
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			
			try
			{
				ProcessMouse(state,x,y,Objects.FindID((parseInt(PixelColor[0])+(parseInt(PixelColor[1])*255)+(parseInt(PixelColor[2])*255*255))));
			}
			catch(z)
			{
				ProcessMouse(state,x,y,null);
			}
			
			DropTick = 0;
		}
		else
		{
			ProcessMouse(state,x,y);
		}
	}
	
    function KeyDownEvent(event)
	{
	    // alert(event.keyCode);
        PressedKeys[event.keyCode] = true;
		if(KeyEventType>0){ProcessKeys(event.keyCode,1);}
    }

    function KeyUpEvent(event)
	{
        PressedKeys[event.keyCode] = false;
		if(KeyEventType>0){ProcessKeys(event.keyCode,0);}
    }

    function DrawScene()
	{
		if(DropTick==0)
		{
			// Clear GL Surface
			gl.clearColor(Objects.Content("Background.Red"),Objects.Content("Background.Green"),Objects.Content("Background.Blue"),Objects.Content("Background.Alpha"));
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			// Prepare Perspective Transformation
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);

			// Draw All Objects
			mat4.identity(mvMatrix);
			Objects.Draw();
		}
    }

    function Tick()
	{	 
		// Handle Keys
		if(KeyEventType==0){ProcessKeys();}
  
		// Draw World
		DrawScene();
		
		// Perform Animation Changes
		Animate();
		
		// Request Next Tick
		requestAnimFrame(Tick);
    }

    function webGLStart()
	{
		
        var Canvas = document.getElementById("canvas-main");
		
        initGL(Canvas);
        initShaders();		
		initObjects();
		initPickBuffer();
		
		gl.enable(gl.DEPTH_TEST);

	    Canvas.onmousedown = ProcessDown;
        document.onmouseup = ProcessUp;
        document.onmousemove = ProcessMove;	
		document.onkeydown = KeyDownEvent;
		document.onkeyup = KeyUpEvent;

		Tick();
	}
