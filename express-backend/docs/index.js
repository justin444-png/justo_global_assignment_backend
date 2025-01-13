const basicInfo = require("./basicInfo");
const component = require("./component");
const tag = require("./tag");
const authApi = require("./auth");

module.exports={
    ...basicInfo,
    ...component,
    ...tag,
    paths:{
        ...authApi
    }
}