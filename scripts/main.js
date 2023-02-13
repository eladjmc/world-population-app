const selectors = {
  header: document.querySelector("header"),
  footer: document.querySelector("footer"),
  graphContainer: document.querySelector(".graph-container"),
};

const data = await getData();
const continentsData = [...data];
const continentsNames = [...data.keys()];

async function getData() {
  const continents = new Map();
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      console.error("Failed to fetch continents data");
      return null;
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
    console.error(error);
    return null;
  }
}

const getAllCitiesData = async (countryName) => {
  const response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/population/cities"
  );
  const data = await response.json();
  if (data.error) {
    console.error(data.msg);
    return [];
  }
  return data.data
    .map((city) => {
      if (city.country !== countryName) {
        return null;
      }
      return {
        name: city.city,
        population: city.populationCounts[0].value,
        year: city.populationCounts[0].year,
      };
    })
    .filter((city) => city);
};

const main = () => {
  console.log(continentsData[0]);
  addButtonsToContainer(continentsNames, selectors.header);
};

const updateGraph = (dataset,title) => {
  const labels = dataset.map((country) => country.name);
  const data = dataset.map((country) => country.population);

  const ctx = document.createElement("canvas");
  ctx.setAttribute("id", "myChart");
  selectors.graphContainer.appendChild(ctx);
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `# of Population`,
          data: data,
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
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 24,
        }
        }
      }
    },
  });
};
const addButtonsToContainer = (itemsArray, container) => {
  itemsArray.forEach((item) => {
    createButtons(item, container);
  });
};

const createButtons = (name, container) => {
  const btnElement = document.createElement("button");
  btnElement.textContent = name;
  if (continentsNames.includes(name)) {
    btnElement.classList.add("continent-btn");
  } else {
    btnElement.classList.add("country-btn");
  }
  container.appendChild(btnElement);

  btnElement.addEventListener("click", () => {
    if (continentsNames.includes(name)) {
      pickedContinent(name);
    } else {
      pickedCountry(name);
    }
  });
};
const pickedCountry = async (name) => {
  selectors.graphContainer.innerHTML = "";
  //show spinner
  const citiesData = await getAllCitiesData(name);
  updateGraph(citiesData,name);
};

const pickedContinent = (name) => {
  console.log("picked:", name);
  renderCountries(name);
};



function renderCountries(name) {
  selectors.footer.innerHTML = "";
  selectors.graphContainer.innerHTML = "";
  // display spinner;

  continentsData.forEach((continent) => {
    if (continent[0] === name) {
      updateGraph(continent[1],name);
      addButtonsToContainer(
        continent[1].map((country) => country.name),
        selectors.footer
      );
    }
  });
}

main();
