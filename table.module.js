class TableModule{
    static createTable(data, columns, drawElement) {
        this.withColumns = (withColumns) => {
            columns = withColumns;
            return this;
        };
        this.withData = (withData) => {
            data = withData;
            return this;
        };
        this.drawIn = (drawIn) => {
            drawElement = drawIn;
            return this.execute()
        };
        this.execute = () => {
            let table = d3.select(drawElement).append("table"),
                thead = table.append("thead"),
                tbody = table.append("tbody");

            // append the header row
            thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function (column) {
                    return column;
                });

            // create a row for each object in the data
            let rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

            // create a cell in each row for each column
            let cells = rows.selectAll("td")
                .data(function (row) {
                    return columns.map(function (column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append("td")
                .attr("style", "font-family: Courier")
                .html(function (d) {
                    return d.value;
                });

            return table;
        };

        return (data && columns && drawElement) ? this.execute() : this;
    }
}
