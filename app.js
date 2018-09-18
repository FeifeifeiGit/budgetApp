//BUDGET CONTROLLER: model to store the data
var budgetController = (function(){
    var x = 1;
    return {
        publictTest: function(){
            console.log(x);
        }
    }
})();

//UI CONTROLLER: view to present the data
var UIController = (function(){


    return {

    }
})();

//CONTROLLER: link model and view 
var controller = (function(budgetCtrl, UICtrl){
    var ctrlAdd = function(){
        //1. get field input data

        //2. Add an item to the budgetController 

        //3. Add the item to the UI 

        //4. Calculate the budget

        //5. Display the budget;
    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAdd);
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAdd();
        }
    });
})(budgetController, UIController);

