Ext.define('Rally.data.lookback.SnapshotStoreOtherUrl', {
        extend: 'Rally.data.lookback.SnapshotStore',

        constructor: function(config) {
            this.callParent([config]);
            // temporary override needed since need different server and workspace
            this.proxy.url = 'https://rally1.rallydev.com/analytics2/v2.0/service/rally/workspace/41529001/artifact/snapshot/query';
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
                // query text area will be added here by launch()

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
                           '        "name": "p1",\n'+
                           '        "f": function (row) {\n'+
                           '         if(row.Priority == "Resolve Immediately"){\n'+
                           '           return 1;\n'+
                           '         }\n'+
                           '         else{\n'+
                           '           return 0;\n'+
                           '         }\n'+
                           '      }\n'+
                           '    },\n'+
                           '    {\n'+
                           '        "name": "p2",\n'+
                           '        "f": function (row) {\n'+
                           '         if(row.Priority == "High Attention"){\n'+
                           '           return 1;\n'+
                           '         }\n'+
                           '         else{\n'+
                           '           return 0;\n'+
                           '         }\n'+
                           '       }\n'+
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
                           '        "as": "p1Count",\n'+
                           '        "f": "$sum",\n'+
                           '        "field": "p1"\n'+
                           '    },\n'+
                           '    {\n'+
                           '        "as": "p2Count",\n'+
                           '        "f": "$sum",\n'+
                           '        "field": "p2"\n'+
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
                           '    "xtype": "rallychart",\n'+
                           '    "itemId": "chart",\n'+
                           '    "height": 400,\n'+
                           '    "chartConfig": {\n'+
                           '        "chart": {\n'+
                           '            "defaultSeriesType": "line"\n'+
                           '        },\n'+
                           '        "credits": {\n'+
                           '            "enabled": false\n'+
                           '        },\n'+
                           '        "title": {\n'+
                           '            "text": "Count of P1s and P2s over time"\n'+
                           '        },\n'+
                           '        "xAxis": {\n'+
                           '            "tickmarkPlacement": "on",\n'+
                           '            "title": {\n'+
                           '                "enabled": false\n'+
                           '            }\n'+
                           '        },\n'+
                           '        "yAxis": [\n'+
                           '            {\n'+
                           '                "title": {\n'+
                           '                    "text": "Count"\n'+
                           '                },\n'+
                           '                "min": 0\n'+
                           '            }\n'+
                           '        ]\n'+
                           '    },\n'+
                           '    "series": [\n'+
                           '        {\n'+
                           '            "name": "P1 Count",\n'+
                           '            "id": "p1CountSeries",\n'+
                           '            "yField": "p1Count",\n'+
                           '            "visible": true\n'+
                           '        },\n'+
                           '        {\n'+
                           '            "name": "P2 Count",\n'+
                           '            "id": "p2CountSeries",\n'+
                           '            "yField": "p2Count",\n'+
                           '            "visible": true\n'+
                           '        }\n'+
                           '    ]\n'+
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
        this.lumenize.ChartTime.setTZPath("pointless");

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
                    '     _TypeHierarchy:"Defect",\n'+
                    '     Priority:{$in:["Resolve Immediately", "High Attention"]},\n'+
                    '     State:{$in:["Open", "Submitted"]},\n'+
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

        var query = this._getJsonFieldValue('query');
        var fields = this._getJsonFieldValue('fields');
        var hydrate = this._getJsonFieldValue('hydrate');

        var rangeSpecJson = this._getJsonFieldValue('timelineSpec');

        // add the workdays from the workspace config if they're not specified
        if(!rangeSpecJson.workDays){
          rangeSpecJson.workDays = this.workspaceConfig.get('WorkDays').split(',');
        }
        var rangeSpec = new this.lumenize.ChartTimeRange(rangeSpecJson);

        var derivedFields = this._getJsonWithFunctionsFieldValue('derivedFields');
        var aggregationSpec = this._getJsonFieldValue('aggregationSpec');

        this.doSearch(query, fields, hydrate, rangeSpec, derivedFields, aggregationSpec);
    },

    _getFieldValue: function(fieldItemId){
      return this.down('#'+ fieldItemId +'Field').getValue();
    },

    _getJsonFieldValue: function(fieldItemId){
      return Ext.decode( this._getFieldValue(fieldItemId) );
    },

    _getJsonWithFunctionsFieldValue: function(fieldItemId){
      return eval( this._getFieldValue(fieldItemId) );
    },

    doSearch: function(query, fields, hydrate, rangeSpec, derivedFields, aggregationSpec){
        var wrappedStoreConfig = {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject()
            },
            rawFind: query,
            fetch: fields,
            hydrate: hydrate,
            sorters: [
              {
                  property: '_ValidFrom',
                  direction: 'ASC'
              }
            ],
            pageSize: 20000
        };

        var transformConfig = {
          rangeSpec: rangeSpec,
          derivedFields: derivedFields,
          aggregationSpec: aggregationSpec,
          timezone: this.workspaceConfig.get('TimeZone'),
          snapshotValidFromField: '_ValidFrom',
          snapshotValidToField: '_ValidTo',
          snapshotUniqueID: 'ObjectID'
        };

        // for transform closure
        var app = this;

        var transformStore = Ext.create('Rally.data.custom.TransformStore', {
              wrappedStoreType: 'Rally.data.lookback.SnapshotStoreOtherUrl',
              wrappedStoreConfig: wrappedStoreConfig,

              transform: {
                  method: function(models, transformConfig){

                    var jsonObjects = Ext.Array.pluck(models, 'raw');
                    var calculationResult = app.lumenize.timeSeriesCalculator(jsonObjects, transformConfig);

                    //TODO handle future rename of listOfAtCTs and aggreationAtArray
                    app.categories = Ext.Array.map(calculationResult.listOfAtCTs,
                                                   function(chartTime){
                                                      return chartTime.toString();
                                                   });
                    return calculationResult.aggregationAtArray;

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

      _setPath: function(obj, pathStr, defaultValue){
        var path = pathStr.split('.');
        for(var i=0, l=path.length; i < l; ++i){
          var currentField = path[i];
          if(!obj[currentField]){
            // default to an empty object if not the last field
            obj[currentField] = (i < l-1) ? {} : defaultValue;
          }
          obj = obj[currentField];
        }
      },

      onTransformStoreLoad: function(store, records){
        var rallyChartConfig = this._getJsonFieldValue('chartConfig');
        this._setPath(rallyChartConfig, "chartConfig.xAxis.categories", this.categories);
        this._setPath(rallyChartConfig, "store", store);

        var chartHolder = this.down('#chartHolder');
        chartHolder.removeAll(true);
        chartHolder.add(rallyChartConfig);
    }

});
