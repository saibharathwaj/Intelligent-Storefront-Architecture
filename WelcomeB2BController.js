({
    clicksFood : function(component, event, helper) {
       // alert('test:::');
        var navService=component.find("navService");
        var pageReference= {
            "type":"standard__component",
            "attributes" :{
                "componentName":"c__RestaurantComponent"
            },
            "state":{
                
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
        console.log('test123');
        var navService = component.find("navService");
        // Uses the pageReference definition in the init handler
        var pageReference = component.get("v.pageReference");
        //event.preventDefault();
        navService.navigate(pageReference);
        console.log('test456');
    },
    
    
    clicksGrocery: function (component,event,helper) {
         //alert('test:::');
        var navService=component.find("navService");
        var pageReference= {
            "type":"standard__component",
            "attributes" :{
                "componentName":"c__GroceryController"
            },
            "state":{
                
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
        console.log('test123');
        var navService = component.find("navService");
        // Uses the pageReference definition in the init handler
        var pageReference = component.get("v.pageReference");
        //event.preventDefault();
        navService.navigate(pageReference);
        console.log('test456');
    },
    
    clicksTelecom: function(component, event, helper) {
         //alert('test:::');
        var navService=component.find("navService");
        var pageReference= {
            "type":"standard__component",
            "attributes" :{
                "componentName":"c__TelecomComponent"
            },
            "state":{
                
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
        console.log('test123');
        var navService = component.find("navService");
        // Uses the pageReference definition in the init handler
        var pageReference = component.get("v.pageReference");
        console.log('pageReference:::',pageReference);
        //event.preventDefault();
        navService.navigate(pageReference);
        console.log('test456');
    },
    
    doInit: function(component, event,helper){
        var pageReference=component.get("v.pageReference");
        if(pageReference){
            var accId=pageReference.state.c__accId;
            var accName= pageReference.state.c__accName;
            console.log('accId:::',accId);
            console.log('accName:::',accName);
            component.set('v.accId',accId);
            component.set('v.accName',accName);
        }
    }
})