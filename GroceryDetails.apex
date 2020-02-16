public class GroceryDetails {
    
    @AuraEnabled
    public static List<Grocery__c> getGroceryList(String groceryName){
        System.debug('Enter into GroceryList class:::'+groceryName);
        String likeParam1;
        if(groceryName !=null){
            likeParam1='%'+groceryName+'%';
        }
        System.debug('likeParam1::::'+likeParam1);
        List<Grocery__c> groceryList= new List<Grocery__c>();
        if(likeParam1 !='%%'){
            groceryList=[Select Name, Grocery_Name__c from Grocery__c where Grocery_Name__c like :likeParam1];
        }else{
            groceryList=[Select Name, Grocery_Name__c from Grocery__c ];
        }
        return groceryList;
    }
    
    @AuraEnabled
    public static List<Generic_Item__c> fetchGenericItems (String groceryId){
        System.debug('Enter into fetchGenericItems:::'+groceryId);
        List<Generic_Item__c> genericItemList= new List<Generic_Item__c>();
        if(groceryId != null){
            genericItemList=[Select Id, Name, Item_Id__c, Item_Name__c, Item_Price__c, Wholesaler_Name__c, Total_Quantity__c from 
                             Generic_Item__c where Grocery__r.Id =:groceryId and RecordType.Name='Grocery'];
        }
        System.debug('fetchGenericItems:::'+genericItemList+'~~~~'+genericItemList.size());
        return genericItemList;
    }
    
    @AuraEnabled
    public static String addToWishlist(String selectedFood){
        System.debug('Enter inside addToWishlist:::'+selectedFood);
        List<Lead> leadList= new List<Lead>();
        List<Lead> updateList= new List<Lead>();
        Generic_Item__c gItem=[Select Id, Name, Item_Name__c, Item_Id__c from Generic_Item__c where Id=: selectedFood];
        List<Lead> leadsObj= [Select Id, Name, LastName from Lead where LastName=: gItem.Name];
        if(leadsObj.size() >0) {
            for(Lead leadObj : leadsObj){
                if(leadObj.LastName == gItem.Name){
                    leadObj.company='Infosys';
                    leadObj.LeadSource='Web';
                    leadObj.Phone='9632587410';
                    leadObj.Email='work@email.com';
                    leadObj.Status='New - Not Contacted';
                    leadObj.Generic_Item__c=gItem.Id;
                    leadObj.firstName=gItem.Name+' '+gItem.Item_Id__c;
                    updateList.add(leadObj);
                }
            }
            if(updateList.size() > 0){
                update updateList;
            }
            System.debug('updatelist last:::'+string.valueOf(updateList[0].Name));
            return string.valueOf(updateList[0].Id);
        }else{
            Lead lead= new Lead(LastName= gItem.Name, company='Infosys', LeadSource='Web',
                                Phone='9632587410', Email='work_email@test.com', Status='New - Not Contacted',
                                Generic_Item__c=gItem.Id, firstName=gItem.Name+' '+gItem.Item_Id__c);
            leadList.add(lead);
            if(leadList.size() > 0){
                insert leadList;
            }
            System.debug('last Return:::'+string.valueOf(leadList[0].Name));
            return string.valueOf(leadList[0].Id);
        }
    }
    
}