const API_URL = 'http://localhost:5000/api/cars';
let isEditing = false;
let editId = null;

// --- 1. Load Inventory into Admin Dashboard ---
async function loadInventory() {
    const container = document.getElementById('adminInventory');
    try {
        const response = await fetch(API_URL);
        const cars = await response.json();
        
        console.log("Loaded cars from database:", cars);

        container.innerHTML = cars.map(car => {
            const images = car.images || [];
            console.log(`Car "${car.title}" has ${images.length} images:`, images);
            
            const thumb = (images.length > 0 && images[0]) 
                ? images[0] 
                : 'https://via.placeholder.com/100x60?text=No+Image';
            
            return `
                <div class="admin-item">
                    <img src="${thumb}" onerror="this.src='https://via.placeholder.com/100x60?text=No+Image'">
                    <div class="admin-item-info">
                        <h4>${car.title}</h4>
                        <p style="font-size:0.75rem; color:#888;">📸 ${images.length} image${images.length !== 1 ? 's' : ''}</p>
                        <p>£${Number(car.price).toLocaleString()}</p>
                    </div>
                    <div class="admin-actions">
                        <button onclick="openEditModal('${car._id}')" class="btn-edit">EDIT</button>
                        <button onclick="deleteCar('${car._id}')" class="btn-delete">DELETE</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error("Failed to load inventory:", err);
        container.innerHTML = `<p style="color:#ff4d4d; padding:20px;">Error loading inventory. Server running on port 5000?</p>`;
    }
}

// --- 2. Modal Management ---
function openAddModal() {
    isEditing = false;
    editId = null;
    document.getElementById('addCarForm').reset();
    document.getElementById('modalTitle').innerText = "NEW ENTRY";
    document.getElementById('imageInputList').innerHTML = `
        <div class="image-input-row">
            <input type="url" class="img-src" placeholder="Image URL">
            <button type="button" onclick="addImageRow()" class="plus-btn">+</button>
        </div>`;
    toggleImageSource('url');
    document.getElementById('addModal').style.display = 'flex';
}

async function openEditModal(id) {
    isEditing = true;
    editId = id;
    
    try {
        const response = await fetch(API_URL);
        const cars = await response.json();
        const car = cars.find(c => c._id === id);

        if (car) {
            document.getElementById('carTitle').value = car.title;
            document.getElementById('carPrice').value = car.price;
            document.getElementById('carDetails').value = car.details;
            
            const list = document.getElementById('imageInputList');
            // Filter out null/empty images
            const validImages = (car.images || []).filter(img => img && img !== "");
            
            list.innerHTML = validImages.map(img => `
                <div class="image-input-row" style="display:flex; gap:5px; margin-bottom:5px;">
                    <input type="url" class="img-src" value="${img}">
                    <button type="button" onclick="this.parentElement.remove()" class="btn-delete" style="padding:5px;">-</button>
                </div>
            `).join('') + `<button type="button" onclick="addImageRow()" class="btn-edit" style="width:100%; margin-top:10px;">+ ADD ANOTHER LINK</button>`;

            document.getElementById('modalTitle').innerText = "EDIT VEHICLE";
            toggleImageSource('url');
            document.getElementById('addModal').style.display = 'flex';
        }
    } catch (err) {
        alert("Error fetching details.");
    }
}

// --- 3. Form Submission ---
document.getElementById('addCarForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerText = "PROCESSING...";
    submitBtn.disabled = true;

    let finalImages = [];

    // Collect URLs from input fields - make sure to get actual values
    const imageInputs = document.querySelectorAll('.img-src');
    console.log("Found image inputs:", imageInputs.length);
    
    imageInputs.forEach((input, index) => {
        const url = input.value ? input.value.trim() : "";
        console.log(`Input ${index}: "${url}"`);
        
        if (url && url !== "" && url.length > 5) {
            finalImages.push(url);
        }
    });

    // Handle file uploads - convert to base64
    const fileInput = document.getElementById('carFile');
    if (fileInput.files.length > 0) {
        console.log("Processing file uploads:", fileInput.files.length);
        submitBtn.innerText = "UPLOADING IMAGES...";
        
        const maxSizeMB = 5;
        
        for (let file of fileInput.files) {
            // Check file size (max 5MB per file)
            const fileSizeMB = file.size / (1024 * 1024);
            
            if (fileSizeMB > maxSizeMB) {
                console.error(`File too large: ${fileSizeMB.toFixed(2)}MB`);
                alert(`❌ File "${file.name}" is too large (${fileSizeMB.toFixed(2)}MB)\n\nMax size: ${maxSizeMB}MB per file`);
                submitBtn.innerText = "SAVE TO DATABASE";
                submitBtn.disabled = false;
                return;
            }
            
            try {
                console.log(`Converting "${file.name}" (${fileSizeMB.toFixed(2)}MB)...`);
                const base64 = await fileToBase64(file);
                console.log(`✅ Converted file "${file.name}" to base64 (${(base64.length / 1024).toFixed(2)}KB)`);
                finalImages.push(base64);
            } catch (err) {
                console.error("Error converting file:", err);
                alert(`❌ Error uploading ${file.name}`);
                submitBtn.innerText = "SAVE TO DATABASE";
                submitBtn.disabled = false;
                return;
            }
        }
    }

    console.log("Final images array before sending:", finalImages);

    if (finalImages.length === 0) {
        alert("⚠️ ERROR: No valid images found!\n\n✅ HOW TO FIX:\n• Option 1: Paste image URLs starting with 'http'\n• Option 2: Select image files from your PC\n• Example URL: https://example.com/car.jpg");
        submitBtn.innerText = "SAVE TO DATABASE";
        submitBtn.disabled = false;
        return;
    }

    const carData = {
        title: document.getElementById('carTitle').value,
        price: document.getElementById('carPrice').value,
        images: finalImages,
        details: document.getElementById('carDetails').value
    };

    console.log("Saving car data:", carData);
    console.log("Images array:", finalImages);
    
    // Show user what we're sending
    console.log("📤 REQUEST DATA:");
    console.log("  Title:", carData.title);
    console.log("  Price:", carData.price);
    console.log("  Details:", carData.details.substring(0, 50));
    console.log("  Images count:", finalImages.length);

    const url = isEditing ? `${API_URL}/${editId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        console.log(`Sending ${method} request to ${url}`);
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });

        const responseData = await response.json();
        console.log("📥 SERVER RESPONSE:", responseData, "Status:", response.status);

        if (response.ok) {
            alert(isEditing ? "✅ Vehicle Updated!" : "✅ Vehicle Added!\n\nCheck the home page to see your images.");
            // Notify other tabs/pages to refresh their inventory view
            try { localStorage.setItem('inventory_update', Date.now().toString()); } catch (e) {}
            location.reload();
        } else {
            alert("❌ Error: " + (responseData.message || "Failed to save vehicle"));
            console.error("Server error:", responseData);
        }
    } catch (err) {
        alert("❌ Connection Error: " + err.message + "\n\nMake sure the server is running on port 5000");
        console.error("Fetch error:", err);
    } finally {
        submitBtn.innerText = "SAVE TO DATABASE";
        submitBtn.disabled = false;
    }
});

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Compress image before resolving
            compressImage(reader.result, (compressed) => {
                resolve(compressed);
            });
        };
        reader.onerror = error => reject(error);
    });
}

