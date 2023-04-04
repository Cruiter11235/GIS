<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="//localhost:8081/geoserver/openlayers3/ol.css" type="text/css">
    <link rel="stylesheet" href="./index.css" type="text/css">
    <title>OpenLayers map preview</title>
</head>

<body>
    <div id="buttons">
        <button onclick="drawFeature('Point')">Point</button>
        <button onclick="drawFeature('LineString')">LineString</button>
        <button onclick="drawFeature('Polygon')">Polygon</button>
        <button onclick="drawFeature('Circle')">Circle</button>
        <button onclick="popupon()">popupMsg</button>
    </div>
    <div id="toolbar" style="display: none;">
        <ul>
            <li>
                <a>WMS version:</a>
                <select id="wmsVersionSelector" onchange="setWMSVersion(value)">
                    <option value="1.1.1">1.1.1</option>
                    <option value="1.3.0">1.3.0</option>
                </select>
            </li>
            <li>
                <a>Tiling:</a>
                <select id="tilingModeSelector" onchange="setTileMode(value)">
                    <option value="untiled">Single tile</option>
                    <option value="tiled">Tiled</option>
                </select>
            </li>
            <li>
                <a>Antialias:</a>
                <select id="antialiasSelector" onchange="setAntialiasMode(value)">
                    <option value="full">Full</option>
                    <option value="text">Text only</option>
                    <option value="none">Disabled</option>
                </select>
            </li>
            <li>
                <a>Format:</a>
                <select id="imageFormatSelector" onchange="setImageFormat(value)">
                    <option value="image/png">PNG 24bit</option>
                    <option value="image/png8">PNG 8bit</option>
                    <option value="image/gif">GIF</option>
                    <option id="jpeg" value="image/jpeg">JPEG</option>
                    <option id="jpeg-png" value="image/vnd.jpeg-png">JPEG-PNG</option>
                    <option id="jpeg-png8" value="image/vnd.jpeg-png8">JPEG-PNG8</option>
                </select>
            </li>
            <li>
                <a>Styles:</a>
                <select id="imageFormatSelector" onchange="setStyle(value)">
                    <option value="">Default</option>
                </select>
            </li>
            <li>
                <a>Width/Height:</a>
                <select id="widthSelector" onchange="setWidth(value)">
                    <option value="auto">Auto</option>
                    <option value="600">600</option>
                    <option value="750">750</option>
                    <option value="950">950</option>
                    <option value="1000">1000</option>
                    <option value="1200">1200</option>
                    <option value="1400">1400</option>
                    <option value="1600">1600</option>
                    <option value="1900">1900</option>
                </select>
                <select id="heigthSelector" onchange="setHeight(value)">
                    <option value="auto">Auto</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>
                    <option value="1000">1000</option>
                </select>
            </li>
            <li>
                <a>Filter:</a>
                <select id="filterType">
                    <option value="cql">CQL</option>
                    <option value="ogc">OGC</option>
                    <option value="fid">FeatureID</option>
                </select>
                <input type="text" size="80" id="filter" />
                <a id="updateFilterButton" href="#" onClick="updateFilter()" title="Apply filter">Apply</a>
                <a id="resetFilterButton" href="#" onClick="resetFilter()" title="Reset filter">Reset</a>
            </li>
        </ul>
    </div>
    <div id="map">
        <div class="ol-toggle-options ol-unselectable"><a title="Toggle options toolbar" onClick="toggleControlPanel()"
                href="#toggle">...</a></div>
    </div>
    <div id="wrapper">
        <div id="location"></div>
        <div id="scale">
        </div>
        <div id="nodelist">
            <em>Click on the map to get feature info</em>
        </div>
<!-- popup -->
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
        </div>
</body>
</html>
<script src="//localhost:8081/geoserver/openlayers3/ol.js" type="text/javascript"></script>
<script src="./jquery-3.6.4.min.js"></script>
<script src="./index.js" type="text/javascript"></script>