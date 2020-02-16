({
	predictSentiment : function(component, event, helper) {
       // alert('123:::');
		helper.predictSentiment(component,event,helper);
	},
    
    doLoad: function(component,event,helper) {
        var action = component.get("c.getCartItemsList");
        action.setParams({
           "recordId":  component.get('v.recordId')   
        });
        action.setCallback(this, function(response){
            var state=response.getState();
            if(state === 'SUCCESS'){
                var returnValue= response.getReturnValue();
                console.log('resturnValue :::', returnValue);
                component.set('v.cartItemList', returnValue);
            }
        });
        $A.enqueueAction(action);
    }
})