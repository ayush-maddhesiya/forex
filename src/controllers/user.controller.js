// import { User } from "../models/user.model.js"

const test = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "test success"
    })
}


export { test }

