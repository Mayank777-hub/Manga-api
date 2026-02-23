const mongoose = require("mongoose");  // complete

const clothesSchema = new mongoose.Schema({
     ItemType: { type: String, enum: ["Manga", "Bags", "KeyChains", "Lamps", "Movable tables", "Posters", "Anime-Figures", "Manga-Merchandies", "Computer-games", "Playing-Cards", "Laptop-Covers", "Water-Bottles", "Lunch-box","phone-cases","Nintendo-playstations","Desk-mat","Mouse-pad","Mangabased-Snacks"]},
  MerchType: {
    type: String,
    enum: [
      "T-Shirt",
      "Hoodie",
      "Jacket",
      "Sweatshirt",
      "Pants",
      "Cap",
      "Scarf",
      "Shoes",
      "Cosplay-Costume",
      "Anime-Uniform",
      "Manga-Clothes"
    ],
    required: true
  },

  Brand: { type: String }, 
  Title: { type: String, required: true }, 
  Anime: { type: String }, 
  Animeurl: { type: String }, 
  DesignTheme: { type: String }, 
  Gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex" },
  Color: [{ type: String }], 
  Sizes: [{ type: String }], 
  Material: { type: String }, 
  FitType: { type: String }, 
  FabricCare: { type: String }, 
  SleeveType: { type: String }, 
  Pattern: { type: String }, 
  NeckType: { type: String }, 
  Occasion: { type: String }, 
  PrintingType: { type: String }, 

  
  Originalvalue: { type: Number },
  Marketprice: { type: Number },
  Currentoffer: [String],
  previousoffer: { type: String },
  No_of_Likes: { type: Number, default: 0 },
  No_of_Dislikes: { type: Number, default: 0 },
  Instock: { type: Boolean, default: true },
  Instockno: { type: Number },

  
  Images: [{ type: String, required: true }],
  Releasedate: { type: Date, default: Date.now },

    Manufacturer: {
        Name: { type: String, required: true },
        Country: { type: String },
        Address: { type: String },
        ContactEmail: { type: String },
        ContactPhone: { type: String },
        Website: { type: String },
        Warranty: { type: String }, // e.g., "6 months", "1 year"
        Certified: { type: Boolean, default: false }
    },
  Reviewers_detail: [
    {
      ReviewerName: { type: String },
      ReviewerLike: { type: Number, default: 0 },
      ReviewerDisLike: { type: Number, default: 0 },
      ReviewProfileImage: { type: String, default: "1.png" },
      ReviewerLikeby: { type: [String], default: [] },
      ReviewerDisLikeby: { type: [String], default: [] },
      Rating: { type: Number, min: 1, max: 5 },
      Review: { type: String },
      date: { type: Date, default: Date.now },
      editedAt: { type: Date },
      Overallexperience: {
        type: String,
        enum: [
          "Excellent",
          "Mixed",
          "Poor",
          "Outstanding",
          "Good",
          "Bad",
          "Awesome",
          "Worst",
          "Neutral",
          "Very Good"
        ],
        default: "Neutral"
      },
      Replies: [
        {
          ReplyName: { type: String },
          ReplyProfileImage: { type: String, default: "1.png" },
          ReplyLike: { type: Number, default: 0 },
          ReplyDisLike: { type: Number, default: 0 },
          ReplyLikeby: { type: [String], default: [] },
          ReplyDisLikeby: { type: [String], default: [] },
          Reply: { type: String },
          date: { type: Date, default: Date.now },
          editedAt: { type: Date }
        }
      ]
    }
  ],

  
  Comparepopularity: [
    {
      CurrentItem: { type: String, required: true },
      CurrentItemLikes: { type: Number },
      CurrentItemDislikes: { type: Number },
      CurrentDate: { type: Date, default: Date.now },
      PreviousItem: { type: String },
      PreviousItemLikes: { type: Number },
      PreviousItemDislikes: { type: Number }
    }
  ]
});

const Clothes = mongoose.model("Clothes", clothesSchema);
module.exports = Clothes;
