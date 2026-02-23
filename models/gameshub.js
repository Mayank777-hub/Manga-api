const mongoose = require("mongoose"); // complete

const games_schema = new mongoose.Schema({
     ItemType: { type: String, enum: ["Manga", "Bags", "KeyChains", "Lamps", "Movable tables", "Posters", "Anime-Figures", "Manga-Merchandies", "Computer-games", "Playing-Cards", "Laptop-Covers", "Water-Bottles", "Lunch-box","phone-cases","Nintendo-playstations","Desk-mat","Mouse-pad","Mangabased-Snacks"]},
  gameItemType: {
    type: String,
    enum: [
      "Games",
      "Indoor-Games",
      "Outdoor-Games",
      "Computer-Games",
      "PSP-Games",
      "Board-Games",
      "Card-Games",
      "Arcade-Games",
      "Sports-Games",
      "VR-Games"
    ],
    required: true
  },

  Category: {
    type: String,
    enum: ["Indoor", "Outdoor"],
    required: true
  },

  Type: [
    {
      Title: { type: String, required: true }, 
      Brand: { type: String },
      Platform: { type: String },
      Genre: [{ type: String }], 
      Multiplayer: { type: Boolean, default: false },
      OnlineSupport: { type: Boolean, default: false },
      MinPlayers: { type: Number },
      MaxPlayers: { type: Number },
      AgeRating: { type: String }, 
      Material: { type: String }, 
      Color: [{ type: String }],
      Image: { type: String }, 
      ProductGallery: [{ type: String }], 

      Description: { type: String },
      Features: [{ type: String }],
      Requirements: [{ type: String }], 

      Originalvalue: { type: Number },
      previousvalue: { type: Number },
      Marketprice: { type: Number },
      Currentoffer: [String],
      previousoffer: { type: String },

      Instock: { type: Boolean, default: true },
      Instockno: { type: Number },
      Releasedate: { type: Date },

      No_of_Likes: { type: Number, default: 0 },
      No_of_Disikes: { type: Number, default: 0 },

      Ratings: { type: Number, min: 0, max: 5, default: 0 },
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
          ReviewerLikeby: { type: [String], default: [] },
          ReviewerDisLikeby: { type: [String], default: [] },
          Rating: { type: Number, min: 1, max: 5 },
          Review: { type: String },
          ReviewProfileImage: { type: String, default: "1.png" },
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
          CurrentVersion: { type: String },
          CurrentVersionLikes: { type: Number },
          CurrentVersionDislikes: { type: Number },
          PreviousVersion: { type: String },
          PreviousVersionLikes: { type: Number },
          PreviousVersionDislikes: { type: Number },
          CurrentVersionDate: { type: Date, default: Date.now }
        }
      ]
    }
  ]
});

const Games = mongoose.model("Games", games_schema);
module.exports = Games;
