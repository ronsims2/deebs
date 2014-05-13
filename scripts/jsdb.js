var options = {
        superUser: true,
        user: "rsims",
        debug: true
};

var jsdb= (function(options){
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
        
        system.debug = {
                print: function(item, label){
                    if(options.debug){
                        if (!label) {
                            label = "system debug: ";
                        }
                        console.log(label, item);
                    }
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
                },
                isNumber: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "number") {
                        response = system.response.getResponse("ok");
                    }
                    else{
                        response = system.response.getResponse("error");
                    }
                    response.results = [item];
                    return response;
                },
                areStringsSimilar: function(item1, item2){
                    var response = this.isString(item1);
                    if (!response.error) {
                        response = this.isString(item2);
                    }
                    if (!response.error) {
                        var score = 0;
                        var longestString = (item1.length > item2.length) ? item1 : item2;
                        var shortestString = (item1.length < item2.length) ? item1 : item2;
                        //test length
                        if (item1 === item2) {
                            score += 100;
                        }
                        else { 
                            if (item1.length === item2.length) {
                                score += 10;
                            }
                            else{
                                score += Math.floor((shortestString.length / longestString.length) * 10);
                            }
                          //test content similarity
                            var contentScore = 0;
                            var contentScoreMax = 0;
                            var stringCounter = (shortestString.length < 100) ? shortestString.length : 100;
                            for (var j = 0; j < stringCounter; j++){
                                contentScoreMax += 20;
                                if (shortestString[j].toLowerCase() === longestString[j].toLowerCase()){
                                    contentScore += 20;
                                }
                                if (j && stringCounter > 1) {
                                    var previousCharacter = j -1;
                                    contentScoreMax += 1;
                                    if (shortestString[j].toLowerCase() === longestString[previousCharacter].toLowerCase()){
                                        contentScore += 1;
                                    }
                                }
                                var nextCharacter = j + 1;
                                contentScoreMax += 1;
                                if (nextCharacter  < stringCounter) {
                                    if (shortestString[j].toLowerCase() === longestString[nextCharacter].toLowerCase()){
                                        contentScore += 1;
                                    }
                                }
                            }
system.debug.print(contentScore);
                            contentScore = Math.floor((contentScore / contentScoreMax) * 50);
                            score += contentScore;
system.debug.print(contentScoreMax);
                            contentScore = 0;
                            contentScoreMax = 0;
                            if(shortestString >= 6) {
                                var sliceSize = Math.floor(shortestString.length / 3);
                                var shortestStringSlice = (shortestString.slice(0, sliceSize)).toLowerCase();
                                var longestStringSlice = (longestString.slice(0, sliceSize)).toLowerCase();
                                
                                contentScoreMax += 33;
                                if (shortestStringSlice === longestStringSlice) {
                                    contentScore += 33;
                                }
system.debug.print(contentScore);
                                shortestStringSlice = (shortestString.slice(0, sliceSize * 2)).toLowerCase();
                                longestStringSlice = (longestString.slice(0, sliceSize * 2)).toLowerCase();
                                
                                contentScoreMax += 33;
                                if (shortestStringSlice === longestStringSlice) {
                                    contentScore += 33;
                                }
system.debug.print(contentScore);
                                shortestStringSlice = (shortestString.slice(0, sliceSize * 3)).toLowerCase();
                                longestStringSlice = (longestString.slice(0, sliceSize * 3)).toLowerCase();
                                
                                contentScoreMax += 33;
                                if (shortestStringSlice === longestStringSlice) {
                                    contentScore += 33;
                                }
                                contentScore = Math.floor((contentScore / contentScoreMax) * 50);
system.debug.print(contentScore);
                                score += contentScore;
                            }
                        }
system.debug.print(score);
                        if (score > 60) {
                            response = system.response.getResponse("ok");
                            response.message = "Items are similar.";
                            response.results[item1,item2];
                        }
                        else{
                            response = system.response.getResponse("error");
                            response.message = "Items are not similar.";
                            response.results[item1,item2];
                        }
                    }
                    return response;
                },
                isSimilar: function(item1, item2){
                    var score = 0;
                    var response1 = this.isArray(item1);
                    var response2 = this.isArray(item2);
                    if (!response1.error && !response2.error) {
                        score += 10;
                        if(item1.length === item2.length){
                            score += 10;
                            var counter = item1.length;
                            var arrayScore = 0;
                            for(var i = 0; i < counter; i++){
                                var stringCheck1 = this.isString(item1[i]);
                                var stringCheck2 = this.isString(item2[i]);
                                var numberCheck1 = this.isNumber(item1[i]);
                                var numberCheck2 = this.isNumber(item2[i]);
                                var arrayCheck1 = this.isArray(item1[i]);
                                var arrayCheck2 = this.isArray(item2[i]);
                                var objectCheck1 = this.isObject(item1[i]);
                                var objectCheck2 = this.isObject(item2[i]);
                                
                                if (!stringCheck1.error && !stringCheck2.error) {
                                    arrayScore += 10;
                                    var stringsCheck = areStringsSimilar(item1[i], item2[i]);
                                }
                            }
                        }
                    }
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
                        response.message = "success record added to " + tableName + ".";
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
        					response.message = "Success, record found.";
        				}
        				else {
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
        
        function removeRecord(tableName, recordId){
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isString(recordId);
                if (!response.error) {
                    recordId = parseFloat(recordId);
                    if (recordId || recordId === 0) {
                        var record = tables[tableName][recordId];
                        if (record) {
                            if(!record["_" + namespace + "_lock"]) {
                                tables[tableName][recordId] = null;
                                response = system.response.getResponse("ok");
                                response.results = [record];
                                response.message = "Success, record removed.";
                            }
                            else {
                                response = system.response.getResponse("error");
                                response.message = "The record is locked and cannot be removed.";
                            }
                        }
                        else {
                            response = system.response.getResponse("error");
                            response.message = "The record could not be found.";
                        }
                    }
                }
            }
            return response;
        }
        
        function getRecords(tableName, start, stop){
            var response = checkTableExist(tableName);
            var records = [];
            if (!response.error) {
                response = system.data.isString(start);
                if (!response.error) {
                    if (start === "*") {
                        records = tables[tableName];
                        response.message = "Success, all records retreived.";
                        response.results = records;
                    }
                    else{
                        response = system.data.isString(stop);
                        if (!response.error) {
                            var start = parseFloat(start);
                            var stop = parseFloat(stop);
                            if ((start || start === 0) && stop) {
                                if (stop > start) {
                                    var counter = tables[tableName].length;
                                    for(var i = 0; i < counter; i++){
                                        records.push(tables[tableName][i]);
                                    }
                                    response.message = "Success, " + records.length + " retreived.";
                                    response.results = records;
                                }
                                else {
                                    response = system.response.getResponse("error");
                                    error.message = "Invalid range specified.";
                                }
                            }
                            else {
                                response = system.response.getResponse("error");
                                error.message = "Invalid range specified.";
                            }
                        }
                    }
                }
            }
            return response;
        }
        
        function selectRecords(tableName, criteria){
            var response = checkTableExist(tableName);
            var records = [];
            if (!response.error) {
                response = system.data.isObject(criteria);
                if (!response.error) {
                    var counter = tables[tableName].length;
                    if (counter > 0) {
                        for(var i = 0; i < counter; i++){
                            var record = tables[tableName][i];
                            var matches = 0;
                            var properties = 0;
                            if (record) {
                                for(var param in criteria) {
                                    properties++;
                                    var recordParam = record[param];
                                    if (recordParam) {
                                        if (recordParam === criteria[param]) {
                                            matches++;
                                        }
                                    }
                                }
                            }
                            if (matches === properties) {
                                records.push(record);
                            }
                        }
                        if (records.length > 0) {
                            response.message = "Success " + records.length + " records found.";
                            response.results = records;
                        }
                        else {
                            response.message = "No records found.";
                            response.results = records;
                        }
                    }
                    else {
                        response = system.response.getResponse("error");
                        response.message = "The table is empty.";
                    }
                }
            }
            return response;
        }
        
        function searchRecords(tableName, criteria){
            var response = checkTableExist(tableName);
            var records = [];
            if (!response.error) {
                response = system.data.isObject(criteria);
                if (!response.error) {
                    var counter = tables[tableName].length;
                    if (counter > 0){
                        for(var i = 0; i < counter; i++){
                            var record = tables[tableName][i];
                            if (record) {
                                var matches = 0;
                                var properties = 0;
                                for(var param in criteria) {
                                    properties++;
                                    var recordParam = record[param];
                                    if (recordParam) {
                                        /**
                                         * @todo compare here
                                         */
                                    }
                                }
                            }
                        }
                    }
                    else {
                        response = system.response.getResponse("error");
                        response.message = "The table is empty.";
                    }
                }
            }
            return response;
        }
        
        /**
         * axternal API for db
         */
        
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
        };
        
        db.getRecord = function(tableName, recordId){
        	var response = getRecord(tableName, recordId);
            return response;
        };
        
        db.removeRecord = function(tableName, recordId){
            var response = removeRecord(tableName, recordId);
            return response;
        };
        
        db.getRecords = function(tableName, start, stop) {
            var response = getRecords(tableName, start, stop);
            return response;
        };
        
        db.selectRecords = function(tableName, criteria) {
            var response = selectRecords(tableName, criteria);
            return response;
        };
        
        if (options.superUser) {
            db.getSystem = function(){
                return system;
            };
        }
        
        return db;
    }
    
    if (!jsdb) {
         jsdb = createDB();
    }
    return jsdb;
})(options);