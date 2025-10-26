const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2509-Pt-EwaSz."; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

let events = [];
let selectedEvent;

async function getEvents() {
  try {
    let response = await fetch(API);
    let result = await response.json();
    events = result.data;
    console.log("events", events);
  } catch (error) {
    console.error("something went wrong", error);
  }
}

async function getEvent(id) {
  try {
    let response = await fetch(API + "/" + id);
    let result = await response.json();
    selectedEvent = result.data;
    console.log("events", events);
  } catch (error) {
    console.error("something went wrong", error);
  }
}

function EventListItem(thing) {
  let $li = document.createElement("li");
  let $a = document.createElement("a");
  $a.href = "#selected";
  $a.textContent = thing.name;
  $a.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("thing", thing);
    await getEvent(thing.id);
    render();
  });
  $li.appendChild($a);
  return $li;
}

function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("eventList");
  const $events = events.map(EventListItem);
  $ul.replaceChildren(...$events);
  return $ul;
}

function EventDetail() {
  if (!selectedEvent) {
    let $p = document.createElement("p");
    $p.textContent = "Please select an event to learn more.";
    return $p;
  } else {
    const $event = document.createElement("section");
    $event.classList.add("event");
    $event.innerHTML = `
      <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
      <p>Location: ${selectedEvent.location}</p>
      <p>When: ${selectedEvent.date}</p>
      <p>${selectedEvent.description}</p>
      `;
    return $event;
  }
}

function render() {
  let $app = document.querySelector("#app");
  $app.innerHTML = `
  <h1>Party Planner</h1>
  <main>
    <section>
        <h2>Upcoming Parties</h2>
        <EventList></EventList>
    </section>
    <section>
        <h2>Event Details</h2>
        <EventDetail></EventDetail>
    </section>
  </main>
  `;

  $app.querySelector("EventList").replaceWith(EventList());
  $app.querySelector("EventDetail").replaceWith(EventDetail());
}

async function init() {
  await getEvents();
  render();
}

init();
