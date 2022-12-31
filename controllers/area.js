const db = require('../models/index')
const Area = db.Area


exports.postArea = async (req, res, next) => {
    try{
        const token = req.header('token');
        if(!token) return res.status(400).send("Token not found")

        const checkArea = req.body.area

        const areaCheck = Area.findAll({
            where : {
                area : checkArea
            }
        })

        if (areaCheck) return res.json({
            success: false,
            message: ` ${checkArea} already Exists`
        })

        const area = await Area.create(req.body)
        res.status(200).json({
            success: true,
            message: `the area ${area.area} have been uploaded`,
            area
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "something went wrong, Area could not be added"
        })
    }
    }

    exports.getAllArea = async (req, res, next) => {
        try{
           
            const token = req.header('token');
            if(!token) return res.status(400).send("Token not found")
            const area = await Area.findAll()

            res.status(200).json({
                success: true,
                count: area.length,
                data : area
            });
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message: "something went wrong"
            })
        }
        }


        exports.getAreaListByStateId = async (req, res, next) => {
            try{
               
                const token = req.header('token');
                if(!token) return res.status(400).send("Token not found")

                const stateId = req.query.stateId

                const area = await Area.findAll({
                    where : {
                        stateId : stateId
                    }
                })

                const areaList = []

                for (i = 0; i < area.length; i++) {
                    const areas = area[i].area
                    areaList.push(areas)
                }
    
                res.status(200).json({
                    success: true,
                    count: area.length,
                    data : areaList
                });
            }catch(err){
                console.log(err)
                return res.status(500).json({
                    message: "something went wrong"
                })
            }
            }