import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from './config';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'
import './Components/ImageUpload.css'
import { MdCancel } from "react-icons/md";

function Addproducts() {

  let navigation = useNavigate()
  let [catgorys, setCatgrys] = useState([])
  let [images, setImages] = useState([])
  let [errormsg, setErrorMsg] = useState("")

  const [categoeryid, setCatId] = useState("")
  const [pname, setPname] = useState("")
  const [model, setModel] = useState("")
  const [price, setPrice] = useState("")


  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length + images.length > 5) {
      setErrorMsg("5 Image Only")
      return;
    }
    setErrorMsg("")
    let fileUrl = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    // console.log(fileUrl)
    setImages((exitingimgs) => [...exitingimgs, ...fileUrl])
  }





  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: 'Image/*'
  })

  const imgCnclHandler = (index) => {
    let remaingimages = images.filter((_, i) => i != index)
    setImages(remaingimages)
  }

  let getcategoryList = async () => {
    let response = await fetch(`${API_BASE_URL}/category`)
    let result = await response.json()
    setCatgrys(result)
  }
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigation('/');
    }
    getcategoryList()
  }, [])

  let submitHnalder = async () => {
    const formHandler = new FormData()

    images.map((img) => {
      formHandler.append("images", img.file)
    })
    formHandler.append("categoeryid", categoeryid)
    formHandler.append("pname", pname)
    formHandler.append("model", model)
    formHandler.append("price", price)

    const response = await fetch(`${API_BASE_URL}/addProducts`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: formHandler
    });
    let result = await response.json()

    if (response.status != 200) {
      navigation('/')
    }
    else {
      setCatgrys("")
      setImages([])
      setPname("")
      setModel("")
      setPrice("")
      alert(result.message)
    }

  }
  return (
    <div>



      <div className="container mt-5 p-1">
        <div className="row ">


          <div className="card shadow-lg p-4 rounded">
            <h2 className="text-center mb-4">Add Products </h2>
            <hr />
            <div className="col-md-12">

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3 position-relative">
                    <select onChange={(e) => setCatId(e.target.value)} name="" id="" className='form-control'>
                      <option value="-1">Select</option>
                      {
                        catgorys.map(data => <option value={data.catgoeryid}>{data.categoeryname}</option>)
                      }
                    </select>
                  </div>

                  <div className="mb-3 position-relative">
                    <input

                      type="text"
                      className="form-control form-control-lg rounded-3"
                      id="productname"
                      name="productname"
                      onChange={(e) => setPname(e.target.value)}
                      value={pname}
                      required
                      placeholder="Product Name "
                    />

                  </div>


                  <div className="mb-3 position-relative">
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      id="model"
                      name="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                      placeholder="Model "
                    />
                  </div>


                  <div className="mb-3 position-relative">
                    <input
                      type="number"
                      className="form-control form-control-lg rounded-3"
                      id="price"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="Price "
                    />

                  </div>

                </div>
                <div className='col-lg-6'>
                  <div {...getRootProps()} className='drag-box'>
                    <input {...getInputProps()} />


                    <p>Drop the files here ...</p>
                    <p>Drag 'n' drop some files here, or click to select files</p>

                  </div>
                  <div className='image-thumbnails'>

                    {
                      images.map((img, index) => {
                        return <div className="thumbnail" >
                          <img src={img.preview} className="thumbnail-image"></img>
                          <button
                            className="cancel-btn"
                            onClick={() => imgCnclHandler(index)}

                          >
                            <MdCancel />
                          </button>
                        </div>
                      })
                    }
                  </div>
                  {errormsg && <div>{errormsg}</div>}
                </div>





              </div>

              <div className='mx-auto w-50'>
                <button onClick={submitHnalder} type="submit" className="btn btn-primary w-100 mx-auto btn-lg rounded-3">
                  Register
                </button>
              </div>



            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Addproducts
