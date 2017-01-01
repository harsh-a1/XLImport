/**
 * Created by harsh on 15/12/16.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import XLSX from 'xlsx';
import * as CONSTANTS from './#/constants';
import tagParser from './#/tag-parser';
import {importHandler} from './#/import-handler';
import {UploadFile} from './components/components';
var utility = require('./utility-functions');

$('document').ready(function(){
    ReactDOM.render(<UploadFile onClick={uploadFileHandler}/>, document.getElementById('container'));
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
    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = function(e) {
        var data = e.target.result;
        var wb = XLSX.read(data, {type: 'binary'});

        var data_sheet = XLSX.utils.sheet_to_json(wb.Sheets[CONSTANTS.DATA_SHEETNAME]);
        var metadata_sheet = XLSX.utils.sheet_to_json(wb.Sheets[CONSTANTS.METADATA_SHEETNAME]);
        var parser = new tagParser();

        var parsed = parser.parseList(get_header_row(wb.Sheets[CONSTANTS.DATA_SHEETNAME]));

        importHandler(parsed,data_sheet);
        prepareForImport(parsed,data_sheet);

    };

    function get_header_row(sheet) {
        //https://github.com/SheetJS/js-xlsx/issues/214
        //https://github.com/SheetJSDev
        var headers = [];
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for(C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

            var hdr = "UNKNOWN " + C; // <-- replace with your desired default
            if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

            headers.push(hdr);
        }
        return headers;
    }
}

function prepareForImport(parsed,data){
    var importMap = {
        case_single_sheet :{
                            trackedEntityInstance : [],
                            enrollment : [],
                            event : []
        },
        case_default : [],
        case_delete : []
    };

        var headersMapGrpByDomain = utility.prepareMapGroupedById(parsed.headers,"domain_key");

        for (var key in headersMapGrpByDomain){
            var domain_obj = headersMapGrpByDomain[key];

            if (parsed.inline){
                if (key == "trackedEntityInstance"){
                    importMap.case_single_sheet[key] = domain_obj;
                }else{
                    importMap.case_single_sheet[domain_obj[0].domain][key] = domain_obj;
                }
            }else{
                importMap.case_default[key] = domain_obj;
            }
        }
 debugger
}
