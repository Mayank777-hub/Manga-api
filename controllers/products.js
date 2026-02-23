const render = require("../models/schema");
const Fuse = require("fuse.js");

const getall = async (req, res) => {
  try {
    const { sort, cost, page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const sortObj = {};

    if (sort === 'asc') {
      sortObj['Type.0.Title'] = 1;
    } else if (sort === 'desc') {   // sort === 'asc' ? sortObj['Type.0.Title'] = 1 : sortObj['Type.0.Title'] = -1;
      sortObj['Type.0.Title'] = -1;
    }

    if (cost === 'asc') {
      sortObj['Type.0.Originalvalue'] = 1;
    } else if (cost === 'desc') {              // cost === 'desc' ? sortObj[Type.0.Originalvalue] = 1 : sortObj[Type.0.Originalvalue] = -1;
      sortObj['Type.0.Originalvalue'] = -1;
    }

    const allmangadata = await render
      .find({})
      .select('-_id')
      .sort(sortObj)
      .skip(skip)              //find,select,sort(sortobg = {}),.skip,.limit;
      .limit(parsedLimit);
                                                                 // ham countDocuments use kar sakta ha rather then find length inside function
    const totalCount = await render.countDocuments({});
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.status(200).json({
      data: allmangadata,
      totalItems: totalCount,
      Totalpage: totalPages,
      currentPage: parseInt(page),
      nextpage: parseInt(page) < totalPages,
      previouspage: parseInt(page) > 1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch and sort data" });
  }
};
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
        const idkikes = await render.findById(req.params.id);
        if (!idkikes) {
            return res.status(404).send({ message: "404 Server Likes File not Found" });
        }
        idkikes.No_of_Likes += 1;
        await idkikes.save();
        res.status(200).json({ message: "Liked successfully", likes: idkikes.No_of_Likes });
    }
    catch (error) {
        console.log(error);
        res.status(408).send({ message: "Server Error due to Large no of Likes" });
    }
};

const dislikemanga = async (req, res) => {
    try {
        const dislikes = await render.findById(req.params.id);
        if (!dislikes) {
            return res.status(404).send({ message: "404 Server diLikes File not Found" });
        }
        dislikes.No_of_Disikes += 1;
        await dislikes.save();
        res.status(200).json({ message: " Total no of disLiked added successfully", Totaldislikes: dislikes.No_of_Disikes });
    }
    catch (error) {
        console.log(error);
        res.status(408).send({ message: "Server Error due to Large no of dislikes" });
    }
};
  const ShareComments = async(req,res) => {
try {
    const {id,reviewId} =req.params;
    const manga = await render.findById(id,{
        "Type.Reviewers_detail" : 1 ,   // we use them as if we nowant whole schema aprt so we remove thsi one;
    });
    if(!manga){
        return  res.send({msg:"Unable to find manga at provided Id"})
    }

    const rr = manga.Type.flatMap(a => a.Reviewers_detail).find(t => t._id.toString() === reviewId);  // we will flast only when we want data in {1,2,3....} format
    if(!rr){
        return res.status(404).send({msg:"we unable to find review or reviewid not matches."})
    }
     res.json(rr);
} catch (error) {
    console.log(error);
    res.status(500).send({msg:"Unable to sdhared comment at provided Platform."})
}
  }
const Likereview = async (req, res) => {
    try {
        const likesr = await render.findById(req.params.id);
        const userid= req.user.Universal.UUserid; //req.body.userid;
        if (!likesr) {
            return res.status(404).send({ message: "Not able to Increment likes of users" });
        }
        const Reviewid = req.params.Reviewid;
        const founddetals = likesr.Type[0]?.Reviewers_detail;
        const review = likesr.Type[0].Reviewers_detail.id(Reviewid);

          if (!review) {
            return res.status(404).send({ message: "Unable to like or dislike comments due to undefined review" })
        }
        
        const alreadyLike = review.ReviewerLikeby.includes(userid);
        const alreadydislike =review.ReviewerDisLikeby.includes(userid);


        if(alreadyLike) {
         review.ReviewerLike = Math.max(0,review.ReviewerLike-1);
         review.ReviewerLikeby = review.ReviewerLikeby.filter(id => id !== userid);
        }
        else {
            review.ReviewerLikeby.push(userid);
            review.ReviewerLike = review.ReviewerLike += 1;
          
           if(alreadydislike){
            review.ReviewerDisLike = Math.max(0,review.ReviewDislike-1);
            review.ReviewerDisLikeby = review.ReviewerDisLikeby.filter(i => i !== userid);
           }    
        }
        await likesr.save();
        res.status(200).send({ message: "Likes added by +1 of User Successfully", Totallikes_User: review.ReviewerLike });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server Error due to no Review Detail" }) // 500 means erroe or not work acc to function or logic.
    }
}

const likereply = async (req, res) => {
    try {
        const { mangaids, replyids } = req.params;
        const userid= req.user.Universal.UUserid; //const userid = req.body.userid;
        const manga = await render.findById(mangaids);
        if (!manga) {
            return res.send({ message: "No manga found try again Later." })
        }

        if (!replyids) {
            return res.send({ message: "No reply id found" })
        }
        const foundreply = manga.Type[0]?.Reviewers_detail;
        for (let a of foundreply) {
            const reply = a.Replies.id(replyids);
            if (reply) {
                const alreadyLiked = reply.ReplyLikeby.includes(userid);
                const alreadyDisLiked = reply.ReplyDisLikeby.includes(userid);

                if (alreadyLiked) {
                    reply.ReplyLike = Math.max(0, reply.ReplyLike - 1);
                    reply.ReplyLikeby = reply.ReplyLikeby.filter(id => id !== userid);
                }

                else {
                    reply.ReplyLike += 1;
                    reply.ReplyLikeby.push(userid);


                    if (alreadyDisLiked) {
                        reply.ReplyDisLike = Math.max(0, reply.ReplyDisLike - 1);
                        reply.ReplyDisLikeby = reply.ReplyDisLikeby.filter(id => id !== userid);
                    }
                }

                await manga.save();
                return res.status(200).send({
                    message: "Like of reply section is Successfully",
                    By: reply.ReplyLikeby,
                    Liked_Notliked: alreadyLiked ? "liked" : "Notliked",
                    Totallikes: reply.ReplyLike,
                    id: userid
                })
            }
        }
        return res.send({
            message: "Unable to Like an reply of",
            Username: foundreply.ReviewerName,
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server Error not able to like an reply of comment." })
    }

}
const dislikereply = async (req, res) => {
    try {
        const { mangaids, replyids } = req.params;
        const userid= req.user.Universal.UUserid; //const userid = req.body.userid;
        const manga = await render.findById(mangaids);
        if (!manga) {
            return res.send({ message: "No manga found try again Later." })
        }


        if (!replyids) {
            return res.send({ message: "No reply id found" })
        }
        const foundreply = manga.Type[0]?.Reviewers_detail;
        for (let a of foundreply) {
            const reply = a.Replies.id(replyids);
            if (reply) {
              const  alreadyliked = reply.ReplyLikeby.includes(userid);
               const  alreadydisliked = reply.ReplyDisLikeby.includes(userid);
                if (alreadydisliked) {
                    reply.ReplyDisLike = Math.max(0, reply.ReplyDisLike - 1);
                    reply.ReplyDisLikeby = reply.ReplyDisLikeby.filter(id => id !== userid)
                }
                else {
                    reply.ReplyDisLike += 1;
                    reply.ReplyDisLikeby.push(userid);


                    if (alreadyliked) {
                        reply.ReplyLike = Math.max(0, reply.ReplyLike - 1);
                        reply.ReplyLikeby = reply.ReplyLikeby.filter(id => id !== userid)
                    }
                }

                await manga.save();
                return res.status(200).send({
                    message: "Reply disliked Successfully",
                    By: reply.ReplyLikeby,
                    DisLiked_Notdisliked: alreadyLiked ? "liked" : "Notliked",
                    Totallikes: reply.ReplyLike,
                    id: userid
                })
            }
        }

        return res.status(404).send({ message: "Unable to perform dislike function on reply due to busy server or weak network." });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Unable to Dislike an reply due to Server Error" })
    }
}
const Dislikereview = async (req, res) => {
    try {
        const likesr = await render.findById(req.params.id);
        const userid= req.user.Universal.UUserid; //const userid = req.body.userid;
        if (!likesr) {
            return res.status(404).send({ message: "Not able to Decrement likes of users" });
        }
        const Reviewid = req.params.Reviewid;
        const review = likesr.Type[0].Reviewers_detail.id(Reviewid);
        if (!review) {
            return res.status(404).send({ message: "Unable to like or dislike comments due to undefined review" })
        }
        const alreadyliked = review.ReviewerLikeby.includes(userid);
        const alreadyDisliked = review.ReviewerDisLikeby.includes(userid);
        if(alreadyDisliked){
            review.ReviewerDisLike = Math.max(0,Review.ReviewerDisLike -1);
            review.ReviewerDisLikeby = review.ReviewerLikeby.filter(id => id !== userid);
        }
         else {
            review.ReviewerDisLikeby.push(userid);
            review.ReviewerDisLike = review.ReviewerDisLike += 1;
          
           if(alreadyliked){
            review.ReviewerLike = Math.max(0,review. ReviewerLike-1);
            review.ReviewerLikeby = review.ReviewerLikeby.filter(i => i !== userid);
           }    
        }
        await likesr.save();
        res.status(200).send({ message: "DisLikes added by +1 of User Successfully", TotalDislikes_User: review.ReviewerDisLike });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server Error due to no Review Detail" }) // 500 means erroe or not work acc to function or logic.
    }
}
const addreviews = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "Request body is empty. Make sure you're sending a POST request with JSON data." });
        }

        const mangaidsall = req.params.id;
        const findIds = await render.findById(mangaidsall);
        const currentdate = new Date();

        if (!findIds) {
            return res.status(404).send({ message: "provided ID to track manga is not valid. " });
        }

        const Titleofids = findIds.Type[0]?.Title;
        const { ReviewerName, Rating, Review, date, Overallexperience } = req.body;

        if (!ReviewerName) {
            return res.status(400).send({ message: "ReviewerName is required" });
        }
        if (!Review) {
            return res.status(400).send({ message: "Review content is required" });
        }
        if (Rating === undefined || Rating === null) {
            return res.status(400).send({ message: "Rating is required" });
        }

        const newreviewer = {
            ReviewerName,
            Rating,
            Review,
            date: currentdate,
            Overallexperience: Overallexperience || ""
        };

        if (!findIds.Type[0].Reviewers_detail) {
            findIds.Type[0].Reviewers_detail = [];
        }

        findIds.Type[0].Reviewers_detail.push(newreviewer);
        await findIds.save();

        res.status(201).send({
            message: "Review added successfully",
            review: {
                newreviewer,
                formatdate: currentdate.toLocaleString("en-IN", {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    Date: 'numeric',
                    hour: '2 digit',
                    minute: '2-digit',
                    hour12: true
                }),
            },
            On: Titleofids,
            totalReviews: findIds.Type[0].Reviewers_detail.length
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Unable to add review due to server error. Please try again later.",
        });
    }
};

