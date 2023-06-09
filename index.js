var pureCoverage = false;
// if this is just a coverage or a group of them, disable a few items,
// and default to jpeg format
var format = 'image/png';
var bounds = [97.352221, 26.049173,
  108.542372, 34.314673];
if (pureCoverage) {
  document.getElementById('antialiasSelector').disabled = true;
  document.getElementById('jpeg').selected = true;
  format = "image/jpeg";
}

var supportsFiltering = true;
if (!supportsFiltering) {
  document.getElementById('filterType').disabled = true;
  document.getElementById('filter').disabled = true;
  document.getElementById('updateFilterButton').disabled = true;
  document.getElementById('resetFilterButton').disabled = true;
}

var mousePositionControl = new ol.control.MousePosition({
  className: 'custom-mouse-position',
  target: document.getElementById('location'),
  coordinateFormat: ol.coordinate.createStringXY(5),
  undefinedHTML: '&nbsp;'
});
var untiled = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    ratio: 1,
    url: 'http://localhost:8081/geoserver/Chinamap/wms',
    params: {
      'FORMAT': format,
      'VERSION': '1.1.1',
      "STYLES": '',
      "LAYERS": 'Chinamap:SiChuanP',
      "exceptions": 'application/vnd.ogc.se_inimage',
    }
  })
});
var tiled = new ol.layer.Tile({
  visible: false,
  source: new ol.source.TileWMS({
    url: 'http://localhost:8081/geoserver/Chinamap/wms',
    params: {
      'FORMAT': format,
      'VERSION': '1.1.1',
      tiled: true,
      "STYLES": '',
      "LAYERS": 'Chinamap:SiChuanP',
      "exceptions": 'application/vnd.ogc.se_inimage',
      tilesOrigin: 97.352221 + "," + 26.049173
    }
  })
});
var projection = new ol.proj.Projection({
  code: 'EPSG:4326',
  units: 'degrees',
  axisOrientation: 'neu',
  global: true
});
var map = new ol.Map({
  controls: ol.control.defaults({
    attribution: false
  }).extend([mousePositionControl]),
  target: 'map',
  layers: [
    untiled,
    tiled
  ],
  view: new ol.View({
    projection: projection
  })
});
map.getView().on('change:resolution', function (evt) {
  var resolution = evt.target.get('resolution');
  var units = map.getView().getProjection().getUnits();
  var dpi = 25.4 / 0.28;
  var mpu = ol.proj.METERS_PER_UNIT[units];
  var scale = resolution * mpu * 39.37 * dpi;
  if (scale >= 9500 && scale <= 950000) {
    scale = Math.round(scale / 1000) + "K";
  } else if (scale >= 950000) {
    scale = Math.round(scale / 1000000) + "M";
  } else {
    scale = Math.round(scale);
  }
  document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
});
map.getView().fit(bounds, map.getSize());
map.on('singleclick', function (evt) {
  document.getElementById('nodelist').innerHTML = "Loading... please wait...";
  var view = map.getView();
  var viewResolution = view.getResolution();
  var source = untiled.get('visible') ? untiled.getSource() : tiled.getSource();
  var url = source.getGetFeatureInfoUrl(
    evt.coordinate, viewResolution, view.getProjection(),
    { 'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50 });
  if (url) {
    document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
  }
});

// sets the chosen WMS version
function setWMSVersion(wmsVersion) {
  map.getLayers().forEach(function (lyr) {
    lyr.getSource().updateParams({ 'VERSION': wmsVersion });
  });
  if (wmsVersion == "1.3.0") {
    origin = bounds[1] + ',' + bounds[0];
  } else {
    origin = bounds[0] + ',' + bounds[1];
  }
  tiled.getSource().updateParams({ 'tilesOrigin': origin });
}

// Tiling mode, can be 'tiled' or 'untiled'
function setTileMode(tilingMode) {
  if (tilingMode == 'tiled') {
    untiled.set('visible', false);
    tiled.set('visible', true);
  } else {
    tiled.set('visible', false);
    untiled.set('visible', true);
  }
}

function setAntialiasMode(mode) {
  map.getLayers().forEach(function (lyr) {
    lyr.getSource().updateParams({ 'FORMAT_OPTIONS': 'antialias:' + mode });
  });
}

// changes the current tile format
function setImageFormat(mime) {
  map.getLayers().forEach(function (lyr) {
    lyr.getSource().updateParams({ 'FORMAT': mime });
  });
}

function setStyle(style) {
  map.getLayers().forEach(function (lyr) {
    lyr.getSource().updateParams({ 'STYLES': style });
  });
}

function setWidth(size) {
  var mapDiv = document.getElementById('map');
  var wrapper = document.getElementById('wrapper');

  if (size == "auto") {
    // reset back to the default value
    mapDiv.style.width = null;
    wrapper.style.width = null;
  }
  else {
    mapDiv.style.width = size + "px";
    wrapper.style.width = size + "px";
  }
  // notify OL that we changed the size of the map div
  map.updateSize();
}

function setHeight(size) {
  var mapDiv = document.getElementById('map');
  if (size == "auto") {
    // reset back to the default value
    mapDiv.style.height = null;
  }
  else {
    mapDiv.style.height = size + "px";
  }
  // notify OL that we changed the size of the map div
  map.updateSize();
}

function updateFilter() {
  if (!supportsFiltering) {
    return;
  }
  var filterType = document.getElementById('filterType').value;
  var filter = document.getElementById('filter').value;
  // by default, reset all filters
  var filterParams = {
    'FILTER': null,
    'CQL_FILTER': null,
    'FEATUREID': null
  };
  if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "") {
    if (filterType == "cql") {
      filterParams["CQL_FILTER"] = filter;
    }
    if (filterType == "ogc") {
      filterParams["FILTER"] = filter;
    }
    if (filterType == "fid")
      filterParams["FEATUREID"] = filter;
  }
  // merge the new filter definitions
  map.getLayers().forEach(function (lyr) {
    lyr.getSource().updateParams(filterParams);
  });
}

function resetFilter() {
  if (!supportsFiltering) {
    return;
  }
  document.getElementById('filter').value = "";
  updateFilter();
}

// shows/hide the control panel
function toggleControlPanel() {
  var toolbar = document.getElementById("toolbar");
  if (toolbar.style.display == "none") {
    toolbar.style.display = "block";
  }
  else {
    toolbar.style.display = "none";
  }
  map.updateSize()
}

/*添加绘画*/
// 添加一个绘制的线使用的layer
var drawLayer = new ol.layer.Vector({
  //layer所对应的source
  source: new ol.source.Vector(),

})
//把layer加入到地图中
map.addLayer(drawLayer);

var draw = undefined;
function drawFeature(feature){
  map.un('click',handle);
  if(draw!=undefined){
    map.removeInteraction(draw);
  }
  draw = new ol.interaction.Draw({
    source:drawLayer.getSource(),
    type:feature
  });
  map.addInteraction(draw);
}

/*绘制标记*/
var vectorLayer = undefined;
function drawMarkers() {
  var vectorSource = new ol.source.Vector();
  var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point([104, 30.567], "XY"),
    name: 'my mark'
  });
  vectorSource.addFeature(iconFeature);

  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 0.75,
      src: "./marker.png"
    }),
  })
  vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle
  });
  map.addLayer(vectorLayer);
}
drawMarkers();

//popup
var overlay = undefined;
var contaier = null;
var content = null;
var closer = null;
var htmlContent = null;
function popupMsg() {
  container = document.getElementById("popup");
  content = document.getElementById("popup-content");
  closer = document.getElementById("popup-closer");
  htmlContent = "<div style='border:0px solid blue;background-color:white;'>hello</div>";
  overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    positioning: 'bottom-center',
    stopEvent: true,
    autoPanAnimation: { duration: 250 }
  });
  closer.onclick = function () {
    removePopup();
  };
  var removePopup = function () {
    overlay.setPosition(undefined);
    // map.removeOverlay(overlay);
  }
}
popupMsg();
//鼠标点击的逻辑
function handle(e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var count = 0;
  map.forEachFeatureAtPixel(pixel, function (feature) {
    var coordinate = e.coordinate;
    content.innerHTML = htmlContent;
    if(overlay==null){
      overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: true,
        autoPanAnimation: { duration: 250 }
      });
    }
    overlay.setPosition(coordinate);
    map.addOverlay(overlay);
    count = count + 1;
    console.log(count);
  })
}
function popupon(){
  map.removeInteraction(draw);
  map.on("click",handle);
}