async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Could not load JSON:", error);
  }
}

let start_years = {};
let end_years = {};

let data = {};

const card_box = document.getElementById("cards");

function add_card(el_id) {
    const info = data[el_id];
    const card_html = `
        <div id=${el_id} class="card text-white bg-info mb-3" style="max-width: 20rem;">
            <div class="card-body">
                <h4 class="card-title">${info["title"]}</h4>
                <p class="card-text">${info["description"]}</p>
                <h5>Who was involved?</h5>
                <p class="card-text">${info["who"]}</p>
                <h5>Why did it happen/cause?</h5>
                <p class="card-text">${info["why"]}</p>
                <h5>Result</h5>
                <p class="card-text">${info["result"]}</p>
                <h5>Impact</h5>
                <p class="card-text">${info["impact"]}</p>
            </div>
        </div>`;
    card_box.insertAdjacentHTML("beforeend", card_html);

    const card = document.getElementById(el_id);
    card.animate(
        [
            { opacity: "0%" },
            { opacity: "100%" }
        ],
        {
            duration: 150,
            easing: "ease-out",
            fill: "forwards"
        }
    );
    card.style.opacity = "100%";
}

async function process_data() {
    data = await loadData();

    for (const id in data) {
        if (!Object.hasOwn(data, id)) continue;
        
        const element = data[id];
        
        if (!Object.hasOwn(start_years, element["start-year"])) {
            start_years[element["start-year"]] = [];
        }
        if (!Object.hasOwn(end_years, element["end-year"])) {
            end_years[element["end-year"]] = [];
        }

        start_years[element["start-year"]].push(id);
        end_years[element["end-year"]].push(id);
    }

    add_card("fr-in-war");
}

process_data();

let curr_year = 1760;
const max_year = 1776;
const min_year = 1760;
const year_h1 = document.getElementById("year");
const timeline_bar = document.getElementById("timeline_bar");

function update_timeline() {
    year_h1.innerHTML = curr_year;
    timeline_bar.animate(
        [
            { width: timeline_bar.style.width },
            { width: `${Math.floor(((curr_year-min_year)/(max_year-min_year))*100)}%` }
        ],
        {
            duration: 250,
            easing: "ease-out",
            fill: "forwards"
        }
    )
    timeline_bar.style.width = `${Math.floor(((curr_year-min_year)/(max_year-min_year))*100)}%`;
}

function increase_year() {
    if (curr_year+1 > max_year) {
        return;
    }

    // disable button?
    
    if (Object.hasOwn(end_years, curr_year)) {
        end_years[curr_year].forEach(element => {
            document.getElementById(element).remove();
        });
    }

    curr_year += 1;

    if (Object.hasOwn(start_years, curr_year)) {
        start_years[curr_year].forEach(el_id => {
            add_card(el_id);
        });
    }

    update_timeline();
}

function decrease_year() {
    if (curr_year-1 < min_year) {
        return;
    }

    if (Object.hasOwn(start_years, curr_year)) {
        start_years[curr_year].forEach(element => {
            document.getElementById(element).remove();
        });
    }

    curr_year -= 1;

    if (Object.hasOwn(end_years, curr_year)) {
        end_years[curr_year].forEach(el_id => {
            add_card(el_id);
        });
    }

    update_timeline();
}