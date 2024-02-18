import { useEffect, useRef, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './index.css';
import * as tf from '@tensorflow/tfjs';
import Card from './PredictionCard';
import Loading from './assets/loading-wtf.gif';

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);

  const [imageResult, setImageResult] = useState([]);

  const imageRef = useRef();

  async function loadModel() {
    setIsModelLoading(true);
    try {
      await tf.setBackend('webgl');
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
      console.log("Model Load Successfully");
    } catch(error) {
      setIsModelLoading(false);
      console.log("Model Failed To Load ", error);
    }
  }

  useEffect(() => {
    loadModel();
  }, []);


  if(isModelLoading) {
    return (
      <div className='w-full h-screen flex-col flex justify-center items-center'>
        
        <div className='flex flex-col justify-center items-center gap-2'>
          <img className='rounded-full w-20' src={Loading} alt={Loading} />
          <h1 className='font-bold text-[20px]'>Doggoo<span className='text-indigo-600'>Vision</span></h1>
        </div>
        
        <h1 className='text-[15px] absolute bottom-10'>Made with ❤️‍🔥 by John Florence Batol </h1>
      </div>
    )
  }

  const uploadImage = (e) => {
    const { files } = e.target;
    if(files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    }
    else {
      setImageUrl(null);
    }
  }

  const uploadInternetImage = (e) => {
    const { value } = e.target;

    if(value.length > 0) {
      setImageUrl(value);
    }
    else {
      setImageUrl(null);
    }
  }

  const identifyImage = async () => {
    const results = await model.classify(imageRef.current);
    console.log(results);
    setImageResult(results);
  }

  return (
    <div>
      <h1 className='font-bold text-[20px] text-white bg-indigo-700 p-4 text-center'>DoggoVision</h1>
      
      <div className='p-4 flex justify-center items-center'>

        <div className='w-[70%] max-md:w-[90%] max-sm:w-full'>
            <div className='mb-4'>
              <h1 className='font-bold mb-2'>Upload your image here: </h1>
              <div className='flex justify-start items-center w-full max-sm:flex-col gap-4 max-sm:items-start'>
                <div className='flex flex-col w-[50%] max-sm:w-full'>
                    <p>Device Image:</p>
                    <input type="file" accept='image/*' capture="camera" className='w-full border-2 pr-10' onChange={uploadImage}/>
                </div>
                <h1 className='text-gray-600 text-nowrap'>- OR -</h1>
                <div className='flex flex-col w-full'>
                    <p>Image URL:</p>
                    <input type="text" placeholder='https://your_image.png' className='border-2  pl-4 pr-6 py-[5px] w-full' onChange={uploadInternetImage}/>
                </div>

              </div>
            </div>

            <div className='max-sm:w-full flex justify-center items-center flex-col'>

              <div className='flex gap-10 justify-center item-center w-[100%] max-sm:w-full max-lg:flex-col max-lg:gap-2'>
                <div className='h-[500px] w-[100%] border-2 overflow-hidden'>
                  {imageUrl ? <img className='object-cover h-full w-full' src={imageUrl} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef}/> : <img className='object-cover h-full w-full' src="https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"/>}
                </div>
            
                <div>
                  {imageResult.map(result => (
                    <Card key={result.className} name={result.className} probability={result.probability}/>
                  ))}
                </div>
              </div>

              <div className='w-[100%] max-sm:w-full flex justify-normal items-start'>
                {imageUrl && <button className='bg-indigo-700 text-white px-10 py-2 mt-4' onClick={identifyImage}>Identify Image</button>} 
              </div>
              
            </div>
          </div>

      </div>
    </div>
  )
}

export default App
