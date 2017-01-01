/**
 * Created by harsh on 19/12/16.
 */

import dhis2API from '../dhis2API/dhis2API';
import * as CONSTANTS from './constants';


dhis2API.prototype.tagRetriever = tagRetriever;

var api = new dhis2API();

function tagParser(){
    const SNOM = api.getSchemaNameToObjectMap();
    const extractTextRegEx = /[a-zA-Z]+/;
    const extractNumberRegEx = /[0-9]+/;

    this.parseList = function(list){
        var result = [];
        var inline = false;

        for (var key in list){
            var parsedObject = parseTag(list[key]);
            if (parsedObject){
                result.push(parsedObject);
                if (parsedObject.inline_index){
                    inline = true;
                }
            }
        }
        return {headers : result, inline : inline};
    }

    function parseTag(tag){
        try {
            var whole = tag.split(CONSTANTS.FIRST_DELIMITER)[1];

            whole = whole.split(CONSTANTS.SECOND_DELIMITER);

            var domain = getValidDomain(whole[0]);
            if (!domain) {
                return null
            }

            whole = whole[1];
            if (whole.split(CONSTANTS.THIRD_DELIMITER)) {
                whole = whole.split(CONSTANTS.THIRD_DELIMITER);
            }

            var field = whole[0];
            var args = whole[1];

            var modifiers = [];

            if (!field){ return null }

            if (field.indexOf('[') != -1) {
                whole = field.split('[');

                field = whole[0];
                modifiers = whole[1].substr(0, whole[1].length - 1);

                if (modifiers.split(' ')){
                    modifiers = modifiers.split(' ');
                }
            }

             field = getValidField(domain.name,field);

            return {
                key : tag,
                domain : domain.name,
                field : field,
                args : args,
                modifiers : modifiers,
                inline_index : domain.index,
                domain_key : domain.name + (domain.index?domain.index:"")
            }

        }catch(e){
            console.log("tag parse error = "+e.toString());
            return null;
        }

        return null;
    }

    function getValidDomain(domain){

        var index = domain.match(extractNumberRegEx);
        if (index){
            domain = domain.match(extractTextRegEx)[0];
            index = index[0];
        }

        if (CONSTANTS.ALIAS_DOMAINS[domain]){
            domain = CONSTANTS.ALIAS_DOMAINS[domain]
        }

        if (SNOM[domain]){
            return {name : domain, index : index};
        }

        return false;
    }

    function getValidField(domain,field){

        if (CONSTANTS.ALIAS_FIELDS[field]){
            field = CONSTANTS.ALIAS_FIELDS[field];
        }

        var DOMAIN = SNOM[domain];

        if (DOMAIN.properties[field]){
            return field;
        }

        return false;
    }

    this.getRetriever = function(){
        return 'tagRetriever';
    }
}

function tagRetriever(args,headers,data){
    var SNOM = this.getSchemaNameToObjectMap();
    var property;
    var obj = {};
    var domainObj;

    retrieve(0,headers);
    function retrieve(key,headers){debugger
        if (key == headers.length){
            test = {domain : headers[0].domain,apiObj:obj,domainObj : domainObj};
            debugger
        }
        var property = SNOM[headers[key].domain].properties[headers[key].field];
        var value = headers[key].args?headers[key].args : data[headers[key].key];

        modifierOperations({
            afterThat : extractValues
        },property,headers[key],value);

        function extractValues(error,uid,mObj){
            domainObj = mObj;
            headers[key].args = uid;
            if (property.collection){

                if (!obj[property.fieldName]){
                    obj[property.fieldName] = [];
                }

                var collectionObj = {}
                collectionObj[property["apiSchema"].key] = headers[key].args;
                collectionObj[property["apiSchema"].value] = data[headers[key].key];
                obj[property.fieldName].push(collectionObj);

            }else{
                switch(property.propertyType){
                    case "REFERENCE" :
                        if (property.apiAlias){
                            obj[property.apiAlias] = value;
                        }else{
                            obj[property.fieldName] = value;
                        }
                        break;

                    case "" :

                    default :
                }
            }

            retrieve(key+1,headers);
        }

    }

    function modifierOperations(args,property,header,value){

        if (header.modifiers.length == 0){
            args.afterThat(true);
        }else{
            for (var key in header.modifiers){
                var modifier = header.modifiers[key];
                var modifierArgs = modifier.split('-');

                if (modifierArgs){
                    modifier = modifierArgs[0];
                    modifierArgs = modifierArgs[1];
                }

                if (modifier == "lookup"){
                    lookupObj();
                }

            }
        }

        function lookupObj(){

            if (property.propertyType == "REFERENCE"){

                api.getObjByField({
                    afterThat : args.afterThat
                },header.field,modifierArgs,value);

            }else if (property.propertyType == "CUSTOM_TEIATTR"){
                api.getTEIByAttr({
                    afterThat : args.afterThat
                },header.domain,value);
            }

        }
    }
}

module.exports = tagParser;