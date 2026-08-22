import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  description: "Your contact details and every bit of text on the Contact page.",
  groups: [
    { name: "details", title: "Your details", default: true },
    { name: "text", title: "Page text" },
    { name: "form", title: "Form setup" },
  ],
  fields: [
    // --- Your details (also used by the footer) ---
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "details",
      description: "Shown on the Contact page and in the footer. Leave blank to hide.",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "details",
      description: "Leave blank to hide.",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "details",
      description: "Shown on the Contact page and in the footer. Delete an entry to hide it.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
      initialValue: [{ label: "Instagram", url: "https://www.instagram.com/elukes" }],
    }),
    defineField({
      name: "representation",
      title: "Representation",
      type: "object",
      group: "details",
      description: "Agent or manager. Leave both blank to hide it everywhere.",
      fields: [
        defineField({ name: "name", title: "Agency / manager name", type: "string" }),
        defineField({ name: "contact", title: "Contact email", type: "string" }),
      ],
    }),

    // --- Page text ---
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      group: "text",
      description: "The big headline (the last word gets the accent style). Leave blank to hide.",
      initialValue: "Casting? Booking? Say hello.",
    }),
    defineField({
      name: "formLabel",
      title: "Label above the form",
      type: "string",
      group: "text",
      initialValue: "Send a message",
    }),
    defineField({
      name: "directLabel",
      title: 'Label above your email ("Direct")',
      type: "string",
      group: "text",
      initialValue: "Direct",
    }),
    defineField({
      name: "elsewhereLabel",
      title: 'Label above your social links ("Elsewhere")',
      type: "string",
      group: "text",
      initialValue: "Elsewhere",
    }),
    defineField({ name: "nameLabel", title: "Name field label", type: "string", group: "text", initialValue: "Name" }),
    defineField({ name: "emailLabel", title: "Email field label", type: "string", group: "text", initialValue: "Email" }),
    defineField({ name: "messageLabel", title: "Message field label", type: "string", group: "text", initialValue: "Message" }),
    defineField({ name: "buttonText", title: "Send button text", type: "string", group: "text", initialValue: "Send message" }),
    defineField({
      name: "successTitle",
      title: "Thank-you message — title",
      type: "string",
      group: "text",
      initialValue: "Message sent.",
    }),
    defineField({
      name: "successText",
      title: "Thank-you message — detail",
      type: "string",
      group: "text",
      initialValue: "Thanks for reaching out — you'll hear back soon.",
    }),

    // --- Form setup ---
    defineField({
      name: "contactFormKey",
      title: "Contact form key",
      type: "string",
      group: "form",
      description:
        "Makes the form actually deliver mail. Get a free key at web3forms.com (enter the email that should receive messages — it arrives instantly), paste it here and Publish. Leave blank and the form politely asks visitors to email you instead.",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
