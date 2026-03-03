const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://CARSS:AIcJV3hcWgM8feqS@cluster0.errfg.mongodb.net/luxury_prestige?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => {
        console.log("✅ Connected to Database");
        
        const carSchema = new mongoose.Schema({
            title: { type: String, required: true },
            price: { type: Number, required: true },
            images: [String],
            details: String,
            createdAt: { type: Date, default: Date.now }
        });

        const Car = mongoose.model('Car', carSchema);

        return Car.find().then(cars => {
            console.log("\n========== CARS IN DATABASE ==========\n");
            
            if (cars.length === 0) {
                console.log("❌ NO CARS FOUND IN DATABASE");
            } else {
                cars.forEach((car, index) => {
                    console.log(`\n📌 Car ${index + 1}:`);
                    console.log(`   Title: ${car.title}`);
                    console.log(`   Price: £${car.price}`);
                    console.log(`   Details: ${car.details ? car.details.substring(0, 50) + '...' : 'None'}`);
                    console.log(`   Images Count: ${car.images ? car.images.length : 0}`);
                    console.log(`   Images Array:`, JSON.stringify(car.images, null, 2));
                    if (car.images && car.images.length > 0) {
                        console.log(`   Images:`);
                        car.images.forEach((img, i) => {
                            if (img) {
                                console.log(`     [${i + 1}] ${img.substring(0, 60)}...`);
                            } else {
                                console.log(`     [${i + 1}] ❌ NULL or EMPTY`);
                            }
                        });
                    } else {
                        console.log(`   ❌ NO IMAGES STORED`);
                    }
                });
            }
            
            console.log("\n=====================================\n");
            mongoose.disconnect();
            process.exit(0);
        });
    })
    .catch(err => {
        console.error("❌ Database Error:", err);
        process.exit(1);
    });
