
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteFailure, deleteUserSuccess, deleteUserStart, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";




export default function Profile() {
  const {currentUser, loading, error} = useSelector((state)=> state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateUser] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState();
 const dispatch = useDispatch()
 
  console.log(userListing)

  // FireBase storage 
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*');

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName );
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_change', (snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      // console.log('upload is' + progress + '% done')
      setFilePerc(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL)=>{
        setFormData({...formData, avatar: getDownloadURL})
      })
    })
  }

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      // if (data){
      //   dispatch(updateUserSuccess(data.message))
      // }
      dispatch(updateUserSuccess(data));
      setUpdateUser(true);

    }catch(error){
      dispatch(updateUserFailure(error.message))
    }
  }
  
  const handleDeleteUser = async()=>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`server/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(error){
      dispatch(deleteFailure(error.message));
    }
  }

  const handleSignOut = async()=>{
    try{
      dispatch(signOutUserStart());
      const res = await fetch('/server/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data.message))
    }catch(error){
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowlisting = async()=>{
    try{
      setShowListingError(false)
      const res = await fetch(`/server/user/getlisting/${currentUser._id}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      // console.log(res)
      const data =  await res.json();
      // console.log(data);
      
      if(data.success === false){
        setShowListingError(true);
        return
      }
      setUserListing(data)
    }catch (error){
      setShowListingError(true)
    }
  }

  const handleDeleteListing = async(listingsId)=>{
    try {
      const res = await fetch(`/server/listing/delete/${listingsId}`,{
        method: "DELETE",
      })
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return
      }
      setUserListing((prev)=>prev.filter((listing)=>listing._id !== listingsId))
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <input 
                onChange={(e) => setFile(e.target.files[0])} 
                type="file" 
                ref={fileRef} 
                hidden 
                accept="image/*" 
              />
              <img 
                onClick={() => fileRef.current.click()} 
                src={formData.avatar || currentUser.avatar} 
                alt="profile" 
                className="rounded-full h-32 w-32 object-cover cursor-pointer border-2 border-gray-300"
              />

              <p className="mt-2 text-sm text-center">
                {fileUploadError ? (
                  <span className="text-red-600">Error: Image must be less than 2MB</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-green-500">Uploading... {filePerc}%</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-700">Image successfully uploaded!</span>
                ) : null}
              </p>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                id="username" 
                placeholder="Username"  
                defaultValue={currentUser.username}
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />

              <input 
                type="email" 
                id="email" 
                defaultValue={currentUser.email}
                placeholder="Email"  
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />

              <input 
                type="password" 
                id="password" 
                defaultValue={currentUser.password}
                placeholder="Password"  
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-blue-600 text-white rounded-lg p-3 uppercase font-semibold hover:bg-blue-700 transition duration-300"
            >
              {loading ? "Updating..." : "Update"}
            </button>

            <Link 
              to="/create-listing"
              className="block w-full text-center bg-green-600 text-white rounded-lg p-3 uppercase font-semibold hover:bg-green-700 transition duration-300"
            >
              Create Listing
            </Link>
          </form>

          <div className="flex justify-between mt-6 text-sm text-gray-700">
            <span 
              onClick={handleDeleteUser} 
              className="cursor-pointer hover:text-red-600 transition duration-300"
            >
              Delete Account
            </span>
            <span 
              onClick={handleSignOut} 
              className="cursor-pointer hover:text-red-600 transition duration-300"
            >
              Sign Out
            </span>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
          {updateSuccess && <p className="text-green-600 mt-4">Profile updated successfully!</p>}

          <button 
            onClick={handleShowlisting} 
            className="w-full text-center text-green-600 mt-4 border border-green-600 rounded-lg p-3 uppercase font-semibold hover:bg-green-50 transition duration-300"
          >
            Show Listing
          </button>

          {showListingError && <p className="text-red-600 mt-4">{showListingError}</p>}
        </div>

        {/* Right Panel */}
        <div className="md:col-span-3 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Listings</h2>
          <div className="space-y-4">
            {userListing && userListing.length > 0 ? (
              userListing.map((listing) => (
                <div 
                  key={listing._id} 
                  className="border rounded-lg p-4 flex items-center justify-between bg-gray-50 shadow-sm"
                >
                  <Link to={`/listing/${listing._id}`} className="flex items-center space-x-4">
                    <img 
                      src={listing.imageUrls[0]} 
                      alt="listing cover" 
                      className="h-20 w-20 object-cover rounded-md border border-gray-200"
                    />
                    <p className="text-gray-700 font-semibold truncate">{listing.name}</p>
                  </Link>
                  <div className="flex space-x-4">
                    <button 
                      className="text-red-600 hover:text-red-800 transition duration-300" 
                      onClick={() => handleDeleteListing(listing._id)}
                    >
                      Delete
                    </button>
                    <Link 
                      to={`/update-listing/${listing._id}`}
                      className="text-green-600 hover:text-green-800 transition duration-300"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No listings available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
 


  )






}
