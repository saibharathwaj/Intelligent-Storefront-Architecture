({
	fetchMostUsedItems : function(component,event,helper) {
        console.log('Enters fetchMostUsedItems::::');
        var accId='0012v00002UGibw';
        var restId= component.get('v.resId');
        var recType='Restaurant';
        var action=component.get("c.getGenericList");
        console.log('Test::::',action);
        action.setParams({
            accountId:accId,
            recordType:recType,
            restaurantId:restId,
        });
        action.setCallback(this, function(response) {
            var state= response.getState();
            if(state === 'SUCCESS'){
                //alert('success:::');
                var responseValue= response.getReturnValue();
                console.log('responseValue most::::', responseValue);
                component.set('v.mostRecentlyUsedfoodItemList',responseValue);
            } else{
                console.log(response.getError());
            }
        });
        console.log('mmmmm:::');
        $A.enqueueAction(action);
	}
})