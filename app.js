/* Module Pattern - Keep pieces of code that are related to one another together inside separate, independent and organized units. Each of these modules will have variables and functions that are private i.e. it's only accessible inside of a module so that no other code can override our data. Our data and code is safe. Besides private variables and methods, we are also going to have public methods which means we expose them to public so that other functions or modules can access and use them. This is called data encapsulation.*/

// BUDGET CONTROLLER
var budgetController = (function () {

})();

// UI CONTROLLER
var uiController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();

// GLOBAL APP CONTROLLER
var appController = (function (budgetCtrl, uiCtrl) {
    var DOM = uiCtrl.getDOMStrings();

    var ctrlAddItem = function () {
        var input;

        // 1. Get the field input data
        input = uiCtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Clear the fields

        // 5. Calculate and update budget

    };

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Enter' || event.key === 'Enter') {
            ctrlAddItem();
        }
    });
})(budgetController, uiController);