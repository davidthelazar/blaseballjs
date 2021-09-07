function makedarker(hex){
    var r = parseInt(hex.substr(1,2),16);
    var g = parseInt(hex.substr(3,2),16);
    var b = parseInt(hex.substr(5,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    if (yiq >= 200 && !dark) {
  
      r = Math.floor(r*0.9);
      g = Math.floor(g*0.9);
      b = Math.floor(b*0.9);
      return hexconv([r,g,b]);
    }
    else { return hex };
  
  }
  
function hexconv(rgb) {
  
      return '#'+rgb.map(x => (+x).toString(16).padStart(2,0)).join('')
  }

function popColors(data) {


    var teamColors = {
    'away':[makedarker(data.awayTeamColor),makedarker(data.awayTeamSecondaryColor)],
    'home':[makedarker(data.homeTeamColor),makedarker(data.homeTeamSecondaryColor)]}

    return teamColors;
}

function getcolor(teamColors,team,index) {

if (team == "away") {return teamColors["away"][index];}
else if (team == "home") {return teamColors["home"][index];}
else {return '#555555';}

}