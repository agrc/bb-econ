define([
    'agrc/widgets/map/BaseMap',

    'app/config',

    'dojo/_base/lang',
    'dojo/dom-style',
    'dojo/topic',

    'esri/geometry/Point',
    'esri/graphic',
    'esri/layers/ArcGISDynamicMapServiceLayer'
], function(
    BaseMap,

    config,

    lang,
    domStyle,
    topic,

    Point,
    Graphic,
    ArcGISDynamicMapServiceLayer
) {
    return {
        // map: BaseMap
        map: null,

        // dLayers: Object
        //      dynamic layers
        dLayers: {},

        initMap: function(mapDiv) {
            // summary:
            //      Sets up the map
            console.info('app/mapController:initMap', arguments);

            this.map = new BaseMap(mapDiv, {
                defaultBaseMap: 'Terrain',
                showAttribution: false,
                center: new Point(config.initialExtent.center, {
                    wkid: 26912
                }),
                scale: config.initialExtent.scale
            });
            this.map.disableScrollWheelZoom();

            // force map to auto height
            // required for proper alignment in firefox
            domStyle.set(mapDiv, 'height', 'auto');
            this.map.resize();

            topic.subscribe(config.topics.layers.resize, 
                lang.hitch(this.map, 'resize'));

            topic.subscribe(config.topics.addLayer,
                lang.hitch(this, 'addLayer'));

            topic.subscribe(config.topics.layer.toggleDynamicLayer, 
                lang.hitch(this, 'toggleDynamicLayer'));

            topic.subscribe(config.topics.slider.change,
                lang.hitch(this, 'onSliderChange'));

            this.map.on('click', lang.hitch(this, 'onMapClick'));
        },
        addLayer: function (lyr) {
            // summary:
            //      description
            // lyr: Layer
            console.log('app/mapController:addLayer', arguments);
        
            this.map.addLayer(lyr);
            this.map.addLoaderToLayer(lyr);
        },
        toggleDynamicLayer: function (layerId, show, groupName) {
            // summary:
            //      sets the appropriate visible layers on the dynamic service
            // layerId: String
            //      The id (or id's separated by a comma)
            // show: Boolean
            console.log('app/mapController:toggleDynamicLayer', arguments);
        
            var dLayer;
            var that = this;
            if (!this.dLayers[groupName]) {
                dLayer = this.dLayers[groupName] = new ArcGISDynamicMapServiceLayer(config.urls.mapService, {
                    opacity: 0.5
                });
                this.map.addLayer(dLayer);
                this.map.addLoaderToLayer(dLayer);
                dLayer.on('load', function () {
                    that.toggleDynamicLayer(layerId, show, groupName);
                });
                return;
            } else {
                dLayer = this.dLayers[groupName];
            }

            var toggleIds = layerId.split(',').map(function (idTxt) {
                return parseInt(idTxt, 10);
            });
            var layerIds;

            if (show) {
                layerIds = toggleIds.concat(dLayer.visibleLayers);
            } else {
                layerIds = dLayer.visibleLayers.filter(function (id) {
                    return toggleIds.indexOf(id) === -1;
                });
            }

            dLayer.setVisibleLayers(layerIds);
        },
        onSliderChange: function (newValue, groupName) {
            // summary:
            //      the user is changing the tranparency slider
            // newValue: Number
            //      0 - 100
            console.log('mapController:onSliderChange', arguments);
        
            this.dLayers[groupName].setOpacity(newValue/100);
        },
        onMapClick: function (evt) {
            // summary:
            //      user clicks on the map
            // evt: MapClick Event Object
            console.log('mapController:onMapClick', arguments);
        
            this.map.graphics.clear();
            this.map.graphics.add(new Graphic(evt.mapPoint, config.currentLocationSymbol));
            topic.publish(config.topics.mapClick, evt.mapPoint);
        }
    };
});