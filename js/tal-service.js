/* Tal Service */
var service_key = '4527472882761054349344862033393789429982';

var TalService = {
		
		isConfigured : false,
		
		/*
		 * This endpoint retrieves all the bank account types accepted by TAPS.
		 */
		getAccountType : function(){
			
			var account_type_url = 'http://api.transafricaadmin.co.za/?method=accounttype';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: account_type_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();			
			
		},
		
		/*
		 * This endpoint retrieves all the Bank Names currently accepted by TAPS.
		 */
		getBank : function(){
			
			var bank_url = 'http://api.transafricaadmin.co.za/?method=bank';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: bank_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();	
			
		},
		
		/*
		 * This endpoint retrieves the payment types available in TAPS.
		 */
		getPaymentType : function(){
			
			var payment_type_url = 'http://api.transafricaadmin.co.za/?method=paymenttype';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: payment_type_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();	
			
		},
		
		/*
		 * This endpoint retrieves a breakdown of a specific plan, along with dependent types, limits and any additional premiums. 
		 * PlanID is drived from one of the plans available when retrieving method 'planlist'.
		 */
		getPlanDetail : function( planId ){
			
			var plan_detail_url = 'http://api.transafricaadmin.co.za/?method=plandetail&servicekey='+service_key+'&planid='+planId;
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: plan_detail_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
			
		},
		
		/*
		 * This endpoint retrieves all the 3rd parties products / plans available in TAPS.
		 */
		getPlanList : function(){
			
			var plan_list_url = "http://api.transafricaadmin.co.za/?method=planlist&servicekey="+service_key;
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: plan_list_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise(); 
		},
		
		/*
		 * This endpoint retrieves all the income bracket types available in TAPS.
		 */
		getIncomeBracketType : function(){
			
			var income_bracket_type_url = 'http://api.transafricaadmin.co.za/?method=incomebrackettype';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: income_bracket_type_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
			
		},
		
		/*
		 * This endpoint retrieves the different dependent and beneficiary relationship types available in TAPS.
		 */
		getRelationshipTypeId : function(){
			
			var relationship_type_id_url = 'http://api.transafricaadmin.co.za/?method=relationshiptypeid';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: relationship_type_id_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
			
		},
		
		/*
		 * This endpoint retrieves the payment days available to set a debit order going off day, in other words the day of the month the debit order should fall on..
		 */
		getPayDebitDayId : function(){
			
			var pay_debit_day_id_url = 'http://api.transafricaadmin.co.za/?method=paydebitdayid';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: pay_debit_day_id_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
		},
		
		/*
		 * This endpoint retrieves all the needs and objective types available in TAPS.
		 */
		getNeedsAndObjectives : function(){
			
			var needs_and_objectives_url = 'http://api.transafricaadmin.co.za/?method=needsandobjectives';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: needs_and_objectives_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
			
		},
		
		validateIdNumber : function( id ){
			
			var validate_id_number_url = 'http://api.transafricaadmin.co.za/?method=validateidnumber&servicekey='+service_key+'&idnumber='+id;
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: validate_id_number_url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
		},
		
		getMemTypes : function(){
			
			var url = 'http://api.transafricaadmin.co.za/?method=memtypes';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: url,
	            dataType: 'json',
	            success: function( response ){
	            	
	                dfd.resolve( response );
	            },
	            error: function( jqXHR, textStatus, errorThrown ){
	            	
	            	dfd.reject( textStatus );
	            }
	        });
	                
	        return dfd.promise();
		}
		
		
}