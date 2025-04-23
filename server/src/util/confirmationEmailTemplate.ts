export const emailTemplate = (verificationToken: string, email: string) => {
  return (
    `
      <div style="width: 100%;background-color: mediumseagreen;color: black;padding: 50px 25px;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;display: flex; justify-content: center;">
        <div style="display: flex;flex-direction: column;gap: 10px;width: min(450px, 100%);">
          <h2>Confirm your account</h2>
          <p>Thank you for signing up for Public Stories. To confirm your account, please follow the button below.</p>
          <a style="text-decoration: none;padding: 15px 10px;background-color: white;color: black; width: 100px;text-align: center;border-radius: 10px;" href="http://localhost:5173/auth/confirm-page?email=${email}token=${verificationToken}">Confirm</a>
        </div>
      </div>
    `
  )
};