const addreply = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            res.send({ message: "Unavailable manga id " });
        }
        const { mangas_ids, commentid } = req.params;
        const manga = await render.findById(mangas_ids);
        const currentdate = new date();
        const { ReviewerName, ReviewerLike, ReviewerDisLike, Reply, date, editedAt } = req.body;
        if (!manga) {
            res.status(200).send({ mesage: "no manga found check your connections" });
        }
        const comment = manga.Type[0].Reviewers_detail.id(commentid);
        if (!comment) {
            res.send({ message: "No Comment or Review finds" })
        }
        if (!ReviewerName) {
            res.send({ message: "Suspecious User no Username available" });
        }
        if (!Review) {
            return res.status(400).send({ message: "Review content is required" });
        }
        const newreply = {
            ReviewerName,
            ReplyLike,
            ReplyDisLike,
            Reply,
            date : currentdate,
            editedAt
        }
        if (!manga.Type[0].Reviewers_detail) {
            manga.Type[0].Reviewers_detail = [];
        }
        comment.Replies.push(newreply);
        await manga.save();
        res.status(201).send({
            message: "Reply added Successfully :-)",
            Commentid: {
                commentid,
                formatdate: currentdate.toLocaleString("en-IN", {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    Date: 'numeric',
                    hour : '2-digit',
                    minutes : '2-digit',
                    hour12 : true,
                })
            },
            TotalREplies: comment.Replies.length,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Unable to add reply to the id of requested comment",
        })
    }
}
const deletereviews = async (req, res) => {
    try {
        const { mangaID, reviewID } = req.params;
        const manga = await render.findById(mangaID);
        if (!manga) {
            return res.send({ message: "We unable to find your searched manga with the provided id:", SearchedId: mangaID })
        }
        const reviewcollection = await manga.Type[0]?.Reviewers_detail;
        if (!reviewcollection) {
            return res.status(400).send({ message: "We unable to find your uploaded message in comment section try again later provided id:", CommentID: reviewID })
        }
        const reviewCount = reviewcollection.findIndex(r => r._id.toString() === reviewID)
        if (reviewCount === -1) {
            return res.status(404).send({ message: "Your Review cannot be Found." })
        }
        reviewcollection.splice(reviewCount, 1) // *pTr = yha pe splice ka ander (konse index par ha jise delete karne ha,kitne index ha)
        await manga.save();
        returnres.status(200).send({ message: "Your review or reply deleted Succcessfully." })
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Deletion of an review or reply is not possible currently due to busy server.Please try later" });
    }
}

