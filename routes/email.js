const express = require('express'); 
const router = express.Router();
const Email = require('../models/email');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');


// Getting all
router.get('/', async (req, res) => {
    try {
        const email = await Email.find()
        res.json(email)
      } catch (err) {
        res.status(500).json({ message: err.message })
      }
})

// Getting One
router.get('/:id', getEmail, (req, res) => {
    res.json(res.email)
})

// Creating one
router.post('/', async (req, res) => {
    const email = new Email({
        to: req.body.to,
        subject: req.body.subject,
        text:req.body.text,
        scheduletime:req.body.scheduletime,
      })
      try {
        const newEmail = await email.save()
        res.status(201).json(newEmail)
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
})

// Updating One
router.patch('/:id', getEmail, async (req, res) => {
  if (req.body.to != null) {
      res.email.to = req.body.to
    }
    if (req.body.subject != null) {
      res.email.subject = req.body.subject
    }
    if (req.body.text != null) {
      res.email.text = req.body.text
    }
    if (req.body.scheduletime != null) {
      res.email.scheduletime = req.body.scheduletime
    }
    try {
      const updatedEmail = await res.email.save()
      res.json(updatedEmail)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})


// Deleting One
router.delete('/:id', getEmail, async (req, res) => {
    try {
        await res.email.remove()
        res.json({ message: 'Deleted Email' })
      } catch (err) {
        res.status(500).json({ message: err.message })
      }
})

async function getEmail(req, res, next) {
    let subscriber
    try {
      email = await Email.findById(req.params.id)
      if (email == null) {
        return res.status(404).json({ message: 'Cannot find email' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.email = email
    next()
}

// Scheduler
const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 5000);
const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function(){
    const emails = await Email.find()
    emails.forEach(item => {
    var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sandyadasaripalli9@gmail.com',
                pass: 'yourpassword'
            }
        });

        var mailOptions = {
            from: 'sandyadasaripalli9@gmail.com',
            to: item.to,
            subject: item.subject,
            text: item.text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }) 
});

module.exports = router;