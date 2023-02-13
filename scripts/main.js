const selectors = {
  header: document.querySelector("header"),
  footer: document.querySelector("footer"),
};

const data = await getData();
const continentsData = [...data];
const continentsNames = [...data.keys()];


async function getData() {
  const continents = new Map();
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error(`Can't get continents and countries data`);
    }
    const data = await response.json();

    data.forEach((country) => {
      const continent = country.continents[0];
      if (!continents.has(continent)) {
        continents.set(continent, []);
      }
      continents.get(continent)?.push({
        name: country.name.common,
        population: country.population,
      });
    });

    return continents;
  } catch (error) {
    throw new Error(`Getting data failed`);
    console.error(error);
  }
}

const main = () => {
  console.log(continentsData[0]);
  addButtonsToContainer(continentsNames,selectors.header);
};

const ctx = document.getElementById("myChart");
new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});


const addButtonsToContainer = (itemsArray,container) => {
  itemsArray.forEach((item) => {
    createButtons(item, container);
  });
};


const createButtons = (name,container) => {
  const btnElement = document.createElement("button");
  btnElement.textContent = name;
  if(continentsNames.includes(name)){
    btnElement.classList.add("continent-btn");
  }else {
    btnElement.classList.add("country-btn");
  }
  container.appendChild(btnElement);
  btnElement.addEventListener("click", () => {
    if(continentsNames.includes(name)){
    pickedContinent(name);
    }else {
      // pickedCountry();
    }
  });
  
};

const pickedContinent = (name) => {
  console.log('picked:',name);
  renderCountries(name);
}

function renderCountries(name){
  // display spinner;
  continentsData.forEach(continent => {
    if(continent[0]===name){
      console.log(continent[1].map(country=>country.name));
      addButtonsToContainer(continent[1].map(country=>country.name),selectors.footer);
    }
  }); 

}

main();
