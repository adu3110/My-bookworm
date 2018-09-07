
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var start_url_amazon = "https://www.amazon.in/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=";
var start_url_flipkart = "https://www.flipkart.com/search?q=";
var start_url_snapdeal = "https://www.snapdeal.com/search?keyword=";
var start_url_sapna = "https://www.sapnaonline.com/general-search?searchkey=";
var start_url_crossword = "http://www.crossword.in/search?q=";

var max_books_to_visit_amazon = 5;
var max_books_to_visit_flipkart = 5;
var max_books_to_visit_snapdeal = 5;
var max_books_to_visit_sapna = 5;
var max_pages_to_visit_crossword = 5;


var bookResults_amazon = {};
var bookResults_flipkart = {};
var bookResults_snapdeal = {};
var bookResults_sapna = {};
var bookResults_crossword = {};

var numBooksVisited_amazon = 0;
var numBooksVisited_flipkart = 0;
var numBooksVisited_snapdeal = 0;
var numBooksVisited_sapna = 0;
var numpagesVisited_crossword = 0;

var bookList_amazon = [];
var bookList_flipkart = [];
var bookList_snapdeal = [];
var bookList_sapna = [];
var pagesToVisit_crossword = [];


var url_amazon = new URL(start_url_amazon);
var baseUrl_amazon = url_amazon.protocol + "//" + url_amazon.hostname;
var url_flipkart = new URL(start_url_flipkart);
var baseUrl_flipkart = url_flipkart.protocol + "//" + url_flipkart.hostname;
var url_crossword = new URL(start_url_crossword);
var baseUrl_crossword = url_crossword.protocol + "//" + url_crossword.hostname;



var app = express();

var server = app.listen(5000, listening);

function listening(){
    console.log("listening..");
}

app.use(express.static(__dirname + '/public'));

app.get('/amazon/:book', findBooksAmazon);
app.get('/flipkart/:book', findBooksFlipkart);
app.get('/snapdeal/:book', findBooksSnapdeal);
app.get('/sapna/:book', findBooksSapna);
app.get('/crossword/:book', findBooksCrossword);


function findBooksAmazon(req, res){

    var data = req.params;

    search_string = data.book;

    url = start_url_amazon + search_string;

    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
          }
         // Check status code (200 is HTTP OK)
         //console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
            console.log("Status Not 200");
         }
    
        var $ = cheerio.load(body);
         // Parse the document body
         collectbookListAmazon($, crawlAmazon);
        // In this short program, our callback is just calling crawlFlipkart()

        res.send(bookResults_amazon);

        bookResults_amazon = {};
        
      });
      
}
  
function findBooksFlipkart(req, res){

    var data = req.params;

    search_string = data.book;

    url = start_url_flipkart + search_string;

    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
          }
         // Check status code (200 is HTTP OK)
         //console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
            console.log("Status Not 200");
         }
    
        var $ = cheerio.load(body);
         // Parse the document body
         collectbookListFlipkart($, crawlFlipkart);
        // In this short program, our callback is just calling crawlFlipkart()

        res.send(bookResults_flipkart);

        bookResults_flipkart = {};
        
      });
      
      
}

function findBooksSnapdeal(req, res){

    var data = req.params;

    search_string = data.book;

    url = start_url_snapdeal + search_string;

    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
          }
         // Check status code (200 is HTTP OK)
         //console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
            console.log("Status Not 200");
         }
    
        var $ = cheerio.load(body);
         // Parse the document body
         collectbookListSnapdeal($);
        // In this short program, our callback is just calling crawlSnapdeal()
        crawlSnapdeal();

        res.send(bookResults_snapdeal);

        bookResults_snapdeal = {};
        
      });

      
}

function findBooksSapna(req, res){

    var data = req.params;

    search_string = data.book;

    url = start_url_sapna + search_string;

    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
          }
         // Check status code (200 is HTTP OK)
         //console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
            console.log("Status Not 200");
         }
    
        var $ = cheerio.load(body);
         // Parse the document body
         collectbookListSapna($);
        // In this short program, our callback is just calling crawlSapna()
        crawlSapna();
        
        res.send(bookResults_sapna);

        bookResults_sapna = {};

      });

}

