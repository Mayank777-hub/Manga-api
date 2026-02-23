const mongoose = require("mongoose");  // complete

const snacksSchema = new mongoose.Schema({
  ItemType: { type: String, enum: ["Manga", "Bags", "KeyChains", "Lamps", "Movable tables", "Posters", "Anime-Figures", "Manga-Merchandies", "Computer-games", "Playing-Cards", "Laptop-Covers", "Water-Bottles", "Lunch-box", "phone-cases", "Nintendo-playstations", "Desk-mat", "Mouse-pad", "Mangabased-Snacks"] },
  foodItemType: {
    type: String,
    enum: [
      "Mangabased-Snacks",
      "Food",
      "Drinks",
      "Candies",
      "Instant-Noodles",
      "Biscuits",
      "Chocolates",
      "Energy-Drinks",
      "Cereals",
      "cakes",
      "cup-cakes",
      "Cakes"
    ],
    required: true
  },


  Title: { type: String, required: true },
  Anime: { type: String },
  Animeurl: { type: String },
  Brand: { type: String },
  CountryOfOrigin: { type: String, default: "Japan" },


  Flavor: { type: String },
  Type: { type: String },
  Ingredients: [{ type: String }],
  Weight: { type: String },
  PackageType: { type: String },
  ShelfLife: { type: String },
  Vegetarian: { type: Boolean, default: true },
  AllergyInfo: [{ type: String }],


  Originalvalue: { type: Number },
  Marketprice: { type: Number },
  Currentoffer: [String],
  previousoffer: { type: String },
  Instock: { type: Boolean, default: true },
  Instockno: { type: Number, default: 0 },
  No_of_Likes: { type: Number, default: 0 },
  No_of_Dislikes: { type: Number, default: 0 },


  Images: [{ type: String, required: true }],
  Releasedate: { type: Date, default: Date.now },


  Calories: { type: String },
  Protein: { type: String },
  Fat: { type: String },
  Carbohydrates: { type: String },
  Sugar: { type: String },
  Sodium: { type: String },

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
      parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      ReviewerName: { type: String },
      ReviewerLike: { type: Number, default: 0 },
      ReviewerDisLike: { type: Number, default: 0 },
      ReviewProfileImage: { type: String, default: "1.png" },
      ReviewMedia: [
        {
          url: String,
          type: { type: String, enum: ["image", "video"] }
        }
      ],
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
      // Replies: [
      //   {
      //     ReplyName: { type: String },
      //     ReplyProfileImage: { type: String, default: "1.png" },
      //     ReplyLike: { type: Number, default: 0 },
      //     ReplyDisLike: { type: Number, default: 0 },
      //     ReplyLikeby: { type: [String], default: [] },
      //     ReplyDisLikeby: { type: [String], default: [] },
      //     Reply: { type: String },
      //     date: { type: Date, default: Date.now },
      //     editedAt: { type: Date }
      //   }
      // ]
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

const Snacks = mongoose.model("Snacks", snacksSchema);
module.exports = Snacks;
