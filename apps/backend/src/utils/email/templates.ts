import { SITE_NAME_SHORT } from "@app/utils/config";
import { Capitalize } from "@app/utils/string";

export function newSignInAlertEmailTemplate({
    fullName,
    osName,
    formattedUtcTimeStamp,
    browserName,
    ipAddress,
    signInLocation,
    authProviderName,
    sessionsPageUrl,
    siteUrl,
    revokeSessionLink,
}: {
    fullName: string;
    osName: string;
    formattedUtcTimeStamp: string;
    browserName: string;
    ipAddress: string;
    signInLocation: string;
    authProviderName: string;
    sessionsPageUrl: string;
    siteUrl: string;
    revokeSessionLink: string;
}) {
    const emailHtml = `<!doctype html> <html lang="en">  <head> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="Content-Type" content="text/tml; harset=UTF-8"> <title>New Device SignIn Alert</title> <style media="all" type="text/css"> @media all { .btn-primary table td:hover { background-color: #ec0867 !important; }  .btn-primary a:hover { background-color: #ec0867 !important; border-color: #ec0867 !important; } }  @media only screen and (max-width: 640px) {  .main p, .main td, .main span { font-size: 16px !important; }  .wrapper { padding: 8px !important; }  .content { padding: 0 !important; }  .container { padding: 0 !important; padding-top: 8px !important; width: 100% !important; }  .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; }  .btn table { max-width: 100% !important; width: 100% !important; }  .btn a { font-size: 16px !important; max-width: 100% !important; width: 100% !important; } }  @media all { .ExternalClass { width: 100%; }  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }  .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; }  #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } } </style> </head>  <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0 0 32px 0;"> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <img src="https://crmm.tech/icon.png" width="80" height="auto" /> </tr> </table> </div> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6"> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 8px; width: 600px; margin: 0 auto;" width="600" valign="top"> <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;"> <!-- START CENTERED WHITE CONTAINER --> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;" width="100%"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top"> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> Hi ${fullName},</p> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> We noticed a new sign-in to your CRMM Account on a ${osName} device. If this was you, you don’t need to do anything. If not, we’ll help you secure your account. </p> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> <span>When:&nbsp; <em>${formattedUtcTimeStamp}</em></span><br> <span>Device:&nbsp; <em>${browserName} ${osName} (${ipAddress})</em></span><br> <span>Near:&nbsp; <em>${signInLocation}</em></span><br> <span>Auth provider:&nbsp; <em>${Capitalize(authProviderName)}</em></span><br> </p> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%"> <tbody> <tr> <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; text-align: center;" valign="top" align="center"> <a href="${sessionsPageUrl}" target="_blank" style="color: #f43f5e; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; text-decoration: none;"> See loggedIn sessions </a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p> <span>If you don't recognise this login, </span> <a href="${revokeSessionLink}" target="_blank" style="color: #F43F5E; font-weight: 600; text-decoration: none;">revoke this session</a>. </p> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center"> <a href="${siteUrl}" style="text-decoration: none;"> <span class="apple-link" style="color: #70757E; font-size: 16px; text-align: center; text-decoration: underline; text-underline-offset: 2px;"> Cosmic Reach Mod Manager </span> </a> </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> </tr> </table> </body>  </html>`;
    const subject = "New signin to your CRMM account";
    const text = `There was a new signin on your CRMM account at ${formattedUtcTimeStamp} from ${signInLocation} on device ${browserName} ${osName} (${ipAddress}). Check your logged in session on "${sessionsPageUrl}"`;

    return { emailHtml, subject, text };
}

