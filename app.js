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
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    };

    //Public Methods
    return {
        populateItemList: function (items) {

            let li = document.createElement('li');




                items.forEach(function (item) {

                    li.className = 'collection-item';
                    li.id = `item-${item.id}`;
                    li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">&#9998;</a>`;
                    document.querySelector(UISelectors.itemList).appendChild(li);


                });




            //insert list items


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

    };

    //onItemAddSubmit

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


        //clear input fields

        UICtrl.cleaFields();


    };

    ///////////////////////////////////////////Public Methods
    return {



        init: function () {

            console.log('initializing app...');

            //get items from data
            const items = ItemCtrl.getItems();
            console.log(items);

            //populate list with items
            UICtrl.populateItemList(items);




            //load event listeners

            loadEventListeners();

        }

    }

})(ItemCtrl, UICtrl);


App.init();