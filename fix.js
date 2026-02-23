const mongoose = require("mongoose");

const fixLikes = async () => {
   await  mongoose.connect("mongodb://localhost:27017/MangaDB");
  const db = mongoose.connection.db;
  const collection = db.collection("mangas"); // replace with your actual collection name

  const docs = await collection.find({}).toArray();

  for (const doc of docs) {
    let updated = false;

    for (let i = 0; i < doc.Type.length; i++) {
      const typeEntry = doc.Type[i];

      if (Array.isArray(typeEntry.No_of_Likes)) {
        typeEntry.No_of_Likes = typeEntry.No_of_Likes[0] || 0;
        updated = true;
      }

      if (Array.isArray(typeEntry.No_of_Disikes)) {
        typeEntry.No_of_Disikes = typeEntry.No_of_Disikes[0] || 0;
        updated = true;
      }
    }

    if (updated) {
      await collection.updateOne(
        { _id: doc._id },
        { $set: { Type: doc.Type } }
      );
      console.log(`Fixed document: ${doc._id}`);
    }
  }

  console.log("Fix complete.");
  mongoose.disconnect();
};

fixLikes().catch(console.error);
