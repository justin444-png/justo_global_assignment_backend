const UserModel = require("../models/user.model")
const TokenModel = require("../models/token.model")
const OneTimeLinkModel = require("../models/one_time_link.model")
const bcrypt = require("bcryptjs");


const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isRegistered = await UserModel.findEmail(email);
        if (!email || !password) {
            return res
                .status(400)
                .send({
                    status: "failed",
                    message: !email && password ? "Email is required" : !password && email ? "Email is required" : "Email and password is required",
                    data: null,
                });
        }
        if (isRegistered) {
            return res
                .status(201)
                .send({
                    status: "failed",
                    message: "Email is already registered",
                    data: null,
                });
        }
        const createUser = await UserModel.register(req.body);
        if (!createUser) {
            return res
                .status(201)
                .send({
                    status: "failed",
                    message: "Failed to create user",
                    data: null,
                });
        }

        return res
            .status(201)
            .send({
                status: "success",
                message: "User created successfully",
                data: null,
            });
    } catch (error) {
        return res
            .status(201)
            .send({
                status: "Failed",
                message: "An error occurred while registering user",
                data: error.message,
            });
    }

};

const login = async (req, res) => {
    const { email, password } = req.body;
    const maximumeCount=10;
    const isRegistered = await UserModel.findEmail(email);

    if (isRegistered&&isRegistered.status==='2') {
        return res
            .status(201)
            .send({
                status: "failed",
                message: "your account is locked",
                data: null,
            });
    }

    if (!isRegistered) {
        return res
            .status(201)
            .send({
                status: "failed",
                message: "Email is not registered",
                data: null,
            });
    }
    const isValidPassword = await bcrypt.compare(password, isRegistered.password);
    if (!isValidPassword) {
        let count=isRegistered.loginFailedCount+1
        const updateAttemptCount = await UserModel.updateFailedCount(isRegistered.userId,count);
        const findUser= await UserModel.findUser(isRegistered.userId)
        if(findUser.loginFailedCount>=maximumeCount){
             await UserModel.blockUser(isRegistered.userId)
        }
        return res
            .status(201)
            .send({
                status: "failed",
                message: "Password is incorrect",
                data: null,
            });
    }
    const createToken = await TokenModel.createToken({ userId: isRegistered.userId })
    await UserModel.updateFailedCount(isRegistered.userId,0);
    return res
        .status(201)
        .send({
            status: "success",
            message: "Logged in successfully",
            data: {
                accessToken: createToken.accessToken,
                userId: createToken.userId
            },
        });
};

const generteOneTimeLink = async (req, res) => {
    
    const { userId } = req.params;
    const newLink = await OneTimeLinkModel.createOneTimeLink({ userId })
    return res
        .status(201)
        .send({
            status: "success",
            message: "One time link generated successfully",
            data: {
                link: `http://localhost:3002/api/auth/verifyLink/${newLink.link}`,
                linkId: newLink.linkId
            },
        });
};

const verifyLink = async (req, res) => {
    const { link } = req.params
    const links = await OneTimeLinkModel.findLink({ link: link })
    console.log(links)
    if (links.isUsedLink === '1') {
        return res
            .status(201)
            .send({
                status: "failed",
                message: "Sorry link is already used",
                data: null,
            });
    }
    const currentTime = new Date();
    const expiryDate = new Date(links.expiredAt)

    if (currentTime > expiryDate) {
        return res
            .status(201)
            .send({
                status: "failed",
                message: "Link is expired",
                data: null,
            });
    }
    const updateStatus=await OneTimeLinkModel.updateLinkStatus(link)
    return res
        .status(201)
        .send({
            status: "success",
            message: "Link verified successfully",
            data: {
                userId:updateStatus.userId
            },
        });
};

const getServerTime = async (req, res) => {
    const serverTime = new Date()
    return res
        .status(201)
        .send({
            status: "success",
            message: "Server time fetched successfully",
            data: {
                serverTime
            },
        });
};

const kickOutUser = async (req, res) => {
    const{userId}=req.params;
    const removeUser=await TokenModel.removeToken(userId)

    if(removeUser.affectedRows===1){
        return res
        .status(201)
        .send({
            status: "success",
            message: "User kicked out successfully",
            data: null
        });
    }
    return res
        .status(400)
        .send({
            status: "failed",
            message: "Failed to remove token",
            data: null
        });
};

module.exports = {
    register,
    login,
    generteOneTimeLink,
    verifyLink,
    getServerTime,
    kickOutUser
};