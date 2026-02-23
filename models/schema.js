const mongoose = require("mongoose");
const manga_genres = new mongoose.Schema({
    ItemType: { type: String, enum: ["Manga", "Bags", "KeyChains", "Lamps", "Movable tables", "Posters", "Anime-Figures", "Manga-Merchandies", "Computer-games", "Playing-Cards", "Laptop-Covers", "Water-Bottles", "Lunch-box","phone-cases","Nintendo-playstations","Desk-mat","Mouse-pad","Mangabased-Snacks"]},
    Genre : {type : String,enum:["Shonen","Shojo","Seinen","Josei","Kodomo","Mecha","Isekai","Ecchi","Hentai","Harem","Yaoi","Yuri","Reverse Harem"]},
    Type : [ { // type may be any thing
    Title: { type: String },
    Author: { type: String },
    Anime: { type: String },
    Artist : {type:String}, // artist of anime 
    Animeurl: { type: String },// since llama misteral not able to generate image i add image of anime
    Language: { type: String }, // on which language manga is available
    Genres: [{ type: String }], // may be there are mix type of genre
    Publishers: [String],
    Publishinghouses: [String],
    Originalvalue: { type: Number },
    previousvalue: { type: Number },
    Size: [Number], // dimensions of manga
    Marketprice: [Number],
    Aboutmanga: [String],  // description about manga
    Currentoffer: [String],
    No_of_Likes: {type:Number,default:0},  // total no of likes of manga
    No_of_Disikes: {type:Number, default:0}, // total number of dislikes of managa
    previousoffer: { type: String },
    Status: { type: String, enum: ["Ongoing", "Completed"], default: "Completed", required: true },  // ongoing,completed
    Agegroup: { type: Number },//12-18
    Status_age_wise: { type: String },//adult,childrens,teenagers,famlyfriendly
    versions: { type: String },  //black&white,colourfulle
    Volumes: [Number], // total volume released
    Image: { type: String },  //coverimages of manga
    Releasedate: { type: Date },
    Instock: { type: Boolean, default: true },
    Instockno: { type: Number },  // how much no of items left in stock
    Characters: [
        {
            Name: { type: String },
            Penname: { type: String ,default:""},
            Role: { type: String, enum: ['Hunter Association Leader','Double Star Hunter','Phantom Troupe Leader','Supporting Protagonist','Partner/Mascot','Mentor/Guild Leader','Protagonist','Deuteragonist', 'Tritagonist','Supporting Character','Antagonist/Ally','Antagonist', 'Supporting', 'Other','Mentor','Love-Interest'] ,required:true},
            Imageurl: { type: String ,required:true}
        }
    ],
    Reviewers_detail: [
        {
            ReviewerName: { type: String },
            ReviewerLike : {type : Number},
            ReviewProfileImage: { type: String, default: "1.png" },
            ReviewerDisLike : {type : Number},
            ReviewerLikeby : {type : [String] ,default:[]},
            ReviewerDisLikeby : {type : [String] ,default:[]},
            Rating: { type: Number, min: 1, max: 5 },
            Review: { type: String },
            date: { type: Date, default: Date.now },
            editedAt: { type: Date },
            Overallexperience: { type: String, enum: ["Excellent","Mixed","Poor","Outstanding" ,"Good", "Bad", "Awesome", "Worst", "Neutral","Very Good"], default: "Neutral" },
            _id :{ type : mongoose.Schema.Types.ObjectId , auto : true },
             Replies: [ 
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
       ReplyName: { type: String },
       ReplyProfileImage: { type: String, default: "1.png" },
            ReplyLike : {type : Number,default : 0},
            ReplyDisLike : {type : Number ,default : 0},
            ReplyLikeby : {type: [String] ,default:[]},
            ReplyDisLikeby : {type: [String] ,default:[]},
            Reply: { type: String },
        date: { type: Date, default: Date.now },
          editedAt: { type: Date },
      }
    ]
        }
    ],
    Volume: [
        {
            Currentvolume_no: { type: String }, // the volume number which user see
            Currentvolume_name: { type: String },
            volumeImage: { type: String },
            No_ofuser_buy: { type: String },
            No_ofuser_refunded: { type: String },
            Info_about_volume: { type: String },
            No_ofchapters: { type: Number },
            No_ofpages: { type: Number },
            Modifiedvolume_name: { type: String, default: "None" },  //the name may be change
            Modifiedvolume_info: { type: String },
            Modifiedvolume_no_of_pages: { type: Number },
        }
    ],
    NextMangaVolume: [
        {
            Nexturls: { type: [String] },  // as when we search any manga we find next book or manga related to it
        }
    ],
    PreviousMangaVolume: [
        {
            Previous_urls: { type: [String] },  // as when we search any manga we find Previous book or manga related to it
        }
    ],
    Comparepopularity: [
        {
            Currentvolume: { type: String, required: true },
            Currentvolumedate: { type: Date, default: Date.now },
            Current_volumeLikes: { type: Number },    // total positive comments  (current)
            Current_volumeDislikes: { type: Number },// total negative comments
            Total_Current_volumerating_no: { type: Number },
            Previousvolume: { type: String, required: true },
            PreviousvolumeLikes: { type: Number },
            PreviousvolumeDislikes: { type: Number },
            Total_Previous_volumerating_no: { type: Number },
        }   // we can also add timestamps:true  acc to our will 
    ]
}
]  // type ends here.
});
 const Manga = mongoose.model("Manga",manga_genres);
module.exports = Manga;


