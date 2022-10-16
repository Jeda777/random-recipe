import API_KEY from './env.js';
var recipeContainer = document.querySelector('#recipe-container');
var photo = document.querySelector('img');
var tagsContainer = document.querySelector('#tags');
var title = document.querySelector('h2');
var timeInfo = document.querySelector('#time-info');
var priceInfo = document.querySelector('#price-info');
var list = document.querySelector('ul');
var instructions = document.querySelector('#instructions');
var nextBtn = document.querySelector('button');
var recipe = {
    tags: [],
    pricePerServing: undefined,
    ingredients: [],
    title: undefined,
    time: undefined,
    servings: undefined,
    source: undefined,
    image: undefined,
    instructions: undefined
};
var updateSite = function () {
    photo.src = recipe.image;
    photo.alt = recipe.title;
    tagsContainer.innerHTML = '';
    recipe.tags.forEach(function (i) {
        var tag = tagsContainer.appendChild(document.createElement('p'));
        tag.classList.add('tag');
        tag.innerText = i;
    });
    title.innerText = recipe.title;
    timeInfo.innerText = "".concat(recipe.time, " min");
    priceInfo.innerText = "$".concat(recipe.pricePerServing.toFixed(2), " * ").concat(recipe.servings);
    list.innerHTML = '';
    recipe.ingredients.forEach(function (i) {
        var item = list.appendChild(document.createElement('li'));
        item.innerText = i;
    });
    instructions.innerHTML = recipe.instructions;
    if (recipeContainer.classList.contains('waiting'))
        recipeContainer.classList.remove('waiting');
};
var options = {
    method: 'GET'
};
var getRecipe = function () {
    fetch("https://api.spoonacular.com/recipes/random?apiKey=".concat(API_KEY, "&number=1"), options)
        .then(function (res) { return res.json(); })
        .then(function (res) { return res.recipes[0]; })
        .then(function (res) {
        recipe.tags = [];
        recipe.ingredients = [];
        if (res.dairyFree)
            recipe.tags.push('Dairy Free');
        if (res.glutenFree)
            recipe.tags.push('Gluten Free');
        if (res.lowFoodmap)
            recipe.tags.push('Low Foodmap');
        if (res.vegan)
            recipe.tags.push('Vegan');
        if (res.vegetarian)
            recipe.tags.push('Vegetarian');
        if (res.veryHealthy)
            recipe.tags.push('Very Healthy');
        recipe.pricePerServing = res.pricePerServing / 100;
        res.extendedIngredients.forEach(function (i) { return recipe.ingredients.push(i.original); });
        recipe.title = res.title;
        recipe.time = res.readyInMinutes;
        recipe.servings = res.servings;
        recipe.source = res.sourceUrl;
        recipe.image = res.image;
        recipe.instructions = res.instructions;
    })
        .then(function () { return updateSite(); })["catch"](function (err) { return console.error(err); });
};
getRecipe();
nextBtn.addEventListener('click', function () { return getRecipe(); });
