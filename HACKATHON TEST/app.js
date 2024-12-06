import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    sendEmailVerification, 
    signOut, 
    signInWithPopup, 
    GoogleAuthProvider,
    db,  
    addDoc, 
    collection,getDocs , doc, setDoc,updateDoc,serverTimestamp,
    arrayUnion, arrayRemove, deleteDoc, query,  orderBy,  onSnapshot,Timestamp
} from "./firebase.js";


const provider = new GoogleAuthProvider();


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
};

let signUp = async () => {
    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let userData = { name, number, email, password };
    console.log(userData);

 
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
        return;
    }

    
try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "userdata", user.uid); 
    await setDoc(docRef, {
        ...userData,
        uId: user.uid
    });

    console.log("Document written with ID:", docRef.id);
    alert("Signup Successful");
    window.location.href = "main.html"; 
} catch (error) {
    console.error("Error:", error.message);
    alert("Error: " + error.message);
}



};

let sign_Up = document.getElementById("sign_Up");
if (sign_Up) {
    sign_Up.addEventListener("click", signUp);
}


let sign_In = (event) => {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Signed in successfully");
            window.location.href = "main.html";
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("Error: " + error.message);
        });
};


let signInButton = document.getElementById("signIn");
if (signInButton) {
    signInButton.addEventListener("click", sign_In);
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
    } else {
        console.log("No user is signed in");
    }
});


let sendMail = () => {
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                alert("Email verification sent");
            })
            .catch((error) => {
                console.error("Error sending verification email:", error.message);
            });
    } else {
        alert("No user is currently signed in.");
    }
};


let verification = document.getElementById("verify");
if (verification) {
    verification.addEventListener("click", sendMail);
}

// Sign Out function
let signout = () => {
    signOut(auth)
        .then(() => {
            console.log("Sign-out successful.");
            window.location.href = "signin.html";
        })
        .catch((error) => {
            console.error("Error during sign-out:", error.message);
        });
};


let sign_out = document.getElementById("logout");
if (sign_out) {
    sign_out.addEventListener("click", signout);
}


const googleSignin = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert("User signed in successfully");
            window.location.href = "main.html";
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error("Error during Google sign-in:", error);
            alert(`You are not Registered ${errorMessage}`);
        });
};


const googleBtn = document.getElementById("google");
if (googleBtn) {
    googleBtn.addEventListener("click", googleSignin);
}
let getData = async()=>
{
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
}
getData()
const Update = document.getElementById("update");
if (googleBtn) {
    Update.addEventListener("click", UpdateProfile);
}
let UpdateProfile = async () => {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;

    if (auth.currentUser) {
        let id = auth.currentUser.uid;

        try {
            const washingtonRef = doc(db, "userdata", id);
            await updateDoc(washingtonRef, { name,
                 phone, 
                 password,
                 timestamp: serverTimestamp(),
                
                }
                );
            alert("Updated");
        } catch (e) {
            console.error("Error updating document:", e);
        }
    } else {
        alert("You must be signed in to update your profile.");
    }
};

let update = document.getElementById("update");
if (update) {
    update.addEventListener("click", UpdateProfile); 
}

let deleteAccount=async()=>
{
  let id = auth.currentUser.uid
  console.log(id);
  await deleteDoc(doc(db, "userdata", id));
  alert("Delete Successfully")
}

let deleteButton = document.getElementById("delete");
if (deleteButton) {
    deleteButton.addEventListener("click", deleteAccount);
}




let addDocument = async () => {
    try {
      let title_input = document.getElementById("title");
      let desc_input = document.getElementById("description");
   
      title_input.style.display = "block";
      desc_input.style.display = "block";
      
      const docRef = await addDoc(collection(db, "Post"), {
        title: title_input.value,
        desc: desc_input.value,
        time: Timestamp.now(),
      });
  
      console.log("Successfully added document with ID: ", docRef.id);
  
     
      title_input.value = '';
      desc_input.value = '';
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };
 
  let button = document.getElementById("button");
  button.addEventListener("click", addDocument);
  
  const post = () => {
    try {
        const q = query(collection(db, "Post"), orderBy("time", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let post_data = document.getElementById("post_data");
            post_data.innerHTML = ''; 

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const timeString = data.time ? data.time.toDate().toLocaleString() : "No Timestamp";
                const currentUser = auth.currentUser;
                const userName = currentUser && currentUser.displayName;

               
                const postElement = document.createElement('div');
                postElement.classList.add('p-2', 'mb-2');
                postElement.setAttribute('data-id', doc.id);

                postElement.innerHTML = `
                    <div class="card-header d-flex">
                        <div class="name-time d-flex flex-column">
                            ${userName}
                            <div class="time">${timeString}</div>
                        </div>
                    </div>
                    <blockquote class="blockquote mb-0">
                        <p class="title">${data.title}</p>
                        <footer class="blockquote-footer description">${data.desc}</footer>
                        <p class="cat"></p>
                    </blockquote>
                    <div class="card-footer d-flex justify-content-end">
                        <button type="button" class="ms-2 btn bg-primary text-light editBtn">Edit</button>
                        <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
                    </div>
                `;

                
                post_data.appendChild(postElement);
            });

            
            attachEventListeners();

        });

        return unsubscribe;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

post();


const attachEventListeners = () => {
    const post_data = document.getElementById("post_data");

    
    post_data.addEventListener("click", async (e) => {
        if (e.target && e.target.classList.contains("deleteBtn")) {
            const postId = e.target.closest('.p-2').getAttribute('data-id');  
            if (postId) {
                try {
                    await deleteDoc(doc(db, "Post", postId)); 
                    alert("Post deleted successfully");
                } catch (error) {
                    console.error("Error deleting document:", error);
                    alert("Error deleting the post");
                }
            } else {
                alert("Post ID not found!");
            }
        }
    });

   
    post_data.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("editBtn")) {
            const postId = e.target.closest('.p-2').getAttribute('data-id'); // Ensure it gets the correct .p-2 (post card)
            const cardElement = e.target.closest('.p-2'); // Get the closest .p-2 for proper reference
            const currentTitle = cardElement.querySelector('.title').innerText;
            const currentDesc = cardElement.querySelector('.description').innerText;

           
            document.getElementById("title").value = currentTitle;
            document.getElementById("description").value = currentDesc;

          
            let updateButton = document.getElementById("update_post");
            if (updateButton) {
                updateButton.onclick = () => UpdatePost(postId, cardElement);
            }
        }
    });
};


let UpdatePost = async (postId, cardElement) => {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("description").value;

    if (auth.currentUser) {
        try {
          
            const postRef = doc(db, "Post", postId);
            await updateDoc(postRef, {
                title,
                desc,
                time: serverTimestamp(), 
            });

            alert("Post updated successfully");

           
            const titleElement = cardElement.querySelector('.title');
            const descElement = cardElement.querySelector('.description');

            if (titleElement && descElement) {
                titleElement.innerText = title; 
                descElement.innerText = desc; 
            }
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Error updating the post");
        }
    } else {
        alert("You must be signed in to update a post.");
    }
};


