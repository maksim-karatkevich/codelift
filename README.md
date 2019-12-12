# code<sup>_lift_</sup>

![Create React App Example](/codelift.next.gif)

> A "No Code" GUI for your existing React app.

## Getting Started

Within your project:

1. `yarn add codelift --dev`
1. For [create-react-app][cra]:

   `yarn codelift start`

   For [Next.js][next]:

   `yarn codelift dev`

   _(`codelift` runs `yarn ____` with whatever you provide)_

1. Add `import "codelift/register"` to the top of your `src/App.tsx`.

## Examples

- [Create React App + Tailwind CSS](/examples/cra)
- [Next.js + Tailwind CSS](examples/next)

## Features

### CSS Inspector

1. Hover & Select an element.
1. **Find-as-you-type** CSS classes.
1. **Hover to preview** before applying.
1. **Click to toggle** in your source code.

### Feature Requests

- [ ] Install missing dependencies
- [ ] Click tag to open in editor
- [ ] Add/Wrap elements
- [ ] Convert element to Component
- [ ] `:hover`, etc. classes
- [New Feature Request](https://github.com/ericclemmons/codelift/issues/new)

## Contributing

1. Clone this repo.
1. `yarn cra` or `yarn next` to run the CRA or Next.js examples, respectively.

## Author

- Eric Clemmons

[cra]: https://github.com/facebook/create-react-app
[next]: https://github.com/zeit/next.js/
[tailwind]: https://tailwindcss.com/
