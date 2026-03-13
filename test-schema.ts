import { insertCarSchema } from "./shared/schema";

try {
    insertCarSchema.parse({
        title: "Test",
        price: 1000,
        images: ["http://test.com/img.jpg"]
    });
    console.log("Success");
} catch (e) {
    console.log("Error:", e.errors);
}