function findBooksCrossword(req, res){

    var data = req.params;

    search_string = data.book;

    url = start_url_crossword + search_string;

    request(url, function(error, response, body) {
        if(error) {
            console.log("Error: " + error);
          }
         // Check status code (200 is HTTP OK)
         //console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
            console.log("Status Not 200");
         }
    
        var $ = cheerio.load(body);
         // Parse the document body
        collectInternalLinksCrossword($);
        // In this short program, our callback is just calling crawlCrossword()
        crawlCrossword();

        console.log(Object.keys(bookResults_crossword));
        res.send(bookResults_crossword);

        bookResults_crossword = {};
        
      });
}



function crawlAmazon() {
    if(numBooksVisited_amazon >= max_books_to_visit_amazon) {
      console.log("Reached max limit of number of books.");
      numBooksVisited_amazon = 0;
      bookList_amazon = [];
      return;
    }
  
    if(bookList_amazon.length === 0){
      console.log("Searched All Books");
      numBooksVisited_amazon = 0;
      bookList_amazon = [];
      return;
    }
    var nextBook = bookList_amazon.pop();
  
    visitBookAmazon(nextBook, crawlAmazon);
  
  }
  
  function visitBookAmazon(bookobj, callback) {
    // Add page to our set
    //pagesVisited[url] = true;
    numBooksVisited_amazon++;
  
    // Make the request
    //console.log("Visiting page " + url);
  
    getPricesAmazon(bookobj);
  
    callback();
    
  }
  

function collectbookListAmazon($, callback) {
    var searchresults = $("#s-results-list-atf");
    //console.log(searchresults);
    var currlist = $(searchresults).find(".a-fixed-left-grid");
    console.log("Found " + currlist.length + " results on amazon");
    currlist.each(function() {
        //var currimg = $(this).find(".variant-image");
        var currbook = $(this).find(".a-col-right");
        //console.log($(currA).attr('href'));
        bookList_amazon.push(currbook);
    });

    callback();
}

function getPricesAmazon($) {
    try{
        var book = {};

        var currtitle = $.find(".s-color-twister-title-link.a-text-normal").attr("title");
        var currauthor = $.children(".a-row.a-spacing-small").find(".a-row.a-spacing-none").find(".a-size-small.a-color-secondary").find("a").text();
        var currprice = $.find(".s-price.a-text-bold").text();
        
        var currurl = $.find(".s-color-twister-title-link.a-text-normal").attr("href");
    
        book.title = currtitle;
        book.author = currauthor;
        book.price = "Rs. " + currprice.split(/\s+/g)[1];
    
        
        if(currurl.includes(baseUrl_amazon)){
            book.url = currurl;
        }else{
            book.url = baseUrl_amazon + currurl;
        }
        
        //console.log(book);
    
        bookResults_amazon[numBooksVisited_amazon] = book;
    }
    catch(err){
        console.log(err);
    }
    

}


