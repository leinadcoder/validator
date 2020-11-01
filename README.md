# Validator
It is a lightweight vanilla js plugin without dependencies to validate web forms by data HTML attributes.

__Features values validation via__ `Regex`

- Email
- Empty
- Spaces
- Phone number
- File size (empty)
- Phone length (ten digits)
- File format (jpg, jpeg, png, pdf)

---

## Usage instructions

### Install

```html
<!-- Put these into the <head> -->
<link rel="stylesheet" href="dist/validator.css"> <!-- CSS are optional -->
<script src="dist/validator.js">
```

### Usage
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

---

## Configuration by data attribute on HTML

#### Validator data atrributes

| Atrribute          | Values | Type | Description |
| ------------------ | ------ | ---- | ----------- |
| data-validator     | empty, space, phoneLength, phone, fileFormat, fileSize, mail | required | Field options to validate before to submit the form |
| data-validator-msg | Custom message | required | Alert message value
| data-trigger       | validator | required | Elment to dispatch validations methods |

**Note :** For multiple type of validation options, separete using character `^` for options and messages


##### HTMl example

```HTML
<form>
    <input type="text" data-validator="empty" data-validator-msg="Field is required!">
    <!-- Multiple type to validate -->
    <input type="text" data-validator="empty^email" data-validator-msg="Field is required!^Invalid email">
    <button data-trigger="validator">Send</button>
</form>
```

---

## Extend validator

Use configuration object to extend validator functionality

#### Options

| Option | Type   | Values  | Default | Description |
| ------ | ------ | ------- | ------- | ----------- |
| regex  | object | empty, space, phoneLength, phone, fileFormat, fileSize, mail |  | Collection of regex options |
| modal  | object | buttonText, headerText | `Ok`, `Notice` | Texts for button and header modal |
| buttonClass | string, [string, string] | | empty | To set custom class to override the default |
| headerClass | string, [string, string] | | empty | To set custom class to override the default |
| responseTo | object | method, sendMsg | empty, false | Callback function to get back control after validations |

**Notice:** `responseTo` send object to callback function

```json
{
    response: true|false
    msg: 'All right!'| validator message
}
 ```

##### Extend example

```JS
// Configuration no get the message
var contact = document.querySelector('.contact-form')
if (contact !== null) {
    contact.validator({
    modal: {
      buttonText: 'I understand',
      headerText: 'Error'
    },
    buttonClass: ['btn', 'btn-info', 'btn-sm'],
    headerClass: 'colorful',
    responseTo: {
      method: myFunction
    }
  })
}

// Function after validation
function myFunction () {
    console.log('Do something...')
}

// Configuration to get the message
var contact = document.querySelector('.contact-form')
if (contact !== null) {
    contact.validator({
    modal: {
      buttonText: 'I understand',
      headerText: 'Error'
    },
    buttonClass: ['btn', 'btn-info', 'btn-sm'],
    headerClass: 'colorful',
    responseTo: {
        method: myFunction,
        sendMsg: true
    }
  })
}

// Function after validation
function myFunction (response) {
    alert(response.msg)
}
```

---

# License
The code is available under the [Mit License](https://github.com/leinadcoder/validator/blob/master/LICENSE)
