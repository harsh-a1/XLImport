/**
 * Created by harsh on 19/12/16.
 */

export var schemas_extended = {
    trackedEntityInstance: {
        name: "trackedEntityInstance",
        properties: {
            attributes: {
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
            }
        }
    }
}


