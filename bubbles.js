function getGame(snapshot) {



    return snapshot.data;
}

function popGameObject(snapshot,type,count,firstTime) {

    try{
        
    gameData = getGame(snapshot);

    } catch {
        console.log("not a valid game");
        return;
    };
    if (firstTime)
    {
        gamediv = d3.select("#container")
        .append("div").attr("class","game")

        gamediv.append("svg")
        .attr("class", "game")
        .attr("id", "game"+count)
        .attr("width", Math.floor(9.7*radius)+"px")
        .attr("height", 8.2*radius+"px")

        gamediv.append("br")

        gamediv.append("div")
        .attr("id", "pause"+count)
        .attr("class", "pause icon")
        .attr("count", count)
        .html("<i class=\"fas fa-play\"></i>")

        gamediv.append("div")
        .attr("id", "advance"+count)
        .attr("class", "icon")
        .html("<i class=\"fas fa-step-forward\"></i>")
    }

    svg = d3.select("#game"+count);

    gameObject={"id": count, "svg": svg, "index": 0, "data": gameData, "pause": true}
    initGame(gameObject);
    
    return gameObject;

}

function initGame(gameObject) {

    initialised = true;
    
    var data = gameObject.data;
    var teamColors = popColors(data);
    
    setup = createArray(data);
    // console.log(setup);
    
    makeGrad(gameObject.svg,setup["bubbles"],"bubbles");
    makeGrad(gameObject.svg,setup["bars"],"bars");
    
    makeShapes(gameObject.svg,setup["bubbles"],"circle");
    makeShapes(gameObject.svg,setup["bars"],"rect")
    
    setup["bubbles"].forEach((item) => {
        updateShape(gameObject.svg,teamColors,item.name,item.value)})
    
    setup["bars"].forEach((item) => {
        updateShape(gameObject.svg,teamColors,item.name,item.value)})

    // togglePause(gameObject);
    
}

function checkValue(type,team,data) {
    defaults = {"Balls": 3, "Bases": 3, "Strikes": 2, "Outs": 2};
    if (team+type in data) {
        return data[team+type]-1;
    } else {
        return defaults[type];
    }
}

function createArray(data) {

    if (data.topOfInning == true) {
        activeTeam = "away";
        inningPad = 0.5;}
    else {
        activeTeam = "home";
        inningPad = 1}
    
    

    var array = {
    "bubbles": [
    { "name": "balls", "max": checkValue("Balls",activeTeam,data), "x": 1, "y": 1, "value": data.atBatBalls},
    { "name": "bases", "max": checkValue("Bases",activeTeam,data), "x": 1, "y": 2, "value": data.baseRunners.length},
    { "name": "strikes", "max": checkValue("Strikes",activeTeam,data), "x": 2, "y": 1, "value": data.atBatStrikes},
    { "name": "outs", "max": checkValue("Outs",activeTeam,data), "x": 2, "y": 2, "value": data.halfInningOuts}
    ],
    "bars": [
    { "name": "runs1", "max": 10, "x": 0, "y": 0.6, "w": 0.5, "h": 3, "align": "v", "team": "away", "value": data.awayScore},
    { "name": "runs2", "max": 10, "x": 4, "y": 0.6, "w": 0.5, "h": 3, "align": "v", "team": "home", "value": data.homeScore},
    { "name": "innings", "max": 9, "x": 0, "y": 0.1, "w": 4.5, "h": 0.5, "align": "h", "team": activeTeam, "value": data.inning+inningPad},
    { "name": "runs1-tens", "max": 10, "x": 0.5, "y": 0.6, "w": 0.1,"h": 3, "align": "v", "team": "away", "value": data.awayScore, "hidden": 1},
    { "name": "runs2-tens", "max": 10, "x": 3.9, "y": 0.6, "w": 0.1,"h": 3, "align": "v", "team": "home", "value": data.homeScore, "hidden": 1},
    { "name": "innings-tens", "max": 9, "x": 0, "y": 0.44, "w": 4.5, "h": 0.1, "align": "h", "team": activeTeam, "value": data.inning+inningPad, "hidden": 1}
    ]

    };
    array["bubbles"].forEach((item) => {
    item.team = activeTeam;
    item.align = "v";
    item.dir = 0;
    })

    return array;
}

function makeGrad (svg, data, label) {

    svgId=svg.attr('id')
    var gradients = svg.append("defs").selectAll("linearGradient")
    .data(data)
    .enter()
    .append("linearGradient")
        .attr("class", label+" gradient")
        .attr("id", function(d) {
            return svgId+"-gradient-"+d.name;
        })
        .attr("x1", "0%")
        .attr("y1", function(d) {
            if (d.align == "v"){ return "100%";}
            else {return "0%"}})
        .attr("y2", "0%")
        .attr("x2", function(d) {
            if (d.align == "h"){return "100%";}
            else {return "0%"}})
    
    gradients.append("stop")
        .attr("offset", "0%")
        .attr("class", "stop-filled "+label)
    
    gradients.append("stop")
        .attr("offset", "0%")
        .attr("class", "stop-empty "+label)
    
    return gradients;
}
    
