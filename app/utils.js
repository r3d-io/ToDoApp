var user = require('./db/user')

async function createUser(address, req) {
  let uId = await getUserId(address)
  let userCount = await user.estimatedDocumentCount()
  req.session.address = address
  if (!uId) {
    uId = userCount + 1
    user.create({
      userId: uId,
      address: address
    },
      function (error, user) {
        if (error) {
          return
        }
        return uId
      }
    )
  }
  else
    return uId
}

function getUserId(address) {
  return new Promise(async (resolve, reject) => {
    user.find({ address: address }, function (err, user) {
      if (err)
        reject(err)
      else if (user.length !== 0)
        resolve(user[0].userId)
      else
        resolve()
    })
  })
}

module.exports = {
  createUser,
  getUserId
};