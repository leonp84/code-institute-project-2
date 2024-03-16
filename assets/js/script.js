let lArray = [];

document.addEventListener('DOMContentLoaded', function() { 

    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' ) { addItem() } } )
    document.getElementById('priority-button').addEventListener('click', function() {
        addItem() } )
    document.getElementById('clear-clicked').addEventListener('click', function() {
        clearCompleted() } )

addItem('Your First Todo Item...');
addItem('Click the X to delete...');
addItem('Add more above: priority optional...');

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


    let list = document.body.getElementsByTagName('ul')[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    let thisArray = lArray;

    /* Add new item with specified properties, using custom HTML */
     for (i = 0; i < thisArray.length; i++) {
        let newItem = `
        <div>
          <input type="checkbox" class="checkbox">
          <span class="">${thisArray[i].content}</span>
        </div>
        <div>
            <span class="not-priority">0</span>
            <span class="remove">X</span>
        </div>`

        let newListItem = document.createElement('li');
        newListItem.innerHTML = newItem;

        if (thisArray[i].checked === true) {
            newListItem.children[0].children[1].setAttribute('class', `strikethrough`)
            newListItem.children[0].children[0].setAttribute('checked', 'checked')
        }

        if (thisArray[i].priority === true) {
            newListItem.children[1].children[0].setAttribute('class', 'priority')
        }

        newListItem.children[0].children[0].addEventListener('click', strikeItem);
        newListItem.children[1].children[1].addEventListener('click', removeItem);
        newListItem.children[0].children[1].addEventListener('click', editItemText);

        list.appendChild(newListItem);
    }

    /* Update "Show Items Left at the bottom of the list" */
    let itemsLeft = document.getElementById('items-left');
    let itemsLeftNumber = 0;
    for (let i in lArray) {
        if (lArray[i].checked !== true ) { itemsLeftNumber++; }}
    itemsLeft.innerHTML = `${itemsLeftNumber} items left`

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
        if (this.parentNode.previousElementSibling.children[1].textContent !== lArray[i].content) {
            tempArray.push(lArray[i]) 
    }}
    lArray = tempArray;
    displayList();
}

/* Edit Item Text and update list in real time */
function editItemText() {
    let numToChange = 0;
    for (let i in lArray) {
        if (lArray[i].content == this.textContent) { numToChange = i}
    }

    let replace = document.createElement('input');
    replace.type = "text";
    replace.id = "editing";
    replace.setAttribute('class', 'listDisplay')
    replace.value = this.textContent;
    this.parentNode.appendChild(replace);
    this.remove();
    document.getElementById('editing').focus();
  
    document.getElementById('editing').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        let newContent = document.getElementById('editing').value; 
        lArray[numToChange].content = newContent;
        displayList();
    }})
}

/* Completely Erase striked/checked items from List/Array */
function clearCompleted () {
    let tempArray = [];
    for (let i in lArray) { if (lArray[i].checked !== true) { 
        tempArray.push(lArray[i]) 
    }}
    lArray = tempArray;
    displayList();
}