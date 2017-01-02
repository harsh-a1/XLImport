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
    var ROOT_OU_UID = undefined;

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
            url: baseURL + '/organisationUnits?level=1&fields=id,name'
        }, function(error,response){
            if (error){
                console.log("root ou error");
            }else{
                ROOT_OU_UID = response.organisationUnits[0].id;
            }
        });

        ajax.request( {
                type: "GET",
                async: true,
                contentType: "application/json",
                url: baseURL + 'schemas?fields=name,relativeApiEndpoint,apiEndpoint,properties[fieldName,required,simple,writable,propertyType,collection]'
            }, populateSchemaMaps);
    }

    function populateSchemaMaps(error, response, body) {
        if (error){

        }else{
            var schemas = response.schemas;
            schemaNameToObjectMap = buildSchemaMap(schemas,CONSTANTS.schemas_extended);
            APIx.schemaNameToObjectMap = schemaNameToObjectMap;
        }

        function buildSchemaMap(_schemas,extendedSchema){

            var merge = require('deepmerge');

            var schemas = {};
            for (var key in _schemas){
                var properties = {};
                for (var pKey in _schemas[key].properties){
                    properties[_schemas[key].properties[pKey].fieldName] = _schemas[key].properties[pKey];
                }

                _schemas[key].properties = properties;
                schemas[_schemas[key].name] = _schemas[key];
            }

            return merge(schemas,extendedSchema);
        }

        function makeMaps(schemaNameToObjectMap){
            for (var key in schemaNameToObjectMap){
                schemaNameToObjectMap[key].fieldsNameToObjectMap = utility
                    .prepareIdToObjectMap(schemaNameToObjectMap[key]
                        .fields, "fieldName");
            }
        }
    }

    this.saveOrUpdate = function(args,domain,uid,apiObject){

        if (uid){
            args.operation = CONSTANTS.OP_ADD_UPDATE_OVERWRITE;
                ajax.request({
                    type: "PUT",
                    async: true,
                    contentType: "application/json",
                    data : JSON.stringify(apiObject),
                    url: "../../"+domain+"s/"+uid
                },callback);

        }else{
            args.operation = CONSTANTS.OP_ADD;

            ajax.request({
                type: "POST",
                async: true,
                contentType: "application/json",
                data : JSON.stringify(apiObject),
                url: "../../"+domain+"s"
            },callback);
        }

        function callback(error,response,body){debugger
            args.then(error,response,body,args);
        }

    }

    this.getCustomObject = function(_retriever,...args){
        if (this[_retriever]){
            this[_retriever](...args);
        }
    }

    this.CONSTANTS = CONSTANTS;

    this.getSchemaNameToObjectMap = function(){
        return schemaNameToObjectMap;
    }

    this.getEndPointByDomain = function(domain){
        return schemaNameToObjectMap[domain].apiEndpoint;
    }

    this.getTEIByAttr = function(args,attruid,value){
        ajax.request({
            type: "GET",
            async: true,
            contentType: "application/json",
            url: "../../trackedEntityInstances?"+'ou='+ROOT_OU_UID+'&ouMode=DESCENDANTS&filter='+attruid+':eq:'+value
        },callback);

        function callback(error, response, body){
            if (error){
                args.afterThat(true,null);
            }else{

                var uid = undefined;
                if (response.trackedEntityInstances.length>0){
                    uid = response.trackedEntityInstances[0].trackedEntityInstance;
                }
                args.afterThat(null,uid,response.trackedEntityInstances[0]);
            }
        }
    }
    this.getObjByField = function(args,domain,fieldName,fieldValue){

        ajax.request({
            type: "GET",
            async: true,
            contentType: "application/json",
            url: this.getEndPointByDomain(domain)+'?filter='+fieldName+':eq:'+fieldValue
        },callback);

        function callback(error, response, body){
            if (error){
                args.afterThat(true,null);
            }else{
                var uid = undefined;
                if (response[domain+'s'].length>0){
                    uid = response[domain+'s'][0].id;
                }
                args.afterThat(null,uid);
            }

        }
    }
}


module.exports = APIx.dhis2API;