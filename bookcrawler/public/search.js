//var $ = require('jquery');

function setup() {

}

document.querySelector(".alertSearchAmazon").style.display = "none";
document.querySelector(".alertSearchFlipkart").style.display = "none";
document.querySelector(".alertSearchSnapdeal").style.display = "none";
document.querySelector(".alertSearchSapna").style.display = "none";
document.querySelector(".alertSearchCrossword").style.display = "none";
document.querySelector(".loading").style.display = "none";


document.getElementById('searchAll').addEventListener('click', searchAmazon);

function searchAmazon(e){
    e.preventDefault();

    document.querySelector(".alertSearchAmazon").style.display = "none";
    document.querySelector(".alertSearchFlipkart").style.display = "none";
    document.querySelector(".alertSearchSnapdeal").style.display = "none";
    document.querySelector(".alertSearchSapna").style.display = "none";
    //document.querySelector(".alertSearchCrossword").style.display = "none";


    // Get Book Name
    var search_book = document.getElementById('bookToFind').value;

    if(search_book==null || search_book==""){
        document.querySelector(".alertNone").style.display = "block";

        setTimeout(function(){
            document.querySelector(".alertNone").style.display = "none";
        }, 3000);
    } else {
        
        var search_words = search_book.split(/\s+/g);

        var search_string = search_words.join("+");
    
        console.log(search_string);
        //Searching
        //httpGet(('books/:' + search_string), 'json', getServerData, errorFetch);

        document.querySelector(".loading").style.display = "block";

        $.ajax({
            type: 'GET',
            url: ("https://us-central1-bookworm-2502.cloudfunctions.net/app/books/:"+search_string),
            //contentType: 'application/json',
            dataType : "json",
            //data : {book: search_string},
            success: getServerData
            }
        );

        //httpGet(('flipkart/:' + search_string), 'json', getServerDataFlipkart, errorFetch);

        //httpGet(('snapdeal/:' + search_string), 'json', getServerDataSnapdeal, errorFetch);

        //httpGet(('sapna/:' + search_string), 'json', getServerDataSapna, errorFetch);

        //httpGet(('crossword/:' + search_string), 'json', getServerDataCrossword, errorFetch);
        
    }
    
}

function getServerData(data){
    var fulldata = data;
    document.querySelector(".loading").style.display = "none";
    //console.log(fulldata);
    getServerDataAmazon(fulldata['amazon']);
    getServerDataFlipkart(fulldata['flipkart']);
    getServerDataSnapdeal(fulldata['snapdeal']);
    getServerDataSapna(fulldata['sapna']);
}

function errorFetch(){
    console.log('Error in getting data');
}

function getServerDataAmazon(data){
    console.log('came here for amazon');
    var bookResults = data;

    var Keys = Object.keys(bookResults);

    if (Keys.length === 0){
        document.querySelector(".alertSearchAmazon").style.display = "none";
        console.log('no results found');
    }else{

        document.querySelector(".alertSearchAmazon").style.display = "block";

        var tableRes = document.getElementById("searchresultsAmazon");

        for(var i = tableRes.rows.length - 1; i >= 0; i--){
            tableRes.deleteRow(i);
        }    

        var row = tableRes.insertRow(0);

        row.insertCell(0).innerHTML = "Title";
        row.insertCell(1).innerHTML = "Author";
        row.insertCell(2).innerHTML = "Price";
        row.insertCell(3).innerHTML = "Link";

        for(i=0; i<Keys.length; i++){

            var rowdata = bookResults[Keys[i]];
            row = tableRes.insertRow(i+1);
    
            var btn = document.createElement('input');
    
            btn.type = "button";
            btn.className = "btn";
            btn.value = "Go To Website";
            btn.onclick = (function(url) {return function() {window.open(url);};})(rowdata.url);
    
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
    
            cell1.innerHTML = rowdata.title;
            cell2.innerHTML = rowdata.author;
            cell3.innerHTML = rowdata.price;
            cell4.appendChild(btn);
    
        }
    }

}

function getServerDataFlipkart(data){
    console.log('came here flipkart');
    var bookResults = data;

    var Keys = Object.keys(bookResults);

    if (Keys.length === 0){
        document.querySelector(".alertSearchFlipkart").style.display = "none";
        console.log('no results found');
    }else{
        document.querySelector(".alertSearchFlipkart").style.display = "block";

        var tableRes = document.getElementById("searchresultsFlipkart");

        for(var i = tableRes.rows.length - 1; i >= 0; i--){
            tableRes.deleteRow(i);
        }    

        var row = tableRes.insertRow(0);

        row.insertCell(0).innerHTML = "Title";
        row.insertCell(1).innerHTML = "Author";
        row.insertCell(2).innerHTML = "Price";
        row.insertCell(3).innerHTML = "Link";

        for(i=0; i<Keys.length; i++){

            var rowdata = bookResults[Keys[i]];
            row = tableRes.insertRow(i+1);
    
            var btn = document.createElement('input');
    
            btn.type = "button";
            btn.className = "btn";
            btn.value = "Go To Website";
            btn.onclick = (function(url) {return function() {window.open(url);};})(rowdata.url);
    
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
    
            cell1.innerHTML = rowdata.title;
            cell2.innerHTML = rowdata.author;
            cell3.innerHTML = rowdata.price;
            cell4.appendChild(btn);
    
        }
    }

}

