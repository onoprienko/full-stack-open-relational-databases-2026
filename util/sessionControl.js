const sessionControl = async (req, res, next) => {
  try {
    const existedSession = await Session.findOne({
      where: {
        token: req.token,
        user_id: req.decodedToken.id,
      },
    })
    if (!existedSession) return res.status(403).end()
  } catch (error) {
    next(error)
  }
  next()
}

module.exports = { sessionControl }
