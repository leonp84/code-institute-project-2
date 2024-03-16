let lArray = [];

document.addEventListener('DOMContentLoaded', function() { 

    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' ) { addItem() } } )
    document.getElementById('priority-button').addEventListener('click', function() {
        addItem() } )
    document.getElementById('clear-clicked').addEventListener('click', function() {
        clearCompleted() } )
    document.getElementById('active-clicked').addEventListener('click', function() {
        displayList('active') } )
    document.getElementById('done-clicked').addEventListener('click', function() {
        displayList('completed') } )
    document.getElementById('all-clicked').addEventListener('click', function() {
        displayList() } )
    document.getElementById('sort-button').addEventListener('click', function() {
        sortList() } )
    document.getElementById('toggle-theme').addEventListener('click', function() {
        toggleTheme() } )

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


                // /* Debug Output */
                // console.log("=============");
                // for (let i in lArray) {
                //     console.log("\n");
                //     console.log(lArray[i].order);
                //     console.log(lArray[i].content);
                //     console.log(lArray[i].checked);
                //     console.log(lArray[i].priority);
                // }   
                // console.log("=============");

    let list = document.body.getElementsByTagName('ul')[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    let thisArray = lArray;

    /* Create temporary Array consisting of only 'active' items for Active display */
    if (type === 'active') {
        thisArray = [];
        for (let i in lArray) {
            if (lArray[i].checked === false) { thisArray.push(lArray[i])             }
        }
    }

    /* Create temporary Array consisting of only 'completed' items for Completed display */
    if (type === 'completed') {
        thisArray = [];
        for (let i in lArray) {
            if (lArray[i].checked === true) { thisArray.push(lArray[i])             }
        }
    }

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

        /* Check for Dark Mode before displaying items to avoid color clash */
        let listDisplay = "";
        let darkMode = (document.body.className === 'body-dark')
        if (darkMode) { listDisplay = 'li-dark' } else { listDisplay = 'li-light' }
    
        let newListItem = document.createElement('li');
        list.setAttribute('class', `${listDisplay}`)
        newListItem.innerHTML = newItem;

        /* Update <li> display properties if list item checked */
        if (thisArray[i].checked === true) {
            newListItem.children[0].children[1].setAttribute('class', `strikethrough`)
            newListItem.children[0].children[0].setAttribute('checked', 'checked')
        }

        /* Update <li> display properties if list item = priority */
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

function sortList() {
    for (let i in lArray) {
        if (lArray[i].checked === true ) {
            lArray[i].order = lArray.length
        } else if (lArray[i].priority === true ) {
            lArray[i].order = i - lArray.length;
        }
    }
    /* The syntax for the sort function below was written with the help of an external source - see Readme.md */
    lArray.sort(function(arr1, arr2) { return arr1.order - arr2.order });
    displayList();
}

/* Toggle between Light / Dark Mode when toggle-theme button is clicked */
function toggleTheme() {
    let darkMode = (document.body.className === 'body-dark')
    if (darkMode) {
        document.body.setAttribute('class', 'body-light');
        document.getElementById('controls-section').setAttribute('class', 'light');
        document.getElementById('add-new-item-box').setAttribute('class', 'light');
        document.getElementById('import-button').setAttribute('class', 'light');
        document.getElementById('export-button').setAttribute('class', 'light');
        document.getElementById('sort-button').setAttribute('class', 'light');
        let x = document.getElementsByTagName('li');
        for (let i = 0; i < x.length; i++) {
            console.log(x[i])
            x[i].setAttribute('class', 'li-light') }
    } else {
        document.body.setAttribute('class', 'body-dark')
        document.getElementById('controls-section').setAttribute('class', 'dark');
        document.getElementById('add-new-item-box').setAttribute('class', 'dark');
        document.getElementById('import-button').setAttribute('class', 'dark');
        document.getElementById('export-button').setAttribute('class', 'dark');
        document.getElementById('sort-button').setAttribute('class', 'dark');
        let x = document.getElementsByTagName('li');
        for (let i = 0; i < x.length; i++) {
            console.log(x[i])
            x[i].setAttribute('class', 'li-dark') }
        }
    displayList();
}