// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom";


// const Contact = ({listing}) => {
//   const [landlord, setLandlord] = useState(null);
//   const [message, setMessage] = useState('');
  


//   const onChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const subject = encodeURIComponent(`Regarding ${listing.name}`);
//   const body = encodeURIComponent(message);

//   useEffect(()=>{
//     const fetchLandlord = async()=>{
//     try {
//       const res = await fetch(`/server/user/${listing.userRef}`);
//       const data = await res.json();
//       setLandlord(data)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   fetchLandlord();
    
//   },[listing.userRef])




//   return (
//     <>
//     {landlord && (
//       <div className='flex flex-col gap-2'>
//         <p>
//           Contact <span className='font-semibold'>{landlord.username}</span>{' '}
//           for{' '}
//           <span className='font-semibold'>{listing.name.toLowerCase()}</span>
//         </p>
//         <textarea
//           name='message'
//           id='message'
//           rows='2'
//           value={message}
//           onChange={onChange}
//           placeholder='Enter your message here...'
//           className='w-full border p-3 rounded-lg'
//         ></textarea>

        

//         {/* <Link
//           to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
//           className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
//           >
//             Send Message          
//           </Link> */}

//         <Link
//             to={`mailto:${landlord.email}?subject=${subject}&body=${body}`}
//             className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
//           >
//             Send Message
//           </Link>
//       </div>
//     )}
//   </>
//   )
// }

// export default Contact










// import { useEffect, useState } from "react";

// const Contact = ({ listing }) => {
//   const [landlord, setLandlord] = useState(null);
//   const [message, setMessage] = useState('');

//   const onChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const subject = encodeURIComponent(`Regarding ${listing.name}`);
//   const body = encodeURIComponent(message);

//   useEffect(() => {
//     const fetchLandlord = async () => {
//       try {
//         const res = await fetch(`/server/user/${listing.userRef}`);
//         const data = await res.json();
//         setLandlord(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchLandlord();
//   }, [listing.userRef]);

//   return (
//     <>
//       {landlord && (
//         <div className='flex flex-col gap-2'>
//           <p>
//             Contact <span className='font-semibold'>{landlord.username}</span>{' '}
//             for{' '}
//             <span className='font-semibold'>{listing.name.toLowerCase()}</span>
//           </p>
//           <textarea
//             name='message'
//             id='message'
//             rows='2'
//             value={message}
//             onChange={onChange}
//             placeholder='Enter your message here...'
//             className='w-full border p-3 rounded-lg'
//           ></textarea>

//           <a
//             href={`mailto:${landlord.email}?subject=${subject}&body=${body}`}
//             className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
//           >
//             Send Message
//           </a>
//         </div>
//       )}
//     </>
//   );
// };

// export default Contact;







import { useEffect, useState } from "react";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/server/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  if (!landlord) {
    return null; // Optionally handle loading state or error state
  }

  // Encode the subject and body properly
  const subject = encodeURIComponent(`Regarding ${listing.name}`);
  const body = encodeURIComponent(message);
  const mailtoLink = `mailto:${landlord.email}?subject=${subject}&body=${body}`;

  return (
    <div className='flex flex-col gap-2'>
      <p>
        Contact <span className='font-semibold'>{landlord.username}</span>{' '}
        for{' '}
        <span className='font-semibold'>{listing.name.toLowerCase()}</span>
      </p>
      <textarea
        name='message'
        id='message'
        rows='2'
        value={message}
        onChange={onChange}
        placeholder='Enter your message here...'
        className='w-full border p-3 rounded-lg'
      ></textarea>

      <a
        href={mailtoLink}
        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
        onClick={(e) => {
          // Ensure that clicking the link doesn't cause unexpected behavior
          if (!landlord.email) {
            e.preventDefault();
            alert('Email address not available.');
          }
        }}
      >
        Send Message
      </a>
    </div>
  );
};

export default Contact;


