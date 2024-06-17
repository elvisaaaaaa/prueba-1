JavaScript
// Functions to handle user interactions and manage reservations
function createReservation() {
    // Get customer information, service details, date, and time from input fields
    const customerName = document.getElementById('customerName').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Validate the input data (check for empty fields, invalid formats, etc.)
    if (!customerName || !service || !date || !time) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create a new reservation object
    const reservation = new Reservation(generate_reservation_id(), customerName, service, date, time);

    // Send the reservation data to the backend API to create a new reservation
    fetch('/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservation)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reservation created successfully!');
                // Clear the form and update the UI to reflect the new reservation
            } else {
                alert('Error creating reservation:', data.error);
            }
        });
}

function modifyReservation(reservationId) {
    // Retrieve reservation details from the backend API
    fetch(`/api/reservations/${reservationId}`)
        .then(response => response.json())
        .then(reservationData => {
            if (reservationData.success) {
                const reservation = reservationData.reservation;
                // Populate the input fields with the existing reservation data
                document.getElementById('customerName').value = reservation.customer_name;
                document.getElementById('service').value = reservation.service;
                document.getElementById('date').value = reservation.date;
                document.getElementById('time').value = reservation.time;

                // Update the form action to include the reservation ID for modification
                const form = document.getElementById('reservationForm');
                form.action = `/api/reservations/${reservationId}`;
                form.method = 'PUT'; // Change method to PUT for updating
            } else {
                alert('Error retrieving reservation:', reservationData.error);
            