document.getElementById("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;

    let response = await fetch(http://localhost:5000/search?from=${from}&to=${to});
    let flights = await response.json();
    
    let flightsDiv = document.getElementById("flights");
    flightsDiv.innerHTML = flights.map(flight => `
        <div>
            <h3>${flight.airline}</h3>
            <p>From: ${flight.departure} - To: ${flight.destination}</p>
            <p>Price: $${flight.price}</p>
            <button onclick="bookFlight(${flight.id})">Book Now</button>
        </div>
    `).join('');
});