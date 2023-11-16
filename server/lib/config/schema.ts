import Joi from 'joi';

const supportedLanguages = Joi.string().valid('en', 'es');
const joinMeeting = Joi.object().keys({
    inputLang: supportedLanguages.required(),
    name: Joi.string().required(),
    outputLang: supportedLanguages.required(),
    socketClientId: Joi.string().required()
})

const passwordRequired = Joi.object().keys({
    password: Joi.string().required()
})

export default {
    joinMeeting,
    passwordRequired
}