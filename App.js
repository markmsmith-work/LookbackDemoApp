Ext.define('Rally.data.lookback.SnapshotStoreOtherUrl', {
        extend: 'Rally.data.lookback.SnapshotStore',

        constructor: function(config) {
            this.callParent([config]);
            // temporary override needed since need different server and workspace
            this.proxy.url = 'https://hackathon.rallydev.com/analytics2/v2.0/service/rally/workspace/41529001/artifact/snapshot/query';
        }
    });

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items:[
        {
            xtype: 'panel',
            itemId: 'topLevelPanel',
            layout: 'anchor',
            border: true,
            fieldDefaults: {
                labelWidth: 40
            },
            defaultType: 'textarea',
            bodyPadding: 5,
            items: [
                // query text area will be added here by launch

                {
                    xtype: 'textfield',
                    fieldLabel: 'Fields',
                    itemId: 'fieldsField',
                    width: 500,
                    value: '["_ValidFrom", "_ValidTo", "ObjectID", "Priority"]'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Hydrate',
                    itemId: 'hydrateField',
                    width: 500,
                    value: '["Priority"]'
                },
                {
                    fieldLabel: 'Timeline Spec',
                    itemId: 'timelineSpecField',
                    anchor:'100%',
                    width: 700,
                    height: 100,
                    value: '{\n'+
                           '    "pastEnd": "this day in Pacific/Fiji",\n'+
                           '    "limit": 22,\n'+
                           '    "workdays": "foo",\n'+
                           '    "holidays": [\n'+
                           '        {\n'+
                           '            "month": 1,\n'+
                           '            "day": 1\n'+
                           '        },\n'+
                           '        {\n'+
                           '            "month": 12,\n'+
                           '            "day": 25\n'+
                           '        },\n'+
                           '        "2012-09-03"\n'+
                           '    ]\n'+
                           '}'
                },
                {
                    fieldLabel: 'Derived Fields',
                    itemId: 'derivedFieldsField',
                    anchor: '100%',
                    width: 700,
                    height: 100,
                    value: '[\n'+
                           '    {\n'+
                           '        "name": "P1",\n'+
                           '        "f": "function (row) {\n'+
                           '         if(row.Priority == "Resolve Immediately"){\n'+
                           '           return 1;\n'+
                           '         }\n'+
                           '         else{\n'+
                           '           return 0;\n'+
                           '         }\n'+
                           '      }"\n'+
                           '    },\n'+
                           '    {\n'+
                           '        "name": "P2",\n'+
                           '        "f": "function (row) {\n'+
                           '         if(row.Priority == "High Attention"){\n'+
                           '           return 1;\n'+
                           '         }\n'+
                           '         else{\n'+
                           '           return 0;\n'+
                           '         }\n'+
                           '       }"\n'+
                           '    }\n'+
                           ']'
                },
                {
                    fieldLabel: 'Aggregation Spec',
                    itemId: 'aggregationSpecField',
                    anchor: '100%',
                    width: 700,
                    height: 100,
                    value: '[\n'+
                           '    {\n'+
                           '        "name": "P1 Count",\n'+
                           '        "f": "$sum",\n'+
                           '        "field": "P1"\n'+
                           '    },\n'+
                           '    {\n'+
                           '        "name": "P2 Count",\n'+
                           '        "f": "$sum",\n'+
                           '        "field": "P2"\n'+
                           '    }\n'+
                           ']'
                },
                {
                    fieldLabel: 'Chart Config',
                    itemId: 'chartConfigField',
                    anchor:'100%',
                    width: 700,
                    height: 100,
                    value: '{\n'+
                            '    { property: "ScheduleState", operator: "exists", value:true }\n'+
                            '}'
                }
            ],

            buttons: [
                {
                    xtype: 'rallybutton',
                    text: 'Chart It!',
                    itemId: 'chartItButton',
                    disabled: true
                }
            ]
        },
        {
            xtype: 'panel',
            itemId: 'chartHolder',
            layout: 'fit',
            height: 400,
            margin: '0 0 200 0'
        }
    ],
    launch: function() {
        this.lumenize = window._lumenize;

        var button = this.down('#chartItButton');
        button.on('click', this.chartItClicked, this);

        // need to add here to get projectOID from environment
        this._addQueryPanel();

        this.retrieveWorkspaceConfig();
    },

    _addQueryPanel: function(){
      var projectOID = this._getProjectOid();

      var queryFieldConfig = {
            fieldLabel: 'Lookback Query',
            itemId: 'queryField',
            anchor:'100%',
            width: 700,
            height: 100,
            value: '{\n'+
                    '     _TypeHierarhcy:"Defect",\n'+
                    '     Priority:{$in:["Resolve Immediately", "High Attention"]},\n'+
                    '     _ProjectHierarchy: '+ projectOID +'\n'+
                    '}'
        };
        this.down('#topLevelPanel').insert(0, queryFieldConfig);
    },

    _getProjectOid: function(){
      // check if the hangman variable has set it from the ALM settings panel
      if( !isNaN('__PROJECT_OID__') ){
        return __PROJECT_OID__;
      }

      // fall back to the app context
      return this.getContext().getProject().ObjectID;
    },

    _getWorkspaceRef: function(){
      // check if the hangman variable has set it from the ALM settings panel
      if( !isNaN('__WORKSPACE_OID__') ){
        return 'workspace/__WORKSPACE_OID__';
      }

      // fall back to the app context
      return this.getContext().getWorkspace()._ref;
    },

    retrieveWorkspaceConfig: function(){
      var workspaceRef = this._getWorkspaceRef();

      // debugger;
      var workspaceConfigStore = Ext.create('Rally.data.WsapiDataStore', {
        model: 'workspaceconfiguration',
        context: {
          workspace: workspaceRef,
          project: null
        },
        listeners:{
          load: this.onWorkspaceConfigLoad,
          scope: this
        },
        fetch: ['ObjectID', 'TimeZone', 'WorkDays'],

        /* doesn't work, so just scope query */
        // filters: [
        //   {
        //       property: 'ObjectID',
        //       value: workspaceObj.ObjectID
        //   }
        // ],

        autoLoad: true
      });

    },

    onWorkspaceConfigLoad: function(store, records){
      if(records.length == 1){
        this.workspaceConfig = records[0];
      }
      else{
        throw new Error("Couldn't load workspace configuration for workspace "+ this.getContext().getWorkspace()._ref);
      }

      // re-enable the chartId button
      this.down('#chartItButton').setDisabled(false);
    },

    chartItClicked: function(){

        var query = this._getFieldValue('query');

        var rangeSpecStr = this._getFieldValue('timelineSpec');
        var rangeSpecJson = Ext.decode(rangeSpecStr);

        // add the workdays from the workspace config if they're not specified
        if(!rangeSpecJson.workDays){
          rangeSpecJson.workDays = this.workspaceConfig.get('WorkDays').split(',');
        }
        var rangeSpec = new this.lumenize.ChartTimeRange(rangeSpecJson);

        var derivedFieldsStr = this._getFieldValue('derivedFields');
        var derivedFields = Ext.decode(derivedFieldsStr);

        var aggregationSpecStr = this._getFieldValue('aggregationSpec');
        var aggregationSpec = Ext.decode(aggregationSpecStr);

        // var selectedFields = this.down('#fieldsField').getValue();
        // if(selectedFields){
        //     if(selectedFields === 'true'){
        //         selectedFields = true;
        //     }
        //     else{
        //         selectedFields = selectedFields.split(', ');
        //     }
        // }

        this.doSearch(query, fields, hydrate, rangeSpec, derivedFields, aggregationSpec);
    },

    _getFieldValue: function(fieldItemId){
      return this.down('#'+ fieldItemId +'Field').getValue();
    },

    // createSortMap: function(csvFields){
    //     var fields = csvFields.split(', ');
    //     var sortMap = {};
    //     for(var field in fields){
    //         if(fields.hasOwnProperty(field)){
    //             sortMap[field] = 1;
    //         }
    //     }

    //     return sortMap;
    // },

    doSearch: function(query, fields, hydrate, rangeSpec, derivedFields, aggregationSpec){
        var wrappedStoreConfig = {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject()
            },
            rawFind: query,
            fields: fields,
            hydrate: hydrate,
            sorters: [
              {
                  property: '_ValidFrom',
                  direction: 'ASC'
              }
            ]
        };

        var transformConfig = {
          rangeSpec: rangeSpec,
          derivedFields: derivedFields,
          aggregations: aggregationSpec,
          timezone: this.workspaceConfig.get('TimeZone'),
          snapshotValidFromField: '_ValidFrom',
          snapshotValidToField: '_ValidTo',
          snapshotUniqueID: 'ObjectID'
        };

        // for transform closure
        var lumenize = this.lumenize;

        var transformStore = Ext.create('Rally.data.custom.TransformStore', {
              wrappedStoreType: 'Rally.data.lookback.SnapshotStoreOtherUrl',
              wrappedStoreConfig: wrappedStoreConfig,

              transform: {
                  method: function(models, transformConfig){

                    var jsonObjects = Ext.Array.pluck(models, 'raw');

                    //TODO figure this out and if other passes are needed
                    return lumenize.timeSeriesCalculator(jsonObjects, transformConfig);

                  },
                  config: transformConfig
              },

              autoLoad: true,

              listeners: {
                scope: this,
                load: this.onTransformStoreLoad
              }
          });
      },

      convertGroupingsToRows: function(groups){
        var rows = [];

        for(var group in groups){
          if( groups.hasOwnProperty(group) ){
            rows.push({
              "ScheduleState": group,
              "ObjectID_Count": groups[group]['ObjectID_$count']
            });
          }
        }

        return { "rows": rows };
      },

      onTransformStoreLoad: function(store, records){
        var rows = this.convertGroupingsToRows(records[0]);

        var inMemoryStore = Ext.create('Ext.data.Store', {
            fields: ["ScheduleState", "ObjectID_Count"],
            data: rows,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'rows'
                }
            }
        });

        var chartConfigStr = this._getFieldValue('chartConfig');
        var chartConfig = Ext.decode(chartConfigStr);


        // var chartConfig = {
        //     xtype : 'rallychart',
        //     id : 'chart',

        //     store: inMemoryStore,

        //     height: 400,
        //     series : [
        //     {
        //       type : 'column',
        //       yField : 'ObjectID_Count',
        //       name : 'Count',
        //       visible : true
        //     },
        //     {
        //       type : 'line',
        //       yField : 'ObjectID_Count',
        //       name : 'Count',
        //       visible : true
        //     }
        //     ],

        //     xField : 'ScheduleState',
        //     chartConfig : {
        //       chart : {
        //         marginRight : 130,
        //         marginBottom : 250,
        //         zoomType : 'x',
        //         animation : {
        //           duration : 1500,
        //           easing : 'swing'
        //         }
        //       },
        //       title : {
        //         text : 'Schedule State Counts',
        //         align: 'center'
        //       },
        //       xAxis : [{
        //         title : {
        //           text : 'ScheduleState',
        //           margin : 40
        //         },
        //         labels : {
        //           align: 'right',
        //           rotation : 300
        //         }
        //       }],
        //       yAxis : {
        //         title : {
        //           text : 'Count'
        //         },
        //         plotLines : [{
        //           value : 0,
        //           width : 1,
        //           color : '#808080'
        //         }]
        //       },
        //       plotOptions : {
        //           column: {
        //               color: '#F00'
        //           },
        //         series : {
        //           animation : {
        //             duration : 3000,
        //             easing : 'swing'
        //           }
        //         }
        //       },
        //       tooltip : {
        //         formatter : function() {
        //           return this.x + ': ' + this.y;
        //         }
        //       },
        //       legend : {
        //         layout : 'vertical',
        //         align : 'right',
        //         verticalAlign : 'top',
        //         x : -10,
        //         y : 100,
        //         borderWidth : 0
        //       }
        //     }
        //   };

        var chartHolder = this.down('#chartHolder');
        chartHolder.removeAll(true);
        chartHolder.add(chartConfig);
    }

});
