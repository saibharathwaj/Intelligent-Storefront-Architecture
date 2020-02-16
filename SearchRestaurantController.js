({
    handleKeyup : function(component, event, helper) {
        var isEnterKey=event.keyCode===13;
        if(isEnterKey){
            var resName=component.find("resSearch").get('v.value');
            alert('queried Item::'+ resName);
            var action=component.get("c.getSelectedRestaurantList");
            action.setParams({
                resName:resName
            });
            action.setCallback(this, function(response) {
                var state= response.getState();
                if(state === 'SUCCESS'){
                    var responseValue= response.getReturnValue();
                    console.log('responseValue::::', responseValue);
                    component.set('v.restaurantList',responseValue);
                } else{
                    console.log(response.getError());
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    navigateFood: function(component,event,helper) {
        //alert('Enter navigateFood:::');
        var resName;
        var eventSource=event.getSource();
        console.log(eventSource);
        var itemObj= eventSource.get('v.name');
        console.log(itemObj);
        var itemVal= eventSource.get('v.value');
        console.log(itemVal);
        var resList=component.get('v.restaurantList');
        console.log('resList::::', resList.length);
        for(var key in resList){
            var value=resList[key];
            if(value.Id == itemObj){
                resName= value.Restaurant_Name__c;
                console.log('resId:::',resName);
            }
        }
        var navService=component.find("navService");
        var pageReference= {
            "type":"standard__component",
            "attributes" :{
                "componentName":"c__DisplayFoodItems"
            },
            "state":{
                "c__resId":itemObj,
                "c__resName":resName,
                "c__cuisine":itemVal
            }
        };
        component.set("v.pageReference",pageReference);
        var defaultUrl="#";
        navService.generateUrl(pageReference)
        .then($A.getCallback(function(url) {
            component.set("v.url", url ? url : defaultUrl);
        }), $A.getCallback(function(error) {
            component.set("v.url", defaultUrl);
        }));
        //console.log('test123');
        var navService = component.find("navService");
            // Uses the pageReference definition in the init handler
        var pageReference = component.get("v.pageReference");
        //event.preventDefault();
        navService.navigate(pageReference);
        //console.log('test456');
    }
    
})