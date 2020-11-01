function Validator (element, config) {
  var self = this
  const clickEvent = typeof window.ontouchstart !== 'undefined'
    ? 'touchstart'
    : 'click'

  function init () {
    if (element._validator) {
      destroy(element._validator)
    }

    element._validator = self

    self.element = element
    self.instanceConfig = config || {}

    parseConfig()

    modal()
    getData()

    bind()
  }

  function bind () {
    const element = self.element.querySelector('[data-trigger="validator"]')
    element.addEventListener(clickEvent, validate)
  }

  function getData () {
    var elements = self.element.querySelectorAll('[data-validator]')

    self.dataValidator = []

    for (let i = 0, l = elements.length; i < l; i++) {
      const msg = elements[i].getAttribute('data-validator-msg').split('^')
      const validator = elements[i].getAttribute('data-validator').split('^')

      for (let j = 0, lg = msg.length; j < lg; j++) {
        const objValidator = {
          option: validator[j],
          msg: msg[j],
          element: elements[i]
        }

        self.dataValidator.push(objValidator)
      }
    }
  }

  function validate (e) {
    e.preventDefault()

    let valid = true

    for (let i = 0, l = self.dataValidator.length; i < l; i++) {
      const objValid = self.dataValidator[i]

      if (Object.prototype.hasOwnProperty.call(self.config.regex, objValid.option)) {
        if (objValid.element.type === 'file' && objValid.option === 'fileSize') {
          if (objValid.files[0].size / 1024 > 1024) {
            objValid.element.value = ''
          }
        }

        if (objValid.element.type !== 'file') {
          objValid.element.value = objValid.element.value.replace(self.config.regex.space, '')
        }

        if (!self.config.regex[objValid.option].test(objValid.element.value)) {
          valid = false

          if (self.config.responseTo.sendMsg === true) {
            if (self.config.responseTo.method instanceof Function) {
              self.config.responseTo.method({
                response: false,
                msg: objValid.msg
              })
            } else {
              console.error('Method is not a function')
            }
          } else {
            const contentElement = document.querySelector('.validator-modal-content')

            contentElement.innerText = objValid.msg

            toogleModal()
          }

          objValid.element.value = ''
          objValid.element.focus()

          i = self.dataValidator.length
        }
      }
    }

    if (valid) {
      if (self.config.responseTo.method instanceof Function) {
        self.config.responseTo.method({
          response: true,
          msg: 'All right!'
        })
      } else {
        console.error('Method is not a function')
      }
    }
  }

  function modal () {
    if (!document.querySelector('.validator-modal-overlay')) {
      const modal = document.createDocumentFragment()

      var modalButton = createElement('button', 'v-button')
      var modalWrap = createElement('div', 'validator-modal-wrap')
      var modalHeader = createElement('div', 'validator-modal-header')
      var modalFooter = createElement('div', 'validator-modal-footer')
      var modalContent = createElement('div', 'validator-modal-content')
      var modalOverlay = createElement('div', 'validator-modal-overlay')

      modalFooter.appendChild(modalButton)

      modalHeader.appendChild(createElement('h5'))

      modalWrap.appendChild(modalHeader)
      modalWrap.appendChild(modalContent)
      modalWrap.appendChild(modalFooter)

      modalOverlay.appendChild(modalWrap)

      modal.appendChild(modalOverlay)
      document.body.appendChild(modal)

      const closeModal = document.querySelector('.v-button')
      closeModal.addEventListener(clickEvent, toogleModal)
    }
  }

  function toogleModal () {
    const validatorModal = document.querySelector('.validator-modal-overlay')

    if (!validatorModal.classList.contains('validator-show')) {
      // Add custom options
      const btn = document.querySelector('.v-button')
      const title = document.querySelector('.validator-modal-header h5')

      for (let i = btn.classList.length; i > 0; i--) {
        btn.classList.remove(btn.classList[i])
      }

      title.classList = []

      title.innerText = self.config.modal.headerText
      btn.innerText = self.config.modal.buttonText

      if (Array.isArray(self.config.headerClass)) {
        self.config.headerClass.forEach(c => {
          title.classList.add(c)
        })
      } else if (self.config.headerClass !== '') {
        title.classList.add(self.config.headerClass)
      }

      if (Array.isArray(self.config.buttonClass)) {
        self.config.buttonClass.forEach(c => {
          btn.classList.add(c)
        })
      } else if (self.config.buttonClass !== '') {
        btn.classList.add(self.config.buttonClass)
      } else {
        btn.classList.add('validator-modal-button')
      }
    }

    // Show/Hide modal
    validatorModal.classList.toggle('validator-show')
  }

  function createElement (tag, className) {
    const e = document.createElement(tag)

    if (className !== undefined) {
      e.className = className
    }

    return e
  }

  function destroy (instance) {
    instance = instance || self
    instance.clear()
  }

  function extend (out) {
    out = out || {}

    for (let i = 1, l = arguments.length; i < l; i++) {
      if (!arguments[i]) {
        continue
      }

      for (const key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          out[key] = arguments[i][key]
        }
      }
    }

    return out
  }

  function parseConfig () {
    self.config = Object.create(Validator.defaultConfig)
    const userConfig = extend({}, self.instanceConfig, self.element.dataset || {})

    extend(self.config, userConfig)
  }

  init()
  return self
}

Validator.defaultConfig = {
  regex: {
    empty: /([^\s])/,
    space: /\s+abc/,
    phoneLength: /^\d{10}$/,
    phone: /^(\d)(?!\1+$)\d*$/,
    fileFormat: /\.(jpg|jpeg|png|pdf)$/i,
    fileSize: /([^\s])/,
    mail: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
  },
  modal: {
    buttonText: 'Ok',
    headerText: 'Notice'
  },
  buttonClass: '',
  headerClass: '',
  responseTo: {
    method: '',
    sendMsg: false
  }
}

function _validator (nodelist, config) {
  if (nodelist.length === 0) {
    console.error('Does not exist selector')
  }

  var instances = []
  for (let i = 0, l = nodelist.length; i < l; i++) {
    try {
      nodelist[i]._validator = new Validator(nodelist[i], config || {})
      instances.push(nodelist[i]._validator)
    } catch (e) {
      console.warn(e, e.stack)
    }
  }
}

if (typeof HTMLElement !== 'undefined') { // browser env
  HTMLCollection.prototype.validator =
  NodeList.prototype.validator = function (config) {
    return _validator(this, config)
  }

  HTMLElement.prototype.validator = function (config) {
    return _validator([this], config)
  }
}

function validator (selector, config) {
  return _validator(document.querySelectorAll(selector), config)
}

if (typeof jQuery !== 'undefined') {
  jQuery.fn.validator = function (config) {
    return _validator(this, config)
  }
}

if (typeof module !== 'undefined') {
  module.exports = Validator
}
