(function(){
Ext.define('Rally.data.lookback.SnapshotStoreOtherUrl', {
        extend: 'Rally.data.lookback.SnapshotStore',

        constructor: function(config) {
            this.callParent([config]);
            // temporary override needed since need different server and workspace
            this.proxy.url = 'https://rally1.rallydev.com/analytics2/v2.0/service/rally/workspace/41529001/artifact/snapshot/query';
        }
});

var predefinedChartsStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'values'],
    data : [
        {
          name: 'P1 & P2 Count Chart',
          values: {
            find: '{\n'+
                  '     _TypeHierarchy:"Defect",\n'+
                  '     Priority:{$in:["Resolve Immediately", "High Attention"]},\n'+
                  '     State:{$in:["Open", "Submitted"]},\n'+
                  '     _ProjectHierarchy: __PROJECT_OID__\n'+
                  '}',
            fields: '["_ValidFrom", "_ValidTo", "ObjectID", "Priority"]',
            hydrate: '["Priority"]',
            timelineSpec: '{\n'+
                          '    "pastEnd": "this day in Pacific/Fiji",\n'+
                          '    "limit": 22,\n'+
                          '    "workdays": ["Monday","Tuesday", "Wednesday", "Thursday","Friday"],\n'+
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
                          '}',
            derivedFields: '[\n'+
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
                           ']',
            aggregationSpec: '[\n'+
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
                             ']',
            chartConfig: '{\n'+
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
        },

        {
          name: 'Burnup Chart',
          values: {
            find: '{\n'+
                  '    "_ItemHierarchy": 5438613816,\n'+
                  '    "_TypeHierarchy": "HierarchicalRequirement",\n'+
                  '    "Parent": null\n'+
                  '}',
            fields: '[\n'+
                    '    "_ValidFrom",\n'+
                    '    "_ValidTo",\n'+
                    '    "ObjectID",\n'+
                    '    "ScheduleState"\n'+
                    ']',
            hydrate: '[\n'+
                     '    "ScheduleState"\n'+
                     ']',
            timelineSpec: '{\n'+
                          '    "pastEnd": "this day in Pacific/Fiji",\n'+
                          '    "limit": 160,\n'+
                          '    "workdays": [\n'+
                          '        "Monday",\n'+
                          '        "Tuesday",\n'+
                          '        "Wednesday",\n'+
                          '        "Thursday",\n'+
                          '        "Friday"\n'+
                          '    ],\n'+
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
                          '}',
            derivedFields: '[\n'+
                           '    {\n'+
                           '        "name": "accepted",\n'+
                           '        "f": function (row) {\n'+
                           '         if(row.ScheduleState == "Accepted" || row.ScheduleState == "Released"){\n'+
                           '           return 1;\n'+
                           '         }\n'+
                           '         else{\n'+
                           '           return 0;\n'+
                           '         }\n'+
                           '      }\n'+
                           '    }\n'+
                           ']',
            aggregationSpec: '[\n'+
                             '    {\n'+
                             '        "as": "scope",\n'+
                             '        "f": "$count",\n'+
                             '        "field": "ObjectID"\n'+
                             '    },\n'+
                             '    {\n'+
                             '        "as": "accepted",\n'+
                             '        "f": "$sum",\n'+
                             '        "field": "accepted"\n'+
                             '    }\n'+
                             ']',
            chartConfig: '{\n'+
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
                         '            "text": "Burnup"\n'+
                         '        },\n'+
                         '        "xAxis": {\n'+
                         '            "tickmarkPlacement": "on",\n'+
                         '            "tickInterval": 14,\n'+
                         '            "title": {\n'+
                         '                "enabled": false\n'+
                         '            }\n'+
                         '        },\n'+
                         '        "yAxis": [\n'+
                         '            {\n'+
                         '                "title": {\n'+
                         '                    "text": "Counts of Leaf Stories"\n'+
                         '                },\n'+
                         '                "min": 0\n'+
                         '            }\n'+
                         '        ]\n'+
                         '    },\n'+
                         '    "series": [\n'+
                         '        {\n'+
                         '            "name": "Scope",\n'+
                         '            "id": "scopeSeries",\n'+
                         '            "yField": "scope",\n'+
                         '            "visible": true\n'+
                         '        },\n'+
                         '        {\n'+
                         '            "name": "Accepted",\n'+
                         '            "id": "acceptedSeries",\n'+
                         '            "yField": "accepted",\n'+
                         '            "visible": true\n'+
                         '        }\n'+
                         '    ]\n'+
                         '}'
          }
        },

        {
          name: 'Custom (clear all fields)',
          values: {
            find: '',
            fields: '',
            hydrate: '',
            timelineSpec: '',
            derivedFields: '',
            aggregationSpec: '',
            chartConfig: ''
          }
        }
    ]
});

