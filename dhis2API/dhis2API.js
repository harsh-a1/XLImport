/**
 * Created by harsh on 15/12/16.
 */

var APIx = {};

APIx.schemaNameToObjectMap = undefined;

APIx.dhis2API = function(){

    var ajax = require('../ajax-wrapper');
    var utility = require('../utility-functions');
    var Promise = require('bluebird');
    var CONSTANTS = require('./constants');
    var baseURL = "../../";
    var schemaNameToObjectMap = [];

    if (!APIx.schemaNameToObjectMap){
        init();
    }else{
        schemaNameToObjectMap= APIx.schemaNameToObjectMap;
    }

    function init() {
        ajax.request( {
                type: "GET",
                async: true,
                contentType: "application/json",
                url: baseURL + 'schemas?fields=name,properties[fieldName,required,simple,writable,propertyType,collection]'
            }, populateSchemaMaps);
    }

    function populateSchemaMaps(error, response, body) {
        if (error){

        }else{
            var schemas = response.schemas;
            addFields(schemaNameToObjectMap,schemas);
            addFields(schemaNameToObjectMap,CONSTANTS.schemas_extended);
            makeMaps(schemaNameToObjectMap);
            APIx.schemaNameToObjectMap = schemaNameToObjectMap;

        }

        function addFields(schemaNameToObjectMap,schemas){

            for (var key in schemas){

                if (!schemaNameToObjectMap[schemas[key].name]){
                    schemaNameToObjectMap[schemas[key].name]={};
                    schemaNameToObjectMap[schemas[key].name].fields = [];
                }

                for (var i=0;i<schemas[key].properties.length;i++){
                    var property = schemas[key].properties[i];

                    if (property.writable &&/*TODO && condition because of array[filter] issue */ schemaNameToObjectMap[schemas[key].name].fields){
                      schemaNameToObjectMap[schemas[key].name].fields.push(property);
                    }
                }
            }
        }

        function makeMaps(schemaNameToObjectMap){
            for (var key in schemaNameToObjectMap){
                schemaNameToObjectMap[key].fieldsNameToObjectMap = utility
                    .prepareIdToObjectMap(schemaNameToObjectMap[key]
                        .fields, "fieldName");
            }
        }
    }

    this.getSchemaNameToObjectMap = function(){
        return schemaNameToObjectMap;
    }
}


module.exports = APIx.dhis2API;