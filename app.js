//storage controller

///////////////////////////////Item controller

const ItemCtrl = (function () {
    //item constructor

    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data structure / State


    const data = {

        items: [
            // {
            //     id: 0, name: 'Steak Dinner', calories: 1200
            // },
            //
            // {
            //     id: 1, name: 'Cookies', calories: 300
            // },
            //
            // {
            //     id: 2, name: 'Eggs', calories: 400
            // }
        ],

        currentItem: null,
        totalCalories: 0,
        isEditing: false

    };


    ////Public Methods
    return {
        getItems: function () {
          return data.items;
        },
        logData: function () {
            return data;
        },

        getItemById: function (id) {
            return data.items.filter((item) => {
                return item.id === id;
            })[0];


        },

        updateItem: function (name, calories) {

            calories = parseInt(calories);

            let found = null;


            //update items state
            data.items.forEach((item) => {
                if(item.id === data.currentItem.id) {

                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },

        getCurrentItem: function () {
          return data.currentItem;
        },

        getTotalCalories: function () {
            let total = 0;
            data.items.forEach((item) => {
                return total += item.calories;
            });

            data.totalCalories = total;
            return data.totalCalories;
        },

        addItem: function (name, calories) {


           let itemId = data.items.length;
           let itemName = name;
           let itemCalories = parseInt(calories);


            let item = new Item(itemId, itemName, itemCalories);

            let newItems = data.items.concat(item);
            data.items = newItems;

            //show new item in list
            UICtrl.populateItemList(data.items);
        },

        deleteItem: function (id) {

            //get ids

            let ids = data.items.map((item) => {
                return item.id;
            });

            //get index

            const index = ids.indexOf(id);

            //removing from items array
            data.items.splice(index, 1);


            //todo
            //remove from DOM

            data.currentItem = null;

        },

        setEditingState: function (bool) {
             data.isEditing = bool;
        },

        getEditingState: function () {
            return data.isEditing;
        }
    }

})();

///////////////////////////////////////////UI controller

const UICtrl = (function () {

    const UISelectors = {
      itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        noItemsText: '.no-items-text',
        totalCalories: '.total-calories'
    };

    //Public Methods
    return {
        populateItemList: function (items) {

            let li = document.createElement('li');

                items.forEach(function (item) {

                    li.className = 'collection-item';
                    li.id = `item-${item.id}`;
                    li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="fas fa-pencil-alt edit-item"></i></a>`;
                    document.querySelector(UISelectors.itemList).appendChild(li);


                });




        },


        getItemInput: function () {

            return {

                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value

            }

        },

        cleaFields: function () {

            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        showTotalCalories: function (totalCalories) {

            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;

        },


        //hiding edit state(hiding delete, update and back button)
        clearEditState: function () {

            UICtrl.cleaFields();

            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },

        removeEditState: function (e) {
            e.preventDefault();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function () {


            //show delete, update and back buttons
            document.querySelector(UISelectors.updateBtn).style.display ='inline';
            document.querySelector(UISelectors.deleteBtn).style.display ='inline';
            document.querySelector(UISelectors.backBtn).style.display ='inline';
            document.querySelector(UISelectors.addBtn).style.display ='none';

        },

        //showing item to edit values in input
        showItemToEdit: function (itemToEdit) {

            document.querySelector(UISelectors.itemNameInput).value = itemToEdit.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = itemToEdit.calories;

            UICtrl.showEditState();

        },

        updateListItem: function (updatedItem) {

            let listItems = document.querySelectorAll(UISelectors.listItems);

            //from nodelist to array

            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {

                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${updatedItem.id}`) {


                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em><a href="#" class="secondary-content"><i class="fas fa-pencil-alt edit-item"></i></a>`;

                }

            });

            //get tot calories
            let totalCalories = ItemCtrl.getTotalCalories();
            //insert total calories
            UICtrl.showTotalCalories(totalCalories);

            //clear input fields

            UICtrl.clearEditState();



        },

        deleteListItem: function (id) {

            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();


            //get tot calories
            let totalCalories = ItemCtrl.getTotalCalories();
            //insert total calories
            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearEditState();

        },


        getSelectors: function () {
            return UISelectors;
        }
    }

})();

//////////////////////////////////////////App controller

const App = (function (ItemCtrl, UICtrl) {

    //load event listeners

    const loadEventListeners = function () {

        //get UISelectors
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', onItemAddSubmit);

        //Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', onEditItem);

        //add event listener to update btn
        document.querySelector(UISelectors.updateBtn).addEventListener('click', onItemEditSubmit);

        //add event back btn
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.removeEditState);

        //delete
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    };




    //adding meal to list
    const onItemAddSubmit = function (e) {
        //prevent form submission
        e.preventDefault();


        //get form input from UICtrl
        //to check if anything is inserted
        const input = UICtrl.getItemInput();



        //checking
        if (input.name.length < 1 || input.calories.length < 1 || input.name.length < 1 && input.calories.length < 1) {
            return;
        }


        //adding the item to list
        ItemCtrl.addItem(input.name, input.calories);




        //get tot calories
        let totalCalories = ItemCtrl.getTotalCalories();
        //insert total calories
        UICtrl.showTotalCalories(totalCalories);

        //clear input fields

        UICtrl.cleaFields();




    };

    //onEditItem

    const onEditItem = function (e) {
        e.preventDefault();
        //set editing state on Item to true
        ItemCtrl.setEditingState(true);

        //remove keypress function which adds current editing item
        App.onRemoveKeyPressAddItem();

        // console.log(e.target.classList);

        if (e.target.classList.contains('edit-item')) {
            //console.log('worked');

            //get item clicked id
            const listItemId = e.target.parentNode.parentNode.id;
            //console.log(listItemId);
            let itemId = parseInt(listItemId[listItemId.length - 1]);
            // console.log(itemId);

            let itemToEdit = ItemCtrl.getItemById(itemId);

            // console.log(itemToEdit);

            UICtrl.showItemToEdit(itemToEdit);

            //set currentItem
            ItemCtrl.setCurrentItem(itemToEdit);

            // console.log(ItemCtrl.getCurrentItem());
        }

    };


    const onItemEditSubmit = function (e) {
        e.preventDefault();
        console.log('update works');
        ItemCtrl.setEditingState(false);

        //todo

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //updating ui of the update
        UICtrl.updateListItem(updatedItem);

    };

    const itemDeleteSubmit = function (e) {
        e.preventDefault();


        console.log('deleting');

        const currentItem = ItemCtrl.getCurrentItem();

        //delete from items arr
        ItemCtrl.deleteItem(currentItem.id);

        //remove from ui
        UICtrl.deleteListItem(currentItem.id);
    };





    ///////////////////////////////////////////Public Methods
    return {



        init: function () {

            //clear edit state/set initial state
            UICtrl.clearEditState();

            console.log('initializing app...');

            //get items from data
            const items = ItemCtrl.getItems();
            console.log(items);

            //populate list with items
            UICtrl.populateItemList(items);

            //get tot calories
            let totalCalories = ItemCtrl.getTotalCalories();
            //insert total calories
            UICtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListeners();

        },

        //remove adding item functionality from 'Enter' key when in editing state
        onRemoveKeyPressAddItem: function () {
            //get editing state
            if (ItemCtrl.getEditingState()) {
                document.addEventListener('keypress', function (e) {

                    if (e.keyCode === 13 || e.which === 13) {
                        e.preventDefault();
                        return false;
                    }

                })
            }
        }

    }

})(ItemCtrl, UICtrl);


App.init();