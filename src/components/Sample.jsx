import React, { useState } from 'react'

function Sample() {

  const nums = [8, 3, 10, 1, 6]

  let smallest = nums[0]

  for(let num of nums){
    if(smallest > num){
      smallest = num
    }
  }
  console.log(smallest);


  const nums1 = [2, 4, 6, 8]

  let total = 0

  for (let num of nums1){
    total += num;
  }

  console.log(total);
  


  const nums2 = [1, 2, 3, 4, 6, 7];

  let count = 0;

  for (let num of nums2 ) {
    if( num % 2 !== 0 ){
      count ++
      console.log(num);
    }
  }
  
  console.log(count);



  const nums3 = 5

  if( nums3 % 2 === 0){
    console.log("even");
  }
  else{
    console.log("odd"); 
  }
  

  const str = "javascripts"

  let reversed = str.split("").reverse().join("")

 console.log(str === reversed? "palindrome" : "not palindrome");
 

  


  return (
    <div>
      <div>
        <button id='btn' >chnage</button>
      </div>
    </div>
  )
}

export default Sample