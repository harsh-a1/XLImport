/**
 * Created by harsh on 15/12/16.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

var dhis2API = require('./dhis2API/dhis2API');

import {UploadFile} from './components/components';

$('document').ready(function(){

    ReactDOM.render(<UploadFile/>, document.getElementById('container'));

});

function uploadFileHandler(){

    var file = document.getElementById('fileInput').files[0];

    if (!file) {
        alert("Error Cannot find the file!");
        return;
    }

    switch(file.type){
        case "text/csv" :  parseCSV(file);
            break
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
        case "application/vnd.ms-excel" :
            parseExcel(file);
            break
        default : alert("Unsupported Format");
            break
    }
}

function parseCSV(file){
    debugger
}

function parseExcel(file){
    debugger
}


