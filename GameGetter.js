var gameGetterWorker = null;
var SortBy = "name";
var Desc = true;

var GameList = [];

function StartGameQuery() {
	if (gameGetterWorker == null) {
		gameGetterWorker = new Worker("GameGetterWorker.js", {name: localStorage.gameversionfilter});
	}
	gameGetterWorker.onmessage = function(event){
		GameList = event.data;
		SortGames();
	};
}

function StopGameQuery() {
	if (gameGetterWorker != null) {
		gameGetterWorker.terminate();
	}
	
	gameGetterWorker = null;
}

function RestartGameWorker() {
	StopGameQuery();
	StartGameQuery();
}

function SortGames() {
	
	if (localStorage.sortgamesby)
		this.SortBy = localStorage.sortgamesby;
	else {
		this.SortBy = "name";
		localStorage.sortgamesby = "name";
	}
		
	
	if (localStorage.sortgamesdesc)
		this.Desc = localStorage.sortgamesdesc === "true";
	else {
		this.Desc = true;
		localStorage.sortgamesdesc = "true";
	}
	
	GameList.sort(CmpGames);
//	if (sortBy == "ver") {
//		games.sort(function (g1, g2) {
//			return g1.Version - g2.Version;
//		})
//	} else if (sortBy == "mode") {
//		games.sort(function (g1, g2) {
//			return g1.Mode - g2.Mode;
//		})
//	} else if (sortBy == "state") {
//		games.sort(function (g1, g2) {
//			var g1State = g1.playerNum == 0 ? "Idol" : "Active";
//			var g2State = g2.playerNum == 0 ? "Idol" : "Active";
//			if (g1State == g2State) {
//				return 0
//			} else {
//				if (g1State == "Active") {
//					return 1;
//				} else {
//					return -1;
//				}
//			}
//		})
//	} else if (sortby == "slots") {
//		games.sort(function (g1, g2) {
//			return g1.playerNum - g2.playerNum;
//		})
//	} else {//(sortby == "name")
//		games.sort(function (g1, g2) {
//			return g1.ID - g2.ID;
//		})
//	}
	
	DisplayGames(GameList);
}

function CmpGames(g1, g2) {
	var ret = CmpGames2(g1, g2, SortBy, Desc);
	//console.log("sorting: " + g1.ID + " - " + g2.ID + " = " + ret);
	return ret;
}

function CmpGames2(g1, g2, sortBy, desc) {
	var mul = desc? -1 : 1;
	
	if (sortBy == "ver") {
		if (g1.Version != g2.Version)
			return (g1.Version - g2.Version) * mul;
		else
			return CmpGames2(g1, g2, "name", desc)
	} else if (sortBy == "mode") {
		if (g1.Mode != g2.Mode)
			return (g1.Mode - g2.Mode) * mul;
		else 
			return CmpGames2(g1, g2, "ver", desc)
	} else if (sortBy == "state") {
			var g1State = g1.playerNum == 0 ? "Idol" : "Active";
			var g2State = g2.playerNum == 0 ? "Idol" : "Active";
			if (g1State == g2State) {
				return CmpGames2(g1, g2, "ver", desc)
			} else {
				if (g1State == "Active") {
					return 1 * mul;
				} else {
					return -1 * mul;
				}
			}
	} else if (sortBy == "slots") {
		if (g1.playerNum != g2.playerNum)
			return (g1.playerNum - g2.playerNum) * mul;
		else
			return CmpGames2(g1, g2, "ver", desc)
	} else {//(sortby == "name")
		return (g1.ID - g2.ID) * mul;
	}
}

function DisplayGames(games) {
	var gamelist = document.getElementById("gamelist");
	gamelist.innerHTML = "";
	
	for (g=0; g < games.length; g++) {
		var game = games[g];
		if (!isNaN(game.ID)) {
		
			var row = document.createElement("div");
	//		row.onclick = function() {gameClick(game.ID + "");}
			row.setAttribute("onclick", "gameClick("+game.ID+", "+game.Mode+")");
			row.setAttribute("class", "row gridData");
			
			var id = document.createElement("div");
			id.setAttribute("class", "col");
			id.innerHTML = game.ID;
			
			var ver = document.createElement("div");
			ver.setAttribute("class", "col");
			ver.innerHTML = game.Version;
			
			var mode = document.createElement("div");
			mode.setAttribute("class", "col");
			mode.innerHTML = game.Mode == 1 ? "Free flight" : "Star collector";
			
			var state = document.createElement("div");
			state.setAttribute("class", "col");
			state.innerHTML = game.playerNum == 0 ? "Idol" : "Active";
			state.style.color = game.playerNum == 0 ? "red" : "green";
			state.style.fontWeight = game.playerNum == 0 ? "normal" : "bold";
			
			var players = document.createElement("div");
			players.setAttribute("class", "col");
			players.innerHTML = game.playerNum + "/" + game.MaxPlayers;
			
			row.appendChild(id);
			row.appendChild(ver);
			row.appendChild(mode);
			row.appendChild(state);
			row.appendChild(players);
			
			gamelist.appendChild(row);
		}
	}
}

function gameClick(gameID, mode) {
//	console.log("Game clicked: " + gameID);
	LoadMap(gameID, mode);
//	if (typeof gameClickHandler != "undefined") {
//		gameClickHandler(gameID);
//	}
}

