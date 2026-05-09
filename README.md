# Game Developer Portfolio

Version: 0.15

## How to run locally

Use VSCode Live Server:

1. Open this project folder in VSCode.
2. Right click `index.html`.
3. Select `Open with Live Server`.

Do not open the HTML files directly with `file://`, because navbar and footer are loaded with JavaScript `fetch()`.

## GitHub Pages

This project is compatible with:

```text
https://alejandroarevaloprogrammer.github.io/juan-carlos/
```

The JavaScript loads shared components using paths relative to `assets/js/main.js`, so it works both in Live Server and GitHub Pages.

## Structure

```text
index.html
games.html
contact.html
assets/
  components/
    navbar.html
    footer.html
  css/
    style.css
  js/
    main.js
  gifs/
    gameplay1.gif
    gameplay2.gif
    gameplay3.gif
    gameplay4.gif
  img/
    game1header.png
```
