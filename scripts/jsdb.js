var options = {
        superUser: true,
        user: "rsims",
        debug: true
};

var jsdb= (function(window, document){
    var jsdb;
    var namespace = options.namespace || "jsdb";
    var user = options.user || "admin";
    var db = {};
    var tables = {
            tableNames: [{
                name: "tableNames",
                owner: "root"
            }]
    };
    
    function createDB(){
        var system = {};
        system.response = {
                getResponse: function(type){
                    var response = db;
                    switch(type){
                    case "warn":
                        response.error = true;
                        response.errorType = "warn";
                        break;
                    case "error":
                        response.error = true;
                        response.errorType = "error";
                        break;
                    default://ok
                        response.error = false;
                        response.errorType = null;
                        break;
                    }
                    return response;
                }
        };
        /**
         * returns {object} with results array that contains object type description.
         */
        system.data = {
                checktype: function(item){
                    var response = system.response.getResponse("ok");
                    try {
                        var itemType = Object.prototype.toString.call(item); 
                        var typeFound;
                        switch(itemType){
                            case "[object Array]":
                                typeFound = "array";
                                break;
                            case "[object Function]":
                                typeFound = "function";
                                break;
                            case "[object Null]":
                                typeFound = "null";
                                break;
                            case "[object Number]":
                                typeFound = "number";
                                break;
                            case "[object Object]":
                                typeFound = "object";
                                break;
                            case "[object RegExp]":
                                typeFound = "regexp";
                                break;
                            case "[object String]":
                                typeFound = "string";
                                break;
                            default:
                                typeFound = "undefined";
                                break;
                        }
                        response.results = [typeFound];
                    }
                    catch(error){
                        response = system.response.getResponse("error");
                        response.message = error;
                    }
                    
                    return response;
                },
                isArray: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "array") {
                        response = system.response.getResponse("ok");
                    }
                    else{
                        response = system.response.getResponse("error");
                    }
                    response.results = [item];
                    return response;
                },
                isObject: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "object") {
                        response = system.response.getResponse("ok");
                    }
                    else{
                        response = system.response.getResponse("error");
                    }
                    response.results = [item];
                    return response;
                },
                isString: function(item){
                	var response = this.checktype(item);
                    if (!response.error && response.results[0] === "string") {
                        response = system.response.getResponse("ok");
                    }
                    else{
                        response = system.response.getResponse("error");
                    }
                    response.results = [item];
                    return response;
                }
        };
        
        /**
         * @returns {array} of table names.
         */
        function getTableNames(){
            var tn = tables.tableNames;
            var counter = tn.length;
            var tableNames = [];
            for(var i = 0; i < counter; i++){
                tableNames.push(tn[i].name);
            }
            var response = system.response.getResponse("ok");
            response.results = tableNames;;
            return response;
        }
        /**
         * Checks if table name has been registered or is used by db.
         * @returns {object} that contains errors if any and {array} of table names.
         */
        function checkTableName(tableName){
            var tn = tables.tableNames;
            var counter = tn.length;
            var response = system.response.getResponse("ok");
            response.message = "This table name is ok.";
            for(var i = 0; i < counter ; i++) {
                if (tableName === tn[i].name) {
                    //check permissions to see if there should be a warning or a fail message
                    switch(tn[i].owner){
                        case "root":
                            if (options.superUser){
                                response = system.response.getResponse("warn");
                                response.message = "To use this table name enable superUser and configure the system manual. This is not advised.";
                                counter = i;
                            }
                            else {
                                response = system.response.getResponse("error");
                                response.message = "Table name already in use.";
                                counter = i;
                            }
                            break;
                        default:
                            response = system.response.getResponse("error");
                            response.message = "Table name already in use.";
                            counter = i;
                            break;
                    }
                }
            }
            //allow debug
            if (response.error) {
                if (options.debug) {
                    console.log(response.errorType + ":", response);
                }
            }
            response = getTableNames();
            return response;
        }
        /**
         * Checks only to see if table name exist, this is different from checkTablename that checks 
         * to see if tableName is available.
         * @returns {object} response from checking type and implicitly existence.
         */
        function checkTableExist(tableName){
            var response = system.data.isArray(tables[tableName]);
            return response;
        }
        
        function getTable(tableName){
            var response = checkTableExist(tableName);
            if (!response.error) {
                response.results = tables[tableName];
            }
            return response;
        }
        
        function getNewRecordId(tableName){
            var response = getTable(tableName);
            if (!response.error){
                var newRecordId = response.results.length;
                response.results = [newRecordId.toString()];
            }
            return response;
        }
        
        /**
         * Adds table entry on table object
         * @returns {object} response with 
         */
        function createTable(tableName){
            var response = checkTableName(tableName);
            if (!response.error) {
                var newTable = {
                        name: tableName,
                        owner:user
                };
                tables.tableNames.push(newTable);
                tables[tableName] = [];
                
                response = getTableNames();
            }
            return response;
        }
        
        function initRecord(record, recordId, lock){
            var response = system.data.isObject(record);
            if (!response.error) {
            	if (!lock) {
            		lock = false;
            	}
                record["_" + namespace + "_id"] = recordId;
                record["_" + namespace + "_lock"] = lock;
                response.results[record];
            }
            return response;
        }
        
        /**
         * Formats and adds record to table if it exist.
         * @returns formatted record.
         */
        function addRecord(tableName, record, lock) {
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isObject(record);
                if (!response.error){
                    response = getNewRecordId(tableName);
                    if (!response.error) {
                    	var recordId = response.results[0];
                    	response = initRecord(record, recordId, false);
                    }
                    if (!response.error) {
                        record = response.results[0];
                        tables[tableName].push(record);
                    }
                }
            }
            return response;
        }
        
        function getRecord(tableName, recordId){
        	var response = checkTableExist(tableName);
        	if (!response.error){
        		response = system.data.isString(recordId);
        		if (!response.error) {
        			recordId = parseFloat(recordId);
        			if (recordId || recordId === 0) {
        				var record = tables[tableName][recordId];
        				if (record) {
        					response = system.response.getResponse("ok");
        					response.results = [record];
        					response.message = "Success, record found."
        				}
        				else{
        					response = system.response.getResponse("error");
        					response.message = "The record could not be found.";
        				}
        			}
        			else {
        				response = system.response.getResponse("error");
        				response.message = "the record ID is improperly formatted.";
        			}
        		}
        	}
        	return response;
        }
        
        db.getTableNames = function(){
            var response =  getTableNames();
            return response;
        };
        
        db.checkTableName = function(tableName){
            var response = checkTableName(tableName);
            return response;
        };
        
        db.createTable = function(tableName){
            var response = createTable(tableName);
            return response;
        };
        db.addRecord = function(tableName, record, lock){
            var response = addRecord(tableName, record, lock);
            return response;
        },
        db.getRecord = function(tableName, recordId){
        	var response = getRecord(tableName, recordId);
            return response;
        }
        
        return db;
    }
    
    if (!jsdb) {
         jsdb = createDB();
    }
    return jsdb;
})( window, document, options);