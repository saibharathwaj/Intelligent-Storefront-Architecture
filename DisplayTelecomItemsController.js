({
    doInit : function(component, event, helper) {
        var pageReference=component.get("v.pageReference");
        if(pageReference){
            var telId=pageReference.state.c__telId;
            var telName=pageReference.state.c__telName;
            // var resCuisine=pageReference.state.c__cuisine;
            // console.log('resId::'+resId+'~~'+'resName::'+resName+'~~~'+'Cuisine::'+resCuisine);
            component.set('v.telName',telName);
            component.set('v.telId',telId);
            console.log('telName::',component.get('v.telName'));
            console.log('telId::',component.get('v.telId'));
            var action=component.get("c.fetchGenericItems");
            action.setParams({
                'telecomId':component.get('v.telId')
            });
            action.setCallback(this, function(response) {
                var state= response.getState();
                if(state === 'SUCCESS'){
                    //alert('success:::');
                    var responseValue= response.getReturnValue();
                    console.log('responseValue::::', responseValue);
                    component.set('v.telecomList',responseValue);
                } else{
                    console.log(response.getError());
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    addToCart: function(component,event,helper){
        //alert('cart::');
        var eventSource=event.getSource();
        console.log('eventSource::::'+eventSource);
        var itemObj= eventSource.get('v.name');
        console.log('evenySource Name:::'+itemObj);
        var itemVal= eventSource.get('v.value');
        console.log('Event Source Value:::'+itemVal);
        var selectedFood= component.get('v.telecomList')[itemVal];
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
        //alert('inside add to wishlist:::');
        var eventSource=event.getSource();
        console.log('eventSource wishlist::::'+eventSource);
        var itemObj= eventSource.get('v.name');
        console.log('evenySource Name wishlist:::'+itemObj);
        var itemVal= eventSource.get('v.value');
        console.log('Event Source Value wishlist:::'+itemVal);
        var selectedFood= component.get('v.telecomList')[itemVal];
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