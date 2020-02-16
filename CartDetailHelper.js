({
	validate : function(component,event,helper) {
		var isValid = component.find('address').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            inputCmp.set('v.validity', {valid:false, badInput :true});
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        alert('isValid:::'+isValid);
        return isValid; 
	},
    
    fetchAddress: function(component,event,helper){
        var action= component.get('c.fetchAddressBook');
        action.setCallback(this, function(response){
           var state= response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT'){
                var responseData = response.getReturnValue();
                var resultData = JSON.parse(responseData);
                console.log('resultData ', resultData);
                component.set('v.addressList' , resultData);
            } else if(state === 'INCOMPLETE') {
                console.log('User is offline and system doesnot support offline');
            } else if(state === 'ERROR'){
                var errors=response.getError();
                console.log('Error Occurred:::',errors);
            }
        });
        action.setStorable();
        $A.enqueueAction(action);
    }
})