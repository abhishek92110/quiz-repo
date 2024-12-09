import React, { useState } from 'react'
import Loading from './Loading'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'bootstrap';

export const DeleteModal = (props) => {

    const navigate = useNavigate()

    const [loadingStatus, setLoadingStatus] = useState(false)

    

    const data = props?props.data:null

    console.log("delete modal props delete id =",props.data,null)

    // const handleDalete = async()=>{
    //     // setLoadingStatus(true)

    //     let staticModal = document.getElementById("staticBackdrop")
    //     let modelBack = document.getElementsByClassName("modal-backdrop")
    //     let styleObj = window.getComputedStyle(staticModal)
    //     let displayProp = styleObj.getPropertyValue("display");
    //     console.log("static modal =",staticModal,displayProp)

    //     const modalInstance = Modal.getInstance(staticModal); 

    //     setTimeout(()=>{

    //         console.log("set time out is running", modelBack)
    //         modalInstance.hide(); 
    //         staticModal.style.opacity ="1"
    //         // navigate('/admin')

    //         Array.from(modelBack).forEach(element => {
    //             // console.log("data class =",element.classList.remove("show"))
    //             element.classList.remove("show")
    //         });
           
    //         document.body.classList.remove("modal-open");
    //         document.body.style.removeProperty("padding-right");
    //     },2000)

    // //     try{

    // //    let response = await fetch("https://blockey.in:8000/delete-exam", {
    // //         method: "DELETE",
    // //         headers: {
    // //           "Content-Type": "application/json",
    // //         },
    // //         body: JSON.stringify({
    // //           id: data._id,
    // //         }),
    // //       });

    // //       response = await response.json()

    // //       if(response.status){
    // //         setTimeout(()=>{

    // //             setLoadingStatus(false)
    // //             navigate('/admin')

    // //         },1000)
    // //       }

    // //     }
    // //     catch(error){
        
    // //         setLoadingStatus(false)

    // //     }

    // }


  return (
    <div>
        {loadingStatus && <Loading/>}

<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Deleting Exam</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Are you want to delete the {data!=null?props.data.category:""} Exam dated for {data!=null?props.data.date:""}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">No</button>
        <button type="button" class="btn btn-success">Yes</button>
      </div>
    </div>
  </div>
</div>


    </div>
  )
}
