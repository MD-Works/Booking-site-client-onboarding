export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // Parse the incoming multi-part form data (handles text + file uploads)
      const formData = await request.formData();
      
      const data = {
        businessName: formData.get("business_name"),
        tagline: formData.get("tagline"),
        mapsLink: formData.get("maps_link"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
        hours: formData.get("hours"),
        colors: formData.get("colors"),
        payments: formData.get("payments"),
        domainStatus: formData.get("domain_status"),
        googleAccount: formData.get("google_account"),
        imgbbKey: formData.get("imgbb_key"),
        menuText: formData.get("menu_text")
      };

      // Note file references if they were uploaded
      const logoFile = formData.get("logo");
      const menuFile = formData.get("menu_file");

      const logoName = logoFile && logoFile.name ? logoFile.name : "None uploaded";
      const menuName = menuFile && menuFile.name ? menuFile.name : "None uploaded";

      // Build a clean summary string
      const summary = `
New Client Onboarding Submitted!
--------------------------------
Business Name: ${data.businessName}
Tagline: ${data.tagline}
Maps: ${data.mapsLink}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}
Hours: ${data.hours}
Colors: ${data.colors}
Payments: ${data.payments}
Domain Status: ${data.domainStatus}
Google Account: ${data.googleAccount}
imgbb Key: ${data.imgbbKey}
Manual Menu List: ${data.menuText}
Uploaded Logo File: ${logoName}
Uploaded Menu File: ${menuName}
      `;

      // TODO: Connect an email provider here (e.g. Mailgun, Resend, or Cloudflare Email Routing)
      // For now, we will log it to the console.
      console.log(summary);

      // Redirect client to a thank you page or send success message
      return new Response(JSON.stringify({ success: true, message: "Details received successfully!" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
};
