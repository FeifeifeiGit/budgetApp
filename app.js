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
        }
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
        expenseContainer: '.expenses__list'
    }
    return {
        getinput: function(){
            return {
                 type : document.querySelector(DOMstrings.inputType).value,//inc as +, exp as -
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function(){
            return DOMstrings  
        },
        addListItem: function(obj, type){
            
            var html, newHtml, element;
            //1. create html placeholder
            if(type === 'inc'){
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.incomeContainer;
            }else if(type === 'exp'){
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.expenseContainer;
            }
            //2. replace placeholder with actual values
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //3. insert new html to UI
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
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
    };

    

    var ctrlAdd = function(){
        var input, newItem;
        //1. get field input data
         input = UICtrl.getinput();
        //2. Add an item to the budgetController 
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3. Add the item to the UI 
         UICtrl.addListItem(newItem, input.type);
        //4. Calculate the budget

        //5. Display the budget;
    };

    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();