function updateGrad(svg,teamColors,name,value) {

    svgId=svg.attr('id')
    gradient = svg.select("#"+svgId+"-gradient-"+name)
    gradient.attr("team",function(d){return d.team})

    gradient.selectAll("stop")
        .attr("stop-color", function(d) {
            return getcolor(teamColors,d.team,1)})
        .attr("stop-opacity", function(d) {
                if (d3.select(this).classed("stop-filled")){
                    return 0.7;
                }
                else {
                    return 0;
                }})

        .transition().duration(transitionSpeed*interval)
            .attr("offset", function(d) {
                offset = Math.round((value/d.max)*100)+'%';
                return offset;})
    
    return gradient;
}
    
function makeShapes(svg, data, shape) {
    
    var shapes = svg.selectAll(shape)
    .data(data)
    .enter()
    .append(shape)
        .attr("id", function(d) {
        return d.name;})
        // .attr("class",label)
        .attr("stroke-width", 3)
    
    switch (shape) {
    case "circle":
    svg.selectAll(shape)
        .attr("r",radius)
        .attr("class","shape bubbles")
        .attr("cx", function(d) {
        return 10+radius*3*d.x;})
        .attr("cy", function(d) {
        return 10+radius*3*d.y;})
    break;
    
    case "rect":
    svg.selectAll(shape)
        .attr("class","shape bars")
        .attr("width", function(d) {
            return d.w*2*radius;})
        .attr("height", function(d) {
            return d.h*2*radius;})
        .attr("x", function(d) {
            return 10+radius*2*d.x;})
        .attr("y", function(d) {
            return 10+radius*(3*d.y);})
        .attr("visibility", function(d){
            if (d.hidden == 1) {return "hidden"}
            else {return "visible"};
        })
    break;
    }
    
    return shapes;
}
    
function updateShape(svg,teamColors,name) {
    
    svgId=svg.attr('id')
    shape = svg.select('#'+name)
    
    shape.attr("value",function(d) {
        if (d.hidden == 1) {
            value = Math.floor((d.value-0.001)/d.max);
        } else {
            value = (d.value-0.001)%d.max+0.001;
        }
        return value;
    })
    .attr("max", function(d) {
        return d.max;})
    .attr("team",function(d) {
        return d.team;})
    .attr("stroke", function(d) { 
        return getcolor(teamColors,d.team,0)})
    .attr("fill", function (d) {   
        return "url(#"+svgId+"-gradient-"+name+")";
    })
    .attr("stroke", function(d) { 
        return getcolor(teamColors,d.team,0)})
    .attr("visibility", function(d) {
        if (d.max > d.value-0.001 && d.hidden == 1) {
            return "hidden";
        } else {
            return "visible";
        }
    })
        
    updateGrad(svg,teamColors,name, value);
    
}

function togglePause(gameObject,pause) {

    if (gameObject.pause != pause) {
    gameObject.pause = !gameObject.pause;
    
    if (gameObject.pause) {
        clearInterval(gameObject.autoadvance)
        $("#advance"+gameObject.id).removeClass("hidden");
        $("#advance"+gameObject.id).on("click",function(){advanceState(gameObject)});
        label = "<i class=\"fas fa-play\"></i>";
    }
    else {
        gameObject.autoadvance = setInterval(function () {
            advanceState(gameObject)}, interval);
        $("#advance"+gameObject.id).addClass("hidden");
        $("#advance"+gameObject.id).off("click");
        label = "<i class=\"fas fa-pause\"></i>";
        
    }
    
    $("#pause"+gameObject.id).html(label);
}
}

function advanceState(gameObject) {

    gameObject.index += 1;
    
    try {
    
        svg = gameObject.svg;
            
        var data = gameObject.data[gameObject.index].data;
        if (consoleOutput) {console.log("[Game "+gameObject.id+"] "+data.lastUpdate)};
        var teamColors = popColors(data);
            
        setup = createArray(data);
    
        //d3 is disgusting and I hate it, why is it like this
        for (let type of ["bubbles","bars"]) {
            for (let cla of [".shape",".gradient",".stop-empty",".stop-filled"]) {
                svg.selectAll(cla+"."+type).data(setup[type]);
            }}
    
        setup["bubbles"].forEach((item) => {
            updateShape(svg,teamColors,item.name,item.value)
        })
    
        setup["bars"].forEach((item) => {
            updateShape(svg,teamColors,item.name,item.value)
        })
    
    } catch (error) {

        clearInterval(gameObject.autoadvance);
    }

}            