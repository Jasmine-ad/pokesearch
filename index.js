const searchCategory = document.getElementById("searchCategory");
const searchBar = document.getElementById("searchBar");
const searchWrapper = document.getElementById("search-wrapper");
const searchBarContainer = document.getElementById("searchBarContainer");
const searchErrorMessage = document.getElementById("searchErrorMessage");
const searchContainer = document.getElementById("searchContainer");
const pokemonResultCardTemplate = document.querySelector(
  "[data-pokemon-results-template]"
);
const abilityResultsCardTemplate = document.querySelector(
  "[data-ability-results-template]"
);

searchWrapper.style.display = "none";
searchErrorMessage.style.display = "none";

document.addEventListener("DOMContentLoaded", function () {
  searchCategory.addEventListener("change", function () {
    searchWrapper.style.display = "none";

    switch (searchCategory.value) {
      case "":
        searchWrapper.style.display = "none";
        break;
      case "name":
        searchWrapper.style.display = "block";
        searchBar.placeholder = "Enter Pokemon Name";
        break;
      case "type":
        searchWrapper.style.display = "block";
        searchBar.placeholder = "Enter Pokemon Type";
        break;
      case "ability":
        searchWrapper.style.display = "block";
        searchBar.placeholder = "Enter Pokemon Ability";
        break;
      case "weakness":
        searchWrapper.style.display = "block";
        searchBar.placeholder = "Enter Pokemon Weakness";
        break;
      default:
        break;
    }
  });
});

function clearSearchResults() {
  const resultsContainer = document.querySelector(".results-cards");
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
}

async function searchButtonClick() {
  clearSearchResults();
  searchErrorMessage.style.display = "none";
  if (searchCategory.value === "name") {
    fetchNameData();
  } else if (searchCategory.value === "type") {
    fetchTypeData();
  } else if (searchCategory.value === "ability") {
    fetchAbilityData();
  } else if (searchCategory.value === "weakness") {
    fetchWeaknessData();
  } else {
    console.error(error);
  }
}

function fetchNameData() {
  clearSearchResults();
  const pokemonName = document.getElementById("searchBar").value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => {
      if (!response.ok) {
        searchErrorMessage.style.display = "block";
        throw new Error("Could not fetch resource");
      }
      return response.json();
    })
    .then((data) => {
      const pokemonWeight = data.weight;
      const pokemonSprite = data.sprites.front_default;
      const pokemonType = data.types.map((type) => type.type.name).join(", ");
      const pokemonAbility = data.abilities
        .map((ability) => ability.ability.name)
        .join(", ");
      const pokemonWeakness = getWeaknesses(data.types);
      displayPokemon(
        pokemonName,
        pokemonWeight,
        pokemonSprite,
        pokemonType,
        pokemonAbility,
        pokemonWeakness
      );
    })
    .catch((error) => console.error(error));
}

function fetchTypeData() {
  clearSearchResults();
  const pokemonType = document.getElementById("searchBar").value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/type/${pokemonType}`)
    .then((response) => {
      if (!response.ok) {
        searchErrorMessage.style.display = "block";
        throw new Error("Could not fetch resource");
      }
      return response.json();
    })
    .then((data) => {
      const pokemonNames = data.pokemon.map((pokemon) => pokemon.pokemon.name);
      Promise.all(
        pokemonNames.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Could not fetch Pokemon data for ${name}`);
              }
              return response.json();
            })
            .then((pokemonData) => {
              const pokemonName = pokemonData.name;
              const pokemonWeight = pokemonData.weight;
              const pokemonSprite = pokemonData.sprites.front_default;
              const pokemonTypes = pokemonData.types
                .map((type) => type.type.name)
                .join(", ");
              const pokemonAbilities = pokemonData.abilities
                .map((ability) => ability.ability.name)
                .join(", ");
              const pokemonWeaknesses = getWeaknesses(pokemonData.types);

              displayPokemon(
                pokemonName,
                pokemonWeight,
                pokemonSprite,
                pokemonTypes,
                pokemonAbilities,
                pokemonWeaknesses
              );
            })
        )
      ).catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
}