function crawlFlipkart() {
    if(numBooksVisited_flipkart >= max_books_to_visit_flipkart) {
      console.log("Reached max limit of number of books.");
      numBooksVisited_flipkart = 0;
      bookList_flipkart = [];
      return;
    }
  
    if(bookList_flipkart.length === 0){
      console.log("Searched All Books");
      numBooksVisited_flipkart = 0;
      bookList_flipkart = [];
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
  

function collectbookListFlipkart($, callback) {
    var searchresults = $("._1HmYoV._35HD7C.col-10-12");
    //console.log(searchresults);
    var currlist = $(searchresults).find("._3liAhj._1R0K0g");
    console.log("Found " + currlist.length + " results on flipkart");
    currlist.each(function() {
        //var currimg = $(this).find(".variant-image");
        //var currbook = $(this).find("");
        //console.log($(currA).attr('href'));
        bookList_flipkart.push($(this));
    });

    callback();
}

function getPricesFlipkart($) {
    try{
        var book = {};

        var currtitle = $.find("._2cLu-l").attr("title");
        var currauthor = $.find("._1rcHFq").text();
        var currprice = $.find("._1Vfi6u").find("._1vC4OE").text();
    
        var currurl = baseUrl_flipkart + $.find("._2cLu-l").attr("href");

        book.title = currtitle;
        book.author = currauthor;
        book.price = "Rs. " + currprice;
        book.url = currurl;
    
        bookResults_flipkart[numBooksVisited_flipkart] = book;

    }
    catch(err){
        console.log(err);
    }
}

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
  
  
  function collectbookListSnapdeal($) {
      var searchresults = $("#products");
      //console.log(searchresults);
      var currlist = $(searchresults).find(".product-tuple-listing.js-tuple");
      console.log("Found " + currlist.length + " results on snapdeal");
      currlist.each(function() {
          //var currimg = $(this).find(".variant-image");
          var currbook = $(this).find(".product-tuple-description");
          //console.log($(currA).attr('href'));
          bookList_snapdeal.push(currbook);
      });
  }
  
  function getPricesSnapdeal($) {
      try{
        var book = {};
  
        var currtitle = $.children(".product-desc-rating").find("a").find(".product-title").text();
        var currauthor = $.children(".product-desc-rating").find("a").find(".product-author-name").text();
        var currprice = $.children(".product-desc-rating").find(".product-price").text();
      
        var currurl = $.children(".product-desc-rating").find("a").attr("href");
  
        book.title = currtitle;
        book.author = currauthor;
        book.price = currprice;
        book.url = currurl;
      
        bookResults_snapdeal[numBooksVisited_snapdeal] = book;
      }
      catch(err){
          console.log(err);
      }
      
  }

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
  
    visitBookSapna(nextBook, crawlSapna);
  
  }
  
  function visitBookSapna(bookobj, callback) {
    // Add page to our set
    //pagesVisited[url] = true;
    numBooksVisited_sapna++;
  
    // Make the request
    //console.log("Visiting page " + url);
  
    getPricesSapna(bookobj);
  
    callback();
  }
  
  
  function collectbookListSapna($) {
      var searchresults = $("#list-view-ul");
      //console.log(searchresults);
      var currlist = $(searchresults).children(".product-book-list-view");
      console.log("Found " + currlist.length + " relsults on sapna");
      currlist.each(function() {
          //var currimg = $(this).find(".variant-image");
          var currbook = $(this).find(".product-book-list-details");
          //console.log($(currA).attr('href'));
          bookList_sapna.push(currbook);
      });
  }
  
  function getPricesSapna($) {
      try{
        var book = {};
  
        var currtitle = $.find(".product-book-name").find("a").attr("title");
        var currauthor = $.find(".product-book-author").children("a").text();
        var currprice = $.find(".actual-price").text();
        currprice = currprice.replace(/[\n\r\t]/g, "");
        currprice = currprice.replace("`", "");
    
        var currurl = $.find(".product-book-name").find("a").attr("href");
    
        book.title = currtitle;
        book.author = currauthor;
        book.price = "Rs. " + currprice;
        book.url = currurl;
        
        bookResults_sapna[numBooksVisited_sapna] = book;
      }
      catch(err){
          console.log(err);
      }
      
  }


  function crawlCrossword() {
    if(numpagesVisited_crossword >= max_pages_to_visit_crossword) {
      console.log("Reached max limit of number of pages to visit.");
      numpagesVisited_crossword = 0;
      pagesToVisit_crossword = [];
      return;
    }
  
    if(pagesToVisit_crossword.length === 0){
      console.log("Searched All Pages");
      numpagesVisited_crossword = 0;
      pagesToVisit_crossword = [];
      return;
    }
    var nextPage = pagesToVisit_crossword.pop();
    visitPageCrossword(nextPage, crawlCrossword);
  }
  
  function visitPageCrossword(url, callback) {
    // Add page to our set
    //pagesVisited_crossword[url] = true;
    numpagesVisited_crossword++;
  
    // Make the request
    //console.log("Visiting page " + url);
  
    request(url, function(error, response, body) {
      if(error) {
          console.log("Error: " + error);
        }
       // Check status code (200 is HTTP OK)
       //console.log("Status code: " + response.statusCode);
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
      try{
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
        
        bookResults_crossword[numpagesVisited_crossword] = book;
      }
      catch(err){
          console.log(err);
      }
  
  }