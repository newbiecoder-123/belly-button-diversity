// Using D3 library to read in samples.json
// Create a function to make plots of different charts
function makeCharts(data) {
    d3.json("samples.json").then (sampledata =>{

    // Grab ids, sample values and labels
    var ids = sampledata.samples[0].otu_ids;
    var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
    var labels =  sampledata.samples[0].otu_labels.slice(0,10);

    // Slice top 10 otu ids for the plot OTU
    // Reverse the top 10 
    var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();

    // Grab OTU Ids
    var OTU_id = OTU_top.map(d => "OTU " + d);

    // Slice top 10 labels for the plot
    var labels =  sampledata.samples[0].otu_labels.slice(0,10);
    
    var trace = {
        x: sampleValues,
        y: OTU_id,
        text: labels,
        marker: {
        color: 'blue'},
        type:"bar",
        orientation: "h",
    };
            
        // Create a variable for an array of objects to plot
        var data = [trace];
    
        // Create a variable for layout and format the layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
    Plotly.newPlot("bar", data, layout);
        
        // The bubble chart
        var trace1 = {
            x: sampledata.samples[0].otu_ids,
            y: sampledata.samples[0].sample_values,
            mode: "markers",
            marker: {
                size: sampledata.samples[0].sample_values,
                color: sampledata.samples[0].otu_ids
            },
            text:  sampledata.samples[0].otu_labels
            };
    
        // set the layout for the bubble plot
        var layout2 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
    
            // creating data variable 
            var data1 = [trace1];
    
    // create the bubble plot
    Plotly.newPlot("bubble", data1, layout2);  
    });
}  

// Function to get information
function grabData(id) {
    d3.json("samples.json").then((data)=> {
// Grab metadata info for the demographic panel
        var metadata = data.metadata;
    
        // Filter metadata by id and select demographic panel to place this data
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
            
        // Empty the demographic info panel with each new selection 
        demographicInfo.html("");
            
        // Use Object.entries to grab all the information for the demographic table
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
        });
    }
    // create the function for the change event
    function optionChanged(data) {
        makeCharts(data);
        grabData(data);
    }
    
// create the function for the initial data rendering
// 1. This function will select the dropdown menu
// 2. Read the data using d3.json
// 3. Grab data by using forEach function and grabbing the value
// 4. Display all the information 
function init() {
    //Step 1.
    var dropdown = d3.select("#selDataset");
    //Step 2.
    d3.json("samples.json").then((data)=> {
    
        //Step 3.
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        //Step 4.
        makeCharts(data.names[0]);
        grabData(data.names[0]);
        });
    }

// Run all the code to generate plots
init();