// Compress image to reduce file size
function compressImage(dataUrl, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reduce size if too large
        const maxWidth = 1200;
        const maxHeight = 900;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with quality 0.7
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        console.log(`Image compressed: ${(dataUrl.length / 1024).toFixed(2)}KB → ${(compressed.length / 1024).toFixed(2)}KB`);
        callback(compressed);
    };
    img.onerror = () => {
        // If image fails, use original
        callback(dataUrl);
    };
    img.src = dataUrl;
}

// --- 4. Helpers ---
function addImageRow() {
    const container = document.getElementById('imageInputList');
    const div = document.createElement('div');
    div.className = 'image-input-row';
    div.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
    div.innerHTML = `<input type="url" class="img-src" placeholder="Image URL">
                     <button type="button" onclick="this.parentElement.remove()" class="btn-delete" style="padding:5px;">-</button>`;
    container.appendChild(div);
}

function toggleImageSource(type) {
    document.getElementById('imageInputList').style.display = type === 'url' ? 'block' : 'none';
    document.getElementById('carFile').style.display = type === 'file' ? 'block' : 'none';
}

async function deleteCar(id) {
    if (confirm("Permanently delete this vehicle?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadInventory();
    }
}

function closeModal() { document.getElementById('addModal').style.display = 'none'; }

// Init
loadInventory();