function fetchAbilityData() {
  clearSearchResults();
  const pokemonAbility = document
    .getElementById("searchBar")
    .value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/ability/${pokemonAbility}`)
    .then((response) => {
      if (!response.ok) {
        searchErrorMessage.style.display = "block";
        throw new Error("Could not fetch resource");
      }
      return response.json();
    })
    .then((data) => {
      const name = pokemonAbility;
      const effect = data.effect_entries[1].effect;
      const pokemonList = data.pokemon.map(
        (pokemonList) => pokemonList.pokemon.name
      );
      displayAbilities(name, effect, pokemonList);
    })
    .catch((error) => console.error(error));
}

/**PUT ABILTY SEARCH FUNCTION HERE */

function getWeaknesses(types) {
  // Define a mapping of Pokémon types to their respective weaknesses
  const weaknesses = {
    normal: ["fighting"],
    fire: ["water", "ground", "rock"],
    water: ["electric", "grass"],
    electric: ["ground"],
    grass: ["fire", "ice", "poison", "flying", "bug"],
    ice: ["fire", "fighting", "rock", "steel"],
    fighting: ["flying", "psychic", "fairy"],
    poison: ["ground", "psychic"],
    ground: ["water", "grass"],
    flying: ["electric", "ice", "rock"],
    psychic: ["bug", "ghost", "dark"],
    bug: ["fire", "flying", "rock"],
    rock: ["water", "grass", "fighting", "ground", "steel"],
    ghost: ["ghost", "dark"],
    dragon: ["ice", "dragon", "fairy"],
    dark: ["fighting", "bug", "fairy"],
    steel: ["fire", "fighting", "ground"],
    fairy: ["poison", "steel"],
  };

  // Initialize an empty array to store weaknesses
  let result = [];

  // Iterate through each type in the input types array
  types.forEach((typeObj) => {
    // Retrieve the weaknesses for the current type from the weaknesses mapping
    const weaknessList = weaknesses[typeObj.type.name];

    // If the weaknessList exists (i.e., the type is found in the weaknesses mapping),
    // concatenate its values to the result array
    if (weaknessList) {
      result = result.concat(weaknessList);
    }
  });

  // Remove duplicate weaknesses and convert the array to a comma-separated string
  return [...new Set(result)].join(", ");
}

function displayPokemon(name, weight, sprite, type, ability, weakness) {
  const pokemonResultsCard = pokemonResultCardTemplate.content
    .cloneNode(true)
    .querySelector(".card");
  pokemonResultsCard.querySelector(".pokemonName").textContent = name;
  pokemonResultsCard.querySelector(".pokemonWeight").textContent =
    weight + `kg`;
  pokemonResultsCard.querySelector(".pokemonSprite").src = sprite;
  pokemonResultsCard.querySelector(
    ".pokemonType"
  ).textContent = `Type: ${type}`;
  pokemonResultsCard.querySelector(
    ".pokemonAbility"
  ).textContent = `Abilities: ${ability}`;
  pokemonResultsCard.querySelector(
    ".pokemonWeakness"
  ).textContent = `Weaknesses: ${weakness}`;
  document.querySelector(".results-cards").appendChild(pokemonResultsCard);
}

function displayAbilities(name, effect, pokemonList) {
  const abilityResultsCard = abilityResultsCardTemplate.content
    .cloneNode(true)
    .querySelector(".abilityCard");
  abilityResultsCard.querySelector(".abilityName").textContent = name;
  abilityResultsCard.querySelector(".abilityEffect").textContent = effect;

  let formattedPokemonList = pokemonList.join(", ");
  if (pokemonList.length > 1) {
    const lastCommaIndex = formattedPokemonList.lastIndexOf(", ");
    formattedPokemonList =
      formattedPokemonList.substring(0, lastCommaIndex) +
      " and" +
      formattedPokemonList.substring(lastCommaIndex + 1);
  }
  abilityResultsCard.querySelector(
    ".abilityPokemon"
  ).textContent = `Pokemon that can have this ability include ${formattedPokemonList}, see below.`;
  document.querySelector(".results-cards").appendChild(abilityResultsCard);

  /*code in a function to create the pokemon results cards of the pokemon that can have the ability.*/
}
