var BodyPart=0;
var SequenceSpeed=1;
var SequencePos=0;
var SequenceDir=SequenceSpeed;
var SequenceOn = true;

function Animate() 
{
  try
  {
   /* To Do: Code For Animation Changes Implemented Here */
   if(SequenceOn == true)
   {
     SequencePos=SequencePos+SequenceDir;
     if(SequencePos<=-30){SequenceDir=SequenceSpeed;}
     if(SequencePos>=30){SequenceDir=-SequenceSpeed;}
     Objects.Child('BodyLower').Child('Body').Child('ArmUpperLeft').Angle("X",-SequenceDir);
     Objects.Child('BodyLower').Child('Body').Child('ArmUpperRight').Angle("X",SequenceDir);
     Objects.Child('BodyLower').Child('LegUpperLeft').Angle("X",SequenceDir);
     Objects.Child('BodyLower').Child('LegUpperRight').Angle("X",-SequenceDir);
	 Objects.Child('BodyLower').Position("Y",(-SequenceDir/10));
   }
  }
  catch(Z)
  {
  }
}

function ProcessKeys(key,state)
{
  try
  {
   /* To Do: Code For Key Press / Release Implemented Here */
	   
   if(key==undefined)
   {
     // Tick Based Keyboard Check (KeyEventType=0)
   }
   else
   {
     // Event Based Keyboard Check (KeyEventType=1)
	 		 
	 if((PressedKeys[16]==true)&&(PressedKeys[17]==true))
	 { 
	    // Move World (When Keys Are Pressed With CTRL And Shift)
		if((key==33)&&(state==1))
		{
			Objects.Position("y",1);
		}
		if((key==34)&&(state==1))
		{
			Objects.Position("y",-1);
		}
		if((key==37)&&(state==1))
		{
			Objects.Position("x",-1);
		}
		if((key==39)&&(state==1))
		{
			Objects.Position("x",1);
		}
		if((key==38)&&(state==1))
		{
			Objects.Position("z",-1);
		}
		if((key==40)&&(state==1))
		{
			Objects.Position("z",1);
		}
	 }
	 else if(PressedKeys[17]==true)
	 {
	    // Rotate World (When Keys Are Pressed With CTRL And No Shift)
		if((key==33)&&(state==1))
		{
			Objects.Angle("z",1);
		}
		if((key==34)&&(state==1))
		{
			Objects.Angle("z",-1);
		}
		if((key==37)&&(state==1))
		{
			Objects.Angle("y",-1);
		}
		if((key==39)&&(state==1))
		{
			Objects.Angle("y",1);
		}
		if((key==38)&&(state==1))
		{
			Objects.Angle("x",-1);
		}
		if((key==40)&&(state==1))
		{
			Objects.Angle("x",1);
		}
	 }
	 else
	 {
	    // Rotate Obejct 
		var WorkName = document.getElementById("BodyPart").innerHTML;
		var WorkObj = Objects.Find(WorkName);
		if((key==33)&&(state==1))
		{
			WorkObj.Angle("z",-1);
		}
		if((key==34)&&(state==1))
		{
			WorkObj.Angle("z",1);
		}
		if((key==37)&&(state==1))
		{
			WorkObj.Angle("y",1);
		}
		if((key==39)&&(state==1))
		{
			WorkObj.Angle("y",-1);
		}
		if((key==38)&&(state==1))
		{
			WorkObj.Angle("x",1);
		}
		if((key==40)&&(state==1))
		{
			WorkObj.Angle("x",-1);
		}			
	 }
	 if((key==109)&&(state==1))
	 {
		var WorkName = document.getElementById("BodyPart").innerHTML;
		var WorkObj = Objects.Find(WorkName);
		WorkObj.Content("Texture",WorkObj.Content("Texture").replace(".Selected",""));
		BodyPart--;
		if(BodyPart<0){BodyPart=ObjectListCount-1;}
		document.getElementById("BodyPart").innerHTML=ObjectList[BodyPart];
		var WorkName = document.getElementById("BodyPart").innerHTML;
		var WorkObj = Objects.Find(WorkName);
		WorkObj.Content("Texture",WorkObj.Content("Texture")+".Selected");
	 }
	 if((key==107)&&(state==1))
	 {
		var WorkName = document.getElementById("BodyPart").innerHTML;
		var WorkObj = Objects.Find(WorkName);
		WorkObj.Content("Texture",WorkObj.Content("Texture").replace(".Selected",""));
		BodyPart++;
		if(BodyPart>=ObjectListCount){BodyPart=0;}
		document.getElementById("BodyPart").innerHTML=ObjectList[BodyPart];
		var WorkName = document.getElementById("BodyPart").innerHTML;
		var WorkObj = Objects.Find(WorkName);
		WorkObj.Content("Texture",WorkObj.Content("Texture")+".Selected");
	 }
	 if((key==65)&&(state==1))
	 {
		if(SequenceOn==true){SequenceOn=false;}else{SequenceOn=true;}
	 }
   }
  }
  catch(z)
  {
  }
}

