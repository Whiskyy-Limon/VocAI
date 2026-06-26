function ok(res, data, message = 'OK', status = 200) {
  return res.status(status).json({
    ok: true,
    message,
    data,
  })
}

function fail(res, message = 'Error', status = 400, code = null) {
  const payload = {
    ok: false,
    message,
  }
  if (code) payload.code = code
  return res.status(status).json(payload)
}

module.exports = {
  ok,
  fail,
}
