const drawDonutCharts = (data) => { 

    const svg = d3.select("#donut")
        .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);

    const donutContainers = svg
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
  

    const years = [1991, 2010, 2020, 2024];
    const formats = data.columns.filter(format => format !== "year");

    const chartSpacing = (width - margin.left - margin.right) / years.length;
    const chartOffset = chartSpacing / 2;

    years.forEach((year, index) => {

        const donutContainer = donutContainers
        .append("g")
        .attr("transform", `translate(${chartOffset + index * chartSpacing}, ${innerHeight / 2})`);
        
        const yearData = data.find(d => d.year === year);

        const formattedData = [];

        formats.forEach(format => {
          formattedData.push({ 
            format: format, 
            production: yearData[format] 
            });
        });

        console.log("formattedData", formattedData);
    
    const pieGenerator = d3.pie()
        .value(d => d.production)
        .sort(null);
        
    const annotatedData = pieGenerator(formattedData);

    const arcGenerator = d3.arc()
        .startAngle(d => d.startAngle)  
        .endAngle(d => d.endAngle)     
        .innerRadius(60)
        .outerRadius(100)
        .padAngle(0.02)
        .cornerRadius(3);
  
    const arcs = donutContainer
        .selectAll(`.arc-${year}`)  
        .data(annotatedData)          
        .join("g")                 
            .attr("class", `arc-${year}`)
    arcs
        .append("path")
            .attr("d", arcGenerator)
            .attr("fill", d => colorScale(d.data.format));  
    arcs
        .append("text")
          .text(d => {
            d["percentage"] = (d.endAngle - d.startAngle)/ (2 * Math.PI);                                             
            return d3.format(".0%")(d.percentage);                         
          })
          .attr("x", d => {               
            d["centroid"] = arcGenerator 
              .startAngle(d.startAngle)  
              .endAngle(d.endAngle)      
              .centroid();               
            return d.centroid[0];        
          })                             
          .attr("y", d => d.centroid[1]) 
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#f6fafc")
          .attr("fill-opacity", d => d.percentage< 0.05 ? 0 : 1)                       
          .style("font-size", "16px")
          .style("font-weight", 500);
    });
};

