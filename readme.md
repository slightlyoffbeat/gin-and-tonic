# CSS / Sass Guidelines

## Contents

- [Introduction](#intro)
    - [Acknowledgements](#acknowledgements)
- [Syntax & Formatting](#syntax)
    - [Whitespace & Punctuation](#Whitespace-&-Punctuation)
    - [CSS Ruleset](#CSS-Ruleset)
    - [Property Declaration Order](#Property-&-Declaration Order)
    - [Nesting](#Nesting)
- [Architecture / Folder Structure](#Architecture-/-Folder-Structure)
- [Importing Files](#Importing-Files)
- [Comments](#Comments)
- [Naming Conventions](#Naming Conventions)
    - [Block/Element/Modifier (BEM/OOCSS)](#Block/Element/Modifier-(BEM/OOCSS))
    - [Variables](#variables)
    - [ID Selectors](#ID-Selectors)
    - [Autoprefixer](#Autoprefixer)
    - [JS Hooks](#JS-Hooks)
    - [State Hooks](#State-Hooks)
    - [Tracking Hooks](#Tracking-Hooks)
- [Tools](#Tools)
- [Other](#Other)

<a name="intro"/>
## Introduction
These guidelines are designed to help with the creation of stylesheets that are readable, maintainable, and scalable.

All CSS is written in Sass (SCSS)

<a name="acknowledgments"/>
### Acknowledgements
This guide is a combination of opinion, experience, and a lot of borrowing. Below are articles and resources that have influenced these guidelines.
- [SASS Guidelines](https://sass-guidelin.es)
- [Airbnb CSS / Sass Stylegguide](https://github.com/)
- [codeguide.co](http://codeguide.co)
- [cssguidelin.es](http://cssguidelin.es)

<a name="syntax"/>
## Syntax & Formatting

### Whitespace & Punctuation
- Use soft tabs with two (2) spaces. No hard tabs.
- Try to keep lines short. Less than 80 characters is ideal
- Include line breaks between new elements and styles
- Use single quotes (') instead of double quotes (")

### CSS Ruleset
(Slightly modified from [cssguidelin.es](http://cssguidelin.es/#anatomy-of-a-ruleset) & [sass-guidelin.es](https://sass-guidelin.es/?ref=producthunt#syntax--formatting)

- each selector on its own line
- the opening brace ({) spaced from the last selector by a single space
- each declaration on its own new line
- a space after the colon (:) (exception if you are declaring variables and using align-by)
- a trailing semi-colon (;) at the end of all declarations;
- the closing brace (}) on its own new line;
- a new line after the closing brace }.

```scss
// Bad
.alpha, .beta,
.gamma {
    display: inline-block;
    margin: 0 auto;
    padding: 0}

// Good
.alpha,
.beta,
.gamma {
  display: inline-block;
  margin: 0 auto;
  padding: 0;
}
```

### Property & Declaration Order
The recommended order for declaractions are as follows:
1. extend calls (@extend)
2. mixin calls (@include) with no @content
3. declarations
4. pseudo classes (including state hooks)
5. pseudo elements
6. nested selectors
7. mixin calls (usually  media queries)

```scss
// Bad
.alpha {
  display: inline-block;
  margin: 0 auto;
  padding: 0;
  @extend %property;
  @include container;
  @bp(medium) {
    display: none;
  }
  .nested {
    ...
  }
  &::before {
    …
  }
  &:hover,
  &:focus,
  &.is-active {
    …
  }
}

// Good
.alpha {
  @extend %property;
  @include container;
  display: inline-block;
  margin: 0 auto;
  padding: 0;
  
  &:hover,
  &:focus,
  &.is-active {
    …
  }
  
  &::before {
    …
  }
  
  .nested {
    ...
  }
  
  @bp(medium) {
    display: none;
  }
}
```

This guide does not state a preferences for declaration sorting. THis can be left up to the individual (random, alphabetical, type etc)

### Nesting
- Avoid selector nesting as much as possible.
- Avoid using neseting to create clever BEM naming conventions. Simply create a new declaration.
- If nesting is necessary, avoid nesting any more than 3 levels deep
- It is better to create a new class than to nest several layers. This will keep code readable and maintainable.
- An exception is that you can and should nest pseudo elements, pseudo classes and state hooks
 
## Architecture / Folder Structure
The recommended folder structure is a variation of the The 7-1 Pattern. File partials should have an underscore (_) at the beginning of the file name so that it is obvious that they are partials. 
```scss
scss/
|- util/
|  |-mixins                // Folder of mixins to keep things modular
|  |  |- _math.scss
|  |  |- z-index.scss
|  |- _util.scss
|  |- _mixins.scss         //calls everything in /mixins
|  |- ...
|
|- base/
|  |- _typography.scss
|  |- _variables.scss
|  |- _body.scss
|  |- _fonts.scss
|  |- ...
|
|- Components/
|  |- _buttons.scss
|  |- _carosusel.scss
|  |- ...
|
|- _layouts/
|  |- _grid.scss
|  |- _header.scss
|  |- _footer.scss
|  |- _navigation.scss
|  |- ...
|
|- _pages/
|  |- _home.scss
|  |- _contact.scss
|  |- ...
|
|- _vendor/                 // NPM is preferable, but vendor items can go here
|  |- _normalize.scss
|  |- ...
|
|- shame.scss               // Crappy CSS/SCSS that should be fixed at a later time
|- style.scss               // Main scss file that imports everything
```
## Importing Files

```scss
// example:
@charset 'utf-8';

// Dependancies & Utilities
@import 'util/mixins';
@import 'util/util';
@import 'util/whitespace';
```
Things to note:
- Declare @charset 'utf-8' at the top of the main file because reasons
- Provide a short title for the various sections (base, components, etc)
- file extensions and leading underscores should be omitted
- Declare vendors, then variables, then utilities, then everythig else

## Comments
Well documented stylesheets are key to keeping everything maintainable and scalable. We should always:
* Comment liberally.
* keep line-length of comments to ~80 columns
* Explain and document mixins, functions etc
* Label the top of stylesheets, and sections within stylesheets

Stylesheet header:
```scss
// ----------------------------------------------------------------------------
// Header
// ----------------------------------------------------------------------------
```

Section Title:
```scss
// Variables
// -------------------------
```

Documentation (located just under the stylesheet header):
```scss
/**
This is to help create a simple system for whitespace for blocks. It needs a
single variable: $whitespace

Shorthand Description:
m  Margin
p  Padding
...

EX: (assuming $whitespace = 12px)
.mt4 == margin-top: 48px;
.pl1 == padding-left: 12px;
.py2 == padding-top: 24; padding-bottom: 24px;
...
*/
```
## Naming Conventions

### Block/Element/Modifier (BEM/OOCSS)
A combination of BEM and OOCSS is used. To quote the [Airbnb style guide](https://github.com/airbnb/css#oocss-and-bem):
* It helps create clear, strict relationships between CSS and HTML
* It helps us create reusable, composable components
* It allows for less nesting and lower specificity
* It helps in building scalable stylesheets

Resources to learn more:
* [Smashing Magazine: Intro to OOCSS](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/)
* [CSS tricks: BEM 101](https://css-tricks.com/bem-101/)
* [CSS Wizardry: BEM Syntax](https://css-tricks.com/bem-101/)
* [Medium: Battling BEM](https://medium.com/fed-or-dead/battling-bem-5-common-problems-and-how-to-avoid-them-5bbd23dee319#.iodgixm67)

Example:
```html
<div class="hero hero--featured">
  <h1 class="hero__title">This is a title</h1>
  <h2 class="hero__subtitle">
    This is a subtitle
  </h2>
</div>

<ul class="main-nav">
  <li class="main-nav__item">
    <a class="main-nav__link">
      test
    </a>
  </li>
</ul>
```

```scss
.hero { ... }             // block
.hero__title { ... }      // element
.hero__subtitle { ... }   // element
.hero--featured { ... }   // modifier

.main-nav { ... }         // block
.main-nav__item { ... }   // element
.main-nav__link { ... }   // modifier
```

As shown in the example above, you do not need to chain elements names (ex: main-nav__item__link). Elements can share a block, but be nested in other elements. Chaining element names is discouraged.

<a name="variables"/>
### Variables
Variable names should be dash-cased. Avoid underscore and CamelCase. Variables that are used within the same file should start with an underscore: (eg: $_variable)
```scss
// Bad:
$font_size: 12px
$FontSize: 12px

//Good:
$font-size: 12px;
```
### ID Selectors
ID selectors are not reusable and should never be necssary. Avoid them.

### Autoprefixer
Never write vendor prefixes in your code. Use Autoprefixer when compiling your Sass to handle that for you.

### JS Hooks
Avoid using the same class for both css and JavaScript.

Prefix JavaScript specific classes with ```.js-```

```html
<button class="button-primary js-purchase">
```

### State Hooks
There may often be a need to add and remove a class according to its state. Examples include a mobile menu expanding, a dropdown, an accordion selection and more. State hooks include:
* ```is-active```
* ```is-visible```
* ```is-expanded```
* ```is-disabled```
* ```is-collapsed```
* ```is-loaded```
* ```is-loading```
State hooks should always be scoped to the selector they are being applied to. 

For example:
```scss
.nav-menu__link {
  color: #fff;
    
  &.is-active {
    color: #000;
}
```
Which compiles to:
```scss
.nav-menu__link {
  color: #ffffff
}

.nav-menu__link.is-active {
  .color: #000000
}
```
### Tracking Hooks
Hooks that are used specifically for tracking, google analytics, tag mangager, etc should be prefixed with ```.tk-```

## Tools
A SCSS Lint file (scss-lint.yml) is included to help maintain consistency and prevent errors. You will need to install the scss lint gem and then the appropriate package for your text editor. It has been customized to maintain rules such as:
* property order
* BEM
* Limited nesting
* Single quotes
* ...more

An editor config file (.editorconfig) is included to help maintain consistency between files and developers. You will need to install a package for your text editor to utilize. It has been customized to maintain rules such as:
* indent size of 2 spaces
* indent style = space
* ...more

## Other
Shame...shame...shame. Sometimes we need to include a quick fix, or break the rules, or write a hack or two. That's fine. Use the shame.scss file so that you can come back to it and fix it at a later time.
