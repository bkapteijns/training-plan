const fs = require("fs");
const validator = require("validator");
const path = require("path");

const Email = require("../../../schemas/EmailSchema");
const transporter = require("./transporter");

const introductionEmail = async (req, res) => {
  const { emailAddress } = req.body;
  // send mail with defined transport object
  if (emailAddress && validator.isEmail(emailAddress)) {
    if ((await Email.find({ address: emailAddress })).length === 0) {
      await new Email({
        address: emailAddress,
        creationDate: Date.now()
      }).save();
    }
    await transporter.sendMail(
      {
        from: `"trainingplan.fitness" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: emailAddress, // list of receivers
        subject: "Testing email", // Subject line
        text: "This email has been sent with my app", // plain text body
        html: '<b style="color: red;">The html body of the email</b>', // html body
        attachments: [
          {
            filename: "ebook.pdf",
            content: fs.createReadStream(
              path.join(__dirname, "../../../ebooks/introduction.pdf")
            )
          }
        ]
      },
      (error, info) => {
        if (error) {
          console.error("Error: ", error);
          res.sendStatus(400);
        }
        res.sendStatus(201);
      }
    );
  } else res.sendStatus(400);
};

module.exports = introductionEmail;
