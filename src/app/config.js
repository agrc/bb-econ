/* jshint maxlen:false */
define([
    'dojo/has',
    'dojo/text!app/templates/FiberLegend.html',

    'esri/config',
    'esri/symbols/PictureMarkerSymbol'
], function (
    has,
    fiberLegendTxt,

    esriConfig,
    PictureMarkerSymbol
) {
    // force api to use CORS on mapserv thus removing the test request on app load
    // e.g. http://mapserv.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push('mapserv.utah.gov');

    var markerSymbolWidth = 24;
    var markerSymbolHeight = 35;

    var apiKey;
    var domain;
    if (has('agrc-build') === 'prod') {
        // mapserv.utah.gov
        apiKey = 'AGRC-A94B063C533889';
        domain = 'http://mapserv.utah.gov/';
    } else if (has('agrc-build') === 'stage') {
        // test.mapserv.utah.gov
        apiKey = 'AGRC-AC122FA9671436';
        domain = '/';
    } else {
        // localhost
        apiKey = 'AGRC-7F8F0DA6655711';
        domain = '/';
    }

    window.AGRC = {
        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '0.0.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: apiKey, // acquire at developer.mapserv.utah.gov

        // initialExtent: Object
        //      Defines in what extent the map is initially loaded
        initialExtent: {
            scale: 144447.638572,
            center: [425132, 4512466]
        },
        topics: {
            layers: {
                resize: 'layers.resize'
            },
            addLayer: 'addLayer',
            layer: {
                toggleDynamicLayer: 'layer.toggleDynamicLayer'
            },
            slider: {
                change: 'slider.change'
            },
            mapClick: 'mapContoller.mapClick'
        },
        messages: {
            noValueFound: '[No ${0} found]',
            reportError: 'There was an error generating the report!'
        },
        urls: {
            mapService: domain + 'arcgis/rest/services/BBEcon/MapService/MapServer',
            gpService: domain + 'arcgis/rest/services/BBEcon/GenerateReport/GPServer/Generate Report/execute'
        },
        zoomLocationsIndex: 11,
        zoomLocationsField: 'Name',
        currentLocationSymbol: new PictureMarkerSymbol(
            'app/resources/img/markers/currentLocation.svg',
            32,
            44
        ),
        featureClassNames: {
            city: 'SGID10.BOUNDARIES.Municipalities',
            zip: 'SGID10.BOUNDARIES.ZipCodes',
            county: 'SGID10.BOUNDARIES.Counties'
        },
        fieldNames: {
            city: {NAME: 'NAME'},
            zip: {ZIP5: 'ZIP5'},
            county: {NAME: 'NAME'}
        },
        markerSymbolWidth: markerSymbolWidth,
        markerSymbolHeight: markerSymbolHeight,
        groups: [{
            groupClass: 'broadband',
            name: 'Broadband',
            layers: [{
                name: 'Fiber',
                type: 'dynamic',
                layerId: '0, 1',
                onByDefault: true,
                legend: fiberLegendTxt
            }, {
                name: 'All Non-Mobile Broadband (Includes Fiber, DSL, Cable, and Fixed Wireless)',
                type: 'dynamic',
                layerId: '2, 3, 4',
                onByDefault: false
            }]
        }, {
            groupClass: 'utilities',
            name: 'Utilities',
            layers: [{
                name: 'Natural Gas Service Areas',
                type: 'dynamic',
                layerId: '12',
                checkboxType: 'radio'
            }, {
                name: 'Electric Utility Territory',
                type: 'dynamic',
                layerId: '14',
                checkboxType: 'radio'
            }, {
                name: 'Local Exchange Areas',
                type: 'dynamic',
                layerId: '15',
                checkboxType: 'radio'
            }, {
                name: 'Culinary Water',
                type: 'dynamic',
                layerId: '13',
                checkboxType: 'radio'
            }]
        }, {
            groupClass: 'transportation',
            name: 'Transportation',
            layers: [{
                name: 'Airports',
                type: 'feature',
                layerId: '5',
                marker: 'airports.svg'
            }, {
                // this is hidden and linked to the layer above
                // see app/App:postCreate
                name: 'slc airport (hidden)',
                type: 'feature',
                layerId: '21',
                marker: 'slcairport.svg',
                markerWidth: 32,
                markerHeight: 44,
                hidden: true
            }, {
                name: 'Light/Commuter Rail',
                type: 'feature',
                layerId: '17',
                marker: 'lightrail.svg'
            }, {
                // this is hidden and linked to the layer above
                // see app/App:postCreate
                name: 'commuter rail (hidden)',
                type: 'dynamic',
                layerId: '18',
                defaultOpacity: 1,
                hidden: true
            }, {
                name: 'Heavy Rail',
                type: 'dynamic',
                layerId: '16',
                defaultOpacity: 1
            }, {
                name: 'Major Roads Buffer',
                type: 'dynamic',
                layerId: '22'
            }]
        }, {
            groupClass: 'demographics',
            name: 'Workforce',
            layers: [{
                name: 'Higher Education Schools',
                type: 'feature',
                layerId: '6',
                marker: 'universities.svg'
            }, {
                name: 'Enterprise Zones',
                type: 'dynamic',
                layerId: '19'
            }]
        }, {
            groupClass: 'lifestyle',
            name: 'Lifestyle',
            layers: [{
                name: 'State Parks',
                type: 'feature',
                layerId: '7',
                marker: 'stateparks.svg'
            }, {
                name: 'National Parks & Monuments',
                type: 'feature',
                layerId: '20',
                marker: 'nationalparks.svg'
            }, {
                name: 'Ski Areas',
                type: 'feature',
                layerId: '8',
                marker: 'skiing.svg'
            }, {
                name: 'Golf Courses',
                type: 'feature',
                layerId: '9',
                marker: 'golfing.svg'
            }, {
                name: 'Hospitals',
                type: 'feature',
                layerId: '10',
                marker: 'hospitals.svg'
            }]
        }]
    };

    window.AGRC.currentLocationSymbol.setOffset(0, 22);

    return window.AGRC;
});
