const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://appetite:appetite2711@cluster1.vp0nu.mongodb.net/appetitemern?retryWrites=true&w=majority&appName=Cluster1';

const mongoDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        if (connection) {
            console.log("MongoDB Connected Successfully");
    
            //! Access the collection after ensuring the connection is established
            const appetiteCategory = mongoose.connection.db.collection("appetiteCategory");
    
            //! Fetch the data using async-await
            const catData = await appetiteCategory.find({}).toArray();
    
            if (catData.length > 0) {
                console.log("Categories fetched successfully:", global.appetiteCategory = catData);
            } else {
                console.log("No categories found in the collection.");
            }
    
            //! Access another collection
            const fetched_data = mongoose.connection.db.collection("appetite_items");
    
            //! Fetch the data using async-await
            const data = await fetched_data.find({}).toArray();
    
            if (data.length > 0) {
                console.log("Data fetched successfully:", global.appetite_items = data);
            } else {
                console.log("No data found in the collection.");
            }
        }
    } catch (err) {
        console.error("MongoDB connection error: ", err);
    }
};

module.exports = mongoDB;




