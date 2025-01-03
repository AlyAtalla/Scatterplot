// Fetch cyclist data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
        // Chart dimensions
        const width = 800;
        const height = 500;
        const padding = 60;

        // Parse time for y-axis (minutes:seconds)
        const parseTime = d3.timeParse("%M:%S");

        // Prepare data
        const times = data.map(d => parseTime(d.Time));
        const years = data.map(d => d.Year);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([d3.min(years) - 1, d3.max(years) + 1])
            .range([padding, width - padding]);

        const yScale = d3.scaleTime()
            .domain([d3.min(times), d3.max(times)])
            .range([height - padding, padding]);

        // Create SVG
        const svg = d3.select("#chart")
            .attr("width", width)
            .attr("height", height);

        // Tooltip
        const tooltip = d3.select("#tooltip");

        // Plot dots
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(parseTime(d.Time)))
            .attr("r", 6)
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => parseTime(d.Time))
            .style("fill", d => d.Doping ? "red" : "blue")
            .on("mouseover", (event, d) => {
                tooltip.html(`
                    ${d.Name} (${d.Nationality})<br>
                    Year: ${d.Year}, Time: ${d.Time}
                    ${d.Doping ? `<br><br>${d.Doping}` : ''}
                `)
                .attr("data-year", d.Year)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`)
                .classed("visible", true);
            })
            .on("mouseout", () => {
                tooltip.classed("visible", false);
            });

        // X-Axis (Years)
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding})`)
            .call(xAxis);

        // Y-Axis (Times)
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat("%M:%S"));
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);

        // X-Axis Label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .style("text-anchor", "middle")
            .text("Year");

        // Y-Axis Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .style("text-anchor", "middle")
            .text("Time (minutes)");
    });