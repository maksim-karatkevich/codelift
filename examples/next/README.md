# Next.js + Tailwind CSS

This example shows how [Next.js](https://github.com/zeit/next.js/tree/master) and [Tailwind CSS](https://tailwindcss.com/) work with `codelift`, based on:

> https://github.com/zeit/next.js/tree/master/examples/with-tailwindcss

1. `yarn create next-app --example with-tailwindcss with-tailwindcss-app`
1. `cd with-tailwindcss-app`
1. `yarn add codelift --dev`
1. Comment out `@fullhuman/postcss/purgecss` so all TailwindCSS classes are available:

   ```diff
   diff --git a/postcss.config.js b/postcss.config.js
   index 73f04da..994bd5b 100644
   --- a/postcss.config.js
   +++ b/postcss.config.js
   @@ -1,15 +1,15 @@
   module.exports = {
     plugins: [
   -    require('postcss-easy-import'),
   -    require('tailwindcss'),
   -    require('@fullhuman/postcss-purgecss')({
   -      content: [
   -        './pages/**/*.{js,jsx,ts,tsx}',
   -        './components/**/*.{js,jsx,ts,tsx}',
   -      ],
   -      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
   -    }),
   -    require('autoprefixer'),
   -    require('cssnano'),
   -  ],
   -}
   +    require("postcss-easy-import"),
   +    require("tailwindcss"),
   +    // require('@fullhuman/postcss-purgecss')({
   +    //   content: [
   +    //     './pages/**/*.{js,jsx,ts,tsx}',
   +    //     './components/**/*.{js,jsx,ts,tsx}',
   +    //   ],
   +    //   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
   +    // }),
   +    require("autoprefixer"),
   +    require("cssnano")
   +  ]
   +};
   ```

1. `yarn codelift dev`
