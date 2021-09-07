function digestSnapshots(event)
{
    update = JSON.parse(event.data);
    games = update.value.games.schedule;
	let snapshots=[];
    //TODO  setup a "games I care about" vector and only loop over those
	//TODO deal with fifth base
	for (let idx = 0; idx < games.length; idx++) 
	{
        idTemp = games[idx].id;
		thisGame = games.filter(function(x) { return x.id === idTemp; })[0];
		let snapshot={};
        // console.log(thisGame);
        //need: inning, halfInningOuts, atBatStrikes, atBatBalls, awayScore,homeScore, basesOccupied (or baserunnerCount)
	    // $("#updates").text(thisGame.lastUpdate);
		snapshot.data = thisGame; //store all raw data just in case. But use below fields for convenience
		
		snapshot.id = thisGame.id;
		snapshot.awayTeamNickname = thisGame.awayTeamNickname;
		snapshot.homeTeamNickname = thisGame.homeTeamNickname;			
		snapshot.lastUpdate = thisGame.lastUpdate;
		snapshot.inning = thisGame.inning;
		snapshot.topOfInning = thisGame.topOfInning;
		snapshot.outs = thisGame.halfInningOuts;
		snapshot.strikes = thisGame.atBatStrikes;
		snapshot.balls = thisGame.atBatBalls;
		snapshot.awayScore = thisGame.awayScore;
		snapshot.homeScore = thisGame.homeScore;
		snapshot.basesOccupied = thisGame.basesOccupied;
		snapshot.baserunnerCount = snapshot.basesOccupied.length;
		snapshot.baseString = (thisGame.basesOccupied.includes(0) ? '1' : '0')+(thisGame.basesOccupied.includes(1) ? '1' : '0') +(thisGame.basesOccupied.includes(2) ? '1' : '0');
		
		if (thisGame.awayBatter==null)
		{
			snapshot.maxStrikes = thisGame.homeStrikes;
			snapshot.maxOuts = thisGame.homeOuts;
			snapshot.maxBalls = thisGame.homeBalls;
			snapshot.totalBases = thisGame.homeBases-1;
		}
		else
		{
			snapshot.maxStrikes = thisGame.awayStrikes;
			snapshot.maxOuts = thisGame.awayOuts;
			snapshot.maxBalls = thisGame.awayBalls;
			snapshot.totalBases = thisGame.awayBases-1;
		}
		
		snapshots[idx] = snapshot;
		
	}	

	return snapshots;
}

function getSnapshotById(snapshots,id)
{
	return snapshots.filter(function(x) { return x.id === id; })[0];
}
function findSnapshotById(snapshots,id)
{
	for (var idx=0;idx<snapshots.length;idx++)
	{
		if (snapshots[idx].id === id)
		{
			return idx;
		}
	}
	return -1;
}    
function compareSnapshots(snap1,snap2)
{
	for (const property in snap1) {
		if (property=='basesOccupied')
		{	
			if (snap1[property].length !== snap2[property].length)
				{return false;}
			if (snap1[property].length !==0)
			{
				for (var idx=0;idx<snap1[property].length;idx++)
				{
					if(!snap2[property].includes(snap1[property][idx]))
					{
						return false;
					}
				}
				// snap1.forEach(item=>{if(snap2[property].includes(item){return false;})})
				// for (item in snap1[property])
				// {
				// 	
				// 	{
				// 		return false;
				// 	}
				// }
			}
		}
		else
		{
			if (snap1[property] !== snap2[property])
			{
				return false;
			}
		}
  }
  return true;
}
