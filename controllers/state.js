const db = require('../models/index')
const State = db.State


exports.postState = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")
        const state = await State.create(req.body)
        res.status(200).json({
            success: true,
            message: `the project with code ${state.state} have been uploaded`,
            state
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "something went wrong, Project could not be added"
        })
    }
    }

    exports.getAllState = async (req, res, next) => {
        try{
           
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")
            const state = await State.findAll()

            res.status(200).json({
                success: true,
                count: state.length,
                state
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: "something went wrong"
            })
        }
        }