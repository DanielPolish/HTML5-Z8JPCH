var getterWorker = null;
var scale = 1;
var mapImage = null;
var planes2
var mouseDown = false;
var mapOffsetX = 0;
var mapOffsetY = 0; 

function StartMapManager(gameID) {
	if (getterWorker == null) {
		getterWorker = new Worker("PlaneGetterWorker.js", {name: gameID});
	}
	getterWorker.onmessage = function(event){
		//var fakeResp = "3;-10.5224:-0.36728:-36.9204;3.393:198.3:359.9;5.5563:-0.005:16.742;0.070:-0.00:-0.02;20;255:0:0:863:458;231:231:231:875:134;0;1|1297|x+4;225.2312:-0.09582:-71.4617;0.109:0.004:0.003;0.0002:-0.000:0;0:0:-0.00;0;255:255:255:859:154;0:104:198:870:241;0;1|4255695|x+4;267.0292:-0.09582:-71.4616;0.109:-0.00:0.003;0.0002:-0.000:0;0:0:-0.00;0;255:255:255:859:154;0:104:198:870:241;0;1|4255689|x+x|6583291|x+x|6583291|x+x|6583291|x+x|6583291|x";
    	
		GetPlanesCallback(event.data);
	};
	
	
	this.scale = 1;
	this.mouseDown = false;
	this.mapOffsetX = 0;
	this.mapOffsetY = 0; 
	var mapImage = document.getElementById("mapImage");
	  mapImage.style.transform = "scale("+scale+")";
	mapImage.style.left = mapOffsetX+"%";
	mapImage.style.top = mapOffsetY+"%";
}

function StopMapManager() {
	if (getterWorker != null) {
		getterWorker.terminate();
	}
	
	getterWorker = null;
}



function GetPlanesCallback(planes) {
	
	var gamelist = document.getElementById("gamename");
	//gamelist.innerHTML = "GetPlanesCallback";
	
	
	if (planes != null && planes.length >= 1) {
		planes2 = planes;
		for (i = 0; i < planes.length; i++) {
			var plane = planes[i];
			
			if (plane != null && plane.InactiveTime < 5) {
			
				var planeTransform = document.getElementById("planeTransform"+i+"");
					//plane.innerHTML = plane.Position;
				var xpos = ((((plane.Position.x - 3036) / 19500) + 0.5) - 0.5) * scale + 0.5 + mapOffsetX / 100;
				var ypos = (((-(plane.Position.z - 436) / 13000) + 0.5) - 0.5) * scale + 0.5 + mapOffsetY / 100;
				//gamelist.innerHTML = xpos;
				
				planeTransform.style.left = (xpos * 100) + "%";
				planeTransform.style.top = (ypos * 100) + "%";
				
				var imageContainer = document.getElementById("planeImageContainer"+i+"");
				imageContainer.style.transform = "rotate(" + (plane.Rotation.y + 180) + "deg)";
				
				var planeImage = document.getElementById("planeImage"+i+"");
				planeImage.setAttribute("src", "planes/plane" + plane.Type + ".png");
				
				var planeColElement = document.getElementById("planeColor"+i+"_0");
				planeColElement.setAttribute("src", "planes/plane" + plane.Type + "_mat0.png");
				var rgbCol = plane.Colors[0];
				hslCol = RGBToHSL(rgbCol);
				var brightness = hslCol.l * (1 - rgbCol.metallic * 0.5);
				planeColElement.style.filter = "hue-rotate(" + hslCol.h + "deg) saturate(" + hslCol.s + "%) brightness(" + hslCol.l + ")";
				
				planeColElement = document.getElementById("planeColor"+i+"_1");
				planeColElement.setAttribute("src", "planes/plane" + plane.Type + "_mat1.png");
				rgbCol = plane.Colors[1];
				hslCol = RGBToHSL(rgbCol);
				brightness = hslCol.l * (1 - rgbCol.metallic * 0.5);
				planeColElement.style.filter = "hue-rotate(" + hslCol.h + "deg) saturate(" + hslCol.s + "%) brightness(" + hslCol.l + ")";
				//gamelist.innerHTML = "hue-rotate(" + hslCol.h + "deg) saturate(" + hslCol.s + "%) brightness(" + hslCol.l + ")";
			} else {
				var planeTransform = document.getElementById("planeTransform"+i+"");
				
				planeTransform.style.left = "500%";
				planeTransform.style.top = "500%";
			}
		
		}
	}
	
}

function ScaleMap(event) {
	  event.preventDefault();
	  var oldScale = scale;
	  
	  scale *=  Math.pow(1.001, -event.deltaY);
	  
	  // Restrict scale
	  scale = Math.min(Math.max(1, scale), 16);
	  var scaleMul = scale / oldScale;

	  // Apply scale transform
	  var mapImage = document.getElementById("mapImage");
	  mapImage.style.transform = "scale("+scale+")";
	  var mapID = mapImage.getAttribute("src")[5];
	  if (scale < 4) {
		  mapImage.setAttribute("src", "maps/"+mapID+"_ld.jpg");
	  } else {
		  mapImage.setAttribute("src", "maps/"+mapID+"_md.jpg");
	  }
	  
	  
	  mapOffsetX *= scale == 1 ? 0 : scaleMul;
	  mapOffsetY *= scale == 1 ? 0 : scaleMul;
	  mapImage.style.left = mapOffsetX+"%";
	  mapImage.style.top = mapOffsetY+"%";
		GetPlanesCallback(planes2);
}

function MouseDownOnMap(event) {
	mouseDown = true;
}

function MouseUpOnMap(event) {
	mouseDown = false;
}

function MouseLeavesMap(event) {
	mouseDown = false;
//	console.log("mouseLeave");
}

function MouseMoveOnMap(event) {
	if (mouseDown) {
		mapOffsetX += event.movementX / 10;
		mapOffsetY += event.movementY / 10;
		var mapImage = document.getElementById("mapImage");
		mapImage.style.left = mapOffsetX+"%";
		mapImage.style.top = mapOffsetY+"%";
//		console.log("mouseMove");
		GetPlanesCallback(planes2);
	}
	
}

function RGBToHSL(color) {
	  // Make r, g, and b fractions of 1
	  var r = color.r;
	  var g = color.g;
	  var b = color.b;

	  // Find greatest and smallest channel values
	  let cmin = Math.min(r,g,b),
	      cmax = Math.max(r,g,b),
	      delta = cmax - cmin,
	      h = 0,
	      s = 0,
	      l = 0;
	  
	// Calculate hue
	  // No difference
	  if (delta == 0)
	    h = 0;
	  // Red is max
	  else if (cmax == r)
	    h = ((g - b) / delta) % 6;
	  // Green is max
	  else if (cmax == g)
	    h = (b - r) / delta + 2;
	  // Blue is max
	  else
	    h = (r - g) / delta + 4;

	  h = Math.round(h * 60);
	    
	  // Make negative hues positive behind 360°
	  if (h < 0)
	      h += 360;
	  
	  // Calculate lightness
	  l = (cmax + cmin) / 2;

	  // Calculate saturation
	  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	    
	  // Multiply l and s by 100
	  s = +(s * 100).toFixed(1);
	  //l = +(l * 100).toFixed(1);

	  var hslColor = {
			  h : h,
			  s : s,
			  l : l * 7
	  };
	  
	  
	  return hslColor;
	}


