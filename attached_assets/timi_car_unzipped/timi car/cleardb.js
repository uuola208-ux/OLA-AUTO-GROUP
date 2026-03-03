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

        // Delete all cars
        return Car.deleteMany({}).then(result => {
            console.log(`\n🗑️  Deleted ${result.deletedCount} cars from database`);
            console.log("✅ Database cleared! Ready for fresh test.\n");
            mongoose.disconnect();
            process.exit(0);
        });
    })
    .catch(err => {
        console.error("❌ Error:", err);
        process.exit(1);
    });
