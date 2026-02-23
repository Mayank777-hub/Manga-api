const Snacks = require("../models/Food");
const client = require("../config/redis");
const Fuse = require("fuse.js");

const getall = async (req, res) => {
  try {
    const { sort, cost, page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (currentPage - 1) * parsedLimit;

    let sortObj = {};

    if (cost) {
      if (cost === "asc") {
        sortObj.Originalvalue = 1;
      } else if (cost === "desc") {
        sortObj.Originalvalue = -1;
      }
    } else if (sort) {
      
      if (sort === "asc") {
        sortObj.Title = 1;
      } else if (sort === "desc") {
        sortObj.Title = -1;
      }
    }
    const data = await Snacks.find({})
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit);

    //  console.log('First item Originalvalue:', data[0]?.Originalvalue);
    //  console.log('Type:', typeof data[0]?.Originalvalue);
    //  console.log('Sort object:', sortObj);

    const totalItems = await Snacks.countDocuments();

    res.status(200).json({
      source: "Food-Snacks",
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / parsedLimit),
        currentPage,
        hasNextPage: currentPage < Math.ceil(totalItems / parsedLimit),
        hasPrevPage: currentPage > 1
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch snacks data"
    });
  }
};

//module.exports = { getall };

//Fixed document: 68014452a2ca02d7676ab9a1
//Fixed document: 6808b3d32f051a323e50c950
//Fixed document: 6808b3d32f051a323e50c965
//Fixed document: 6808b3d32f051a323e50c97b
//Fixed document: 6808b3d32f051a323e50c991
//Fixed document: 6808b3d32f051a323e50c9a3
//Fixed document: 6808b3d32f051a323e50c9b2
//Fixed document: 6808b3d32f051a323e50c9c3
//Fixed document: 6808b3d32f051a323e50c9d3
//Fixed document: 6808b3d32f051a323e50c9ea
//Fixed document: 6808b3d32f051a323e50c9f6


