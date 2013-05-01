# callback(err, text)

getFile = (path, callback) ->
  $.ajax
    url: path,
    type: 'GET'
    success: (text) -> callback null, text
    error: (data) -> callback data
    # TODO handle error case for missing files

module.exports = getFile
