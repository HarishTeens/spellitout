import { LangMap } from './config/types';
import cache from 'memory-cache';

class Controller {
    constructor() {
    }

    getMeetingStatus(req, res) {
        res.json({
            isMeetingRunning: cache.get('isMeetingRunning')
        })
    }

    startMeeting(req, res) {
        cache.put('isMeetingRunning', true);
        res.json({
            isMeetingRunning: true,
            message: "Meeting started"
        })

    }

    stopMeeting(req, res) {

        cache.put('isMeetingRunning', false);
        res.json({
            isMeetingRunning: false,
            message: "Meeting stopped"
        })
    }

    joinMeeting(req, res) {
        const { inputLang, outputLang, socketClientId } = req.body;
        const attendeesLangMap = cache.get('attendeesLangMap') as LangMap;
        attendeesLangMap[socketClientId] = {
            in: inputLang,
            out: outputLang
        }
        cache.put('attendeesLangMap', attendeesLangMap);

        res.json({
            success: true
        })
    }

    getAttendees(req, res) {
        const attendeesLangMap = cache.get('attendeesLangMap') as LangMap;
        const attendees = Object.keys(attendeesLangMap).map((key) => {
            return {
                socketClientId: key,
                ...attendeesLangMap[key]
            }
        })
        res.json({
            attendees
        })
    }

}


export default new Controller();