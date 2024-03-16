let lArray = [];

document.addEventListener('DOMContentLoaded', function() { 

    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' ) { addItem() }
    document.getElementById('priority-button').addEventListener('click', function() {
        addItem() } )
    })
})

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

    let priorityStatus = document.getElementById('priority-button').checked;
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
    displayList();
    clearFocus();
}

/* Clear input fields and place keyboard focus on input box */
function clearFocus() {
    document.getElementById('userInput').value = "";
    document.getElementById('userInput').focus();
    document.getElementById('priority-button').checked = false;
}

/* Display Updated List */

function displayList(type) {
    
    /* Reorder List Items for avoid sorting function not working */
    for (let i in lArray) {
        lArray[i].order = i;
    }

    let list = document.body.getElementsByTagName('ul')[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    let thisArray = lArray;

     for (i = 0; i < thisArray.length; i++) {
        let newItem = `<input type="checkbox" class="checkbox"><span class="">${thisArray[i].content}</span>
                        <span class="not-priority">0</span><span class="remove">X</span>`
        let newListItem = document.createElement('li');
        newListItem.innerHTML = newItem;

        if (thisArray[i].checked === true) {
            newListItem.children[1].setAttribute('class', `strikethrough`)
            newListItem.children[0].setAttribute('checked', 'checked')
        }

        if (thisArray[i].priority === true) {
            newListItem.children[2].setAttribute('class', 'priority')
        }

        newListItem.children[0].addEventListener('click', strikeItem);
        newListItem.children[3].addEventListener('click', removeItem);

        list.appendChild(newListItem);
    }

}

/* Add Strikethrough text decoration to item for Todo List, when checked */
function strikeItem () {
    for (let i in lArray) {
        if (this.nextElementSibling.textContent === lArray[i].content) {
            lArray[i].checked = (lArray[i].checked === true) ? false : true;
            lArray[i].priority = false;
        }
    }
    displayList();
}


/* Remove item from Todo list */
function removeItem () {
    let tempArray = [];
    for (let i in lArray) {
        if (this.previousElementSibling.previousElementSibling.textContent !== lArray[i].content) {
            tempArray.push(lArray[i]) 
    }}
    lArray = tempArray;
    displayList();
}