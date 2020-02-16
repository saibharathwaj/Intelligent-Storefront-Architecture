({
    doLoad : function(component, event, helper) {
        var action=component.get("c.getTelecomList");
        action.setParams({
            'telecomName':''
        });
        action.setCallback(this, function(response) {
            var state= response.getState();
            if(state === 'SUCCESS'){
                var responseValue= response.getReturnValue();
                console.log('responseValue:::',responseValue);
                component.set('v.telecomList',responseValue);
            } else{
                console.log('Error:::', response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    
    handleKeyup: function(component,event,helper){
        var isEnterKey=event.keyCode === 13;
        if(isEnterKey){
            var queryTerm=component.find('telecomName').get('v.value');
            alert('Queried Name:::'+queryTerm);
            var action=component.get("c.getTelecomList");
            action.setParams({
                'telecomName':queryTerm
            });
            action.setCallback(this, function(response) {
                var state= response.getState();
                if(state === 'SUCCESS'){
                    var responseValue= response.getReturnValue();
                    console.log('responseValue:::',responseValue);
                    component.set('v.telecomList',responseValue);
                } else{
                    console.log('Error:::', response.getError());
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    navigateGrocery: function(component, event, helper) {
        var eventSource=event.getSource();
        console.log('eventSource::::',eventSource);
        var telId= eventSource.get('v.name');
        console.log(telId);
        var telName=eventSource.get('v.value');
        console.log(telName);
        var navService=component.find("navService");
        var pageReference={
          "type":"standard__component",
            "attributes" :{
                "componentName":"c__DisplayTelecomItems"
            },
            "state":{
                "c__telId":telId,
                "c__telName":telName
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
    }
})