const viewreviews = async ( req,res) => {
    try {
        const {id} = req.params;
        const manga = await render.findById(id).select('-_id');

        if(!manga){
            return res.status(404).send({message : "Unable to get all the mangas data at the provided id =",
                Mangaid:id,
            })
        }

        const findreview_details = manga.Type[0]?.Reviewers_detail;
            res.status(200).json({
                message : "All reviews fetched Successfully",
                Totalreviews : findreview_details.length,
                review : findreview_details.map(r => ({
                ProfileImage : r.ReviewProfileImage,
                 Reviewname : r.ReviewerName,
                 Reviewlikes : r.ReviewerLike,
                 ReviewDislikes : r.ReviewerDisLike,
                 Rating :r.Rating,
                 Review : r.Review,
                 Date:r.date,
                 Overallexperience : r.Overallexperience,
                 Reply_count: r.Replies?.length || 0 ,
                 Hasreplies:r.Replies?.length > 0,
                })
                ) 
    })
            } catch (error) {
        console.log(error);
        res.status(500).send({message:"Unable to fetch details of reviews ;-("})
    }
}

const viewreply = async  (req,res) => {
    try{
        const {reviewid,mangaid} = req.params;
       const manga = await render.findById(mangaid);

       if(!mangaid){
        return res.status(404).send({messageL:"Unable to find manga at provided id ",
            mangaid : mangaid,
        })
       }

       if(!reviewid){
        return res.status(404).send({message:"Unable to find reviewid kindly check it before fetching."})
       }

       const Replies = manga.Type[0]?.Reviewers_detail.Review.id(reviewid);
       res.status(200).send({message:"All replies fetched Successfully!!!",
        Replyid:reviewid,
        Totalreply : Replies.length,
        Reply : Replies.map(a => ({
            Replyname : a.ReplyName,
            Reply: a.Reply,
            ReplyProfile : a.ReplyProfileImage,
            Date : a.date,
            ReplyLike:a.ReplyLike,
            ReplyDisLike:a.ReplyDisLike,
            edited:a.editedAt,
        })
        )
       })
       
    }
    catch(error){
        console.log(error);
        res.status(500).send({message:"Unable to fetch required replies"});
    }
}
const deletereply = async (req, res) => {
    try {
        const { mangaid, replyid } = req.params;
        const manga = await render.findById(mangaid);
        if (!manga) {
            res.send({ message: "No Manga Available or No proper ID allocated or associated to manga." })
        }

        const reviewers = manga.Type[0]?.Reviewers_detail//.id(replyid);
        if (!reviewers) {
            return res.send({ message: "No review detail available" });
        }
        let deletes = false;
        for (let a of reviewers) {
            const allreplies = a.Replies;
            if (allreplies && allreplies.length > 0) {
                const Perementdelete = allreplies.findIndex(s => s._id.toString() === replyid);
                if (Perementdelete !== -1) {
                    allreplies.splice(Perementdelete, 1);
                    deletes = true;
                    break;
                }
            }
        }
        if (!deletes) {
            return res.status(202).send({ message: "No deletion is performrd due to Unavailablity of commentID" });
        }
        await manga.save();
        return res.send({ message: "Deletion of reply is Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Unable to delete reply try again Later!!!" })
    }
}
const Updatereviews = async (req, res) => {
    try {
        const { mangaID, messageid } = req.params;
        const manga = await render.findById(mangaID);
        if (!manga) {
            return res.status(404).send({ message: "Your manga cannot be find due to Invalid Manga id" });
        };

        const allcomment = manga.Type[0]?.Reviewers_detail;
        if (!Array.isArray(allcomment))                              // we are refer updatedcheckcomment to previous comment before edit and check it through mdb id
        {
            return res.status(404).send({ message: "Unable to find the provided comment" });
        };

        const updatedcheckcomment = allcomment.find(r => r._id.toString() === messageid);
        if (!updatedcheckcomment) {
            return res.status(404).send({ message: "Your id of comment is Invalid check it and try agallreview",
            });
        }
        const updatedcomment = req.body;
        Object.assign(updatedcheckcomment, updatedcomment);
        updatedcheckcomment.editedAt = new Date();
        await manga.save();
        res.status(200).send({ message: "Your message or reply is successfully updated.", updatedcomments: updatedcomment });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Unable to update your message or reply Please check your connection or try again later.If still it not solve Contact our department throung contacts mentions in Help section." })
    }
}

