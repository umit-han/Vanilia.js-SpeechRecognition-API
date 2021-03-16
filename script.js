const searchTitle = document.querySelector('.search-title');
const foodBoxGroup = document.querySelector('.food-box-group');
const foodBoxDetails = document.querySelector('.food-box-details')


window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();

// Start recognition
recognition.start();

// Capture user speak
function onSpeak(e) {
    const msg = e.results[0][0].transcript;

    searchMeal(msg)
}

// Search meal and fetch from API
function searchMeal(msg) {

    foodBoxGroup.innerHTML = "";

    // Get search term
    const term = msg;

    // Check for empty
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            searchTitle.innerText = `The food you're looking for: ${term}`;
            if (data.meals === null) {
                alert("Sorry, no match was found, please try again.")
                foodBoxDetails.innerHTML = '';

            } else {
                const mealsName = data.meals.map(m => {
                    if (m.strMeal == term || m.strCategory == term) {
                        return true;
                    }
                });

                if (mealsName) {
                    {
                        foodBoxGroup.innerHTML = data.meals.map(meal => `
                            <div class="food-box">
                                <img class="food-img" src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="food-box-detail" data-mealID="${meal.idMeal}">
                                <h2 class="food-name">${meal.strMeal}</h2>
                                <h3 class="more">More...</h3>
                            </div>
                            </div>
                    `).join('');
                    }
                }
            }
        });
}

// Fetch meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            console.log(data)
            addMealToDOM(meal);
        });
}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    foodBoxDetails.innerHTML = `
        <h1 class="food-title">${meal.strMeal}</h1>

        <img src="${meal.strMealThumb}" alt="strMeal" class="food-img-big">

        <span class="border-orange"></span>
         ${meal.strCategory ? `<p class="food-type">${meal.strCategory}</p>`: ''}
         ${meal.strArea ? `<p class="food-country"> ${meal.strArea}</p>`: ''}
        <span class="border-orange"></span>

        <p class="recipe">${meal.strInstructions}</p>

        <h2 class="ingredients-title">ingredients</h2>
        <div class="ingredients-group">
            ${ingredients.map(ing => `<p class="ingredients-box">${ing}</p>`).join('')} 
        </div>
    `;
}

// Click for food details
foodBoxGroup.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('food-box-detail');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})

// Speak result
recognition.addEventListener('result', onSpeak);

// End SR service
recognition.addEventListener('end', () => recognition.start())