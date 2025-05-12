export const verificationEmailTemplate = (
  verificationToken: string,
  email: string,
  party: "client" | "business"
) => {
  return `
      <div style="width: 100%;background-color: mediumseagreen;color: black;padding: 50px 25px;display: flex; justify-content: center;">
        <div style="display: grid;place-items: center;gap: 10px;width: 100%;">
          <h1>Confirm your account with QRBites</h1>
          <p>Thank you for signing up for QRBites. To confirm your account, please follow the button below.</p>
          <a style="text-decoration: none;padding: 10px 6px;background-color: white;color: black; width: 100px;text-align: center;border-radius: 10px;" href="http://localhost:5173/auth/confirm-page?email=${email}&token=${verificationToken}" target="_blank" rel="noopener noreferrer">Confirm</a>
        </div>
      </div>
    `;
};
