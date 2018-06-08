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
        totalCalories: 0

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
        }
    }

})();

///////////////////////////////////////////UI controller

const UICtrl = (function () {

    const UISelectors = {
      itemList: '#item-list',
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


        //hiding edit state(hiding dele, update and back button)
        clearEditState: function () {

            UICtrl.cleaFields();

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

        showItemToEdit: function (itemToEdit) {

            document.querySelector(UISelectors.itemNameInput).value = itemToEdit.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = itemToEdit.calories;

            UICtrl.showEditState();

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
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)

    };

    //onItemAddSubmit


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

    //itemUpdateSubmit

    const itemUpdateSubmit = function (e) {
        e.preventDefault();

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

        }

    }

})(ItemCtrl, UICtrl);


App.init();