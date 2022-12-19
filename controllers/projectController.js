const db = require('../models/index')
const Project = db.Project

exports.postProject = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")
        const project = await Project.create(req.body)
        res.status(200).json({
            success: true,
            message: `the project with code ${project.projectID} have been uploaded`,
            project
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "something went wrong, Project could not be added"
        })
    }
    }

    exports.getAllProjectName = async (req, res, next) => {
        try{
           
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")
            const allProject = await Project.findAll()
            var allProjectNames = []
            console.log("all[roject", allProject)

            for (let i = 0; i < allProject.length; i++) {
                allProjectNames.push(allProject[i].projectName) 
              }
           
            res.status(200).json({
                success: true,
                count: allProjectNames.length,
                allProjectNames
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: "something went wrong"
            })
        }
        }

    exports.getAllProject = async (req, res, next) => {
            try{
               
                const token = req.header('token');
                if(!token) return res.status(400).send("Token not found")
                const allProject = await Project.findAll()
             
               
                res.status(200).json({
                    success: true,
                    count: allProject.length,
                    allProject
                });
            }catch(err){
                console.log(err)
                return res.status(500).json({
                    message: "something went wrong"
                })
            }
            }