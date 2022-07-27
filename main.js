// defines delete button as anything with the class of fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')

// defines item as anything with class of 'item' AND is a span
const item = document.querySelectorAll('.item span')

// defines itemCompleted as anything with class of 'item' AND element of span with class of completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// creates array from delete buttons that performs deleteItem method when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// when an item is clicked, mark it complete using the markComplete method
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creates array of completed items. when clicked, performs markUnComplete method
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// 
async function deleteItem(){
    // defines itemText as the object that is selected from the DOM
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // calls the deleteItem function in server.js
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}