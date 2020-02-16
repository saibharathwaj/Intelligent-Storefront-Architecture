({
    doInit : function(component, event, helper) {
        var pageReference=component.get("v.pageReference");
        if(pageReference){
            var grocId=pageReference.state.c__grocId;
            var grocName=pageReference.state.c__grocName;
            // var resCuisine=pageReference.state.c__cuisine;
            // console.log('resId::'+resId+'~~'+'resName::'+resName+'~~~'+'Cuisine::'+resCuisine);
            component.set('v.grocName',grocName);
            component.set('v.grocId',grocId);
            console.log('grocName::',component.get('v.grocName'));
            console.log('grocId::',component.get('v.grcoId'));
            var action=component.get("c.fetchGenericItems");
            action.setParams({
                groceryId:component.get('v.grocId')
            });
            action.setCallback(this, function(response) {
                var state= response.getState();
                if(state === 'SUCCESS'){
                    //alert('success:::');
                    var responseValue= response.getReturnValue();
                    console.log('responseValue::::', responseValue);
                    component.set('v.groceryItemList',responseValue);
                } else{
                    console.log(response.getError());
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    addToCart: function(component,event,helper){
       // alert('cart::');
        var eventSource=event.getSource();
        console.log('eventSource::::'+eventSource);
        var itemObj= eventSource.get('v.name');
        console.log('evenySource Name:::'+itemObj);
        var itemVal= eventSource.get('v.value');
        console.log('Event Source Value:::'+itemVal);
        var selectedFood= component.get('v.groceryItemList')[itemVal];
        console.log('selected Food::::'+selectedFood);
        var existingItems= component.get('v.recordList');
        if(existingItems){
            existingItems.push(selectedFood);
            component.set('v.recordList', existingItems);
        } else{
            existingItems=[];
            existingItems.push(selectedFood);
            component.set('v.recordList', existingItems);
        }
        console.log('record list total count:::'+component.get('v.recordList'));
        var toastEvent=$A.get("e.force:showToast");
        toastEvent.fire({
            "title":"Success!",
            "type":"success",
            "message":selectedFood.Name+" has been added Successfully to Cart !!!!"
        });
        toastEvent.fire();
    },
    
    addtowishlist: function(component,event,helper){
       // alert('inside add to wishlist:::');
        var eventSource=event.getSource();
        console.log('eventSource wishlist::::'+eventSource);
        var itemObj= eventSource.get('v.name');
        console.log('evenySource Name wishlist:::'+itemObj);
        var itemVal= eventSource.get('v.value');
        console.log('Event Source Value wishlist:::'+itemVal);
        var selectedFood= component.get('v.foodItemList')[itemVal];
        console.log(selectedFood);
        var action=component.get("c.addToWishlist");
        action.setParams({
            'selectedFood':itemObj
        });
        action.setCallback(this, function(response) {
            var state= response.getState();
            if(state === 'SUCCESS'){
                //alert('success:::');
                var responseValue= response.getReturnValue();
                console.log('responseValue::::', responseValue);
                var toastEvent=$A.get("e.force:showToast");
                toastEvent.fire({
                    "title":"Success!",
                    "type":"success",
                    "message":responseValue+" has been created for your interest. Lead will be calling you soon !!!!"
                });
                toastEvent.fire();
            } else{
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})