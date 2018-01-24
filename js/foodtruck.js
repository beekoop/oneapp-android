var isCordovaApp = !!window.cordova;
var ShoppingCart = new Cart();

function closeApp(){
	navigator.notification.confirm(
           'Do you want to quit', 
           onConfirmQuit, 
           'Posterita Food POS', 
           'OK,Cancel'  
    );
}

function onConfirmQuit(button){
   if(button == "1"){
     navigator.app.exitApp(); 
   }
}

function backButtonHandler(){
	
}

function initializeCayan(){
	
	// initialize cayan
	//CayanService.init();
	
	if(CayanService.isConfigured == true && CayanService.MODE == 'CED')
	{
		/*
		CayanService.cancelTransaction().always(function(){
			
			CayanCED.startOrder( APP.UTILS.ORDER.getDocumentNo() );
			
		});	
		*/	
		
		/*
		var c = jQuery( ShoppingCart );	
		
		c.on('cart.clear', function( event ){
			
			console.log('cart.clear');
			
			var OrderNumber = APP.UTILS.ORDER.getDocumentNo();
			// CayanCED.deleteAllItems( OrderNumber, 0, 0);
			
			CayanCED.cancel().always(function(){
				CayanCED.startOrder( OrderNumber );
			});
			
		});

		c.on('cart.addLine', function( event, line ){
			
			console.log('cart.addLine');
			
			var cart = line.cart;
			
			var OrderNumber = APP.UTILS.ORDER.getDocumentNo();
			var OrderTotal = cart.grandtotal;
			var OrderTax = cart.taxtotal;
			var ItemId = line.index;
			var Sku = line.product_id;
			var Description = line.product.name;
			var Qty = line.qty;
			var Amount = new Number( line.grandtotal / line.qty ).toFixed(2);
			var TaxAmount = line.taxAmt;
			var UPC = line.product.upc; 
			
			CayanCED.addItem ( OrderNumber, OrderTotal, OrderTax, ItemId, UPC, Sku, Description, Qty, Amount, TaxAmount );
			
		});
		
		c.on('cart.updateLine', function( event, line ){
			
			console.log('cart.updateLine');
			
			var cart = line.cart;
			
			var OrderNumber = APP.UTILS.ORDER.getDocumentNo();
			var OrderTotal = cart.grandtotal;
			var OrderTax = cart.taxtotal;
			var ItemId = line.index;
			var Qty = line.qty;
			var Amount = new Number( line.grandtotal / line.qty ).toFixed(2);
			var TaxAmount = line.taxAmt;
			
			CayanCED.updateItem( OrderNumber, ItemId, OrderTotal, OrderTax, Qty, Amount, TaxAmount );
			
		});
		
		c.on('cart.removeLine', function( event, index ){
			
			console.log('cart.removeLine');
			
			var cart = this;
			
			var OrderNumber = APP.UTILS.ORDER.getDocumentNo();
			var OrderTotal = cart.grandtotal;
			var OrderTax = cart.taxtotal;
			var ItemId = index;
			
			CayanCED.deleteItem(OrderNumber, ItemId, OrderTotal, OrderTax);
			
		});
		*/
		
	}
	
	/* START CAYAN GIFT CARD */
	
	APP.GIFT_PRODUCT_CATEGORY_ID = -100;
	
	var results = APP.PRODUCT_CATEGORY.search({name:'Gift Card'});
	if( results.length > 0 ){
		var category = results[0];
		APP.GIFT_PRODUCT_CATEGORY_ID = category['productcategory_id'];
	}
	
	/* END CAYAN GIFT CARD */
	
	/* RA Cellular */
	APP.RA_CELLULAR_PRODUCT_ID = 0;
	var results = APP.PRODUCT.search({name:'RA Cellular'});
	if( results.length > 0 ){
		var product = results[0];
		APP.RA_CELLULAR_PRODUCT_ID = product['product_id'];
	}
	
	/* POLE DISPLAY */	
	
	var c = jQuery( ShoppingCart );	
	
	c.on('cart.clear', function( event ){
		
		console.log('cart.clear');	
		
		POLE_DISPLAY.display(formatPoleDisplayLine("TOTAL","0.00"), "");
	});

	c.on('cart.addLine', function( event, line ){
		
		console.log('cart.addLine');
		
		var cart = line.cart;
		
		var OrderTotal = cart.grandtotal;
		var OrderTax = cart.taxtotal;
		var ItemId = line.index;
		var Sku = line.product_id;
		var Description = line.product.name;
		var Qty = line.qty;
		var Amount = new Number( line.grandtotal / line.qty ).toFixed(2);
		var TaxAmount = line.taxAmt;
		var UPC = line.product.upc; 
		
		OrderTotal = new Number(OrderTotal).toFixed(2);
		
		POLE_DISPLAY.display(Qty + "x " + Description  , formatPoleDisplayLine("TOTAL",OrderTotal));
		
	});
	
	c.on('cart.updateLine', function( event, line ){
		
		console.log('cart.updateLine');
		
		var cart = line.cart;
		
		var OrderTotal = cart.grandtotal;
		var OrderTax = cart.taxtotal;
		var ItemId = line.index;
		var Qty = line.qty;
		var Description = line.product.name;
		var Amount = new Number( line.grandtotal / line.qty ).toFixed(2);
		var TaxAmount = line.taxAmt;
		
		OrderTotal = new Number(OrderTotal).toFixed(2);
		
		POLE_DISPLAY.display(Qty + "x " + Description  , formatPoleDisplayLine("TOTAL",OrderTotal));
		
	});
	
	c.on('cart.removeLine', function( event, line ){
		
		console.log('cart.removeLine');
		
		var cart = this;
		
		var OrderTotal = cart.grandtotal;
		var OrderTax = cart.taxtotal;
		var ItemId = line.index;
		var Qty = line.qty;
		var Description = line.product.name;
		
		OrderTotal = new Number(OrderTotal).toFixed(2);
		
		POLE_DISPLAY.display("-" + Qty + "x " + Description , formatPoleDisplayLine("TOTAL",OrderTotal));
		
	});
	
}

function formatPoleDisplayLine(label, value){
	return label + JSReceiptUtils.format(value, (20 - label.length), true);
}

function initializeBuffer(){
	
	BufferService.init().done(function(x){
		
		console.log(x);
		
	}).fail(function(e){
		
		console.error(e);
		
	});	
}

function initializeShoppingCart(){
	ShoppingCart.init();
}


function validateTerminal()
{
	var terminal_key = APP.TERMINAL_KEY;
	
	// validate terminal key
	var terminal = APP.TERMINAL.getById( terminal_key );
	
	if( terminal == null )
	{
		// go to select terminal
		menu.setMainPage('page/select-terminal.html', {closeMenu: true});		
	}
	else
	{
		var user_key = APP.USER_KEY;
		
		// validate user key
		var user = APP.USER.getById( user_key );
		
		if( user == null)
		{
			// go to select user
			menu.setMainPage('page/select-user.html', {closeMenu: true});
		}
		else
		{
			initializeShoppingCart();
			initializeBuffer();
			initializeCayan();
			
			ShoppingCart.clear();
			
			// check if till is open or close
			var tills = APP.TILL.search({'closingdate': null});
			
			if(tills.length == 0)
			{
				// go to open till
				menu.setMainPage('page/open-till.html', {closeMenu: true});
			}
			else
			{
				APP.TILL_KEY = tills[0].till_id;
				
				// go to order screen
				menu.setMainPage('page/order-screen.html', {closeMenu: true});
			}			
			
		}		
		
	}
	
	// close modal
	modal.hide();
}

function logout()
{
	ons.notification.confirm({
		  message: 'Do you want to log out?',
		  // or messageHTML: '<div>Message in HTML</div>',
		  title: 'Confirmation',
		  buttonLabels: ['Yes', 'No'],
		  animation: 'default', // or 'none'
		  primaryButtonIndex: 1,
		  cancelable: false,
		  callback: function(index) {
		    // -1: Cancel
		    // 0-: Button index from the left
		    if(index == 0){
		    	
		    	APP.logOut();
		    	
		    	menu.setSwipeable(false);
		    	// go to order screen
		    	menu.setMainPage('page/select-user.html', {closeMenu: true});		    	
		    }
		  }
		});		
	
}

function initDB(){
		
	// initialize database for account
	APP.initializeDB().done( function ( msg ){
		
		console.log( msg );
		
		// synchronize database
		APP.synchronizeDB().done( function ( msg ){
			
			console.log( msg );
			
			// init cache
			APP.initCache().done( function ( msg ){
				
				console.log( msg );
				
				validateTerminal();	
				
				
			}).fail( function ( e ){
				// failed to load cache
				console.error( e );
				
			});
			
			
		}).fail( function ( e ){
			// failed to synchronize db
			console.error( e );
			
		});
		
	}).fail( function ( e ){
		// failed to initialize db
		console.error( e );
		
	});
}

function synchronize(){
	
	modal.show();
	
	APP.pushData().done(function(msg){
		console.log(msg);
		
		ons.notification.alert({
			  message: 'Synchronization completed!',
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'Information',
			  buttonLabel: 'OK',
			  animation: 'default', // or 'none'
			  // modifier: 'optional-modifier'
			  callback: function() {
			    // Alert button is closed!
			  }
			});
		
	})
	.fail(function(msg){
		
		console.log(msg);
		
		ons.notification.alert({
			  message: 'Fail to synchronize! '+ msg,
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'Error',
			  buttonLabel: 'OK',
			  animation: 'default', // or 'none'
			  // modifier: 'optional-modifier'
			  callback: function() {
			    // Alert button is closed!
			  }
			});
	})
	.always(function(){
		modal.hide();
	});
	
}

function initializeGooglePlaceSearch($scope)
{
    var input = document.getElementById('location');
    if(input == null) return;
    
    var options = {
			  types: ['address'],
			  componentRestrictions: {country: "us"}
			 };
    
    var autocomplete = new google.maps.places.Autocomplete( input, options );
    
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
    	
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        
        $scope.location = input.value;
    });
}

var module = ons.bootstrap('my-app', ['onsen','ngScrollGlue','angularMoment','720kb.datepicker']);

module.controller('AppController', function($scope) {
	
	// navigator.splashscreen.hide();
	if( navigator && navigator.notification ){
		
		window.alert = navigator.notification.alert;
		
	}
	
	if(typeof global != "undefined"){
		
		moment = global.moment;
	}
	
	/* barcode integration */

	$(document).pos();
	$(document).on('scan.pos.barcode', function(event){
		//access `event.code` - barcode data
		
		$scope.$broadcast("SCAN_BARCODE", event.code);
		
	});
	/*
	$(document).on('swipe.pos.card', function(event){
		//access following:
		// `event.card_number` - card number only
		// `event.card_holder_first_name` - card holder first name only
		// `event.card_holder_last_name` - card holder last name only
		// `event.card_exp_date_month` - card expiration month - 2 digits
		// `event.card_exp_date_year_2` - card expiration year - 2 digits
		// `event.card_exp_date_year_4` - card expiration year - 4 digits
		// `event.swipe_data` - original swipe data from raw processing or sending to a 3rd party service
	});
	*/
	
});

// sync pos
module.controller('SyncController', function($scope) {
	
	// APP.pushData().done(function(msg){console.log(msg);}).fail(function(msg){console.log(msg);});
	// APP.pullData().done(function(msg){console.log(msg);}).fail(function(msg){console.log(msg);});
	
	var setStatus = function( status ){
		
		$scope.$apply(function(){
			$scope.status = status;
		});
		
	};
	
	$scope.status = "Please wait ...";
	// Requesting latest updates ...
	
	$scope.status = "Initializing application ...";
	
	APP.initializeDB().done( function ( msg ){
		
		console.log( msg );
		
		setStatus("Requesting latest updates ...");
		
		// synchronize database
		APP.synchronizeDB().done( function ( msg ){
			
			console.log( msg );
			
			setStatus("Applying updates ...");
			
			// init cache
			APP.initCache().done( function ( msg ){
				
				console.log( msg );
				
				setStatus("Synchronization completed.");
				
				validateTerminal();
				
				
			}).fail( function ( e ){
				// failed to load cache
				console.error( e );
				
				ons.notification.alert({
				  message: 'Fail to start application! ' + e,
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Error',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
					  
					  onConfirmQuit("1");
				  }
				});
				
			});
			
			
		}).fail( function ( e ){
			// failed to synchronize db
			console.error( e );
			
			ons.notification.alert({
			  message: e,
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'Error',
			  buttonLabel: 'OK',
			  animation: 'default', // or 'none'
			  // modifier: 'optional-modifier'
			  callback: function() {
			    // Alert button is closed!
				  
				  setStatus("loading data from cache ...");
				  
				  APP.initCache().done( function ( msg ){
						
						console.log( msg );
						
						setStatus("Loading completed.");
						
						validateTerminal();
						
						
					}).fail( function ( e ){
						// failed to load cache
						console.error( e );
						
						ons.notification.alert({
						  message: 'Fail to start application! ' + e,
						  // or messageHTML: '<div>Message in HTML</div>',
						  title: 'Error',
						  buttonLabel: 'OK',
						  animation: 'default', // or 'none'
						  // modifier: 'optional-modifier'
						  callback: function() {
						    // Alert button is closed!
							  
							  onConfirmQuit("1");
						  }
						});
						
					});
			  }
			});
			
		});
		
	}).fail( function ( e ){
		// failed to initialize db
		console.error( e );
		
		ons.notification.alert({
		  message: 'Fail to start application! ' + e,
		  // or messageHTML: '<div>Message in HTML</div>',
		  title: 'Error',
		  buttonLabel: 'OK',
		  animation: 'default', // or 'none'
		  // modifier: 'optional-modifier'
		  callback: function() {
		    // Alert button is closed!
			  
			  onConfirmQuit("1");
		  }
		});
		
	});
	
});

// splashscreen
module.controller('SplashScreenController', function($scope) {
	
	// splash screen
	modal.show();
	
	// disable menu
   	menu.setSwipeable(false);
	
	// load application settings
   	APP.loadSettings();
	
	var server_endpoint_url = APP.SERVER_ENDPOINT_URL;
	// validate server endpoint url
	
	if( server_endpoint_url == null ){
		// go to settings
		menu.setMainPage('page/settings.html', {closeMenu: true});
		modal.hide();
		return;
	}
	
	var account_key = APP.ACCOUNT_KEY;
	// validate account key
	
	if( account_key == null || account_key == 0 ){
		// go to sign in
		menu.setMainPage('page/sign-in.html', {closeMenu: true});
		modal.hide();
		return;
	}
	else
	{
		menu.setMainPage('page/sync.html', {closeMenu: true});
		modal.hide();
		return;
	}	
	
});

// server endpoint
module.controller('ServerEndpointController', function($scope) {
	
	$scope.endpoint = APP.SERVER_ENDPOINT_URL;
	
	$scope.continue = function(){
		
		var endpoint = $scope.endpoint;
		
		// TODO validate endpoint
		
		modal.show();
		
		ServerEndPointService.test( endpoint ).done(function(){
			
			APP.setServerEndPointURL( endpoint );
			menu.setMainPage('page/sign-in.html', {closeMenu: true});
			
		}).fail(function(error, timeout){
			
			if(timeout && timeout == true){
				// connection timeout
				
				var activeElement = document.activeElement;
				activeElement.blur();
				
				ons.notification.alert({
		  			  message: error,
		  			  title: 'Error',
		  			  buttonLabel: 'OK',
		  			  animation: 'default', // or 'none'
		  			  // modifier: 'optional-modifier'
		  			  callback: function() {
		  			    // Alert button is closed!
		  			    // $('#email').focus();
		  				  
		  				activeElement.focus();
		  			  }
			  	});
			}
			else
			{
				var activeElement = document.activeElement;
				activeElement.blur();
				
				ons.notification.alert({
	  			  message: "Server endpoint entered is not a valid endpoint!",
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			    // $('#email').focus();
	  				  
	  				activeElement.focus();
	  			  }
		  		});
			}			
			
			
		}).always(function(){
			modal.hide();
		});
		
		
	};
	
});

