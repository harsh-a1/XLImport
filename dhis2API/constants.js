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
    },
    event : {
                                name : "event",
                                properties : [{
                                    collection:false,
                                    fieldName:"eventDate",
                                    propertyType:"DATE",
                                    required:true,
                                    simple:true,
                                    writable:true
                                }]

    },
    enrollment : {
                                name  : "enrollment",
                                properties : [{
                                    collection:false,
                                    fieldName:"program",
                                    propertyType:"REFERENCE",
                                    required:true,
                                    simple:true,
                                    writable:true
                                }]
    }
}