var TEXT_AREA_WIDTH = 500;
var TEXT_AREA_HEIGHT = 100;

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
          bodyPadding: 15,
          items:[
            {
              xtype: 'combo',
              itemId: 'predefinedChartCombo',
              fieldLabel: 'Predefined Chart',
              store: predefinedChartsStore,
              queryMode: 'local',
              displayField: 'name',
              valueField: 'values',
              forceSelection: true
            }
          ]
        },
        {
            xtype: 'panel',
            itemId: 'accordianPanel',
            layout: {
              type: 'accordion',
              titleCollapse: true,
              animate: true,
              multi: true,
              collapseFirst: true
              // manageOverflow:2
            },
            border: true,
            defaultType: 'panel',
            defaults:{
              //collapsed: true
            },
            items: [
              {
                title: 'Lookback Query',
                itemId: 'lookbackQueryPanel',
                collapsed: false,
                layout: {
                  type: 'hbox',
                  align: 'middle',
                  padding: '0 5px'
                },
                defaultType: 'textarea',
                defaults: {
                    labelWidth: 30
                },
                bodyPadding: 5,
                items: [
                    // query text area will be added here by launch()

                    {
                      xtype: 'panel',
                      border: false,
                      itemId: 'fieldsPanel',
                      layout: {
                        type: 'vbox',
                        padding: '0 15px'
                      },
                      defaultType: 'textfield',
                      defaults: {
                        labelWidth: 45,
                        width: TEXT_AREA_WIDTH
                      },
                      items: [
                        {
                          fieldLabel: 'Fields',
                          itemId: 'fieldsField'
                        },
                        {
                          fieldLabel: 'Hydrate',
                          itemId: 'hydrateField'
                        }
                      ]
                    }
                ]

              },
              {
                title: 'Timeline Spec',
                itemId: 'timelinePanel',
                defaultType: 'textarea',
                bodyPadding: 5,
                items: [
                  {
                    itemId: 'timelineSpecField',
                    width: TEXT_AREA_WIDTH,
                    height: 100,
                    resizable: true
                  }
                ]
              },
              {
                title: 'Data Transform',
                itemId: 'dataTransformPanel',
                layout: {
                  type: 'hbox',
                  align: 'middle',
                  defaultMargins: '5 0 5 15'
                },
                defaultType: 'textarea',
                defaults: {
                    labelWidth: 70,
                    width: TEXT_AREA_WIDTH,
                    height: TEXT_AREA_HEIGHT
                },
                items:[
                  {
                      fieldLabel: 'Derived Fields',
                      itemId: 'derivedFieldsField'
                  },
                  {
                      fieldLabel: 'Aggregation Spec',
                      itemId: 'aggregationSpecField',
                      margins: '5 15 5 15'
                  }
                ]
              },
              {
                title: 'Chart Config',
                defaultType: 'textarea',
                bodyPadding: '5 15',
                items: [
                  {
                    itemId: 'chartConfigField',
                    width: TEXT_AREA_WIDTH,
                    height: TEXT_AREA_HEIGHT,
                    resizable: true
                  }
                ]
              }
            ],
            buttons: [
                {
                    xtype: 'rallybutton',
                    text: 'Chart It!',
                    itemId: 'chartItButton',
                    disabled: true
                },
                '->' // push the button left with a spacer
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

        var predefinedChartCombo = this.down('#predefinedChartCombo');
        predefinedChartCombo.on('change', this._onPredefinedChartComboSelect, this);
        var recordSelected = predefinedChartCombo.getStore().getAt(0);
        predefinedChartCombo.select(recordSelected);

        this.retrieveWorkspaceConfig();
    },

    _addQueryPanel: function(){
      var projectOID = this._getProjectOid();

      var queryFieldConfig = {
            fieldLabel: 'Find',
            itemId: 'findField',
            width: TEXT_AREA_WIDTH,
            height: TEXT_AREA_HEIGHT,
            // resizable: true,
            value: '{\n'+
                    '     _TypeHierarchy:"Defect",\n'+
                    '     Priority:{$in:["Resolve Immediately", "High Attention"]},\n'+
                    '     State:{$in:["Open", "Submitted"]},\n'+
                    '     _ProjectHierarchy: '+ projectOID +'\n'+
                    '}'
        };
        this.down('#lookbackQueryPanel').insert(0, queryFieldConfig);
    },

    _onPredefinedChartComboSelect: function(combo, newValue, oldValue){

        this.setFieldValues(newValue.find, newValue.fields, newValue.hydrate, newValue.timelineSpec,
                            newValue.derivedFields, newValue.aggregationSpec, newValue.chartConfig);
    },

    setFieldValues: function(find, fields, hydrate, timelineSpec, derivedFields, aggregationSpec, chartConfig){
      this._setFieldValue('find', find);
      this._setFieldValue('fields', fields);
      this._setFieldValue('hydrate', hydrate);
      this._setFieldValue('timelineSpec', timelineSpec);
      this._setFieldValue('derivedFields', derivedFields);
      this._setFieldValue('aggregationSpec', aggregationSpec);
      this._setFieldValue('chartConfig', chartConfig);
    },

    _getField: function(fieldId){
      return this.down('#'+ fieldId +'Field');
    },

    _setFieldValue: function(fieldId, value){
      this._getField(fieldId).setValue(value);
    },

    _getProjectOid: function(){
      // check if the hangman variable has set it from the ALM settings panel
      if( !isNaN('__PROJECT_OID__') ){
        return __PROJECT_OID__;
      }

      // fall back to the app context
      return this.getContext().getProject().ObjectID;
    },

    _getWorkspaceOid: function(){
      // check if the hangman variable has set it from the ALM settings panel
      if( !isNaN('__WORKSPACE_OID__') ){
        return __WORKSPACE_OID__;
      }

      // fall back to the app context
      return this.getContext().getWorkspace().ObjectID;
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
        var find = this._getJsonFieldValue('find');
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

        this.doSearch(find, fields, hydrate, rangeSpec, derivedFields, aggregationSpec);
    },

    _replaceHangmen: function(str){
      var projectOid = this._getProjectOid();
      // need to build the regex this way rather than a literal to avoid the ALM hangman preprocessor
      var projectOidRegEx = new RegExp('_'+'_PROJECT_OID__', 'g');
      var result = str.replace(projectOidRegEx, projectOid);

      var workspaceOid = this._getWorkspaceOid();
      var workspaceOidRegEx = new RegExp('_'+'_WORKSPACE_OID__', 'g');
      result = result.replace(workspaceOidRegEx, workspaceOid);

      return result;
    },

    _getFieldValue: function(fieldId){
      var str = this._getField(fieldId).getValue();
      return this._replaceHangmen(str);
    },

    _getJsonFieldValue: function(fieldId){
      return Ext.decode( this._getFieldValue(fieldId) );
    },

    _getJsonWithFunctionsFieldValue: function(fieldId){
      return eval( this._getFieldValue(fieldId) );
    },

    doSearch: function(find, fields, hydrate, rangeSpec, derivedFields, aggregationSpec){
        var wrappedStoreConfig = {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject()
            },
            rawFind: find,
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
})();
