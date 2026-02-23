const mongoose = require("mongoose");   //complete

const computer_accessories_schema = new mongoose.Schema({
     ItemType: { type: String, enum: ["Manga", "Bags", "KeyChains", "Lamps", "Movable tables", "Posters", "Anime-Figures", "Manga-Merchandies", "Computer-games", "Playing-Cards", "Laptop-Covers", "Water-Bottles", "Lunch-box","phone-cases","Nintendo-playstations","Desk-mat","Mouse-pad","Mangabased-Snacks"]},
  comItemType: {
    type: String,
    enum: [
      "Computer-Accessories",
      "Keyboards",
      "Mice",
      "Headphones",
      "Mouse-pads",
      "USB-Hubs",
      "Desk-mats",
      "Cooling-Pads",
      "Monitors",
      "Laptopcovers",
      "Laptop-Stands",
      "External-Harddrives",
      "Webcams",
      "Microphones",
      "Cable-Managers",
      "Speakers"
    ],
    required: true
  },

  Type: [
    {
      Title: { type: String, required: true }, 
      Brand: { type: String },
      Model: { type: String },
      Compatibility: [{ type: String }], 
      Image: { type: String }, 
      ProductGallery: [{ type: String }], 

      Color: [{ type: String }],
      Material: { type: String },
      Connectivity: { type: String },
      Features: [{ type: String }], 
      Size: [{ type: String }], 
      Weight: { type: Number },

      Originalvalue: { type: Number },
      previousvalue: { type: Number },
      Marketprice: { type: Number },
      Currentoffer: [String],
      previousoffer: { type: String },

      Warranty: { type: String },
      Manufacturer: { type: String },
      CountryOfOrigin: { type: String },

      Instock: { type: Boolean, default: true },
      Instockno: { type: Number },

      No_of_Likes: { type: Number, default: 0 },
      No_of_Disikes: { type: Number, default: 0 },

      Description: { type: String }, 
      Releasedate: { type: Date },
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
          CurrentModel: { type: String },
          CurrentModelLikes: { type: Number },
          CurrentModelDislikes: { type: Number },
          PreviousModel: { type: String },
          PreviousModelLikes: { type: Number },
          PreviousModelDislikes: { type: Number },
          CurrentModelDate: { type: Date, default: Date.now }
        }
      ]
    }
  ]
});

const ComputerAccessories = mongoose.model("ComputerAccessories", computer_accessories_schema);
module.exports = ComputerAccessories;
