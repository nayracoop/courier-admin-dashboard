import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  iconPack: 'fontawesome'
})

let errorOptions = {
  type: 'error',
  icon: 'fa-exclamation-triangle',
  duration: 5000
}

let successOptions = {
  type: 'success',
  icon: 'fa-check-circle-o',
  duration: 5000
}

let infoOptions = {
  type: 'info',
  icon: 'fa-info-circle',
  duration: 5000
}

export default {
  init: function () {
    // register the toast with the custom message
    Vue.toasted.register('error_toast',
      (payload) => {
        // if there is no message passed show default message
        if (!payload.message) {
          return 'Oops... algo anduvo mal'
        }
        // if there is a message show it with the message
        return payload.message
      },
      errorOptions
    )

    Vue.toasted.register('success_toast',
      (payload) => {
        // if there is no message passed show default message
        if (!payload.message) {
          return 'Excelente! El proceso fue exitoso'
        }
        // if there is a message show it with the message
        return payload.message
      },
      successOptions
    )

    Vue.toasted.register('info_toast',
      (payload) => {
        // if there is no message passed show default message
        if (!payload.message) {
          return 'Algo ocurrió'
        }
        // if there is a message show it with the message
        return payload.message
      },
      infoOptions
    )
  }
}
