({
    doInit : function(component, event, helper) {
        component.find('recordCreator').getNewRecord(
            'Addressbook__c',
            null,
            false,
            $A.getCallback(function() {
                var record=component.get('v.record');
                var error=component.get('v.recordError');
                if(error || (record === null)){
                    console.log('Error while creating template::',error);
                }else{
                    console.log('Successfully Created::');
                }
            })
        );
        console.log(component.get('v.pageReference'));
        var pageReference = component.get("v.pageReference");
        console.log(pageReference);
        if(pageReference){
            var state=pageReference.state;
            console.log('state::::',state);
            if(state.c__cartId){
                console.log('cartId: response:::: from urls:::', state.c__cartId);
                component.set('v.cartId',state.c__cartId);
                var action=component.get('c.getCartItems');
                action.setParams({
                    'cartId':component.get('v.cartId')
                });
                action.setCallback(this, function(response){
                    var stateResponse = response.getState();
                    if(stateResponse === 'SUCCESS' || stateResponse === 'DRAFT'){
                        var resultData=response.getReturnValue();
                        console.log('Result Data::: 34:::', resultData);
                       // console.log('resultData length34::::', resultData.length);
                        var items=[];
                        var subTotal;
                        for(var key in resultData){
                            items.push(resultData[key]);
                            if(subTotal){
                                subTotal=subTotal+ resultData[key].Total_Amount__c;
                            }else{
                                subTotal=resultData[key].Total_Amount__c;
                            }
                        }
                        component.set('v.subTotal',subTotal);
                        component.set('v.cartItemList', items);
                    } else if (stateResponse === 'INCOMPLETE'){
                        console.log('User is in Offline System doesnot support offline');
                    } else if(stateResponse === 'ERROR'){
                        var errors= response.getError();
                        if(errors || errors[0].pageMessage){
                            console.log('Page Error:::',errors[0].pageMessage);
                        }
                    } else{
                        
                    }
                });
                $A.enqueueAction(action);
            }
        }
    },
    
    homePage: function(component, event,helper){
       // alert('onclick homePage:::');
         var navService=component.find("navService");
        var pageReference= {
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
        console.log('test456');

    },
    
    applyCoupon: function(component, event, helper){
        component.set('v.isCouponAplied',true);
    },
    
    doApplyCoupon: function(component,event,helper){
        var couponNo=component.find('CouponNo').get('v.value');
        var cartId=component.get('v.cartId');
        if(couponNo){
            var action=component.get('c.checkCoupon');
            action.setParams({
                'Name': couponNo,
                'CartId':cartId
            });
            action.setCallback(this, function (response){
                var state= response.getState();
                if(state === 'SUCCESS' || state === 'DRAFT'){
                    var resultData= response.getReturnValue();
                    if(resultData){
                        component.set('v.discountAmount', resultData);
                        component.set('v.errorDiscount',null);
                        component.set('v.isCouponSuccess', true);
                    }else{
                        component.set('v.errorDiscount','Coupon is not Valid OR Expired.');
                        component.set('v.discountAmount',null);
                         component.set('v.isCouponSuccess', false);
                    }
                }
            });
            $A.enqueueAction(action);
        } else{
            alert('Please Enter the Coupon No.');
        }
    },
    
    doCheckout: function(component,event,helper){
        component.set('v.isCheckout', true);
    },
    
    doSaveAddress: function(component,event,helper){
        var isValidAddress= helper.validate(component,event,helper);
       // alert('isValid Address::::'+isValidAddress);
        if(isValidAddress){
            component.set('v.addressBook.Account__c','0012v00002UGibw');
           // alert('next:::');
            component.find('recordCreator').saveRecord(function(saveResult) {
               // alert('SaveResult::::::'+saveResult.state);
                console.log('consoles.:::',saveResult);
                if(saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT'){
                   // alert('Success:::');
                    var showToast=$A.get('e.force:showToast');
                    showToast.setParams({
                        "title":"Record Saved",
                        "type":"Success",
                        "message":"AddressBook has been Saved with the RecordId "+saveResult.recordId
                    });
                    showToast.fire();
                    var addList = [];
                    var addrList = component.get('v.addressList');
                    if(addrList){
                        addrList.push(component.get('v.addressBook'));
                        component.set('v.addressList' , addrList);
                    }else{
                       addList.push(component.get('v.addressBook'));
                       component.set('v.addressList' , addList); 
                    }
                    component.set('v.isNewAddress', false);
                } else if(saveResult.state === 'INCOMPLETE'){
                    
                } else if(saveResult.state === 'ERROR'){
                    console.log('Problem saving contact, error: ' +JSON.stringify(saveResult.error));

                } else{
                    
                }
            });
        }
    },
    
    getAddress: function(component,event,helper){
        var isTrue= component.get('v.isCheckout');
        if(isTrue){
            helper.fetchAddress(component,event,helper);
        }
    },
    
    onSelect : function(component, event, helper){
        var selected = event.getSource().get("v.text");
        var cehcked =  event.getSource().get("v.value");
        var allAddress = component.get('v.addressList');
        var selecedAddress = allAddress[selected];
        console.log('selecedAddress ', selecedAddress);
        component.set('v.selectedAddress', selecedAddress);
    },
    
    
    placeOrder : function(component,event,helper) {
        console.log('Recurring Flag::::',component.get('v.recurringFlag'));
        console.log('Recurring Comments::::',component.get('v.recurringComments'));
        console.log('Discount amount :::::', component.get('v.discountAmount'));
        console.log('Sub Total:::', component.get('v.subTotal'));
        var comments;
        var discAmount;
        if(component.get('v.recurringComments') == 'undefined' || component.get('v.recurringComments') == ''){
            comments='';
        } else {
            comments=component.get('v.recurringComments');
        }
        if(component.get('v.discountAmount') == 'undefined' || component.get('v.discountAmount') == ''){
            discAmount=0;
        } else {
            discAmount=component.get('v.discountAmount');
        }
        console.log('Comments::::', comments);
        console.log('discAmount::::',discAmount);
        var selectedAdd= component.get('v.selectedAddress');
        if(selectedAdd){
            var userId='0012v00002UGibw';
            var action = component.get('c.createOrderBusiness');
            action.setParams({
                addressId : selectedAdd.Id,
                cartId : component.get('v.cartId'),
                UserId : userId,
                subTotal : component.get('v.subTotal'),
                discountAmount: discAmount,
                description:comments
            });
            action.setCallback(this, function(response) {
                var state= response.getState();
                if(state === 'SUCCESS' || state === 'DRAFT'){
                    var showToast=$A.get('e.force:showToast');
                    var resultData=response.getReturnValue();
                    showToast.setParams({
                        "title" : "Record Saved",
                        "type" : "success",
                        "message" : "Your Order Has been Successfully Placed." +
                        "Your tracking Order no is "+resultData.split('####')[0]+" and Opportunity Tracking Number "+resultData.split('####')[2]
                    });
                    showToast.fire();
                    var pageReference= component.find("navigation");
                    var pageReferenceNav={
                        "type": "standard__recordPage",
                        "attributes":{
                            "recordId": resultData.split('####')[1],
                            "objectApiName": "Orders__c",
                            "actionName":"view"
                        }
                    };
                    pageReference.navigate(pageReferenceNav,true);
                }else if(state === 'INCOMPLETE'){
                    console.log('User is offline and System does not support offline!.');
                }else if(state === 'ERROR'){
                    var errors = response.getError();
                    console.log('Error Occured ', errors);
                }else{
                    
                }
            });
            $A.enqueueAction(action);
        } else{
            alert('Please select address');
        }
    },
    
     addNewAddress : function(component, event, helper){
        
        component.set('v.isNewAddress', true);
    },
    
    recurFlag: function(component,event,helper){
        var checkComp=component.find('recurringFlag').get('v.value');
        console.log('checkComp:::',checkComp);
        component.set('v.recurringFlag',checkComp);
    },
    
    onRecurringChange : function(component,event,helper){
        var recFreq= component.find('select').get('v.value');
        console.log('recFreq::::',recFreq);
        component.set('v.recurringComments',recFreq);
    }
})