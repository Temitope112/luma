export const sendPasswordResetEmail = async ({ email, firstName, resetUrl, }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM ??
        "Luma <noreply@example.com>";
    /*
     * Local development fallback.
     */
    if (!apiKey) {
        console.log("\n==============================");
        console.log("LUMA PASSWORD RESET");
        console.log("Email:", email);
        console.log("Reset URL:", resetUrl);
        console.log("==============================\n");
        return;
    }
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: [
                email,
            ],
            subject: "Reset your Luma password",
            html: `
            <!DOCTYPE html>
            <html>
              <body
                style="
                  margin:0;
                  padding:0;
                  background:#FCFBF8;
                  font-family:Arial,sans-serif;
                  color:#171717;
                "
              >
                <div
                  style="
                    max-width:560px;
                    margin:0 auto;
                    padding:48px 24px;
                  "
                >
                  <div
                    style="
                      font-size:26px;
                      font-weight:700;
                      letter-spacing:-1.5px;
                      margin-bottom:40px;
                    "
                  >
                    luma.
                  </div>

                  <div
                    style="
                      background:#ffffff;
                      border-radius:24px;
                      padding:36px;
                    "
                  >
                    <div
                      style="
                        display:inline-block;
                        background:#EEE9FF;
                        color:#7459E8;
                        border-radius:999px;
                        padding:8px 12px;
                        font-size:11px;
                        font-weight:700;
                        margin-bottom:24px;
                      "
                    >
                      PASSWORD RESET
                    </div>

                    <h1
                      style="
                        margin:0;
                        font-size:30px;
                        line-height:1.15;
                        letter-spacing:-1.2px;
                      "
                    >
                      Reset your password
                    </h1>

                    <p
                      style="
                        margin:18px 0 0;
                        color:#737373;
                        font-size:14px;
                        line-height:1.7;
                      "
                    >
                      Hi ${firstName},
                    </p>

                    <p
                      style="
                        margin:10px 0 0;
                        color:#737373;
                        font-size:14px;
                        line-height:1.7;
                      "
                    >
                      We received a request to reset
                      your Luma password.
                    </p>

                    <a
                      href="${resetUrl}"
                      style="
                        display:inline-block;
                        margin-top:28px;
                        background:#171717;
                        color:#ffffff;
                        padding:15px 22px;
                        border-radius:12px;
                        font-size:14px;
                        font-weight:600;
                        text-decoration:none;
                      "
                    >
                      Reset password
                    </a>

                    <p
                      style="
                        margin:28px 0 0;
                        color:#a3a3a3;
                        font-size:12px;
                        line-height:1.7;
                      "
                    >
                      This link expires in 30 minutes
                      and can only be used once.
                    </p>

                    <p
                      style="
                        margin:12px 0 0;
                        color:#a3a3a3;
                        font-size:12px;
                        line-height:1.7;
                      "
                    >
                      If you didn’t request a password
                      reset, you can safely ignore this
                      email.
                    </p>
                  </div>

                  <p
                    style="
                      margin-top:24px;
                      text-align:center;
                      color:#b0b0b0;
                      font-size:11px;
                    "
                  >
                    Luma · Find it. Book it. Be there.
                  </p>
                </div>
              </body>
            </html>
          `,
        }),
    });
    if (!response.ok) {
        const result = await response
            .json()
            .catch(() => null);
        console.error("Unable to send reset email:", result);
        throw new Error("Unable to send password reset email");
    }
};
//# sourceMappingURL=email.service.js.map