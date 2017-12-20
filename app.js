const DETAIL_PARAMS = ["Rank", "Artist", "Song", "Plays", "Requests"];
let svg = d3.select("svg").attr("width", document.body.clientWidth),
    margin = {top: 20, right: 20, bottom: 70, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let axisX = d3.scalePow().exponent(0.6)
    .rangeRound([0, width]);

let axisY = d3.scaleLinear()
    .rangeRound([height, 0]);

d3.tsv("data.tsv")
    .row(rowConversor)
    .get(onTSVParsed);

function onTSVParsed(error, data) {
    if (error) throw error;
    data = data.slice(0, 100);
    let params = [g, data, axisX, axisY, width, height];
    LineChartModule.createAxis(...params)
        .createLines(...params)
        .createHover(...params, DETAIL_PARAMS);
    TableModule.createTable()
        .withData(data)
        .withColumns(DETAIL_PARAMS.map(item => item.toLowerCase()))
        .drawIn("body");
}

let getRank = function* getRankGen() {
    let rank = 1;
    while (true) yield rank++;
}();

function rowConversor(row) {
    row.rank = getRank.next().value;
    row.plays = +row.plays;
    row.requests = +row.requests;
    return row;
}