// sign in
module.controller('SignInController', function($scope) {
		
	$scope.signIn = function(){
		
		var email = $scope.email;
		var password = $scope.password;
		
		modal.show();
		
		LoginService.login( email, password ).done(function(json){
			
			var account_key = json['account_key']; 
			
			APP.setAccountKey( account_key );
			
			menu.setMainPage('page/sync.html', {closeMenu: true});
			// menu.setMainPage('page/select-terminal.html', {closeMenu: true});
			
			modal.hide();
			
			// initDB();
			
		}).fail(function(error){
			
			modal.hide();
			
			var activeElement = document.activeElement;
			activeElement.blur();
			
			ons.notification.alert({
	  			  message: error,
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			    activeElement.focus();
	  			  }
	  			});			
			
		}).always(function(){
			
		});
	};
});

// terminal
module.controller('TerminalController', function($scope) {
	
	var storeList = APP.STORE.getAll();
	var terminalList = APP.TERMINAL.getAll();
	
	$scope.store_id = 0;
	$scope.terminal_id = 0;	
	
	$scope.storeList = storeList;
	$scope.terminalList = [];	
	
	// called when user selects a store
	$scope.renderTerminalSelect = function(){
		
		var store_id = $scope.store_id;
		
		// reset terminal list
		$scope.terminal_id = 0;
		
		var query = {'store_id' : {'==' : store_id}};
		
		$scope.terminalList = APP.TERMINAL.search( query );
	};
	
	
	if( APP.TERMINAL_KEY > 0 ){
		
		var terminal = APP.TERMINAL.getById( APP.TERMINAL_KEY );
		
		if( terminal != null ){
			
			$scope.store_id = terminal['store_id'];;
			$scope.terminal_id = terminal['terminal_id'];
			
			var query = {'store_id' : {'==' : $scope.store_id}};
			
			$scope.terminalList = APP.TERMINAL.search( query );
			
		}
	}
	
	// save terminal
	$scope.setTerminal = function(){
		
		var terminal_id = $scope.terminal_id;
		
		APP.setTerminalKey( terminal_id );
		
		// go to select user
		menu.setMainPage('page/select-user.html', {closeMenu: true});
		
		modal.hide();
	};
	
	// form validation
	$scope.validateForm = function(){
		return ( $scope.store_id > 0 &&  $scope.terminal_id > 0);
	};
	
	$scope.signOut = function(){
		
		ons.notification.confirm({
			  message: 'Do you want to sign out?',
			  title: 'Sign Out Confirmation',
			  buttonLabels: ['Yes', 'No'],
			  animation: 'default', // or 'none'
			  primaryButtonIndex: 1,
			  cancelable: false,
			  callback: function(index) {
			    // -1: Cancel
			    // 0-: Button index from the left
			    if(index == 0){
			    	
			    	APP.signOut();
			    	
			    	menu.setMainPage('page/sign-in.html', {closeMenu: true});
			    	
			    }
			  }
			});	
	};
	
	$scope.close = function(){
		closeApp();
	};
	
});

// user
module.controller('UserController', function($scope) {
	
	var terminal = APP.TERMINAL.getById(APP.TERMINAL_KEY);
	var store = APP.STORE.getById(terminal.store_id);
	
	$scope.store = store;
	$scope.terminal = terminal;
	
	$scope.changeTerminal = function(){
		menu.setMainPage('page/select-terminal.html', {closeMenu: true});
	};
	
	$scope.logIn = function(){
		
		var user_id = $scope.user_id;
		var pin = $scope.pin;
		
		var user = APP.USER.getById( user_id );
		
		if(user == null){
			
			var activeElement = document.activeElement;
			activeElement.blur();
			
			ons.notification.alert({
	  			  message: 'User not found!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			    $('#user_id').focus();
	  			  }
	  			});
			
			return;
		}
		else
		{
			if( user['pin'] != pin ){
				
				var activeElement = document.activeElement;
				activeElement.blur();
				
				ons.notification.alert({
		  			  message: 'Invalid PIN!',
		  			  // or messageHTML: '<div>Message in HTML</div>',
		  			  title: 'Error',
		  			  buttonLabel: 'OK',
		  			  animation: 'default', // or 'none'
		  			  // modifier: 'optional-modifier'
		  			  callback: function() {
		  			    // Alert button is closed!
		  				activeElement.focus();
		  			  }
		  			});
				
				return;
				
			}
			else
			{
				APP.setUserKey( user_id );
				
				initializeShoppingCart();
				initializeBuffer();
				initializeCayan();
				
				// check if till is open or close
				var tills = APP.TILL.search({'closingdate': null});
				
				if(tills.length == 0)
				{
					// go to open till
					menu.setMainPage('page/open-till.html', {closeMenu: true});
				}
				else
				{
					APP.TILL_KEY = tills[0].till_id;
					
					// go to order screen
					menu.setMainPage('page/order-screen.html', {closeMenu: true});
				}
				
				
				modal.hide();
			}
		}
			
		
	};
	
	var userList = APP.USER.getAll();
	$scope.userList = userList;
	
});

module.service('ShoppingCart', function() {
	
	return ShoppingCart;
	
});

module.service('Payments', function() {
	
	var payments = [];
	
	return payments;
});

module.service('OrderScreen', function() {
	
	var screen = this;
	
	screen.reset = function(){
		
		var screen = this;
		
		screen.shouldShowProductSelector = true;
		screen.shouldShowLineDetails = false;
		screen.shouldShowSearchCustomer = false;
		screen.shouldShowCustomerDetails = false;
		screen.shouldShowCreateCustomer = false;
		screen.shouldShowOrderActions = false;	
		screen.shouldShowCustomerForm = false;
		screen.shouldShowIframe = false;
	};
		
	screen.viewLineDetails = function( lineId ){
		
		var screen = this;
		
		screen.shouldShowProductSelector = false;
		screen.shouldShowLineDetails = true;
		screen.shouldShowSearchCustomer = false;
		screen.shouldShowCustomerDetails = false;
		screen.shouldShowCreateCustomer = false;
		screen.shouldShowOrderActions = false;
		screen.shouldShowCustomerForm = false;
		screen.shouldShowIframe = false;
		
		screen.lineId = lineId;
		
	};	
	
	/* customer related views */
	screen.searchCustomer = function(){
		
		var screen = this;
		
		screen.shouldShowProductSelector = false;
		screen.shouldShowLineDetails = false;
		screen.shouldShowSearchCustomer = true;
		screen.shouldShowCustomerDetails = false;
		screen.shouldShowCreateCustomer = false;
		screen.shouldShowOrderActions = false;
		screen.shouldShowCustomerForm = false;
		screen.shouldShowIframe = false;
		
	};
	
	screen.createCustomer = function(){
		
		var screen = this;
		
		screen.shouldShowProductSelector = false;
		screen.shouldShowLineDetails = false;
		screen.shouldShowSearchCustomer = false;
		screen.shouldShowCustomerDetails = false;
		screen.shouldShowCreateCustomer = false;
		screen.shouldShowOrderActions = false;		
		screen.shouldShowCustomerForm = true;
		screen.shouldShowIframe = false;
		
	};
	
	screen.viewCustomer = function(){
		
		/*
		 * var screen = this;
		 * 
		 * screen.shouldShowProductSelector = false;
		 * screen.shouldShowLineDetails = false; screen.shouldShowSearchCustomer =
		 * false; screen.shouldShowCustomerDetails = true;
		 * screen.shouldShowCreateCustomer = false;
		 * screen.shouldShowOrderActions = false; screen.shouldShowCustomerForm =
		 * false;
		 */
		
	};
	
	screen.showIframe = function(){
		
		var screen = this;
		
		screen.shouldShowProductSelector = false;
		screen.shouldShowLineDetails = false;
		screen.shouldShowSearchCustomer = false;
		screen.shouldShowCustomerDetails = false;
		screen.shouldShowCreateCustomer = false;
		screen.shouldShowOrderActions = false;
		screen.shouldShowCustomerForm = false;
		
		screen.shouldShowIframe = true;	
		
		
		// RA Cellular
		var raCellularSettings = localStorage.getItem("RA_CELLULAR_SETTINGS");
		
		if( raCellularSettings == null ){
			
			ons.notification.alert({
				
  				title : 'Error',
  				
  			    'message': 'Please configure RA Cellular settings',
  			    
  			    callback: function() {
  			    	// Do something here.
  			    }
  			});
			
			return;
		}
		
		
		var raCellularSettings = JSON.parse( raCellularSettings );
		
		var terminal = APP.TERMINAL.getById(APP.TERMINAL_KEY);
		var user = APP.USER.getById(APP.USER_KEY);
		
		raCellularSettings.operator = user['username'];
		raCellularSettings.isAdmin = "1";
		raCellularSettings.tillName = terminal['name'];
		
		document.getElementById("iframe-form").action = raCellularSettings['url'] + "/LoginServlet";
		document.getElementById("racellular-client-type").value = raCellularSettings['clientType'];
		document.getElementById("racellular-username").value = raCellularSettings['username'];
		document.getElementById("racellular-password").value = raCellularSettings['password'];
		document.getElementById("racellular-operator-name").value = raCellularSettings['operator'];
		document.getElementById("racellular-is-operator-admin").value = raCellularSettings['isAdmin'];
		document.getElementById("racellular-till-name").value = raCellularSettings['tillName'];
		document.getElementById("racellular-printer-width").value = raCellularSettings['printerWidth'];
		
		document.getElementById("iframe-form").submit();
	}
	
	screen.reset();
	
});

