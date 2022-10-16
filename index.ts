import API_KEY from './env.js'

const recipeContainer = document.querySelector('#recipe-container')
const photo = document.querySelector('img')
const tagsContainer = document.querySelector('#tags')
const title = document.querySelector('h2')
const timeInfo = document.querySelector('#time-info') as HTMLParagraphElement
const priceInfo = document.querySelector('#price-info') as HTMLParagraphElement
const list = document.querySelector('ul')
const instructions = document.querySelector('#instructions') as HTMLParagraphElement
const nextBtn = document.querySelector('button')

let recipe: {
  tags: string[] //vegetarian, vegan, glutenFree, dairyFree, veryHealthy, lowFoodmap
  pricePerServing: number
  ingredients: string[]
  title: string
  time: number
  servings: number
  source: string
  image: string
  instructions: string
} = {
  tags: [],
  pricePerServing: undefined,
  ingredients: [],
  title: undefined,
  time: undefined,
  servings: undefined,
  source: undefined,
  image: undefined,
  instructions: undefined,
}

const updateSite = () => {
  photo.src = recipe.image
  photo.alt = recipe.title
  tagsContainer.innerHTML = ''
  recipe.tags.forEach((i) => {
    const tag = tagsContainer.appendChild(document.createElement('p'))
    tag.classList.add('tag')
    tag.innerText = i
  })
  title.innerText = recipe.title
  timeInfo.innerText = `${recipe.time} min`
  priceInfo.innerText = `$${recipe.pricePerServing.toFixed(2)} * ${recipe.servings}`
  list.innerHTML = ''
  recipe.ingredients.forEach((i) => {
    const item = list.appendChild(document.createElement('li'))
    item.innerText = i
  })
  instructions.innerHTML = recipe.instructions
  if (recipeContainer.classList.contains('waiting')) recipeContainer.classList.remove('waiting')
}

const options = {
  method: 'GET',
}
const getRecipe = () => {
  fetch(`https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=1`, options)
    .then((res) => res.json())
    .then((res) => res.recipes[0])
    .then((res) => {
      recipe.tags = []
      recipe.ingredients = []
      if (res.dairyFree) recipe.tags.push('Dairy Free')
      if (res.glutenFree) recipe.tags.push('Gluten Free')
      if (res.lowFoodmap) recipe.tags.push('Low Foodmap')
      if (res.vegan) recipe.tags.push('Vegan')
      if (res.vegetarian) recipe.tags.push('Vegetarian')
      if (res.veryHealthy) recipe.tags.push('Very Healthy')
      recipe.pricePerServing = res.pricePerServing / 100
      res.extendedIngredients.forEach((i) => recipe.ingredients.push(i.original))
      recipe.title = res.title
      recipe.time = res.readyInMinutes
      recipe.servings = res.servings
      recipe.source = res.sourceUrl
      recipe.image = res.image
      recipe.instructions = res.instructions
    })
    .then(() => updateSite())
    .catch((err) => console.error(err))
}
getRecipe()

nextBtn.addEventListener('click', () => getRecipe())
