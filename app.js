//BUDGET CONTROLLER: model to store the data
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    //create an object to contain all the data we need, instead of define var all over the place
    var data = {
        allItems : {
            exp: [],
            inc: []
        },
        totals: {
            exp :0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(item => sum += item.value);
        data.totals[type] = sum;
    };


    return {
        addItem : function(type, des, val){
            var newItem, ID;
            //create new id based on id of the last element's id in the array

            ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length-1].id + 1 : 0;
            if(type === 'exp'){
                newItem = new Expense(ID, des,val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of income that we spent
            if(data.totals.inc > 0 ){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget : function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
        testing : function(){
            console.log(data);
        }
    }

})();

//UI CONTROLLER: view to present the data
var UIController = (function(){
    //get all dom element in DOMstrings object and expose to controller.So when we need to change class name/id this is the only change we need to make
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        intputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    return {
        getinput: function(){
            return {
                 type : document.querySelector(DOMstrings.inputType).value,//inc as +, exp as -
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        getDOMstrings: function(){
            return DOMstrings  
        },
        addListItem: function(obj, type){
            
            var html, newHtml, element;
            //1. create html placeholder
            if(type === 'inc'){
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.incomeContainer;
            }else if(type === 'exp'){
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.expenseContainer;
            }
            //2. replace placeholder with actual values
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //3. insert new html to UI
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        clearFields: function(){
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
           
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        }
    };
})();

//CONTROLLER: link model and view 
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.intputBtn).addEventListener('click', ctrlAdd);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAdd();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){
        //1. calculate the budget
        budgetCtrl.calculateBudget();
        //2. return the budget
        var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI
        var obj = budgetCtrl.getBudget();
        UICtrl.displayBudget(obj);
    }

    var ctrlAdd = function(){
        var input, newItem;
        //1. get field input data
         input = UICtrl.getinput();
         if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Add an item to the budgetController 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI 
            UICtrl.addListItem(newItem, input.type);
            //4. clear the fields
            UICtrl.clearFields();
            //5. update the budget
            updateBudget();
            
         }
    };
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
            //1. delete the item from the data 

            //2. delete the item from UI

            //3. update and show the new budget.
        }
    }

    return {
        init: function(){
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();