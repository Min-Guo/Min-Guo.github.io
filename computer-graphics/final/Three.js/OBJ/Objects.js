// Joint And Object Framework - Version 1.3

var Current;
var ObjectList = [];
var ObjectListCount = 1;

// This Function Removes Whitespace
function trim(str)
{
   return str.replace(/^\s+|\s+$/g, '');
}

// This Function Scales A List Of Coordinates. The List Is Scaled So That None Of The Dimensions Of The Object Exceed The Given Size Restrictions (sx,sy,sz).
// This Function Also Offsets The Coordinates By (dx,dy,dz). This Is Useful To Move An Object's Pivot Point.
function scale(list,sx,sy,sz,dx,dy,dz)
{
	if((sx==0)&&(sy==0)&&(sz==0)&&(dx==0)&&(dy==0)&&(dz==0))
	{
		return list;
	}
	else
	{
		var factor = 1.0;
		
		if((sx!=0)&&(sy!=0)&&(sz!=0))
		{
			var i=0;
			var minX=9999;
			var maxX=-9999;
			var minY=9999;
			var maxY=-9999;
			var minZ=9999;
			var maxZ=-9999;
			var factor = 1.0;
			
			for(i=0;i<list.length;i=i+3)
			{
				if(list[i+0]<minX){minX=list[i+0];}
				if(list[i+0]>maxX){maxX=list[i+0];}
				if(list[i+1]<minY){minY=list[i+1];}
				if(list[i+1]>maxY){maxY=list[i+1];}
				if(list[i+2]<minZ){minZ=list[i+2];}
				if(list[i+2]>maxZ){maxZ=list[i+2];}
			}
			
			factor = sx/(maxX-minX);
			if((sy/(maxY-minY))<factor){factor=sy/(maxY-minY);}
			if((sz/(maxZ-minZ))<factor){factor=sz/(maxZ-minZ);}

			// alert("x:"+minX+"->"+maxX+",y:"+minY+"->"+maxY+",z:"+minZ+"->"+maxZ);
			// alert("x:"+(sx/(maxX-minX))+",y:"+(sy/(maxY-minY))+",z:"+(sz/(maxZ-minZ)));
		}
			
		for(i=0;i<list.length;i=i+3)
		{
			list[i+0]=(list[i+0]*factor)+dx;
			list[i+1]=(list[i+1]*factor)+dy;
			list[i+2]=(list[i+2]*factor)+dz;		
		}
	
		return list;
	}
	
}

function factor2D(list,fx,fy)
{
	if(((fx==0)&&(fy==0))||((fx==1)&&(fy==1)))
	{
		return list;
	}
	else
	{
		for(i=0;i<list.length;i=i+2)
		{
			list[i+0]=(list[i+0]*fx);
			list[i+1]=(list[i+1]*fy);
		}
		return list;
	}
}

function factor3D(list,fx,fy,fz)
{
	if(((fx==0)&&(fy==0)&&(fz==0))||((fx==1)&&(fy==1)&&(fz==1)))
	{
		return list;
	}
	else
	{
		for(i=0;i<list.length;i=i+3)
		{
			list[i+0]=(list[i+0]*fx);
			list[i+1]=(list[i+1]*fy);
			list[i+2]=(list[i+2]*fz);		
		}
		return list;
	}
}

