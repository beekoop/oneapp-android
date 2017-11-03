var ESC_COMMANDS = {

    LINE_FEED: "\x0A",
    PAPER_CUT: "\x0A\x1D\x56\x42",

    LEFT_ALIGN: "\x1B\x61\x30",
    CENTER_ALIGN: "\x1B\x61\x01",
    RIGHT_ALIGN: "\x1B\x61\x02",

    FONT_NORMAL: "\x1B!\x45",
    FONT_NORMAL_BOLD: "\x1B!\x4D",

    FONT_SMALL: "\x1B!\x47",
    FONT_SMALL_BOLD: "\x1B!\x4F",

    FONT_BIG: "\x1B!\x21",
    FONT_BIG_BOLD: "\x1B!\x29",

    FONT_H1: "\x1B!\x36",
    FONT_H1_BOLD: "\x1B!\x3E",

    FONT_H2: "\x1B!\x37",
    FONT_H2_BOLD: "\x1B!\x3F",

    FONT_H3: "\x1B!\x28",
    FONT_H3_BOLD: "\x1B!\x2E",

    FONT_H4: "\x1B!\x29",
    FONT_H4_BOLD: "\x1B!\x2F",

    OPEN_DRAWER: "\x0A\x1B\x70\x30\x37\x01",

    NVRAM: "\x1C\x70\x01\x30\x0A",

    DEFAULT_LINE_SPACING: "\x1B\x32"
};

var PoleDisplay_ESC_COMMANDS = {
        CLEAR:'\x0C',
        LINE_FEED:'\x0A',
        MOVE_LEFT: '\x0D'
};

var JSReceiptUtils = {
    replicate: function (str, n) {
        var s = '';
        for (var i = 0; i < n; i++) s += str;
        return s;
    },

    format: function (str, length, alignRight) {
        str += '';
        if (str.length > length) {
            return str.substring(0, length);
        }

        var paddingLength = length - str.length;
        var padding = '';
        for (var i = 0; i < paddingLength; i++) padding += ' ';

        if (alignRight) return padding + str;

        return str + padding;
    },

    /*
     * Takes a long string and split it into different lines*/
    splitIntoLines: function (str, n) {
        var lines = [];

        if (str.length < n) {
            lines.push(str);
            return lines;
        }

        while (true) {
            var index = str.lastIndexOf(" ", n - 1);
            if (index > 0 && (str.length) > n) {
                var line = str.substring(0, index);
                str = str.substring(index + 1);
                lines.push(line);
            } else {

                lines.push(str);
                break;
            }
        }

        /*If line does not contain any space
         * */
        if (lines.length == 0) {
            while (true) {
                if (n > str.length) {
                    lines.push(str);
                    break;
                }

                lines.push(str.substring(0, n));
                str = str.substring(n);
            }
        }

        return lines;
    }
};

var PrinterManager = {};

PrinterManager.implementations = {
    STAR_WEB_PRINT: 'star',
    EPSON_EPOS_PRINT: 'epson',
    POSTERITA_PRINT: 'posterita'
};

PrinterManager.print = function (printFormat) {

    var printer = this.getPrinter();

    var printData = printer.format(printFormat);

    var configuration = this.getPrinterConfiguration();
    var printerName = configuration.PRINTER_NAME;
    
    return printer.print(printerName, printData);
};

PrinterManager.setPrinterConfiguration = function ( config ) {
	this.configuration = config;
};

PrinterManager.getPrinterConfiguration = function () {

	var configuration = {};

	var settings = APP.PRINTER_SETTINGS.getSettings();

    configuration.PRINTER_NAME = settings.printerName;
    configuration.POLE_DISPLAY_NAME = settings.poleDisplayName;
	configuration.LINE_WIDTH = settings.lineWidth || 40;

    return configuration;
};

PrinterManager.getLineWidth = function () {

    var configuration = this.getPrinterConfiguration();
    return configuration.LINE_WIDTH;

};

PrinterManager.getPrinter = function () {
	
	return NODEJS_Printer;
	/*
    var printer = null;

    var configuration = this.getPrinterConfiguration();
    var implementation = configuration.PRINTER_IMPLEMENTATION

    switch (implementation) {

    case this.implementations.STAR_WEB_PRINT:
        printer = STAR_WEB_PRINT_Printer;
        break;

    case this.implementations.EPSON_EPOS_PRINT:
        printer = EPSON_EPOS_PRINT_Printer;
        break;

    case this.implementations.POSTERITA_PRINT:
        printer = POSTERITA_Printer;
        break;

    default:
        break;
    }

    return printer;
    */
};

PrinterManager.printReceipt = function (receiptJSON, openDrawer) {

    var printFormat = this.getReceiptPrintFormat(receiptJSON, openDrawer);

    this.print(printFormat);
};

