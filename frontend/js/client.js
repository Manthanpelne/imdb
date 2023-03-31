

// const socket = io("https://imdbmovieapp-production.up.railway.app", { transports: ["websocket"] });


// const submitBtn = document.querySelector("#submit-btn");
// const commentbox = document.querySelector(".comment_box");
// const text = document.getElementById("textarea")



// let username = localStorage.getItem("name");

// const nform = document.getElementById("nform")
// nform.addEventListener("submit",(e)=>{
//     e.preventDefault()
//     let obj={
//         textarea:nform.textarea.value
//     }
//    let comment = obj.textarea;
//       console.log(comment)
    
//       if (!comment) {
//         return;
//       }
//       postComment(comment)  
// })




// function postComment(comment) {
//   //append to frontend
//   let data = {
//     username: username,
//     comment: comment,
//   };
//   appendToDom(data);
//   text.value = ""


//   //broadcast
//   broadcastComment(data)

//   //storing in db
//   syncWithDB(data)
// }



// function appendToDom(data) {
//   let ltag = document.createElement("li");
//   ltag.classList.add("comment", "mb-3");

//   let markup = `
//   <div class="card border-light mb-3">
//   <div class="card-body">
//       <h6>${data.username}</h6>
//       <p>${data.comment}</p>
//       <div class="cardb">
//           <div><small>${moment(data.time).format('LT')}</small></div>
//           <div><button class="removebtn">Remove</button></div>
//       </div>
//   </div>
// </div>
//     `
//     ltag.innerHTML = markup

//     commentbox.prepend(ltag)
// }


// function broadcastComment(data){
//   socket.emit("comment",data)
// }

// socket.on("comment",(data)=>{
//   appendToDom(data)
// })




// //eventlistener on textarea
// text.addEventListener("keyup",(e)=>{
//   socket.emit("typing",{username})
// })



// //sync with db
// function syncWithDB(data){
//   const headers={
//     "Content-type":"application/json"
//   }
//   fetch("http://localhost:4500/api/comments",{method:"Post",body:JSON.stringify(data),headers})
//   .then(response=>response.json())
//   .then(result=>{
//     console.log(result)
//   })
// }



// window.onload = fetchComments


// //show comment on browser from mongodb
// function fetchComments(){
//   fetch("http://localhost:4500/api/comments")
//   .then(res=>res.json())
//   .then(result=>{
//    result.forEach((comment) => {
//     comment.time = comment.createdAt
//     appendToDom(comment)
//    });
//   })
// }
