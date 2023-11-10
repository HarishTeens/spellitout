import { Router } from "express";
import controller from "../controller";
import middlewares from "../middlewares";
import schema from "./schema";

const router = Router()


router.get('/', (req, res) => {
    res.json({
        message: "Dawn of something awesome!"
    })
})

router.get('/status', controller.getMeetingStatus);
router.post('/start', middlewares.validate(schema.passwordRequired), middlewares.passProtected, controller.startMeeting);
router.post('/stop', middlewares.validate(schema.passwordRequired), middlewares.passProtected, controller.stopMeeting);
router.post('/join', middlewares.validate(schema.joinMeeting), controller.joinMeeting);
router.get('/attendees', middlewares.passProtected, controller.getAttendees);


export default router;