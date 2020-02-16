public class CartDetailsController {
    
    @AuraEnabled
    public static String getCartId(List<String> foodItemList){
        System.debug('Enter inside getCartId::'+foodItemList);
        List<Cart__c> cartList= getCart();
        if(cartList !=null && cartList.size() >0){
            createCartItems(foodItemList, cartList[0].Id);
            System.debug('Printing the Cart Id:::'+cartList[0].Id);
            return cartList[0].Id;
        } else{
            Cart__c cart = new Cart__c(Coupon__c = getCoupon('Default')[0].Id,
                                       Cart_Id__c=String.valueOf(Math.random()),
                                       Cart_Status__c='Open', 
                                       IsActive__c=true, 
                                       user_Account__c = '0012v00002UGibw');
            insert cart;
            createCartItems(foodItemList, cart.Id);
            System.debug('Printing the cart Id in else::::::'+cart.Id);
            return  cart.Id;  
        }
    }
    
    public static List<Cart__c> getCart(){
        System.debug('Entering inside getCart():::');
        List<Cart__c> cartList= [Select Id,Name from Cart__c where User_Account__c='0012v00002UGibw' and isActive__c=true];
        System.debug('cartList:::::'+cartList);
        return cartList;
    }
    
    @AuraEnabled
    public static String createCartItems (List<String> foodItemList, String cartId){
        System.debug('Entering inside createCartItems:::'+foodItemList+'~~~~ Cart Id::::'+cartId);
        List<Cart_Item__c> cartItemList= new List<Cart_Item__c>();
        List<Cart_Item__c> cartItemListUpdate= new List<Cart_Item__c>();
        Map<Id, Cart_Item__c> foodQntyMap= getCartItems(cartId);
        System.debug('foodQntyMap::::::'+foodQntyMap);
        for(String food: foodItemList){
            if(foodQntyMap !=null && foodQntyMap.containsKey(food)) {
                System.debug('Enter ifs:::::line 40:::');
                Cart_Item__c ct= foodQntyMap.get(food);
                System.debug('ct::::::'+ct);
                Cart_Item__c cartIns= new Cart_Item__c(Id = ct.Id,
                                                      Item_Quantity__c= ct.Item_Quantity__c+1);
                cartItemListUpdate.add(cartIns);
            } else {
                System.debug('Enter else:: line 46:::');
                Integer qnty=1;
                Cart_Item__c cartInsert=new Cart_Item__c (
                	cart__c=cartId,
                    Generic_Item__c= food,
                    Item_Quantity__c= qnty
                	);
                cartItemList.add(cartInsert);
            }
        }
        insert cartItemList;
        if(cartItemListUpdate !=null && cartItemListUpdate.size() >0){
            update cartItemListUpdate;
        }
        System.debug('cart Id end of createCartItems:::::'+cartId);
        return cartId;
    }
    
    @AuraEnabled
    public static Map<Id,Cart_Item__c> getCartItems(String cartId){
        System.debug('Entering inside getCartItems:::::'+cartId);
        List<Cart_Item__c> existingFoodItemList= [Select Id, Name, Cart__c, Generic_Item__c, Generic_Item__r.Item_Name__c, Total_Amount__c,Item_Quantity__c, Item_Amount__c from Cart_Item__c
                                                  where Cart__c =: cartId];
        System.debug('existing Food Items in cart::::::::'+existingFoodItemList);
        Map<Id, Cart_Item__c> existingFoodItemMap = new Map<Id, Cart_Item__c>();
        for(Cart_Item__c item: existingFoodItemList){
           if(!existingFoodItemMap.containsKey(item.Generic_Item__c)){
                existingFoodItemMap.put(item.Generic_Item__c, item);
            }
        }
        System.debug('Existing Food Items Map End getCartItems:::::'+existingFoodItemMap);
        return existingFoodItemMap;
    }
    
    private static List<Coupon__c> getCoupon(String Name){
        System.debug('Enters inside getCoupon::::'+Name);
        List<Coupon__c> coupon = [Select Id, Price__c,Expired__c,Remaining_Quantity__c From Coupon__c Where Name =: Name];
        System.debug('Coupon::::'+coupon);
        return coupon;
    }
    
    @AuraEnabled
    public static Decimal checkCoupon(String Name, String CartId){
        System.debug('Enters inside checkCoupon::::'+Name+'~~~~~~ Cart Id::::'+CartId);
        List<Coupon__c> couponList =  getCoupon(Name);
        System.debug('couponList:::::'+couponList+'~~~~ Size::::'+couponList.size());
        if(couponList !=null && couponList.size() > 0 && !couponList[0].Expired__c
           && couponList[0].Remaining_Quantity__c > 0){
               Cart__c cart = new Cart__c(Id = cartId, Coupon__c =couponList[0].Id );
               update cart;
               return couponList[0].Price__c;
           }else{
               return null;
           }
    }
    
     @AuraEnabled
    public static void deleteItem(String CartItemId){
        Database.delete(CartItemId);
    }
    
    @AuraEnabled(cacheable=true)
    public static String fetchAddressBook(){
        System.debug('Enters inside fetchAddressBook::::');
        List<AddressBook__c> addressList = [Select Id, Name, Street__c, State__c, City__c, 
                                             Postal_code__c, Country__c From AddressBook__c 
                                             Where Account__c = '0012v00002UGibw'];
        System.debug('AddressList::::'+addressList);
        return JSON.serialize(addressList);
    }
    
    @AuraEnabled
    public static String createOrder(String addressId, String cartId, String UserId, Decimal subTotal, Decimal discountAmount, String description){
        System.debug('Enters inside CreateOrder::::'+addressId+'~~~~CartId:::'+cartId+'::::~~userId:::'+UserId+'~~~~SubTotal:::'+subTotal
                    +'~~~~discountAmount::::'+discountAmount+'~~~~Description::::'+description);
        Decimal sTotal;
        if(discountAmount != null){
            sTotal=subTotal.abs()- discountAmount.abs();
        }else{
            sTotal=subtotal.abs();
        }
         System.debug('Stotal::::'+STotal);
        Orders__c order = new Orders__c(
          Cart__c = cartId,
            Shipping_Address__c = addressId,
            Account__c = UserId,
            Sub_Total__c = STotal,
            Description__c =description
        );
        Cart__c cart = new Cart__c(Id = cartId, Cart_Status__c='Closed', IsActive__c=false);
        insert order;
        update cart;
        System.debug('Cart Items::'+cart);
        System.debug('order ::'+order);
        
        Orders__c ord = [Select Id, Name From Orders__c Where Id=:order.Id];
        System.debug('Ord System::'+ord);
        Opportunity opp = new Opportunity(
        	Name= ord.Name,
            Type='Existing Customer - Upgrade',
            LeadSource='Web',
            TrackingNumber__c=Ord.Name,
            DeliveryInstallationStatus__c='Yet to begin',
            StageName='Prospecting',
            CloseDate= Date.today()
        );
        insert opp;
        return ord.Name+'####'+ord.Id+'####'+opp.Name+'####'+opp.Id;
    }
    
    
    @AuraEnabled
    public static String createOrderBusiness(String addressId, String cartId, String UserId, Decimal subTotal, Decimal discountAmount, String description){
        System.debug('Enters inside CreateOrder::::'+addressId+'~~~~CartId:::'+cartId+'::::~~userId:::'+UserId+'~~~~SubTotal:::'+subTotal
                    +'~~~~discountAmount::::'+discountAmount+'~~~~Description::::'+description);
        Decimal sTotal;
        if(discountAmount != null){
            sTotal=subTotal.abs()- discountAmount.abs();
        }else{
            sTotal=subtotal.abs();
        }
         System.debug('Stotal::::'+STotal);
        Orders__c order = new Orders__c(
          Cart__c = cartId,
            Shipping_Address__c = addressId,
            Account__c = UserId,
            Sub_Total__c = STotal,
            Description__c =description
        );
        Cart__c cart = new Cart__c(Id = cartId, Cart_Status__c='Closed', IsActive__c=false);
        insert order;
        update cart;
        System.debug('Cart Items::'+cart);
        System.debug('order ::'+order);
        
        Orders__c ord = [Select Id, Name From Orders__c Where Id=:order.Id];
        System.debug('Ord System::'+ord);
        Opportunity opp = new Opportunity(
        	Name= ord.Name,
            Type='Existing Customer - Upgrade',
            LeadSource='Web',
            TrackingNumber__c=Ord.Name,
            DeliveryInstallationStatus__c='Yet to begin',
            StageName='Prospecting',
            CloseDate= Date.today()
        );
        insert opp;
        return ord.Name+'####'+ord.Id+'####'+opp.Name+'####'+opp.Id;
    }
}