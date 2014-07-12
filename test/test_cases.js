QUnit.test("Set Options Test", function(assert){
	var response = $db.setOptions("settings");
	assert.ok(response.error, "Supplying a string for the options returns an error");
	response = $db.setOptions(opts, "Supply options objects sets options");
	assert.ok(!response.error);
});

QUnit.test("Create Table Test", function(assert){
	var response = $db.createTable({name: "books"});
	assert.ok(response.error, "Supplying invalid argument returns error");
	response = $db.createTable(tn);
	assert.ok(!response.error, "Supplying string creates table");
});

QUnit.test("Add Record", function(assert){
	var response = $db.addRecord(book1);
	assert.ok(response.error, "Missing a table name arg returns an error");
	response = $db.addRecord(tn, "book1");
	assert.ok(response.error, "String instead of an object for record args returns an error");
	response = $db.addRecord(tn, book1);
	assert.ok(!response.error, "Correct args supplied for table name and record");
	assert.ok((response.results.length === 1), "Verifying that only 1 record added");
	assert.deepEqual(response.results[0], book1, "Verifying that record added is the anticipated record");
});

QUnit.test("Remove Record", function(assert){
	var response = $db.removeRecord("0");
	assert.ok(response.error, "Missing table name returns error");
	response = $db.removeRecord(tn);
	assert.ok(response.error, "Missing record id returns error");
	response = $db.removeRecord(tn, 0);
	assert.ok(response.error, "Number instead of string for record argument returns error");
	response = $db.removeRecord(tn, "1");
	assert.ok(response.error, "Out of range record id returns error");
	response = $db.removeRecord(tn, "0");
	assert.ok(!response.error, "Proper args supplied and record removed");
	response = $db.removeRecord(tn, "0");
	assert.ok(response.error, "Trying to remove an already removed record returns an error");
	
});

QUnit.test("Add Records", function(assert){
	var response = $db.addRecords(moreBooks);
	assert.ok(response.error, "Invalid arsg (missing table name) supplied returns error");
	response = $db.addRecords(tn);
	assert.ok(response.error, "Invalid arsg (missing records) supplied returns error");
	response = $db.addRecords(tn, {});
	assert.ok(response.error, "Invalid arsg (object instead of object array) supplied returns error");
	response = $db.addRecords(tn, moreBooks);
	assert.ok(!response.error, "Proper args supplied and records added");
	assert.equal(response.results.length, moreBooks.length, "The collection returned reflects the records added.");
	response = $db.getRecords(tn, "*");
	assert.ok(!response.error, "Objects returned from getRecords");
	assert.equal(response.results.length, moreBooks.length, "Objects returned from getRecords is equal to records added");
});

QUnit.test("Get Records", function(assert){
	var response = $db.getRecords(tn, "*");
	assert.ok(!response.error, "Objects returned from getRecords wild card");
	assert.equal(response.results.length, moreBooks.length, "Objects returned from getRecords is equal to records added");
	//Record "0" was deleted, only 1-7 should be returned
	response = $db.getRecords(tn, "0", "7");
	assert.ok(!response.error, "All records return using slice idices");
	assert.equal(response.results.length, moreBooks.length, "Objects returned from getRecords via indices are equal to records added");
});

QUnit.test("Select Records", function(assert){
	var criteria = {author: "Chinua Achebe"};
	var response = $db.selectRecords(tn, criteria);
	assert.ok(!response.error, "Items returned from select records inquiry");
	//loop verifies that the items returned all have the same author
	var authorsMatched = 0;
	if (!response.error) {
		for(var i = 0; i < response.results.length; i++){
			if (response.results[i].author === criteria.author){
				authorsMatched++;
			}
		}
	}
	assert.equal(authorsMatched, response.results.length, "The items selected confirm to the search criteria");
});

QUnit.test("Get Like Records", function(assert){
	var goodBook = $db.getRecord(tn, "1");
	var response = $db.getLikeRecords(tn, goodBook.results[0]);
	assert.ok(!response.error, "Like records found");
});

QUnit.test("Get Unique Records", function(assert){
	var response = $db.getUnique(tn);
	assert.ok(!response.error, "Results returned from unique inquiry");
});

QUnit.test("Dedupe Table", function(assert){
	var allRecords = $db.getRecords(tn, "*");
	var response = $db.deDupe(tn);
	assert.ok(!response.error, "Record dedupe routine completed successfully");
	var allNewRecords = $db.getRecords(tn, "*");
	assert.ok((allRecords.results.length > 0 && allRecords.results.length > allNewRecords.results.length), "Records have been removed");
});

QUnit.test("Update Record", function(assert){
	var origRecord = $db.getRecord(tn, "7");
	var origNote = origRecord.error ? "" : (origRecord.results[0].note || "");
	var origRecommended = origRecord.error ? false : (origRecord.results[0].recommended || false);
	var bookUpdate = {recommended: true, note: "This is a must read for all middle school students."};
	var response = $db.updateRecord(tn, "7", bookUpdate);
	assert.ok(!response.error, "Update Record returned with no error");
	response = $db.getRecord(tn, "7");
	assert.ok((origNote !== response.results[0].note), "Property 1 changed");
	assert.ok((origRecommended !== response.results[0].recommended), "Property 2 changed");
	assert.equal(response.results[0].note, bookUpdate.note, "Property 1 matches update");
	assert.equal(response.results[0].recommended, bookUpdate.recommended, "Property 2 matches update");
	
});

QUnit.test("Remove Record", function(assert){
	var origRecords = $db.getRecords(tn, "*");
	var response = $db.removeRecord(tn, "7");
	assert.ok(!response.error, "Remove record returned with no error");
	response = $db.getRecords(tn, "*");
	console.log(response);
	assert.ok((response.results.length === origRecords.results.length -1), "Record was removed from table");
});

QUnit.test("Remove Records", function(assert){
	var records = ["1", "2", "3"];
	var response = $db.removeRecords(tn, records);
	assert.ok(!response.error,"Method returned with no errors");
	response = $db.getRecords(tn, "1");
	assert.ok(response.error, "record 1 not found because it was deleted");
	response = $db.getRecords(tn, "2");
	assert.ok(response.error, "record 2 not found because it was deleted");
	response = $db.getRecords(tn, "3");
	assert.ok(response.error, "record 3 not found because it was deleted");
});