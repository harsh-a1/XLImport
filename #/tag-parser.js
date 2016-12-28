/**
 * Created by harsh on 19/12/16.
 */

//#trackedEntityInstance@orgUnit[lookUp].uid
//#tei@attr[lookUp]
//#trackedEntityInstance@attribute.uid
//#trackedEntityInstance@trackedEntity.uid
//#ev@tei[lookUp]
//#ev@ou[lookUp]
//#ou@name[lookup]



import dhis2API from '../dhis2API/dhis2API';
import * as CONSTANTS from './constants';


var api = new dhis2API();

function tagParser(){
    const SNOM = api.getSchemaNameToObjectMap();
    const extractTextRegEx = /[a-zA-z]+/;
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

            var field = getValidField(domain.name,whole[0]);
            var args = whole[1];
            var modifiers = [];

            if (!field){ return null }

            if (field.indexOf('[') != -1) {
                var whole = field.split('[');
                modifiers = whole.substr(0, whole[1].length - 1);

                if (modifiers.split(' ')){
                    modifiers = modifiers.split(' ');
                }
            }

            var headerObj = {
                key : tag,
                domain : domain.name,
                field : field,
                args : args,
                modifiers : modifiers,
                inline_index : domain.index,
                domain_key : domain.name + (domain.index?domain.index:"")
            }

            return headerObj;
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

        if (DOMAIN.fieldsNameToObjectMap[field]){
            return field;
        }

        return false;
    }

}


module.exports = tagParser;