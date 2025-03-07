// infra/email.ts

const emailIdentity = `sst-auth@${process.env.DOMAIN || "example.com"}`;

export const email = (() => {
  const existingEmail = sst.aws.Email.get("EmailServer", emailIdentity);
  if (existingEmail) {
    console.log(`Email identity ${emailIdentity} already exists.`);
    return existingEmail;
  } else {
    console.log(`Creating email identity ${emailIdentity}.`);
    return new sst.aws.Email("EmailServer", {
      sender: emailIdentity,
    });
  }
})();

