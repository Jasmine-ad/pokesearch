const searchCategory = document.getElementById("searchCategory");
const searchBar = document.getElementById("searchBar");
const searchWrapper = document.getElementById("search-wrapper");
const searchErrorMessage = document.getElementById("searchErrorMessage");
const resultsContainer = document.querySelector(".results-cards");
const pokemonResultCardTemplate = document.querySelector(
  "[data-pokemon-results-template]"
);
const abilityResultsCardTemplate = document.querySelector(
  "[data-ability-results-template]"
);

let offset = 0;
const limit = 10;
let isFetching = false;

searchWrapper.style.display = "none";
searchErrorMessage.style.display = "none";

document.addEventListener("DOMContentLoaded", function () {
  searchCategory.addEventListener("change", function () {
    searchWrapper.style.display = "none";
    offset = 0;
    resultsContainer.innerHTML = "";

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
      default:
        break;
    }
  });

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !isFetching
    ) {
      if (["type", "ability", "name"].includes(searchCategory.value)) {
        offset += limit;
        if (searchCategory.value === "type") {
          fetchTypeData();
        } else if (searchCategory.value === "ability") {
          fetchAbilityData();
        } else if (searchCategory.value === "name") {
          fetchNameData();
        }
      }
    }
  });
});

function clearSearchResults() {
  resultsContainer.innerHTML = "";
}

async function searchButtonClick() {
  clearSearchResults();
  searchErrorMessage.style.display = "none";
  offset = 0;
  if (searchCategory.value === "name") {
    fetchNameData();
  } else if (searchCategory.value === "type") {
    fetchTypeData();
  } else if (searchCategory.value === "ability") {
    fetchAbilityData();
  } else {
    console.error("Invalid category");
  }
}

function fetchNameData() {
  clearSearchResults();
  const pokemonName = searchBar.value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => {
      if (!response.ok) {
        searchErrorMessage.style.display = "block";
        throw new Error("Could not fetch resource");
      }
      return response.json();
    })
    .then((data) => {
      const pokemon = {
        name: data.name,
        weight: data.weight,
        sprite: data.sprites.front_default,
        type: data.types.map((type) => type.type.name).join(", "),
        ability: data.abilities
          .map((ability) => ability.ability.name)
          .join(", "),
      };
      displayPokemon(pokemon);
    })
    .catch((error) => console.error(error));
}

function fetchTypeData() {
  isFetching = true;
  const pokemonType = searchBar.value.toLowerCase();
  fetch(`https://pokeapi.co/api/v2/type/${pokemonType}`)
    .then((response) => {
      if (!response.ok) {
        searchErrorMessage.style.display = "block";
        throw new Error("Could not fetch resource");
      }
      return response.json();
    })
    .then((data) => {
      const pokemonNames = data.pokemon
        .slice(offset, offset + limit)
        .map((p) => p.pokemon.name);
      return Promise.all(
        pokemonNames.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((response) => response.json())
            .then((pokemonData) => {
              const pokemon = {
                name: pokemonData.name,
                weight: pokemonData.weight,
                sprite: pokemonData.sprites.front_default,
                type: pokemonData.types
                  .map((type) => type.type.name)
                  .join(", "),
                ability: pokemonData.abilities
                  .map((ability) => ability.ability.name)
                  .join(", "),
              };
              displayPokemon(pokemon);
            })
        )
      );
    })
    .then(() => (isFetching = false))
    .catch((error) => {
      console.error(error);
      isFetching = false;
    });
}

function fetchAbilityData() {
  isFetching = true;
  const pokemonAbility = searchBar.value.toLowerCase();
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
      const effect = data.effect_entries.find(
        (entry) => entry.language.name === "en"
      ).effect;

      displayAbilities(name, effect);

      const pokemonList = data.pokemon.map((p) => p.pokemon.name);
      return Promise.all(
        pokemonList.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((response) => response.json())
            .then((pokemonData) => {
              const pokemon = {
                name: pokemonData.name,
                weight: pokemonData.weight,
                sprite: pokemonData.sprites.front_default,
                type: pokemonData.types
                  .map((type) => type.type.name)
                  .join(", "),
                ability: pokemonData.abilities
                  .map((ability) => ability.ability.name)
                  .join(", "),
              };
              displayPokemon(pokemon);
            })
        )
      );
    })
    .then(() => (isFetching = false))
    .catch((error) => {
      console.error(error);
      isFetching = false;
    });
}

function displayPokemon(pokemon) {
  const pokemonResultsCard = pokemonResultCardTemplate.content
    .cloneNode(true)
    .querySelector(".card");
  pokemonResultsCard.querySelector(".pokemonName").textContent = pokemon.name;
  pokemonResultsCard.querySelector(
    ".pokemonWeight"
  ).textContent = `${pokemon.weight}kg`;
  pokemonResultsCard.querySelector(".pokemonSprite").src = pokemon.sprite;
  pokemonResultsCard.querySelector(
    ".pokemonType"
  ).textContent = `Type: ${pokemon.type}`;
  pokemonResultsCard.querySelector(
    ".pokemonAbility"
  ).textContent = `Abilities: ${pokemon.ability}`;
  resultsContainer.appendChild(pokemonResultsCard);
}

function displayAbilities(name, effect) {
  const abilityResultsCard = abilityResultsCardTemplate.content
    .cloneNode(true)
    .querySelector(".abilityCard");
  abilityResultsCard.querySelector(".abilityName").textContent = name;
  abilityResultsCard.querySelector(".abilityEffect").textContent = effect;
  resultsContainer.appendChild(abilityResultsCard);
}

function displayAbilityPokemon(pokemonList) {
  pokemonList.forEach((pokemon) => displayPokemon(pokemon));
}
