import Parse from 'parse'

export default {
  getAll () {
    return Parse.Cloud.run('GetProducts', {})
  }
}
