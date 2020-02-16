({
    dealerLogin : function(component, event, helper) {
        console.log('Dealer Name:::', component.get('v.dealerUsername'));
        component.set('v.myColumns',[
            {label: 'Name', fieldName:'Name', type:'text'},
            {label: 'Order Amount', fieldName:'Order_Amount__c', type:'currency', 
             typeAttributes: {
                 currencyCode: 'INR'
             }},
            {label:'Order Discount' , fieldName:'Order_Discount__c', type:'currency',
             typeAttributes:{
                 currencyCode: 'INR'
             }},
            {label: 'Sub Total', fieldName:'Sub_Total__c', type: 'currency', 
             typeAttributes:{
                 currencyCode:'INR'
             }}
        ]);
        
        var action=component.get("c.getDealerLogin");
        action.setParams({
            'userName':component.get('v.dealerUsername')
        });
        action.setCallback(this, function(response) {
            var state= response.getState();
            if(state === 'SUCCESS'){
                var responseValue= response.getReturnValue();
                console.log('responseValue:::',response.getReturnValue());
                component.set('v.myOrderList',response.getReturnValue());
                
             } else{
                console.log('Error:::', response.getError());
            }
        });
        component.set('v.dealerFlag',true);
        $A.enqueueAction(action);
    },
    
    supplierLogin : function(component, event, helper){
        console.log('Dealer Name:::', component.get('v.supplierUsername'));
        var action=component.get("c.getSupplierLogin");
        action.setParams({
            'userName':component.get('v.supplierUsername')
        });
        action.setCallback(this, function(response) {
            var state= response.getState();
            if(state === 'SUCCESS'){
                var responseValue= response.getReturnValue();
                console.log('responseValue:::',responseValue);
                component.set('v.accountList',responseValue);
            } else{
                console.log('Error:::', response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    
    navigateToShoppingPage: function(component,event,helper){
        console.log('accId:111:::',component.get('v.accId'));
        console.log('accName 111:::',component.get('v.accName'));
         var navService=component.find("navService");
        var pageReference={
          "type":"standard__component",
            "attributes" :{
                "componentName":"c__WelcomeB2B"
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
       
    }
})