import React, { useState } from 'react'

function Sample() {


  async function hello() {
    return Promise.resolve("Hello World")
  }
  hello().then(res => console.log(res))



  const users = [
    {name : "john", age : 20},
    {name : "jane", age : 30}
  ]

  function getUsers(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(users)
      }, 2000)
    })
  }
  getUsers().then(data => console.log(data))



  const title = document.getElementById("title")

  title.textContent = "hello js";



  const btn = document.getElementById("btn")

  btn.addEventListener("click",() => {
    console.log("Button clicked");
    
  })




  const product = [
    { name: "phone", category: "electronics" },
    { name: "shirt", category: "clothes" },
    { name: "laptop", category: "electronics" }
  ]

  const electronic = product.filter(prd =>
    prd.category === "electronics")
    .map(prd => prd.name)
  console.log(electronic);



  return (
    <div>
      <div>
        <button id='btn' >chnage</button>
      </div>

    </div>

  )
}

export default Sample