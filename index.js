const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2509-Pt-EwaSz."; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

const GUESTS = "/guests";
const GUESTSAPI = BASE + COHORT + GUESTS;

const RSVPS = "/rsvps";
const RSVPSAPI = BASE + COHORT + RSVPS;

// The user can also see the guests who have RSVP'd to the selected party.
// This will involve fetching data from the /rsvps and /guests endpoints!
// Fetch all the guests first, and then use the RSVPs to filter the guests for the selected party.

let events = [];
let guests = [];
let rsvps = [];
let selectedEvent;
let eventRsvps;

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

// async function getOneRSVP(eventId) {
//   try {
//     let response = await fetch(API + "/" + eventId);
//     let result = await response.json();
//     console.log("getOneRSVP", getOneRSVP);
//     let oneRSVP = result.data;
//     console.log("oneRSVP", oneRSVP);
//   } catch (error) {
//     console.error("something went wrong", error);
//   }
// }

async function getRSVP() {
  try {
    let response = await fetch(RSVPSAPI);
    let result = await response.json();
    rsvps = result.data;
    console.log("rsvps", rsvps);
  } catch (error) {
    console.error("something went wrong", error);
  }
}

async function getGuests() {
  try {
    let response = await fetch(GUESTSAPI);
    let result = await response.json();
    guests = result.data;
    console.log("guests", guests);
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
    await getRSVP();
    await getGuests();
    eventRsvps = rsvps.filter((rsvp) => {
      if (rsvp.eventId === thing.id) return rsvp;
    });
    console.log("eventRsvps", eventRsvps);
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

function GuestItem(guest) {
  let $li = document.createElement("li");
  $li.textContent = guest.name;
  return $li;
}

function EventGuestList() {
  let attendingGuests = [];
  for (let guest of guests) {
    for (let rsvp of eventRsvps) {
      if (guest.id === rsvp.guestId) {
        attendingGuests.push(guest);
      }
    }
  }
  const $ul = document.createElement("ul");
  $ul.classList.add("guestList");
  const $guests = attendingGuests.map(GuestItem);
  $ul.replaceChildren(...$guests);
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
      <h4>Guests Attending:</h4>
      `;
    const $guestList = EventGuestList();
    $event.appendChild($guestList);

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