export function confirmNewPasswordEmailTemplate({
    fullName,
    siteUrl,
    confirmationPageUrl,
    expiryDuration,
}: {
    fullName: string;
    siteUrl: string;
    confirmationPageUrl: string;
    expiryDuration: number;
}) {
    const emailHtml = `<!doctype html> <html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/tml; harset=UTF-8"> <title>New Device SignIn Alert</title> <style media="all" type="text/css"> @media all { .btn-primary table td:hover { background-color: #ec0867 !important; }  .btn-primary a:hover { background-color: #ec0867 !important; border-color: #ec0867 !important; } }  @media only screen and (max-width: 640px) {  .main p, .main td, .main span { font-size: 16px !important; }  .wrapper { padding: 8px !important; }  .content { padding: 0 !important; }  .container { padding: 0 !important; padding-top: 8px !important; width: 100% !important; }  .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; }  .btn table { max-width: 100% !important; width: 100% !important; }  .btn a { font-size: 16px !important; max-width: 100% !important; width: 100% !important; } }  @media all { .ExternalClass { width: 100%; }  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }  .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; }  #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } } </style> </head>  <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0 0 32px 0;"> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <img src="https://crmm.tech/icon.png" width="80" height="auto" /> </tr> </table> </div> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6"> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 8px; width: 600px; margin: 0 auto;" width="600" valign="top"> <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 475px; padding: 0;"> <!-- START CENTERED WHITE CONTAINER --> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 8px; width: 100%;" width="100%"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top"> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> Hi ${fullName},</p> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> A new password was recently added to your account. Confirm below if this was you. The new password will not work until then.</p>  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%"> <tbody> <tr> <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">  <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td align="center"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 16px 0;"> <tbody> <tr> <td> <a href="${confirmationPageUrl}" data-saferedirecturl="${confirmationPageUrl}" target="_blank" style="color: white; background-color: #f43f5e; text-decoration: none; font-weight: 600; padding: 12px 18px; border-radius: 4px;">Confirm new password</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>  </td> </tr> </tbody>  </table> <p style="color: #252729; margin: 8px; font-size: 16px;">This link is valid for <span style="font-weight: 500;">${Math.round(expiryDuration / 3600_000)} hour(s)</span> </p> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center"> <a href="${siteUrl}" style="text-decoration: none;"> <span class="apple-link" style="color: #70757E; font-size: 16px; text-align: center; text-decoration: underline; text-underline-offset: 2px;"> Cosmic Reach Mod Manager </span> </a> </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> </tr> </table> </body>  </html>`;
    const subject = "Confirm your new account password";
    const text = `A new password was recently added to your account. Confirm below if this was you. The new password will not work until then.\nOpen the link for more details and options\n${confirmationPageUrl}`;

    return { emailHtml, subject, text };
}

export function changeAccountPasswordEmailTemplate({
    fullName,
    siteUrl,
    changePasswordPageUrl,
    expiryDuration,
}: {
    fullName: string;
    siteUrl: string;
    changePasswordPageUrl: string;
    expiryDuration: number;
}) {
    const emailHtml = `<!doctype html> <html lang="en">  <head> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="Content-Type" content="text/tml; harset=UTF-8"> <title>New Device SignIn Alert</title> <style media="all" type="text/css"> @media all { .btn-primary table td:hover { background-color: #ec0867 !important; }  .btn-primary a:hover { background-color: #ec0867 !important; border-color: #ec0867 !important; } }  @media only screen and (max-width: 640px) {  .main p, .main td, .main span { font-size: 16px !important; }  .wrapper { padding: 8px !important; }  .content { padding: 0 !important; }  .container { padding: 0 !important; padding-top: 8px !important; width: 100% !important; }  .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; }  .btn table { max-width: 100% !important; width: 100% !important; }  .btn a { font-size: 16px !important; max-width: 100% !important; width: 100% !important; } }  @media all { .ExternalClass { width: 100%; }  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }  .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; }  #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } } </style> </head>  <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0 0 32px 0;"> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <img src="https://crmm.tech/icon.png" width="80" height="auto" /> </tr> </table> </div> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6"> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 8px; width: 600px; margin: 0 auto;" width="600" valign="top"> <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 475px; padding: 0;"> <!-- START CENTERED WHITE CONTAINER --> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 8px; width: 100%;" width="100%"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top"> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> Hi ${fullName},</p> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> We received a request to change your account password. Click the link below to change your password. </p> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%"> <tbody> <tr> <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td align="center"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 16px 0;"> <tbody> <tr> <td> <a href="${changePasswordPageUrl}" data-saferedirecturl="${changePasswordPageUrl}" target="_blank" style="color: white; background-color: #f43f5e; text-decoration: none; font-weight: 600; padding: 12px 18px; border-radius: 4px;">Change password</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="color: #252729; margin: 8px; font-size: 16px;">This link is valid for <span style="font-weight: 500;">${Math.round(expiryDuration / 3600_000)} hour(s)</span> </p> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center"> <a href="${siteUrl}" style="text-decoration: none;"> <span class="apple-link" style="color: #70757E; font-size: 16px; text-align: center; text-decoration: underline; text-underline-offset: 2px;"> Cosmic Reach Mod Manager </span> </a> </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> </tr> </table> </body>  </html>`;
    const subject = `Change your ${SITE_NAME_SHORT} account password`;
    const text = `Change your account password. ${changePasswordPageUrl}`;

    return { emailHtml, subject, text };
}

