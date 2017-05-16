/*
TODO

*/
var fs = require('fs');
var jsgo = require('jsgo');

var demo = process.argv[2];

fs.readFile(demo, function(err, data) {

var round = 0;
var mapName, gameId, playbackTicks, playbackTime;
var alreadyRun = 0;

process.stdout.write('#DATAHEADER demoinfo,gameId,mapName,tick,round,team1name,team1side,team1score,team2name,team2side,team2score\n');

  new jsgo.Demo().
  on('demo_header', function(event) {
     mapName = event.mapName;
     gameId = require("crypto").createHash("md5").update(event.playbackTicks + event.mapName + event.serverName + demo).digest("hex");
     playbackTicks = event.playbackTicks;
     playbackTime = event.playbackTime;
  }).
  on('game.cs_round_final_beep', function(event) {
  process.stdout.write('demoinfo,' + gameId + ',' + demo + ',' + mapName + ',' + this.getTick() + ',' + 'buytime_ended\n');
  // Run once, get all players, teams and steamids on the first round
  if (alreadyRun == 0){
     process.stdout.write('#DATAHEADER playerinfo,gameId,demo,mapName,playbackTicks,playbackTime,playerClan,playerName,playerSteamID\n');
     var playersArr = this.getPlayers();
     for (i = 0; i < playersArr.length ; i++){
	var player = playersArr[i];
	var playerSide = teamname(player.getTeam(this).getSide());
	var playerClan =  player.getTeam(this).getClanName();
	var position = player.getPosition();
	var playerWeapons = player.getWeapons();

	if (playerSide == 'T' || playerSide == 'CT'){
	    process.stdout.write('playerinfo,' + gameId + ',' + demo + ',' + mapName + ',' + playbackTicks + ',' + playbackTime + ',' + playerClan + ',' + player.getName() +',' + player.info.guid);
	    process.stdout.write('\n');
	}
   }
    alreadyRun=1;
  }
  }).
  on('game.bomb_planted', function(event) {
//     console.log(event);
     process.stdout.write('demoinfo,' + gameId + ',' + demo + ',' + mapName + ',' + this.getTick() + ',' + 'bomb_planted' + ',' + event.player.getPosition().x + ',' + event.player.getPosition().y + ',' + event.player.getPosition().z + '\n');
  }).
  on('game.bomb_defused', function(event) {
     process.stdout.write('demoinfo,' + gameId + ',' + demo + ',' + mapName + ',' + this.getTick() + ',' + 'bomb_defused' + ',' + event.player.getPosition().x + ','  + event.player.getPosition().y + ',' + event.player.getPosition().z + '\n');
  }).
  on('game.round_end', function(event) {
      process.stdout.write('demoinfo,' + gameId + ',' + demo + ',' + mapName + ',' + this.getTick() + ',' + round + ',');
      round += 1;

      var teams = this.getTeams();
      for (var i = 0; i < teams.length; i++) {
          var team = teams[i];
          var teamSide = teamname(team.getSide());
          if (teamSide == 'T' || teamSide == 'CT'){
              process.stdout.write(team.getClanName() + ',' + teamSide + ',' + team.getScore() + ',');
          }
      }
      process.stdout.write('\n');
  }).parse(data);
});

function teamname(teamName) {
   if (teamName == 'TERRORIST'){
       teamName = 'T'
   }
return teamName;
}
