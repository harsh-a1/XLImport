/**
 * Created by harsh on 15/12/16.
 */

// '_' is the namespace
var APIx = {};

APIx.schemaNameToObjectMap = undefined;

APIx.dhis2API = function(){

    var ajax = require('../ajax-wrapper');
    var utility = require('../utility-functions');
    var Promise = require('bluebird');
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

        function populateSchemaMaps(error, response, body) {
            if (error){

            }else{
                var schemas = response.schemas;
                addFields(schemaNameToObjectMap,schemas);
                APIx.schemaNameToObjectMap = schemaNameToObjectMap;

            }

            function addFields(schemaNameToObjectMap,schemas){
                for (var key in schemas){
                    schemaNameToObjectMap[schemas[key].name]={};
                    schemaNameToObjectMap[schemas[key].name].requiredFields = [];
                    schemaNameToObjectMap[schemas[key].name].otherFields = [];

                    for (var i=0;i<schemas[key].properties.length;i++){
                        var property = schemas[key].properties[i];

                        if (property.writable){
                            if (property.required){
                                schemaNameToObjectMap[schemas[key].name].requiredFields.push(property);
                            }else{
                                schemaNameToObjectMap[schemas[key].name].otherFields.push(property);
                            }
                        }
                    }
                    schemaNameToObjectMap[schemas[key].name].requiredFieldsNameToObjectMap = utility
                        .prepareIdToObjectMap(schemaNameToObjectMap[schemas[key].name]
                            .requiredFields, "fieldName");

                    schemaNameToObjectMap[schemas[key].name].otherFieldsNameToObjectMap = utility
                        .prepareIdToObjectMap(schemaNameToObjectMap[schemas[key].name]
                            .otherFields, "fieldName");
                }
            }
        }
    }
}

module.exports = APIx.dhis2API();