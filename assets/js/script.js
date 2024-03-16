let lArray = [];

document.addEventListener('DOMContentLoaded', function() { 

    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' ) { addItem() }


})})

/* Add a new Todo item */
function addItem(userInput) {
    if (!userInput) { userInput = document.getElementById('userInput').value }
    if (userInput === "") { return; }
    for (i in lArray) {
        if (lArray[i].content === userInput) {
            alert("You've already added this item :)")
            clearFocus();
            return;
        }
    }

    let priorityStatus = false;

    let order = lArray.length;
    lArray.push( {
        'order' : order,
        'content' : userInput,
        'checked' : false,
        'priority' : priorityStatus
     });
    
    /* Debug Output */
    console.log("=============");
    for (let i in lArray) {
        console.log("\n");
        console.log(lArray[i].order);
        console.log(lArray[i].content);
        console.log(lArray[i].checked);
        console.log(lArray[i].priority);
    }   
    console.log("=============");
    clearFocus();
}

/* Clear input fields and place keyboard focus on input box */
function clearFocus() {
    document.getElementById('userInput').value = "";
    document.getElementById('userInput').focus();
    document.getElementById('priority-button').checked = false;
}