const Editreply = async (req,res) => {
    try {                                            // we can also use Objectassign but it is length so we not use it here 
        const {mangaid,reviewid} = req.params;
        const {replyid,updatedreply} =req.body;
        const manga = await render.findById(mangaid);

        if(!manga){
            return res.status(404).send({message:"Unable to find the manga at provided id",
                Mangaid : mangaid,
            });
        }
 
        const findreview = manga.Type[0]?.Reviewers_detail;
          const review =  findreview?.find(qa => qa._id.toString()=== reviewid);
            if(!review){
                return res.send({message:"No reviewid find"});
            }

            const allreview = review.Replies;
         if(!Array.isArray(allreview)){
            return res.send({message:"Unable to find review"});
        }
       
                const find = allreview.findIndex(a=> a._id.toString() === replyid);
                if(find === -1){
                     return res.status(404).send({ message: "Reply not found." });
                   }
                   if(typeof updatedreply !== "string" || updatedreply.trim() === ""){
                    return res.status(404).send({message:"Reply must be string"})
                   }

                   allreview[find].Reply = updatedreply;
                   allreview[find].editedAt = new Date();
                   await manga.save(); 
                   return res.status(200).send({message:"Reply edited Successfully at",
                EditeAt :allreview[find].editedAt,
                updatedreply:allreview[find].Reply,
             });
            
        }
       catch (error) {
        console.log(error);
        res.status(500).send({message:"Unable to update the reply due to Server error."})
    }
}
    
