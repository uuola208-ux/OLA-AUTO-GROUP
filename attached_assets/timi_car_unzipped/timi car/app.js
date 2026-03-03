// --- 1. Mobile Menu Logic ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// --- 2. Fetch Showroom Logic (Home Page) ---
async function fetchHomeShowroom() {
    const grid = document.getElementById('carGrid');
    if (!grid) return; 
    
    try {
        const response = await fetch('http://localhost:5000/api/cars');
        const cars = await response.json();
        
        console.log("Loaded cars for home page:", cars.length);

        if (cars.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 80px 40px;">
                <p style="font-size: 1.2rem; letter-spacing: 2px;">NO VEHICLES IN STOCK</p>
                <p style="color: #444; margin-top: 10px; font-size: 0.85rem;">Check back soon for new arrivals</p>
            </div>`;
            return;
        }

        // Show newest 10 cars
        const latestCars = cars.slice(0, 10);

        grid.innerHTML = latestCars.map((car, idx) => {
            const images = car.images || [];
            
            // Safely access images array
            const coverImage = (images.length > 0 && images[0]) 
                ? images[0] 
                : 'https://via.placeholder.com/400x250?text=No+Image';
            
            return `
                <div class="car-card" loading="lazy">
                    <img src="${coverImage}" 
                         alt="${car.title}" 
                         onerror="this.src='https://via.placeholder.com/400x250?text=Image+Error'"
                         style="cursor:pointer;"
                         onclick="window.location.href='inventory.html'"
                         loading="lazy">
                    <div class="car-info-compact">
                        <h3>${car.title}</h3>
                        <p style="font-size:0.8rem; color:#888; margin:8px 0;">
                            ${car.details ? car.details.substring(0, 60) + (car.details.length > 60 ? '...' : '') : ''}
                        </p>
                        <p class="price">£${Number(car.price).toLocaleString()}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        // Lazy load images using Intersection Observer
        if ('IntersectionObserver' in window) {
            const images = grid.querySelectorAll('img');
            images.forEach(img => {
                img.style.opacity = '0.7';
                img.onload = () => { img.style.opacity = '1'; };
            });
        }

    } catch (err) {
        console.error("Fetch error:", err);
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ff4d4d; padding: 80px 40px;">
            <p style="font-size: 1.2rem; letter-spacing: 2px;">CONNECTION ERROR</p>
            <p style="color: #888; margin-top: 10px; font-size: 0.85rem;">Unable to load vehicles. Ensure the server is running on port 5000.</p>
        </div>`;
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', fetchHomeShowroom);

// Listen for cross-tab inventory updates and refresh when notified
window.addEventListener('storage', (e) => {
    if (e.key === 'inventory_update') fetchHomeShowroom();
});

// Poll periodically (60 seconds instead of 20 for better performance)
setInterval(() => {
    fetchHomeShowroom();
}, 60000);