var STAR_WEB_PRINT_Printer = {

		format: function (printFormat) {

			var configuration = PrinterManager.getPrinterConfiguration();
            var LINE_WIDTH = PrinterManager.getLineWidth();
            var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);

            var builder = new StarWebPrintBuilder();
            var request = "";

            /* parse print format */
            for (var i = 0; i < printFormat.length; i++)
            {
                var line = printFormat[i];

                if (line.length == 1) {
                    var command = line[0];

                    switch (command) {
                    case 'FEED':
                        request += builder.createFeedElement({
                            line: 1
                        });
                        break;
                    case 'SEPARATOR':
                        request += builder.createRuledLineElement({
                            thickness: 'thin',
                            width: LINE_WIDTH
                        });
                        break;
                    case 'CENTER':
                        request += builder.createAlignmentElement({
                            position: 'center'
                        });
                        break;
                    case 'LEFT':
                        request += builder.createAlignmentElement({
                            position: 'left'
                        });
                        break;
                    case 'RIGHT':
                        request += builder.createAlignmentElement({
                            position: 'right'
                        });
                        break;
                    case 'SIGNATURE':
                        /* see view-order.jsp line 763 */
                        var canvas = document.getElementById("signature-canvas-view");
                        if (canvas) {
                            var context = canvas.getContext('2d');
                            request += builder.createBitImageElement({
                                context: context,
                                x: 0,
                                y: 0,
                                width: canvas.width,
                                height: canvas.height
                            });
                        } else {

                            var signatureJSON = {
                                characterspace: 0,
                                linespace: 32,
                                codepage: 'cp998',
                                international: 'usa',
                                font: 'font_a',
                                width: 1,
                                height: 1,
                                emphasis: true,
                                underline: false,
                                invert: false,
                                data: JSReceiptUtils.format("Signature:________________________________________________", LINE_WIDTH)
                            };

                            request += builder.createTextElement(signatureJSON);
                            request += builder.createFeedElement({
                                line: 1
                            });

                        }

                        break;

                    case 'PAPER_CUT':
                        request += builder.createCutPaperElement({
                            feed: true,
                            type: 'full'
                        });
                        break;

                    case 'OPEN_DRAWER':
                        request += builder.createPeripheralElement({
                            channel: 1,
                            on: 200,
                            off: 200
                        });
                        break;

                    case 'NVRAM':
                        request += builder.createRawDataElement({
                            data: ESC_COMMANDS.NVRAM
                        });
                        break;

                    }/*switch*/
                }
                else
                {
                	var font = line[0];
                    var text = line[1];

                    if (text == null) continue;

                    if (line.length > 2) {
                        var label = line[2];
                        text = label + text;
                    }

                    var textElementJSON = {
                        characterspace: 0,
                        linespace: 32,
                        codepage: 'cp998',
                        international: 'usa',
                        font: 'font_a',
                        width: 1,
                        height: 1,
                        emphasis: false,
                        underline: false,
                        invert: false,
                        data: text
                    };

                    switch (font) {
                    /*normal*/
                    case 'N':
                        break;

                        /*bold*/
                    case 'B':
                        textElementJSON.emphasis = true;
                        break;

                        /*invert*/
                    case 'I':
                        textElementJSON.invert = true;
                        break;

                        /*underline*/
                    case 'U':
                        textElementJSON.underline = true;
                        break;

                        /*small*/
                    case 'S':
                        textElementJSON.font = 'font_b';
                        break;

                        /*header 1*/
                    case 'H1':
                        textElementJSON.font = 'font_a';
                        textElementJSON.emphasis = true;
                        textElementJSON.width = 2;
                        textElementJSON.height = 2;
                        break;

                        /*header 2*/
                    case 'H2':
                        textElementJSON.font = 'font_a';
                        textElementJSON.emphasis = false;
                        textElementJSON.width = 2;
                        textElementJSON.height = 2;
                        break;

                        /*header 3*/
                    case 'H3':
                        textElementJSON.font = 'font_b';
                        textElementJSON.emphasis = true;
                        textElementJSON.width = 2;
                        textElementJSON.height = 2;
                        break;

                        /*header 4*/
                    case 'H4':
                        textElementJSON.font = 'font_b';
                        textElementJSON.emphasis = false;
                        textElementJSON.width = 2;
                        textElementJSON.height = 2;
                        break;


                    case 'BARCODE':
                        request += builder.createBarcodeElement({
                            symbology: 'Code39',
                            data: text
                        });

                        textElementJSON.data = "";

                        break;

                    case 'CANVAS':
                        var canvas = text;
                        /* overwrite text */
                        text = "";
                        var context = canvas.getContext('2d');
                        request += builder.createBitImageElement({
                            context: context,
                            x: 0,
                            y: 0,
                            width: canvas.width,
                            height: canvas.height
                        });

                        textElementJSON.data = "";

                        break;

                    }/*switch*/

                    request += builder.createTextElement(textElementJSON);
                    request += builder.createFeedElement({
                        line: 1
                    });

                }/*else*/

            }/*for*/


            return request;

		},

		print: function (printData) {

			var dfd = new jQuery.Deferred();

	        var configuration = PrinterManager.getPrinterConfiguration();
	        var ips = configuration.IP_ADDRESS;

	        ips = ips.split(',');
	        for (var i = 0; i < ips.length; i++) {
	            var ip = ips[i];
	            ip = ip.trim();

	            var address = 'http://' + ip + '/StarWebPRNT/SendMessage';

	            var trader = new StarWebPrintTrader({
	                url: address
	            });

	            trader.onReceive = function (response) {

	            	if (trader.isOffLine({traderStatus:response.traderStatus})) {
        	　　　　　　	dfd.reject("Printer is offline!");
        	　　　　　　	return;
        	　　　　	}

	            	if (trader.isCoverOpen({traderStatus:response.traderStatus})) {
	            		dfd.reject("Printer cover is open!");
	        	　　　　　return;
	        　　　　	}

	            	if (trader.isPaperEnd({traderStatus:response.traderStatus})) {
        	　　　　　　	dfd.reject("Printer out of paper!");
   	　　　　　			return;
        	　　　　 }

	                var responseXML = response.responseText;
	                dfd.resolve(responseXML);
	            };

	            trader.onTimeout = function () {
	            	dfd.reject("Printer is offline!");
        	　　　　　return;
	            }

	            trader.onError = function (response) {
	                var responseXML = response.responseText;
	                dfd.reject(responseXML);
	            }

	            trader.sendMessage({
	                request: printData
	            });
	        }

	        return dfd.promise();
	    },

	    sendJob: function (ip, job) {

	    }

};


var EPSON_EPOS_PRINT_Printer = {

    format: function (printFormat) {

        var configuration = PrinterManager.getPrinterConfiguration();

        var LINE_WIDTH = PrinterManager.getLineWidth();
        var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);

        var builder = new epson.ePOSBuilder();

        for (var i = 0; i < printFormat.length; i++) {
            var line = printFormat[i];

            if (line.length == 1) {
                var command = line[0];

                switch (command) {

                case 'FEED':
                    builder.addFeed();
                    break;

                case 'PAPER_CUT':
                    builder.addCut(builder.CUT_FEED);
                    break;

                case 'OPEN_DRAWER':
                    builder.addCommand(ESC_COMMANDS.OPEN_DRAWER);
                    break;

                case 'NVRAM':
                    builder.addCommand(ESC_COMMANDS.NVRAM);
                    break;

                case 'SEPARATOR':
                    builder.addText(LINE_SEPARATOR);
                    builder.addFeed();
                    break;

                case 'CENTER':
                    builder.addTextAlign(builder.ALIGN_CENTER);
                    break;

                case 'LEFT':
                    builder.addTextAlign(builder.ALIGN_LEFT);
                    break;

                case 'RIGHT':
                    builder.addTextAlign(builder.ALIGN_RIGHT);
                    break;

                case 'SIGNATURE':
                    /* see view-order.jsp line 763 */
                    var canvas = document.getElementById("signature-canvas-view");
                    if (canvas) {
                        var context = canvas.getContext('2d');

                        builder.brightness = 1.0;
                        builder.halftone = builder.HALFTONE_ERROR_DIFFUSION;
                        builder.addImage(context, 0, 0, canvas.width, canvas.height, builder.COLOR_1, builder.MODE_MONO);
                    } else {
                        builder.addCommand(ESC_COMMANDS.FONT_NORMAL_BOLD);
                        builder.addText(JSReceiptUtils.format("Signature:________________________________________________", LINE_WIDTH));
                        builder.addFeed();
                    }

                    break;

                }
            } else {
                var font = line[0];
                var text = line[1];

                if (text == null) continue;

                if (line.length > 2) {
                    var label = line[2];
                    text = label + text;
                }

                switch (font) {
                    /*normal*/
                case 'N':
                    builder.addCommand(ESC_COMMANDS.FONT_NORMAL);
                    break;

                    /*bold*/
                case 'B':
                    builder.addCommand(ESC_COMMANDS.FONT_NORMAL_BOLD);
                    break;

                    /*invert*/
                case 'I':
                    builder.addCommand(ESC_COMMANDS.FONT_NORMAL);
                    break;

                    /*underline*/
                case 'U':
                    builder.addCommand(ESC_COMMANDS.FONT_NORMAL);
                    break;

                    /*small*/
                case 'S':
                    builder.addCommand(ESC_COMMANDS.FONT_SMALL);
                    break;

                    /*header 1*/
                case 'H1':
                    builder.addCommand(ESC_COMMANDS.FONT_H1);
                    break;

                    /*header 2*/
                case 'H2':
                    builder.addCommand(ESC_COMMANDS.FONT_H2);
                    break;

                    /*header 3*/
                case 'H3':
                    builder.addCommand(ESC_COMMANDS.FONT_H3);
                    break;

                    /*header 4*/
                case 'H4':
                    builder.addCommand(ESC_COMMANDS.FONT_H4);
                    break;


                case 'BARCODE':
                    builder.addBarcode(text, builder.BARCODE_CODE39, builder.HRI_BELOW, builder.FONT_A, 2, 128);
                    /* override text */
                    text = "";
                    break;

                case 'CANVAS':
                    var canvas = text;
                    // override text
                    text = "";
                    var context = canvas.getContext('2d');

                    builder.brightness = 1.0;
                    builder.halftone = builder.HALFTONE_ERROR_DIFFUSION;
                    builder.addImage(context, 0, 0, canvas.width, canvas.height, builder.COLOR_1, builder.MODE_MONO);

                    break;

                }

                builder.addText(text);
                builder.addFeed();

            }
        }

        return builder.toString();
    },

    print: function (printData) {

    	var dfd = new jQuery.Deferred();

        var configuration = PrinterManager.getPrinterConfiguration();
        var ips = configuration.IP_ADDRESS;

        ips = ips.split(',');

        for (var i = 0; i < ips.length; i++) {

            var ip = ips[i];
            ip = ip.trim();

            var address = 'http://' + ip + '/cgi-bin/epos/service.cgi?devid=local_printer&timeout=60000';

            var epos = new epson.ePOSPrint(address);

            epos.onreceive = function (response) {
            	dfd.resolve(response.success);
            };

            epos.onerror = function (error) {
            	dfd.reject(error.status);
            };

            epos.oncoveropen = function () {
            	dfd.reject("Printer cover is open.");
            };

            epos.ontimeout = function () {
            	dfd.reject("Printer is offline.");
            };

            epos.send(printData);
        }

        return dfd.promise();
    }
};

