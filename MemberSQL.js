class MemberSQL {
  constructor(memberName, shipAddress, paymentCity, phone,email,memberImg) {
    this.id = 0
    this.memberName = memberName
    this.shipAddress = shipAddress
    this.paymentCity = paymentCity
    this.phone = phone
    this.email = email
    this.memberImg = memberImg
    this.login = 0
  }

  addUserSQL() {
    let sql = `INSERT INTO USERS(name, username, password, email, login, createdDate) \
                   VALUES('${this.name}', '${this.username}', '${this.password}', '${this.email}', 0, NOW())`
    return sql
  }

  updateUserByIdSQL(id) {
    let sql = `UPDATE USERS \
               SET memberName = '${this.memberName}', shipAddress = '${this.shipAddress}', paymentCity = '${this.paymentCity}', phone = '${this.phone}', email = ${this.email}, memberImg = '${this.memberImg}', \
               WHERE id =  ${id}`
    return sql
  }
  // static是與實例化無關
  static getUserByIdSQL(id) {
    let sql = `SELECT * FROM USERS WHERE id = ${id}`
    return sql
  }

  // login用
  getUserUserByUsernameAndPasswordSQL() {
    let sql = `SELECT * FROM USERS WHERE username = '${this.username}' AND password =  '${this.password}' LIMIT 0,1`
    return sql
  }

  // static是與實例化無關
  static getUserByQuerySQL(query) {
    const where = []

    if (query.name) where.push(`name = '${query.name}'`)
    if (query.email) where.push(`email = '${query.email}'`)
    if (query.username) where.push(`username = '${query.username}'`)

    let sql = ''

    if (where.length) sql = `SELECT * FROM USERS WHERE ` + where.join(' AND ')
    else sql = `SELECT * FROM USERS`

    return sql
  }

  static deleteUserByIdSQL(id) {
    let sql = `DELETE FROM USERS WHERE ID = ${id}`
    return sql
  }

  static getAllUserSQL() {
    let sql = `SELECT * FROM USERS`
    return sql
  }
}

export default MemberSQL
// module.exports = router;

