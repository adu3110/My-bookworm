var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var search_string = "harry+potter";
var start_url_flipkart = "https://www.flipkart.com/search?q=";
//var SEARCH_WORD = "stone";
var max_books_to_visit_flipkart = 5;

//var pagesVisited = {};
var numBooksVisited_flipkart = 0;
var bookList_flipkart = [];
var url_flipkart = new URL(start_url_flipkart);
var baseUrl_flipkart = url_flipkart.protocol + "//" + url_flipkart.hostname;


findBooksFlipkart(start_url_flipkart + search_string);


//pagesToVisit.push(start_url_flipkart);


function crawlFlipkart() {
  if(numBooksVisited_flipkart >= max_books_to_visit_flipkart) {
    console.log("Reached max limit of number of books.");
    return;
  }

  if(bookList_flipkart.length === 0){
    console.log("Searched All Books");
    return;
  }
  var nextBook = bookList_flipkart.pop();

  visitBookFlipkart(nextBook, crawlFlipkart);

}

function visitBookFlipkart(bookobj, callback) {
  // Add page to our set
  //pagesVisited[url] = true;
  numBooksVisited_flipkart++;

  // Make the request
  //console.log("Visiting page " + url);

  getPricesFlipkart(bookobj);

  callback();
}

function findBooksFlipkart(url){
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
         collectbookListFlipkart($);
        // In this short program, our callback is just calling crawlFlipkart()
        crawlFlipkart();
        
      });
}

function collectbookListFlipkart($) {
    var searchresults = $("._1HmYoV._35HD7C.col-10-12");
    //console.log(searchresults);
    var currlist = $(searchresults).find("._3liAhj._1R0K0g");
    console.log("Found " + currlist.length + " relative links on page");
    currlist.each(function() {
        //var currimg = $(this).find(".variant-image");
        //var currbook = $(this).find("");
        //console.log($(currA).attr('href'));
        bookList_flipkart.push($(this));
    });
}

function getPricesFlipkart($) {
    var book = {};

    var currtitle = $.find("._2cLu-l").attr("title");
    var currauthor = $.find("._1rcHFq").text();
    var currprice = $.find("._1Vfi6u").find("._1vC4OE").text();
    
    var currurl = baseUrl_flipkart + $.find("._2cLu-l").attr("href");

    book.title = currtitle;
    book.author = currauthor;
    book.price = currprice;
    book.url = currurl;
    console.log(book);

}