const getmanga = async (req, res) => {
    try {
        const detailmangaids = await render.findById(req.params.id).select('-_id');
        if (!detailmangaids) {
            return res.status(908).json({ message: "Manga detail Fetached UnSuccessfully!!!" })
        }

        detailmangaids.Type = detailmangaids.Type?.map( t => {
            const {Reviewers_detail,...leftover} = t.toObject();
            return leftover;
     } );
     
        console.log(`${detailmangaids.Type[0]?.Title} Succesfully Fetched`)
        res.status(200).json({ detailmangaids });
    }
    catch (error) {
        console.log(error);
        res.status(432).send({ message: "Unable to fetch data of manga through mangaid's" })
    }
};
const GetMangaseries = async(req,res) => {
    try {
        const {manganame,volumeno} = req.params;
        const find = await render.findOne({
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

const ReportReview = async (req,res) => {
    try {
        const {id,reviewerid} = req.params;
        const manga = await render.findById(id).select("-_id");
        if(!manga){
            return res.ststus(404).send({message:"Unable to find manga by provided id"});
        }
    
        const find = manga.Type[0]?.Reviewers_detail;
        const findreviewids = find.find(i => i._id.toString() === reviewerid);

        if(!findreviewids){
            res.send({message:"Unable to find review id",
                reviewerid: reviewerid
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"Unable to send request to block Reviewer id"
        })
    }
}

const Overallreview = async (req,res) => {
    try {
        const mangaid =req.params;
        const manga = await render.findById(mangaid);
        if(!manga){
            return res.status(404).send({message:"Unable to lOcate Manga at provided mangaid."});
        }
        const reviewer =manga.Type[0].Reviewers_detail || [];

        let initialcount = 0;
        let starcount = {"1":0,"2":0,"3":0,"4":0,"5":0 };
         

        reviewer.forEach(r=> {
            const rating = r.Rating;
            initialcount += rating;
            if( starcount[rating] !== undefined){
                       starcount[rating]++
            }
        }
        )
         const AvgRATE = 9(initialcount/reviewer.length).toFixed(2);

         res.status(200).send({message:"Overall data fetch Successfully",
            starcount,
            AvgRATE,
          })

    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Server error Try Again Later."})
    }
}
const Agestatus = async (req, res) => {
    try {
        const status = req.params.Status_age_wise;
        manga_age_status = await render.find({ "Type.Status_age_wise": status });
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

const Min_maxpricedisplay = async (req, res) => {  // it provide  valued to price-slider 
    const searchq = req.query.q;
    try {
        const Check = await render.aggregate([  // aggregate used instead of find as the Marketprice Is in deep of subarray 
            { $unwind: "$Type" }, // it create new document 
            {
                $match: {   // match the searched value 
                    $or: [
                        { "Type.Title": { $regex: searchq, $options: "i" } },
                        { ItemType: { $regex: searchq, $options: "i" } },
                        { Genre: { $regex: searchq, $options: "i" } }
                    ]
                }
            },
            { $unwind: "$Type.Marketprice" },
            {
                $group: {   // it group all the subdocument in document
                    _id: null,
                    Maxprice: { $max: "$Type.Marketprice" },
                    Minprice: { $min: "$Type.Marketprice" }
                }
            }
        ]);
        if (Check.length === 0) {
            return res.status(404).send({ message: "You search request can not be proceed." })
        }
        res.status(200).send({
            max: Check[0].Maxprice,
            min: Check[0].Minprice
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: "MIN and MAX price Unable to  fetch Check Your Connection or Try Later." })
    }
}

const Sortreview = async(req,res) => {
    try {
        const {mangaid} =req.params;
        const sortby = req.query.sort;

        const manga =await render.findById(mangaid);

        if(!manga){
            return res.status(404).send({message:"Unable to find manga at provided mangaid"})
        }

        let reviewdetails = manga.Type[0]?.Reviewers_detail || [];
         
        switch (sortby) {
            case 'mostliked':
                reviewdetails.sort((a,b)=> (b.ReviewerLikeby?.length || 0)  - (a.ReviewerLikeby?.length || 0));
                break;
            case 'mostdisliked':
                reviewdetails.sort((a,b)=> (a.ReviewerDisLikeby?.length  || 0) - (b.ReviewerDisLikeby?.length || 0));
                break;
            case 'Newest':
                reviewdetails.sort((a,b)=> (new Date(b.date)) - (new Date(a.date)));
                break;
            case 'Oldest':
                reviewdetails.sort((a,b)=> (new Date(a.date)) - (new Date(b.date)));
                break;
            case '5star':
                reviewdetails = reviewdetails.filter(r => r.Rating === 5);
                break;
            case '4star':
                reviewdetails = reviewdetails.filter(r => r.Rating === 4);
                break;
            case '3star':
                reviewdetails = reviewdetails.filter(r => r.Rating === 3);
                break;
            case '2star':
                reviewdetails = reviewdetails.filter(r => r.Rating === 2);
                break;
            case '1star':
                reviewdetails = reviewdetails.filter(r => r.Rating === 1);
                break;
            default:
                break;
        }

        res.send({message:"Sorted Successfully",
            TotalReview:reviewdetails.length,
         Sortedby: sortby,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Unable to sort the data according to provided req.query.sort !!!"})
    }
}
const pricefilter = async (req, res) => {
    try {
        const query = {};
        const { max, min, itemtype, genre, search } = req.query;

        if (search) {
            query["Type.Title"] = { $regex: search, $options: "i" };
        }
        if (itemtype) {
            query.ItemType = itemtype;
        }
        if (genre) {
            query.Genre = genre;
        }
        if (max && min) {
            query["Type.Marketvalue"] = {
                $gte: Number(min),
                $lte: Number(max)
            };
        }
        const result = await render.find(query);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Price filter of particular product unable to apply due to Server error or Network error . Try Again Later." })
    }
}
const getalltest = async (req, res) => {
  try {
    const { minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

   
    let allData = await render.find({}).lean(); 

     
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
          "foodItemType",
           "Type.Title",
      "Type.Anime",
      "Type.Author"
        ],
        threshold: 0.4,  // thres hold set  at all this;
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
    deletereviews,
    Updatereviews,
    Overallreview,
    addreply,
    deletereply,
    Editreply,
    likereply,
    dislikereply,
    viewreply,
    viewreviews,
    Min_maxpricedisplay,
    Sortreview,
    ReportReview,
    ShareComments,
    GetMangaseries
};