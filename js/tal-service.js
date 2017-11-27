/* Tal Service */

var TalService = {
		
		getAccountType : function(){
			
			var service_key = '4527472882761054349344862033393789429982';
			
			var account_type_url = 'http://api.transafricaadmin.co.za/?method=accounttype';
			
			var accountTypes = [
				  {
				    "AccountID": 5,
				    "AccountLabel": "Current"
				  },
				  {
				    "AccountID": 3,
				    "AccountLabel": "Savings"
				  }
				];
			
			/*$.ajax({
				  url: account_type_url,
				  type: 'GET',
				  dataType: 'json',
				  success: function( resp ) {
					  
				    console.log( resp );
				  },
				  error: function( req, status, err ) {
					  
				    console.log( 'error', status, err );
				  }
				});*/
			
			
			/*var dfd = new jQuery.Deferred();
	        
	        $.getJSON( bank_account_url ).done(function( response ){
	            dfd.resolve( response );
	            
	            console.log( response );
	            
	        }).fail(function( jqxhr, textStatus, error ) {
	        	
	        	var err = textStatus + ", " + error;
	        	
	            dfd.reject( err );
	            
	            console.log( err );
	        });         
	        
	        return dfd.promise();*/
			
			/*$.getJSON( bank_account_url + '&callback=?', function(data) {
			 console.log( data );
			});*/
			
			return accountTypes;
		},
		
		getBank : function(){
			
			var bank_url = 'http://api.transafricaadmin.co.za/?method=bank';
			
			var banks =[ 
					{
					  "BankID": 4,
					  "BankLabel": "ABSA"
					}
					];
			
			return banks;
			
		},
		
		getPlanDetail : function( planId ){
			
			var plan_detail_url = 'http://api.transafricaadmin.co.za/?method=plandetail&servicekey=1234567890098765432112345678900987654321&planid=1111';
			
			var plan_id = planId;
			
			if( plan_id == '1684'){
				
				var plan_detail = [
					{
					"ChildCover":1250,
					"ChildDescription":"CHILDREN",
					"ChildItemLimit":1,
					"MinAge":0,
					"MaxAge":21,
					"ChildPremium":0
					},
					{
						"ChildCover":3000,
						"ChildDescription":"MAIN MEMBER",
						"ChildItemLimit":1,
						"MinAge":18,
						"MaxAge":74,
						"ChildPremium":0
						}
					];
			}
			
			if( plan_id == '1685'){
				
				var plan_detail = [
					{
					"ChildCover":1250,
					"ChildDescription":"CHILDREN",
					"ChildItemLimit":1,
					"MinAge":0,
					"MaxAge":21,
					"ChildPremium":0
					},
					{
						"ChildCover":3000,
						"ChildDescription":"MAIN MEMBER",
						"ChildItemLimit":1,
						"MinAge":18,
						"MaxAge":74,
						"ChildPremium":0
						},
						{
							"ChildCover":3000,
							"ChildDescription":"MAIN MEMBER",
							"ChildItemLimit":1,
							"MinAge":18,
							"MaxAge":74,
							"ChildPremium":0
							},
							{
								"ChildCover":3000,
								"ChildDescription":"MAIN MEMBER",
								"ChildItemLimit":1,
								"MinAge":18,
								"MaxAge":74,
								"ChildPremium":0
								},
								{
									"ChildCover":3000,
									"ChildDescription":"MAIN MEMBER",
									"ChildItemLimit":1,
									"MinAge":18,
									"MaxAge":74,
									"ChildPremium":0
									}
							
					
					];
			}
			
			return plan_detail;
		},
		
		getPlanListObj : function( planId ){
			
			var plan_list_url = "http://api.transafricaadmin.co.za/?method=planlist&servicekey=4527472882761054349344862033393789429982";
			
			/*var plan_list = [
				{
					"PlanID":1684,
					"PlanName":"FAMILY PLAN A COVER R3000",
					"Premium":35
					},
					{
						"PlanID":1685,
						"PlanName":"FAMILY PLAN AA ",
						"Premium":70
						},
						{
							"PlanID":1686,
							"PlanName":"FAMILY PLAN B COVER R10000",
							"Premium":80},{"PlanID":1687,
							"PlanName":"FAMILY PLAN BB COVER R10000","Premium":90
							},
							{
								"PlanID":1688,"PlanName":"FAMILY PLAN C COVER R1500",
								"Premium":100
								},
								{
									"PlanID":1689,
									"PlanName":"FAMILY PLAN CC COVER R15000",
									"Premium":110
									},
									{
										"PlanID":1690,
										"PlanName":"FAMILY PLAN D COVER R20000",
										"Premium":120
										},
										{
											"PlanID":1691,
											"PlanName":"FAMILY PLAN DD COVER R20000",
											"Premium":130
											}
										];*/
			
			
			
			/*for (var i = 0; i < plan_list.length; i++) {
		        if (plan_list[i]['PlanID'] === parseInt( planId )) {
		        	return plan_list[i];
		        }
		    }
		    return null;*/
			
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
		
		getIncomeBracketType : function(){
			
			var incomeBracketType_url = 'http://api.transafricaadmin.co.za/?method=incomebrackettype';
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: incomeBracketType_url,
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