function getServerDataSapna(data){
    console.log('came here sapna');
    var bookResults = data;
    
    var Keys = Object.keys(bookResults);

    if (Keys.length === 0){
        document.querySelector(".alertSearchSapna").style.display = "none";
        console.log('no results found');
    }else{
        document.querySelector(".alertSearchSapna").style.display = "block";

        var tableRes = document.getElementById("searchresultsSapna");

        for(var i = tableRes.rows.length - 1; i >= 0; i--){
            tableRes.deleteRow(i);
        }    

        var row = tableRes.insertRow(0);

        row.insertCell(0).innerHTML = "Title";
        row.insertCell(1).innerHTML = "Author";
        row.insertCell(2).innerHTML = "Price";
        row.insertCell(3).innerHTML = "Link";

        for(i=0; i<Keys.length; i++){

            var rowdata = bookResults[Keys[i]];
            row = tableRes.insertRow(i+1);
    
            var btn = document.createElement('input');
    
            btn.type = "button";
            btn.className = "btn";
            btn.value = "Go To Website";
            btn.onclick = (function(url) {return function() {window.open(url);};})(rowdata.url);
    
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
    
            cell1.innerHTML = rowdata.title;
            cell2.innerHTML = rowdata.author;
            cell3.innerHTML = rowdata.price;
            cell4.appendChild(btn);
    
        }
    }

}

function getServerDataSnapdeal(data){
    console.log('came here snapdeal');
    var bookResults = data;
    
    var Keys = Object.keys(bookResults);

    if (Keys.length === 0){
        document.querySelector(".alertSearchSnapdeal").style.display = "none";
        console.log('no results found');
    }else{
        document.querySelector(".alertSearchSnapdeal").style.display = "block";

        var tableRes = document.getElementById("searchresultsSnapdeal");

        for(var i = tableRes.rows.length - 1; i >= 0; i--){
            tableRes.deleteRow(i);
        }    

        var row = tableRes.insertRow(0);

        row.insertCell(0).innerHTML = "Title";
        row.insertCell(1).innerHTML = "Author";
        row.insertCell(2).innerHTML = "Price";
        row.insertCell(3).innerHTML = "Link";

        for(i=0; i<Keys.length; i++){

            var rowdata = bookResults[Keys[i]];
            row = tableRes.insertRow(i+1);
    
            var btn = document.createElement('input');
    
            btn.type = "button";
            btn.className = "btn";
            btn.value = "Go To Website";
            btn.onclick = (function(url) {return function() {window.open(url);};})(rowdata.url);
    
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
    
            cell1.innerHTML = rowdata.title;
            cell2.innerHTML = rowdata.author;
            cell3.innerHTML = rowdata.price;
            cell4.appendChild(btn);
    
        }
    }

}

function getServerDataCrossword(data){
    console.log('came here crossword');
    var bookResults = data;
    
    var Keys = Object.keys(bookResults);

    if (Keys.length === 0){
        document.querySelector(".alertSearchCrossword").style.display = "none";
        console.log('no results found');
    }else{
        document.querySelector(".alertSearchCrossword").style.display = "block";

        var tableRes = document.getElementById("searchresultsCrossword");

        for(var i = tableRes.rows.length - 1; i >= 0; i--){
            tableRes.deleteRow(i);
        }    

        var row = tableRes.insertRow(0);

        row.insertCell(0).innerHTML = "Title";
        row.insertCell(1).innerHTML = "Author";
        row.insertCell(2).innerHTML = "Price";
        row.insertCell(3).innerHTML = "Link";

        for(i=0; i<Keys.length; i++){

            var rowdata = bookResults[Keys[i]];
            row = tableRes.insertRow(i+1);
    
            var btn = document.createElement('input');
    
            btn.type = "button";
            btn.className = "btn";
            btn.value = "Go To Website";
            btn.onclick = (function(url) {return function() {window.open(url);};})(rowdata.url);
    
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
    
            cell1.innerHTML = rowdata.title;
            cell2.innerHTML = rowdata.author;
            cell3.innerHTML = rowdata.price;
            cell4.appendChild(btn);
    
        }
    }

}

