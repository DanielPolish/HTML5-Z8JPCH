
var game = parseInt(this.name);

CheckPlanes(game);

function CheckPlanes(game) {
	this.game = game;
	GetPlanesRaw(game);
}



function GetPlanesRaw(game)
{
    var xmlHttp = new XMLHttpRequest();
    var url = "https://www.danielpolish.hu/games/vrflight/dbfunc/getdata.php?gid=" + game;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        	//var fakeResp = "3;-10.5224:-0.36728:-36.9204;3.393:198.3:359.9;5.5563:-0.005:16.742;0.070:-0.00:-0.02;20;255:0:0:863:458;231:231:231:875:134;0;1|1297|x+4;225.2312:-0.09582:-71.4617;0.109:0.004:0.003;0.0002:-0.000:0;0:0:-0.00;0;255:255:255:859:154;0:104:198:870:241;0;1|4255695|x+4;267.0292:-0.09582:-71.4616;0.109:-0.00:0.003;0.0002:-0.000:0;0:0:-0.00;0;255:255:255:859:154;0:104:198:870:241;0;1|4255689|x+x|6583291|x+x|6583291|x+x|6583291|x+x|6583291|x";
        	//ParsePlanes(fakeResp)
        	ParsePlanes(xmlHttp.responseText);
        	//postMessage(fakeResp)
        	//setTimeout("CheckPlanes(" + this.game + ")",1000);
        }
        	
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function new_Vector3(x, y, z) {
	var v3 = {
			x: x,
			y: y,
			z: z
	};
	
	return v3;
}

function new_Color(r, g, b, s, m) {
	var col = new Object();
	var darkening = (1 - m*0.5); 
	col.r = r * darkening;
	col.g = g * darkening;
	col.b = b * darkening;
	col.smoothnes = s;
	col.metallic = m;
	
	return col;
}

function ParsePlanes(rawResponse) {
	//var gamelist = document.getElementById("gamename");
	//gamelist.innerHTML = rawResponse;
	//return;
	
	var planesRaw = rawResponse.split("+");
	var planes = [];
	
	for (p = 0; p < planesRaw.length; p++) 
	{
		var parts = planesRaw[p].split("|");
		var inactiveTime = parseInt(parts[1]);
		var planeData = parts[0];
		if (/*inactiveTime > 5 || */planeData == "x") {
			planes.push(null);
		} else {
			var plane = ParsePlane(planeData);
			plane.InactiveTime = inactiveTime;
			plane.Slot = p;
			planes.push(plane);
		}
	}
	
	postMessage(planes)
	setTimeout("CheckPlanes(" + this.game + ")",1000);
	//GetPlanesCallback(planes);
}

function ParsePlane(planeData) {
		
    var plane = new Object();
    var dataParts = planeData.split(";");
    if (dataParts.length < 6)
    {
        return ParseLobbyData(planeData);
    }
    var c = 0;
    
    plane.Type = parseInt(dataParts[c++]);
    var posParts = dataParts[c++].split(':');
    plane.Position = new_Vector3(parseFloat(posParts[0]), parseFloat(posParts[1]), parseFloat(posParts[2]));
    plane.posX = parseFloat(posParts[0]);
    plane.posY = parseFloat(posParts[2]);
    var rotParts = dataParts[c++].split(':');
    plane.Rotation = new_Vector3(parseFloat(rotParts[0]), parseFloat(rotParts[1]), parseFloat(rotParts[2]));
    var VParts = dataParts[c++].split(':');
    plane.Velocity = new_Vector3(parseFloat(VParts[0]), parseFloat(VParts[1]), parseFloat(VParts[2]));
    var AVParts = dataParts[c++].split(':');
    plane.AngularVelocity = new_Vector3(parseFloat(AVParts[0]), parseFloat(AVParts[1]), parseFloat(AVParts[2]));
    plane.Rps = parseFloat(dataParts[c++]);
    plane.Colors = [];
    for (i = 0; i < 2; i++)
    {
    	var raw = dataParts[c++];
        var matParts = raw.split(':');
        var color = new_Color(parseInt(matParts[0]) / 255, parseInt(matParts[1]) / 255, parseInt(matParts[2]) / 255, parseInt(matParts[3]) / 999, parseInt(matParts[4]) / 999);
        plane.Colors.push(color);
    }

    plane.Crashed = dataParts[c++] == "1";
    plane.GearsExtended = dataParts[c++] == "1";
    plane.IsBig = false;//this.IsPlaneBig(type);
    
    return plane;
}

function ParseLobbyData(rawResponse) {
	    var plane = new Object();
	    var dataParts = rawResponse.split(";");
	    var c = 0;
	    
	    plane.Type = parseInt(dataParts[c++]);

	    

	    plane.Position = new_Vector3(0, 0, 0);
	    plane.posX = plane.Position.x;
	    plane.posY = plane.Position.z;
	    plane.Rotation = new_Vector3(0, 0, 0);
	    plane.Colors = [];
	    for (i = 0; i < 2; i++)
	    {
	        var raw = dataParts[c++];
	        var matParts = raw.split(':');
	        var color = new_Color(parseInt(matParts[0]) / 255, parseInt(matParts[1]) / 255, parseInt(matParts[2]) / 255, parseInt(matParts[3]) / 999, parseInt(matParts[4]) / 999);
	        plane.Colors.push(color);
	    }

	    plane.IsBig = false; // this.IsPlaneBig(type);
        
        return plane;
}

//CheckGames(5);