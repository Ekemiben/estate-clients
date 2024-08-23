

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState, useEffect } from 'react'
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


function EditListingPage() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls:[],
   
    name:"",
    description: "",
    address: "",
    type: "rent",
    bedrooms:1,
    bathrooms: 1,
    regularPrice: 10000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false);

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const {currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const params = useParams()

  // console.log(formData)
 
  const handleImageSubmit = (e)=>{
    if (files.length > 0 && files.length + formData.imageUrls.length < 7){
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++){
        promises.push(storageImage(files[i]));
      }
      Promise.all(promises).then((urls)=>{
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        setImageUploadError(false);
      setUploading(false);
      }).catch((err)=>{
        setImageUploadError("Image Upload fail, please upload max of 2mb per image")
        setUploading(false)
      });

     
    }else{
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  }

 useEffect(()=>{
    const fetchLising = async()=>{
        const listingid = params.updatelistingId;
        // console.log(listingid)
        const res = await fetch(`/server/listing/get/${listingid}`);
        const data = await res.json();
        if(data.success === false){
            console.log(data.message);
            return
        }
        setFormData(data)
    }
   fetchLising()
  }, [])
  const storageImage = async(file)=>{
    return new Promise((resolve, reject)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef =  ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed", 
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} % done...`);
        },
     
        (error)=>{reject(error)},
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            resolve(downloadURL)
          })
        }
       )
    })
  }





const handleRemoveImage = (index)=>{
  setFormData({
    ...formData, imageUrls: formData.imageUrls.filter((_, i)=> i !==index)
  })
}

const handleInputChange = (e)=>{
   if(e.target.id === "sale" || e.target.id === "rent"){
    setFormData({...formData, 
      type:e.target.id
    });
   }
   if(e.target.id === "parking" || e.target.id==="furnished" || e.target.id === "offer"){
    setFormData({...formData,
      [e.target.id]: e.target.checked
    })
   } 
   if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
    setFormData({...formData,
      [e.target.id]: e.target.value
    })
   }
}
  const handleFormSubmit = async(e)=>{
    e.preventDefault();
    try{
      if(formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if(+formData.regularPrice < +formData.discountPrice) return setError("Discounted price must be lower than the regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/updatelisting/update/${params.updatelistingId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      })
      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    }catch (error){
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto '>
      <h1 className=' text-3xl font-semibold text-center my-7'>Update Listing</h1>
      <form onSubmit={handleFormSubmit} className='flex flex-col sm:flex-row gap-6 mb-20'>
        <div className='flex flex-col gap-4 flex-1'>

          <input 
          type = "text"
          placeholder='Name' 
          className='border p-3 rounded-lg' 
          id='name' 
          maxLength="62" 
          minLength="10" required 
          onChange={handleInputChange}
          value={formData.name}
          />

          <textarea 
          type = "text"
          placeholder='Description' 
          className='border p-3 rounded-lg' 
          id='description'  required 
          onChange={handleInputChange}
          value={formData.description}
          />

          <input 
          type = "text"
          placeholder='Address' 
          className='border p-3 rounded-lg' 
          id='address' required 
          onChange={handleInputChange}
          value={formData.address}
          />

        <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
            <input 
            type="checkbox" 
            id='sale' 
            className='w-5' 
            onChange={handleInputChange}
            checked={formData.type === 'sale'}
            > 
            </input>
            <span>Sell</span>
          </div>

          <div className='flex gap-2'>
            <input 
            type="checkbox" 
            id='rent' 
            className='w-5' 
            onChange={handleInputChange}
            checked={formData.type === 'rent'}
            >
            </input>
            <span>Rent</span>
          </div>

          <div className='flex gap-2'>
            <input 
            type="checkbox" 
            id='parking' 
            className='w-5' 
            onChange={handleInputChange}
            checked={formData.parking}
            >
            </input>
            <span>Packing Space</span>
          </div>

          <div className='flex gap-2'>
            <input 
            type="checkbox" 
            id='furnished' 
            className='w-5'
            onChange={handleInputChange}
            checked={formData.furnished} 
            >
            </input>
            <span>Furnished</span>
          </div>

          <div className='flex gap-2'>
            <input 
            type="checkbox" 
            id='offer' 
            className='w-5' 
            onChange={handleInputChange}
            checked={formData.offer}
            ></input>
            <span>Offer</span>
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          <div className='flex items-center gap-2'>
            <input 
            type="number" 
            id='bedrooms' 
            min='1' 
            max='1000' 
            required 
            className='p-3 border border-gray-300 rounded-lg'
            onChange={handleInputChange}
            value={formData.bedrooms}
            />
            <p>Beds</p>
          </div>

          <div className='flex items-center gap-2'>
            <input 
            type="number" 
            id='bathrooms' 
            min='1' 
            max='1000' 
            required 
            className='p-3 border border-gray-300 rounded-lg'
            onChange={handleInputChange}
            value={formData.bathrooms}
            />
            <p>Bathroom</p>
          </div>

          <div className='flex items-center gap-2'>
            <input 
            type="number" 
            id='regularPrice' 
            min='1' 
            max='100000000000' 
            required 
            className='p-3 border border-gray-300 rounded-lg'
            onChange={handleInputChange}
            value={formData.regularPrice}
            />
            <div className='flex flex-col items-center'>
            <p>Regular Price</p> 
            <span className='text-xs' >($/month)</span>
            </div>
          </div>

          {formData.offer &&(
             <div className='flex items-center gap-2'>
             <input 
             type="number" 
             id='discountPrice' 
             min='0' 
             max='100000000000' 
             required 
             className='p-3 border border-gray-300 rounded-lg'
             onChange={handleInputChange}
             value={formData.discountPrice}
             />
             <div className='flex flex-col items-center'>
             <p>Discount Price</p> 
             <span className='text-xs ' >($ / month)</span>
             </div>
           </div>
          )}
         
        </div>
        </div>

        <div className='flex flex-col flex-1'>
          <p className='font-semibold'>Images: <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span></p>
          <div className=' flex gap-4'>
            <input onChange={(e)=> setFiles(e.target.files)} type='file' id="image" accept='image/*' multiple  className=' p-3 border border-gray-300 rounded w-full'/>
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading..." : "Upload"}</button>
          </div>
          <div>
        <p className='text-red-700 mt-3 mb-0 text-center'>{imageUploadError && imageUploadError }</p>
       </div>
              {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={index} className='flex justify-between p-3 border items-center'>
                <img src={url} alt='Listing Image' className='w-20 h-20 object-contain rounded-lg' />
                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
              </div>
            ))}

          <button disabled={loading ||uploading } className="p-3 mt-10 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "Updating..." : "Update Listing"}</button>
          {error && <p className=' text-red-700 text-sm'>{error}</p>}
        </div>
       
      </form>
    </main>
  )
}

export default EditListingPage

