/* Tal Service */

var TalService = {
		
		isConfigured : false,
		
		service_key : '4527472882761054349344862033393789429982',
		
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
			
			var plan_detail_url = 'http://api.transafricaadmin.co.za/?method=plandetail&servicekey='+TalService.service_key+'&planid='+planId;
			
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
			
			var plan_list_url = "http://api.transafricaadmin.co.za/?method=planlist&servicekey="+TalService.service_key;
			
			var dfd = new jQuery.Deferred();	        	        
	        
	        $.ajax({
	            method: 'GET',
	            url: plan_list_url,
	            dataType: 'json',
		  	    timeout: 1000 * 20,
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
		
		/*
		 * This endpoint returns policies based on a keyword
			Fields searched: Policy Number, Main Member ID Number, Policy Holder Surname, Work Permit Number, Passport Number or Cell Phone Number.
			Depending on your keyword, this method can return more than one result.
		 */
		policySearch : function( keyword ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=policysearch&servicekey='+TalService.service_key+'&keyword='+ keyword;
			
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
		},
		
		/*
		 * This endpoint retrieves the last 12 payments made against a policy.
		 */
		getPaymenthistory : function( polId ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=paymenthistory&polid='+ polId +'&servicekey='+TalService.service_key;
			
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
		},
		
		/*
		 * This endpoint retrieves the payment periods available for allocating a payment against.
		*/		
		getPaymentPeriod : function(){
			
			var url = 'http://api.transafricaadmin.co.za/?method=paymentperiod';
			
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
		},
		
		/*
		 * This endpoint retrieves the monthly premium for the selected policy.
		*/		
		requestPremium : function( polid ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=requestpremium&serviceKey='+TalService.service_key+'&PolID=' + polid;
			
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
		},
		
		/*
		 * This endpoint returns the detail of the selected policy.
		*/		
		policyView : function( polid ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=policyview&serviceKey='+TalService.service_key+'&PolID=' + polid;
			
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
		},
		
		/*
		 * Use this method to allocate payments against a policy in the system.
			Always ensure the requested amount and the returned amount are the same value. No partial payments are accepted, please submit the correct payment amount based on the total policy premium, including any additional dependent payments.
			The system only accepts payments for periods where no payment has been captured, please use method 'paymenthistory' to determine which payperiodid's are available for payment allocation.
			The system accepts multiple payment periods.
		*/		
		
		/*addPolicyPayment : function( payment, polid ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=addpolicypayment&servicekey='+TalService.service_key+'&Polid='+polid;
			
			return $.post( url, 'data=' + JSON.stringify( payment ) );
			
		},*/
		
		addPolicyPayment : function( payment, polid ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=addpolicypayment&servicekey='+TalService.service_key+'&Polid='+polid;
			
			var dfd = new jQuery.Deferred();	     
			
			 $.ajax({
		            method: 'POST',
		            url: url,
		            dataType: 'json',
		            data:JSON.stringify( payment ),
		            contentType:"application/json; charset=utf-8",
		            success: function( response ){
		            	
		                dfd.resolve( response );
		                //alert("success");
		            },
		            error: function( jqXHR, textStatus, errorThrown ){
		            	
		            	dfd.reject( jqXHR.responseText );
		            	alert( jqXHR.responseText );
		            }
		        });
		                
		        return dfd.promise();			
		},
		
		validateIdNumber : function( id ){
			
			var validate_id_number_url = 'http://api.transafricaadmin.co.za/?method=validateidnumber&servicekey='+TalService.service_key+'&idnumber='+id;
			
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
		},
		
		/*addPolicy : function( policy ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=addpolicy&servicekey='+TalService.service_key;
			
			return $.post( url, 'data=' + JSON.stringify(policy) );
			
		},*/
		
		addPolicy : function( policy ){
			
			var url = 'http://api.transafricaadmin.co.za/?method=addpolicy&servicekey='+TalService.service_key;;
			
			var dfd = new jQuery.Deferred();	     
			
			 $.ajax({
		            method: 'POST',
		            url: url,
		            dataType: 'json',
		            data:JSON.stringify( policy ),
		            contentType:"application/json; charset=utf-8",
		            success: function( response ){
		            	
		                dfd.resolve( response );
		                //alert("success");
		            },
		            error: function( jqXHR, textStatus, errorThrown ){
		            	
		            	dfd.reject( jqXHR.responseText );
		            	alert( jqXHR.responseText );
		            }
		        });
		                
		        return dfd.promise();			
		},
		
		uploadPolicyHolderSig : function( polid, signature ){
			
			var dataURL = signature;
			
			// convert base64 to raw binary data held in a string
	  	    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	  	    var byteString = atob(dataURL.split(',')[1]);
	  	    // separate out the mime component
	  	    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
	  	    // write the bytes of the string to an ArrayBuffer
	  	    var ab = new ArrayBuffer(byteString.length);
	  	    var dw = new DataView(ab);
	  	    for(var i = 0; i < byteString.length; i++) {
	  	        dw.setUint8(i, byteString.charCodeAt(i));
	  	    }
	  	    // write the ArrayBuffer to a blob, and you're done
	  	    var blob = new Blob([ab], {type: mimeString});
	  	    
	  	    var fd = new FormData();
	  	    fd.append("file1", blob, "signature.png");
	  	    
	  	    
		  	return $.ajax({
		  	    type: 'POST',
		  	    url: 'http://api.transafricaadmin.co.za/?method=uploadpolicyholdersig&ServiceKey=' + TalService.service_key + '&PolID=' + polid,
		  	    data: fd,
		  	    processData: false,
		  	    contentType: false,
		  	    timeout: 1000 * 60 * 2
		  	});
			
		},
		
		uploadAgentSig : function( polid, signature ){
			
			var dataURL = signature;
			
			// convert base64 to raw binary data held in a string
	  	    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	  	    var byteString = atob(dataURL.split(',')[1]);
	  	    // separate out the mime component
	  	    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
	  	    // write the bytes of the string to an ArrayBuffer
	  	    var ab = new ArrayBuffer(byteString.length);
	  	    var dw = new DataView(ab);
	  	    for(var i = 0; i < byteString.length; i++) {
	  	        dw.setUint8(i, byteString.charCodeAt(i));
	  	    }
	  	    // write the ArrayBuffer to a blob, and you're done
	  	    var blob = new Blob([ab], {type: mimeString});
	  	    
	  	    var fd = new FormData();
	  	    fd.append("file1", blob, "signature.png");
	  	    
	  	    
		  	return $.ajax({
		  	    type: 'POST',
		  	    url: 'http://api.transafricaadmin.co.za/?method=uploadagentsig&ServiceKey=' + TalService.service_key + '&PolID=' + polid,
		  	    data: fd,
		  	    processData: false,
		  	    contentType: false,
		  	    timeout: 1000 * 60 * 2 	  	    
		  	});
			
		}
		
}