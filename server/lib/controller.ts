import { io } from '.';
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
        const isMeetingRunning = cache.get('isMeetingRunning');
        if (isMeetingRunning) {
            res.status(400).json({
                isMeetingRunning: true,
                message: "Meeting already running"
            })
            return;
        }

        cache.put('isMeetingRunning', true);
        res.json({
            isMeetingRunning: true,
            message: "Meeting started"
        })

    }

    stopMeeting(req, res) {
        const isMeetingRunning = cache.get('isMeetingRunning');
        if (!isMeetingRunning) {
            res.status(400).json({
                isMeetingRunning: false,
                message: "Meeting not running"
            })
            return;
        }
        cache.put('isMeetingRunning', false);
        res.json({
            isMeetingRunning: false,
            message: "Meeting stopped"
        })
    }

    joinMeeting(req, res) {
        const isMeetingRunning = cache.get('isMeetingRunning');
        if (!isMeetingRunning) {
            res.status(400).json({
                success: false,
                message: "Meeting not running"
            })
            return;
        }
        const { prefLang, name, socketClientId } = req.body;
        const attendeesLangMap = cache.get('attendeesLangMap') as LangMap;
        attendeesLangMap[socketClientId] = {
            prefLang,
            name
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