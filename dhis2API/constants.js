/**
 * Created by harsh on 19/12/16.
 */

export var OP_ADD = "ADD";
export var OP_ADD_UPDATE = "ADD/UPDATE";
export var OP_ADD_UPDATE_OVERWRITE = "ADD/UPDATE_OVERWRITE";

export var schemas_extended = {
    trackedEntityInstance: {
        name: "trackedEntityInstance",
        properties: {
            attributes: {
                fieldName : "attributes",
                collection: true,
                propertyType: "CUSTOM_TEIATTR",
                required: false,
                simple: true,
                writable: true,
                apiSchema : {
                    key : "attribute",
                    value : "value"
                }
            },
            organisationUnit: {
                apiAlias: "orgUnit"
            }
        }
    },
    event: {
        name: "event",
        properties: {
            eventDate: {
                collection: false,
                fieldName: "eventDate",
                propertyType: "DATE",
                required: true,
                simple: true,
                writable: true
            }
        }
    },
    enrollment: {
        name: "enrollment",
        properties: {
            program: {
                collection: false,
                fieldName: "program",
                propertyType: "REFERENCE",
                required: true,
                simple: true,
                writable: true
            },
            enrollmentDate: {
                collection: false,
                fieldName: "enrollmentDate",
                propertyType: "DATE",
                required: true,
                simple: true,
                writable: true
            }
        }
    }
}


