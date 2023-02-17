let cl = console.log

const postContainer = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

let baseUrl = `http://localhost:3000`;
let postUrl = `${baseUrl}/posts`;

const templating = (arr) => {
    let result = '';
    arr.forEach(post => {
        result += `
                <div class="card mb-4 bg-warning" id="${post.id}">
                    <div class="card-header">
                        <h3>
                            ${post.title}
                        </h3>        
                    </div>
                    <div class="card-body">
                        <p>
                            ${post.body}
                        </p>
                    </div>
                    <div class="card-footer text-right">
                        <button class="btn btn-primary" onclick="onEdit(this)" id="updateBtn">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)" id="deleteBtn">Delete</button>
                    </div>
                </div>
        `
    });
    postContainer.innerHTML = result;
}

const makeApiCall = (methodName, apiUrl, bodyMsg) => {
    return new Promise ((resolve,reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("authorization", "get token from localStorage");
    xhr.onload =() =>{
        if(xhr.status === 200 || xhr.status === 201){
            resolve(xhr.response)
            
        }else{
            reject("Something went wrong...!")
        }
    }
    xhr.send(JSON.stringify(bodyMsg))
    })
}

makeApiCall("GET", postUrl)
    .then((res) => {
        let data = JSON.parse(res)
        templating(data)
    })
    .catch((err) => {
        cl(err)
    });
    const onSubmitBtn = (ele => {
        ele.preventDefault();
        cl("submitted")
        let obj = {
            title : titleControl.value,
            body : contentControl.value,
            userId : Math.ceil(Math.random() * 10)
        }
        // cl(obj);
        postForm.reset();
        makeApiCall("POST", postUrl, obj)
        .then(res =>{
            cl(res)
        })
        .catch(err => {
            cl(err)
        })
    })

    const onDelete = (eve) => {
        // cl("deleted")
        let deleteId = eve.closest(".card").id;
        // cl(deleteId)
        let deletedUrl = `${postUrl}/${deleteId}`
        // cl(deletedUrl)
        makeApiCall("DELETE", deletedUrl)
        .then(res => cl(res))
        .catch(err => cl(err))
    }

    const onEdit = (eve) =>{
        let editId = eve.closest(".card").id;
        // cl(editId);
        localStorage.setItem("updatedId", editId)
        let editUrl = `${postUrl}/${editId}`;
        // cl(editUrl)

        makeApiCall("GET", editUrl)
        .then(res => {
            let data = JSON.parse(res);
            titleControl.value = data.title;
            contentControl.value = data.body;
            submitBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
        }).catch(err => cl(err));
    }
    
const onUpdateBtn = (eve) => {
    let updateId = localStorage.getItem("updatedId");
    let updatedUrl = `${postUrl}/${updateId}`;
    let obj = {
        title : titleControl.value,
        body : contentControl.value
    }
    makeApiCall("PATCH", updatedUrl, obj)
    .then(res => cl(res))
    .catch(err => cl(err))
}

postForm.addEventListener("submit", onSubmitBtn);
updateBtn.addEventListener("click", onUpdateBtn)