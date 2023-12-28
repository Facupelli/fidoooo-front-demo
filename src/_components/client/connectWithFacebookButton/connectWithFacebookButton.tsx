"use client";
import { useEffect } from "react";

const ConnectWithFacebookButton = () => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "597680898983504", // Meta App ID
        cookie: true, // enable cookies
        xfbml: true, // parse social plugins on this page
        version: "v18.0", //Graph API version
      });
    };

    // (function (d, s, id) {
    //   const fjs = d.getElementsByTagName(s)[0];
    //   if (d.getElementById(id)) return;
    //   const js = d.createElement(s);
    //   js.id = id;
    //   js.src = "https://connect.facebook.net/en_US/sdk.js";
    //   fjs?.parentNode?.insertBefore(js, fjs);
    // })(document, "script", "facebook-jssdk");
  }, []);

  const launchWhatsAppSignup = () => {
    // fbq?.("trackCustom", "WhatsAppOnboardingStart", {
    //   appId: "your-facebook-app-id",
    //   feature: "whatsapp_embedded_signup",
    // });

    try {
      FB.login(
        function (response) {
          if (response.authResponse) {
            const code = response.authResponse.code;
            console.log("CODE", code);
            // Transmit the code to your backend
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        {
          config_id: "739559668049428",
          response_type: "code",
          override_default_response_type: true,
          extras: {
            setup: {
              // Prefilled data can go here
            },
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
      onClick={launchWhatsAppSignup}
      style={{
        backgroundColor: "#1877f2",
        border: 0,
        borderRadius: "4px",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "16px",
        fontWeight: "bold",
        height: "40px",
        padding: "0 24px",
      }}
    >
      Login with Facebook
    </button>
  );
};

export { ConnectWithFacebookButton };
