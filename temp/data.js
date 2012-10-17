var derived fields =[
  {
    name: 'p1',
    f: function(row) {
       if(row.Priority == 'Resolve Immediately'){
         return 1;
       }
       else{
         return 0;
       }
    }
  },
  {
    name: 'p2',
    f: function(row) {
       if(row.Priority == 'High Attention'){
         return 1;
       }
       else{
         return 0;
       }
     }
  }
];

  aggregations =
  [
    {
      as: "P1 Count",
      f: '$sum',
      field: 'p1'
    },
    {
      as: "P2 Count",
      f: '$sum',
      field: 'p2'
    }
];

var rallyChartConfig = {
  xtype: 'rallychart',
  itemId: 'chart',
  height: 400,

  chartConfig: {
    chart: {
        defaultSeriesType: 'line'
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Count of P1s and P2s over time'
    },
    xAxis: {
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: [
        {
            title: {
                text: 'Count'
            },
            min: 0
        }
    ],
    series:[
      {
          name : "P1 Count",
          id: "p1CountSeries",
          yField: 'p1Count',
          visible : true
      },
      {
          name : "P2 Count",
          id: "p2CountSeries",
          yField: 'p2Count',
          visible : true
      }
    ]
  }
};


var timeSeriesCalculatorOutput = [
 {
  listOfAtCTs: ["x1", "x2"],
  aggregationAtArray: [
    {
      p1Count: 2,
      p2Count: 5
    }
  ]
 }
];
