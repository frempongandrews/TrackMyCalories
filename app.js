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
            {
                id: 0, name: 'Steak Dinner', calories: 1200
            },

            {
                id: 1, name: 'Cookies', calories: 300
            },

            {
                id: 2, name: 'Eggs', calories: 400
            }
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
        }
    }

})();

////////////////////////////UI controller

const UICtrl = (function () {

    const UISelectors = {
      itemList: '#item-list',
    };

    //Public Methods
    return {
        populateItemList: function (items) {
            let html = '';


            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">&#9998;</a></li>`;
            });

            //insert list items

            document.querySelector(UISelectors.itemList).innerHTML = html;
        }
    }

})();

//////////////////////////////App controller

const App = (function (ItemCtrl, UICtrl) {

    console.log(ItemCtrl.logData());

    //Public Methods
    return {

        init: function () {
            console.log('initializing app...');

            //get items from data
            const items = ItemCtrl.getItems();
            console.log(items);

            //populate list with items
            UICtrl.populateItemList(items);

        }

    }

})(ItemCtrl, UICtrl);


App.init();