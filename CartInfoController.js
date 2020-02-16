({
	goToCart : function(component, event, helper) {
       // alert('check click:::');
        var rec=component.get('v.foodcartItemList');
        console.log('rec Length::'+rec.length);
        var names=[];
        for(var i=0; i< component.get('v.foodcartItemList').length; i++){
            names.push(component.get('v.foodcartItemList')[i].Id);
        }
        console.log('Names::::::10:::',names);
        component.set('v.foodcartIdList', names);
        console.log('Food Item Ids::', component.get('v.foodcartIdList'));
        var action= component.get('c.getCartId');
        action.setParams({
            'foodItemList':component.get('v.foodcartIdList')
        });
        action.setCallback(this, function(response){
            var state= response.getState();
            console.log('State:::'+response.getState());
            console.log('Response getReturnValue:::'+response.getReturnValue());
            if(state === 'SUCCESS' || state === 'DRAFT' ){
                var pageReference=component.find('navigation');
                var pageReferenceNav={
                    "type": "standard__component",
                    "attributes" : {
                        "componentName": "c__CartDetail"
                    },
                    "state":{
                        "c__cartId":response.getReturnValue()
                    }
                };
                pageReference.navigate(pageReferenceNav,true);
            } else if(state === 'INCOMPLETE'){
                console.log('User is offline system doesnot support offline');
            } else if(state === 'ERROR') {
                var errors= response.getError();
                if(errors || errors[0].pageMessage) {
                    console.log('page Message::',errors[0].pageMessage);
                }
                if(errors || errors[0].duplicateResults){
                    console.log('duplicate errors::',errors[0].duplicateResults);
                }
            } else {
                
            }
        });
        $A.enqueueAction(action);
	},
    
    createCartItems: function(component,event,helper){
        var names=[];
        for(var i=0; i< component.get('v.foodcartItemList').length; i++){
            names.push(component.get('v.foodcartItemList')[i].Id);
        }
        component.set('v.foodcartIdList', names);
    }
})