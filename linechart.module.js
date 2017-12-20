class LineChartModule{

    static setAxisDomain(axis, data, fieldName ){
        axis.domain(d3.extent(data, (d) => d[fieldName]));
    }

    static createAxis(g, data, axisX, axisY, width, height) {
        LineChartModule.setAxisDomain(axisX, data, 'rank');
        LineChartModule.setAxisDomain(axisY, data, 'plays');
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(axisX))
            // add text horizontal
            .append("text")
            .attr("fill", "#000")
            .attr("y", 20)
            .attr("x", width - 10)
            .attr("dy", "0.71em")
            .text("Rank");

        g.append("g")
            .call(d3.axisLeft(axisY))
            // add text vertically
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Plays");
        return this;
    }

    static createLines(g, data, axisX, axisY) {
        function getLineGenerator(xData, yData) {
            return d3.line()
                .x((d) => axisX(d[xData]))
                .y((d) => axisY(d[yData]));
        }

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", getLineGenerator('rank', 'plays'));
        LineChartModule.setAxisDomain(axisY, data, 'requests');

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", getLineGenerator('rank', 'requests'));
        LineChartModule.setAxisDomain(axisY, data, 'plays');

        return this;
    }

    static createHover(g, data, axisX, axisY, width, height, DETAIL_PARAMS) {
        let hoverTextY = 10;

        function getHoverTextY() {
            return hoverTextY += 20;
        }

        function iterateDetailParams(callback) {
            for (let classKey of DETAIL_PARAMS) {
                callback(classKey);
            }
        }

        iterateDetailParams((classKey) => {
            let hoverY = getHoverTextY();
            g.append("text")
                .text(classKey)
                .attr("font-weight", "bold")
                .attr("x", (width / 3) - 80)
                .attr("y", hoverY);
            g.append("text")
                .attr("class", `hoverText${classKey}`)
                .text(classKey)
                .attr("x", width / 3)
                .attr("y", hoverY);
        });

        let focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");
        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 7.5);

        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em");


        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            })
            .on("mousemove", onMouseMove);

        function onMouseMove() {
            let x0 = axisX.invert(d3.mouse(this)[0]),
                i = d3.bisector(function (d) {
                    return d.rank;
                }).left(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.rank > d1.rank - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + axisX(d.rank) + "," + axisY(d.plays) + ")");
            focus.select("text")
                .text(function () {
                    return `Rank: ${d.rank} `;
                });
            iterateDetailParams((classKey) => {
                g.select(`.hoverText${classKey}`)
                    .text(function () {
                        return `${d[classKey.toLowerCase()]}`;
                    });
            });
            focus.select(".x-hover-line").attr("y2", height - axisY(d.plays));
            focus.select(".y-hover-line").attr("x2", width + width);
        }

        return this;
    }

}



