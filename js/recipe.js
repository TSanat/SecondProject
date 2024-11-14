const apiKey = 'cf2d96b58edf4e55be891ed14d928480';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchRecipes(query) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=20&apiKey=${apiKey}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}
function displayRecipes(recipes) {
  const recipeGrid = document.getElementById('recipeGrid');
  recipeGrid.innerHTML = '';

  if (Array.isArray(recipes) && recipes.length > 0) {
    recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';

      recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <button onclick="openRecipeDetails(${recipe.id})">View Details</button>
      `;
      recipeGrid.appendChild(recipeCard);
    });
  } else {
    recipeGrid.innerHTML = '<p>No recipes found. Please try a different search.</p>';
  }
}

document.getElementById('searchBar').addEventListener('input', async (event) => {
  const query = event.target.value;
  if (query) {
    const recipes = await fetchRecipes(query);
    displayRecipes(recipes);
  } else {
    document.getElementById('recipeGrid').innerHTML = '';
  }
});

async function openRecipeDetails(recipeId) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${apiKey}`);
    const recipeDetails = await response.json();

    document.getElementById('recipeTitle').textContent = recipeDetails.title;
    document.getElementById('recipeImage').src = recipeDetails.image;
    document.getElementById('prepTime').textContent = `${recipeDetails.readyInMinutes} minutes`;

    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = '';
    recipeDetails.extendedIngredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = `${ingredient.amount} ${ingredient.unit} of ${ingredient.name}`;
      ingredientsList.appendChild(li);
    });

    const instructionsList = document.getElementById('instructionsList');
    instructionsList.innerHTML = '';
    recipeDetails.analyzedInstructions[0]?.steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step.step;
      instructionsList.appendChild(li);
    });

    const nutritionalInfo = document.getElementById('nutritionalInfo');
    if (recipeDetails.nutrition && recipeDetails.nutrition.nutrients) {
      const nutrients = recipeDetails.nutrition.nutrients;
      const calories = nutrients.find(nutrient => nutrient.title === 'Calories')?.amount || 'N/A';
      const protein = nutrients.find(nutrient => nutrient.title === 'Protein')?.amount || 'N/A';
      const fat = nutrients.find(nutrient => nutrient.title === 'Fat')?.amount || 'N/A';

      nutritionalInfo.innerHTML = `
        <p>Calories: ${calories} kcal</p>
        <p>Protein: ${protein} g</p>
        <p>Fat: ${fat} g</p>
      `;
    } else {
      nutritionalInfo.innerHTML = '<p>Nutritional information not available.</p>';
    }

    const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
    if (favorites.some(fav => fav.id === recipeDetails.id)) {
      addToFavoritesBtn.textContent = 'Remove from Favorites';
      addToFavoritesBtn.onclick = () => removeFromFavorites(recipeDetails.id);
    } else {
      addToFavoritesBtn.textContent = 'Add to Favorites';
      addToFavoritesBtn.onclick = () => addToFavorites(recipeDetails);
    }

    document.getElementById('recipeModal').style.display = 'flex';
    document.body.classList.add('modal-open');

    document.getElementById('recipeModal').onclick = (event) => {
      if (event.target === document.getElementById('recipeModal')) {
        closeRecipeDetails();
      }
    };
  } catch (error) {
    console.error('Failed to fetch recipe details:', error);
  }
}
function closeRecipeDetails() {
  document.getElementById('recipeModal').style.display = 'none';
  document.body.classList.remove('modal-open');
}

function addToFavorites(recipeDetails) {
  if (favorites.some(fav => fav.id === recipeDetails.id)) {
    alert('This recipe is already in your favorites.');
    return;
  }

  favorites.push(recipeDetails);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Recipe added to favorites!');

  document.getElementById('addToFavoritesBtn').textContent = 'Remove from Favorites';
  document.getElementById('addToFavoritesBtn').onclick = () => removeFromFavorites(recipeDetails.id);
  updateFavoritesUI();
}

function removeFromFavorites(recipeId) {
  favorites = favorites.filter(fav => fav.id !== recipeId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Recipe removed from favorites.');

  document.getElementById('addToFavoritesBtn').textContent = 'Add to Favorites';
  updateFavoritesUI();
}

function updateFavoritesUI() {
  const favoritesContainer = document.getElementById('favoritesContainer');
  favoritesContainer.innerHTML = '';

  favorites.forEach(recipe => {
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'favorite-card';

    favoriteCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="openRecipeDetails(${recipe.id})">View Details</button>
    `;
    favoritesContainer.appendChild(favoriteCard);
  });
}

updateFavoritesUI();
