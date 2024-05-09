import filterData from"./filterData.json"
import { FaUndoAlt,FaRedoAlt,FaPhotoVideo , FaStepBackward ,FaStepForward  } from "react-icons/fa";
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop from 'react-image-crop'
import storeData from "./LinkList";
import './App.css'
import { useState } from "react";
function App() {
  const [imgDetails, setImgDetails] = useState('');
  const [crop, setCrop] = useState({width:100, height:100});
  const [isData, setIsData] = useState(
    {
       image:'',
       brightness:100,
       grayscale:0,
       sepia:0,
       saturate:100,
       contrast : 100,
       huerotate:0,
       rotate:0,
       vertical:1,
       horizontal:1
    }
  )
// load image Started Here 
const imgHandelChange = (e)=>
  {
    if(e.target.files.length != 0)
      {
        const reader = new FileReader();
        reader.onload = ()=>
          {
            setIsData(
              {
                 ...isData,
                 image : reader.result
              }
            )

            // send data from linkList 
            const intData = 
            {
              image:reader.result,
              brightness:100,
              grayscale:0,
              sepia:0,
              saturate:100,
              contrast : 100,
              huerotate:0,
              rotate:0,
              vertical:1,
              horizontal:1
            }
            storeData.insert(intData);
          }
          reader.readAsDataURL(e.target.files[0])
      }     
  }
  // Load Image Ends Here 

  // Range Section Started Here 
  const [isSelected, setIsSelected] = useState({name:'brightness',max:'200'})

  const rangeHandelChange = (e)=>
    {
      const newData = { ...isData, [e.target.name]: e.target.value };
      setIsData(newData)
      storeData.insert(newData)
      
    }
// Range Section End Here 

// Rotate and Flips Section Started Here 
const leftRotate = ()=>
  {
    setIsData(
      {
        ...isData,
        rotate : isData.rotate - 90
      }
    )
    const data = isData;
    data.rotate = isData.rotate - 90;
    storeData.insert(data)
  }
const rightRotate = ()=>
  {
    setIsData(
      {
        ...isData,
        rotate : isData.rotate + 90
      }
    )
    const data = isData;
    data.rotate = isData.rotate + 90;
    storeData.insert(data)
  }

const verticalFlip = ()=>
  {
    setIsData(
      {
        ...isData,
        vertical: isData.vertical === 1 ? -1 : 1 
      }
    )
    const data = isData;
    data.vertical =  isData.vertical === 1 ? -1 : 1 ;
    storeData.insert(data)
  }
const horizontalFlip = ()=>
  {
    setIsData(
      {
        ...isData,
        horizontal: isData.horizontal === 1 ? -1 : 1 
      }
    )
    const data = isData;
    data.horizontal =  isData.horizontal === 1 ? -1 : 1 ;
    storeData.insert(data)
  }
// Rotate and Flips Section End Here

// Crop Image Section Started Here 
const cropImg = ()=>
  {

    const canvas = document.createElement('canvas');
    const scaleX = imgDetails.naturalWidth / imgDetails.width;
    const scaleY = imgDetails.naturalHeight / imgDetails.height
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgDetails,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Url = canvas.toDataURL('image/jpeg');
    const newData = {...isData, image:base64Url}
    setIsData(newData);
    storeData.insert(newData)

  }
// Crop Image Section End Here 



// Save Image Section Started Here 
const saveImage = ()=>
  {
    const canvas = document.createElement('canvas');
    canvas.width = imgDetails.naturalHeight;
    canvas.height = imgDetails.naturalHeight;
    const ctx = canvas.getContext('2d');

    ctx.filter = `
      brightness(${isData.brightness}%)
      grayscale(${isData.grayscale}%)
      sepia(${isData.sepia}%)
      saturate(${isData.saturate}%)
      contrast(${isData.contrast}%)
      hue-rotate(${isData.huerotate}deg)    
    `;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((isData.rotate * Math.PI) / 180);
    ctx.scale(isData.vertical, isData.horizontal);

    ctx.drawImage(
      imgDetails,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    const link = document.createElement('a');
    link.download = "image_edit.jpg";
    link.href = canvas.toDataURL();
    link.click();

  }
// Save Image Section End Here 

// Reset Edit Section Started Here 
const resetEdit = ()=>
  {
     setIsData(
      {         
        ...isData,
        brightness:100,
        grayscale:0,
        sepia:0,
        saturate:100,
        contrast : 100,
        huerotate:0,
        rotate:0,
        vertical:1,
        horizontal:1
      }
     )
      setIsSelected({name:'brightness',max:'200'})

  }

  // Redo Section Started Here 
 const redo = ()=>
  {
      const data = storeData.redoEdit();
      if(data)
        {
          setIsData(data)
        }
  }

  // Undo Section Started Here 
  const undo = ()=>
    {
      const data = storeData.undoEdit();
      if(data)
        {
          setIsData(data)
        }
    }

  // custom size image 

  const handelSize = (e)=>
    {
      if(e.target.name === "width")
        {
          setCrop({...crop, width:e.target.value })
        }
      else if(e.target.name === "height")
      {
        setCrop({...crop, height:e.target.value })
      }
    }

  return (
    <>
      <div className="img-editor-container">
          <div className="img-editor">
             <h1>------ IMAGE EDITOR ------</h1>
            <div className="img-controller">
              <div className="filter">
                   <h5 style={{color:"rgb(21, 53, 122)"}}>Filter</h5>
                   <div className="filter-btns">
                      {
                        filterData && filterData.map((data,index)=>
                        {
                          return(
                            <button className={isSelected.name === data.name ? "active-btn":''} key={index} onClick={()=> setIsSelected(data)}>
                              {data.name}
                            </button>
                          )
                        })
                      }
                      <div className="range-indicator mt-1">
                         <h6 style={{textTransform:"capitalize"}}>{isSelected.name}</h6>
                         <h6>100%</h6>
                      </div>
                      <input
                          type="range" 
                          name={isSelected.name} 
                          value={isData[isSelected.name]}
                          max={isSelected.max}
                          onChange={rangeHandelChange}
                       />

                      <h6 style={{textAlign:"left"}} className="mt-1">Rotate & Flip</h6>
                      <div className="edit-icon">
                         <span onClick={()=> leftRotate()}><FaUndoAlt /></span>
                         <span onClick={()=> rightRotate()}><FaRedoAlt/></span>
                         <span onClick={()=> verticalFlip()}><FaStepBackward/></span>
                         <span onClick={()=> horizontalFlip()}><FaStepForward/></span>
                      </div>
                  </div>
                  <div className="reset-save-btn mt-3">
                     <button style={{backgroundColor:"#FF5733", color:"white"}} onClick={()=> resetEdit()}>Reset</button>  
                     <button style={{backgroundColor:"#00AFFF", color:"white"}} onClick={()=> saveImage()}>Save Image</button>
                  </div>      
              </div>
              <div className="edit-img">
                 <div className="img-section">
                 { isData.image ?                
                  <div className="img p-2">
                     <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                      <img 
                            src={isData.image} alt=""
                            style={{
                                filter: 
                                `
                                  brightness(${isData.brightness}%)
                                  grayscale(${isData.grayscale}%)
                                  sepia(${isData.sepia}%)
                                  saturate(${isData.saturate}%)
                                  contrast(${isData.contrast}%)
                                  hue-rotate(${isData.huerotate}deg)
                                  
                                `,
                                transform:
                                `
                                  rotate(${isData.rotate}deg)
                                  scale(${isData.vertical},${isData.horizontal})
                                `,
                                backgroundColor: "transparent"
                            }}
                            onLoad={(e)=> setImgDetails(e.currentTarget)}
                        />
                    </ReactCrop>                  
                  </div>
                 :
                  <div className="">
                      <label htmlFor="choose" className="">
                        <FaPhotoVideo style={{fontSize:"35px", opacity:".50"}}/>
                      </label> <br />
                     <label  htmlFor="choose" style={{opacity:".50"}}>Choose Image</label>
                  </div>
                  }
                 </div>
                 <div className="img-select mt-3">
                    <button  onClick={()=> undo()}><FaUndoAlt/></button>
                    <button onClick={()=> redo()}><FaRedoAlt/></button>
                     {crop ? <label className="me-3" style={{backgroundColor:"#15357A", color:"white"}} onClick={()=> cropImg()}>Crop Image</label>:''}
                    <label htmlFor="choose" style={{backgroundColor:"#217BF9", color:"white"}}>Choose Image</label>
                   
                    <input type="file" name="" id="choose" style={{display:"none"}} onChange={imgHandelChange}/>
                 </div>

                 <p className="mt-3 text-secondary" style={{fontWeight:"500"}}>Define the new size of your image (Px)</p>
                 <div className="custom-size ">
                    <div className="form-group">
                        <input type="number" name="width" className="form-control" placeholder="Width" onChange={handelSize} disabled={!isData.image} value={crop.width}/>
                    </div>
                    <h4 style={{color:"#15357A"}}>X</h4>
                    <div className="form-group">
                        <input type="number" name="height" className="form-control" placeholder="Height" onChange={handelSize} disabled={!isData.image} value={crop.height}/>
                    </div>
                 </div>
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default App
