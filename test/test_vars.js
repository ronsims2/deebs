var tn = "great_books";// table name

/**Configuration options
 * by default opts.easyMode is set to true. 
 * Set to false if you want to get Deebs style response objects returned from methods.
 */
var opts = {
    superUser: true,
    user: "librarian",
    debug: true,
    easyMode: false
};

//This represents a single record
var book1 = {
        title: "Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        rating: 10       
};

var book2 = {
        title: "The Restaurant at the End of the Universe",
        author: "Douglas Adams",
        rating: 9       
};

var book3 = {
        title: "Life, the Universe and Everything",
        author: "Douglas Adams",
        rating: 9       
};

var book4 = {
        title: "So Long, and Thanks for All the Fish",
        author: "Douglas Adams",
        rating: 9       
};

//add a bunch of records at once.
var moreBooks = [{
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    rating: 9.5,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "A Wrinkle in Time",//Duplicate
    author: "Madeleine L'Engle",
    rating: 9.5,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
},{
    title: "A Man of the People",
    author: "Chinua Achebe",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Hitchhiker's Guide to the Galaxy",//duplicate
    author: "Douglas Adams",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Adventures of Tom Sawyer",
    author: "Mark Twain",
    rating: 9.5,
    genre: "fiction",
    recommended: false,
    instock: true
}];