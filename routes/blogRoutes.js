const express = require("express")
const { 
    getAllBlogsController, 
    createBlogController, 
    updateBlogController, 
    getBlogByIdController, 
    deleteBlogController, 
    userBlogController 
  } = require("../controllers/blogController")

// router object 
const router = express.Router()

//routes
//Get all blogs || GET 
router.get('/all-blogs', getAllBlogsController)

//create new blog || POST 
router.post('/create-blog',createBlogController)

//update existing blog || PUT
router.put('/update-blog/:id',updateBlogController)

//single blog || GET
router.get('/get-blog/:id', getBlogByIdController)

//delete blog || DELETE 
router.delete('/delete-blog/:id', deleteBlogController)

//get user's blog
router.get('/user-blog/:id', userBlogController)



module.exports = router