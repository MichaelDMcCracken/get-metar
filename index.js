'use strict';

var util = require('util');
var request = util.promisify(require('@root/request'));
var convert = require('xml-js');
var fs = require('fs');
var path = require('path');

function getMetar(airport) {
    var url = new URL(
        'https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&hoursBeforeNow=3&mostRecent=true'
    );
    url.searchParams.append('stationString', airport);

    return request({ url: url.href })
        .then(function (resp) {
            if (
                resp.statusCode == 200 &&
                resp.headers['content-type'] == 'text/xml'
            ) {
                return resp.body;
            }
        })
        .then(function (xml) {
            return convert.xml2js(xml, { compact: true, spaces: 4 });
        })
        .then(function (metarObj) {
            return metarObj.response.data.METAR;
        })
        .then(function (metar) {
            return {
                flightCategory: getFlightCat(metar),
                obsTime: getObsTime(metar),
                rawText: getRawText(metar)
            };
        })
        .catch(function (err) {
            throw err;
        });
}

function getFlightCat(metar) {
    return metar.flight_category._text;
}

function getObsTime(metar) {
    return timeFormatter(new Date(metar.observation_time._text));
}

function getRawText(metar) {
    var rawtext = removeRemarks(metar.raw_text._text);
    return rawtext.substring(13, rawtext.length);
    
}

function removeRemarks(rawtext) {
    if (!rawtext.includes('RMK')){
        return rawtext;
    }
    return rawtext.substring(0, rawtext.indexOf('RMK')).trim();
}

function timeFormatter(oldTime) {
    var newTime = new Date(oldTime);
    var minutes = '';
    if (newTime.getMinutes() === 0) {
        minutes = '00';
    } else if (newTime.getMinutes() < 10) {
        minutes = '0' + newTime.getMinutes().toString();
    } else {
        minutes = newTime.getMinutes().toString();
    }
    return newTime.getHours().toString() + ':' + minutes;
}

module.exports = getMetar;