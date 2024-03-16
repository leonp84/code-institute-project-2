/* Declare 2 x Global Variables */
let lArray = [];
let soundEffects = false;

/* Add Click & Hover Eventlisteners once page has loaded */
document.addEventListener('DOMContentLoaded', function() { 
    document.getElementById('userInput').addEventListener('keydown', 
        function(event) { if (event.key === 'Enter') { addItem(); } });
    document.getElementById('priority-button').addEventListener('click', 
        function() { addItem(); });
    document.getElementById('active-clicked').addEventListener('click', 
        function() { displayList('active'); });
    document.getElementById('done-clicked').addEventListener('click', 
        function() { displayList('completed'); });
    document.getElementById('all-clicked').addEventListener('click', 
        function() { displayList('all'); });
    document.getElementById('priority-box').addEventListener('mouseover', 
        hoverEffect);
    document.getElementById('clear-clicked').addEventListener('click', 
        clearCompleted);
    document.getElementById('sort-button').addEventListener('click', 
        sortList);
    document.getElementById('toggle-theme').addEventListener('click', 
        toggleTheme);
    document.getElementById('toggle-sound').addEventListener('click', 
        toggleSound);

    let buttons = document.getElementsByTagName('button'); 
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('mouseover', buttonHover);
    }

    let links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', preventLoad);
    }

    /* Add 3 items to Todo list as GUI elements to guide the user */
    document.getElementById('userInput').value = "1.";
    addItem('Your First Todo Item...');
    document.getElementById('userInput').value = "2.";
    addItem('Click the X to delete --->');
    document.getElementById('priority-button').checked = true;
    document.getElementById('userInput').value = "3.";
    addItem('Add more above: priority optional :)');

});

/**
 * Add a new Todo item
 */
function addItem(userInput) {
    /* Ensure Empty input or spaces are not accepted as valid */
    if (!document.getElementById('userInput').value.match(/[A-Za-z0-9]/g)) { 
        clearFocus();
        return; 
    }
    if (!userInput) { userInput = document.getElementById('userInput').value; }

    /* Ensure duplicate items are not accepted as valid */
    for (let i in lArray) {
        if (lArray[i].content === userInput) {
            alert("You've already added this item :)");
            clearFocus();
            return;
        }
    }

    /* Add new item to Array */
    let priorityStatus = document.getElementById('priority-button').checked;
    let order = lArray.length;
    lArray.push( {
        'order' : order,
        'content' : userInput,
        'checked' : false,
        'priority' : priorityStatus
     });   

    /* Sound Effect - if enabled */
    if (soundEffects) { document.getElementById('additem-audio').play(); }

    displayList();
    clearFocus();
}

/**
 * Clear input fields and place keyboard focus on input box
 */
function clearFocus() {
    document.getElementById('userInput').value = "";
    document.getElementById('userInput').focus();
    document.getElementById('priority-button').checked = false;
}

/**
 * Display Updated List
 */
