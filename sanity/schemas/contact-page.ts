import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  description: "All the text on the Contact page. (Email, phone, socials, and representation come from Site Settings.)",
  fields: [
    defineField({
      name: "heading",
      title: "Page headline",
      type: "string",
      description: "The big headline (the last word gets the accent style). Leave blank to hide.",
      initialValue: "Casting? Booking? Say hello.",
    }),
    defineField({
      name: "formLabel",
      title: "Form section label",
      type: "string",
      description: "The small label above the form.",
      initialValue: "Send a message",
    }),
    defineField({
      name: "nameLabel",
      title: "Name field label",
      type: "string",
      initialValue: "Name",
    }),
    defineField({
      name: "emailLabel",
      title: "Email field label",
      type: "string",
      initialValue: "Email",
    }),
    defineField({
      name: "messageLabel",
      title: "Message field label",
      type: "string",
      initialValue: "Message",
    }),
    defineField({
      name: "buttonText",
      title: "Send button text",
      type: "string",
      initialValue: "Send message",
    }),
    defineField({
      name: "successTitle",
      title: "Success message — title",
      type: "string",
      description: "Shown after a message is sent.",
      initialValue: "Message sent.",
    }),
    defineField({
      name: "successText",
      title: "Success message — detail",
      type: "string",
      initialValue: "Thanks for reaching out — you'll hear back soon.",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