// sales
module.controller('OrderScreenController', function($scope, $timeout, $window, $http, $q, ShoppingCart, OrderScreen, Payments) {
	
	var terminal = APP.TERMINAL.getById(APP.TERMINAL_KEY);
	var store = APP.STORE.getById(terminal.store_id);
	
	$scope.terminalInfo = store.name + ", " + terminal.name;	
	
	// enable menu
   	menu.setSwipeable(true);
   	
   	// last sales info
   	OrderScreen.reset();
   	OrderScreen.lastSale = null;
	
	var productList = APP.PRODUCT.getAll();
	var categoryList = APP.PRODUCT_CATEGORY.getAll();
	var modifierList = APP.MODIFIER.getAll();
	
	$scope.productList = productList;
	$scope.categoryList = categoryList;
	$scope.modifierList = modifierList;
	
	$scope.currentcategory = {
		productcategory_id : -1
	};
	
	$scope.setCategory = function( category ){
		$scope.currentcategory = category;			
	};
	
	$scope.addLine = function( product_id, qty){
		
		/* START CAYAN GIFT CARD */
		var product = APP.PRODUCT.getById( product_id );
		var productcategory_id = product['productcategory_id'];
		
		var isGiftCard = ( APP.GIFT_PRODUCT_CATEGORY_ID == productcategory_id );
		
		if( isGiftCard == true ){
			
			var product_name = product['name'];
			
			if( 'Balance Inquiry' == product_name ){
				
				$scope.gift_card_balance_inquiry_dialog.show();
				
			}
			else if ( 'Activate' == product_name ){
				
				$scope.gift_card_activate_dialog.show();
				$scope.gift_card_activate_dialog.product = product;
				
			}
			else if ( 'Add Value' == product_name ){
				
				$scope.gift_card_add_value_dialog.show();
				$scope.gift_card_add_value_dialog.product = product;
				
			}
			
			return;
			
		}
		
		/* END CAYAN GIFT CARD */
		
		/* Start RACellular integration */
		
		if( APP.RA_CELLULAR_PRODUCT_ID == product_id ){
			
			var testMode = false;
			
			if(!testMode){
				
				OrderScreen.showIframe();
				
				// add message listner
				$window.onmessage = function(response){
					
					var data = response.data;
					data = JSON.parse( data );
					
					var MessageType = data['MessageType'];
					
					if( MessageType == 'Message' ){
						
						var PrintString = data['PrintString'];
						
						PrinterManager.print( [
							['BASE64',PrintString],
							['PAPER_CUT']
						] );
						
						return;
						
					}
															
					$scope.$apply(function(){
			    		
						$scope.addRACellularLine( data );
						
						console.log(data);
			    		
			    	});
					
				};
				
			}
			else {
				
				//voucher
				var voucher = {
						
				    "MessageType": "Voucher",
				    "PrintString": "G0AbIRAbRQEbYQFTSE9QIE5BTUUKG2EAPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KG0UAGyEARGF0ZSA6IDIwMTctMTEtMDMgMTU6MTQ6MDYKQ2FzaGllciA6IFNlbHdpbgpIT1NUIDogREVGQVVMVFRFUk1JTkFMChshEE1UTiBSMgobITAbITAgMTc2MCAwNjYzIDEwMzkKGyEwICAgICAgNDYzOQobRQAbIQAKUHJpY2UgOiAyLjAwClNlcmlhbCA6IFNBQ00wTVIyV040SgpUbyBSZWNoYXJnZSBEaWFsIDoKKjE0MSpQSU4jIEN1c3RvbWVyIENhcmUgOiAxNzMKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KNjAwOTYzNzE0ODEzCiBEU1RWICYgUFJFUEFJRCBFTEVDVFJJQ0lUWQogIE5PVyBBVkFJTEFCTEUgSU4gU1RPUkUhCiAgd3d3LmJ1eXByZXBhaWQuY28uemEK",
				    "Cost": 1.96,
				    "CostVat": 0.24070175438596486,
				    "HasVat": true,
				    "Value": 2.0,
				    "ValueVat": 0.24561403508771917,
				    "VariableRate": false,
				    "VoucherCode": "MTN000002",
				    "VoucherName": "MTN R2",
				    "Voidable": true,
				    "PinNumber" : '963417486692'
				};
				
				
				$scope.addRACellularLine( voucher );
				
								
				//electricity
				var electricity = {
						
						"MessageType":"Voucher",
						"PrintString":"e0MyfUNyZWRpdCBWZW5kCntDMH17QUx9e1VTfURpc3RyaWJ1dG9yICAgICAgICAgIFZBVCBOdW1iZXIKe1VSfUNpdHkgb2YgVHNod2FuZSAgICAgICAgIDQwMDAxNDIyNjcKCntVU31BZGRyZXNzCntVUn0KCkRhdGUgICAgICA6IDIwMTctMTAtMzEgMDk6MDk6MTgKUmVjcHQgTm8gIDogMTYyNTMvNDQ4NzgxNzYKQ2xpZW50IElEIDogMTAwMDAwMDAwMDAzMApUZXJtIElEICAgOiBEVjAwMDIKCntVU31NZXRlciBObyAgICAgIFRvayBUZWNoICAgICBBbGcKe1VSfTE0MjI1NTk4NjQ5ICAgICAgICAgICAgICAgICAgIAp7VVN9U0dDICAgICAgICAgICAgIEtSTiAgICAgICAgIFRJCntVUn0wMDAyMjUgICAgICAgICAgICAxICAgICAgICAgMDEKe0FMfQp7VVN9RGVzY2lwdGlvbgp7VVJ9e0MyfUVsZWN0cmljaXR5IENyZWRpdAp7QzB9UmNwdCAxNjI1My80NDg3ODE3Ngp7VVN9RW5lcmd5ICprV2ggICAgICAgICAgVG9rZW4gQW10CntVUn0yLjQwICAgICAgICAgICAgICAgICAgICAgIDUuMDAKe0MzfTA4MTAgIDI0NTQgIDY4NTcgCntDM30gIDI5MDggIDcyMDcgCgp7QzB9RG9tZXN0aWMgU2luZ2xlIFBoYXNlIEAxODIuOWMva1doCntBTH0KCiAgICAgd3d3LmJ1eXByZXBhaWQuY28uemEKe0MyfSAgICAgICAgVkFUIEluY2x1ZGVkIGF0IDE0JQp7QzB9e0FMfQ",
						"Cost":4.5,
						"CostVat":0.0,
						"HasVat":false,
						"Value":5.0,
						"ValueVat":0.0,
						"VariableRate":true,
						"VoucherCode":"ID_CASHPOWER_TSHWANE",
						"VoucherName":"ID_CASHPOWER_TSHWANE",
						"Voidable":false
					};
				
				$scope.addRACellularLine( electricity );
				
				
				//DSTV
				var dstv = {
						
						"MessageType":"Voucher",
						"PrintString":"e0MyfSAgICBEU1RWIFBBWU1FTlQKe0MwfQpEYXRlICAgIDogMjAxNy0xMC0zMSAwOToxMDozOApSY3B0IE5vIDogMTcxODE2ODIKVGVybSBJRCA6IERWMDAwMgoKTmFtZSA6IEogQUNIQURJTkhBCkNlbGwgOiA3MTYwNTM1MDUKUXVvdGUgQU1UICA6IDUzLjAwCgpQYXltZW50IFR5cGUgICA6IEJPWE9GRklDRQpDdXN0b21lck51bWJlciA6IDg1NTI4MzgyCkFjY291bnQgTnVtYmVyIDogNjk3ODY0NjYKQWNjb3VudCBTdGF0dXMgOiBPcGVuCgp7QzF9U2VydmljZSBGZWU6IDAuMDAKe0MxfVRvdGFsIFBhaWQgOiA1LjAwCgp7QzF9RFNUViBQQUlEICA6IDUuMDAKe0MwfQogICBWQVQgSW5jbHVkZWQgYXQgMTQlCgpGb3IgQXNzaXRhbmNlIHZpc2l0Cnd3dy5zZWxmc2VydmljZS5kc3R2LmNvbQpvciBjYWxsCkpvYnVyZyAgICA6IDAxMSAyODkgMjIyMgpQcmV0b3JpYSAgOiAwMTIgNDIyIDIyMjIKRHVyYmFuICAgIDogMDMxIDcxMCAyMjIyCkNhcGUgVG93biA6IDAyMSA1MDggMjIyMgpQRSAgICAgICAgOiAwNDEgMzk1IDIyMjIKQmxvZW0gICAgIDogMDUxIDUwMyAyMjIyCgpGb3IgQmFsYW5jZSByZXF1ZXN0ClNNUyAnYmFsJytTbWFydCBDYXJkIE51bWJlcgpvciBJRCBOdW1iZXIgdG8gMzE0MDE",
						"Cost":5.0,
						"CostVat":0.6140350877192979,
						"HasVat":true,
						"Value":5.0,
						"ValueVat":0.6140350877192979,
						"VariableRate":true,
						"VoucherCode":"DSTV_PAYMENT",
						"VoucherName":"DSTV_PAYMENT",
						"Voidable":false
					};
				
				$scope.addRACellularLine( dstv );
			}
			
			return;	
			
		}
		
		
		/* END RACellular integration */		
		
		// clear last sales info from cart footer
		OrderScreen.lastSale = null;
		
		var line = ShoppingCart.addLine(product_id, qty);
		$scope.currentLineIndex = line.index;	
		
	};
	
	$scope.addRACellularLine = function( data ){
		
		//add product to cart
		
		OrderScreen.lastSale = null;
		
		var line = ShoppingCart.addLine(APP.RA_CELLULAR_PRODUCT_ID, 1);
		//ShoppingCart.updatePrice(line.index, data.Value);
		ShoppingCart.updateProductInfo(line.index, data.VoucherName, data.VoucherName, data.VoucherCode);
		//ShoppingCart.vouchers.push(data.PrintString);
		
		line.taxAmt = parseFloat(new Number(data.ValueVat).toFixed(2));
		line.lineAmt = parseFloat(new Number(parseFloat(data.Value) - parseFloat(data.ValueVat)).toFixed(2));
		line.lineNetAmt = parseFloat(new Number(data.Value).toFixed(2));
		line.costAmt = parseFloat(new Number(parseFloat(data.Cost) - parseFloat(data.CostVat)).toFixed(2));
		line.voidable = data.Voidable;
		line.pinNumber = data.PinNumber || '';
		line.printString = data.PrintString;
		
		ShoppingCart.updateTotal();
		
		POLE_DISPLAY.display("1x " + data.VoucherName  , formatPoleDisplayLine("TOTAL",new Number(ShoppingCart.grandtotal).toFixed(2)));
		
		$scope.currentLineIndex = line.index;
		
	};
	
	$scope.addModifier = function( modifier_id ){	
		
		var index = $scope.currentLineIndex;
		
		var modifier = APP.MODIFIER.getById( modifier_id );
		
		if( index == null ) {
			return;
		}
		
		ShoppingCart.addModifier(index, modifier);
		
	};
	
	
	$scope.clearCart = function(){	
		
		if( ShoppingCart.getLines().length == 0 ) return;
		
		ons.notification.confirm({
		  message: 'Do you want to clear order?',
		  // or messageHTML: '<div>Message in HTML</div>',
		  title: 'Confirmation',
		  buttonLabels: ['Yes', 'No'],
		  animation: 'default', // or 'none'
		  primaryButtonIndex: 1,
		  cancelable: false,
		  callback: function(index) {
		    // -1: Cancel
		    // 0-: Button index from the left
		    if(index == 0){
		    	
		    	// validate lines
		    	var lines = ShoppingCart.getLines();
				
				if( lines.length == 0 ) return;
				
				var line = null;
				
				for(var i=0; i<lines.length; i++){
					
					line = lines[i];
					
					if( line.hasOwnProperty('voidable') && line.voidable == false ){
						
						ons.notification.alert({
							
			  				title : 'Error',
			  				
			  			    'message': 'Cannot clear cart. Line - ' + line.product['name'] + ' not voidable.',
			  			    
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
						
						return;				
					}
				}
				
				//remove voucher lines one by one
				var vouchers = [];
				
				for( var i=0; i<lines.length; i++ ){
					
					line = lines[i];
					
					if( line.hasOwnProperty('pinNumber')){
						
						vouchers.push({'index': line.index, 'pinNumber': line.pinNumber});						
					}
					
				}
				
				var promises = [];
				
				if( vouchers.length > 0 ){
					
					for( var i=0; i<vouchers.length; i++ ){
						
						line = vouchers[i];
						
						promises.push( $scope.voidRACellularLine( line ) );
						
					}
					
					$q.all( promises ).then( function( values ){
						
						if( values.length == promises.length ){
							
							$scope.reset();
							
							return;
						}
						
						
					}, function( values ){
						
						ons.notification.alert({
							
			  				title : 'Error',
			  				
			  			    'message': 'Failed to clear cart. Unable to remove all RACellular vouchers.',
			  			    
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
						
					} );
					
					return;
				}
		    	
				// reset cart
		    	$scope.$apply(function(){
		    		
		    		$scope.reset();
		    		
		    	});
		    	
		    }
		  }
		});		
		
	};//clearCart
	
	$scope.screen = OrderScreen;	
	
	
	$scope.currentLineIndex = null;
	
	/* use to highlight active line */
	$scope.isLineSelected = function( index ){
		
		if( $scope.currentLineIndex != null && $scope.currentLineIndex == index){
			return "selected";
		}
		
		return "";
	};
	
	/* use to highlight active line */
	$scope.isCategorySelected = function( productcategory_id ){
		
		if( $scope.currentcategory != null && $scope.currentcategory.productcategory_id == productcategory_id){
			return "selected";
		}
		
		return "";
	};
	
	$scope.viewLine = function(index){
		
		var line = ShoppingCart.getLine(index);
		
		if(line.product_id == APP.RA_CELLULAR_PRODUCT_ID){
			
			OrderScreen.shouldShowProductSelector = true;
			OrderScreen.shouldShowLineDetails = false;
			
			return;
		}
		
		var currentLine = angular.copy(line);
		currentLine.selectedModifiers = [];
		
		var modifiers = line.getModifiers();
		for(var i=0; i<modifiers.length; i++){
			currentLine.selectedModifiers.push( modifiers[i].product_id );
		}
		
		currentLine.isModifierPresent = function( modifier_id ){
			
			var index = this.selectedModifiers.indexOf( modifier_id );
			
			return (index >= 0);
		};
		
		$scope.currentLine = currentLine;
		
		$scope.currentLine.selection = "general";
		// hack for switch
		$scope.enableTax = currentLine.enableTax;
		
		$scope.currentLineIndex = index;
		
		// show page
		$scope.screen.viewLineDetails( index );
		$scope.screen.currentLine = currentLine;
	};
	
	$scope.removeLine = function(index){
		
		var line = ShoppingCart.getLine(index);
		
		if( APP.RA_CELLULAR_PRODUCT_ID == line.product_id && line.hasOwnProperty('voidable') ){
			
			if( line.voidable == false ){
				
				ons.notification.alert({
					
	  				title : 'Error',
	  				
	  			    'message': 'Current line is not voidable!',
	  			    
	  			    callback: function() {
	  			    	// Do something here.
	  			    }
	  			});
				
				OrderScreen.shouldShowProductSelector = true;
				OrderScreen.shouldShowLineDetails = false;
				
				return;
				
			}
			else
			{
				modal.show();
				
				$scope.voidRACellularLine( line ).then( function( index ){
					
					modal.hide();
					
					ShoppingCart.removeLine( index );
					
					// check view panel
					if(index == $scope.currentLineIndex){
						
						OrderScreen.shouldShowProductSelector = true;
						OrderScreen.shouldShowLineDetails = false;
						$scope.enableTax = true;
						
					}
					
				}, function( msg ){
					
					modal.hide();
					
					ons.notification.alert({
						
		  				title : 'Error',
		  				
		  			    'message': 'Failed to remove line. ' + msg,
		  			    
		  			    callback: function() {
		  			    	// Do something here.
		  			    }
		  			});
					
				});
				
				return;
				
				/*
				// call racellular service
				var url = "http://192.168.0.30:8080/DesertView/VoidServlet";				
				
				var data = '{"ClientType" : "POSTERITA","Username" : "Selwin","Password" : "123456","OperatorName" : "Fred","isOperatorAdmin" : true,"TillName" : "BackOffice","PinNumber" : "963417486692"}';			
				
				
				var req = {
						 'method' : 'POST',
						 'url' : url,
						 'headers' : {
						   'Content-Type' : 'application/json'
						 },
						 'data' : data
						}
				
				
				$http( req ).then( 
						
						function ( response ){
							
							modal.hide();
							
							var status = response.status;
							var statusText = response.statusText;
							
							if( status == 200 ){
								
								ShoppingCart.removeLine(index);
								
								// check view panel
								if(index == $scope.currentLineIndex){
									
									OrderScreen.shouldShowProductSelector = true;
									OrderScreen.shouldShowLineDetails = false;
									$scope.enableTax = true;
									
								}
								
							}
							
						}, 
						
						function ( response ){
							
							modal.hide();
							
							var status = response.status;
							var statusText = response.statusText;
							
							ons.notification.alert({
								
				  				title : 'Error',
				  				
				  			    'message': 'Failed to remove line. ' + statusText,
				  			    
				  			    callback: function() {
				  			    	// Do something here.
				  			    }
				  			});
							
						} 
						
				);
				
				return;
				*/
				
			}
			
			
		}
		
		ShoppingCart.removeLine(index);
		
		// check view panel
		if(index == $scope.currentLineIndex){
			
			OrderScreen.shouldShowProductSelector = true;
			OrderScreen.shouldShowLineDetails = false;
			$scope.enableTax = true;
			
		}
	};
	
	$scope.voidRACellularLine = function( line ){
		

		var deferred = $q.defer();
		
		/*
		if(line.index % 2 == 0){
			
			console.log("Voided => " + line.index);
			ShoppingCart.removeLine( line.index );
			deferred.resolve( line.index );				
		}
		else
		{
			deferred.reject( 'Failed to void => ' + line.index );
		}		
		
		return deferred.promise;
		*/
		
		// RA Cellular
		var raCellularSettings = localStorage.getItem("RA_CELLULAR_SETTINGS") || {};
		var raCellularSettings = JSON.parse( raCellularSettings );
		
		var terminal = APP.TERMINAL.getById(APP.TERMINAL_KEY);
		var user = APP.USER.getById(APP.USER_KEY);
		
		raCellularSettings.operator = user['username'];
		raCellularSettings.isAdmin = "1";
		raCellularSettings.tillName = terminal['name'];
		
		document.getElementById("iframe-form").action = raCellularSettings['url'] + "/LoginServlet";
		document.getElementById("racellular-client-type").value = raCellularSettings['clientType'];
		document.getElementById("racellular-username").value = raCellularSettings['username'];
		document.getElementById("racellular-password").value = raCellularSettings['password'];
		document.getElementById("racellular-operator-name").value = raCellularSettings['operator'];
		document.getElementById("racellular-is-operator-admin").value = raCellularSettings['isAdmin'];
		document.getElementById("racellular-till-name").value = raCellularSettings['tillName'];
		document.getElementById("racellular-printer-width").value = raCellularSettings['printerWidth'];
		
		
		// call racellular service
		var url = raCellularSettings['url'] + "/VoidServlet";				
		
		var data = {
				"ClientType" : raCellularSettings['clientType'],
				"Username" : raCellularSettings['username'],
				"Password" : raCellularSettings['password'],
				"OperatorName" : raCellularSettings['operator'],
				"isOperatorAdmin" : true,
				"TillName" : raCellularSettings['tillName'],
				"PinNumber" : "963417486692"};	
		
		data.PinNumber = line.pinNumber;
		
		data = JSON.stringify( data );
		
		var req = {
				 'method' : 'POST',
				 'url' : url,
				 'headers' : {
				   'Content-Type' : 'application/json'
				 },
				 'data' : data
				}
		
		
		$http( req ).then( 
				
				function ( response ){					
					
					var status = response.status;
					var statusText = response.statusText;
					
					if( status == 200 ){
						
						ShoppingCart.removeLine( line.index );
						deferred.resolve( line.index );						
					}
					else
					{
						deferred.reject( statusText );
					}
					
				}, 
				
				function ( response ){
					
					var status = response.status;
					var statusText = response.statusText;
					
					deferred.reject( statusText );
					
				} 
				
		);
		
		return deferred.promise;	
		
	};
	
	$scope.fastCheckout = function(){	
		
		modal.show();
		
		var payments = [{
			type : 'CASH',
			amount : ShoppingCart.grandtotal
		}];
		
		POLE_DISPLAY.display(formatPoleDisplayLine("TOTAL", ShoppingCart.grandtotal), "");
		
		APP.checkout( OrderScreen.customer, ShoppingCart, payments, OrderScreen.order_id, OrderScreen.uuid ).done(function( order ){
			
			var lastSale = {
					type : 'CASH',
					amount : ShoppingCart.grandtotal,
					change : ( ( ShoppingCart.grandtotal < 0 ) ? ( ShoppingCart.grandtotal * -1 ) : 0 )
			};
			
			/*
			CayanCED.endOrder( order.documentno ).always(function(){
				CayanCED.startOrder( APP.UTILS.ORDER.getDocumentNo() );
			});
			*/
			
			$scope.$apply(function(){
				$scope.reset();	
				OrderScreen.lastSale = lastSale;
			});
			
			/* START - CAYAN GIFT CARD */
			//$scope.processGiftCard( order );
			/* END - CAYAN GIFT CARD */
			
			
			
		}).fail(function(msg){
			
		}).always(function(msg){
			
			modal.hide();		
			
		});		
		
	};
	
	$scope.checkout = function(payments){
		
		modal.show();
		
		POLE_DISPLAY.display(formatPoleDisplayLine("TOTAL", ShoppingCart.grandtotal), "");
				
		APP.checkout( OrderScreen.customer, ShoppingCart, payments, OrderScreen.order_id, OrderScreen.uuid ).done(function( order ){
			
			var lastSale = payments[0];
			
			var changeText = null;
			
			if(lastSale.type == 'CASH'){
				/*
				CayanCED.endOrder( order.documentno ).always(function(){
					CayanCED.startOrder( APP.UTILS.ORDER.getDocumentNo() );
				});
				*/
				
				changeText = formatPoleDisplayLine("CHANGE", "" + lastSale["change"]);
							
			}
			
			var paidText = formatPoleDisplayLine("PAID", "" + lastSale["amount"]);
			POLE_DISPLAY.display( paidText , changeText );
			
			$scope.$apply(function(){
				$scope.reset();	
				OrderScreen.lastSale = lastSale;
			});	
			
			/* START - CAYAN GIFT CARD */
			//$scope.processGiftCard( order );
			/* END - CAYAN GIFT CARD */
			
			/*
			setTimeout(function(){
				CayanCED.startOrder( APP.UTILS.ORDER.getDocumentNo() );
				modal.hide();	
			}, 5000);
			*/
			
		}).fail(function(msg){
			
			console.error(msg);	
			
		}).always(function(msg){
			
			modal.hide();	
			
		});	
		
	};
	
	/* START - CAYAN GIFT CARD */
	$scope.processGiftCard = function( order ){
		
		var lines = order.lines;
		
		for( var i=0; i<lines.length; i++){
			
			var line = lines[i];
			
			if( !!line.gift ){
				
				var gift = line.gift;
				
				var action = gift.action;
				
				if( action == 'activate' ){
					
					CayanService.giftActivate( order.documentno , gift.cardnumber, gift.amount ).done(function( response ){
						
						modal.show();
						
						ons.notification.alert({
							
			  				title : 'Cayan - Gift Card',
			  				
			  			    'message': 'Gift card was successfully activated',
			  			    
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
						
					}).fail(function( error ){
						
						ons.notification.alert({
							
			  				title : 'Cayan - Gift Card Error',
			  				
			  			    'message': 'Failed to activate gift card! ' + error,
			  			    
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
						
					}).always(function(){
						
						modal.hide();
						
					}); 
					
				}
				else if( action == 'addvalue' ){
					
					CayanService.giftAddValue( order.documentno , gift.cardnumber, gift.amount ).done(function( response ){
						
						modal.show();
						
						ons.notification.alert({
							
			  				title : 'Cayan - Gift Card',
			  				
			  			    'message': 'Gift card balance was successfully updated',
			  			    
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
						
					}).fail(function( error ){
						
						ons.notification.alert({
							
			  				title : 'Cayan - Gift Card Error',
			  				
			  			    'message': 'Failed to update gift card balance! ' + error,
			  			    
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
						
					}).always(function(){
						
						modal.hide();
						
					}); 
					
				}
				
			}
			
		}
	};
	
	/* END - CAYAN GIFT CARD */
	
	$scope.showCheckoutDialog = function(){
		
		$scope.checkout_dialog.show({animation:'slide'});
	};
	
	$scope.showCashDialog = function(){
		
		$scope.checkout_dialog.hide({animation:'slide'});
		
		/* Check for refund */
		if( ShoppingCart.grandtotal < 0 ){
			
			$scope.fastCheckout();
			
			return;
		}
		
		$scope.cash_dialog.show({
			animation:'slide', 
			callback : function(){
				var input = document.getElementById('cash_dialog_amount');
				input.value = null;
				input.focus();
			} 
		});
	};
	
	$scope.showCayanDialog = function(){
		
		$scope.checkout_dialog.hide({animation:'slide'});
		
		/* Check for refund */
		if( ShoppingCart.grandtotal < 0 ){
			
			/* Look for original transaction */
			if( OrderScreen.ref_order_id != null ){
				
				var ref_order = APP.ORDER.getById( OrderScreen.ref_order_id );
				var ref_payment = ref_order.payments[0];
				
				if( ref_payment.Token && ref_payment.Token != null ){
					
					var amount = ShoppingCart.grandtotal * -1;
					var invoice = ref_order.uuid.substring(0,8);
					var token  = ref_payment.Token;
					
					if( amount > ref_payment.amount ){
						
						ons.notification.alert({
							
			  				title : 'Cayan Refund Error',
			  				
			  			    'message': 'Amount refunded cannot be greater than original amount!',
			  			    
			  			    callback: function() {
			  			    }
			  			});
						
											
					}
					else
					{
						modal.show();
						
						CayanService.refundTransaction( token, invoice, amount ).done(function( json ){
							
							json['EntryMode'] = CayanService.POSEntryTypes[ parseInt( json['EntryMode'] ) ];
							json['TransactionType'] = CayanService.TransactionTypes[ parseInt( json['TransactionType'] ) ];
							json['PaymentType'] = CayanService.CardTypes[ parseInt( json['CardType'] ) ]; 
							
							json['amount'] = parseFloat( json['Amount'] );										
							json['type'] = json['PaymentType'];
							
							// set merchant id
							json['MerchantId'] = CayanService.MERCHANT_KEY;
							
							// standardize fields
							json['AmountApproved'] = json['amount'];
							json['AccountNumber'] = ref_payment['AccountNumber'];
							
							$scope.checkout([json]);
														
							
						}).fail(function( error ){
							
							ons.notification.alert({
								
				  				title : 'Cayan Refund Error',
				  				
				  			    'message': error,
				  			    
				  			    callback: function() {
				  			    }
				  			});
							
						}).always(function(){
							
							modal.hide();
							
						});
					}
					
					return;	
					
				}
				else
				{
					ons.notification.alert({
						
		  				title : 'Cayan Refund Error',
		  				
		  			    'message': 'Cannot refund through CAYAN. Original transaction ID not found!',
		  			    
		  			    callback: function() {
		  			    }
		  			});
					
					return;
				}
			}			
			
		}
		
		if( CayanService.MODE == 'HOSTED')
		{
			// using transport web
			$scope.getCayanHostedPayment();
		}
		else
		{
			// using CED
			$scope.cayan_dialog.show({animation:'slide'});
			
			CayanService.isDeviceReady().done(function(status){
				
				$scope.getCayanCEDPayment();
				
			}).fail(function(error){
				
				ons.notification.alert({
					
	  				title : 'Cayan Error',
	  				
	  			    'message': error,
	  			    
	  			    callback: function() {
	  			    	// Do something here.
	  			    	$scope.cayan_dialog.hide({animation:'slide'});	
	  			    }
	  			});
				
			});
		}	
		
	};	
	
	$scope.setHostedPayment = function( json ){
		
		var status = json['Status'];
		
		if(status != 'APPROVED'){
			
			ons.notification.alert({
				
  				title : 'Cayan Error',
  				
  			    'message': status,
  			    
  			    callback: function() {
  			    	// Do something here.
  			    }
  			});
			
		}
		else
		{
			
			json['EntryMode'] = CayanService.POSEntryTypes[ parseInt( json['EntryMode'] ) ];
			json['TransactionType'] = CayanService.TransactionTypes[ parseInt( json['TransactionType'] ) ];
			json['PaymentType'] = CayanService.CardTypes[ parseInt( json['CardType'] ) ]; 
			
			
			json['amount'] = ShoppingCart.grandtotal;		
						
			json['type'] = json['PaymentType'];
			
			// set merchant id
			json['MerchantId'] = CayanService.MERCHANT_KEY;
			
			// standardize fields
			json['AmountApproved'] = json['amount'];
			json['AccountNumber'] = json['CardNumber'];
			json['AuthorizationCode'] = json['AuthCode'];
			
			$scope.checkout([json]);
		}
		
		
	};
	
	$scope.getCayanHostedPayment = function(){
		
		var amount = ShoppingCart.grandtotal;
		var tax = ShoppingCart.taxtotal;
	
		if( OrderScreen.uuid == null ){
			OrderScreen.uuid = APP.UTILS.UUID.getUUID();
		}
		
		var uuid = OrderScreen.uuid;
		var salesRep = APP.USER_KEY;
		
		var transactionType = "SALE";
		
		/*
		 * var ref_order_id = OrderScreen.ref_order_id; var ref_order =
		 * APP.ORDER.getById( ref_order_id );
		 * 
		 * var payment = ref_order.payments[0]; var token = payment.token; var
		 * invoiceNumber = ref_order.uuid.substring(0,8); var overrideAmount =
		 * amount;
		 * 
		 * CayanService.refundTransaction( token, invoiceNumber, overrideAmount
		 * ).done(function( json ){
		 * 
		 * var status = json['Status'];
		 * 
		 * if('APPROVED' == status){ dfd.resolve( json ); } else { dfd.reject(
		 * json ); }
		 * 
		 * }).fail(function(error){
		 * 
		 * dfd.reject( { 'ErrorMessage' : error } );
		 * 
		 * });
		 */
		
		modal.show();
		
		CayanService.stageTransaction(transactionType, uuid, uuid.substring(0,8), salesRep, amount, tax ).done(function(json){
            
            var TransportKey = json['TransportKey'];
            var ValidationKey = json['ValidationKey'];
            
            var url = "https://transport.merchantware.net/v4/transportmobile.aspx?transportKey=" + TransportKey; 
            
            if(isCordovaApp)
            {
            	modal.hide();
            	
            	var browser = window.open(url, '_blank', 'location=no');
                 
                var callbackUrl = CayanService.REDIRECT_LOCATION;
                 
                 browser.addEventListener('loadstart', function(event) {
                 	
                 	var url = event.url;            	
                 	
                 	var index = url.indexOf(callbackUrl);
                 	
                     if ( index >= 0 ) 
                     {     
                     	
                     	browser.close();
                     	
                     	var query = url.substring(url.indexOf('?') + 1);
                        var vars = query.split('&');
                         
                        var name, value;
                        var response = {};
                         
                        for (var i = 0; i < vars.length; i++) 
                        {                    	
                             var pair = vars[i].split('=');
                             
                             name = decodeURIComponent(pair[0]);
                             value = decodeURIComponent(pair[1]);
                             
                             if(name == 'Cardholder'){
                             	value = value.replace(/\+/g, ' ');
                             }
                             
                             response[ name ] = value;
                        }
                        
                        $scope.setHostedPayment( response );
                     	                	
                     }
                     
                   });            	
            }
            else
            {
            	var frame = document.getElementById('cayan-hosted-frame');
                frame.src = url;
                
                $(frame).on("load", function(){
                	modal.hide();
                });
                
                $scope.cayan_hosted_dialog.show({animation:'slide'});
                
                $(window).on('message', function( event ){
                	
                	$scope.cayan_hosted_dialog.hide({animation:'slide'});
                	var response = event.originalEvent.data;
                	console.log( response );
                	$scope.setHostedPayment( response );
                	
                });
            }
		
		}).fail(function(error){
        	
        	if(error == 'error'){
        		error = "Failed to stage transcation.";
        	}
        	
        	ons.notification.alert({
				
  				title : 'Cayan Error',
  				
  			    'message': error,
  			    
  			    callback: function() {
  			    	// Do something here.
  			    }
  			});
            
        });
		
	};
	
	$scope.getCayanCEDPayment = function(){
		
		var amount = ShoppingCart.grandtotal;
		var tax = ShoppingCart.taxtotal;
	
		if( OrderScreen.uuid == null ){
			OrderScreen.uuid = APP.UTILS.UUID.getUUID();
		}
		
		var uuid = OrderScreen.uuid;
		var salesRep = APP.USER_KEY;
		
		
		
		var transactionType = "SALE";
		
		if(amount < 0){
			
			transactionType = "_REFUND";
			
			amount = -amount;
			tax = -tax;
			
			if( !! OrderScreen.ref_uuid ){
				
				$scope.cayan_dialog.hide({animation:'slide'});	
				
				ons.notification.alert({
					
	  				title : 'Cayan Refund Error',
	  				
	  			    'message': 'Original Cayan transation ID not found!',
	  			    
	  			    callback: function() {
	  			    	// Do something here.
	  			    }
	  			});
				
				return;				
			}
			else
			{
				uuid = OrderScreen.ref_uuid;
			}
			
		}	
		
		var dfd = new jQuery.Deferred();

		/* Process sale transaction */
		CayanService.stageTransaction(transactionType, uuid, uuid.substring(0,8), salesRep, amount, tax ).done(function(json){
            
            var TransportKey = json['TransportKey'];
            var ValidationKey = json['ValidationKey'];
            
            CayanService.initiateTransaction( TransportKey, ValidationKey ).done(function(json){
                
            	var status = json['Status'];
            	json['TransactionType'] = transactionType;
            	
            	if('APPROVED' == status){
            		dfd.resolve( json );
            	}
            	else
            	{
            		dfd.reject( json );
            	}    
            	
            	console.log('CayanService.initiateTransaction response');
            	console.log(json);
                
            }).fail(function(error){
            	
            	if(error == 'error'){
            		error = "Failed to initiate transcation.";
            	}
                
            	dfd.reject( { 'ErrorMessage' : error } );
                
                });
        }).fail(function(error){
        	
        	if(error == 'error'){
        		error = "Failed to stage transcation.";
        	}
            
        	dfd.reject( { 'ErrorMessage' : error } );
            
        });			
		
		
		var p = dfd.promise();
		
		p.done(function(json){
			
			var AmountApproved = json['AmountApproved'];
			// parse value
			AmountApproved = parseFloat( AmountApproved );
			
			json['amount'] = AmountApproved;
			json['type'] = json['PaymentType'];	
			
			var errorMessage = json['ErrorMessage'];
			
			
			if( 'APPROVED_No_Signature' == errorMessage ){
				
				// need to void payment
				var token = json['Token'];
				
				CayanService.voidTransaction( token ).done(function( json ){
					
				}).fail(function(e){
					
					ons.notification.alert({
						
		  				title : 'Cayan Error',
		  				
		  			    'message': 'Failed to void cancelled payment! ' + e,
		  			    
		  			    callback: function() {
		  			    	// Do something here.
		  			    }
		  			});
					
				}).always(function(){
					
					$scope.cayan_dialog.hide({animation:'slide'});	
					
				});
				
			}
			else if( AmountApproved <  amount ){
				
				// need to void payment
				var token = json['Token'];
				
				CayanService.voidTransaction( token ).done(function( json ){
					
					$scope.cayan_dialog.hide({animation:'slide'});	
					
					ons.notification.alert({
						
		  				title : 'Cayan Error',
		  				
		  			    'message': 'The card has insufficient funds to cover the cost of the transaction.',
		  			    
		  			    callback: function() {
		  			    	// Do something here.
		  			    }
		  			});
					
				}).fail(function(e){
					
					ons.notification.alert({
						
		  				title : 'Cayan Error',
		  				
		  			    'message': 'Failed to void partial payment! ' + e,
		  			    
		  			    callback: function() {
		  			    	// Do something here.
		  			    }
		  			});
					
				}).always(function(){
					
					$scope.cayan_dialog.hide({animation:'slide'});	
					
				});
				
			}
			else
			{
				$scope.cayan_dialog.hide({animation:'slide'});	
				
				// set merchant id
				json['MerchantId'] = CayanService.MERCHANT_KEY;
				
				$scope.checkout([json]);
			}
			
			
			
		}).fail(function(json){
			
			$scope.cayan_dialog.hide({animation:'slide'});	
			
			var message = json['ErrorMessage'];
			if(message.length == 0){
				message = json['Status'];
			}
			
			// EMV declined payment receipt
			if( json.AdditionalParameters && json.AdditionalParameters.EMV ){
				
				// set merchant id
				json['MerchantId'] = CayanService.MERCHANT_KEY;
				json['amount'] = amount;
				
				APP.printDeclineEMV( json );
			}
			
			ons.notification.alert({
				
  				title : 'Cayan Error',
  				
  			    'message': message,
  			    
  			    callback: function() {
  			    	// Do something here.
  			    }
  			});
			
		}).always(function(){
			
			
			
		});
		
	};
	
	$scope.reset = function(){
		
		//CayanCED.startOrder( APP.UTILS.ORDER.getDocumentNo() );
		
		ShoppingCart.clear();	
		OrderScreen.reset();
		
		OrderScreen.order_id = null;
		OrderScreen.uuid = null;
		OrderScreen.customer = null;
		OrderScreen.ref_uuid = null;
		OrderScreen.ref_order_id = null;
		
		$scope.currentLineIndex = null;
		
	};	
	
	
	$scope.searchCustomer = function(){
		$scope.shouldShowProductSelector = false;
		$scope.shouldShowSearchCustomer = true;
	};
		
		
	$scope.cart = ShoppingCart;
	
	/*
	 * $scope.cart.onUpdate(function(){ });
	 */
	
	// order screen more popover
	$scope.showMorePopUp = function (){
		
		var targetElement = document.getElementById('order-screen-more-button');
		$scope.more_popover.show(targetElement);
		
	};
	
	$scope.showAddNoteDialog = function ( shouldHoldOrder ){
		
		$scope.shouldHoldOrder =  shouldHoldOrder;
		
		var textarea = document.getElementById('add-note-textarea');
		textarea.value = $scope.cart.note;
		
		$scope.add_note_dialog.show();
		
	};
	
	$scope.updateNote = function ( note ) {
		$scope.cart.note = note;		
	};
	
	
	$scope.holdOrder = function(){
		
		console.log('holdOrder');	
		
		modal.show();
		
		APP.holdOrder(OrderScreen.customer, ShoppingCart, OrderScreen.order_id, OrderScreen.uuid ).done(function(msg){
			
			$scope.$apply(function(){
				$scope.reset();
			});
			
		}).fail(function(msg){
			
		}).always(function(msg){
			
			modal.hide();		
			
		});		
	};
	
	$scope.showOrderHistory = function(){
		console.log('showOrderHistory');
	};
	
	ons.ready(function() {
		
		ons.createDialog('page/checkout-dialog.html', {parentScope: $scope}).then(function(dialog) {
		      $scope.checkout_dialog = dialog;
	    });
		
		ons.createDialog('page/cayan-hosted-dialog.html', {parentScope: $scope}).then(function(dialog) {
		      $scope.cayan_hosted_dialog = dialog;
	    });
		
		ons.createDialog('page/cash-dialog.html', {parentScope: $scope}).then(function(dialog) {
		      $scope.cash_dialog = dialog;
		      
		      $scope.cash_dialog_validate = function(){
		    	  
		    	  var textfield = document.getElementById('cash_dialog_amount');
		    	  
		    	  if(textfield.value == ''){
		    		  
		    		  /*
						 * ons.notification.alert({ title : 'Error', message:
						 * 'Invalid amount', callback: function() { // Do
						 * something here. textfield.focus(); } });
						 */
		    		  
		    		  $scope.cash_dialog_error = true;
			    	  $scope.cash_dialog_error_message = 'Invalid amount';
		    		  
		    		  return;
		    	  }
		    	  
		    	  var cart = $scope.cart;
		    	  
		    	  var amountEntered = parseFloat(textfield.value);
		    	  
		    	  if(cart.grandtotal > amountEntered){
		    		
		    		  $scope.cash_dialog_error = true;
			    	  $scope.cash_dialog_error_message = 'Amount tendered cannot be less that ' + new Number(cart.grandtotal).toFixed(2);
		    		  
		    		return;
		    		  
		    	  }
		    	  
		    	  $scope.cash_dialog.hide({animation:'slide'});		    	  
		    	  $scope.cash_dialog_amount = null;
		    	  $scope.cash_dialog_error = false;
		    	  $scope.cash_dialog_error_message = null;
		    	  
		    	  $scope.checkout([{
		    		  amount : cart.grandtotal,
		    		  type : 'CASH',
		    		  tendered : amountEntered,
		    		  change : parseFloat( new Number(amountEntered - cart.grandtotal).toFixed(2) )
		    	  }]);
		    	  
		      };
	    });
		
		ons.createDialog('page/cayan-dialog.html', {parentScope: $scope}).then(function(dialog) {
			
		      $scope.cayan_dialog = dialog;	
		      
		      $scope.cancelCayan = function(){
		    	  
		    	  CayanService.cancelTransaction().done(function(json){
		    		  
		    		  console.log('CayanService.cancelTransaction response');
	    			  console.log(json);
		    		  
		    		  var status = json['Status'];
		    		  
		    		  if( 'Cancelled' == status ){
		    			  
		    			  $scope.cayan_dialog.hide();
		    			  
		    			  return;
		    		  }
		    		  
		    		  if( 'Denied' == status || 'Error' == status ){
		    			  
		    			  var responseMessage = json['ResponseMessage'];
		    			  
		    			  ons.notification.alert({
		    				  'title' : 'Error',
				  			  'message': responseMessage,
				  			  callback: function() {
				  			    // Do something here.
				  			  }
		    			  });
		    			  
		    			  return;
		    		  }	
		    		  
		    		  if( 'TransactionApproved_NoSignatureCollected' == status ){
		    			  
		    			  $scope.cayan_dialog.hide();
		    			  
		    			  ons.notification.alert({
		    				  'title' : 'Error',
				  			  'message': 'Current transaction was cancelled!',
				  			  callback: function() {
				  			    // Do something here.
				  			  }
		    			  });
		    			  
		    			  return;
		    		  }
		    		 
		    		  
		    		  if( 'APPROVED' == status){		    			  
		    			  
		    			  var token = json['Token'];
		    			  
		    			  CayanService.voidTransaction( token ).done(function(json){
		    					
		    					var status = json['ApprovalStatus'];
		    					
		    					if(status == 'APPROVED'){
		    						
		    						$scope.cayan_dialog.hide();
		    					}
		    					else
		    					{
		    						$scope.cayan_dialog.hide();
		    						
		    						ons.notification.alert({
		    			  				'title' : 'Error',
		    			  			    'message': 'Void Cayan Payment Error - ' + status,
		    			  			    callback: function() {
		    			  			    	// Do something here.
		    			  			    }
		    			  			});
		    					}
		    					
		    				}).fail(function(err){
		    					
		    					$scope.cayan_dialog.hide();
		    					
		    					ons.notification.alert({
	    			  				'title' : 'Error',
	    			  			    'message': 'Void Cayan Payment Error - ' + err,
	    			  			    callback: function() {
	    			  			    	// Do something here.
	    			  			    }
	    			  			});
		    					
		    				});
		    			  
		    		  }		
		    		  
		    	  }).fail(function(error){
		    		  
		    		  	ons.notification.alert({
			  				'title' : 'Error',
			  			    'message': error,
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
		    		  
		    	  });		    	  
		    	  
		      };
		      
	    });
		
	    ons.createPopover('page/order-screen-popover.html', {parentScope: $scope}).then(function(popover) {
	      $scope.more_popover = popover;	      
	      
	      $scope.cancelMore = function(){
	    	  $scope.more_popover.hide();
	      };
	    });
	    
	    
	    ons.createDialog('page/add-note-dialog.html', {parentScope: $scope}).then(function(dialog) {
		      $scope.add_note_dialog = dialog;
		      
		      $scope.saveNote = function(){
		    	  var note = document.getElementById('add-note-textarea').value;
		    	  
		    	  $scope.updateNote( note );
		    	  
		    	  $scope.add_note_dialog.hide();
		      };
		      
		      $scope.saveNoteAndHoldOrder = function(){
		    	  var note = document.getElementById('add-note-textarea').value;
		    	  
		    	  $scope.saveNote( note );
		    	  
		    	  $scope.holdOrder();
		    	  
		    	  $scope.add_note_dialog.hide();
		      };
		      
		      $scope.cancelNote = function(){	
		    	  $scope.note = null;
		    	  $scope.add_note_dialog.hide();
		      };
		});
	    
	    
	    /* START - CAYAN GIFT CARD */
	    
	    ons.createDialog('page/gift-card/activate-dialog.html', {parentScope: $scope}).then(function(dialog) {
	    	
		      $scope.gift_card_activate_dialog = dialog;
		      
		      dialog.on('posthide', function(event){
		    	  
		    	  document.getElementById('gift_card_activate_number').value = '';
		    	  document.getElementById('gift_card_activate_value').value = '';
		      });
		      
		      $scope.activateGiftCard = function( cardnumber , amount ){
		    	  
		    	  var ordernumber = APP.UTILS.ORDER.getDocumentNo();
		    	  
		    	  modal.show();
		    	  
		    	  CayanService.giftBalanceInquiry( ordernumber, cardnumber ).done(function( response ){
		    		  
		    		  if( response['ApprovalStatus'] == 'APPROVED'){
		    			  
		    			  ons.notification.alert({
				  				'title' : 'Gift Card - Error',
				  			    'message': 'INVALID CARD NUMBER! Card already activated.',
				  			    callback: function() {
				  			    	// Do something here.
				  			    }
				  			});
		    			  
		    		  }
		    		  else if( response['ApprovalStatus'] == 'DECLINED' && response['ResponseMessage'] == 'CARD NOT ISSUED' )
		    		  {
		    			  var product = $scope.gift_card_activate_dialog.product;		    			  
		    			  
		    			  $scope.$apply(function(){
		    				  
		    				  var product_id = product['product_id']; 
			    			  
			    			  var line = ShoppingCart.addLine( product_id, 1 );
			    			  var index = line.index;
			    			  
			    			  line.gift = {
			    					  action : 'activate',
			    					  cardnumber : document.getElementById('gift_card_activate_number').value,
			    					  amount : document.getElementById('gift_card_activate_value').value
			    			  };
			    			  
			    			  ShoppingCart.updatePrice( index, amount );
			    			  
			    			  $scope.currentLineIndex = index;
			    			  OrderScreen.lastSale = null;
		    				  
		    			  });
		    		  }
		    		  else
		    		  {
		    			  var error = response['ResponseMessage'];
		    			  
		    			  ons.notification.alert({
				  				'title' : 'Gift Card - Error',
				  			    'message': error,
				  			    callback: function() {
				  			    	// Do something here.
				  			    }
				  			});
		    		  }
		    		  
		    	  }).fail(function( error ){
		    		  
		    		  ons.notification.alert({
			  				'title' : 'Gift Card - Error',
			  			    'message': error,
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
		    		  
		    	  }).always(function(){
		    		  
		    		  $scope.gift_card_activate_dialog.hide();
		    		  modal.hide();
		    		  
		    	  });	    	  
		    	  
		      };
	    });
	    
	    ons.createDialog('page/gift-card/add-value-dialog.html', {parentScope: $scope}).then(function(dialog) {
	    	
		      $scope.gift_card_add_value_dialog = dialog;
		      
		      dialog.on('posthide', function(event){
		    	  
		    	  document.getElementById('gift_card_add_value_number').value = '';
		    	  document.getElementById('gift_card_add_value_value').value = '';
		      });
		      
		      $scope.addValueGiftCard = function( cardnumber, amount ){
		    	  
		    	  var ordernumber = APP.UTILS.ORDER.getDocumentNo();
		    	  
		    	  modal.show();
		    	  
		    	  CayanService.giftBalanceInquiry( ordernumber, cardnumber ).done(function( response ){
		    		  		    		  
		    		  if( response['ApprovalStatus'] == 'APPROVED'){
		    			  
		    			  var product = $scope.gift_card_add_value_dialog.product;		    			  
		    			  
		    			  $scope.$apply(function(){
		    				  
		    				  var product_id = product['product_id']; 
			    			  
			    			  var line = ShoppingCart.addLine( product_id, 1 );
			    			  var index = line.index;
			    			  
			    			  line.gift = {
			    					  action : 'addvalue',
			    					  cardnumber : document.getElementById('gift_card_add_value_number').value,
			    					  amount : document.getElementById('gift_card_add_value_value').value
			    			  };
			    			  
			    			  ShoppingCart.updatePrice( index, amount );
			    			  
			    			  $scope.currentLineIndex = index;
			    			  OrderScreen.lastSale = null;
		    				  
		    			  });
		    			  
		    		  }
		    		  else
		    		  {
		    			  var error = response['ResponseMessage'];
		    			  
		    			  ons.notification.alert({
				  				'title' : 'Gift Card - Error',
				  			    'message': error,
				  			    callback: function() {
				  			    	// Do something here.
				  			    }
				  			});
		    		  }
		    		  
		    	  }).fail(function( error ){
		    		  
		    		  ons.notification.alert({
			  				'title' : 'Gift Card - Error',
			  			    'message': error,
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
		    		  
		    	  }).always(function(){
		    		  
		    		  $scope.gift_card_add_value_dialog.hide();
		    		  modal.hide();
		    		  
		    	  });
		    	  
		      };		      
		      
	    });
	    
	    ons.createDialog('page/gift-card/balance-inquiry-dialog.html', {parentScope: $scope}).then(function(dialog) {
	    	
		      $scope.gift_card_balance_inquiry_dialog = dialog;
		      
		      dialog.on('posthide', function(event){
		    	  document.getElementById('gift_card_balance_inquiry_number').value = '';
		      });
		      
		      $scope.balanceInquiryGiftCard = function( cardnumber ){
		    	  
		    	  modal.show();
		    	  
		    	  $scope.gift_card_balance_inquiry_dialog.hide();
		    	  
		    	  var ordernumber = APP.UTILS.ORDER.getDocumentNo();
		    	  
		    	  CayanService.giftBalanceInquiry( ordernumber, cardnumber ).done(function( response ){
		    		  
		    		  if( response.ApprovalStatus == 'APPROVED' ){
		    			  
		    			  $scope.$apply(function(){
		    				  
		    				  $scope.gift_card_info = response;			    		  
				    		  $scope.gift_card_balance_dialog.show();
				    		  
		    			  });
		    			  
		    		  }
		    		  else
		    		  {
		    			  var error = response.ResponseMessage;
		    			  
		    			  ons.notification.alert({
				  				'title' : 'Gift Card - Error',
				  			    'message': error,
				  			    callback: function() {
				  			    	// Do something here.
				  			    }
				  			});
		    		  }
		    		  
		    		 
		    		  
		    	  }).fail(function( error ){
		    		  
		    		  ons.notification.alert({
			  				'title' : 'Gift Card - Error',
			  			    'message': error,
			  			    callback: function() {
			  			    	// Do something here.
			  			    }
			  			});
		    		  
		    	  }).always(function(){
		    		  
		    		  $scope.gift_card_balance_inquiry_dialog.hide();
		    		  jQuery('#gift_card_balance_inquiry_number').val('');
		    		  
		    		  modal.hide();
		    		  
		    	  });	    	  
		    	  
		      };
	    });
	    
	    ons.createDialog('page/gift-card/balance-dialog.html', {parentScope: $scope}).then(function(dialog) {
	    	
		      $scope.gift_card_balance_dialog = dialog;
	    });
	    
	    /* END - CAYAN GIFT CARD */
	    
	});
	
	
	// event - from CreateCustomerController
	$scope.$on("CUSTOMER_UPDATED", function(event, customer){
		
		$scope.$broadcast("UPDATE_CUSTOMER_LIST", {});
		
	});	
	
	
	$scope.$on("SCAN_BARCODE", function(event, barcode){
		
		var results = APP.PRODUCT.search({ 'upc' : barcode });
		
		if( results.length > 0 ){
			var product = results[0];
			var product_id = product['product_id'];
			
			$scope.$apply(function(){
				
				$scope.addLine( product_id , 1);
				
			});			
			
		}
		else
		{
			ons.notification.alert({
				  message: 'Barcode: ' + barcode + ' not found!',
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Information',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				  }
				});
		}		
		
	});
	
});

// shopping cart
module.controller('ShoppingCartController', function($scope) {});

// search customer
module.controller('SearchCustomerController', function($scope, OrderScreen) {
	
	// event - from OrderScreenController
	$scope.$on('UPDATE_CUSTOMER_LIST', function(event, data){
		
		console.log("refreshing customer list ..");
		
		$scope.getCustomerList();
		
	});
	
	$scope.getCustomerList = function(){
		var customerList = APP.CUSTOMER.getAll();
		this.customerList = customerList;
	};
	
	$scope.getCustomerList();
	
	$scope.setCustomer = function(customer){
		var customer_id = customer.customer_id;
		
		OrderScreen.customer = APP.CUSTOMER.getById( customer_id );
		
		back();
	};
	
	var back = function(){
		
		OrderScreen.shouldShowProductSelector = true;
		OrderScreen.shouldShowSearchCustomer = false;
		
		$scope.searchText = ''; /* clear search box */
		
	};
	
	var clear = function(){
		
		OrderScreen.customer = null;
		
		back();
		
	};
	
	$scope.back = back;
	$scope.clear = clear;
	
});

// create or edit customer
module.controller('CustomerFormController', function($scope, OrderScreen, APP) {
	
	$scope.back = function(){
		
		$scope.reset();
		OrderScreen.reset();		
	};
	
	$scope.reset = function(){	
		
		$scope.name = null;
		$scope.email = null;
		$scope.phone = null;
		
		$scope.ccform.$pristine = true;
		$scope.ccform.$dirty = false;
		
	};
	
	$scope.save = function(){
		
		if($scope.ccform.name.$error.required){
			
			ons.notification.alert({
				title : 'Error',
			    message: 'Name is required!',
			    callback: function() {
			    	// Do something here.
			    }
			});
			
			return;
		}
		
		if($scope.ccform.email.$error.email){
			
			ons.notification.alert({
				title : 'Error',
			    message: 'Please enter a valid e-mail.',
			    callback: function() {
			    	// Do something here.
			    }
			});
			
			return;
		}
		
		var customer = {
				name : $scope.name,
				email : $scope.email,
				phone : $scope.phone,
				customer_id : 0
		};
		
		APP.CUSTOMER.saveCustomer( customer ).done(function( msg ){
			
			console.log( msg );
			
			$scope.$apply(function(){
				OrderScreen.customer = customer;			
				$scope.$emit("CUSTOMER_UPDATED", customer);			
				$scope.back();
			});
			
			
		}).fail(function(e){
						
			ons.notification.alert({
				  message: e,
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Error',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				  }
				});
			
		});		
		
	};
	
});

// customer details
module.controller('CustomerDetailsController', function($scope, OrderScreen) {
	
});


module.controller('LineDetailsController', function($scope, ShoppingCart, OrderScreen) {	
	
	$scope.applyChanges = function( index, price, qty, enableTax, note){
		
		var modifierChks = jQuery(".modifier-checkbox");
		var modifiers = [];
		var chk;
		var modifier_id;
		var modifier;
		
		for(var i=0; i<modifierChks.length; i++){
			
			chk = modifierChks[i];
			chk = jQuery(chk);
			
			if(chk.is(':checked')){
				
				modifier_id = chk.val();
				
				modifier = APP.MODIFIER.getById( modifier_id );
				
				modifiers.push( modifier );
			}
		}
		
		ShoppingCart.updateLine( index, price, qty , note, modifiers, enableTax);
		
		$scope.back();
	};
	
	$scope.back = function(){
		OrderScreen.shouldShowProductSelector = true;
		OrderScreen.shouldShowLineDetails = false;
		$scope.enableTax = true;
	};
	
	$scope.remove = function( index ){
		
		ShoppingCart.removeLine( index );
		
		$scope.back();
	};
	
	$scope.adjustPrice = function( price ){		
		
		$scope.adjust_price_dialog.hide();
		
		var unitPrice = price / $scope.currentLine.qty;
		
		$scope.currentLine.price = new Number( unitPrice ).toFixed(2);
		
	};
	
	$scope.showAdjustPriceDialog = function( lineTotal ){
		
		$scope.adjust_price_dialog.show({
			
			animation:'slide', 
			callback : function(){
				var input = document.getElementById('adjust_price_dialog_amount');
				input.value = parseFloat(new Number( lineTotal ).toFixed(2));
				input.focus();
			} 
		});
	};
	
	$scope.enableTax = true;
	
	ons.ready(function() {
		
		ons.createDialog('page/adjust-price-dialog.html', {parentScope: $scope}).then(function(dialog) {
			
	      	$scope.adjust_price_dialog = dialog;
	      
	    });
		
	});
	
});


// till
module.controller('TillController', function($scope, APP) {
	
	var terminal = APP.TERMINAL.getById(APP.TERMINAL_KEY);
	var store = APP.STORE.getById(terminal.store_id);
	
	$scope.terminalInfo = store.name + ", " + terminal.name;
	
	//initializeGooglePlaceSearch( $scope );
	
	var till_id = APP.TILL_KEY;
	var till = APP.TILL.getById( till_id );
	
	$scope.till = till;
	
	if(till != null){
		var openby_id  = till['openby'];
		var openby = APP.USER.getById( openby_id );

		$scope.openby = openby;
		$scope.today = new Date();
	}
	else
	{
		// update location
		var terminal_id = APP.TERMINAL_KEY;
		var terminal = APP.TERMINAL.getById(terminal_id);
		
		var store_id = terminal['store_id'];		
		var store = APP.STORE.getById( store_id );
		
		$scope.location = store['address'];
	}
	
	$scope.adjustTill = function (paytype, amount, reason) {
		
		if(reason == null){
			ons.notification.alert({
				  message: 'Please enter a reason',
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Error',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				   	
				  }
				});
			
			return;
		}
		
		var till_id = APP.TILL_KEY;
		
		var till = APP.TILL.getById( till_id );
		
		if( till == null ){
			
			ons.notification.alert({
	  			  message: 'Failed to adjust till! Could not load till.',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			   	
	  			  }
	  			});
			
			return;			
		}
		
		var adjustments = till.adjustments || [];
				
		var adjustment = {
				'datepaid' : new Date().getTime(),
				'user_id' : APP.USER_KEY,
				'paytype' : paytype,
				'reason' : reason,
				'amount' : amount
		};
		
		adjustments.push( adjustment );
		
		till.adjustments = adjustments;
		
		APP.TILL.saveTill( till ).done(function(record, msg){
			console.log( msg );
			
			// todo push sales
			// synchronize();
			
			ons.notification.alert({
	  			  message: 'Till successfully adjusted!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Information',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  				menu.setMainPage('page/till.html', {closeMenu: true});
	  			  }
	  		});// alert
			
		})
		.fail(function(error){
			console.error('Failed to adjust till. ' + error);
			
			ons.notification.alert({
	  			  message: 'Failed to adjust til!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			   
	  			  }
	  			});
		});
		
	};
		
	$scope.openTill = function (openingamt) {
		
		var terminal_id = APP.TERMINAL_KEY;
		var terminal = APP.TERMINAL.getById(terminal_id);
		var terminal_name = terminal['name'];
		
		var store_id = 0;
		var store_name = null;
		
		store_id = terminal['store_id'];
		var store = APP.STORE.getById(store_id);
		store_name = store['name'];
		
		var account_id = 0;
		account_id = terminal['account_id']; 
		
		var openby_id = APP.USER_KEY;
		var openby_user = APP.USER.getById( openby_id );
		var openby_name = openby_user['username'];
		
		var date = moment();	
		var openingdate = date.valueOf();
		var openingdatetext = date.format('DD-MM-YYYY HH:mm:ss');
		var openingdatefull = date.format('MMM Do YYYY, HH:mm');
		
		var till = {
				'account_id' : account_id,
				'store_id' : store_id,
				'store_name' : store_name,
				'terminal_id' : terminal_id,
				'terminal_name' : terminal_name,
				'uuid' : APP.UTILS.UUID.getUUID(),
				'openingdate' : openingdate,
				'openingdatetext' : openingdatetext,
				'openingdatefull' : openingdatefull,
				'openby' : openby_id,
				'openby_name' : openby_name,
				'closingdate' : null,
				'closeby' : null,
				'openingamt' : openingamt,
				'closingamt' : 0,
				/*
				'shift': $scope.shift,
				'isspecialevent': $scope.isSpecialEvent == undefined ? false : $scope.isSpecialEvent,
				'eventname': $scope.eventName == undefined ? null : $scope.eventName,
				'location': $scope.location == undefined ? null : $scope.location,
				'weather': $scope.weather == undefined ? null : $scope.weather,
				'temperature': $scope.temperature == undefined ? null : $scope.temperature,
				'message': $scope.message == undefined ? null : $scope.message,
				*/
				'issync' : 'N',
				'adjustments' : []
		};
		
		var message = till['message'];
		if(message != null && message.length > 0){
			
			// post message to social media
			if( BufferService.isConfigured == true ){
				
				BufferService.updateStatus(BufferService.profile_ids, message, true).done( function ( response ){
					
					console.log( response );
					
				}).fail( function ( error ){
					
					console.log( error );
					
				});
				
			}			
		}
		
		APP.TILL.saveTill( till ).done(function(record, msg){
			console.log( msg );
			
			var till_id = record.till_id;
			APP.TILL_KEY = till_id;
			
			menu.setSwipeable(true);
			menu.setMainPage('page/order-screen.html', {closeMenu: true});
			
		})
		.fail(function(error){
			console.error('Failed to open till. ' + error);
			
			ons.notification.alert({
	  			  message: 'Failed to open til!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			   
	  			  }
	  			});
		});
		
	};
	
	$scope.showCloseTillError = false;
	$scope.closeTillErrorMessage = "";
	
	$scope.closeTill = function (closingamt) {
		
		var till_id = APP.TILL_KEY;
		
		var till = APP.TILL.getById( till_id );
		
		if( till == null ){
			
			ons.notification.alert({
	  			  message: 'Failed to close till! Could not load till.',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			   	
	  			  }
	  			});
			
			return;			
		}
		
		// close till
		
		// get orders
		var orders = APP.ORDER.search({
			'till_id' : till_id, 
			'status' : 'CO'
		});
		
		var cashtotal = 0;
		
		var subtotal = 0;
		var taxtotal = 0;
		var discounttotal = 0;
		var grandtotal = 0;
		var nooforders = orders.length;
		
		//RA Cellular vouchers
		var vouchers = {};
		var i, j, orderlines, orderline;
		
		for( i=0; i<orders.length; i++ )
		{
			if( 'CASH' == orders[i].paymenttype ){
				
				cashtotal = cashtotal + orders[i].grandtotal;
			}
			
			subtotal = subtotal + orders[i].subtotal;
			taxtotal = taxtotal + orders[i].taxtotal;
			discounttotal = discounttotal + orders[i].discountamt;
			grandtotal = grandtotal + orders[i].grandtotal;
			
			orderlines = orders[i].lines;
			
			for( j=0; j<orderlines.length; j++ )
			{
				orderline = orderlines[j];
				
				if(orderline.product_id == APP.RA_CELLULAR_PRODUCT_ID){
					
					if(vouchers['' + orderline.name]){
						
						vouchers['' + orderline.name].total += orderline.linenetamt; 
						vouchers['' + orderline.name].qty += orderline.qtyentered; 
						
					}
					else
					{
						vouchers['' + orderline.name] = {
								'name' : orderline.name,
								'qty' : 1,
								'total' : orderline.linenetamt
						};
					}
					
				}
			}
		}
		
		till.vouchers = vouchers;
		
		// get adjustments
		var adjustmenttotal = 0;
		
		var adjustments = till.adjustments || [];
		var adjustment;
		
		for(var i=0; i<adjustments.length; i++)
		{
			adjustment = adjustments[i];
			
			if(adjustment.paytype == 'payin')
			{
				adjustmenttotal = adjustmenttotal + adjustment.amount;
			}
			else
			{
				adjustmenttotal = adjustmenttotal - adjustment.amount;
			}
		}
		
		var expectedamt = till.openingamt + cashtotal + adjustmenttotal;
		expectedamt = new Number(expectedamt).toFixed(2);
		expectedamt = parseFloat(expectedamt);		
		
		/*
		 * if( expectedamt != closingamt ) { $scope.showCloseTillError = true;
		 * $scope.expectedAmt = expectedamt;
		 * 
		 * return; }
		 */
		
		var date = moment();	
		var closingdate = date.valueOf();
		var closingdatetext = date.format('DD-MM-YYYY HH:mm:ss');
		var closingdatefull = date.format('MMM Do YYYY, HH:mm');
		
		var closeby_id = APP.USER_KEY;
		var closeby_user = APP.USER.getById( closeby_id );
		var closeby_name = closeby_user[ 'username' ];
		
		till.closeby = closeby_id;
		till.closeby_name = closeby_name;
		till.closingdate = closingdate;
		till.closingdatetext = closingdatetext;
		till.closingdatefull = closingdatefull;
		
		till.closingamt = closingamt;
		
		// other amounts
		till.cashamt = cashtotal;		
		till.adjustmenttotal = adjustmenttotal;
		
		till.subtotal = subtotal;
		till.taxtotal = taxtotal;
		till.discounttotal = discounttotal;
		till.grandtotal = grandtotal;
		
		till.nooforders = nooforders;
		
		//RA Cellular vouchers
		till.vouchers = vouchers;
		
		APP.TILL.saveTill( till ).done(function(record, msg){
			console.log( msg );
			
			// todo push sales
			// synchronize();
			
			if(APP.PRINTER_SETTINGS.isPrinterEnabled()){
				// print receipt
				
				APP.printTill( record ).done(function(msg){
					
					
					
				}).fail(function(error){			
					APP.showError(error, 'Printer Error');
					/* dfd.reject(error); */
					
				});
			}
			
			ons.notification.alert({
	  			  message: 'Till successfully closed!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Information',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  				
	  				modal.show();
	  				
	  				APP.pushData().done(function(){
	  					
	  					ons.notification.alert({
	  					  message: 'Synchronization completed!',
	  					  // or messageHTML: '<div>Message in HTML</div>',
	  					  title: 'Information',
	  					  buttonLabel: 'OK',
	  					  animation: 'default', // or 'none'
	  					  // modifier: 'optional-modifier'
	  					  callback: function() {
	  					    // Alert button is closed!
	  						menu.setSwipeable(false);
			  				menu.setMainPage('page/open-till.html', {closeMenu: true});
	  					  }
	  					});
	  					
	  				}).fail(function(){
	  					
	  					ons.notification.alert({
		  					  message: 'Failed to synchronize till and orders!',
		  					  // or messageHTML: '<div>Message in HTML</div>',
		  					  title: 'Error',
		  					  buttonLabel: 'OK',
		  					  animation: 'default', // or 'none'
		  					  // modifier: 'optional-modifier'
		  					  callback: function() {
		  					    // Alert button is closed!
		  						menu.setSwipeable(false);
				  				menu.setMainPage('page/open-till.html', {closeMenu: true});
		  					  }
		  					});
	  					
	  				}).always(function(){
	  					modal.hide();
	  				});
	  				
	  			  }
	  			});
			
		})
		.fail(function(error){
			console.error('Failed to close till. ' + error);
			
			ons.notification.alert({
	  			  message: 'Failed to close til!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			   
	  			  }
	  			});
		});
	};
	
	
	$scope.goToCloseTillPage = function(){
		menu.setMainPage('page/close-till.html', {closeMenu: true, callback:function(){
			
			document.getElementById('close-till-amount').focus();
			
		}});
	};
	
});

// Printing
module.controller('PrinterSettingsController', function($scope, OrderScreen, APP) {
	
	var settings = APP.PRINTER_SETTINGS.getSettings();
	
	//set defaults
	settings.lineWidth = settings.lineWidth || 40;
	 
	$scope.settings = settings;
	
	NODEJS_Printer.getPrinters().done(function(printers){
		
		$scope.printers = printers;
		
	}).fail(function(error){
		
		ons.notification.alert({
			  message: 'Failed to load printers.',
			  title: 'Error',
			  callback: function() {
			    // Alert button is closed!
				// menu.setMainPage('page/order-screen.html', {closeMenu:
				// true});
			  }
			});
		
	});
	
	$scope.save = function(){
		
		if( this.validatePrinter() && this.validatePoleDisplay() ){
			
			APP.PRINTER_SETTINGS.saveSettings( $scope.settings );
			
			ons.notification.alert({
				  message: 'Printer settings successfully saved.',
				  title: 'Information',
				  callback: function() {
				    // Alert button is closed!
					// menu.setMainPage('page/order-screen.html', {closeMenu:
					// true});
				  }
				});
			
		}
		
	};
	
	$scope.testPrinter = function(){
		
		if(this.validatePrinter()){
			
			modal.show();
			
			APP.PRINTER_SETTINGS.testPrinterSettings( $scope.settings ).done(function(){
				
			}).fail(function(){
				
				ons.notification.alert({
		  			  message: 'Failed to test printer.',
		  			  title: 'Error',
		  			  callback: function() {
		  			    // Alert button is closed!
		  				// menu.setMainPage('page/order-screen.html',
						// {closeMenu: true});
		  			  }
		  			});
				
			}).always(function(){
				
				modal.hide();
				
			});			
		}
	};
	
	
	$scope.testPoleDisplay = function(){	
		if(this.validatePoleDisplay()){
			
			modal.show();
			
			APP.PRINTER_SETTINGS.testPoleDisplaySettings( $scope.settings ).done(function(){
				
			}).fail(function(){
				
				ons.notification.alert({
		  			  message: 'Failed to pole display.',
		  			  title: 'Error',
		  			  callback: function() {
		  			    // Alert button is closed!
		  				// menu.setMainPage('page/order-screen.html',
						// {closeMenu: true});
		  			  }
		  			});
				
			}).always(function(){
				
				modal.hide();
				
			});			
		}
	};
	
	$scope.validatePrinter = function(){
		
		if(this.settings.enablePrinter){
			//validate printer settings
			//validate printer name
			if(this.settings.printerName == null || this.settings.printerName == ""){
				
				ons.notification.alert({
		  			  message: 'Choose a printer.',
		  			  title: 'Error',
		  			  callback: function() {
		  			    // Alert button is closed!
		  			  }
		  			});
				
				return false;
			}
			
			//validate printer line width
			if(this.settings.lineWidth == null || this.settings.lineWidth == ""){
				
				ons.notification.alert({
		  			  message: 'Enter a valid line width',
		  			  title: 'Error',
		  			  callback: function() {
		  			    // Alert button is closed!
		  			  }
		  			});
				
				return false;
			}
		}	
		
		return true;
	};
	
	$scope.validatePoleDisplay = function(){
				
		if(this.settings.enablePoleDisplay){
			//validate pole display settings
			//validate pole display name
			if(this.settings.poleDisplayName == null || this.settings.poleDisplayName == ""){
				
				ons.notification.alert({
		  			  message: 'Choose a pole display.',
		  			  title: 'Error',
		  			  callback: function() {
		  			    // Alert button is closed!
		  			  }
		  			});
				
				return false;
			}
		}
		
		
		return true;
	};
});

// Cayan Settings
module.controller('CayanSettingsController', function($scope, OrderScreen, APP) {
	
	$scope.settings = APP.CAYAN_SETTINGS.getSettings();
	
	// set default mode
	$scope.settings.mode = $scope.settings.mode || 'HOSTED';
	
	$scope.merchantName = CayanService.MERCHANT_NAME;
	$scope.siteId = CayanService.SITE_ID;
	$scope.terminalId = CayanService.TERMINAL_ID;
	
	$scope.save = function(){
		if(this.validate()){
			
			APP.CAYAN_SETTINGS.saveSettings( $scope.settings );
			
			CayanService.init();
			
			ons.notification.alert({
	  			  message: 'Cayan settings successfully saved.',
	  			  title: 'Information',
	  			  callback: function() {
	  			    // Alert button is closed!
	  				// menu.setMainPage('page/order-screen.html', {closeMenu:
					// true});
	  			  }
	  			});
		}
		
	};
	
	$scope.test = function(){	
		if(this.validate()){
			
			modal.show();
			
			APP.CAYAN_SETTINGS.testSettings( $scope.settings ).done(function( msg ){
				
				ons.notification.alert({
		  			  message: 'Successfully connected.',
		  			  title: 'Information',
		  			  callback: function() {
		  			    // Alert button is closed!
		  				// menu.setMainPage('page/order-screen.html',
						// {closeMenu: true});
		  			  }
		  			});
				
			}).fail(function(e){
				
				ons.notification.alert({
		  			  message: 'Failed to test Cayan. ' + e,
		  			  title: 'Error',
		  			  callback: function() {
		  			    // Alert button is closed!
		  				// menu.setMainPage('page/order-screen.html',
						// {closeMenu: true});
		  			  }
		  			});
				
			}).always(function(){
				
				modal.hide();
				
			});			
		}
	};
	
	$scope.validate = function(){
		
		if(!this.settings.enableCayan){
			return true;
		}
		
		if(this.settings.mode == 'HOSTED'){
			return true;
		}
				
		// validate ip address
		if(this.form.ipAddress.$error.pattern || this.form.ipAddress.$error.required){
			
			ons.notification.alert({
	  			  message: 'Please enter a valid ip address.',
	  			  title: 'Error',
	  			  callback: function() {
	  			    // Alert button is closed!
	  				document.getElementById('cayan-ip-address-text').select();
	  			  }
	  			});
			
			return false;
		}
		
		return true;
	};
});

// Hold Order History
module.controller('HoldOrdersController', function($scope, ShoppingCart, OrderScreen) {
	
		
	$scope.loadOrders = function(){
		$scope.orders  = APP.ORDER.search({status : 'DR'});
	};
	
	// initialise orders
	$scope.loadOrders();
	
	$scope.viewOrder = function ( order ){
		$scope.current_order = order;
	};
	
	$scope.isSelected = function( order ){
		
		if( $scope.current_order != null && $scope.current_order.order_id == order.order_id){
			
			return "selected";
			
		}
		
		return "";
	};
	
	$scope.recallOrder = function( order ){
		
		var customer_id = order["customer_id"];
		var customer = APP.CUSTOMER.getById( customer_id );
		
		OrderScreen.customer = customer;
		OrderScreen.order_id = order["order_id"];
		OrderScreen.uuid = order["uuid"];		
		
		var cart = ShoppingCart;
		cart.clear();
		
		// add note
		cart.addNote( order.note );
		
		// add lines
		var olines = order.lines;
		var oline = null;
		var l = null;
		
		for(var i = 0; i < olines.length; i++){
			oline = olines[i];
			
			l = cart.addLine(oline.product_id, oline.qtyentered);
			cart.updateLine(l.index, oline.priceentered, oline.qtyentered, oline.note, oline.modifiers);
		}
		
		menu.setMainPage('page/order-screen.html', {closeMenu: true});
		
	};
	
	$scope.closeOrder = function( order ){
		
		var order_id = order["order_id"];
		
		APP.ORDER.remove( order_id ).done(function(){
			
			$scope.$apply(function(){
				$scope.loadOrders();
				$scope.current_order = null;
			});
			
		});
	};
	
	$scope.closeAllOrders = function(){
		var orders = APP.ORDER.search({status : 'DR'});		
		
		if(orders.length == 0){
			return;
		}
		
		var order = null;
		var promises = [];
		
		for(var i=0; i< orders.length; i++){
			
			order = orders[i];
			var order_id = order['order_id'];
			
			promises.push( APP.ORDER.remove( order_id ));
		}
		
		jQuery.when.apply( jQuery, promises ).done(function() {        
	        for (var i = 0, j = arguments.length; i < j; i++) {
	        	if(arguments[i]) console.log(arguments[i]);
	        }
	        
	        console.log('orders cleared.');
	        
	        APP.ORDER.cache({status : 'DR'}).remove();
	        
	        $scope.$apply(function(){
	        	$scope.loadOrders();
	        	$scope.current_order = null;
			});
	        
	    }).fail(function() {        
	        for (var i = 0, j = arguments.length; i < j; i++) {
	        	if(arguments[i]) console.error(arguments[i]);
	        }
	        
	        console.log('Failed to clear orders!');
	    });
	};
	
});

// Today Orders
module.controller('TodayOrdersController', function($scope, ShoppingCart, OrderScreen) {
	
	var today = moment().startOf('day').valueOf();	
	
	$scope.loadOrders = function(){
		
		//var orders  = APP.ORDER.search({status : ['CO','VO'], dateordered : {'>' : today}});
		var orders  = APP.ORDER.search({status : ['CO','VO']});
		
		// use moment js
		for(var i=0; i<orders.length; i++){
			orders[i].xxx = new Date(orders[i].dateordered);
		}
		
		$scope.orders = orders;
	};
	
	$scope.viewOrder = function ( order ){
		$scope.current_order = order;
	};
	
	$scope.isSelected = function( order ){
		
		if( $scope.current_order != null && $scope.current_order.order_id == order.order_id){
			
			return "selected";
			
		}
		
		return "";
	};
	
	$scope.loadOrders();
	
	$scope.refundOrderConfirmation = function( order ){
		
		ons.notification.confirm({
			  message: 'Do you want to refund order?',
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'Confirmation',
			  buttonLabels: ['Yes', 'No'],
			  animation: 'default', // or 'none'
			  primaryButtonIndex: 1,
			  cancelable: false,
			  callback: function(index) {
			    // -1: Cancel
			    // 0-: Button index from the left
			    if(index == 0){
			    	
			    	$scope.refundOrder( order );			    			    	
			    }
			  }
			});	
		
	};
	
	$scope.voidOrderConfirmation = function( order ){
		
		ons.notification.confirm({
			  message: 'Do you want to void order?',
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'Confirmation',
			  buttonLabels: ['Yes', 'No'],
			  animation: 'default', // or 'none'
			  primaryButtonIndex: 1,
			  cancelable: false,
			  callback: function(index) {
			    // -1: Cancel
			    // 0-: Button index from the left
			    if(index == 0){
			    	
			    	$scope.voidOrder( order );
			    	
			    }
			  }
			});	
		
	};
	
	$scope.voidOrder = function( order ){
		
		var order_id = order["order_id"];
		
		modal.show();
		
		APP.voidOrder( order_id ).done(function(msg){
						
			ons.notification.alert({
	  			  message: 'Order successfully voided!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Information',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			    
	  			    $scope.$apply(function(){
	  			    	
	  			    	$scope.loadOrders();
	  			    	
	  			    });	  				
	  			    
	  			  }
	  			});
			
			
			
		}).fail(function(error){
			
			ons.notification.alert({
	  			  message: 'Failed to void order!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			  }
	  			});
			
		}).always(function(){
			
			modal.hide();
			
		});
		
	};
	
	$scope.refundOrder = function( order ){
		
		var order_id = order["order_id"];		
		var customer_id = order["customer_id"];
		
		var customer = APP.CUSTOMER.getById( customer_id );
		
		OrderScreen.customer = customer;
		OrderScreen.ref_order_id = order["order_id"];
		OrderScreen.ref_uuid = order['uuid'];		
		
		var cart = ShoppingCart;
		cart.clear();
		
		// add refund note
		// cart.addNote( order.note );
		
		// add lines
		var olines = order.lines;
		var oline = null;
		var l = null;
		
		for(var i = 0; i < olines.length; i++){
			oline = olines[i];
			
			if( oline.qtyentered < 0) continue; /* cannot refund negative */
			
			l = cart.addLine(oline.product_id, oline.qtyentered * -1, false);
			
			// index, price, qty, note, modifiers, enableTax
			cart.updateLine(l.index, oline.priceentered, oline.qtyentered * -1, oline.note, oline.modifiers, oline.enabletax);
		}
		
		menu.setMainPage('page/order-screen.html', {closeMenu: true});
	};
	
	$scope.reprintOrder = function( order ){
		
		if(APP.PRINTER_SETTINGS.isPrinterEnabled()){
			// print receipt
			
			APP.printOrder( order ).done(function(msg){
				
			}).fail(function(error){			
				APP.showError(error, 'Printer Error');
			});
		}
		
	};
	
});

module.service('APP', function() {return APP;});



module.controller('SocialMediaController', function($scope) {
	
	$scope.publish = function(){
		
		var message = $scope.message;
		
		// post message to social media
		if( BufferService.isConfigured == true ){
			
			modal.show();
			
			BufferService.updateStatus(BufferService.profile_ids, message, true).done( function ( response ){
				
				ons.notification.alert({
					  message: 'Message has been posted',
					  // or messageHTML: '<div>Message in HTML</div>',
					  title: 'Information',
					  buttonLabel: 'OK',
					  animation: 'default', // or 'none'
					  // modifier: 'optional-modifier'
					  callback: function() {
					    // Alert button is closed!
					  }
					});
				
			}).fail( function ( error ){
				
				ons.notification.alert({
		  			  message: 'Failed to post message! ' + error,
		  			  // or messageHTML: '<div>Message in HTML</div>',
		  			  title: 'Social Post Error',
		  			  buttonLabel: 'OK',
		  			  animation: 'default', // or 'none'
		  			  // modifier: 'optional-modifier'
		  			  callback: function() {
		  			    // Alert button is closed!
		  			  }
		  			});
				
			}).always(function(){
				
				modal.hide();
				
			});
			
		}
		else
		{
			ons.notification.alert({
	  			  message: 'Buffer is not configured for this account!',
	  			  // or messageHTML: '<div>Message in HTML</div>',
	  			  title: 'Social Post Error',
	  			  buttonLabel: 'OK',
	  			  animation: 'default', // or 'none'
	  			  // modifier: 'optional-modifier'
	  			  callback: function() {
	  			    // Alert button is closed!
	  			  }
	  			});
		}
		
	};
	
});


module.controller('RACellularSettingsController', function($scope) {
	
	var settings = localStorage.getItem("RA_CELLULAR_SETTINGS") || '{}'; 
	
	settings = JSON.parse(settings);
	
	settings.clientType = settings.clientType || "POSTERITA";
	settings.printerWidth = settings.printerWidth || "80";
	
	$scope.settings = settings; 
	
	$scope.save = function(){
		
		//todo validations
		
		localStorage.setItem("RA_CELLULAR_SETTINGS", JSON.stringify($scope.settings));
		
		ons.notification.alert({
		  message: 'RA Cellular settings successfully saved.',
		  title: 'Information',
		  callback: function() {
		    // Alert button is closed!
			// menu.setMainPage('page/order-screen.html', {closeMenu:
			// true});
		  }
		});
		
	}
	
});

//TODO put in tal.js
module.controller('TalFormController', function($scope, $timeout){	
	
	var ctrl = this;
	
	var settings = localStorage.getItem("TAL_SETTINGS") || '{}'; 		
	settings = JSON.parse(settings);
	
	if( !settings.hasOwnProperty('serviceKey') ){
		
		$scope.alert('Please configure TAL settings. No service key found!');
		return;
	}
	
	if( !settings.hasOwnProperty('signature') || settings.signature == '' ){
		
		$scope.alert('Please configure TAL settings. No agent signature found!');
		return;
	}
	
	settings.serviceKey = settings.serviceKey || "4527472882761054349344862033393789429982";
	settings.signature = settings.signature || "";
	
	ctrl.agentsig = settings.signature;
	TalService.service_key = settings.serviceKey;
	
	document.getElementById('agent-signature-image').src = ctrl.agentsig;
	
	
	ons.createDialog('page/signature-capture-dialog.html', {parentScope: $scope}).then(function(dialog) {
		
      	$scope.signature_capture_dialog = dialog;
      	
      	var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
  		  backgroundColor: 'rgba(255, 255, 255, 0)',
  		  penColor: 'rgb(0, 0, 0)'
	  	});
	  	
	  	$scope.signaturePad = signaturePad;
	  	
	  	$scope.clearSignature = function(){
	  		
	  		$scope.signaturePad.clear();
	  		
	  	};
	  	
	  	$scope.saveSignature = function(){
	  		
	  		if( $scope.signaturePad.isEmpty() ) return;
	  		
	  		var dataURL = signaturePad.toDataURL(); //image/png
	  		
	  		ctrl.policyholdersig = dataURL;
	  		document.getElementById('policy-holder-signature-image').src = ctrl.policyholdersig;
	  		
	  		$scope.signature_capture_dialog.hide();
	  	    
	  	};
      
    });
	
	$scope.showSignatureDialog = function(){
		$scope.signaturePad.clear();
		
		$scope.signature_capture_dialog.show({
			
			animation:'slide', 
			callback : function(){
				//
			} 
		});
		
	};
	
		
	/*
	ctrl.policy = {};
	ctrl.policy.dependents = [];
	*/
	
	ctrl.policy = {
			  "planid": 1684,
			  "mainidno": "7663837635089",
			  "mainfirstname": "Tom",
			  "mainsurname": "Cat",
			  "maintelhome": "0123456789",
			  "maintelwork": "0115462747",
			  "maintelcell": "08212345678",
			  "mainemailaddress": "name@domain.co.za",
			  "passportnumber": "PASS321",
			  "workpermitnumber": "12345678",
			  "physicaladdress1": "1 Market Street",
			  "physicaladdress2": "Parktown",
			  "physicaladdress3": "Johannesburg",
			  "physicalcode": "2001",
			  "postaladdress1": "PO Box 123",
			  "postaladdress2": "Parktown",
			  "postaladdress3": "Johannesburg",
			  "postalcode": "2000",
			  "genderid": 2,
			  "incomepermonthid": 3,
			  "expenditurepermonth": "None",
			  "marriedstatusid": "false",
			  "hasspouse": "true",
			  "nochildren": 3,
			  "noadultdependents": 3,
			  "anyothercover": "true",
			  "anyothercoverdate": "2000-01-01",
			  "anyothercoveramount": 1000,
			  "riskprofile": "High Risk",
			  "typeofcoverrequired": "Personal",
			  "monthlycontributionavailable": 500,
			  "needandobjectiveid": 4,
			  "needandobjectiveother": "Other text",
			  "electtofollowadvice": "true",
			  "cancelledotherpolicies": "false",
			  "reasonforrecommendation": "Reason for recommendation",
			  "paymenttypeid": 3,
			  "grindrodusnno": "1234567",
			  "paydebitbank": 3,
			  "paydebitaccno": "12345678",
			  "paydebitbranchcode": "250123",
			  "paydebitacctype": 3,
			  "paydebitdayid": 19,
			  "benname": "Spike",
			  "bensurname": "Dog",
			  "benid": "7663837635089",
			  "benrelationshipid": 9,
			  "dependents": [
			    {
			      "depfirstname": "Jerry",
			      "deplastname": "Mouse",
			      "depdob": "2017-12-07",
			      "entrydate": "2017-12-05",
			      "entryage": 0,
			      "memtypeid": 7,
			      "productchildid": 7274,
			      "depidno": "Not Available"
			    }
			  ]
			};
						
	
	ctrl.addDependent = function(){
		
		ctrl.policy.dependents.push({
			"depfirstname" : "",
			"deplastname": "",
			"depdob" : "",
			"entrydate" : "2017-12-05",
			"entryage" : 0,
			"memtypeid" : 0,
			"productchildid" : 0,
			"depidno" : 'Not Available'			
		});
		
	};
	
	ctrl.capturePolicy =  function(){
		
		var policy = ctrl.policy;
		var policyholdersig = ctrl.policyholdersig || '';		
		var agentsig = ctrl.agentsig || '';
		
		if( policyholdersig.length == 0 ){
			
			ons.notification.alert({
				  message: "Policy holder signature is required!",
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Error',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				  }
				});
			
			return;
		}
		
		if( agentsig.length == 0 ){
			
			ons.notification.alert({
				  message: "Agent signature is required!",
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Error',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				  }
				});
			
			return;
		}
		
		modal.show();
		
		var dfd = new jQuery.Deferred();
		
		TalService.addPolicy( policy ).done( function( response ){
			
			var json = JSON.parse( response );
			
			if( json.PolicySubmission == 'Fail' ){
				
				dfd.reject('Policy submission failed! Error: ' + json.Error );
				
			}
			else
			{
				var PolID = json.PolID;
				
				TalService.uploadPolicyHolderSig( PolID, policyholdersig ).done( function( response ){
					
					var json = JSON.parse( response );
					
					if( json.uploadpolicyholdersig == 'success' ){
						
						TalService.uploadAgentSig( PolID, agentsig ).done( function( response ){
							
							var json = JSON.parse( response );
							
							
							if( json.uploadagentsig == 'success' ){
								
								dfd.resolve("Policy ['" + PolID + "'] was successfully captured.");
								
							}
							else
							{
								dfd.reject('Failed to upload agent signature!');
							}
							
							
						} ).fail(function(err){
							
							dfd.reject('Failed to upload agent signature!');
							
						});
					}
					else
					{	
						dfd.reject('Failed to upload policy holder signature!');
					}
					
				} ).fail(function(err){
					
					dfd.reject('Failed to upload policy holder signature!');
					
				});
				
				
			}
			
		} ).fail(function(err){
			
			dfd.reject('Failed to send captured policy request!');
			
		});
		
		var promise = dfd.promise();
		
		promise.done(function(msg){
			
			ons.notification.alert({
				  message: msg,
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Tal Policy',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				  }
				});
			
		}).fail(function(msg){
			
			ons.notification.alert({
				  message: msg,
				  // or messageHTML: '<div>Message in HTML</div>',
				  title: 'Error',
				  buttonLabel: 'OK',
				  animation: 'default', // or 'none'
				  // modifier: 'optional-modifier'
				  callback: function() {
				    // Alert button is closed!
				  }
				});
			
		}).always(function(){
			modal.hide()
		});
		
	}
	
	/*
	 * This endpoint retrieves a breakdown of a specific plan, along with dependent types, limits and any additional premiums. 
	 * PlanID is drived from one of the plans available when retrieving method 'planlist'.
	 */
 	ctrl.getPlanDetail = function(){
 		
 		var planid = ctrl.policy.planid;

 		if( planid > 0 ){
 			
 			for( var i=0; i<ctrl.planlist.length; i++ ){
 				
 				if( ctrl.planlist[i].PlanID == planid ){
 					
 					ctrl.current_plan = ctrl.planlist[i];
 					ctrl.policy_info = ctrl.current_plan.PlanName;
 					ctrl.basicPremium = ctrl.current_plan.Premium;
 					
 					break;
 					
 				}
 			}
 		}
 		else
 		{
 			ctrl.policy_info = "";
 			ctrl.basicPremium = 0;
 		}
 		
 	 	TalService.getPlanDetail( planid ).done(function( json ){
 	 		
 	 		$scope.$apply(function(){
 	 			
 	 			ctrl.planDetails = json;
 	 		}); 			
 	 		
 	 	}).fail(function(error){
 			  
 	 		console.log( { 'ErrorMessage' : error } );
 		}); 	 	
 	 	 	 	
 	};
 	
 	modal.show();
 	
 	TalService.getPlanList().done(function( json ){
		
 		$scope.$apply(function(){
			
 			ctrl.planlist = json;
		});
 		
 		modal.hide();
 		
 		/*
 		 * This endpoint retrieves all the bank account types accepted by TAPS.
 		 */
 	 	TalService.getAccountType().done(function( json ){
 			
 	 		$scope.$apply(function(){
 	 			ctrl.accountTypes = json;
 	 		});
 			
 		}).fail(function(error){
 			  
 			  console.log( { 'ErrorMessage' : error } );
 		});
 	 	
 	 	/*
 		 * This endpoint retrieves all the Bank Names currently accepted by TAPS.
 		 */ 	
 	 	TalService.getBank().done(function( json ){
 			
 	 		$scope.$apply(function(){
 	 			ctrl.banks = json;
 	 		});
 			
 		}).fail(function(error){
 			  
 			console.log( { 'ErrorMessage' : error } );
 		});
 	 	
 	 	/*
 		 * This endpoint retrieves the payment types available in TAPS.
 		 */ 	
 	 	TalService.getPaymentType().done(function( json ){
 			
 	 		$scope.$apply(function(){
 	 			ctrl.paymentTypes = json;
 	 		});
 			
 		}).fail(function(error){
 			  
 			console.log( { 'ErrorMessage' : error } );
 		});
 	 	
 	 	/*
 		 * This endpoint retrieves all the income bracket types available in TAPS.
 		 */
 		TalService.getIncomeBracketType().done(function( json ){
 			
 			$scope.$apply(function(){
 				ctrl.incomes = json;
 			});
 			
 		}).fail(function(error){
 			  
 			console.log( { 'ErrorMessage' : error } );
 		});
 	 	
 		/*
 		 * This endpoint retrieves the different dependent and beneficiary relationship types available in TAPS.
 		 */
 	 	TalService.getRelationshipTypeId().done(function( json ){
 	 		
 	 		$scope.$apply(function(){
 	 			ctrl.relationships = json;
 	 		});
 	 		
 	 	}).fail(function(error){
 			  
 	 		console.log( { 'ErrorMessage' : error } );
 		});
 	 	
 	 	/*
 		 * This endpoint retrieves the payment days available to set a debit order going off day, in other words the day of the month the debit order should fall on..
 		 */
 	 	TalService.getPayDebitDayId().done(function( json ){
 	 		
 	 		$scope.$apply(function(){
 	 			ctrl.debitDays = json;
 	 		});
 	 		
 	 	}).fail(function(error){
 			  
 	 		console.log( { 'ErrorMessage' : error } );
 		});
 	 	
 	 	/*
 		 * This endpoint retrieves all the needs and objective types available in TAPS.
 		 */
 	 	TalService.getNeedsAndObjectives().done(function( json ){
 	 		
 	 		$scope.$apply(function(){
 	 			
 	 			ctrl.needsAndObjectives = json;
 	 		}); 	 		
 	 		
 	 		
 	 	}).fail(function(error){
 			  
 	 		console.log( { 'ErrorMessage' : error } );
 		});
		
	}).fail(function(error){
		  
		  console.log( { 'ErrorMessage' : error } );
		  modal.hide();
	});
 	
 	
 	
 	ctrl.validateIdNumber = function(){
 		
 		var id = ctrl.policy.mainidno;
 		
 		TalService.validateIdNumber( id ).done(function( json ){
 	 		
 	 		$scope.$apply(function(){
 	 			
 	 			ctrl.status = json['IDNumber'];
 	 		});
 	 		
 	 	}).fail(function(error){
 			  
 			  dfd.reject( { 'ErrorMessage' : error } );
 		});
 		
 	}
 	
 	TalService.getMemTypes().done(function( json ){
		
		ctrl.memTypes = json;
		
	}).fail(function(error){
		  
		  dfd.reject( { 'ErrorMessage' : error } );
	});
 	
 	ctrl.coverAmount = ctrl.coverAmount || 0;
 	
 	
 	/*capture signature*/
 	/*var canvas = document.querySelector("canvas");
 	
 	if(canvas != null){
 		
 		var canvas = document.querySelector("canvas");
		var ratio =  window.devicePixelRatio || 1;
	    canvas.width = canvas.offsetWidth * ratio;
	    canvas.height = canvas.offsetHeight * ratio;
	    canvas.getContext("2d").scale(ratio, ratio);
	    
		var signaturePad = new SignaturePad(canvas);
 		
 		ctrl.clearSignature = function(){
 	 		
 		 	signaturePad.clear();
 	 	}
 		
 		ctrl.saveSignature = function(){
 			
 			if(signaturePad.isEmpty()){
 				
 				ons.notification.alert({
 					  message: 'Signature is blank! ',
 					  title: 'Error',
 					  buttonLabel: 'OK',
 					  animation: 'default', // or 'none'
 					  callback: function() {
 						  
 					  }
 					});
 				
 				return;
        	}
 			
 			var dataURL = signaturePad.toDataURL();
        	jQuery('#signature').val(dataURL);
        	
        	alert(dataURL);
 		}
 		
 	}*/
	
});

module.controller('TalSettingsController', function($scope){
	
var settings = localStorage.getItem("TAL_SETTINGS") || '{}'; 
	
	settings = JSON.parse(settings);
	
	settings.serviceKey = settings.serviceKey || "4527472882761054349344862033393789429982";
	settings.signature = settings.signature || "";
	
	var image = document.getElementById('signature-image');
	image.src = settings.signature;
	
	$scope.settings = settings; 
	
	$scope.save = function(){
		
		//todo validations
		
		localStorage.setItem("TAL_SETTINGS", JSON.stringify($scope.settings));
		
		ons.notification.alert({
		  message: 'TAL settings successfully saved.',
		  title: 'Information',
		  callback: function() {
		    // Alert button is closed!
			// menu.setMainPage('page/order-screen.html', {closeMenu:
			// true});
		  }
		});
		
	}
	
	ons.createDialog('page/signature-capture-dialog.html', {parentScope: $scope}).then(function(dialog) {
		
      	$scope.signature_capture_dialog = dialog;
      	
      	var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
  		  backgroundColor: 'rgba(255, 255, 255, 0)',
  		  penColor: 'rgb(0, 0, 0)'
	  	});
	  	
	  	$scope.signaturePad = signaturePad;
	  	
	  	$scope.clearSignature = function(){
	  		
	  		$scope.signaturePad.clear();
	  		
	  	};
	  	
	  	$scope.saveSignature = function(){
	  		
	  		if( signaturePad.isEmpty() ) return;
	  		
	  		var dataURL = signaturePad.toDataURL(); //image/png
	  		
	  		$scope.settings.signature = dataURL;
	  		
	  		image.src = dataURL;
	  		
	  		$scope.signature_capture_dialog.hide({
				
				animation:'slide', 
				callback : function(){
					//
				} 
			});
	  	    
	  	};
      
    });
	
	$scope.showSignatureDialog = function(){
		$scope.signaturePad.clear();
		
		$scope.signature_capture_dialog.show({
			
			animation:'slide', 
			callback : function(){
				//
			} 
		});
		
	};
	
});

function transportwebcallback( response ){
	
	console.log( response );
	
}

/*
 * 
 * ons.setDefaultDeviceBackButtonListener(function() { if
 * (navigator.notification.confirm("Are you sure to close the app?",
 * function(index) { if (index === 1) { // OK button navigator.app.exitApp(); //
 * Close the app } } )); });
 * 
 * <ons-page ng-device-backbutton="doSomething()"> Some page content </ons-page>
 */

module.directive('selectOnFocus', function() {
	return {
		restrict: 'A',
		link: function(scope, element)
		{
			element.on("focus", function()
			{
				element.select();
			});
		}
	};
});


//Directive
module.directive('ngEnter', function () {
	
    return function(scope, element, attrs) {
    	
        element.bind('keydown keypress', function(event) {
        	
            if (event.which === 13) {
            	
                scope.$apply(function() {
                	scope.$eval(attrs.ngEnter || attrs.ngClick, {$event:event});
                });
                
                event.preventDefault();
            }
        });
    };
});

module.directive('convertToNumber', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, element, attrs, ngModel) {
	      ngModel.$parsers.push(function(val) {
	        return parseInt(val, 10);
	      });
	      ngModel.$formatters.push(function(val) {
	        return '' + val;
	      });
	    }
	  };
	});