module.exports = {
    labels: ["User"],
    "_id" : {
        primary: true,
        type: 'GUID',
        required: true,
    },
    "name" : 'string',
    "friend" : {
        type: "relationship",
        relationship: "FOLLOWS",
        direction: "out",
        target: "User",
        eager: true
    },
    "boughtCategory":{
        type: "relationship",
        target: "Category",
        relationship: "BOUGHT",
        direction: "out",
        properties:{
            quantity: "int"
        },
        eager: true
    }
}

