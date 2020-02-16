/*({
	create : function(component, event, helper) {
		alert('Create record');
        
        //getting the review information
        var candidate = component.get("v.review");
        
        
        //Calling the Apex Function
        var action = component.get("c.createRecord");
        
        //Setting the Apex Parameter
        action.setParams({
            review : review
        });
        
        //Setting the Callback
        action.setCallback(this,function(a){
            //get the response state
            var state = a.getState();
            
            //check if result is successfull
            if(state == "SUCCESS"){
                //Reset Form
                var newReview = {'sobjectType': 'Candidate__c',
                         'Generic_Item__c': '',
                         'Review_Score__c': '',
                         'Review_Comment__c': '', 
                         'Food_Item__c': ''
                                   };
                //resetting the Values in the form
                component.set("v.review",newReview);
                alert('Record is Created Successfully');
            } else if(state == "ERROR"){
                alert('Error in calling server side action');
            }
        });
        
		//adds the server-side action to the queue        
        $A.enqueueAction(action);

	}
})*/
({
    doInit : function(component, event, helper) {

        // Prepare the action to load account record
        var action = component.get("c.getCartItem");
        action.setParams({"cartItemId": component.get("v.recordId")});

        // Configure response handler
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.review", response.getReturnValue());
            } else {
                console.log('Problem getting account, response state: ' + state);
            }
        });
        $A.enqueueAction(action);
    },
    
    
    
    create : function(component, event, helper) {
		alert('Create record');
        
        //getting the review information
        var candidate = component.get("v.review");
        
        
        //Calling the Apex Function
        var action = component.get("c.createRecord");
        
        //Setting the Apex Parameter
        action.setParams({
            review : review
        });
        
        //Setting the Callback
        action.setCallback(this,function(a){
            //get the response state
            var state = a.getState();
            
            //check if result is successfull
            if(state == "SUCCESS"){
                //Reset Form
                var newReview = {'sobjectType': 'Candidate__c',
                         'Generic_Item__c': '',
                         'Review_Score__c': '',
                         'Review_Comment__c': '', 
                         'Food_Item__c': ''
                                   };
                //resetting the Values in the form
                component.set("v.review",newReview);
                alert('Record is Created Successfully');
            } else if(state == "ERROR"){
                alert('Error in calling server side action');
            }
        });
        
		//adds the server-side action to the queue        
        $A.enqueueAction(action);

	
	},

  /*  handleSaveContact: function(component, event, helper) {
        if(helper.validateContactForm(component)) {
            
            // Prepare the action to create the new contact
            var saveContactAction = component.get("c.saveContactWithAccount");
            saveContactAction.setParams({
                "contact": component.get("v.newContact"),
                "accountId": component.get("v.recordId")
            });

            // Configure the response handler for the action
            saveContactAction.setCallback(this, function(response) {
                var state = response.getState();
                if(state === "SUCCESS") {

                    // Prepare a toast UI message
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "title": "Contact Saved",
                        "message": "The new contact was created."
                    });

                    // Update the UI: close panel, show toast, refresh account page
                    $A.get("e.force:closeQuickAction").fire();
                    resultsToast.fire();
                    $A.get("e.force:refreshView").fire();
                }
                else if (state === "ERROR") {
                    console.log('Problem saving contact, response state: ' + state);
                }
                else {
                    console.log('Unknown problem, response state: ' + state);
                }
            });

            // Send the request to create the new contact
            $A.enqueueAction(saveContactAction);
        }
        
    },*/

	handleCancel: function(component, event, helper) {
	    $A.get("e.force:closeQuickAction").fire();
    }
})