function displayList(type) {
    /* Reorder List Items for avoid sorting function not working */
    for (let i = 0; i < lArray.length; i++) {
        lArray[i].order = i;
    }

    /* Display Vacation message if list is empty */
    if (lArray.length === 0) {
        let list = document.body.getElementsByTagName('ul')[0];
        let newItem = `
            <div id="vacation-message">
                <span><i class="fa-solid fa-martini-glass-citrus"></i></span>
                <p>"And on the seventh day... God rested from all his work."<br><em>(Tip for longevity: You should too!)</em></p>
                <span><i class="fa-solid fa-umbrella-beach"></i></span>
            </div>`;
        list.innerHTML = newItem;
        document.getElementById('items-left').innerHTML = `0 items left`;
        return;
    }

    /* Remove old displayed list */
    let list = document.body.getElementsByTagName('ul')[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    let thisArray = lArray;

    /* Create temporary Array consisting of only 'active' items for Active display */
    if (type === 'active') {
        thisArray = [];
        for (let i in lArray) {
            if (lArray[i].checked === false) { thisArray.push(lArray[i]); }
        }
        /* Sound Effect - if enabled */
        if (soundEffects) { document.getElementById('button-audio').play(); }
    }

    /* Create temporary Array consisting of only 'completed' items for Completed display */
    if (type === 'completed') {
        thisArray = [];
        for (let i in lArray) {
            if (lArray[i].checked === true) { thisArray.push(lArray[i]); }
        }
            /* Sound Effect - if enabled */
            if (soundEffects) { document.getElementById('button-audio').play(); }
    }

    if (type === 'all') {
        if (soundEffects) { document.getElementById('button-audio').play(); } }

    /* Add new item with specified properties, using custom HTML */
     for (let i = 0; i < thisArray.length; i++) {
        let newItem = `
        <div id="list-display-first-box">
            <span id="checkbox"><i class="fa-regular fa-circle"></i></span>
            <span id="item-text-display">${thisArray[i].content}</span>
        </div>
        <div id="no-wrap-box">
            <span class="not-priority"><i class="fa-solid fa-circle-up"></i></span>
            <span class="remove"><i class="fa-regular fa-circle-xmark"></i></i></span>
        </div>`;

        /* Check for Dark Mode before displaying items to avoid color clash */
        let listDisplay = "";
        let darkMode = (document.body.className === 'body-dark');
        if (darkMode) { listDisplay = 'li-dark'; } else { listDisplay = 'li-light'; }
    
        let newListItem = document.createElement('li');
        newListItem.setAttribute('class', `${listDisplay}`);
        newListItem.innerHTML = newItem;

        /* Update <li> display properties if list item checked */
        if (thisArray[i].checked === true) {
            newListItem.children[0].children[1].setAttribute('class', `strikethrough`);
            newListItem.children[0].children[0].innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
        }

        /* Update <li> display properties if list item = priority */
        if (thisArray[i].priority === true) {
            newListItem.children[1].children[0].setAttribute('class', 'priority');
        }

        /* Add Click & Hover Eventlisteners to newly populated <li> items */
        let checkbutton = newListItem.children[0].children[0];
        checkbutton.addEventListener('click', strikeItem);
        checkbutton.addEventListener('mouseover', hoverEffect);
        let xButton = newListItem.children[1].children[1];
        xButton.addEventListener('mouseover', hoverEffect);
        xButton.addEventListener('click', removeItem);
        let itemText = newListItem.children[0].children[1];
        itemText.addEventListener('mouseover', hoverEffect);
        itemText.addEventListener('click', editItemText);

        /* Add new List item to the bottom of the current list */
        list.appendChild(newListItem);
    }

    /* Update "Show Items Left at the bottom of the list" */
    let itemsLeft = document.getElementById('items-left');
    let itemsLeftNumber = 0;
    for (let i in lArray) {
        if (lArray[i].checked !== true ) { itemsLeftNumber++; }}
    itemsLeft.innerHTML = `${itemsLeftNumber} items left`;
}

/**
 * Add Strikethrough text decoration to item for Todo List, when checked
 */
function strikeItem () {
    for (let i in lArray) {
        if (this.nextElementSibling.textContent === lArray[i].content) {
            lArray[i].checked = (lArray[i].checked === true) ? false : true;
            lArray[i].priority = false;
        }
    }
    displayList();

    /* Sound Effect - if enabled */
    if (soundEffects) { document.getElementById('strikethrough-audio').play(); }
}


/**
 * Remove item from Todo list
 */
function removeItem () {
    let tempArray = [];
    for (let i in lArray) {
        if (this.parentNode.previousElementSibling.children[1].textContent !== lArray[i].content) {
            tempArray.push(lArray[i]); 
    }}
    lArray = tempArray;
    displayList();
}

/**
 * Edit Item Text and update list in real time
 */
function editItemText() {
    let numToChange = 0;
    for (let i in lArray) {
        if (lArray[i].content == this.textContent) { numToChange = i; }
    }

    let replace = document.createElement('input');
    replace.type = "text";
    replace.id = "editing";
    replace.setAttribute('class', 'listDisplay');
    replace.value = this.textContent;
    this.parentNode.appendChild(replace);
    this.remove();
    document.getElementById('editing').focus();
  
    document.getElementById('editing').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        let newContent = document.getElementById('editing').value; 
        lArray[numToChange].content = newContent;
        displayList();
    }});
}

