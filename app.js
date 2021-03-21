/* Module Pattern - Keep pieces of code that are related to one another together inside separate, independent and organized units. Each of these modules will have variables and functions that are private i.e. it's only accessible inside of a module so that no other code can override our data. Our data and code is safe. Besides private variables and methods, we are also going to have public methods which means we expose them to public so that other functions or modules can access and use them. This is called data encapsulation.*/

// BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (currentElement) {
            sum += currentElement.value;
        });

        data.totals[type] = sum;
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

        deleteItem: function (type, id) {
            var IDs, index;
            IDs = data.allItems[type].map(function (currentElement) {
                return currentElement.id;
            });

            index = IDs.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            // Calculate total income and expenses
            calculateTotal('income');
            calculateTotal('expense');

            // Calculate the budget : income - expenses
            data.budget = data.totals.income - data.totals.expense;

            // Calculate the percentage of income that we spent
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.expense.forEach(function (currentElement) {
                currentElement.calcPercentage(data.totals.income);
            });
        },

        getPercentages: function () {
            var allPercentages = data.allItems.expense.map(function (currentElement) {
                return currentElement.getPercentage();
            });

            return allPercentages;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            };
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, integer, decimal;
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
         */
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        integer = numSplit[0];

        if (integer.length > 3) {
            integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
        }

        decimal = numSplit[1];

        return (type === 'expense' ? '-' : '+') + ' ' + integer + '.' + decimal;
    };

    var nodeListForEach = function (nodeList, callback) {
        for (var i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
        }
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
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

        displayBudget: function (obj) {
            var type;

            obj.budget > 0 ? type = 'income' : type = 'expense';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'expense');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentage: function (percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);

            nodeListForEach(fields, function (currentElement, index) {
                if (percentages[index] > 0) {
                    currentElement.textContent = percentages[index] + '%';
                } else {
                    currentElement.textContent = '---';
                }
            });
        },

        displayMonth: function () {
            var now, months, month, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changeType: function () {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function (currentElement) {
                currentElement.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changeType);
    };

    var updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        uiCtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with new percentages
        uiCtrl.displayPercentage(percentages);
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

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the budget controller
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            uiCtrl.deleteListItem(itemID);

            // 3. Update and display the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application has started');
            uiCtrl.displayMonth();
            uiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, uiController);

appController.init();