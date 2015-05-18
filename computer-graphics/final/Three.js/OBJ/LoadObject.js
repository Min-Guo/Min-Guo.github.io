// Joint And Object Framework - Version 1.31
		
	function LoadObjects(filename,format,list)
	{
		// Send LoadObject To The Correct File Format Handler
		if((format==undefined)||(format=="C"))
		{
			// Create New Invisible I-Frame To Read File
			newFrame = document.createElement("iframe");
			newFrame.id = "i-"+filename;    
			newFrame.name = "i-"+filename;
			newFrame.src = filename;
			newFrame.style.display='none';
			newFrame.style.visibility='hidden';
			newFrame.onload = function()
			  {
				LoadObjectsFromFileTypeC(document.getElementById("i-"+filename).contentDocument.body.innerHTML,list);
				document.body.removeChild(document.body.children["i-"+filename]);
			  }
			document.body.appendChild(newFrame);
		}
		else if((format=="JSON"))
		{
			// Create New Invisible I-Frame To Read File
			newFrame = document.createElement("iframe");
			newFrame.id = "i-"+filename;    
			newFrame.name = "i-"+filename;
			newFrame.src = filename;
			newFrame.style.display='none';
			newFrame.style.visibility='hidden';
			newFrame.onload = function()
			  {
				LoadObjectsFromFileTypeJSON(document.getElementById("i-"+filename).contentDocument.body.innerHTML,list);
				document.body.removeChild(document.body.children["i-"+filename]);
			  }
			document.body.appendChild(newFrame);
		}		
		else if((format=="JSON.Simple"))
		{
			// Create New Invisible I-Frame To Read File
			newFrame = document.createElement("iframe");
			newFrame.id = "i-"+filename;    
			newFrame.name = "i-"+filename;
			newFrame.src = filename;
			newFrame.style.display='none';
			newFrame.style.visibility='hidden';
			newFrame.onload = function()
			  {
				LoadObjectsFromFileTypeJSONSimple(document.getElementById("i-"+filename).contentDocument.body.innerHTML,list);
				document.body.removeChild(document.body.children["i-"+filename]);
			  }
			document.body.appendChild(newFrame);
		}		
	}
	
	function LoadObjectsFromFileTypeC(content,list)
	{
		var Part = 0;
		var nextline = "";
						
		while(Part<list.length)
		{	
			// Read File Contents

			var json_content;

			while(content.substring(0,50).indexOf("_coords[] = {")==-1)
			{	
				content = content.substring(content.indexOf("static ")+1);
			}
			content = content.substring(content.indexOf("{")+1);
			json_content = '{ "vertexPositions" : [' + content.substring(0,content.indexOf("}")-2)+"], ";
			while(content.substring(0,50).indexOf("_normals[] = {")==-1)
			{	
				content = content.substring(content.indexOf("static ")+1);
			}
			content = content.substring(content.indexOf("{")+1);
			json_content = json_content + '"vertexNormals" : [' + content.substring(0,content.indexOf("}")-2)+"], ";

			while(content.substring(0,50).indexOf("_texcoords[] = {")==-1)
			{	
				content = content.substring(content.indexOf("static ")+1);
			}
			content = content.substring(content.indexOf("{")+1);
			json_content = json_content + '"vertexTextureCoords" : [' + content.substring(0,content.indexOf("}")-2)+"], ";

			while(content.substring(0,50).indexOf("_indices[] = {")==-1)
			{	
				content = content.substring(content.indexOf("static ")+1);
			}
			content = content.substring(content.indexOf("{")+1);
			json_content = json_content + '"indices" : [' + content.substring(0,content.indexOf("}")-2)+"]}";	

			json_content = JSON.parse(json_content);

			// Post Object Definition To Corresponding Object

			if(list[Part+3].X==undefined){list[Part+3].X=0;}
			if(list[Part+3].Y==undefined){list[Part+3].Y=0;}
			if(list[Part+3].Z==undefined){list[Part+3].Z=0;}
			if(list[Part+3].rX==undefined){list[Part+3].rX=0;}
			if(list[Part+3].rY==undefined){list[Part+3].rY=0;}
			if(list[Part+3].rZ==undefined){list[Part+3].rZ=0;}
			if(list[Part+3].sX==undefined){list[Part+3].sX=0;}
			if(list[Part+3].sY==undefined){list[Part+3].sY=0;}
			if(list[Part+3].sZ==undefined){list[Part+3].sZ=0;}
			if(list[Part+3].dX==undefined){list[Part+3].dX=0;}
			if(list[Part+3].dY==undefined){list[Part+3].dY=0;}
			if(list[Part+3].dZ==undefined){list[Part+3].dZ=0;}
			if(list[Part+3].fX==undefined){list[Part+3].fX=0;}
			if(list[Part+3].fY==undefined){list[Part+3].fY=0;}
			if(list[Part+3].fZ==undefined){list[Part+3].fZ=0;}
			if(list[Part+3].tfX==undefined){list[Part+3].tfX=0;}
			if(list[Part+3].tfY==undefined){list[Part+3].tfY=0;}
			if(list[Part+3].tfZ==undefined){list[Part+3].tfZ=0;}

			obj = Objects.Find(list[Part+1]);
			obj.Content('Vertices', factor3D(scale(json_content.vertexPositions,list[Part+3].sX,list[Part+3].sY,list[Part+3].sZ,list[Part+3].dX,list[Part+3].dY,list[Part+3].dZ),list[Part+3].fX,list[Part+3].fY,list[Part+3].fZ));
			obj.Content('TextureCoords',factor2D(json_content.vertexTextureCoords,list[Part+3].tfX,list[Part+3].tfY,list[Part+3].tfZ));	
			obj.Content('VertexIndices',json_content.indices);
			obj.Content('Texture',list[Part+2]);		
			obj.Position(list[Part+3].X,list[Part+3].Y,list[Part+3].Z);
			obj.Angle(list[Part+3].rX,list[Part+3].rY,list[Part+3].rZ);

			// Prepare For Next Object/Mesh

			Part = Part + 4;
		}
	}

	function LoadObjectsFromFileTypeJSON(content,list)
	{
		content = content.replace("<pre>","");
		content = content.replace("</pre>","");
		content = content.substring(content.indexOf("position_buffer"));
		content = content.substring(content.indexOf("values"));
		content = content.substring(content.indexOf(":")+1);
		json_content = '{ "vertexPositions" : ' + content.substring(0,content.indexOf("]")+1)+", ";
		content = content.substring(content.indexOf("]")+1);
		content = content.substring(content.indexOf("normal_buffer"));
		content = content.substring(content.indexOf("values"));
		content = content.substring(content.indexOf(":")+1);
		json_content = json_content + '"vertexNormals" : ' + content.substring(0,content.indexOf("]")+1)+", ";
		content = content.substring(content.indexOf("]")+1);
		content = content.substring(content.indexOf("texcoord_buffer"));
		content = content.substring(content.indexOf("values"));
		content = content.substring(content.indexOf(":")+1);
		json_content = json_content + '"vertexTextureCoords" : ' + content.substring(0,content.indexOf("]")+1)+", ";
		content = content.substring(content.indexOf("]")+1);
		content = content.substring(content.indexOf("triangles"));
		content = content.substring(content.indexOf("indices"));
		content = content.substring(content.indexOf(":")+1);
		json_content = json_content + '"indices" : ' + content.substring(0,content.indexOf("]")+1)+"}";
		json_content = JSON.parse(json_content);
		obj = Objects.Find(list[1]);
		obj.Content('Vertices', scale(json_content.vertexPositions,list[9],list[10],list[11],list[12],list[13],list[14]));
		obj.Content('TextureCoords',json_content.vertexTextureCoords);
		obj.Content('VertexIndices',json_content.indices);
		obj.Content('Texture',list[2]);		
		obj.Position(list[Part+3],list[Part+4],list[Part+5]);
		obj.Angle(list[Part+6],list[Part+7],list[Part+8]);
	}

	function LoadObjectsFromFileTypeJSONSimple(content,list)
	{
		content = content.replace("<pre>","");
		content = content.replace("</pre>","");
		content = JSON.parse(content);
		obj = Objects.Find(list[1]);
		obj.Content('Vertices', scale(content.vertexPositions,list[9],list[10],list[11],list[12],list[13],list[14]));
		obj.Content('TextureCoords',content.vertexTextureCoords);
		obj.Content('VertexIndices',content.indices);
		obj.Content('Texture',list[2]);		
		obj.Position(list[Part+3],list[Part+4],list[Part+5]);
		obj.Angle(list[Part+6],list[Part+7],list[Part+8]);
	}