function ProcessMouse(state,x,y,object)
{
	if((state=="Down")&&(object!=undefined)&&(object!=""))
	{
		var WorkName = document.getElementById("BodyPart").innerHTML;
		var WorkObj = Objects.Find(WorkName);
		var OldTexture = WorkObj.Content("Texture");
		OldTexture = OldTexture.replace(".Selected","");
		WorkObj.Content("Texture",OldTexture);
		document.getElementById("BodyPart").innerHTML=object.Name;
		object.Content("Texture",object.Content("Texture")+".Selected");	
	}
	else if(state=="Down")
	{
	}
	
}
  
function initObjects()
{

	Objects.Content("Background.Red",0.8);
	Objects.Content("Background.Blue",0.8);
	Objects.Content("Background.Green",0.8);
	Objects.Content("Background.Alpha",1.0);

	/* To Do: Code For Object Definition Implemented Here */
		 				
	Objects.Content("Texture:Skin","skin.gif");
	Objects.Content("Texture:Face","Face.gif");
	Objects.Content("Texture:Jacket","Jacket.gif");
	Objects.Content("Texture:Pants","Pants.gif");
	Objects.Content("Texture:Boots","Boots.gif");
	Objects.Content("Texture:Skin.Selected","skin.Selected.gif");
	Objects.Content("Texture:Face.Selected","Face.Selected.gif");
	Objects.Content("Texture:Jacket.Selected","Jacket.Selected.gif");
	Objects.Content("Texture:Pants.Selected","Pants.Selected.gif");
	Objects.Content("Texture:Boots.Selected","Boots.Selected.gif");
	
	Objects.Position(0,16,-95);
	Objects.Angle(0,-35,0);
	
	Objects.LoadObjects("Body - Parts.c","C",
	
							[	"Objects","BodyLower","Pants",{},
								"BodyLower","Body","Jacket",{"Y": -12},
								"Body","Neck","Skin",{"Y": 15},
								"Neck","Head","Face",{"Y":4, "rX": 20},
								"Body","ArmUpperLeft","Jacket",{"X": 9, "Y": 15},
								"ArmUpperLeft","ArmLowerLeft","Jacket",{"Y": -13,"rY": 90, "rZ": -60},
								"ArmLowerLeft","HandLeft","Skin",{"Y": -11, "rY": -90},
								"Objects","HandRight","Skin",{"Y": -11, "rY": -90},
								"BodyLower","LegUpperLeft","Pants",{"X": 5.5, "Y": -19},
								"LegUpperLeft","LegLowerLeft","Pants",{"Y": -11},
								"LegLowerLeft","FootLeft","Boots",{"Y": -10, "dY": 10}
							]
						);

	Objects.Child("BodyLower").Child("Body").Join("ArmUpperRight");
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Content("Clone","BodyLower.Body.ArmUpperLeft");
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Content("Texture","Jacket");
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Position(-9,15,0);
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Angle(0,180,10);

	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Join("ArmLowerRight");
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Child("ArmLowerRight").Content("Clone","BodyLower.Body.ArmUpperLeft.ArmLowerLeft");
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Child("ArmLowerRight").Content("Texture","Jacket");
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Child("ArmLowerRight").Position(0,-13,0);
	Objects.Child("BodyLower").Child("Body").Child("ArmUpperRight").Child("ArmLowerRight").Angle(0,-90,-60);
	
	Objects.Child("HandRight").Rejoin("BodyLower.Body.ArmUpperRight.ArmLowerRight");

	Objects.Child("BodyLower").Join("LegUpperRight");
	Objects.Child("BodyLower").Child("LegUpperRight").Content("Clone","BodyLower.LegUpperLeft");
	Objects.Child("BodyLower").Child("LegUpperRight").Content("Texture","Pants");
	Objects.Child("BodyLower").Child("LegUpperRight").Position(-5.5,-19,0);
	Objects.Child("BodyLower").Child("LegUpperRight").Angle(0,180,0);

	Objects.Child("BodyLower").Child("LegUpperRight").Join("LegLowerRight");
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Content("Clone","BodyLower.LegUpperLeft.LegLowerLeft");
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Content("Texture","Pants");
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Position(0,-11,0);
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Angle(0,180,0);

	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Join("Foot.Right");
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Child("Foot.Right").Content("Clone","BodyLower.LegUpperLeft.LegLowerLeft.FootLeft");
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Child("Foot.Right").Content("Texture","Boots");
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Child("Foot.Right").Position(0,-10,0);
	Objects.Child("BodyLower").Child("LegUpperRight").Child("LegLowerRight").Child("Foot.Right").Angle(0,0,0);
											
	Objects.List();
	ProcessKeys(107,1);
		
	KeyEventType=1; // Event Based Keyboard Processing
}