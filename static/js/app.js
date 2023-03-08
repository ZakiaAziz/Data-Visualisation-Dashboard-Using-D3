
//url of the sample data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// Fetch the JSON data and append it to the drop-down select element
d3.json(url).then(function(data) {
  d3.select("#selDataset").selectAll("option").data(data.names).enter().append("option").text(d=>d).attr("value",d=>d);
  createCharts(data.names[0]);
  demo_info(data.names[0]);
});

// function for the change of the event
function optionChanged(id) {
  createCharts(id);
  demo_info(id);
};

//function for the the horizontal bar chart and bubble chart
function createCharts(id){
  d3.json(url).then((data)=> {
    console.log(data);
    
    //creating variable for holding samples array
    var samples = data.samples;

    //creating a variable that filters the samples for the object with desired sample numbers
    var resultArray = samples.filter(sampleObj => sampleObj.id == id);

    //creating a variable that holds first sample in the array
    var result = resultArray[0];

    //creating variables that hold otu_ids, otu_labels, and sample_values
    var ids = result.otu_ids;
    var labels = result.otu_labels.slice(0,10).reverse();
    var values = result.sample_values.slice(0,10).reverse();

    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;

    //creating y ticks for the bar plot
    var yticks = ids.map(sampleObj => "OTU" + sampleObj).slice(0,10).reverse();


    //trace variable for barplot
    var trace = {
      x: values,
      y: yticks,
      text: labels,
      type:"bar",
      orientation: "h",
  }
    //creating data variable
    var data = [trace];

    //create layout variable for the bar plot
    var layout = {
      title: "Top 10 OTU"
    };

    // create the bar plot
    Plotly.newPlot("bar", data, layout);

    //create bubble chart
    var trace1 = {
      x: ids,
      y: bubbleValues,
      mode: "markers",
      marker: {
          size: bubbleValues,
          color: bubbleValues
      },
      text: bubbleLabels

  };

  // create layout for the bubble plot
  var layout_b = {
    title: "Bubble Chart for Bacteria Sample",
    xaxis: {title: "OTU ID"},
    automargin: true,
    hovermode: "closest"
  };

  // creating data variable 
  var data1 = [trace1];

  // create the bubble plot
  Plotly.newPlot("bubble", data1, layout_b);
  });
}

//create function to get demographic info

function demo_info(id){
  d3.json(url).then((data)=> {
  
    // get the metadata info for the demographic panel
    var metadata = data.metadata;
    console.log(metadata);

    // filter meta_data info by id
    var result = metadata.filter(meta => meta.id.toString() === id)[0];

    // select demographic panel to update data
    var demographicInfo = d3.select("#sample-metadata");
        
    // empty the demographic info panel each time before getting new id info
    demographicInfo.html("");

    // grab the necessary demographic data for the id and append the info to the panel
    Object.entries(result).forEach((key) => {demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n")});
  
});

}
