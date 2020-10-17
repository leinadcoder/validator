# Validator
Is a lightweight vanilla js plugin without dependencies to validate web forms.

## Usage instructions

### Install

```html
<!-- Put these into the <head> -->
<link rel="stylesheet" href="dist/validator.css"> <!-- CSS are optional -->
<script src="dist/validator.js">
```

### Usage
Ways to create validator instance.

```js
// If using in a framework, its recommended to pass the element directly
validator(element, {})

// Selectors are also supported
validator('#elementID', {})

// Multiples instances
validator('.elementClassName', {})

// Element triggers the instance
element.validator({})
```

Configuration object is an optional

##### jQuery

if you decide use jQuery, validator is available. Simply

```js
$('.selector').validator({})
```