export function deleteUserAccountEmailTemplate({
    fullName,
    siteUrl,
    changePasswordPageUrl,
    expiryDuration,
}: {
    fullName: string;
    siteUrl: string;
    changePasswordPageUrl: string;
    expiryDuration: number;
}) {
    const emailHtml = `<!doctype html> <html lang="en">  <head> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="Content-Type" content="text/tml; harset=UTF-8"> <title>New Device SignIn Alert</title> <style media="all" type="text/css"> @media all { .btn-primary table td:hover { background-color: #ec0867 !important; }  .btn-primary a:hover { background-color: #ec0867 !important; border-color: #ec0867 !important; } }  @media only screen and (max-width: 640px) {  .main p, .main td, .main span { font-size: 16px !important; }  .wrapper { padding: 8px !important; }  .content { padding: 0 !important; }  .container { padding: 0 !important; padding-top: 8px !important; width: 100% !important; }  .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; }  .btn table { max-width: 100% !important; width: 100% !important; }  .btn a { font-size: 16px !important; max-width: 100% !important; width: 100% !important; } }  @media all { .ExternalClass { width: 100%; }  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }  .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; }  #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } } </style> </head>  <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0 0 32px 0;"> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <img src="https://crmm.tech/icon.png" width="80" height="auto" /> </tr> </table> </div> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6"> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 8px; width: 600px; margin: 0 auto;" width="600" valign="top"> <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 475px; padding: 0;"> <!-- START CENTERED WHITE CONTAINER --> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 8px; width: 100%;" width="100%"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top"> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> Hi ${fullName},</p> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; color: #15252E"> We received a request that you want to delete your account. Click the link below to confirm that. </p> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%"> <tbody> <tr> <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td align="center"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 16px 0;"> <tbody> <tr> <td> <a href="${changePasswordPageUrl}" data-saferedirecturl="${changePasswordPageUrl}" target="_blank" style="color: white; background-color: #ef4444; text-decoration: none; font-weight: 600; padding: 12px 18px; border-radius: 4px;">Delete account</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="color: #252729; margin: 8px; font-size: 16px;">This link is valid for <span style="font-weight: 500;">${Math.round(expiryDuration / 3600_000)} hour(s)</span> </p> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"> <tr> <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center"> <a href="${siteUrl}" style="text-decoration: none;"> <span class="apple-link" style="color: #70757E; font-size: 16px; text-align: center; text-decoration: underline; text-underline-offset: 2px;"> Cosmic Reach Mod Manager </span> </a> </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp; </td> </tr> </table> </body>  </html>`;
    const subject = `Confirm to delete your ${SITE_NAME_SHORT} account`;
    const text = `Confirm to delete your account, ${changePasswordPageUrl}`;

    return { emailHtml, subject, text };
}