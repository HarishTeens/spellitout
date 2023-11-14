import Joi from 'joi';

async function allErrorHandler(
    error,
    req,
    res,
    next
) {
    const message = error.message || 'Something went wrong'

    console.log('Error Handling Middleware called')
    console.log('Path: ', req.path)
    console.log('Message: ', message)

    const response = {
        error: true,
        message,
    };
    res.status(500).json(response)
}

function validate(schema, path = 'body') {
    return (req, res, next) => {
        const { error } = schema
            .preferences({ convert: false })
            .validate(req[path])
        if (error === undefined) {
            next()
        } else {
            const { details } = error
            const message = details.map((i) => i.message).join(',')
            res.status(422).json({ error: message })
        }
    }
}

function passProtected(req, res, next) {
    let password = '';
    if (req.method === 'GET') {
        password = req.query.password;
    } else {
        password = req.body.password;
    }

    if (password === process.env.PASSWORD) {
        next();
    } else {
        res.status(401).json({
            message: "Invalid password"
        })
    }
}

export default {
    allErrorHandler,
    validate,
    passProtected
}