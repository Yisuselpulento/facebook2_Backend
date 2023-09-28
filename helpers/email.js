import sgMail from '@sendgrid/mail'

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'monsstercore@hotmail.com',
    subject: "Comprueba tu cuenta",
    text:  "Comprueba tu cuenta para iniciar",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en mi RedSocial</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    
    `,
  };

  sgMail
  .send(msg)

};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'monsstercore@hotmail.com',
    subject: "Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${nombre} has solicitado cambiar tu password</p>

    <p>Sigue el siguiente enlace para generar un nuevo password: 

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
    
    
    `,
  };

  sgMail
  .send(msg)


};