// Defines The Basic Building Block (ObjectType) Of The JOA Framework
var ObjectType = function(Name,ObjParent)
{
	this.Name=Name;																// Name Property
	this.ID = 0;																// Unique ID for Pick identification
	this.parent=ObjParent;															// Parent Object Reference
	if(ObjParent!="World"){this.path=ObjParent.path+"|"+Name;}else{this.path=Name;}								// Path (Liniage To Root)
	this.children={};															// Children Objects (Accessed Through Provided Function)
	this.contents={};															// Contents Data (Accessed Through Provided FUnctions)
	this.x=0;																// Position X From Parent
	this.y=0;																// Position Y From Parent
	this.z=0;																// Position Z From Parent
	this.rx=0;																// Rotation X From Parent
	this.ry=0;																// Rotation Y From Parent
	this.rz=0;																// Rotation Z From Parent
	
	this.Join = function(name)
	{
	  this.children[name]= new ObjectType(name,this);
	  this.children[name].ID=ObjectListCount;
	  ObjectListCount++;
	  
	  var texture2 = gl.createTexture();			
	  handleCreatingTexture(texture2, this.children[name].ID);
	  this.children[name].contents["ID"] = texture2;

	  Current=this.children[name];

	  return name;
	}

	this.Snap = function(key)
	{
		if(this.children[key]==undefined)
		{
			return undefined;
		}
		delete this.children[key];
		Current=this;
		return key;
	}
	
	this.Rejoin = function(location)
	{
		this.parent.Snap(this.Name);
		var WorkObj = Objects;
		while(location.indexOf(".")>=0)
		{
			WorkObj = WorkObj.Child(location.substring(0,location.indexOf(".")));
			location = location.substring(location.indexOf(".")+1);
		}
		if(location!=""){WorkObj = WorkObj.Child(location);}
		WorkObj.Join(this.Name);
		WorkObj.Child(this.Name).ID = this.ID;		
		WorkObj.Child(this.Name).x=this.x;
		WorkObj.Child(this.Name).y=this.y;
		WorkObj.Child(this.Name).z=this.z;
		WorkObj.Child(this.Name).rx=this.rx;
		WorkObj.Child(this.Name).ry=this.ry;
		WorkObj.Child(this.Name).rz=this.rz;
		for(var items in this.contents)
		{
			WorkObj.Child(this.Name).Content(items,this.contents[items]);
		}
	}

	this.Child = function(key)
	{
		Current=this.children[key];
		return this.children[key];	   
	}
	
	this.Parent = function()
	{
		Current=Current.parent;
		return Current.parent;	   
	}

	this.Path = function()
	{
		return this.path;	   
	}
	
	this.Find = function(key)
	{
		if(key=="Objects")
		{
			return Objects;
		}
		else
		{
			// Search Children
			for(var JoinedChild in this.children)
			{
				if(JoinedChild==key)
				{
					Current = this.Child(JoinedChild);
					return this.Child(JoinedChild);
				}
			}
		
			// Search Children's Children
			var temp;
			for(var JoinedChild in this.children)
			{
				temp = this.Child(JoinedChild).Find(key);
				if(temp!=""){return temp;}
			}

			return "";
		}
			
	}

	this.FindID = function(key)
	{
		// Search Children
		for(var JoinedChild in this.children)
		{
			if(this.Child(JoinedChild).ID==key)
			{
				Current = this.Child(JoinedChild);
				return this.Child(JoinedChild);
			}
		}
		
		// Search Children's Children
		var temp;
		for(var JoinedChild in this.children)
		{
			temp = this.Child(JoinedChild).FindID(key);
			if(temp!=""){return temp;}
		}

		return "";
			
	}
	
	this.List = function(recursive)
	{
		if(recursive==undefined)
		{
			delete ObjectList;
			ObjectListCount = 0;
		}

		// Search Children
		for(var JoinedChild in this.children)
		{
			ObjectList[ObjectListCount++]=JoinedChild;
		}
		
		// Search Children's Children
		var temp;
		for(var JoinedChild in this.children)
		{
			this.Child(JoinedChild).List(1);
		}
		
		return ObjectList;		
	}
	
	this.Content = function(key,item)
	{
	  if(item!=undefined)
	  {
	    if(key=="Vertices")
		{
			this.contents['VertexPosBuffer'] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.contents['VertexPosBuffer']);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item), gl.STATIC_DRAW);
		}
		else if(key=="TextureCoords")
		{
			this.contents['VertexTexturePosBuffer'] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.contents['VertexTexturePosBuffer']);		
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item), gl.STATIC_DRAW);
		}
		else if(key=="VertexIndices")
		{
			this.contents['VertexIndicesBuffer'] = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.contents['VertexIndicesBuffer']);        
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(item), gl.STATIC_DRAW);
			this.contents['VertexIndices.Count']=item.length;
		}
		else if(key.substr(0,8)=="Texture:")
		{
			var texture1 = gl.createTexture();
			texture1.image = new Image();
			texture1.image.onload = function ()
			{
				handleLoadedTexture(texture1);
				Objects.Content(key.replace("Texture:","Texture-"),texture1);				
			}
			texture1.image.src = item;
		}
		else
		{
			this.contents[key]=item;
		}
	  }
	  Current=this;
	  return this.contents[key];
	}
	
	this.Remove = function(key)
	{
		if(this.contents[key]==undefined)
		{
			return undefined;
		}
		delete this.contents[key];
		Current=this;
		return key;
	}
		
	this.Draw = function(style)
	{
        // alert("Drawing "+this.parent.Name+"'s "+this.Name+" ("+this.ID+") At Position ("+this.x+","+this.y+","+this.z+") Rotated ("+this.rx+","+this.ry+","+this.rz+")");
					
        mat4.translate(mvMatrix, [this.x, this.y, this.z]);

        mat4.rotate(mvMatrix, degToRad(this.rx), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(this.ry), [0, 1, 0]);
        mat4.rotate(mvMatrix, degToRad(this.rz), [0, 0, 1]);
		
		if((this.contents['Visible']!=false)&&(this.contents['Visible']!="Children"))
		{
			var WorkObj;
			if(this.contents['Clone']==undefined)
			{
				WorkObj = this;
			}
			else
			{
				var temp = this.contents['Clone'];
				WorkObj = Objects;
				while(temp.indexOf(".")>=0)
				{
					WorkObj = WorkObj.Child(temp.substring(0,temp.indexOf(".")));
					temp = temp.substring(temp.indexOf(".")+1);
				}
				if(temp!=""){WorkObj = WorkObj.Child(temp);}
			}
			
			if(WorkObj.contents['VertexPosBuffer']!=undefined)
			{				
				gl.bindBuffer(gl.ARRAY_BUFFER, WorkObj.contents['VertexPosBuffer']);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
				
				gl.bindBuffer(gl.ARRAY_BUFFER, WorkObj.contents['VertexTexturePosBuffer']);
				gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
				gl.activeTexture(gl.TEXTURE0);
				
				if((style==undefined)||(style==0))
				{
					if(this.contents['Texture']==undefined)
					{
						gl.bindTexture(gl.TEXTURE_2D, Objects.Content("Texture-"+WorkObj.contents['Texture']));
					}
					else
					{
						gl.bindTexture(gl.TEXTURE_2D, Objects.Content("Texture-"+this.contents['Texture']));
					}
				}
				else
				{
					gl.bindTexture(gl.TEXTURE_2D, this.contents["ID"]);
				}
				
				gl.uniform1i(shaderProgram.samplerUniform, 0);
	
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WorkObj.contents['VertexIndicesBuffer']);
		
				setMatrixUniforms();
	
				gl.drawElements(gl.TRIANGLES, WorkObj.contents['VertexIndices.Count'], gl.UNSIGNED_SHORT, 0);
			}
		}
		
		if((this.contents['Visible']!=false)||(this.contents['Visible']=="Children"))
		{
		
			for(var JoinedChild in this.children)
			{
				mvPushMatrix();
				this.children[JoinedChild].Draw(style);
				mvPopMatrix();
			}
		}
	
	}
	
	this.Position = function(x,y,z)
	{
		if((x=="x")||(x=="X"))
		{
			// Delta X
			this.x=this.x+y;
		}
		else if((x=="y")||(x=="Y"))
		{
			// Delta Y
			this.y=this.y+y;
		}
		else if((x=="z")||(x=="Z"))
		{
			// Delta Z
			this.z=this.z+y;
		}
		else if(x!=undefined)
		{
			// Absolute Position (With Respect To Joint)
			this.x=x;
			this.y=y;
			this.z=z;
		}
		return [this.x,this.y,this.z];
	}

	this.Angle = function(x,y,z)
	{
		if((x=="x")||(x=="X"))
		{
			// Delta X
			this.rx=this.rx+y;
		}
		else if((x=="y")||(x=="Y"))
		{
			// Delta Y
			this.ry=this.ry+y;
		}
		else if((x=="z")||(x=="Z"))
		{
			// Delta Z
			this.rz=this.rz+y;
		}
		else if(x!=undefined)
		{
			// Absolute Position (With Respect To Joint)
			this.rx=x;
			this.ry=y;
			this.rz=z;
		}
		return [this.rx,this.ry,this.rz];
	}
		
	this.LoadObjects = function(filename, format, list)
	{
		// list[0] = parent
		// list[1] = name
		// list[2] = texture
		// list[3] = x
		// list[4] = y
		// list[5] = z
		// list[6] = rx
		// list[7] = ry
		// list[8] = rz
		// list[9] = sx
		// list[10] = sy
		// list[11] = sz
		// list[12] = dx
		// list[13] = dy
		// list[14] = dz
		var WorkObj;
		for(var part=0;part<list.length;part=part+4)
		{
			WorkObj = Objects.Find(list[part+0]);
			WorkObj.Join(list[part+1]);
		}
		LoadObjects(filename, format, list);
	}
	
}

var Objects = new ObjectType("Objects","World");