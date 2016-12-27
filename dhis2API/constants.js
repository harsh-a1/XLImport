/**
 * Created by harsh on 19/12/16.
 */

export var schemas_extended = {
    trackedEntityInstance : {
                                name : "trackedEntityInstance",
                                properties : [{
                                    collection:true,
                                    fieldName:"attributes",
                                    propertyType:"IDENTIFIER",
                                    required:false,
                                    simple:true,
                                    writable:true

                                }]
    }
}

