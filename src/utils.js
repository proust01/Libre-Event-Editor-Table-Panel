import { appEvents } from 'app/core/core'

const hostname = window.location.hostname
const protocol = window.location.protocol + '//'
export const postgRestHost = protocol + hostname + ':5436/'
export const influxHost = protocol + hostname + ':8086/'
export const influxDBName = 'smart_factory'

export const get = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = (e) => reject(e)
    xhr.send()

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          resolve(res)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const post = (url, line) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = (e) => reject(e)
    xhr.send(line)

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          resolve(res)
        } else if (xhr.status === 204) {
          res = xhr.responseText
          resolve(res)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const addSlash = (target) => {
  return target.split(' ').join('\\ ')
}

export const alert = (type, title, msg) => {
  appEvents.emit('alert-' + type, [title, msg])
}

export const showModal = (html, data, mClass) => {
  appEvents.emit('show-modal', {
    src: 'public/plugins/libre-event-editor-table-panel/partials/' + html,
    modalClass: mClass || 'confirm-modal',
    model: data
  })
}

export const isValidVal = (val) => {
  return val !== null && val !== undefined && val !== ''
}

export const sure = (promise) =>
  promise.then((data) => ({ ok: true, data })).catch((error) => Promise.resolve({ ok: false, error }))

export const copy = (obj) => JSON.parse(JSON.stringify(obj))