/**
 * Completely Erase striked/checked items from List/Array
 */
function clearCompleted () {
    let tempArray = [];
    for (let i in lArray) { if (lArray[i].checked !== true) { 
        tempArray.push(lArray[i]); 
    }}
    lArray = tempArray;

    /* Sound Effect - if enabled */
    if (soundEffects) { document.getElementById('clear-audio').play(); }

    displayList();
}

/**
 * Sorts the Array with checked items at the bottom, and priority items on top
 */
function sortList() {
    for (let i in lArray) {
        if (lArray[i].checked === true ) {
            lArray[i].order = lArray.length;
        } else if (lArray[i].priority === true ) {
            lArray[i].order = i - lArray.length;
        }
    }
    
    /* The syntax for the sort function below was written with the help of an external source - see Readme.md */
    lArray.sort(function(arr1, arr2) { return arr1.order - arr2.order; });

    /* Sound Effect - if enabled */
    if (soundEffects) { document.getElementById('sort-audio').play(); }

    displayList();
}

/**
 * Toggle between Light / Dark Mode when toggle-theme button is clicked
 */
function toggleTheme() {
    let darkMode = (document.body.className === 'body-dark');
    if (darkMode) {
        document.body.setAttribute('class', 'body-light');
        document.getElementById('controls-section').setAttribute('class', 'light');
        document.getElementById('add-new-item-box').setAttribute('class', 'light');
        document.getElementById('import-button').setAttribute('class', 'light');
        document.getElementById('export-button').setAttribute('class', 'light');
        document.getElementById('sort-button').setAttribute('class', 'light');
        let x = document.getElementsByTagName('li');
        for (let i = 0; i < x.length; i++) {
            x[i].setAttribute('class', 'li-light'); }

        /* Change Theme Icon when Clicked */
        document.getElementById('toggle-theme').setAttribute('class', 'fa-solid fa-moon');

    } else {
        document.body.setAttribute('class', 'body-dark');
        document.getElementById('controls-section').setAttribute('class', 'dark');
        document.getElementById('add-new-item-box').setAttribute('class', 'dark');
        document.getElementById('import-button').setAttribute('class', 'dark');
        document.getElementById('export-button').setAttribute('class', 'dark');
        document.getElementById('sort-button').setAttribute('class', 'dark');
        let x = document.getElementsByTagName('li');
        for (let i = 0; i < x.length; i++) {
            x[i].setAttribute('class', 'li-dark'); }
        
        /* Change Theme Icon when Clicked */
        document.getElementById('toggle-theme').setAttribute('class', 'fa-solid fa-sun');

        }
    displayList();
}

/**
 * Toggle Sound On or Off
 */
function toggleSound() { 
    let soundButton = document.getElementById('toggle-sound');
    let soundOff = (soundButton.className === "fa-solid fa-volume-xmark");
    
    if (soundOff) {
        soundButton.className = "fa-solid fa-volume-high";
        soundEffects = true;
    } else {
        soundButton.className = "fa-solid fa-volume-xmark";
        soundEffects = false;
    }
}

/**
 * Enable Hover effect for interactive elements on page
 */
function hoverEffect() {
    let currentClass = this.className;
    this.setAttribute('class', 'hoverClass');
    this.addEventListener('mouseout', function() {
        this.setAttribute('class', currentClass);
    });
}

/**
 * Enable Hover effect for interactive button elements on page
 */
function buttonHover() {
    let currentClass = this.className;
    this.setAttribute('class', `${currentClass} buttonHoverClass`);
    this.addEventListener('mouseout', function() {
        this.setAttribute('class', currentClass);
    });
}

/**
 * Prevent anchor elements from reloading the page (aside from footer link)
 */
function preventLoad(event) {
    if (this.textContent !== "L.A. Potgieter") {
    event.preventDefault();    
    }
}