var POSTERITA_Printer = {

		getPrinterConfiguration : function() {
			//return PrinterManager.getPrinterConfiguration();

			return {
				LINE_WIDTH : 40,
				IP_ADDRESS : '192.168.0.92:8888',
				PRINTER_NAME: 'EPSON_TM-T20'

			};
		},

	    format: function (printFormat) {

	        var configuration = this.getPrinterConfiguration();

	        console.info(configuration);

	        var LINE_WIDTH = configuration.LINE_WIDTH;
	        var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);

	        var request = "";
	        /* Restore line spacing */
	        request += ESC_COMMANDS.DEFAULT_LINE_SPACING;

	        for (var i = 0; i < printFormat.length; i++) {
	            var line = printFormat[i];

	            if (line.length == 1) {
	                var command = line[0];

	                switch (command) {
	                case 'FEED':
	                    request += ESC_COMMANDS.LINE_FEED;
	                    break;

	                case 'SEPARATOR':
	                    request += LINE_SEPARATOR;
	                    request += ESC_COMMANDS.LINE_FEED;
	                    break;

	                case 'CENTER':
	                    request += ESC_COMMANDS.CENTER_ALIGN;
	                    break;

	                case 'LEFT':
	                    request += ESC_COMMANDS.LEFT_ALIGN;
	                    break;

	                case 'RIGHT':
	                    request += ESC_COMMANDS.RIGHT_ALIGN;
	                    break;

	                case 'SIGNATURE':

	                    var canvas = document.getElementById("signature-canvas");
	                    if (canvas) {
	                        var imageBase64 = canvas.toDataURL();
	                        request = request + "<image>" + imageBase64 + "<image>";
	                    } else {
	                        request += (ESC_COMMANDS.FONT_NORMAL_BOLD + JSReceiptUtils.format(I18n.t("Signature") + ":________________________________________________", LINE_WIDTH));
	                    }

	                    request += ESC_COMMANDS.LINE_FEED;
	                    break;

	                case 'PAPER_CUT':
	                    request += ESC_COMMANDS.PAPER_CUT;
	                    request += ESC_COMMANDS.LINE_FEED;
	                    break;

	                case 'OPEN_DRAWER':
	                    request += ESC_COMMANDS.OPEN_DRAWER;
	                    break;

	                case 'NVRAM':
	                    request += ESC_COMMANDS.NVRAM;
	                    break;

	                }



	            } else {
	                var font = line[0];
	                var text = line[1];

	                if (text == null) continue;

	                if (line.length > 2) {
	                    var label = line[2];
	                    text = label + text;
	                }

	                switch (font) {
	                    /*normal*/
	                case 'N':
	                    request += ESC_COMMANDS.FONT_NORMAL;
	                    break;

	                    /*bold*/
	                case 'B':
	                    request += ESC_COMMANDS.FONT_NORMAL_BOLD;
	                    break;

	                    /*invert*/
	                case 'I':
	                    request += ESC_COMMANDS.FONT_NORMAL;
	                    break;

	                    /*underline*/
	                case 'U':
	                    request += ESC_COMMANDS.FONT_NORMAL;
	                    break;

	                    /*small*/
	                case 'S':
	                    request += ESC_COMMANDS.FONT_SMALL;
	                    break;

	                    /*header 1*/
	                case 'H1':
	                    request += ESC_COMMANDS.FONT_H1;
	                    break;

	                    /*header 2*/
	                case 'H2':
	                    request += ESC_COMMANDS.FONT_H2;
	                    break;

	                    /*header 3*/
	                case 'H3':
	                    request += ESC_COMMANDS.FONT_H3;
	                    break;

	                    /*header 4*/
	                case 'H4':
	                    request += ESC_COMMANDS.FONT_H4;
	                    break;


	                case 'BARCODE':

	                    var barcodeLengthMap = ['\x04', '\x05', '\x06', '\x07', '\x08', '\x09', '\x0A', '\x0B', '\x0C', '\x0D', '\x0E', '\x0F'];
	                    var barcodeLength = barcodeLengthMap[text.length - 4];
	                    var barcode = '\x1D' + 'h' + '\x64' + '\x1D' + 'w' + '\x02' + '\x1D' + 'H' + '\x02' + '\x1D' + 'k' + '\x45' + barcodeLength + text;

	                    request += ESC_COMMANDS.LINE_FEED;
	                    request += barcode;
	                    /* override barcode text */
	                    text = "";
	                    break;

	                case 'CANVAS':
	                    var canvas = text;
	                    var imageBase64 = canvas.toDataURL();
	                    request = request + "<image>" + imageBase64 + "<image>";
	                    text = "";
	                    break;

		            case 'IMG':
		                var imageBase64 = text;
		                request = request + "<image>" + imageBase64 + "<image>";
		                text = "";
		                break;

		            }


	                request += text;
	                request += ESC_COMMANDS.LINE_FEED;

	            }
	        }

	        return request;
	    },

	    print: function(printData) {

	    	var configuration = this.getPrinterConfiguration();

	    	var dfd = new jQuery.Deferred();

	        var base64encodedstr = Base64.encode(printData);

	        /*
	        //use xmlhttprequest driectly
	        var xhttp;
	        if (window.XMLHttpRequest) {
	            xhttp = new XMLHttpRequest();
	            } else {
	            // code for IE6, IE5
	            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	        }

	        xhttp.onreadystatechange = function() {
	        	  if (xhttp.readyState == 4 && xhttp.status == 200) {

	        	    dfd.resolve(xhttp.responseText);
	        	  }
	        	  else
	        	  {
	        		  dfd.reject(xhttp.responseText);
	        	  }
	        };

	        var ip = configuration.IP_ADDRESS;

	        xhttp.open("POST", "http://" + ip + "/printing/", true);
	        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	        var postData = "action=print&printer=" + encodeURIComponent(configuration.PRINTER_NAME) + "&job=" + encodeURIComponent(base64encodedstr);

	        xhttp.send(postData);
	        */

	        var ip = configuration.IP_ADDRESS;

	        jQuery.post( "http://" + ip + "/printing/", { action: "print", printer: configuration.PRINTER_NAME, job: base64encodedstr } )
	        .done(function(){
	        	dfd.resolve();
	        })
	        .fail(function(){
	        	dfd.reject();
	        });

	        return dfd.promise();

	    },

	    getPrinters: function() {

	        var dfd = new jQuery.Deferred();

	        var configuration = this.getPrinterConfiguration();
	        var ip = configuration.IP_ADDRESS;

	        jQuery.get("http://" + ip + "/printing/", {
	                action: "getPrinters"
	            },
	            function(json, textStatus, jqXHR) {

	                if (json == null || jqXHR.status != 200) {
	                    dfd.reject('Failed to get printers');
	                    return;
	                }

	                dfd.resolve(json);

	            },

	            "json").fail(function() {
	            console.error('Failed to get printers');
	        });

	        return dfd.promise();
	    }

	};

