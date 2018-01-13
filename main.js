var itemInput = document.querySelector("input");
itemInput.focus();
var addBtn = document.querySelector(".addBtn");
var listItems = document.querySelector(".listItems");
var removedItems = document.querySelector(".removedItems");
var counter = 0;

//adding list items to the shopping list

addBtn.addEventListener("click", function(){
    let inputVal = itemInput.value;
    if(inputVal === "" || inputVal === null){
        itemInput.focus();
        return;
    }
    populateList(inputVal, listItems);
    storeAdded(inputVal);
    itemInput.value = "";
    itemInput.focus();
});

function populateList(inputVal, taergetEl) {
    let item = document.createElement("li");
    item.innerHTML = inputVal + "<i></i>";
    taergetEl.appendChild(item);
}

//adding delete icon to the list items on hover

listItems.addEventListener("mouseover", function(e){
    let item = e.target;
    if(item.nodeName === "LI"){
        let delBtn = item.lastChild;
        delBtn.className = "fa fa-trash";
    }
    if(item.nodeName === "I"){
        item.className = "fa fa-trash";
    }
});

//adding event handler to delete a list item

document.querySelector("body").addEventListener("click", function(e){
    if(e.target.nodeName === "I"){
        let item = e.target.parentNode;
        item.removeChild(e.target)
        let removedItem = item.parentNode.removeChild(item);
        storeRemoved(removedItem.textContent);
        document.querySelector(".removedItems").appendChild(removedItem);

    } 
}, true);

//removing the delete icon on mouse out.

listItems.addEventListener("mouseout", function(e){
    let item = e.target;
    if(item.nodeName === "LI"){
        item.lastChild.className = "";
    }
});

//local storage API
// storing shopping list items in the local storage "added"

function storeAdded(inputVal) {
    if(localStorage.getItem("added")){
        let localList = JSON.parse(localStorage.getItem("added"));

        localList[localList.length] = inputVal;
        localStorage.setItem("added", JSON.stringify(localList));
    } else {
        let localList = [];
        localList.push(inputVal);
        localStorage.setItem("added", JSON.stringify(localList));
    }
}
// removing the deleted item from shopping list from its local cache 

function storeAddedPro(inputVal) {
    let localList = JSON.parse(localStorage.getItem("added"));
    localList.forEach(element => {
        if(inputVal === element){
            localList.splice(localList.indexOf(element), 1);
        }
    });
    localStorage.setItem("added", JSON.stringify(localList));
}

//storing deleted items in the local storage "removed"

function storeRemoved(inputVal) {
    if(localStorage.getItem("removed")){
        let localList = JSON.parse(localStorage.getItem("removed"));
        localList[localList.length] = inputVal;
        localStorage.setItem("removed", JSON.stringify(localList));
    } else {
        let localList = [];
        localList.push(inputVal);
        localStorage.setItem("removed", JSON.stringify(localList));
    }
    storeAddedPro(inputVal);
}   

//populating the list items from local storage

document.body.onload = function(){
    if(localStorage.getItem("removed")) {
        let localList = JSON.parse(localStorage.getItem("removed"));
        for(var i=0; i<localList.length; i++) {
            populateList(localList[i], document.querySelector(".removedItems"));
        }
    }
    if(localStorage.getItem("added")) {
        let localList = JSON.parse(localStorage.getItem("added"));
        for(var i=0; i<localList.length; i++) {
            populateList(localList[i], listItems);
        }
    }
}

// clearing out removed items from local storage "removed"

var clearButton = document.querySelector("#clearButton");
clearButton.addEventListener("click", function(){
    if(localStorage.getItem("removed")){
        let localList = JSON.parse(localStorage.getItem("removed"));
        localList.splice(0, localList.length);
        localStorage.setItem("removed", JSON.stringify(localList));
        location.reload();
    }
});

//suggesting general purpose items
var suggest = document.querySelector("#suggest");
var suggestionItems;
    var request = new XMLHttpRequest();
    request.open('GET', 'items.json');
    request.responseType = 'json';
    request.setRequestHeader('Access-Control-Allow-Origin', '*');

    //request.setRequestHeader('Content-types', 'application/json');
    request.send();
    request.onload = function(){
        suggestionItems = request.response;
    }



itemInput.addEventListener("input", function(e){
    let inputVal = e.target.value;
    let localList = JSON.parse(localStorage.getItem("removed"));
    let matchedList = [];
    
    suggestionItems.forEach(element => {
        inputVal = inputVal.toLowerCase();
        let element2 = element.toLowerCase();
        element2 = element.substr(0, inputVal.length);

        if(inputVal !== "" && inputVal === element2) {
            matchedList.push(element);
        } else {
            suggest.className = "hide"; 
        }
    });
    matchedList.sort();
    displaySuggestions(matchedList);
});

function displaySuggestions(matchedList){
    suggest.innerHTML = "";
    matchedList.forEach(element => {
        populateList(element, suggest);
        suggest.className = "show";
    });
}

suggest.addEventListener("click", function(e){
    if(e.target.nodeName === "LI") {
        let suggestedText = e.target.textContent;
        populateList(suggestedText, listItems);
        storeAdded(suggestedText);
        itemInput.value = "";
        itemInput.focus();
        suggest.innerHTML ="";
        suggest.className = "hide";
    }
});