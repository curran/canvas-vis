# callback(err, text)
getFile = (path, callback) ->
  # TODO handle error case for missing files
  $.get path, (text) -> callback null, text

module.exports = getFile
