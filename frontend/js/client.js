

const socket = io("http://localhost:4500/", { transports: ["websocket"] });


const submitBtn = document.querySelector("#submit-btn");
const commentbox = document.querySelector(".comment_box");
const text = document.getElementById("textarea")




let username = localStorage.getItem("name");

const nform = document.getElementById("nform")
nform.addEventListener("submit",(e)=>{
    e.preventDefault()
    let obj={
        textarea:nform.textarea.value
    }
   let comment = obj.textarea;
      console.log(comment)
    
      if (!comment) {
        return;
      }
      postComment(comment)  
})




function postComment(comment) {
  //append to frontend
  let data = {
    username: username,
    comment: comment
  };
  console.log(data)
  appendToDom(data);
  text.value = ""


  //broadcast
  broadcastComment(data)

  //storing in db
  syncWithDB(data)
}



function appendToDom(data) {
  let ltag = document.createElement("li");
  ltag.classList.add("comment", "mb-3");

  let markup = `
  <div class="card border-light mb-3">
  <div class="card-body">
      <h6>${data.username}</h6>
      <p>${data.comment}</p>
      <div class="cardb">
          <div><small>${moment(data.time).format('LT')}</small></div>
          <div><button data-id=${data._id} onclick="deleting()" class="removebtn">Remove</button></div>
      </div>
  </div>
</div>
    `
    ltag.innerHTML = markup

    commentbox.prepend(ltag)
}


function broadcastComment(data){
  socket.emit("comment",data)
}

socket.on("comment",(data)=>{
  appendToDom(data)
})




//eventlistener on textarea
text.addEventListener("keyup",(e)=>{
  socket.emit("typing",{username})
})




//sync with db

// setInterval(()=>{
// },1000)



async function syncWithDB(data){

  let newdata = await fetch("http://localhost:4500/api/comment",{
    method:"POST",
    body:JSON.stringify(data),
    headers:{
      "content-type":"application/json",
      Authorization:localStorage.getItem("movieID")
    }
  })
  if(newdata.ok){
    console.log(newdata)
  }else{
    setTimeout(()=>{
      window.location.href="review.html"
    },1000)
    console.log(error)
  }
}

syncWithDB()



//window.onload = fetchComments




//show comment on browser from mongodb
let newarr = []
// async function fetchComments(){
//   let getdata = await fetch("http://localhost:4500/api/getcomments",{
//     method:"GET",
//     headers:{
//       "content-type":"application/json",
//       Authorization:localStorage.getItem("movieID")
//     }
//   })
//   if(getdata.ok){
//     //console.log(getdata)
//     let newone = await getdata.json()
//     console.log(newone)
//     newone.map((ele)=>{
//       appendToDom(ele)
      
//     })
   
//   }else{
//     setTimeout(()=>{
//       window.location.href="review.html"
//     },1000)
//     console.log(error)
//   }
// }

function deleting(){
  var _id=event.target.dataset.id
  async function deleteReview(){
  let getdata = await fetch("http://localhost:4500/api/delete",{
    method:"DELETE",
    headers:{
      "content-type":"application/json",
      Authorization:_id
    }
})
if(getdata.ok){
  swal({
    title: "Are you sure?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("Poof! Review has been deleted!", {
        icon: "success",
      });

      setTimeout(()=>{
        window.location.href="review.html"
      },2500)
    } else {
      swal("Your review is safe!");
    }
  });
}else{
  console.log(err.message)
}
  }
  deleteReview()
}
