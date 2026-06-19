// Shape of a single FAQ entry.
export interface FAQ {
  question: string;
  answer: string;
}

// Static FAQ entries shown in the contact page sidebar.
export const faqs: FAQ[] = [
  {
    question: "What tools or stack do you use for this site?",
    answer: "This site is built with **Next.js** for the framework, styled with **Linaria** (zero-runtime CSS-in-JS) and **Sass**, and uses **React** for interactivity. It is deployed on **Vercel** with continuous integration from **GitHub**."
  },
  {
    question: "What topics do you usually write about?",
    answer: "I mainly cover web development, coding best practices, and personal technical projects. Occasionally, I also share tutorials and experiments."
  },
  {
    question: "How often do you publish new posts?",
    answer: "I try to publish regularly, usually once every 1–2 weeks. You can subscribe to my [Atom feed](/atom.xml) to stay updated."
  },
  {
    question: "How can I stay updated with new posts?",
    answer: "You can subscribe to my Atom feed to get notified whenever I publish a new article. Most feed readers support Atom just like RSS. [Subscribe here](/atom.xml)."
  },
  {
    question: "Do you earn money from this blog?",
    answer: "No, this is a personal blog and not monetized. I write to share knowledge and document experiments."
  },
  {
    question: "Can I use your code snippets in my own projects?",
    answer: "Yes. Unless otherwise specified, all code snippets shared here are free to use. Attribution is appreciated but not required."
  },
  {
    question: "Is this site open-source?",
    answer: "Afraid not, sorry! It's a personal project and I'd like to keep the source private for now."
  },
  {
    question: "What syntax-highlighting theme are you using?",
    answer: "It's my own custom theme! It's built with **Shiki** and TextMate grammar, but instead of separate light and dark theme files, each token maps to a CSS custom property, so it automatically adapts across light and dark mode through the CSS cascade — no separate theme files needed."
  },
  {
    question: "How are you including interactive content in your blog posts?",
    answer: "I write all of my blog posts in MDX, a technology that lets me include custom React components within a Markdown document. It gives me all the flexibility of a regular React app while still being parsable as Markdown. You can read more about the stack behind this in [**How Did I Build My Blog**](/how-did-i-build-my-blog)."
  },
  {
    question: "Can I share or republish your articles or posts?",
    answer: "You're welcome to share links to posts on social media, newsletters, or elsewhere. If you'd like to republish excerpts, please provide proper credit and a link back to the original article."
  },
  {
    question: "Can I suggest a topic or tutorial for a future post?",
    answer: "Yes, you can suggest ideas through the contact form. While I can't promise to cover every request, I do consider suggestions when planning new content."
  },
  {
    question: "Are you available for job opportunities or freelance work?",
    answer: "I'm afraid I'm not looking for work at the moment, sorry! My focus right now is on creating good technical content and working on my own projects. I also can't offer any referrals — I don't personally know many freelance developers, and it's not something I'm comfortable doing without an established relationship."
  },
  {
    question: "Can you review my portfolio site?",
    answer: "I'm afraid I don't have the bandwidth to do this anymore, sorry!"
  },
  {
    question: "Do you accept guest posts or collaborations?",
    answer: "I don't accept guest posts or collaborations — this is a personal blog, and I'm the only one who publishes here.\n\nI'm also not interested in including your company's link in an article, or taking part in any other SEO link-building schemes — I likely won't respond to these kinds of requests."
  },
  {
    question: "Will you respond to all messages sent through the contact form?",
    answer: "I read all messages, but replies are not guaranteed. Depending on volume, it may take me time to respond — or I may not be able to reply at all."
  },
  {
    question: "Do you offer personalized help or consulting?",
    answer: "This blog is primarily for sharing general knowledge. I can't provide one-on-one troubleshooting or support through the contact form."
  }
];
