// infra/email.ts

const emailIdentity = `sst-auth@${process.env.DOMAIN || "example.com"}`;

export const email = (() => {
  const existingEmail = sst.aws.Email.isInstance(emailIdentity);
  if (existingEmail) {
    console.log(`Email identity ${emailIdentity} already exists.`);
    return existingEmail;
  } else {
    console.log(`Creating email identity ${emailIdentity}, validation email sent.`);
    return new sst.aws.Email("EmailServer", {
      sender: emailIdentity,
    });
  }
})();

