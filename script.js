let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let bachURL = "https://api.npoint.io/d9dca4bd09576c55acaf";
let gdpURL = "https://api.npoint.io/34d48a5e88f0e472ec63";

let countyData;
let educationData;
let gpaData;

let canvas = d3.select('#bachcanvas');
let tooltip = d3.select('#tooltip');

function getSelectValue(){
    var selectedValue = document.getElementById("list").value;

    if(selectedValue == "blank"){
        drawBlankMap();
        
    }
    if(selectedValue == "bach"){
        drawMap();
    }
    if(selectedValue == "gdp"){
        drawMapGdp();
    }
}

let drawBlankMap = () => {
    d3.select(".bachleg")
        .attr("visibility", "hidden")
    d3.select(".gdpleg")
        .attr("visibility", "hidden")
    d3.select(".bachdesc")
        .style("visibility", "hidden")       
    d3.select(".gdpdesc")
        .style("visibility", "hidden")
    canvas.selectAll("*").remove();
    canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .style("fill", "lightgrey")
}

let drawMap = () => {

    d3.select(".gdpleg")
        .attr("visibility", "hidden")
    d3.select(".gdpdesc")
        .style("visibility", "hidden")
    d3.select(".bachleg")
        .attr("visibility", "visibile")
    d3.select(".bachdesc")
        .style("visibility", "visible")
    canvas.selectAll("*").remove();
    canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = gpaData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        if(percentage <= 15) return '#ffbf00'            
        if(percentage <= 30) return 'darkorange'
        if(percentage <= 45) return '#E33725'
        if(percentage > 45) return '#A01000'      
    })
    .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = gpaData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        return percentage
    })

    .on('mouseover', (countyDataItem) => {
        var tip = "<h3>" + "d.properties.name" + "</h3>";
        tooltip.html(tip)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .style('visibility', 'visible')

        let id = countyDataItem['id']
        let county = gpaData.find((item) => {
            return item['fips'] === id
        })

        tooltip.text(county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

        tooltip.attr('data-education', county['e'])
        tooltip.transition()
                .duration(1)
                .style("opacity", .7);

    })

    .on('mouseout', (countyDataItem) => {
        tooltip.transition()
              .duration(1)
              .style("opacity", 0);
              d3.selectAll('path')
                            .style({
                                'fill-opacity':.7
          })
          

    })

}

let drawMapGdp = () => {

    d3.select(".gdpleg")
        .attr("visibility", "visible")
        .style("bottom", "270px")
    d3.select(".gdpdesc")
        .style("visibility", "visible")
        .style("bottom", "270px")
    d3.select(".bachleg")
        .attr("visibility", "hidden")
    d3.select(".bachdesc")
        .style("visibility", "hidden")
    canvas.selectAll("*").remove();
    canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = gdpData.find((item) => {
            return item['fips'] === id
        })
        let gdp = county['GPA']
        if(gdp <= 500000) return '#779ed1'            
        if(gdp <= 2000000) return '#3671bf'
        if(gdp <= 7000000) return '#084ba3'
        if(gdp > 7000000) return '#041a7d'      
    })
    .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = gdpData.find((item) => {
            return item['fips'] === id
        })
        let gdp = county['GPA']
        return gdp
    })

    .on('mouseover', (countyDataItem) => {
        var tip = "<h3>" + "d.properties.name" + "</h3>";
        tooltip.html(tip)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .style('visibility', 'visible')

        let id = countyDataItem['id']
        let county = gdpData.find((item) => {
            return item['fips'] === id
        })

        tooltip.text(county['area_name'] + ', ' + county['state'] + ", GDP: $" + county['GPA'])

        tooltip.attr('data-education', county['e'])
        tooltip.transition()
                .duration(1)
                .style("opacity", .7);

    })

    .on('mouseout', (countyDataItem) => {
        tooltip.transition()
              .duration(1)
              .style("opacity", 0);
              d3.selectAll('path')
                            .style({
                                'fill-opacity':.7
          })
          

    })

}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log);
        }
        else{
            
            countyData = topojson.feature(data, data.objects.counties).features

            console.log(countyData)

            d3.json(bachURL).then(
                (data, error) => {
                if(error){
                    console.log(log)
                }
                else{
                    gpaData = data
                    console.log(gpaData)
                    drawBlankMap();
                }
            })

            d3.json(gdpURL).then(
                (data, error) => {
                if(error){
                    console.log(log)
                }
                else{
                    gdpData = data
                    console.log(gdpData)
                    //drawMapGdp();
                }
            })
        }
    })

    drawBlankMap();