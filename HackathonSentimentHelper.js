({
	predictSentiment : function(component,event,helper) {
        //alert('456:::');
		var action = component.get("c.getCaseAnalysis");
        var ctx = component.find("polar-chart").getElement();
        console.log('Model Id:::',component.get("v.modelId"));
        console.log('Sentiment::::',component.get("v.sentiment"));
        action.setParams({
           "sentimentModel":  component.get("v.modelId") , 
           "textToAnylize":  component.get("v.sentiment")  
        });
        var templabels = [] ; 
        var tempdata = [] ; 
        action.setCallback(this, function(response){
            var state= response.getState();
            console.log('state::::',state);
            console.log('Value:::',response.getReturnValue());
            if(state === 'SUCCESS'){
               // alert('inside:::');
                var predictionResult = response.getReturnValue();
                console.log('Pred:::',predictionResult);
                predictionResult.forEach((key,value) => {
                    templabels.push(predictionResult[value].label);
                    tempdata.push(predictionResult[value].probability*100);
                });
                    var positive= tempdata[0];
                    console.log('Positive::::', positive);
                    component.set('v.positive',positive);
                    var negative=tempdata[1];
                    console.log('Negative:::', negative);
                    component.set('v.negative',negative);
                    var neutral= tempdata[2];
                    console.log('Neutral:::',neutral);
                    component.set('v.neutral',neutral);
                    console.log('tempdata:::',tempdata);
                    console.log('templabels:::',templabels);
                    component.set('v.showData',true);
                   /* var el=component.find('polar-chart').getElement();
                    console.log('el::::',el);
                    var ctx=el.getContext('2d');
                    console.log('ctx:::',ctx);
                    new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels:templabels,
                        datasets: [
                            {
                                label: "Custom Sentimental Analysis",
                                backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                                data: tempdata
                            }
                        ]
                    },
                    options: {
                        title: {
                            display:true,
                            text: 'Predictive Result'
                        }
                    }
                });*/
            } else if(state === 'ERROR'){
                var errors=response.getError();
                console.log('errors:::', errors);
            }
        });
        $A.enqueueAction(action);
	}
})