//Making the form work 
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

//declaring errors
let isError = false;
//Setting the str parameter inside the function

function cleanInputString(str){
   //Regex set up and using replacement method and cleaning extra spaces
   const regex = /[+-\s]/g; //g stands for global
   return str.replace(regex," ");
}
  
//console.log(cleanInputString("+-99"));

//creating a function for invalid input 
function isInvalidInput(str){
   //const regex = /[0-9]+e[0-9]+/i; //i stands for insensitive case and the + modifier matches patterns occuring once or multiple times.
   //short hand form
   const regex = /\d+e\d+/i;
   return str.match(regex);
}
//AddEntry function for user's inputs

function addEntry(){
   //const targetId = "#" + entryDropdown.value;
   //const targetInputContainer = document.querySelector(targetId + ' .input-container');
   //TargetID using string literals

   const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
   const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1; //The number 1 is added to prevent bugs that may occur in users selecting breakfast
   const HTMLString = `<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
                       <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"/>
                       <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
                       <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"/>`;
   //Adding insertAdjacenthTML () method which takes a string as its first argument by specifying its position while the second is the inserted HTML element.
   targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

//Setting a new function for users' calories inputs

function getCaloriesFromInputs(list){
   let calories = 0;
   

   //using for---of loop to iterate over elements in an iterable object that is like an array.

   for (const item of list){
      const currVal = cleanInputString(item.value);
      const invalidInputMatch = isInvalidInput(currVal);
      if (invalidInputMatch){
         alert(`Invalid Input: ${invalidInputMatch[0]}`);
        isError = true;
        return null;
      };
     calories += Number(currVal); 
   }
   return calories;
};

//Setting an event listener function with "e" as the parameter, to attach on the submit button event form when it is clicked.
function calculateCalories(e){
   //The following prevent the submit button to reload the page after it is clicked by using preventDefault () method.

   e.preventDefault();
   isError = false;
   
   //getting values number inputs entered by the users

   const breakfastNumberInputs = document.querySelectorAll(`#breakfast input[type='number']`);
   const lunchNumberInputs = document.querySelectorAll(`#lunch input[type='number']`);
   const dinnerNumberInputs = document.querySelectorAll(`#dinner input[type='number']`);
   const snacksNumberInputs = document.querySelectorAll(`#snacks input[type='number']`);
   const exerciseNumberInputs = document.querySelectorAll(`#exercise input[type='number']`);

   //getting the calories number inputs from the users.

   const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
   const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
   const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
   const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
   const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
   const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
   if(isError){
      return;
   }

   //preparing calculations

   const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
   const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
   const surplusOrDeficit = remainingCalories < 0? "Surplus" : "Deficit";

   //setting the output message using the interpolation method ${str} calorie ${str}

   output.innerHTML = `<span class ="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit} </span>
   <hr>
                     <p>${budgetCalories} Calories Budgeted</p>
                     <p>${consumedCalories} Calories Consumed</p>
                     <p>${exerciseCalories} Calories Burned</P>`;
   //ensuring that the output is visible by the use of .remove() method on an element that has classList property
   output.classList.remove('hide');
 
}
//Clearing the form 
function clearForm(){
   const inputContainers = Array.from(document.querySelectorAll('.input-container'));
   for(const container of inputContainers){
      //clears inputs fields inside each  containers
      container.innerHTML = "";
   }
   budgetNumberInput.value = "";
   output.innerText = "";
   output.classList.add('hide');
};

 //adding the eventlistener to the button for its behavior. 
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit",calculateCalories);
clearButton.addEventListener("click",clearForm);