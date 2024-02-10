
// Global variables
let page = 1;
const perPage = 10;
let searchName = null;

// Function to load listings data
function loadListingsData() {
    // Fetch data based on search criteria
    let url = `/api/listings?page=${page}&perPage=${perPage}`;
    if (searchName) {
        url += `&name=${searchName}`;
    }

    fetch(url)
        .then(res => {
            return res.ok ? res.json() : Promise.reject(res.status);
        })
        .then(data => {
            if (data.length) {
                // Populate table with data
                updateTable(data)
                // const tbody = document.querySelector('#listingsTable tbody');
                // tbody.innerHTML = ''; // Clear previous data
                // data.forEach(listing => {
                //     const tr = document.createElement('tr');
                //     tr.dataset.id = listing._id;
                //     tr.innerHTML = `
                //         <td>${listing.name}</td>
                //         <td>${listing.room_type}</td>
                //         <td>${listing.address.street}</td>
                //         <td>${listing.summary}</td>
                //     `;
                //     tbody.appendChild(tr);
                // });
            } else {
                // Show no data available
                if (page === 1) {
                    const tbody = document.querySelector('#listingsTable tbody');
                    tbody.innerHTML = '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
                } else {
                    page--; // Decrease page to prevent going beyond available data
                }
            }
        })
        .catch(err => {
            console.error('Error fetching data:', err);
        });
}
    // Function to update table with listings data
    function updateTable(data) {
        const tbody = document.querySelector('#listingsTable tbody');
        tbody.innerHTML = ''; // Clear previous data

        data.forEach(listing => {
            const row = document.createElement('tr');
            row.dataset.id = listing._id;
            row.innerHTML = `
                <td>${listing.name}</td>
                <td>${listing.room_type}</td>
                <td>${listing.address.street}</td>
                
                <td>
                    ${listing.summary}<br><br>
                    <strong>Accommodates:</strong> ${listing.accommodates}<br>
                    <strong>Rating:</strong> ${listing.review_scores.review_scores_rating} (${listing.number_of_reviews} reviews)
                </td>
            `;
            row.addEventListener('click', () => {
                // Handle row click event
                showModal(listing);
            });
            tbody.appendChild(row);
        });

        // Update current page
        document.getElementById('current-page').textContent = page;
    }

    // Function to show modal with listing details
    function showModal(listing) {
        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');

        modalTitle.textContent = listing.name;

        let modalContent = `
            <img id="photo" onerror="this.onerror=null;this.src = 'https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${listing.images.picture_url}">
            <br><br>
            ${listing.description}<br><br>
            <strong>Price:</strong> ${listing.price}.00<br>
            <strong>Room:</strong> ${listing.room_type}<br>
            <strong>Bed:</strong> ${listing.bed_type}
        `;

        modalBody.innerHTML = modalContent;

        // Show modal
        $('#detailsModal').modal('show');
    }

    // Initial load
    loadListingsData();


// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadListingsData();

    // Pagination buttons
    document.getElementById('previous-page').addEventListener('click', function(e) {
        e.preventDefault();
        if (page > 1) {
            page--;
            loadListingsData();
        }
    });

    document.getElementById('next-page').addEventListener('click', function(e) {
        e.preventDefault();
        page++;
        loadListingsData();
    });

    // Search form
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        searchName = document.getElementById('name').value.trim();
        page = 1;
        loadListingsData();
    });

    // Clear form
    document.getElementById('clearForm').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('name').value = '';
        searchName = null;
        page = 1;
        loadListingsData();
    });
});
