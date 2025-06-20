const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.pass,
  },
});

exports.submitContactForm = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Faltan campos requeridos." });
      }

      const docRef = await db.collection("messages").add({
        name,
        email,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const mailOptions = {
        from: functions.config().gmail.email,
        to: "admin@tudominio.com",
        subject: "Nuevo mensaje desde el sitio web",
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ success: true, id: docRef.id });
    } catch (err) {
      console.error("Error al enviar correo:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
  });
});
