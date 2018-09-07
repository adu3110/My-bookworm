var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var search_string = "harry+potter";

var start_url_sapna = "https://www.sapnaonline.com/general-search?searchkey=";
//var SEARCH_WORD = "stone";
var max_books_to_visit_sapna = 5;
var numBooksVisited_sapna = 0;
var bookList_sapna = [];
//var url = new URL(START_URL);
//var baseUrl = url.protocol + "//" + url.hostname;


findBooksSapna(start_url_sapna+search_string);


//pagesToVisit.push(START_URL);


function crawlSapna() {
  if(numBooksVisited_sapna >= max_books_to_visit_sapna) {
    console.log("Reached max limit of number of books.");
    numBooksVisited_sapna = 0;
    bookList_sapna = [];
    return;
  }

  if(bookList_sapna.length === 0){
    numBooksVisited_sapna = 0;
    bookList_sapna = [];
    console.log("Searched All Books");
    return;
  }
  var nextBook = bookList_sapna.pop();

  visitBook(nextBook, crawlSapna);

}

function visitBook(bookobj, callback) {
  // Add page to our set
  //pagesVisited[url] = true;
  numBooksVisited_sapna++;

  // Make the request
  //console.log("Visiting page " + url);

  getPricesSapna(bookobj);

  callback();
}

function findBooksSapna(url){
    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
          }
         // Check status code (200 is HTTP OK)
         console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
            console.log("Status Not 200");
         }
    
        var $ = cheerio.load(body);
         // Parse the document body
         collectbookListSapna($);
        // In this short program, our callback is just calling crawlSapna()
        crawlSapna();
        
      });
}

function collectbookListSapna($) {
    var searchresults = $("#list-view-ul");
    //console.log(searchresults);
    var currlist = $(searchresults).children(".product-book-list-view");
    console.log("Found " + currlist.length + " relative links on page");
    currlist.each(function() {
        //var currimg = $(this).find(".variant-image");
        var currbook = $(this).find(".product-book-list-details");
        //console.log($(currA).attr('href'));
        bookList_sapna.push(currbook);
    });
}

function getPricesSapna($) {
    var book = {};

    var currtitle = $.find(".product-book-name").find("a").attr("title");
    var currauthor = $.find(".product-book-author").children("a").text();
    var currprice = $.find(".actual-price").text();
    currprice = currprice.replace(/[\n\r\t]/g, "");
    currprice = currprice.replace("`", "");

    var currurl = $.find(".product-book-name").find("a").attr("href");

    book.title = currtitle;
    book.author = currauthor;
    book.price = currprice;
    book.url = currurl;
    console.log(book);

}