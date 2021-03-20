/* Module Pattern - Keep pieces of code that are related to one another together inside separate, independent and organized units. Each of these modules will have variables and functions that are private i.e. it's only accessible inside of a module so that no other code can override our data. Our data and code is safe. Besides private variables and methods, we are also going to have public methods which means we expose them to public so that other functions or modules can access and use them. This is called data encapsulation.*/

// BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    /* var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
    var totalIncomes = 0; */

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
    };

    return {
        addItem: function (type, desc, val) {
            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'income' or 'expense' type
            if (type === 'expense') {
                newItem = new Expense(ID, desc, val);
            } else if (type === 'income') {
                newItem = new Income(ID, desc, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new item
            return newItem;
        },

        testing: function () {
            console.log(data);
        }
    };
})();

// UI CONTROLLER
var uiController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'income') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expense') {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (currentElement, index, array) {
                currentElement.value = '';
            });

            fieldsArr[0].focus();
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();

// GLOBAL APP CONTROLLER
var appController = (function (budgetCtrl, uiCtrl) {
    var setupEventListeners = function () {
        var DOM = uiCtrl.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keydown', function (event) {
            if (event.code === 'Enter' || event.key === 'Enter') {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {
        // 1. Calculate the budget

        // 2. Return the budget

        // 3. Display the budget on the UI

    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = uiCtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            uiCtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            uiCtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }
    };

    return {
        init: function () {
            console.log('Application has started');
            setupEventListeners();
        }
    };
})(budgetController, uiController);

appController.init();