
var version = parseInt(this.name);

CheckGames(version);

function CheckGames(version) {
	GetGamesRaw(version);
}

function ParseGames(rawResponse) {
	var gamesRaw = rawResponse.split("+");
	
	var games = [];
	
	for (g = 0; g < gamesRaw.length; g++) 
	{
	    var game = new Object();
	    var parts = gamesRaw[g].split("|");
	    var i = 0;
	    
	    game.ID = parseInt(parts[i++]);
	    game.Version = parseInt(parts[i++]);
	    game.Mode = parseInt(parts[i++]);
	    game.UpdateFreq = 20;//Math.Min(parseInt(parts[i++]), parseInt("20")) // 10f;
	    i++;
	    game.MaxPlayers = parseInt(parts[i++]);
	    var str = parts[i++];
	    game.Devonly = (str == "1" || str == "True" || str == "true");
	    game.LobbyTime = parseInt(parts[i++]);
	    game.GameLength = parseInt(parts[i++]);
	    game.TimeSinceStart = parseInt(parts[i++]);
	    game.Map = parseInt(parts[i++]) - 1;
	    game.playerNum = 0;
	    game.FreeSlot = -1;
        for (j = 0; j < game.MaxPlayers; j++)
        {
            if (Math.abs(parseInt(parts[i++])) < 3)
            {
            	game.playerNum++;
            }
            else
            {
                if (game.FreeSlot == -1)
                {
                	game.FreeSlot = j;
                }
            }
        }
        
        games.push(game);
	}
	
	postMessage(games)
	setTimeout("CheckGames("+version+")",1000);
}

function GetGamesRaw(ver)
{
    var xmlHttp = new XMLHttpRequest();
    
    var url = ver == 0 ? "https://www.danielpolish.hu/games/vrflight/dbfunc/getgames.php" : "https://www.danielpolish.hu/games/vrflight/dbfunc/getgames.php?ver=" + ver;//?ver=" + version;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        	ParseGames(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

