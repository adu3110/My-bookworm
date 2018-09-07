var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');


var search_string = "harry+potter";

var start_url_crossword = "http://www.crossword.in/search?q=";
//var SEARCH_WORD = "stone";
var max_pages_to_visit_crossword = 5;

var pagesVisited_crossword = {};
var numpagesVisited_crossword = 0;
var pagesToVisit_crossword = [];
var url_crossword = new URL(start_url_crossword);
var baseUrl_crossword = url_crossword.protocol + "//" + url_crossword.hostname;


findBooksCrossword(start_url_crossword+search_string);


//pagesToVisit_crossword.push(start_url_crossword);


function crawlCrossword() {
  if(numpagesVisited_crossword >= max_pages_to_visit_crossword) {
    console.log("Reached max limit of number of pages to visit.");
    pagesVisited_crossword = {};
    numpagesVisited_crossword = 0;
    pagesToVisit_crossword = [];
    return;
  }

  if(pagesToVisit_crossword.length === 0){
    console.log("Searched All Pages");
    pagesVisited_crossword = {};
    numpagesVisited_crossword = 0;
    pagesToVisit_crossword = [];
    return;
  }
  var nextPage = pagesToVisit_crossword.pop();
  if (nextPage in pagesVisited_crossword) {
    // We've already visited this page, so repeat the crawlCrossword
    crawlCrossword();
  } else {
    // New page we haven't visited
    visitPageCrossword(nextPage, crawlCrossword);
  }
}

function visitPageCrossword(url, callback) {
  // Add page to our set
  pagesVisited_crossword[url] = true;
  numpagesVisited_crossword++;

  // Make the request
  console.log("Visiting page " + url);

  request(url, function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
      }
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);

     getPricesCrossword($, url);

     callback();
    
  });

  
}

function findBooksCrossword(url){
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
         collectInternalLinksCrossword($);
        // In this short program, our callback is just calling crawlCrossword()
        crawlCrossword();
        
      });
}

function collectInternalLinksCrossword($) {
    var searchresults = $("#search-result-items");
    //console.log(searchresults);
    var currlist = $(searchresults).children("li");
    console.log("Found " + currlist.length + " relative links on page");
    currlist.each(function() {
        var currimg = $(this).find(".variant-image");
        var currA = $(currimg).children("a[href^='/']");
        pagesToVisit_crossword.push(baseUrl_crossword + $(currA).attr('href'));
    });
}

function getPricesCrossword($, currurl) {
    var book = {};

    var bookdetail = $("#product-detail-page");
    var booktitle = $(bookdetail).find("#title");
    
    var currtitle = $(booktitle).children("h1").text();
    var currauthor = $(booktitle).find(".ctbr-name").children("a").text();
    var currprice = $(bookdetail).find(".our_price").find(".m-w").text();

    book.title = currtitle;
    book.author = currauthor;
    book.price = currprice;
    book.url = currurl;
    console.log(book);

}