/*=== EMV error receipt formatting ===*/
PrinterManager.getEMVErrorReceiptPrintFormat = function ( response ) {

    var configuration = this.getPrinterConfiguration();

    var LINE_WIDTH = this.getLineWidth();
    var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);

    var cursymbol = '$';

    var printFormat = [

       ['FEED'],
       ['CENTER'],

       ['H4', '** DECLINED **' ]
    ];

    var payment = response;

    var emvInfo = payment.AdditionalParameters.EMV;

	payment.isEMV = true;
	payment.ExpDate = emvInfo.CardInformation.CardExpiryDate;

	payment.AID = emvInfo.ApplicationInformation.Aid;
	payment.ApplicationLabel = emvInfo.ApplicationInformation.ApplicationLabel;

	payment.CryptogramType = emvInfo.ApplicationCryptogram.CryptogramType;
	payment.Cryptogram = emvInfo.ApplicationCryptogram.Cryptogram;

	payment.PINStatement = emvInfo.PINStatement;

	var s = payment.PaymentType + ' ' + payment.TransactionType + ' ' + cursymbol +   Number(payment.amount).toFixed(2);
	printFormat.push(['B', JSReceiptUtils.format(s, LINE_WIDTH) ]);

	printFormat.push(['N', '']);

	//Merchant ID
	printFormat.push(['N', JSReceiptUtils.format('Merchant ID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.MerchantId , 20, true)]);

	//Auth Code
	if( payment.AuthCode )
	{
		printFormat.push(['N', JSReceiptUtils.format('Auth Code', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AuthCode , 20, true)]);
	}
	else
	{
		printFormat.push(['N', JSReceiptUtils.format('Approval Code', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AuthorizationCode , 20, true)]);
	}


	//Ref No
	if( payment.RefID )
    	printFormat.push(['N', JSReceiptUtils.format('Ref ID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.RefID , 20, true)]);


	//Transaction Id
	if( payment.TransactionID )
		printFormat.push(['N', JSReceiptUtils.format('Transaction ID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.TransactionID , 20, true)]);

	//Card Brand
	printFormat.push(['N', JSReceiptUtils.format('Card brand', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.PaymentType , 20, true)]);

	//PAN
	printFormat.push(['N', JSReceiptUtils.format('PAN', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AccountNumber , 20, true)]);

	if( payment.PaymentType == 'AMEX' && payment.isEMV == true ){

		//Expiration Date
		printFormat.push(['N', JSReceiptUtils.format('Exp. Date', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.ExpDate , 20, true)]);

	}

	//Entry Mode
	printFormat.push(['N', JSReceiptUtils.format('Entry Mode', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.EntryMode , 20, true)]);

	//EMV Compliance
	//AID
	printFormat.push(['N', JSReceiptUtils.format('AID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AID , 20, true)]);

	//Application Label
	printFormat.push(['N', JSReceiptUtils.format('Application Label', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.ApplicationLabel , 20, true)]);

	//Cryptogram
	printFormat.push(['N', JSReceiptUtils.format('Cryptogram', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.Cryptogram , 20, true)]);

	//CryptogramType
	printFormat.push(['N', JSReceiptUtils.format('Cryptogram Type', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.CryptogramType , 20, true)]);

	//PINStatement
	printFormat.push(['N', JSReceiptUtils.format('PIN Statement', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.PINStatement , 20, true)]);

	printFormat.push(['N', '']);
	printFormat.push(['N', '']);

    printFormat.push(['PAPER_CUT']);

    var format = [];
	format.push(['CENTER']);
	format.push(['N', '']);
	format.push(['H2', '** Customer Copy **']);
	format.push(['N', '']);
	format.push(['N', '']);
	format = format.concat(printFormat);

	format.push(['N', '']);
	format.push(['H2', '** Merchant Copy **']);
	format.push(['N', '']);
	format.push(['N', '']);
	format = format.concat(printFormat);

	printFormat = format;

	return printFormat;
};

/*=== receipt formatting ===*/
PrinterManager.getReceiptPrintFormat = function ( order, openDrawer ) {

    var configuration = this.getPrinterConfiguration();

    var LINE_WIDTH = this.getLineWidth();
    var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);


    var receiptTitle = 'Receipt';
    var docStatusName = 'Completed';
    var paymentRuleName = 'Cash';

    var store_name = order['store_name'];
    var user_name = order['user_name'];
    var terminal_name = order['terminal_name'];
    var customer_name = order['customer_name'];

    var location = order['location'];
    var dateOrdered = order['dateorderedfull'];

    var account = order['account'];

    var printFormat = [

       ['FEED'],
       ['CENTER'],

       ['H4', account.businessname ]
    ];

    if( location &&  location.length > 0 ){
    	printFormat.push( ['B', location ] );
    }

    if( account.phone1 &&  account.phone1.length > 0 ){
    	printFormat.push( ['B', 'Tel: ' + account.phone1 ] );
    }

    if( account.website &&  account.website.length > 0 ){
    	printFormat.push( ['B', account.website ] );
    }

    var orderHeader = [

       ['N', LINE_SEPARATOR ],

       ['H4', 'ORDER# ' + order.documentno ],

       ['N', JSReceiptUtils.format(dateOrdered, LINE_WIDTH)],
       ['N', JSReceiptUtils.format('Employee: ' + user_name, LINE_WIDTH)],
       ['N', JSReceiptUtils.format('Terminal: ' + terminal_name, LINE_WIDTH)],
       ['N', JSReceiptUtils.format('Customer' + ': ' + customer_name, LINE_WIDTH)],

       ['N', LINE_SEPARATOR ]

      ];

    printFormat = printFormat.concat( orderHeader );


    var PRICE_SIZE = 10;
    var QTY_SIZE = 5;

    var OFFSET;

    var text, line;

    /* add order body */
    for (var i = 0; i < order.lines.length; i++) {

        line = order.lines[i];

        OFFSET = "       ".substring(0, (line.qtyentered + 'x ').length);

        text = line.qtyentered + 'x ' + line.name;
        text = JSReceiptUtils.format(text, LINE_WIDTH - PRICE_SIZE) + JSReceiptUtils.format(Number(line.lineamt).toFixed(2), PRICE_SIZE, true);

        printFormat.push(['N', text]);

        if (line.boms != null)
            for (var j = 0; j < line.boms.length; j++) {
                var bom = line.boms[j];

                text = " " + bom.qtyentered  + 'x ' +  bom.name;
                text = JSReceiptUtils.format(text, LINE_WIDTH - PRICE_SIZE) + JSReceiptUtils.format(Number(bom.lineamt).toFixed(2), PRICE_SIZE, true);

                printFormat.push(['N', text]);

            }

        if (line.modifiers != null)
        for (var j = 0; j < line.modifiers.length; j++) {
            var modifier = line.modifiers[j];

            text = OFFSET + modifier.name;
            text = JSReceiptUtils.format(text, LINE_WIDTH - PRICE_SIZE) + JSReceiptUtils.format(Number(modifier.lineamt).toFixed(2), PRICE_SIZE, true);

            printFormat.push(['N', text]);
        }

        if (line.discountamt > 0) {
        	var discountMessage = "Discount(" + Number(line.discountpercentage).toFixed(2) + "%). Saved $" + Number(line.discountamt).toFixed(2);
            printFormat.push(['N', JSReceiptUtils.format(discountMessage, LINE_WIDTH)]);
        }
    }

    /* add order total*/
    printFormat.push(['N', LINE_SEPARATOR]);

    var cursymbol = '$';



    /*
    for (var j = 0; j < receipt.taxes.length; j++) {
        var tax = receipt.taxes[j];
        var taxStr = JSReceiptUtils.format('Tax - ' + tax.name + ' (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(tax.amt).toFixed(3), 12, true);
        printFormat.push(['N', taxStr]);

    }
    */

    var subTotalStr = JSReceiptUtils.format('Sub Total (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(order.subtotal).toFixed(2), 12, true);
    var taxTotalStr = JSReceiptUtils.format('Sales Tax (' + cursymbol + ')',LINE_WIDTH-12) + JSReceiptUtils.format(Number(order.taxtotal).toFixed(2),12,true);
    var discountStr = JSReceiptUtils.format('Discount (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(order.discountamt).toFixed(2), 12, true);
    var totalStr = JSReceiptUtils.format('Grand Total (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(order.grandtotal).toFixed(2), 12, true)

    printFormat.push(['N', subTotalStr]);
    printFormat.push(['N', taxTotalStr]);

    if (order.discountamt > 0) {
        printFormat.push(['N', discountStr]);
    }

    printFormat.push(['N', LINE_SEPARATOR]);
    printFormat.push(['B', totalStr]);
    printFormat.push(['N', LINE_SEPARATOR]);
    printFormat.push(['N', '']);

    if( order.paymenttype == 'CASH' ){

    	if(order.payments.length > 0 ){

    		var tendered = order.tendered;
    		var change = order.change;

    		var s = JSReceiptUtils.format('Cash (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(tendered).toFixed(2), 12, true);
    		printFormat.push(['N', s]);

    		s = JSReceiptUtils.format('Change (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(change).toFixed(2), 12, true);
    		printFormat.push(['B', s]);

    	}
    }
    else
    {
    	/*
    	var paymentAmtStr = JSReceiptUtils.format('Amt Paid (' + cursymbol + ')', LINE_WIDTH - 12) + JSReceiptUtils.format(Number(order.grandtotal).toFixed(2), 12, true);
        printFormat.push(['B', paymentAmtStr]);
        */
    	var payment = order.payments[0];
    	payment.isEMV = false;

    	if( payment.AdditionalParameters && payment.AdditionalParameters.EMV ){

    		var emvInfo = payment.AdditionalParameters.EMV;

    		payment.isEMV = true;
    		payment.ExpDate = emvInfo.CardInformation.CardExpiryDate;

    		payment.AID = emvInfo.ApplicationInformation.Aid;
    		payment.ApplicationLabel = emvInfo.ApplicationInformation.ApplicationLabel;

    		payment.CryptogramType = emvInfo.ApplicationCryptogram.CryptogramType;
    		payment.Cryptogram = emvInfo.ApplicationCryptogram.Cryptogram;

    		payment.PINStatement = emvInfo.PINStatement;

    	}

    	//Show discount if any
    	if(order.discounts.length > 0){

    		var discount = null;

    		for( var i = 0; i < order.discounts.length; i++ ){

    			discount = order.discounts[i];

    			var s = JSReceiptUtils.format(discount['Message'], LINE_WIDTH - 12) + JSReceiptUtils.format(discount['Amount'], 12, true);
    			printFormat.push(['B', JSReceiptUtils.format(s, LINE_WIDTH) ]);
    		}

    		printFormat.push(['N', '']);
    	}

    	//Check tip
    	if( order.tipamt > 0){

    		var c = 'Tip ' + cursymbol +   Number(order.tipamt).toFixed(2);
        	printFormat.push(['B', JSReceiptUtils.format(c, LINE_WIDTH) ]);
    	}

    	//Check cashback
    	if( order.cashback > 0){

    		var c = 'Cashback ' + cursymbol +   Number(order.cashback).toFixed(2);
        	printFormat.push(['B', JSReceiptUtils.format(c, LINE_WIDTH) ]);
    	}

    	//Check surcharge
    	if( order.surcharge > 0){

    		var c = 'Surcharge ' + cursymbol +   Number(order.surcharge).toFixed(2);
        	printFormat.push(['B', JSReceiptUtils.format(c, LINE_WIDTH) ]);
    	}

    	//Check donation
    	if( order.donation > 0){

    		var c = 'Donation ' + cursymbol +   Number(order.donation).toFixed(2);
        	printFormat.push(['B', JSReceiptUtils.format(c, LINE_WIDTH) ]);
    	}


    	printFormat.push(['N', '']);
    	var s = payment.PaymentType + ' ' + payment.TransactionType + ' ' + cursymbol +   Number(payment.amount).toFixed(2);
    	printFormat.push(['B', JSReceiptUtils.format(s, LINE_WIDTH) ]);

    	printFormat.push(['N', '']);

    	//Merchant ID
    	printFormat.push(['N', JSReceiptUtils.format('Merchant ID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.MerchantId , 20, true)]);

    	//Auth Code
    	if( payment.AuthCode )
    	{
    		printFormat.push(['N', JSReceiptUtils.format('Auth Code', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AuthCode , 20, true)]);
    	}
    	else
    	{
    		printFormat.push(['N', JSReceiptUtils.format('Approval Code', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AuthorizationCode , 20, true)]);
    	}


    	//Ref No
    	if( payment.RefID )
        	printFormat.push(['N', JSReceiptUtils.format('Ref ID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.RefID , 20, true)]);


    	//Transaction Id
    	if( payment.TransactionID )
    		printFormat.push(['N', JSReceiptUtils.format('Transaction ID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.TransactionID , 20, true)]);

    	//Card Brand
    	printFormat.push(['N', JSReceiptUtils.format('Card brand', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.PaymentType , 20, true)]);

    	//PAN
    	printFormat.push(['N', JSReceiptUtils.format('PAN', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AccountNumber , 20, true)]);

    	if( payment.PaymentType == 'AMEX' && payment.isEMV == true ){

    		//Expiration Date
    		printFormat.push(['N', JSReceiptUtils.format('Exp. Date', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.ExpDate , 20, true)]);

    	}

    	//Entry Mode
    	printFormat.push(['N', JSReceiptUtils.format('Entry Mode', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.EntryMode , 20, true)]);

    	//EMV Compliance
    	if( payment.isEMV == true ){

    		//AID
    		printFormat.push(['N', JSReceiptUtils.format('AID', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.AID , 20, true)]);

    		//Application Label
    		printFormat.push(['N', JSReceiptUtils.format('Application Label', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.ApplicationLabel , 20, true)]);

    		//Cryptogram
    		printFormat.push(['N', JSReceiptUtils.format('Cryptogram', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.Cryptogram , 20, true)]);

    		//CryptogramType
    		printFormat.push(['N', JSReceiptUtils.format('Cryptogram Type', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.CryptogramType , 20, true)]);

    		//PINStatement
    		printFormat.push(['N', JSReceiptUtils.format('PIN Statement', LINE_WIDTH - 20) + JSReceiptUtils.format( payment.PINStatement , 20, true)]);

    	}

    	printFormat.push(['N', '']);

        printFormat.push(['N', JSReceiptUtils.format( 'I agree to pay above total amount' , LINE_WIDTH)]);
        printFormat.push(['N', JSReceiptUtils.format( 'according to card issuer agreement' , LINE_WIDTH)]);
        printFormat.push(['N', JSReceiptUtils.format( '(merchant agreement if credit voucher)' , LINE_WIDTH)]);

        printFormat.push(['N', '']);

        printFormat.push(['N', JSReceiptUtils.format('x________________________________________________________________________', LINE_WIDTH)]);

        printFormat.push(['N', JSReceiptUtils.format( payment.Cardholder , LINE_WIDTH) ]);

        printFormat.push(['N', '']);

        printFormat.push(['N', 'Please retain this copy for your records.']);

    }


    printFormat.push(['N', '']);

    printFormat.push(['N', 'All sales are final. No refunds or exchanges.']);

    printFormat.push(['N', '']);

    printFormat.push(['N', 'Thank you.']);

    printFormat.push(['N', '']);

    printFormat.push(['PAPER_CUT']);


    if(order.paymenttype != 'CASH'){

    	var format = [];
    	format.push(['CENTER']);
    	format.push(['N', '']);
    	format.push(['H2', '** Customer Copy **']);
    	format.push(['N', '']);
    	format.push(['N', '']);
    	format = format.concat(printFormat);

    	format.push(['N', '']);
    	format.push(['H2', '** Merchant Copy **']);
    	format.push(['N', '']);
    	format.push(['N', '']);
    	format = format.concat(printFormat);

    	printFormat = format;
    }

    /* open cash drawer */
    if (openDrawer != null && openDrawer == true) {
        var openDrawerFormat = [
            ['OPEN_DRAWER']
        ];
        openDrawerFormat = openDrawerFormat.concat(printFormat);
        printFormat = openDrawerFormat;
    }

    /* RA Cellular */
    if( order.vouchers && order.vouchers.length > 0 ){

    	var voucher = null;

    	for(var i=0; i<order.vouchers.length; i++){

    		voucher = order.vouchers[i];
    		printFormat.push(['N', voucher + '\n']);

    	}
    	
    	printFormat.push(['PAPER_CUT']);


    }

    return printFormat;
};


PrinterManager.getKitchenReceiptPrintFormat = function (order, openDrawer) {


    var configuration = this.getPrinterConfiguration();

    var LINE_WIDTH = this.getLineWidth();
    var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);


    var store_name = order['store_name'];
    var user_name = order['user_name'];
    var terminal_name = order['terminal_name'];
    var customer_name = order['customer_name'];

    var location = order['location'];
    var dateOrdered = order['dateorderedfull'];

    var receiptTitle = 'Receipt';
    var docStatusName = 'Completed';
    var paymentRuleName = 'Cash';

    var printFormat = [

       ['FEED'],
       ['CENTER'],

       ['H1', '* KITCHEN COPY *' ],

       ['N', LINE_SEPARATOR ],

       ['H1', '#' + order.documentno ],

       ['N', JSReceiptUtils.format(dateOrdered, LINE_WIDTH)],
       ['N', JSReceiptUtils.format('Employee: ' + user_name, LINE_WIDTH)],
       ['N', JSReceiptUtils.format('Terminal: ' + terminal_name, LINE_WIDTH)],
       ['N', JSReceiptUtils.format('Customer' + ': ' + customer_name, LINE_WIDTH)],

       ['N', LINE_SEPARATOR ]

      ];


    var QTY_SIZE = 5;

    var OFFSET;

    var text, line;

    /* add order body */
    for (var i = 0; i < order.lines.length; i++) {

        line = order.lines[i];

        OFFSET = "       ".substring(0, (line.qtyentered + 'x ').length);

        text = line.qtyentered + 'x ' + line.name;
        text = JSReceiptUtils.format(text, LINE_WIDTH);

        printFormat.push(['N', text]);

        if (line.boms != null)
            for (var j = 0; j < line.boms.length; j++) {
                var bom = line.boms[j];

                text = " " + bom.qtyentered  + 'x ' +  bom.name;
                text = JSReceiptUtils.format(text, LINE_WIDTH);

                printFormat.push(['N', text]);

            }

        if (line.modifiers != null)
        for (var j = 0; j < line.modifiers.length; j++) {
            var modifier = line.modifiers[j];

            text = OFFSET + modifier.name;
            text = JSReceiptUtils.format(text, LINE_WIDTH);

            printFormat.push(['N', text]);
        }

        if (line.note != null && line.note.length > 0) {
        	printFormat.push(['N', JSReceiptUtils.format('Note: ' + line.note, LINE_WIDTH)]);
        }
    }

    /* add order total*/
    printFormat.push(['N', LINE_SEPARATOR]);
    printFormat.push(['B', 'No of items: ' + order.qtytotal]);
    printFormat.push(['N', LINE_SEPARATOR]);

    if(order.note && order.note.length > 0){
    	printFormat.push(['N', JSReceiptUtils.format('Note: ' + order.note, LINE_WIDTH)]);
    }

    printFormat.push(['N', '']);

    printFormat.push(['PAPER_CUT']);

    return printFormat;

};

PrinterManager.getTillPrintFormat = function( till ) {

	var configuration = this.getPrinterConfiguration();

    var LINE_WIDTH = this.getLineWidth();
    var LINE_SEPARATOR = JSReceiptUtils.replicate('-', LINE_WIDTH);

 	var storeName  = till["store_name"];
  	var terminalName  = till["terminal_name"];

 	var salesRep_open_name = till["openby_name"];
	var salesRep_close_name = till["closeby_name"];

	var openingDate = till["openingdatefull"];
	var closingDate = till["closingdatefull"];

	var beginningBalance = new Number(till.openingamt).toFixed(2);

	var cashAmt = new Number(till.cashamt).toFixed(2);
	var adjustmentTotal = new Number(till.adjustmenttotal).toFixed(2);
	/*
	var cardAmt = new Number(till.card).toFixed(2);
	var chequeAmt = new Number(till.cheque).toFixed(2);
	var externalCreditCardAmt = new Number(till.ext_card).toFixed(2);
	var voucherAmt = new Number(till.voucher).toFixed(2);
	var giftAmt = new Number(till.gift).toFixed(2);
	var loyaltyAmt = new Number(till.loyalty).toFixed(2);
	*/


	var endingBalance = new Number(till.openingamt + till.cashamt + till.adjustmenttotal).toFixed(2);

	var cashAmtEntered = new Number(till.closingamt).toFixed(2);
	var cashDifference = new Number(till.closingamt - (till.openingamt + till.cashamt + till.adjustmenttotal)).toFixed(2);


	var grandTotal = new Number(till.grandtotal).toFixed(2);
	var taxTotal = new Number(till.taxtotal).toFixed(2);
	var subTotal = new Number(till.subtotal).toFixed(2);
	var noOfOrders = new Number(till.nooforders).toFixed(0);
	var discountTotal = new Number(till.discounttotal).toFixed(2);


  	var printFormat = [
            ['FEED'],
            ['CENTER'],
            ['N',LINE_SEPARATOR],
            ['H1', 'Close Till Receipt'],
            ['N',LINE_SEPARATOR],
            ['B',JSReceiptUtils.format(("Vehicle:"),10) + JSReceiptUtils.format((storeName),LINE_WIDTH-10,true)],
            ['B',JSReceiptUtils.format(("Terminal:"),10) + JSReceiptUtils.format((terminalName),LINE_WIDTH-10,true)],
            ['N',JSReceiptUtils.format(("Open By:"),10) + JSReceiptUtils.format(salesRep_open_name, LINE_WIDTH-10, true)],
            ['N',JSReceiptUtils.format(("Close By:"),10) + JSReceiptUtils.format(salesRep_close_name, LINE_WIDTH-10, true)],
            ['N',JSReceiptUtils.format(("Opened:"),LINE_WIDTH-22) + JSReceiptUtils.format((openingDate),22, true)],
            ['N',JSReceiptUtils.format(("Closed:"),LINE_WIDTH-22) + JSReceiptUtils.format((closingDate),22, true)],
            ['N',LINE_SEPARATOR],

            ['N',JSReceiptUtils.format(("Beginning Balance:"),LINE_WIDTH-10) + JSReceiptUtils.format((beginningBalance),10, true)],
            ['N',JSReceiptUtils.format(("Cash Sales:"),LINE_WIDTH-10) + JSReceiptUtils.format((cashAmt),10, true)],
            ['N',JSReceiptUtils.format(("Cash Adjustments:"),LINE_WIDTH-10) + JSReceiptUtils.format((adjustmentTotal),10, true)],
            ['N',LINE_SEPARATOR],
            ['B',JSReceiptUtils.format(("Expected Balance:"),LINE_WIDTH-10) + JSReceiptUtils.format((endingBalance),10, true)],
            ['N',LINE_SEPARATOR],
            ['N',JSReceiptUtils.format(("Cash Amount Entered:"),LINE_WIDTH-10) + JSReceiptUtils.format((cashAmtEntered),10, true)],
            ['B',JSReceiptUtils.format(("Cash Difference:"),LINE_WIDTH-10) + JSReceiptUtils.format((cashDifference),10, true)],
            ['N',LINE_SEPARATOR],

            /*
            ['FEED'],

            ['N',JSReceiptUtils.format(("Credit Card Amount:"),LINE_WIDTH-10) + JSReceiptUtils.format((cardAmt),10, true)],
            ['N',JSReceiptUtils.format(("Cheque Amount:"),LINE_WIDTH-10) + JSReceiptUtils.format((chequeAmt),10, true)],
            ['N',JSReceiptUtils.format(("External Credit Card Amount:"),LINE_WIDTH-10) + JSReceiptUtils.format((externalCreditCardAmt),10, true)],
            ['N',JSReceiptUtils.format(("Voucher Amount:"),LINE_WIDTH-10) + JSReceiptUtils.format((voucherAmt),10, true)],
            ['N',JSReceiptUtils.format(("Gift Card Amount:"),LINE_WIDTH-10) + JSReceiptUtils.format((giftAmt),10, true)],
            ['N',JSReceiptUtils.format(("Loyalty Amount:"),LINE_WIDTH-10) + JSReceiptUtils.format((loyaltyAmt),10, true)],
            */

            ['FEED'],
            ['N',LINE_SEPARATOR],

            ['H1', 'Summary'],
            ['N',LINE_SEPARATOR],

            ['B',JSReceiptUtils.format(("Total Gross Sales:"),LINE_WIDTH-10) + JSReceiptUtils.format((grandTotal),10,true)],
            ['B',JSReceiptUtils.format(("Total Tax:"),LINE_WIDTH-10) + JSReceiptUtils.format((taxTotal),10,true)],
            ['B',JSReceiptUtils.format(("Total Net Sales:"),LINE_WIDTH-10) + JSReceiptUtils.format((subTotal),10,true)],
            ['B',JSReceiptUtils.format(("Total Discount Given:"),LINE_WIDTH-10) + JSReceiptUtils.format((discountTotal),10,true)],
            ['B',JSReceiptUtils.format(("Total No of Orders:"),LINE_WIDTH-10) + JSReceiptUtils.format((noOfOrders),10,true)],
            /*
            ['B',JSReceiptUtils.format(("Total No of Returns:"),LINE_WIDTH-10) + JSReceiptUtils.format((noOfReturns),10,true)],
            */

            ['N', '']
  	];
  	
  	//RA Cellular integration
  	var keys = Object.keys(till.vouchers);
  	if(keys.length > 0){
  		
  		printFormat.push(['FEED']);
  		printFormat.push(['N',LINE_SEPARATOR]);
  		printFormat.push(['H1', 'RA Cellular']);
  		printFormat.push(['N',LINE_SEPARATOR]);
  		
  		var voucher;
  		
  		for(var i=0; i<keys.length; i++){
  			
  			voucher = till.vouchers[keys[i]];
  			
  			printFormat.push(['N',JSReceiptUtils.format( voucher.qty + 'x ' + voucher.name  ,LINE_WIDTH-10) + JSReceiptUtils.format( voucher.total ,10,true)]);
  			
  		}
  	}
  	
  	printFormat.push(['FEED']);
  	printFormat.push(['FEED']);
  	printFormat.push(['PAPER_CUT']);

  	return printFormat;
};

var HTMLPrinter = {
		getHTML : function( printFormat ){
			var html = "<pre><div style='text-align:center;background-color: #F7F3F3;border: solid 1px #8C8888;width: 400px;padding-bottom: 20px;'>";

			/* parse print format */
            for (var i = 0; i < printFormat.length; i++)
            {
                var line = printFormat[i];

                if (line.length == 1)
                {
                    var command = line[0];

                    if( 'FEED' == command )
                    {
                    	html = html + '<br><br>';
                    }
                }
                else
                {
                	var font = line[0];
                    var text = line[1];

                    if (text == null) continue;

                    if (text.length == 0) text = "&nbsp;";

                    if (line.length > 2) {
                        var label = line[2];
                        text = label + text;
                    }

                    if( 'B' == font )
                    {
                    	html = html + ( '<div><strong>' + text + '</strong></div>' );
                    }
                    else if( 'H4' == font )
                    {
                    	html = html + ( '<h2>' + text + '</h2>' );
                    }
                    else
                    {
                    	html = html + ( '<div>' + text + '</div>' );
                    }

                }
            }

            html = html + '</div></pre>';

            return html;
		}
};

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = Base64._utf8_encode(input);

	    while (i < input.length) {

	        chr1 = input.charCodeAt(i++);
	        chr2 = input.charCodeAt(i++);
	        chr3 = input.charCodeAt(i++);

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	        enc4 = chr3 & 63;

	        if (isNaN(chr2)) {
	            enc3 = enc4 = 64;
	        } else if (isNaN(chr3)) {
	            enc4 = 64;
	        }

	        output = output +
	        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
	        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

	    }

	    return output;
	},

	// public method for decoding
	decode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	    while (i < input.length) {

	        enc1 = this._keyStr.indexOf(input.charAt(i++));
	        enc2 = this._keyStr.indexOf(input.charAt(i++));
	        enc3 = this._keyStr.indexOf(input.charAt(i++));
	        enc4 = this._keyStr.indexOf(input.charAt(i++));

	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;

	        output = output + String.fromCharCode(chr1);

	        if (enc3 != 64) {
	            output = output + String.fromCharCode(chr2);
	        }
	        if (enc4 != 64) {
	            output = output + String.fromCharCode(chr3);
	        }

	    }

	    output = Base64._utf8_decode(output);

	    return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
	    string = string.replace(/\r\n/g,"\n");
	    var utftext = "";

	    for (var n = 0; n < string.length; n++) {

	        var c = string.charCodeAt(n);

	        if (c < 128) {
	            utftext += String.fromCharCode(c);
	        }
	        else if((c > 127) && (c < 2048)) {
	            utftext += String.fromCharCode((c >> 6) | 192);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }
	        else {
	            utftext += String.fromCharCode((c >> 12) | 224);
	            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }

	    }

	    return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
	    var string = "";
	    var i = 0;
	    var c = c1 = c2 = 0;

	    while ( i < utftext.length ) {

	        c = utftext.charCodeAt(i);

	        if (c < 128) {
	            string += String.fromCharCode(c);
	            i++;
	        }
	        else if((c > 191) && (c < 224)) {
	            c2 = utftext.charCodeAt(i+1);
	            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	            i += 2;
	        }
	        else {
	            c2 = utftext.charCodeAt(i+1);
	            c3 = utftext.charCodeAt(i+2);
	            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }

	    }

	    return string;
	}

};

/* Pole Display */
var POLE_DISPLAY = {
	
	getPrinterConfiguration : function() {
		
		return PrinterManager.getPrinterConfiguration();
	},
	
	printTestData:function(){
    	this.display("Welcome to", "Posterita POS");
    },
   
    clearDisplay:function(){
        var printJob = PoleDisplay_ESC_COMMANDS.CLEAR;           
        this.print(printJob);
    },
   
    display:function(line1,line2){
    	/* truncate long text */
    	line1 = JSReceiptUtils.format(line1, 20); 	
    	
        /* clear display */
        var printJob = PoleDisplay_ESC_COMMANDS.CLEAR;
        printJob = printJob + line1;
       
        if(line2){
        	line2 = JSReceiptUtils.format(line2, 20);
            printJob = printJob + line2;
        }
       
        this.print(printJob);
    },
    
    print : function(printData) {
    	
    	var configuration = this.getPrinterConfiguration();
    	
    	if( !configuration.ENABLE_POLE ){
    		
    		return;
    		
    	}
    	
    	/*
    	if( POSTERITA_Bridge.isPresent() ){
    		
    		POSTERITA_Bridge.print(configuration.POLE_DISPLAY_NAME, printData);
    		
    		return;    		
    	}
    	*/
    	
        var base64encodedstr = Base64.encode(printData);
        
        /* use xmlhttprequest driectly */
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
            } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhttp.onreadystatechange = function() {
        	  if (xhttp.readyState == 4 && xhttp.status == 200) {
        	    //console.log(xhttp.responseText);
        	  }
        };
        
        xhttp.open("POST", "/printing/", false);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        var postData = "action=print&printer=" + encodeURIComponent(configuration.POLE_DISPLAY_NAME) + "&job=" + encodeURIComponent(base64encodedstr);
                
        xhttp.send(postData);
    }
    
};
