import React, { useState, useEffect } from "react"
import { Table, Container, Row, Col, ListGroup, Image } from "react-bootstrap"
import MemberSideLink from "./MemberSideLink"
import MyBreadcrumb from "../components/MyBreadcrumb"

function Coupon() {
  const [coupon, setCoupon] = useState([])
  function changeBackgroundColor(){
    document.body.style.background ='#5C6447'
  }
  
  

  async function getData() {
    const request = new Request("http://localhost:3002/membercenter/coupon", {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "appliaction/json",
      }),
    })

    const response = await fetch(request)
    const data = await response.json()
    console.log("顯示的資料", data)
    // 設定資料
    setCoupon(data)
  }
  useEffect(() => {
    getData()
    changeBackgroundColor()
    document.getElementById("maintable").classList.add('coupontable')
  }, [])
  return (
    <>
      <div style={{background:"url(/bg-pattern.svg) repeat", position:" fixed",left: '0',top: '0',width: "25vw",height: "100vh",opacity:'0.1'}}></div>
      <MyBreadcrumb />
      <MemberSideLink>
        <Col md={10} xs={12} style={{background:"white"}}>
          <h3 style={{textAlign:"center"}}>我的折價券</h3>
          <Table id="maintable">
            <thead style={{border:"2px solid #C5895A", borderBottom:"#C5895A"}}>
              <tr className="bg-primary " >
                <th>折價券名稱</th>
                <th>折扣內容</th>
                <th>有效期限</th>
                <th>獲得日期</th>
              </tr>
            </thead>
            <tbody style={{border:"2px solid #C5895A", borderTop:"#C5895A"}}>
              {coupon.map((value, index) => {
                return (
                  <tr style={{border:"2px solid #C5895A"}}>
                    <td>{value.discountName}</td>
                    <td style={{color:" #C5895A"}}>
                      {(Number(value.discountMethod) < 1&&Number(value.discountMethod) >0)? `${value.discountMethod.substr(2, 3)}折`
                        : `折扣${value.discountMethod.substr(1, 4)}元`}
                    </td>
                    <td>{value.discountPeriod}</td>
                    <td>{value.created_at}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <div>升級會員，享有更多優惠，會員等級說明看這邊>></div>
        </Col>
      </MemberSideLink>
    </>
  )
}
export default Coupon
