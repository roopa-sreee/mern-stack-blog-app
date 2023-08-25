

const mongoose = require("mongoose");
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');

//GET  ALL Blogs 
exports.getAllBlogsController = async(req,res) => {
    try{
        const blogs = await blogModel.find({}).populate('user');
        if(!blogs){
            return res.status(200).send({
                success:false,
                message:"No blogs Found",
            });
        }
        return res.status(200).send({
            success:true,
            blogsCount:blogs.length,
            message:"All Blogs lists",
            blogs, 
        });
    }catch (error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error while fetching data",
            error
        })
    }
}

// create Blog 
exports.createBlogController = async(req,res) => {
    try{
        const {title,description,image, user} = req.body 

        //validating blog details 
        if (!title || !description || !image || !user ) {
            return res.status(400).send({
                success:false,
                message:"Please Provide All Details",
            });
        }
        const existingUser = await userModel.findById(user)
        // validation
        if (!existingUser){
            return res.status(404).send({
                success:false,
                message:"user not found"
            })
        }        
        const newBlog = new blogModel({ title, description, image, user });
        
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await session.commitTransaction();
        
        await newBlog.save();
        return res.status(200).send({
            success:true,
            message:"Blog Created Successfully",
            newBlog,
        });
    } catch(error){
        console.log(error)
        return res.send(500).send({
            success:false,
            message:'Error while creating the Blog',
            error
        })
    }
};

//Update Blog 
exports.updateBlogController = async(req,res) => {
    try{
        const { id } =  req.params;
        const { title, description, image} = req.body;
        const blog = await blogModel.findByIdAndUpdate(
            id,
            {...req.body},
            { new: true }
        );
        return res.status(200).send({
            success:true,
            message:'Blog Updated',
            blog,
        });        
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error While updating Blog data",
            error
        })
    }
};

//single Blog
exports.getBlogByIdController = async(req,res) => {
    try{
        const { id } = req.params
        const blog = await  blogModel.findById(id)
        if (!blog) {
            return res.status(404).send({
                success:false,
                message:"No blog  exists with given id" 
            });
        }
        return res.status(200).send({
            success:true,
            message:"Blog data Fetched Successfully",
            blog,
        });
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error While fetching Data",
            error
        })
    }
};

//Delete Blog 
exports.deleteBlogController = async(req,res) => {
    try{
        const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");
        await blog.user.blogs.pull(blog);        
        await blog.user.save();
        return res.status(200).send({
            success:true,
            message:"Blog Deleted!",
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Couldn't delete Blog Data !!",
            error
        });
    }
};


//Get user's blog
exports.userBlogController = async(req,res) => {
    try{
        const userBlog = await userModel.findById(req.params.id).populate('blogs');
        if (!userBlog) {
            return res.status(404).send({
                success:false,
                message:'No blogs found with this userId',
            })
        }
        return res.status(200).send({
            success:true,
            message:"User blogs' data fetched Successfully",
            userBlog,
        });
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Unable to fetch Data",
            error
        });
    }
};























