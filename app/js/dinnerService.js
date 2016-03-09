// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
dinnerPlannerApp.factory('Dinner',function ($resource) {
  
  var numberOfGuest = 2;


  this.setNumberOfGuests = function(num) {
    numberOfGuest = num;
  }

  this.getNumberOfGuests = function() {
    return numberOfGuest;
  }


  // TODO in Lab 5: Add your model code from previous labs
  // feel free to remove above example code
  // you will need to modify the model (getDish and getAllDishes) 
  // a bit to take the advantage of Angular resource service
  // check lab 5 instructions for details

  this.apiKey = "sV1fPGQKrO0b6oUYb6w9kLI8BORLiWox";

  this.DishSearch = $resource('http://api.bigoven.com/recipes',{pg:1,rpp:25,api_key:'sV1fPGQKrO0b6oUYb6w9kLI8BORLiWox'});
  this.Dish = $resource('http://api.bigoven.com/recipe/:id',{api_key:'sV1fPGQKrO0b6oUYb6w9kLI8BORLiWox'}); 

  //Each menu has only one dich of a type (starter, main dish and dessert)
  var numberOfGuests = 1;
  this.menuOptions = [];

  this.Appetizer;
  this.MD;
  this.desserts;

  this.Appetizersprice = 0;
  this.MDprice = 0;
  this.dessertsprice = 0;

  //store the dish that was clicked
  var selectedDish = 1;

  //create null menu for testing
  this.createMenu = function () {
      this.menuOptions['Appetizers'] = 0;
      this.menuOptions['Main Dish'] = 0;
      this.menuOptions['Desserts'] = 0;
  }

  this.createMenu();

  //Adds the passed dish number to the menu. If the dish of that type already exists on the menu
  //it is removed from the menu and the new one added.
  this.addDishToMenu = function (dish, price) {
      console.log("Entered Add Dish to Menu");
      console.log("Dish Cateogory", dish.Category);
      console.log("Dish Price", price);
      //replace in the manu the dish of this type
      this.menuOptions[dish.Category] = dish.RecipeID;

      if (dish.Category == "Appetizers") {
          this.Appetizersprice = price;
          this.Appetizer = dish;
      } else if (dish.Category == "Main Dish") {
          this.MDprice = price;
          this.MD = dish;
      } else if (dish.Category == "Desserts") {
          this.dessertsprice = price;
          this.desserts = dish;
      }

      var args = {
          type: "add",
          content: dish
      };
  }



  //Returns the dish number that is on the menu for selected type 
  this.getSelectedDish = function (type) {
      return this.menuOptions[type];
  }

  //Returns all the dishes on the menu.
  this.getFullMenu = function () {
      console.log("Entered full menu")
      var fullMenu = [];
      fullMenu[0] = this.Appetizer;
      fullMenu[1] = this.MD;
      fullMenu[2] = this.desserts;

      return fullMenu;
  }

  //Returns the ingredients of one dish id
  this.getIngredients = function (id) {
      var theIngredients = [];
      for (key in dishes) {
          if (dishes[key].id == id) {
              theIngredients = dishes[key].ingredients;
          }
      }
      return theIngredients;
  }

  /* this.printIngredients = function (dish) {
       var printf = '';
       var current = '';
       for (var i = 0; i < dish.Ingredients.length; i++) {
           current = dish.Ingredients[i];
           printf = printf + current.Quantity + ' ' + current.Unit + ' ' + current.Name + ' ' + '</BR>';
       }
       return printf;
   }
   */

  this.printIngredients2 = function (dish) {
      var printf = '';
      var current = '';

      for (var i = 0; i < dish.Ingredients.length; i++) {
          current = dish.Ingredients[i];
          printf = printf + current.Quantity + ' ' + current.Unit + ' ' + current.Name + ' ' + '</BR>';
      }
      return printf;
  }

  /* this.ingredientsList += ' ' +
                      (model.getNumberOfGuests() * (arg.content.Ingredients[x].Quantity)) + ' ' +
                      arg.content.Ingredients[x].Unit + ' ' +
                      arg.content.Ingredients[x].Name + ' ' +
                      'SEK ' + (arg.content.Ingredients[x].Quantity) + '</span><br>';
                  this.totalPrice += (arg.content.Ingredients[x].Quantity);
                  */


  this.getDishPrice = function (dish) {
      var dishPrice = 0;
      for (var i = 0; i < dish.ingredients.length; i++) {
          var current = dish.ingredients[i];
          dishPrice += current.price;
      }
      return dishPrice;
  }
  this.getDishPrice2 = function (cat) {
      console.log("category = ", cat);
      var dishPrice = 0;
      if (cat == "Appetizers") {
          dishPrice = this.Appetizersprice;
      } else if (cat == "Main Dish") {
          dishPrice = this.MDprice;
      } else if (cat == "Desserts") {
          dishPrice = this.dessertsprice;
      }
      return dishPrice;
  }



  //Returns all ingredients for all the dishes on the menu.
  this.getAllIngredients = function () {
      var allIngredients = [];
      //for each menu option
      for (key in this.menuOptions) {
          var theIngredients = this.getIngredients(this.menuOptions[key]);
          //get ingredients
          for (var i = 0; i < theIngredients.length; i++) {
              allIngredients.push(theIngredients[i]);
          }
      }
      return allIngredients;
  }

  //Returns the total price of the menu (all the ingredients multiplied by number of guests).
  this.getTotalMenuPrice = function () {
      var totalMenuPrice = 0;
      totalMenuPrice = this.Appetizersprice + this.MDprice + this.dessertsprice;

      return (totalMenuPrice * this.getNumberOfGuests());
  }


  //Removes dish from menu
  this.removeDishFromMenu = function (id) {
      for (key in this.menuOptions) {
          if (this.menuOptions[key] == id) {
              this.menuOptions[key] = 0;
          }


      }
  }

  //Removes dish from menu
  this.removeDishFromMenu2 = function (type) {

      if (type == "Appetizers") {
          this.Appetizersprice = 0;
          this.Appetizer = {};
      } else if (type == "Main Dish") {
          this.MDprice = 0;
          this.MD = {};
      } else if (type == "Desserts") {
          this.dessertsprice = 0;
          this.desserts = {};
      }
  }

  this.setClickedDish = function (id) {
      selectedDish = id;
  }

  this.getClickedDish = function () {
      return selectedDish;
  }





  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return this;

});