const likemanga = async (req, res) => {
  try {
    const snack = await Snacks.findById(req.params.id);

    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    snack.No_of_Likes += 1;
    await snack.save();

    res.status(200).json({
      message: "Liked successfully",
      likes: snack.No_of_Likes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while liking" });
  }
};


const dislikemanga = async (req, res) => {
  try {
    const snack = await Snacks.findById(req.params.id);

    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    snack.No_of_Dislikes += 1;
    await snack.save();

    res.status(200).json({
      message: "Disliked successfully",
      dislikes: snack.No_of_Dislikes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while disliking" });
  }
};

 const ShareComments = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const snack = await Snacks.findById(id, {
      Reviewers_detail: 1
    });

    if (!snack) {
      return res.status(404).json({
        message: "Snack not found"
      });
    }

    const review = snack.Reviewers_detail.find(
      r => r._id.toString() === reviewId
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json(review);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch shared comment"
    });
  }
};

const Likereview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
   // const { userid } = req.body;

    const userid = req.user.Universal.UUserid;

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    const review = snack.Reviewers_detail.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const alreadyLiked = review.ReviewerLikeby.includes(userid);
    const alreadyDisliked = review.ReviewerDisLikeby.includes(userid);

    if (alreadyLiked) {
      // remove like of user 
      review.ReviewerLike = Math.max(0, review.ReviewerLike - 1);
      review.ReviewerLikeby.pull(userid);
    } else {
      // add like
      review.ReviewerLike += 1;
      review.ReviewerLikeby.push(userid);

      // remove dislike if exists
      if (alreadyDisliked) {
        review.ReviewerDisLike = Math.max(0, review.ReviewerDisLike - 1);
        review.ReviewerDisLikeby.pull(userid);
      }
    }

    await snack.save();

    res.status(200).json({
      message: "Review like updated",
      likes: review.ReviewerLike,
      dislikes: review.ReviewerDisLike
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while liking review" });
  }
};

const likereply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const userid = req.user.Universal.UUserid;

    const snack = await Snacks.findById(id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });

    const reply = snack.Reviewers_detail.id(replyId);

    if (!reply || reply.parentId === null) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const liked = reply.ReviewerLikeby.includes(userid);
    const disliked = reply.ReviewerDisLikeby.includes(userid);

    if (liked) {
      reply.ReviewerLike--;
      reply.ReviewerLikeby.pull(userid);
    } else {
      reply.ReviewerLike++;
      reply.ReviewerLikeby.push(userid);

      if (disliked) {
        reply.ReviewerDisLike--;
        reply.ReviewerDisLikeby.pull(userid);
      }
    }

    await snack.save();

    res.json({
      message: "Reply like updated",
      likes: reply.ReviewerLike,
      dislikes: reply.ReviewerDisLike
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const dislikereply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const userid = req.user.Universal.UUserid;

    const snack = await Snacks.findById(id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });

    const reply = snack.Reviewers_detail.id(replyId);

    if (!reply || reply.parentId === null) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const disliked = reply.ReviewerDisLikeby.includes(userid);
    const liked = reply.ReviewerLikeby.includes(userid);

    if (disliked) {
      reply.ReviewerDisLike--;
      reply.ReviewerDisLikeby.pull(userid);
    } else {
      reply.ReviewerDisLike++;
      reply.ReviewerDisLikeby.push(userid);

      if (liked) {
        reply.ReviewerLike--;
        reply.ReviewerLikeby.pull(userid);
      }
    }

    await snack.save();

    res.json({
      message: "Reply dislike updated",
      dislikes: reply.ReviewerDisLike,
      likes: reply.ReviewerLike
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const Dislikereview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userid = req.user.Universal.UUserid;

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    const review = snack.Reviewers_detail.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const alreadyLiked = review.ReviewerLikeby.includes(userid);
    const alreadyDisliked = review.ReviewerDisLikeby.includes(userid);

    if (alreadyDisliked) {
      review.ReviewerDisLike = Math.max(0, review.ReviewerDisLike - 1);
      review.ReviewerDisLikeby.pull(userid);
    } else {
      review.ReviewerDisLike += 1;
      review.ReviewerDisLikeby.push(userid);

      if (alreadyLiked) {
        review.ReviewerLike = Math.max(0, review.ReviewerLike - 1);
        review.ReviewerLikeby.pull(userid);
      }
    }

    await snack.save();

    res.status(200).json({
      message: "Review dislike updated",
      dislikes: review.ReviewerDisLike,
      likes: review.ReviewerLike
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while disliking review" });
  }
};

 const addreviews = async (req, res) => {
  try {
    const snack = await Snacks.findById(req.params.id);
    if (!snack) return res.status(404).json({ message: "Item not found" });

    const { ReviewerName, Rating, Review, Overallexperience,ReviewMedia = []  } = req.body;

    if (!ReviewerName || !Review || !Rating || Rating < 1) {
      return res.status(400).json({ message: "Required fields like username , review or rating  missing" });
    }

    snack.Reviewers_detail.push({
      parentId: null,
      ReviewerName,
      Rating,
      Review,
      Overallexperience,
      ReviewProfileImage: "1.png",
      ReviewMedia,
      date: new Date()
    });
    
    await snack.save();

     const newReview = snack.Reviewers_detail[snack.Reviewers_detail.length - 1];
             
    res.status(201).json({ message: "Review added" ,
      review:newReview.toObject()
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

const addreply = async (req, res) => {
  try {
    const { id, commentid } = req.params;
    const { ReplyName, Reply,ReviewMedia = []  } = req.body;

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).send({ message: "Snack not found" });
    }

    const parent = snack.Reviewers_detail.id(commentid);
    if (!parent) {
      return res.status(404).send({ message: "Comment not found" });
    }

    const newReply = {
      parentId: commentid,
      ReviewerName: ReplyName,
      Review: Reply,
      ReviewProfileImage: "1.png",
      ReviewMedia,
      date: new Date()
    };

    snack.Reviewers_detail.push(newReply);
    await snack.save();

     const createdReply = snack.Reviewers_detail[snack.Reviewers_detail.length - 1];

    res.status(201).send({
      message: "Reply added successfully",
      reply: createdReply.toObject()
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Unable to add reply" });
  }
};

//const deletereviews = async (req, res) => {
//  try {
//    const { mangaID, reviewID } = req.params;
//    const manga = await Snacks.findById(mangaID);
//
//    if (!manga) {
//      return res.status(404).json({ message: "Item not found" });
//    }
//
//    manga.Reviewers_detail = manga.Reviewers_detail.filter(
//      r =>
//        r._id.toString() !== reviewID &&
//        r.parentId?.toString() !== reviewID
//    );
//
//    await manga.save();
//
//    res.json({ message: "Review and replies deleted" });
//  } catch (err) {
//    res.status(500).json({ message: "Delete failed" });
//  }
//};
//

const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    const target = snack.Reviewers_detail.id(commentId);
    if (!target) {
      return res.status(404).json({ message: "Comment not found" });
    }

   

    if (target.parentId === null) {
     
      snack.Reviewers_detail = snack.Reviewers_detail.filter(
        r =>
          r._id.toString() !== commentId && // yeh par bas sirf comment 
          r.parentId?.toString() !== commentId // ok yaha per iske comment ka reply  delete honga
      );
    } else {
      
      snack.Reviewers_detail.pull(commentId);
    }

    await snack.save();

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};



const viewreply = async (req, res) => {
  try {
    const { id, commentid } = req.params;

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).json({ message: " Unavailable Snack not found" });
    }

    // Replies = same coll, matches with  parentId
    const replies = snack.Reviewers_detail.filter(
      r => r.parentId?.toString() === commentid
    );

    res.status(200).json({
      totalReplies: replies.length,
      replies
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch replies" });
  }
};

const viewreviews = async (req, res) => {
  try {
    const { id } = req.params;

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    
    const reviews = snack.Reviewers_detail.filter(
      r => r.parentId === null
    );

    res.status(200).json({
      totalReviews: reviews.length,
      reviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch reviews" });
  }
};

//const deletereply = async (req, res) => {
//  try {
//    const { id, replyid } = req.params;
//
//    const snack = await Snacks.findById(id);
//    if (!snack) {
//      return res.status(404).json({ message: "Snack not found" });
//    }
//
//    const target = snack.Reviewers_detail.id(replyid);
//    if (!target) {
//      return res.status(404).json({ message: "Reply not found" });
//    }
//
//    // If deleting a COMMENT → delete all its replies
//    if (target.parentId === null) {
//      snack.Reviewers_detail = snack.Reviewers_detail.filter(
//        r => r.parentId?.toString() !== replyid
//      );
//    }
//
//    // Delete the target itself
//    target.deleteOne();
//
//    await snack.save();
//
//    res.status(200).json({
//      message: "Deleted successfully"
//    });
//
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({ message: "Unable to delete reply" });
//  }
//};

const Updatereviews = async (req, res) => {
  try {
    const { mangaID, messageid } = req.params;
    const manga = await Snacks.findById(mangaID);

    if (!manga) {
      return res.status(404).send({ message: "Manga not found" });
    }

    const review = manga.Reviewers_detail.id(messageid);
    if (!review || review.parentId !== null) {
      return res.status(404).send({ message: "Review not found" });
    }

    const { Review, Rating, Overallexperience } = req.body;

    if (Review) review.Review = Review;
    if (Rating !== undefined) review.Rating = Rating;
    if (Overallexperience) review.Overallexperience = Overallexperience;

    review.editedAt = new Date();

    await manga.save();
    res.status(200).send({ message: "Review updated successfully" });

  } catch (error) {
    res.status(500).send({ message: "Unable to update review" });
  }
};


const Editreply = async (req, res) => {
 try {
    const { id, replyid } = req.params;
    const { Review } = req.body;

    if (!Review) {
      return res.status(400).json({ message: "Review text requires" });
    }

    const snack = await Snacks.findById(id);
    if (!snack) {
      return res.status(404).json({ message: "Snack not found" });
    }

    const reply = snack.Reviewers_detail.id(replyid);
    if (!reply) {
      return res.status(404).json({ msg: "Reply not found" });
    }

    reply.Review = Review;
    reply.editedAt = new Date();

    await snack.save();

    res.status(200).json({
      message: "Reply updated successfully",
      reply
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to edit reply" });
  }
};

const getmanga = async (req, res) => {
  try {
     console.time("getmanga");
    const id = req.params.id;
     const key = `snack:${id}`;

     const firstget = await client.get(key);

     if(firstget){
      console.log("get our id");
        console.timeEnd("getmanga");
      return res.json(JSON.parse(firstget));
     }

    const manga = await Snacks.findById(req.params.id).select("-_id");
    

    
    if (!manga) {
      return res.status(404).send({ message: "Item not found" });
    }

    //const { Reviewers_detail, ...safeData } = manga.toObject();

    const response = { data: manga };

   await  client.set(key,JSON.stringify(response),"EX",60);
     console.timeEnd("getmanga");
   res.json(response);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Unable to fetch item details" });
  }
};

const GetMangaseries = async(req,res) => {
    try {
        const {manganame,volumeno} = req.params;
        const find = await Snacks.findOne({
            "Type.Title" : manganame 
        });
      
        if(!find){
            return res.status(400).send({msg:'Unable to find manga;'})
        }
        const volume = find.Type.flatMap(a => a.Volume).find( b => Number(b.Currentvolume_no) === Number(volumeno));

          if (!volume) {
      return res.status(404).json({ message: "Volume not found" });
    }
     const others = find.Type.flatMap(a=> a.Volume).filter(b => Number(b.Currentvolume_no) !== Number(volumeno)).sort((a,b)=> a.Currentvolume_no-b.Currentvolume_no);
      return   res.json({
      selectedVolume: volume,
      otherVolumes: others
    });
    } catch (error) {
        console.log(error);
       return  res.status(500).send({msg:"Server Error"});
    }
}

const ReportReview = async (req, res) => {
  try {
    const { id, reviewerid } = req.params;
    const manga = await Snacks.findById(id);

    if (!manga) {
      return res.status(404).send({ message: "Manga not found" });
    }

    const review = manga.Reviewers_detail.id(reviewerid);
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    res.status(200).send({
      message: "Review reported successfully",
      reviewid: reviewerid
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Unable to report review" });
  }
};

const Overallreview = async (req, res) => {
  try {
    const { id } = req.params;
    const manga = await Snacks.findById(id);

    if (!manga) {
      return res.status(404).send({ message: "Manga not found" });
    }

   // const reviews = manga.Reviewers_detail || [];
   const reviews = manga.Reviewers_detail.filter(
  r => r.parentId === null && r.Rating != null
);


    let total = 0;
    let starcount = { 1:0, 2:0, 3:0, 4:0, 5:0 };

    reviews.forEach(r => {
      total += r.Rating;
      if (starcount[r.Rating] !== undefined) {
        starcount[r.Rating]++;
      }
    });

    const AvgRATE = reviews.length ? (total / reviews.length).toFixed(2) : 0;

    res.status(200).send({
      starcount,
      AvgRATE
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Unable to calculate overall review" });
  }
};

const Agestatus = async (req, res) => {
    try {
        const status = req.params.Status_age_wise;
        manga_age_status = await Snacks.find({ "Type.Status_age_wise": status });
        if (!manga_age_status.length) {
            return res.status(500).send({ message: "Agegroup not matches find another another manga" });
        }
        res.status(200).json({ manga_age_status });
    }
    catch (error) {
        console.log(error);
        res.status(608).send({ message: "Not able to fetch the age status of your manga" })
    }
};

const Min_maxpricedisplay = async (req, res) => {
  try {
    const searchq = req.query.q;

    const matchStage = {};

    if (searchq) {
      matchStage.$or = [
        { Title: { $regex: searchq, $options: "i" } },
        { ItemType: { $regex: searchq, $options: "i" } },
        { Anime: { $regex: searchq, $options: "i" } }
      ];
    }

    const result = await Snacks.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          Maxprice: { $max: "$Marketprice" },
          Minprice: { $min: "$Marketprice" }
        }
      }
    ]);

    if (!result.length) {
      return res.status(404).send({ message: "No products found" });
    }

    res.status(200).send({
      min: result[0].Minprice,
      max: result[0].Maxprice
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Unable to fetch min & max price" });
  }
};

const Sortreview = async (req, res) => {
  try {
    const { id } = req.params;
    const sortby = req.query.sort;

    const product = await Snacks.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    //let reviews = product.Reviewers_detail || [];
    let reviews = product.Reviewers_detail.filter(
  r => r.parentId === null
);


    switch (sortby) {
      case "mostliked":
        reviews.sort((a, b) =>
          (b.ReviewerLikeby?.length || 0) -
          (a.ReviewerLikeby?.length || 0)
        );
        break;

      case "mostdisliked":
        reviews.sort((a, b) =>
          (b.ReviewerDisLikeby?.length || 0) -
          (a.ReviewerDisLikeby?.length || 0)
        );
        break;

      case "Newest":
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;

      case "Oldest":
        reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;

      case "5star":
        reviews = reviews.filter(r => r.Rating === 5);
        break;

      case "4star":
        reviews = reviews.filter(r => r.Rating === 4);
        break;

      case "3star":
        reviews = reviews.filter(r => r.Rating === 3);
        break;

      case "2star":
        reviews = reviews.filter(r => r.Rating === 2);
        break;

      case "1star":
        reviews = reviews.filter(r => r.Rating === 1);
        break;

        default:
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    }

    res.status(200).send({
      message: "Sorted successfully",
      TotalReview: reviews.length,
      Sortedby: sortby,
      Reviews: reviews
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Unable to sort reviews"
    });
  }
};

const pricefilter = async (req, res) => {
  try {
    const { min, max, itemtype, foodtype, search } = req.query;
    const query = {};

    if (search) {
      query.Title = { $regex: search, $options: "i" };
    }

    if (itemtype) {
      query.ItemType = itemtype;
    }

    if (foodtype) {
      query.foodItemType = foodtype;
    }

    if (min && max) {
      query.Marketprice = {
        $gte: Number(min),
        $lte: Number(max)
      };
    }

    const result = await Snacks.find(query);
    res.status(200).send(result);

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Price filter failed"
    });
  }
};

//const startFuse = require("fuse.js");

const getalltest = async (req, res) => {
  try {
    const { minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

   
    let allData = await Snacks.find({}); 

     
    if (minPrice) {
      const min = Number(minPrice);
      if (isNaN(min)) return res.status(400).json({ message: "not correct Invalid minPrice" });
      allData = allData.filter(item => item.Originalvalue >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (isNaN(max)) return res.status(400).json({ message: "Invalid maxPrice" });
      allData = allData.filter(item => item.Originalvalue <= max);
    }

   
    if (search) {
      const fuse = new Fuse(allData, {
        keys: [
          "Brand",
          "Title",
          "Anime",
          "Flavor",
          "Manufacturer.Name",
          "Manufacturer.Country",
          "Type",
          "foodItemType"
        ],
        threshold: 0.4,
      });
    // console.log("Search Query:", req.query.search);

      const results = fuse.search(search);
      allData = results.map(r => r.item);
    }
     console.log("Search Query:", req.query.search);

    
    const currentPage = parseInt(page);
    const perPage = parseInt(limit);

    const start = (currentPage - 1) * perPage;
    const end = currentPage * perPage;

    const paginated = allData.slice(start, end);

    const pagination = {
      currentPage,
      totalPages: Math.ceil(allData.length / perPage),
      totalItems: allData.length,
      hasNextPage: end < allData.length,
      hasPrevPage: start > 0,
    };

    return res.status(200).json({
      source: search ? "fuzzy+filter" : "all",
      pagination,
      allmangadata: paginated,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
    getall,
    getalltest,
    likemanga,
    dislikemanga,
    getmanga,
    Agestatus,
    addreviews,
    Likereview,
    Dislikereview,
    pricefilter,
   // deletereviews,
    Updatereviews,
    Overallreview,
    addreply,
   // deletereply,
    Editreply,
    likereply,
    dislikereply,
    deleteComment,
    viewreply,
    viewreviews,
    Min_maxpricedisplay,
    Sortreview,
    ReportReview,
    ShareComments,
    GetMangaseries
};