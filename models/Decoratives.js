const mongoose = require("mongoose");   // complete

const decorativeSchema = new mongoose.Schema({
    ItemType: { type: String, enum: ["Manga", "Bags","Wall Hanging", "KeyChains", "Lamps","Anime Tapestry", "Movable tables", "Posters", "Anime-Figures", "Manga-Merchandies", "Computer-games", "Playing-Cards", "Laptop-Covers", "Water-Bottles", "Lunch-box", "phone-cases", "Nintendo-playstations", "Desk-mat", "Mouse-pad", "Mangabased-Snacks"] },
    DecorType: {
        type: String,
        enum: [
            "Lamps",
            "Posters",
            "Anime-Figures",
            "Movable tables",
            "KeyChains",
            "Desk-mat",
            "Mouse-pad",
            "Bags",
            "Lunch-box",
            "Water-Bottles",
            "phone-cases",
            "Manga-Merchandies",
            "Nintendo-playstations",
            "Playing-Cards",
            "Wall Hanging",
            "Anime Tapestry",
            "Light Box"
        ],
        required: true
    },

    Title: { type: String, required: true },
    Anime: { type: String },
    Animeurl: { type: String },

    Material: { type: String },
    Color: [{ type: String }],
    FinishType: { type: String },
    Shape: { type: String },
    Dimensions: { type: String },
    Weight: { type: String },
    Theme: { type: String },
    Handmade: { type: Boolean, default: false },
    Fragile: { type: Boolean, default: false },


    LightType: { type: String },
    PowerSource: { type: String },
    FrameMaterial: { type: String,default:"none" },
    MountType: { type: String },


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

        Manufacturer: {
        Name: { type: String, required: true },
        Country: { type: String },
        Address: { type: String ,default:"none"},
        ContactEmail: { type: String,default: "none" },
        ContactPhone: { type: String,default: "none" },
        Website: { type: String ,default: "none"},
        Warranty: { type: String,default: "none" }, 
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


const Decorative = mongoose.model("Decorative", decorativeSchema);
module.exports = Decorative;
