import Joi from 'joi';
import { SUPPORTED_LANGUAGES } from './constants';

const supportedLanguages = Joi.string().valid(...SUPPORTED_LANGUAGES.map(lang => lang.id));
const joinMeeting = Joi.object().keys({
    prefLang: supportedLanguages.required(),
    name: Joi.string().required(),
    socketClientId: Joi.string().required()
})

const passwordRequired = Joi.object().keys({
    password: Joi.string().required()
})

export default {
    joinMeeting,
    passwordRequired
}