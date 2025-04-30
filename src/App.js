import React from 'react';
import './App.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { auth, db } from './firebase/init'; // ✅ include db here
import { collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { deleteDoc } from 'firebase/firestore';


function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  async function deletePost (){
    const hardCodedId = "rkBa0EWyUhK2fbFmouiY";
    const postRef = doc(db, "posts", hardCodedId);
    try {
      await deleteDoc(postRef);
      console.log("Post deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }


  async function updatePost() {
    const hardCodedId = "rkBa0EWyUhK2fbFmouiY";
    const postRef = doc(db, "posts", hardCodedId);
  
    try {
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data(); // get the existing data
  
        const newPost = {
          ...postData,
          title: "Land a $500k job", // change title only
        };

        updateDoc (postRef, newPost);

        
        await updateDoc(postRef, newPost);
        console.log("Post updated");
      } else {
        console.log("No such post found to update.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }
  

  function createPost() {
    const postData = {
      title: "Finish Interview Section",
      description: "Do Frontend Simplified",
      uid: user.uid,
    };

    addDoc(collection(db, "posts"), postData)
      .then(() => console.log("Post created"))
      .catch((error) => console.error("Error creating post:", error));
  }

  async function getAllPosts() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(posts); // ✅ should show array with id
  }

  async function getPostById(id = "rkBa0EWyUhK2fbFmouiY") {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);
  
    if (postSnap.exists()) {
      console.log({ id: postSnap.id, ...postSnap.data() });
      return postSnap.data();
    } else {
      console.log("No post found with that ID.");
      return null;
    }
  }
  

  async function getPostByUid() {
    const postCollectionRef = await query (
      collection(db, "posts"),
      where("uid", "==", user.uid)
    )
    const querySnapshot = await getDocs(postCollectionRef);
   console.log(querySnapshot.docs.map(doc => doc.data()));
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        setUser(user);
        setLoading(false);
      }, 1500);
    });

    return () => unsubscribe();
  }, []);

  function register() {
    createUserWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function login() {
    signInWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function logout() {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (loading) {
    return (
      <SkeletonTheme baseColor="#ccc" highlightColor="#e0e0e0">
        <div className="App">
          <nav className="navbar">
            <span className="logo">
              <Skeleton width={100} height={30} />
            </span>
            <div className="nav-buttons">
              <Skeleton width={80} height={30} style={{ marginRight: '10px' }} />
              <Skeleton width={80} height={30} />
            </div>
          </nav>
          <div className="content">
            <Skeleton height={200} width="60%" style={{ margin: '2rem auto' }} />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  

  return (
    <div className="App">
      <nav className="navbar">
        <span className="logo">Frontend Simplified</span>
        <div className="nav-buttons">
          {!user && <button onClick={register}>Register</button>}
          {!user && <button onClick={login}>Log In</button>}
          {user && (
            <>
              <div className="avatar">{user.email.charAt(0).toUpperCase()}</div>
              <button onClick={logout}>Log Out</button>
              <button onClick={createPost}>Create Post</button>
              <button onClick={getAllPosts}>Get All Posts</button>
              <button onClick={() => getPostById()}>Get Post By Id</button>
              <button onClick={getPostByUid}>Get Post By Uid</button>
              <button onClick={updatePost}>Update Post</button>
              <button onClick={deletePost}>Delete Post</button>

            </>
          )}
        </div>
      </nav>

      <div className="content">
        {user ? (
          <h2>Welcome, {user.email}</h2>
        ) : (
          <h2>Please log in or register.</h2>
        )}
      </div>
    </div>
  );
}

// ✅ Don't forget this!
export default App;
