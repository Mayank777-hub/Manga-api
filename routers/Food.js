const  express = require("express")
const router = express.Router();

const authenticatejwt = require("../../loginapi/config/authjwt");

const {getall,ShareComments,Updatereviews,GetMangaseries,ReportReview,Overallreview,Sortreview,addreply,deleteComment,Editreply,likereply,dislikereply,viewreply,getalltest,likemanga,dislikemanga,getmanga,Agestatus,addreviews,Likereview,Dislikereview,pricefilter,Min_maxpricedisplay} = require("../controllers/Food");

router.route("/").get(getall);
router.route("/test").get(getalltest);
router.route("/:id").get(getmanga);
router.route("/:id/like").get(likemanga);
router.route("/:id/Reviewerdetail/Snacks/:reviewId/userLike").patch(authenticatejwt,Likereview); // patch i use as we need to updrade in the sub part of my api
router.route("/:id/Reviewerdetail/Snacks/:reviewId/userDisLike").patch(authenticatejwt,Dislikereview);
router.route("/:id/dislike").get(dislikemanga);
router.route("/AgeStatus/:Status_age_wise").get(Agestatus);
router.route("/:id/review").post(addreviews);
//router.route("/:id/allreviews").get(viewreviews);
//router.route("/:id/deletereview").post(deletereviews);
router.route("/:id/Updatereview").post(Updatereviews);
router.route("/pricefilter").post(pricefilter);
router.route("/price-range/pricedisplay").post(Min_maxpricedisplay)
router.route("/:id/review/:commentid/reply").post(addreply);//router.route("/:id/review/:commentid/reply").post(addreply);
router.route("/:id/:Commentsid/deletereply").post(deleteComment);
router.route("/:id/:Commentsid/likereply").patch(authenticatejwt,likereply);
router.route("/:id/:Commentsid/dislikereply").patch(authenticatejwt,dislikereply);
router.route("/:id/inspect/:Commentsid/reviewerdetails").post(viewreply);
router.route("/:id/:Commentsid/Editreply").post(Editreply);
router.route().post(Overallreview);
router.route("/manga/:id/sortreviews").get(Sortreview);
router.route("/:id/review_&_Reply/report/:ReviewerID").get(ReportReview);
router.route("/:id/share/:R&Rid").get(ShareComments);
router.route("/:mangaTitle/Volumes/:volumeNo").get(GetMangaseries);

module.exports = router;