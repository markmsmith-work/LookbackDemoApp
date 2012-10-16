  derived fields =
  [
    {
      name: 'P1',
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
      name: 'P2',
       f: function(row) {
         if(row.Priority == 'High Attention'){
           return 1;
         }
         else{
           return 0;
         }
       }
    }
  ]

  aggregations =
  [
    {
      name: "P1 Count",
      f: '$sum',
      field: 'P1'
    },
    {
      name: "P1 Count",
      f: '$sum',
      field: 'P1'
    }
]

{
  xtype: 'rallychart',
  itemId: 'chart',
  height: 400,
  xField:

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
          visible : true,
          data: []
      },
      {
          name : "P2 Count",
          id: "p2CountSeries",
          visible : true,
          data: []
      }
    ]
  }
}
