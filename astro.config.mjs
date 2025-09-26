// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro.shaban.cc',
	integrations: [
    starlight({
      title: "LIL Engineering",
      logo: { src: "./src/assets/logo.svg" },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/harvard-lil",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Challenges",
          autogenerate: { directory: "challenges" },
        },
        {
          label: "Experiments",
          autogenerate: { directory: "experiments" },
        },
        {
          label: "How-Tos",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Explanations",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ]
});
