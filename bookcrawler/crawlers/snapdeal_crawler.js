var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var search_string = "harry+potter";

var start_url_snapdeal = "https://www.snapdeal.com/search?keyword=";
//var SEARCH_WORD = "stone";
var max_books_to_visit_snapdeal = 5;

//var pagesVisited = {};
var numBooksVisited_snapdeal = 0;
var bookList_snapdeal = [];
//var url = new URL(start_url_snapdeal);
//var baseUrl = url.protocol + "//" + url.hostname;


findBooksSnapdeal(start_url_snapdeal + search_string);


//pagesToVisit.push(start_url_snapdeal);


function crawlSnapdeal() {
  if(numBooksVisited_snapdeal >= max_books_to_visit_snapdeal) {
    console.log("Reached max limit of number of books.");
    numBooksVisited_snapdeal = 0;
    bookList_snapdeal = [];
    return;
  }

  if(bookList_snapdeal.length === 0){
    console.log("Searched All Books");
    numBooksVisited_snapdeal = 0;
    bookList_snapdeal = [];
    return;
  }
  var nextBook = bookList_snapdeal.pop();

  visitBookSnapdeal(nextBook, crawlSnapdeal);

}

function visitBookSnapdeal(bookobj, callback) {
  // Add page to our set
  //pagesVisited[url] = true;
  numBooksVisited_snapdeal++;

  // Make the request
  //console.log("Visiting page " + url);

  getPricesSnapdeal(bookobj);

  callback();
}

function findBooksSnapdeal(url){
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
         collectbookListSnapdeal($);
        // In this short program, our callback is just calling crawlSnapdeal()
        crawlSnapdeal();
        
      });
}

function collectbookListSnapdeal($) {
    var searchresults = $("#products");
    //console.log(searchresults);
    var currlist = $(searchresults).find(".product-tuple-listing.js-tuple");
    console.log("Found " + currlist.length + " relative links on page");
    currlist.each(function() {
        //var currimg = $(this).find(".variant-image");
        var currbook = $(this).find(".product-tuple-description");
        //console.log($(currA).attr('href'));
        bookList_snapdeal.push(currbook);
    });
}

function getPricesSnapdeal($) {
    var book = {};

    var currtitle = $.children(".product-desc-rating").find("a").find(".product-title").text();
    var currauthor = $.children(".product-desc-rating").find("a").find(".product-author-name").text();
    var currprice = $.children(".product-desc-rating").find(".product-price").text();
    
    var currurl = $.children(".product-desk-rating").find("a").attr("href");

    book.title = currtitle;
    book.author = currauthor;
    book.price = currprice;
    book.url = currurl;
    console.log(book);

}