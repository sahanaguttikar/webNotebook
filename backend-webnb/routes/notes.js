const express=require('express');
const Notes = require('../mongoosemodels/Notes');
const router=express.Router();
var fetchuser=require('../mongoosemodels/middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//Get all the notes
router.get('/fetchnotes',fetchuser,async(req,res)=>{
    try {
        const note=await Notes.find({user:req.user.id});
    
    res.json(note);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error has occured");
    }
    
});

//add all new notes-login required
router.post('/addnotes',fetchuser,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'You should enter a valid description of 5 charecters').isLength({ min: 5 })    
],async(req,res)=>{
    try {
        const {title,description,tag}=req.body;
    //if error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note=new Notes({
        title,description,tag,user:req.user.id

    })
    const saveNote=await note.save();

    
    res.json([saveNote]);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error has occured");
    }
    
});
//update notes which is already exists
router.put('/updatenotes/:id',fetchuser,async(req,res)=>{
const {title,description,tag}=req.body;
try {
    //crate new notes
const newNotes={};
if(title){newNotes.title=title};
if(description){newNotes.description=description};
if(tag){newNotes.tag=tag};


//find and update
let note=await Notes.findById(req.params.id);
if(!note){return res.status(404).send("not found")};
if(note.user.toString()!=req.user.id){
    return res.status(404).send("Not allowed")

}
note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true});
res.json({note});
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error has occured");
}

})
//delete notes
router.delete('/deletenotes/:id',fetchuser,async(req,res)=>{
    try {
        //find and delete
    let note=await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("not found")};


    //allow if its the same user
    if(note.user.toString()!=req.user.id){
        return res.status(404).send("Not allowed")
    
    }
    note=await Notes.findByIdAndDelete(req.params.id);
    res.json({"sucess":"notes has been deleted",note:note});
    
    }
    
    
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error has occured");
    }
})

module.exports=router;

