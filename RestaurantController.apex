public with sharing class RestaurantController {
    
    public class DataSet{
        public DataSet (String label, Decimal count) {
            this.label=label;
            this.count=count;
        }
        @AuraEnabled
        public String label {get;set;}
        
        @AuraEnabled
        public Decimal count {get;set;}
        
    }
    @AuraEnabled
    public Static List<DataSet> getAllReviewsRestaurant() {
        List<Restaurant__c> result= [Select Review_Count__c, Restaurant_Name__c from Restaurant__c order by Review_Count__c desc LIMIT 5];
        List<DataSet> dataSetList= new List<DataSet>();
        for(Restaurant__c ar: result) {
            String resName=(String)ar.get('Restaurant_Name__c');
            Decimal reviewCount= (Decimal)ar.get('Review_Count__c');
            dataSetList.add(new DataSet(resName, reviewCount));
        }
        System.debug('dataSetList::::'+dataSetList);
        return dataSetList;
    }
    
    @AuraEnabled
    public static List<Restaurant__c> getRestaurantList (String locationName, String cuisineList) {
        System.debug('Enters inside getRestaurantList'+locationName+'~~~~'+cuisineList);
        String likeParam1;
        String likeParam2;
        if(locationName !=null){
            likeParam1='%'+locationName+'%';
        }
        if(cuisineList !=null){
            likeParam2='%'+cuisineList+'%';
        }
        System.debug('likeParam1:::'+likeParam1);
        System.debug('likeParam2:::'+likeParam2);
        List<Restaurant__c> resList= new List<Restaurant__c>();
        if(likeParam1 !='%%' && likeParam2 !='%%') {
            resList= [Select Id, Name, Average_Cost_for_two_person__c, Bulk_Order__c,
                      Cuisines__c, Location_Address__c, Restaurant_Entity_Id__c, Restaurant_Name__c,
                      Restaurant_Phone__c, Review_Count__c, Timings__c,Location_City__c from Restaurant__c where Location_City__c like :likeParam1 and Cuisines__c in ( :cuisineList) order by Review_Count__c desc];
        } else if(likeParam1 !='%%' && likeParam2.endsWithIgnoreCase('%%')) {
            resList=[Select Id, Name, Average_Cost_for_two_person__c, Bulk_Order__c,
                     Cuisines__c, Location_Address__c, Restaurant_Entity_Id__c, Restaurant_Name__c,
                     Restaurant_Phone__c, Review_Count__c, Timings__c,Location_City__c from Restaurant__c  where Location_City__c like :likeParam1  order by Review_Count__c desc] ;
        } else if(likeParam1.equalsIgnoreCase('%%') && likeParam2 !='%%'){
            resList=[Select Id, Name, Average_Cost_for_two_person__c, Bulk_Order__c,
                     Cuisines__c, Location_Address__c, Restaurant_Entity_Id__c, Restaurant_Name__c,
                     Restaurant_Phone__c, Review_Count__c, Timings__c,Location_City__c from Restaurant__c  where Cuisines__c in ( :cuisineList)  order by Review_Count__c desc];
        } else {
            resList=[Select Id, Name, Average_Cost_for_two_person__c, Bulk_Order__c,
                     Cuisines__c, Location_Address__c, Restaurant_Entity_Id__c, Restaurant_Name__c,
                     Restaurant_Phone__c, Review_Count__c, Timings__c,Location_City__c from Restaurant__c order by Review_Count__c desc ];
        }
        return resList;
    }
    
    @AuraEnabled
    public static List<Restaurant__c> getSelectedRestaurantList (String resName){
        System.debug('Enter into getSelectedRestaurantList:::'+resName);
        List<Restaurant__c> resList= new List<Restaurant__c>();
        if(resName != null && resName !=''){
            resName='%'+resName+'%';
        }
        if(resName != '%%'){
            resList=[Select Id, Name, Average_Cost_for_two_person__c, Bulk_Order__c,
                     Cuisines__c, Location_Address__c, Restaurant_Entity_Id__c, Restaurant_Name__c,
                     Restaurant_Phone__c, Review_Count__c, Timings__c,Location_City__c from Restaurant__c where Restaurant_Name__c like :resName order by Review_Count__c desc ];
        }
        return resList;
    }
    
    @AuraEnabled
    public static List<Generic_Item__c>fetchOpp(String resId){
        System.debug('Enters inside fetchOpp:::'+resId);
        List<Generic_Item__c> oppsList= new List<Generic_Item__c>();
        if(resId !=null){
            oppsList= [Select Id, Name, Item_Id__c, Item_Name__c, Item_Price__c, Restaurant__c, Tags__c, Total_Quantity__c from 
                       Generic_Item__c where Restaurant__r.Id =:resId and RecordType.Name='Restaurant'];
        }
        System.debug('oppsList::'+oppsList);
        System.debug('oppsList Size:::'+oppsList.size());
        return oppsList;
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
    
    @AuraEnabled
    public static List<Generic_Item__c> getGenericList(String accountId, String recordType, String restaurantId){
        System.debug('Enter inside getGenericList::::::'+accountId);
        List<Generic_Item__c> allGenericList= new List<Generic_Item__c>();
        Map<Id, Id> orderCartMap= new Map<Id,Id>();
        List<Id> cartOrderIdList= new List<Id>();
        Map<Id, Integer> genericItemCount= new Map<Id,Integer>();
        List<Id> genericItemList = new List<Id>();
        List<String> genNames=new List<String>();
        List<String> finalGenList= new List<String>();
        Integer count=0;
        try {
            for(Orders__c order : [Select Id, Name, Cart__r.Id from Orders__c where Account__r.Id =:accountId]){
                cartOrderIdList.add(order.cart__r.Id);
                orderCartMap.put(order.Id, order.cart__r.Id);
            }
            for(Cart_Item__c cartItems : [Select Id, Name, Generic_Item__r.Id, Generic_Item__r.Name, generic_Item__r.recordtype.Name from Cart_Item__c where Cart__r.Id in :cartOrderIdList]) {
                if(cartItems.generic_item__r.recordtype.Name =='Restaurant'){
                    if(genericItemCount.containsKey(cartItems.Generic_Item__r.Id)){
                        integer c=genericItemCount.get(cartItems.Generic_Item__r.Id);
                        genericItemCount.put(cartItems.Generic_Item__r.Id, c+1);
                        if(!genericItemList.contains(cartItems.Generic_Item__r.Id)){
                            genericItemList.add(cartItems.Generic_Item__r.Id);
                        }
                    }else{
                        genericItemCount.put(cartItems.Generic_Item__r.Id,1);
                        if(!genericItemList.contains(cartItems.Generic_Item__r.Id)){
                            genericItemList.add(cartItems.Generic_Item__r.Id);
                        }
                    }
                }
            }        
            System.debug('GenericItemCountMap::::'+genericItemCount);
            MapWrapper[] mapWrapperList = new MapWrapper[0];
            for(String key: genericItemCount.keySet()){
                mapWrapperList.add(new MapWrapper(key, genericItemCount.get(key)));
            }
            mapWrapperList.sort();
            List<MapWrapper> finalWrapperList= new List<MapWrapper>();
            Integer cc=0;
            for(Integer i=mapWrapperList.size()-1; i>=0;i--){
                if(cc <4) {
                    finalWrapperList.add(mapWrapperList.get(i));
                }
                cc=cc+1;
            }
            System.debug('mapWrapperList::::::'+mapWrapperList);
            System.debug('finalWrapperList:::'+finalWrapperList+'~~~Size::::'+finalWrapperList.size());
            for(MapWrapper c123: finalWrapperList){
                finalGenList.add(c123.genId);
            }
            System.debug('finalGenList:::'+finalGenList);
            for(Generic_Item__c genItems : [Select Id, Name, Item_Name__c, Item_Price__c , Restaurant__r.Id,Tags__c from Generic_Item__c where Id =:finalGenList]){
                if(restaurantId.equals(genItems.restaurant__r.Id)){
                    allGenericList.add(genItems);
                    genNames.add(genItems.Name);
                }
            }
            
        }catch(Exception e){
            
        }
        System.debug('genericItemCount:::::'+genericItemCount.size()+'~~~~'+genericItemCount);
        System.debug('genName::::'+genNames);
        System.debug('allGenList:::'+allGenericList.size()+'~~~~'+allGenericList);
        return allGenericList;
    }
    public class MapWrapper implements Comparable {
        public String genId;
        public Integer counter;
        
        public MapWrapper(String genId, Integer counter){
            this.genId=genId;
            this.counter=counter;
        }
        public Integer compareTo(Object other){
            return counter- ((MapWrapper)other).counter;
        }
    }
}