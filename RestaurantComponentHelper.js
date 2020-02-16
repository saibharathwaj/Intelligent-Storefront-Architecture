({
    load : function(component) {
        var action=component.get("c.getAllReviewsRestaurant");
        action.setCallback(this, function(response) {
            var state= response.getState();
            if(state === 'SUCCESS') {
                var resp=response.getReturnValue();
                var arr=[];
                resp.forEach((key,value) => {
                    arr.push({
                    "label": resp[value].label,
                    "value": resp[value].count
                });
            });
            console.log('arr::::',arr);
            var pie= new d3pie("pieChart", {
                "header" : {
                    "title": {
                        "text":"Reviews of Restaurant",
                        "fontSize":15,
                        "font":"courier"
                    },
                    "location":"pie-center",
                    "titleSubtitlePadding":10
                },
                "size":{
                    "canvasWidth":500,
                    "pieInnerRadius":"70%",
                    "pieOuterRadius":"70%"
                },
                "data":{
                    "sortOrder":"label-desc",
                    "content":arr
                },
                "label":{
                    "outer": {
                        "format":"label-percentage1",
                        "pieDistance":20
                    },
                    "inner" :{
                        "format":"none"
                    },
                    "mainLabel":{
                        "fontSize":10
                    },
                    "percentage":{
                        "color":"#999999",
                        "fontSize":11,
                        "decimalPlaces":0
                    },
                    "value":{
                        "color":"#ccc43",
                        "fontSize":11
                    },
                    "lines" : {
                        "enabled":true,
                        "color":"#777777"
                    },
                    "truncation":{
                        "enabled":true
                    }
                },
                "effects":{
                    "pullOutSegmentOnClick":{
                        "effect":"linear",
                        "speed":500,
                        "size":8
                    }
                },
                "misc":{
                    "colors":{
                        "segmentStroke":"#000000"
                    }
                }
            });
        } else if(state === 'ERROR') {
            var errors=response.getError();
            console.log('Errors:::',errors);
        }
    });
    $A.enqueueAction(action);
}
 })